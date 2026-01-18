"""
Search service - hybrid full-text + vector search (advanced).

Features:
- BM25 full-text search
- Vector semantic search
- Reciprocal Rank Fusion (RRF)
- Query Expansion
- LLM reranking
"""
import logging
import re
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy import text

from models import db, Source

logger = logging.getLogger(__name__)

# RRF parameters
RRF_K = 60  # RRF constant controlling tail impact


class SearchService:
    """Search service supporting full-text and hybrid search."""

    def __init__(self):
        self._fts_initialized = False

    def init_fts(self):
        """Initialize the full-text search virtual table."""
        if self._fts_initialized:
            return

        try:
            # Create FTS5 virtual table
            db.session.execute(text("""
                CREATE VIRTUAL TABLE IF NOT EXISTS sources_fts USING fts5(
                    source_id,
                    name,
                    content,
                    tokenize='unicode61'
                )
            """))
            db.session.commit()
            self._fts_initialized = True
            logger.info("FTS5 full-text index initialized")
        except Exception as e:
            logger.warning(f"FTS5 initialization failed (may already exist): {e}")
            self._fts_initialized = True

    def index_source(self, source: Source):
        """Add a source to the full-text index."""
        self.init_fts()

        try:
            # Remove old index first
            db.session.execute(
                text("DELETE FROM sources_fts WHERE source_id = :source_id"),
                {"source_id": source.id}
            )

            # Insert index
            db.session.execute(
                text("""
                    INSERT INTO sources_fts (source_id, name, content)
                    VALUES (:source_id, :name, :content)
                """),
                {
                    "source_id": source.id,
                    "name": source.name,
                    "content": source.content or ""
                }
            )
            db.session.commit()
            logger.info(f"Source {source.id} added to full-text index")
        except Exception as e:
            logger.error(f"Failed to index source: {e}")
            db.session.rollback()

    def remove_source_index(self, source_id: str):
        """Remove a source from the full-text index."""
        try:
            db.session.execute(
                text("DELETE FROM sources_fts WHERE source_id = :source_id"),
                {"source_id": source_id}
            )
            db.session.commit()
        except Exception as e:
            logger.error(f"Failed to remove index: {e}")

    def fulltext_search(
        self,
        query: str,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Full-text search.

        Args:
            query: search keywords
            source_ids: limit to source IDs
            notebook_id: limit to notebook ID
            limit: max results

        Returns:
            Search result list
        """
        self.init_fts()

        # Prepare search terms (supports CJK)
        search_terms = self._prepare_search_query(query)
        if not search_terms:
            return []

        try:
            # Base FTS query
            sql = """
                SELECT
                    source_id,
                    snippet(sources_fts, 2, '<mark>', '</mark>', '...', 64) as snippet,
                    bm25(sources_fts) as score
                FROM sources_fts
                WHERE sources_fts MATCH :query
            """

            params = {"query": search_terms, "limit": limit}

            # Apply source filter
            if source_ids:
                placeholders = ",".join([f":sid{i}" for i in range(len(source_ids))])
                sql += f" AND source_id IN ({placeholders})"
                for i, sid in enumerate(source_ids):
                    params[f"sid{i}"] = sid

            sql += " ORDER BY score LIMIT :limit"

            result = db.session.execute(text(sql), params)
            rows = result.fetchall()

            # Build results
            results = []
            for row in rows:
                source = Source.query.get(row[0])
                if source:
                    # Filter by notebook_id when provided
                    if notebook_id and source.notebook_id != notebook_id:
                        continue

                    results.append({
                        "source_id": source.id,
                        "source_name": source.name,
                        "source_type": source.type,
                        "snippet": row[1],
                        "score": abs(row[2]),  # bm25 returns negative scores
                        "search_type": "fulltext"
                    })

            return results

        except Exception as e:
            logger.error(f"Full-text search failed: {e}")
            return []

    def _prepare_search_query(self, query: str) -> str:
        """Prepare FTS5 search query."""
        # Remove special characters
        query = re.sub(r'[^\w\s\u4e00-\u9fff]', ' ', query)
        terms = query.split()

        if not terms:
            return ""

        # Join terms with OR
        return " OR ".join(terms)

    def hybrid_search(
        self,
        query: str,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        top_k: int = 10,
        fulltext_weight: float = 0.3,
        vector_weight: float = 0.7,
        use_rrf: bool = True,
        use_query_expansion: bool = False,
        use_reranking: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Hybrid search combining full-text and vector search.

        Args:
            query: search query
            source_ids: limit to source IDs
            notebook_id: limit to notebook ID
            top_k: number of results
            fulltext_weight: weight for full-text (non-RRF)
            vector_weight: weight for vector search (non-RRF)
            use_rrf: use Reciprocal Rank Fusion (recommended)
            use_query_expansion: use query expansion
            use_reranking: use LLM reranking

        Returns:
            Merged search results
        """
        from .rag_service import get_rag_service

        # Query expansion
        expanded_queries = [query]
        if use_query_expansion:
            expanded_queries = self._expand_query(query)
            logger.info(f"Query expansion: {query} -> {expanded_queries}")

        all_fulltext_results = []
        all_vector_results = []

        # Run search for each expanded query
        for q in expanded_queries:
            # Full-text search
            ft_results = self.fulltext_search(
                q, source_ids, notebook_id, limit=top_k * 2
            )
            all_fulltext_results.extend(ft_results)

            # Vector search
            rag_service = get_rag_service()
            vec_results = rag_service.retrieve(
                q, source_ids, notebook_id, top_k=top_k * 2
            )
            all_vector_results.extend(vec_results)

        # Deduplicate and keep best results
        fulltext_results = self._deduplicate_results(all_fulltext_results, key="source_id")
        vector_results = self._deduplicate_vector_results(all_vector_results)

        # Merge results using selected algorithm
        if use_rrf:
            merged_results = self._rrf_fusion(fulltext_results, vector_results, top_k)
        else:
            merged_results = self._weighted_fusion(
                fulltext_results, vector_results,
                fulltext_weight, vector_weight, top_k
            )

        # LLM reranking
        if use_reranking and merged_results:
            merged_results = self._rerank_results(query, merged_results, top_k)

        return merged_results

    def _expand_query(self, query: str) -> List[str]:
        """
        Query expansion using LLM to generate variants.

        Args:
            query: original query

        Returns:
            Expanded query list (including original)
        """
        from .ai_service_manager import get_ai_service

        try:
            ai_service = get_ai_service()
            prompt = f"""Generate 2-3 semantically similar variants for the search query below to broaden search.

Original query: {query}

Requirements:
1. Keep the same search intent
2. Use different wording
3. Include synonyms or related terms

Return a JSON array only, for example:
["Variant 1", "Variant 2", "Variant 3"]"""

            result = ai_service.generate_json(prompt)
            if isinstance(result, list):
                return [query] + result[:3]  # Original query + up to 3 variants
        except Exception as e:
            logger.warning(f"Query expansion failed: {e}")

        return [query]

    def _rrf_fusion(
        self,
        fulltext_results: List[Dict],
        vector_results: List[Tuple],
        top_k: int
    ) -> List[Dict[str, Any]]:
        """
        Reciprocal Rank Fusion (RRF).

        RRF score = Σ 1/(k + rank_i)
        where k is a constant (usually 60), and rank_i is the rank in list i.

        Benefits:
        - No score normalization required
        - More robust to outliers
        - Balances contributions across search methods
        """
        rrf_scores = {}

        # RRF scores for full-text results
        for rank, r in enumerate(fulltext_results, 1):
            source_id = r["source_id"]
            rrf_score = 1.0 / (RRF_K + rank)

            if source_id not in rrf_scores:
                rrf_scores[source_id] = {
                    "source_id": source_id,
                    "source_name": r["source_name"],
                    "source_type": r.get("source_type", "unknown"),
                    "snippet": r["snippet"],
                    "rrf_score": rrf_score,
                    "fulltext_rank": rank,
                    "vector_rank": 999,
                    "fulltext_score": r.get("score", 0),
                    "vector_score": 0
                }
            else:
                rrf_scores[source_id]["rrf_score"] += rrf_score
                rrf_scores[source_id]["fulltext_rank"] = rank
                rrf_scores[source_id]["fulltext_score"] = r.get("score", 0)

        # RRF scores for vector results
        for rank, item in enumerate(vector_results, 1):
            chunk_text, similarity, source_id, source_name = item
            rrf_score = 1.0 / (RRF_K + rank)

            if source_id not in rrf_scores:
                source = Source.query.get(source_id)
                rrf_scores[source_id] = {
                    "source_id": source_id,
                    "source_name": source_name,
                    "source_type": source.type if source else "unknown",
                    "snippet": chunk_text[:300] + "..." if len(chunk_text) > 300 else chunk_text,
                    "rrf_score": rrf_score,
                    "fulltext_rank": 999,
                    "vector_rank": rank,
                    "fulltext_score": 0,
                    "vector_score": similarity
                }
            else:
                rrf_scores[source_id]["rrf_score"] += rrf_score
                rrf_scores[source_id]["vector_rank"] = rank
                rrf_scores[source_id]["vector_score"] = similarity
                # If vector snippet is longer/more complete, update snippet
                if similarity > 0.6:
                    rrf_scores[source_id]["snippet"] = chunk_text[:300] + "..." if len(chunk_text) > 300 else chunk_text

        # Sort by RRF score
        sorted_results = sorted(
            rrf_scores.values(),
            key=lambda x: x["rrf_score"],
            reverse=True
        )[:top_k]

        # Add hybrid score field (compatibility)
        for r in sorted_results:
            r["hybrid_score"] = r["rrf_score"]

        return sorted_results

    def _weighted_fusion(
        self,
        fulltext_results: List[Dict],
        vector_results: List[Tuple],
        fulltext_weight: float,
        vector_weight: float,
        top_k: int
    ) -> List[Dict[str, Any]]:
        """Weighted fusion algorithm (legacy)."""
        merged = {}

        # Process full-text results
        for i, r in enumerate(fulltext_results):
            key = r["source_id"]
            if key not in merged:
                merged[key] = {
                    "source_id": r["source_id"],
                    "source_name": r["source_name"],
                    "source_type": r.get("source_type", "unknown"),
                    "snippet": r["snippet"],
                    "fulltext_score": r["score"],
                    "fulltext_rank": i + 1,
                    "vector_score": 0,
                    "vector_rank": 999
                }
            else:
                merged[key]["fulltext_score"] = r["score"]
                merged[key]["fulltext_rank"] = i + 1

        # Process vector results
        for i, (chunk_text, similarity, source_id, source_name) in enumerate(vector_results):
            if source_id not in merged:
                source = Source.query.get(source_id)
                merged[source_id] = {
                    "source_id": source_id,
                    "source_name": source_name,
                    "source_type": source.type if source else "unknown",
                    "snippet": chunk_text[:200] + "..." if len(chunk_text) > 200 else chunk_text,
                    "fulltext_score": 0,
                    "fulltext_rank": 999,
                    "vector_score": similarity,
                    "vector_rank": i + 1
                }
            else:
                merged[source_id]["vector_score"] = similarity
                merged[source_id]["vector_rank"] = i + 1
                if similarity > 0.7:
                    merged[source_id]["snippet"] = chunk_text[:200] + "..." if len(chunk_text) > 200 else chunk_text

        # Compute hybrid score
        max_fulltext = max([r.get("fulltext_score", 0) for r in merged.values()]) or 1
        max_vector = max([r.get("vector_score", 0) for r in merged.values()]) or 1

        for r in merged.values():
            normalized_ft = r.get("fulltext_score", 0) / max_fulltext
            normalized_vec = r.get("vector_score", 0) / max_vector
            r["hybrid_score"] = (
                fulltext_weight * normalized_ft +
                vector_weight * normalized_vec
            )

        sorted_results = sorted(
            merged.values(),
            key=lambda x: x["hybrid_score"],
            reverse=True
        )[:top_k]

        return sorted_results

    def _rerank_results(
        self,
        query: str,
        results: List[Dict],
        top_k: int
    ) -> List[Dict[str, Any]]:
        """
        Rerank results with LLM.

        Args:
            query: original query
            results: initial results
            top_k: number of results

        Returns:
            Reranked results
        """
        from .ai_service_manager import get_ai_service

        if not results:
            return results

        try:
            ai_service = get_ai_service()

            # Prepare document list
            docs_text = ""
            for i, r in enumerate(results[:15]):  # Up to 15 results
                snippet = r.get("snippet", "")[:200]
                docs_text += f"[{i}] {r.get('source_name', 'Unknown')}: {snippet}\n\n"

            prompt = f"""Rerank the results below by relevance to the query.

Query: {query}

Results:
{docs_text}

Return a JSON array of document indexes from most to least relevant.
Return indexes only, for example: [2, 0, 5, 1, 3]

Criteria:
1. Semantic relevance to the query
2. Completeness and accuracy
3. Specificity of content"""

            reranked_indices = ai_service.generate_json(prompt)

            if isinstance(reranked_indices, list):
                # Rebuild ordering based on rerank
                reranked_results = []
                seen = set()
                for idx in reranked_indices:
                    if isinstance(idx, int) and 0 <= idx < len(results) and idx not in seen:
                        result = results[idx].copy()
                        result["rerank_position"] = len(reranked_results) + 1
                        reranked_results.append(result)
                        seen.add(idx)

                # Append any results not reranked
                for i, r in enumerate(results):
                    if i not in seen:
                        reranked_results.append(r)

                logger.info("LLM reranking complete; order updated")
                return reranked_results[:top_k]

        except Exception as e:
            logger.warning(f"LLM reranking failed: {e}")

        return results[:top_k]

    def _deduplicate_results(
        self,
        results: List[Dict],
        key: str = "source_id"
    ) -> List[Dict]:
        """Deduplicate and keep highest score."""
        seen = {}
        for r in results:
            k = r.get(key)
            if k not in seen or r.get("score", 0) > seen[k].get("score", 0):
                seen[k] = r
        return list(seen.values())

    def _deduplicate_vector_results(
        self,
        results: List[Tuple]
    ) -> List[Tuple]:
        """Deduplicate vector search results."""
        seen = {}
        for item in results:
            chunk_text, similarity, source_id, source_name = item
            if source_id not in seen or similarity > seen[source_id][1]:
                seen[source_id] = item
        return list(seen.values())

    def reindex_all(self, notebook_id: Optional[str] = None):
        """Rebuild full-text index for all sources."""
        self.init_fts()

        query = Source.query
        if notebook_id:
            query = query.filter_by(notebook_id=notebook_id)

        sources = query.all()
        count = 0

        for source in sources:
            try:
                self.index_source(source)
                count += 1
            except Exception as e:
                logger.error(f"Failed to index source {source.id}: {e}")

        logger.info(f"Rebuilt full-text index for {count} sources")
        return count


# Global instance
_search_service: Optional[SearchService] = None


def get_search_service() -> SearchService:
    """Get search service instance."""
    global _search_service
    if _search_service is None:
        _search_service = SearchService()
    return _search_service
