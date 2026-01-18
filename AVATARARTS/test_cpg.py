"""
Test Code Property Graph functionality
"""
from security.cpg_analyzer import CodePropertyGraph, SecurityCPGIntegrator

def test_cpg_analysis():
    """Test basic CPG analysis"""
    cpg = CodePropertyGraph()
    
    sample_code = """
def process_data(input_data):
    # Process the input
    cleaned = input_data.strip().lower()
    result = cleaned.replace("test", "production")
    print(f"Result: {result}")
    return result

data = "TEST data here"
output = process_data(data)
"""
    
    print("🧪 Testing Code Property Graph Analysis...")
    result = cpg.analyze_script(sample_code)
    
    print(f"✅ Nodes: {result.get('node_count')}")
    print(f"✅ Edges: {result.get('edge_count')}")
    print(f"✅ Influence Map: {len(result.get('influence_map', {}))} output nodes")
    
    # Test security integration
    security = SecurityCPGIntegrator()
    assets = {
        "document": {"content": sample_code},
        "gig": {"content": "def run(): pass"}
    }
    sec_result = security.analyze_code_assets(assets)
    
    print(f"✅ Security Score: {sec_result.get('overall_security_score')}")
    print("✅ Recommendations:")
    for rec in sec_result.get('recommendations', []):
        print(f"   - {rec}")
    
    return result

if __name__ == "__main__":
    test_cpg_analysis()
