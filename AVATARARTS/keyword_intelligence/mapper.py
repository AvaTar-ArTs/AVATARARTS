"""
Keyword Intelligence Module
Tracks and updates keyword maps for AvatarArts.org ↔ QuantumForgeLabs.org
Aligned with AI search trends (AEO/GEO, AI Overviews, entities, agents)
"""
from typing import Dict, List, Tuple, Any
import json
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

class TrendDirection(Enum):
    RISING = "rising"
    FALLING = "falling"
    STABLE = "stable"
    HOT = "hot"  # Top 1-5%

@dataclass
class KeywordMetric:
    """Metrics for keyword tracking"""
    keyword: str
    volume: int
    difficulty: float
    trend: TrendDirection
    cpc: float  # Cost per click
    ai_relevance: float  # Relevance to AI search trends
    entities: List[str]
    last_updated: datetime

class KeywordMapper:
    """Manage keyword intelligence across domains"""
    
    def __init__(self):
        self.domains = {
            "avatararts": "AvatarArts.org",
            "quantumforge": "QuantumForgeLabs.org"
        }
        self.ai_search_categories = [
            "AEO", "GEO", "AI_Overviews", "Entities", "Agents",
            "Multimodal_AI", "AI_Search", "Content_Understanding"
        ]
        
    def get_hot_keywords(self, domain: str, percentile: int = 5) -> List[KeywordMetric]:
        """
        Get top 1-5% hot-rising keywords for a domain
        """
        # This would integrate with actual keyword research APIs
        # (SEMrush, Ahrefs, Google Trends, etc.)
        # For now, return simulated data aligned with AI search trends
        
        hot_keywords = []
        base_keywords = self._get_base_keywords_for_domain(domain)
        
        for kw in base_keywords:
            # Simulate trend analysis
            if "AI" in kw or "agent" in kw.lower() or "entity" in kw.lower():
                trend = TrendDirection.HOT
                ai_relevance = 0.9
            elif "search" in kw.lower() or "content" in kw.lower():
                trend = TrendDirection.RISING
                ai_relevance = 0.7
            else:
                trend = TrendDirection.STABLE
                ai_relevance = 0.3
                
            metric = KeywordMetric(
                keyword=kw,
                volume=1000 * (10 if trend == TrendDirection.HOT else 1),
                difficulty=65.0 if trend == TrendDirection.HOT else 45.0,
                trend=trend,
                cpc=12.50 if trend == TrendDirection.HOT else 5.25,
                ai_relevance=ai_relevance,
                entities=self._extract_entities_from_keyword(kw),
                last_updated=datetime.now()
            )
            hot_keywords.append(metric)
            
        # Filter to top percentile
        hot_keywords.sort(key=lambda x: (x.ai_relevance, x.volume), reverse=True)
        cutoff = max(1, len(hot_keywords) * percentile // 100)
        return hot_keywords[:cutoff]
    
    def generate_keyword_map(self) -> Dict[str, Any]:
        """Generate comprehensive keyword map for both domains"""
        map_data = {
            "generated_at": datetime.now().isoformat(),
            "ai_search_alignment": {
                "categories": self.ai_search_categories,
                "trend_period": "Q1-2026",
                "data_sources": ["simulated", "integrate_with_actual_apis"]
            },
            "domains": {}
        }
        
        for domain_key, domain_name in self.domains.items():
            hot_keywords = self.get_hot_keywords(domain_key, percentile=5)
            
            # Convert to serializable format
            keywords_serializable = []
            for kw in hot_keywords:
                kw_dict = {
                    "keyword": kw.keyword,
                    "volume": kw.volume,
                    "difficulty": kw.difficulty,
                    "trend": kw.trend.value,
                    "cpc": kw.cpc,
                    "ai_relevance": kw.ai_relevance,
                    "entities": kw.entities,
                    "last_updated": kw.last_updated.isoformat()
                }
                keywords_serializable.append(kw_dict)
            
            map_data["domains"][domain_name] = {
                "hot_keywords": keywords_serializable,
                "recommended_actions": self._generate_recommendations(hot_keywords)
            }
            
        return map_data
    
    def _get_base_keywords_for_domain(self, domain: str) -> List[str]:
        """Get base keyword list for a domain"""
        if domain == "avatararts":
            return [
                "AI content understanding",
                "Avatar arts intelligence",
                "AEO ready assets",
                "GEO targeting AI",
                "Entity extraction for SEO",
                "AI agents for content",
                "Multimodal AI search",
                "Content awareness stack"
            ]
        else:  # quantumforge
            return [
                "Quantum AI labs",
                "AI research platforms",
                "Agent-based systems",
                "AI Overview optimization",
                "Semantic search entities",
                "Intelligent content pipelines",
                "AI-ready schema generation",
                "Automated asset creation"
            ]
    
    def _extract_entities_from_keyword(self, keyword: str) -> List[str]:
        """Extract potential entities from keyword"""
        entities = []
        for word in keyword.split():
            clean = word.strip().lower()
            if clean in ["ai", "seo", "geo", "aeo"]:
                entities.append(clean.upper())
            elif len(clean) > 3 and clean not in ["for", "and", "the", "with"]:
                entities.append(clean.title())
        return entities
    
    def _generate_recommendations(self, keywords: List[KeywordMetric]) -> List[str]:
        """Generate actionable recommendations based on keyword analysis"""
        recs = []
        
        hot_count = sum(1 for k in keywords if k.trend == TrendDirection.HOT)
        if hot_count > 0:
            recs.append(f"Create {hot_count} pillar pieces targeting HOT AI-search keywords")
        
        high_ai = [k for k in keywords if k.ai_relevance > 0.8]
        if high_ai:
            recs.append(f"Optimize {len(high_ai)} high-AI-relevance keywords for AI Overviews")
        
        recs.extend([
            "Integrate entity markup for all target keywords",
            "Create AEO/GEO-ready assets for top 3 keywords per domain",
            "Build agent-compatible content snippets for AI agent consumption"
        ])
        
        return recs
