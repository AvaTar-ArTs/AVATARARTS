"""
RAG (Retrieval-Augmented Generation) service.
"""
import logging
from typing import List, Tuple, Optional
import numpy as np

from models import db, Source, Embedding
from .ai_service_manager import get_ai_service
from config import get_config

logger = logging.getLogger(__name__)


class RAGService:
    """RAG service."""

    def __init__(self):
        config = get_config()
        self.chunk_size = config.CHUNK_SIZE
        self.chunk_overlap = config.CHUNK_OVERLAP
        self.top_k = config.TOP_K_RESULTS

    def process_source(self, source: Source) -> List[Embedding]:
        """
        Process a source and build embeddings.

        Args:
            source: Source object

        Returns:
            Embedding list
        """
        ai_service = get_ai_service()

        # 1. Split text
        chunks = self._split_text(source.content)
        logger.info(f"Source {source.id} split into {len(chunks)} chunks")

        # 2. Build embeddings
        embeddings = []
        for i, chunk in enumerate(chunks):
            try:
                vector = ai_service.get_embedding(chunk)
                embedding = Embedding(
                    source_id=source.id,
                    chunk_index=i,
                    chunk_text=chunk,
                    embedding=np.array(vector, dtype=np.float32).tobytes()
                )
                embeddings.append(embedding)
            except Exception as e:
                logger.error(f"Chunk {i} embedding generation failed: {e}")
                continue

        # 3. Store in database
        if embeddings:
            db.session.add_all(embeddings)
            db.session.commit()
            logger.info(f"Stored {len(embeddings)} embeddings")

        return embeddings

    def retrieve(
        self,
        query: str,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        top_k: Optional[int] = None
    ) -> List[Tuple[str, float, str, str]]:
        """
        Retrieve relevant text chunks.

        Args:
            query: search query
            source_ids: specific source IDs (optional)
            notebook_id: notebook ID (used when source_ids is empty)
            top_k: number of results

        Returns:
            List of (chunk text, similarity, source ID, source name)
        """
        ai_service = get_ai_service()
        top_k = top_k or self.top_k

        # 1. Get query vector
        query_vector = np.array(ai_service.get_embedding(query), dtype=np.float32)

        # 2. Query embeddings
        query_obj = Embedding.query

        if source_ids:
            query_obj = query_obj.filter(Embedding.source_id.in_(source_ids))
        elif notebook_id:
            # Get all source IDs for notebook
            sources = Source.query.filter_by(notebook_id=notebook_id).all()
            source_id_list = [s.id for s in sources]
            if source_id_list:
                query_obj = query_obj.filter(Embedding.source_id.in_(source_id_list))
            else:
                return []

        embeddings = query_obj.all()

        if not embeddings:
            logger.warning("No embeddings found")
            return []

        # 3. Compute similarity
        results = []
        for emb in embeddings:
            emb_vector = np.frombuffer(emb.embedding, dtype=np.float32)
            similarity = self._cosine_similarity(query_vector, emb_vector)

            # Get source name
            source = Source.query.get(emb.source_id)
            source_name = source.name if source else "Unknown source"

            results.append((emb.chunk_text, similarity, emb.source_id, source_name))

        # 4. Sort and return top_k
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def build_context(
        self,
        query: str,
        source_ids: Optional[List[str]] = None,
        notebook_id: Optional[str] = None,
        top_k: Optional[int] = None
    ) -> Tuple[str, List[dict]]:
        """
        Build RAG context.

        Args:
            query: search query
            source_ids: specific source IDs
            notebook_id: notebook ID
            top_k: number of results

        Returns:
            (context text, source references)
        """
        results = self.retrieve(query, source_ids, notebook_id, top_k)

        if not results:
            return "", []

        # Build context
        context_parts = []
        source_refs = []

        for i, (chunk_text, similarity, source_id, source_name) in enumerate(results):
            context_parts.append(f"[Source {i+1}: {source_name}]\n{chunk_text}")
            source_refs.append({
                "source_id": source_id,
                "source_name": source_name,
                "chunk_text": chunk_text[:200] + "..." if len(chunk_text) > 200 else chunk_text,
                "similarity": float(similarity)
            })

        context = "\n\n---\n\n".join(context_parts)
        return context, source_refs

    def _split_text(self, text: str) -> List[str]:
        """
        Split text into overlapping chunks.

        Args:
            text: raw text

        Returns:
            List of text chunks
        """
        if not text:
            return []

        chunks = []
        start = 0

        while start < len(text):
            end = start + self.chunk_size

            # Try to break on punctuation or newlines
            if end < len(text):
                # Find nearest break point
                break_points = [
                    text.rfind('。', start, end),
                    text.rfind('\n', start, end),
                    text.rfind('. ', start, end),
                    text.rfind('！', start, end),
                    text.rfind('？', start, end),
                ]
                best_break = max(break_points)
                if best_break > start + self.chunk_size // 2:
                    end = best_break + 1

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            start = end - self.chunk_overlap

        return chunks

    @staticmethod
    def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        """Compute cosine similarity."""
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))

    def delete_source_embeddings(self, source_id: str):
        """Delete all embeddings for a source."""
        Embedding.query.filter_by(source_id=source_id).delete()
        db.session.commit()
        logger.info(f"Deleted all embeddings for source {source_id}")


# Global instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    """Get RAG service instance."""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
