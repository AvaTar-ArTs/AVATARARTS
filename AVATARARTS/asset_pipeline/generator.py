"""
Asset Generation Pipeline
Creates AEO/GEO-ready assets: actors, docs, schema, gigs
"""
from typing import Dict, List, Any
from datetime import datetime
import uuid

class AssetGenerator:
    """Generate structured assets for search optimization"""
    
    def __init__(self, geo_target: str = "global"):
        self.geo_target = geo_target
        self.asset_types = ["actor", "document", "schema", "gig"]
        
    def create_actor(self, name: str, role: str, expertise: List[str]) -> Dict[str, Any]:
        """Create an actor/agent profile with GEO targeting"""
        actor_id = f"actor_{uuid.uuid4().hex[:8]}"
        return {
            "@type": "Person",
            "@id": f"#{actor_id}",
            "name": name,
            "role": role,
            "expertise": expertise,
            "geo": self.geo_target,
            "availability": "available",
            "created": datetime.now().isoformat()
        }
    
    def create_document(self, title: str, content: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Create AEO-optimized document"""
        return {
            "title": title,
            "content": content,
            "optimized_headline": self._optimize_headline(title, analysis),
            "meta_description": self._generate_meta_description(content),
            "keywords": analysis.get("topics", []),
            "entities": analysis.get("entities", []),
            "schema_markup": self._generate_schema_markup(title, content, analysis),
            "geo_targeting": self.geo_target,
            "ai_overview_ready": True
        }
    
    def create_schema(self, content_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured schema markup"""
        base_schema = {
            "@context": "https://schema.org",
            "@type": content_type,
            "datePublished": datetime.now().isoformat(),
            "geo": self._get_geo_schema()
        }
        base_schema.update(data)
        return base_schema
    
    def create_gig(self, title: str, description: str, requirements: List[str]) -> Dict[str, Any]:
        """Create task/gig structure for agent systems"""
        return {
            "gig_id": f"gig_{uuid.uuid4().hex[:8]}",
            "title": title,
            "description": description,
            "requirements": requirements,
            "status": "open",
            "geo_preference": self.geo_target,
            "ai_agent_compatible": True,
            "estimated_ai_processing_time": "PT30M"  # ISO 8601 duration
        }
    
    def _optimize_headline(self, title: str, analysis: Dict[str, Any]) -> str:
        """Optimize headline for AEO"""
        topics = analysis.get("topics", [])
        if topics:
            return f"{title}: {topics[0]} Insights"
        return title
    
    def _generate_meta_description(self, content: str) -> str:
        """Generate SEO-friendly meta description"""
        # Extract first 155 characters intelligently
        clean = content.strip().replace('\n', ' ')[:155]
        if len(content) > 155:
            clean = clean.rsplit(' ', 1)[0] + '...'
        return clean
    
    def _generate_schema_markup(self, title: str, content: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive schema markup"""
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": self._generate_meta_description(content),
            "keywords": ", ".join(analysis.get("topics", [])[:5]),
            "mentions": [e["text"] for e in analysis.get("entities", [])[:3]]
        }
    
    def _get_geo_schema(self) -> Dict[str, Any]:
        """Get GEO targeting schema"""
        if self.geo_target == "global":
            return {"@type": "Country", "name": "Global"}
        return {"@type": "Place", "name": self.geo_target}
