"""
Test Code Property Graph functionality
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'AVATARARTS'))

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
    
    assert "error" not in result
    assert result.get('node_count') > 0
    assert result.get('edge_count') > 0
    assert 'influence_map' in result
    
    # Test security integration
    security = SecurityCPGIntegrator()
    assets = {
        "document": {"content": sample_code},
        "gig": {"content": "def run(): pass"}
    }
    sec_result = security.analyze_code_assets(assets)
    
    assert 'overall_security_score' in sec_result
    assert 'recommendations' in sec_result
    
    print("✅ All tests passed")
    return result

if __name__ == "__main__":
    test_cpg_analysis()
"""
Test Code Property Graph functionality
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'AVATARARTS'))

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
    
    assert "error" not in result
    assert result.get('node_count') > 0
    assert result.get('edge_count') > 0
    assert 'influence_map' in result
    
    # Test security integration
    security = SecurityCPGIntegrator()
    assets = {
        "document": {"content": sample_code},
        "gig": {"content": "def run(): pass"}
    }
    sec_result = security.analyze_code_assets(assets)
    
    assert 'overall_security_score' in sec_result
    assert 'recommendations' in sec_result
    
    print("✅ All tests passed")
    return result

if __name__ == "__main__":
    test_cpg_analysis()
