"""
Main orchestration for Content-Awareness Intelligence Stack
Coordinates all modules for AEO/GEO-ready asset generation
"""
import json
from datetime import datetime
from typing import Dict
try:
    from .content_engine import ContentAnalyzer
    from .asset_pipeline.generator import AssetGenerator
    from .keyword_intelligence.mapper import KeywordMapper
    from .integrations.ai_search import AISearchIntegrator
    from .security.cpg_analyzer import SecurityCPGIntegrator
except ImportError:
    from content_engine import ContentAnalyzer
    from asset_pipeline.generator import AssetGenerator
    from keyword_intelligence.mapper import KeywordMapper
    from integrations.ai_search import AISearchIntegrator
    from security.cpg_analyzer import SecurityCPGIntegrator

class AvatarArtsIntelligenceStack:
    """Main orchestration class for the intelligence stack"""
    
    def __init__(self, geo_target: str = "global", enable_security_cpg: bool = True):
        self.geo_target = geo_target
        self.content_analyzer = ContentAnalyzer()
        self.asset_generator = AssetGenerator(geo_target=geo_target)
        self.keyword_mapper = KeywordMapper()
        self.ai_integrator = AISearchIntegrator()
        self.security_integrator = SecurityCPGIntegrator() if enable_security_cpg else None
        
    def process_content(self, text: str, title: str = None) -> Dict:
        """
        Full pipeline: analyze content, generate assets, integrate with AI search
        """
        # Step 1: Content analysis
        print("🔍 Analyzing content...")
        analysis = self.content_analyzer.analyze(text)
        
        # Step 2: Generate assets
        print("🏗️  Generating AEO/GEO-ready assets...")
        if title is None:
            title = analysis.get("topics", ["AI Content"])[0]
        
        document = self.asset_generator.create_document(
            title=title,
            content=text,
            analysis=analysis
        )
        
        actor = self.asset_generator.create_actor(
            name="AI Content Analyst",
            role="Content Intelligence Engine",
            expertise=["NLP", "AEO", "GEO Targeting", "Entity Extraction"]
        )
        
        schema = self.asset_generator.create_schema(
            content_type="TechArticle",
            data={
                "headline": title,
                "description": document.get("meta_description", "")
            }
        )
        
        gig = self.asset_generator.create_gig(
            title=f"Optimize: {title}",
            description=f"AI-driven optimization for {title}",
            requirements=["AEO compliance", "GEO targeting", "Entity markup"]
        )
        
        # Step 3: Get keyword intelligence
        print("🗺️  Updating keyword maps...")
        keyword_map = self.keyword_mapper.generate_keyword_map()
        
        # Step 4: Security-grade CPG analysis
        security_analysis = {}
        if self.security_integrator:
            print("🔒 Performing security-grade CPG analysis...")
            security_analysis = self.security_integrator.analyze_code_assets(
                {"document": document, "gig": gig}
            )
        
        # Step 5: Prepare for AI search integration
        print("🤖 Integrating with AI search platforms...")
        ai_ready = self.ai_integrator.prepare_for_ai_overviews(analysis)
        agent_ready = self.ai_integrator.connect_to_agent(document)
        geo_optimized = self.ai_integrator.submit_to_geo_targeting(
            analysis, 
            regions=["global"] if self.geo_target == "global" else [self.geo_target]
        )
        
        # Compile results
        result = {
            "timestamp": datetime.now().isoformat(),
            "content_analysis": analysis,
            "generated_assets": {
                "document": document,
                "actor": actor,
                "schema": schema,
                "gig": gig
            },
            "keyword_intelligence": keyword_map,
            "security_analysis": security_analysis,
            "ai_search_integration": {
                "ai_overview_ready": ai_ready,
                "agent_consumable": agent_ready,
                "geo_optimized": geo_optimized
            },
            "pipeline_status": "complete"
        }
        
        return result
    
    def export_results(self, result: Dict, format: str = "json") -> str:
        """Export results in specified format"""
        if format == "json":
            return json.dumps(result, indent=2)
        elif format == "minimal":
            # Extract key insights
            minimal = {
                "title": result.get("generated_assets", {}).get("document", {}).get("title", ""),
                "top_keywords": result.get("keyword_intelligence", {}).get("domains", {}).get("AvatarArts.org", {}).get("hot_keywords", [])[:3],
                "ai_ready": result.get("ai_search_integration", {}).get("ai_overview_ready", {}).get("format") == "ai_overview_ready"
            }
            return json.dumps(minimal, indent=2)
        else:
            return str(result)

def main():
    """Example usage of the intelligence stack"""
    stack = AvatarArtsIntelligenceStack(geo_target="global", enable_security_cpg=True)
    
    # Sample content
    sample_content = """
    Artificial Intelligence is transforming content understanding beyond simple keyword matching.
    Modern AI systems can extract entities, understand context, and generate AEO/GEO-ready assets.
    This enables intelligent content strategies that perform well in AI Overviews and agent ecosystems.
    """
    
    print("🚀 Starting Content-Awareness Intelligence Pipeline...")
    result = stack.process_content(sample_content, title="AI Content Understanding Revolution")
    
    print("\n✅ Pipeline Complete!")
    print("\n📊 Key Insights:")
    print(f"- Generated {len(result['generated_assets'])} assets")
    print(f"- Mapped {len(result['keyword_intelligence']['domains'])} domains")
    print(f"- AI Overview Ready: {result['ai_search_integration']['ai_overview_ready']['format']}")
    
    # Security insights
    if result.get('security_analysis'):
        sec = result['security_analysis']
        print(f"- Security Score: {sec.get('overall_security_score', 0):.1f}/100")
        for rec in sec.get('recommendations', []):
            print(f"  🔐 {rec}")
    
    # Export results
    export = stack.export_results(result, format="minimal")
    print("\n📄 Minimal Export:")
    print(export)
    
    # Save full results
    with open("intelligence_stack_output.json", "w") as f:
        json.dump(result, f, indent=2)
    print("\n💾 Full results saved to intelligence_stack_output.json")

if __name__ == "__main__":
    main()
