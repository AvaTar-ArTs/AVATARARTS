"""
Code Property Graph (CPG) Analyzer
Security-grade analysis combining AST, control flow, and data flow
Enables "this script influences that output" mapping
"""
from typing import Dict, List, Any, Set, Tuple, Optional
import ast
import networkx as nx
from dataclasses import dataclass
from enum import Enum

class NodeType(Enum):
    """Types of nodes in the Code Property Graph"""
    AST_NODE = "ast_node"
    CONTROL_FLOW = "control_flow"
    DATA_FLOW = "data_flow"
    VARIABLE = "variable"
    FUNCTION = "function"
    IMPORT = "import"
    LITERAL = "literal"

class EdgeType(Enum):
    """Types of edges in the Code Property Graph"""
    AST_PARENT = "ast_parent"
    CONTROL_FLOW = "control_flow"
    DATA_FLOW = "data_flow"
    USES = "uses"
    DEFINES = "defines"
    CALLS = "calls"
    IMPORTS = "imports"

@dataclass
class CPGNode:
    """Node in the Code Property Graph"""
    id: str
    node_type: NodeType
    label: str
    ast_type: Optional[str] = None
    line_no: Optional[int] = None
    value: Optional[Any] = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

@dataclass
class CPGEdge:
    """Edge in the Code Property Graph"""
    source: str
    target: str
    edge_type: EdgeType
    label: str = ""
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

class CodePropertyGraph:
    """Build and analyze Code Property Graphs for Python code"""
    
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.node_counter = 0
        self.variable_map: Dict[str, str] = {}
        self.function_map: Dict[str, str] = {}
        
    def _get_node_id(self, node: ast.AST) -> str:
        """Get the node ID for an AST node (if already created)"""
        # This is a simplified lookup; in reality we need to map AST objects to node IDs
        # For now, we'll return a placeholder
        for node_id, data in self.graph.nodes(data=True):
            if data.get('metadata', {}).get('ast_object') is node:
                return node_id
        return f"ast_root_{id(node)}"
    
    def analyze_script(self, source_code: str) -> Dict[str, Any]:
        """
        Analyze a Python script and build its Code Property Graph
        """
        try:
            tree = ast.parse(source_code)
        except SyntaxError as e:
            return {"error": f"Syntax error: {e}", "cpg": None}
        
        # Reset state for new analysis
        self.graph = nx.MultiDiGraph()
        self.node_counter = 0
        self.variable_map = {}
        self.function_map = {}
        
        # Build AST nodes
        self._build_ast_nodes(tree)
        
        # Extract control flow
        self._extract_control_flow()
        
        # Extract data flow
        self._extract_data_flow()
        
        # Build influence mapping
        influence_map = self._build_influence_mapping()
        
        return {
            "ast_root": self._get_node_id(tree),
            "node_count": self.graph.number_of_nodes(),
            "edge_count": self.graph.number_of_edges(),
            "influence_map": influence_map,
            "graph_summary": self._get_graph_summary(),
            "security_insights": self._generate_security_insights()
        }
    
    def _build_ast_nodes(self, node: ast.AST, parent_id: Optional[str] = None):
        """Recursively build AST nodes and relationships"""
        node_id = f"ast_{self.node_counter}"
        self.node_counter += 1
        
        # Create node
        ast_node = CPGNode(
            id=node_id,
            node_type=NodeType.AST_NODE,
            label=type(node).__name__,
            ast_type=type(node).__name__,
            line_no=getattr(node, 'lineno', None),
            metadata={"ast_object": node}
        )
        
        self.graph.add_node(node_id, **ast_node.__dict__)
        
        # Add parent relationship if exists
        if parent_id:
            edge = CPGEdge(
                source=parent_id,
                target=node_id,
                edge_type=EdgeType.AST_PARENT,
                label="parent_of"
            )
            self.graph.add_edge(parent_id, node_id, **edge.__dict__)
        
        # Handle specific node types
        if isinstance(node, ast.FunctionDef):
            self._handle_function_def(node, node_id)
        elif isinstance(node, ast.Name):
            self._handle_name(node, node_id)
        elif isinstance(node, ast.Call):
            self._handle_call(node, node_id)
        elif isinstance(node, ast.Assign):
            self._handle_assign(node, node_id)
        elif isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
            self._handle_import(node, node_id)
        
        # Recursively process children
        for child in ast.iter_child_nodes(node):
            self._build_ast_nodes(child, node_id)
    
    def _handle_function_def(self, node: ast.FunctionDef, node_id: str):
        """Handle function definition nodes"""
        func_node = CPGNode(
            id=f"func_{node.name}",
            node_type=NodeType.FUNCTION,
            label=f"Function: {node.name}",
            line_no=node.lineno,
            metadata={"args": [arg.arg for arg in node.args.args]}
        )
        self.graph.add_node(func_node.id, **func_node.__dict__)
        
        # Connect AST node to function node
        edge = CPGEdge(
            source=node_id,
            target=func_node.id,
            edge_type=EdgeType.DEFINES,
            label="defines_function"
        )
        self.graph.add_edge(node_id, func_node.id, **edge.__dict__)
        
        self.function_map[node.name] = func_node.id
    
    def _handle_name(self, node: ast.Name, node_id: str):
        """Handle variable name nodes"""
        var_node = CPGNode(
            id=f"var_{node.id}",
            node_type=NodeType.VARIABLE,
            label=f"Variable: {node.id}",
            line_no=node.lineno
        )
        self.graph.add_node(var_node.id, **var_node.__dict__)
        
        # Connect AST node to variable node
        edge = CPGEdge(
            source=node_id,
            target=var_node.id,
            edge_type=EdgeType.USES,
            label="uses_variable"
        )
        self.graph.add_edge(node_id, var_node.id, **edge.__dict__)
        
        self.variable_map[node.id] = var_node.id
    
    def _handle_call(self, node: ast.Call, node_id: str):
        """Handle function call nodes"""
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            if func_name in self.function_map:
                edge = CPGEdge(
                    source=node_id,
                    target=self.function_map[func_name],
                    edge_type=EdgeType.CALLS,
                    label="calls_function"
                )
                self.graph.add_edge(node_id, self.function_map[func_name], **edge.__dict__)
    
    def _handle_assign(self, node: ast.Assign, node_id: str):
        """Handle assignment nodes for data flow"""
        for target in node.targets:
            if isinstance(target, ast.Name):
                var_id = f"var_{target.id}"
                if var_id in self.graph.nodes:
                    # Mark this node as defining the variable
                    edge = CPGEdge(
                        source=node_id,
                        target=var_id,
                        edge_type=EdgeType.DEFINES,
                        label="defines_variable"
                    )
                    self.graph.add_edge(node_id, var_id, **edge.__dict__)
    
    def _handle_import(self, node: ast.AST, node_id: str):
        """Handle import nodes"""
        import_node = CPGNode(
            id=f"import_{self.node_counter}",
            node_type=NodeType.IMPORT,
            label="Import",
            line_no=getattr(node, 'lineno', None)
        )
        self.node_counter += 1
        self.graph.add_node(import_node.id, **import_node.__dict__)
        
        edge = CPGEdge(
            source=node_id,
            target=import_node.id,
            edge_type=EdgeType.IMPORTS,
            label="imports_module"
        )
        self.graph.add_edge(node_id, import_node.id, **edge.__dict__)
    
    def _extract_control_flow(self):
        """Extract control flow relationships from AST"""
        # Simplified control flow extraction
        # In a full implementation, this would analyze loops, conditionals, etc.
        ast_nodes = [n for n, data in self.graph.nodes(data=True) 
                    if data.get('node_type') == NodeType.AST_NODE.value]
        
        for i in range(len(ast_nodes) - 1):
            edge = CPGEdge(
                source=ast_nodes[i],
                target=ast_nodes[i + 1],
                edge_type=EdgeType.CONTROL_FLOW,
                label="next_statement"
            )
            self.graph.add_edge(ast_nodes[i], ast_nodes[i + 1], **edge.__dict__)
    
    def _extract_data_flow(self):
        """Extract data flow relationships"""
        # Track variable definitions and uses
        var_nodes = [n for n, data in self.graph.nodes(data=True) 
                    if data.get('node_type') == NodeType.VARIABLE.value]
        
        for var_node in var_nodes:
            # Find definitions and uses
            definitions = []
            uses = []
            
            for u, v, data in self.graph.edges(data=True):
                if data.get('edge_type') == EdgeType.DEFINES.value and v == var_node:
                    definitions.append(u)
                elif data.get('edge_type') == EdgeType.USES.value and v == var_node:
                    uses.append(u)
            
            # Create data flow edges from definitions to uses
            for def_node in definitions:
                for use_node in uses:
                    edge = CPGEdge(
                        source=def_node,
                        target=use_node,
                        edge_type=EdgeType.DATA_FLOW,
                        label="data_flow"
                    )
                    self.graph.add_edge(def_node, use_node, **edge.__dict__)
    
    def _build_influence_mapping(self) -> Dict[str, List[str]]:
        """Build mapping of which code elements influence which outputs"""
        influence_map = {}
        
        # Find output-related nodes (prints, returns, etc.)
        output_nodes = []
        for node_id, data in self.graph.nodes(data=True):
            if data.get('ast_type') in ['Call', 'Return', 'Expr']:
                # Check if it's a print call or similar
                output_nodes.append(node_id)
        
        # For each output node, find influencing nodes via data/control flow
        for output_node in output_nodes:
            influencing_nodes = set()
            
            # Perform BFS to find all nodes that can influence this output
            queue = [output_node]
            visited = set()
            
            while queue:
                current = queue.pop(0)
                if current in visited:
                    continue
                visited.add(current)
                
                # Add predecessors through data flow and control flow edges
                for pred in self.graph.predecessors(current):
                    edge_data = self.graph.get_edge_data(pred, current)
                    if edge_data:
                        for _, data in edge_data.items():
                            if data.get('edge_type') in [EdgeType.DATA_FLOW.value, 
                                                        EdgeType.CONTROL_FLOW.value,
                                                        EdgeType.CALLS.value]:
                                influencing_nodes.add(pred)
                                queue.append(pred)
            
            influence_map[output_node] = list(influencing_nodes)
        
        return influence_map
    
    def _get_graph_summary(self) -> Dict[str, Any]:
        """Generate summary statistics about the CPG"""
        node_types = {}
        edge_types = {}
        
        for _, data in self.graph.nodes(data=True):
            node_type = data.get('node_type', 'unknown')
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        for _, _, data in self.graph.edges(data=True):
            edge_type = data.get('edge_type', 'unknown')
            edge_types[edge_type] = edge_types.get(edge_type, 0) + 1
        
        return {
            "node_types": node_types,
            "edge_types": edge_types,
            "is_dag": nx.is_directed_acyclic_graph(self.graph),
            "connected_components": nx.number_weakly_connected_components(self.graph)
        }
    
    def _generate_security_insights(self) -> List[str]:
        """Generate security insights from the CPG"""
        insights = []
        
        # Check for potentially dangerous patterns
        # 1. Unsafe imports
        import_nodes = [n for n, data in self.graph.nodes(data=True) 
                       if data.get('node_type') == NodeType.IMPORT.value]
        if import_nodes:
            insights.append(f"Found {len(import_nodes)} import statements - review for security")
        
        # 2. Data flow to output without validation
        data_flow_edges = [(u, v) for u, v, d in self.graph.edges(data=True) 
                          if d.get('edge_type') == EdgeType.DATA_FLOW.value]
        if len(data_flow_edges) > 10:
            insights.append("Complex data flow detected - consider input validation")
        
        # 3. External function calls
        call_edges = [(u, v) for u, v, d in self.graph.edges(data=True) 
                     if d.get('edge_type') == EdgeType.CALLS.value]
        if call_edges:
            insights.append(f"{len(call_edges)} function calls - audit external dependencies")
        
        return insights
    
    def visualize_influence_paths(self, source_code: str, output_node_id: str) -> Dict[str, Any]:
        """
        Visualize influence paths to a specific output node
        """
        analysis = self.analyze_script(source_code)
        
        if "error" in analysis:
            return analysis
        
        influence_map = analysis.get("influence_map", {})
        
        if output_node_id not in influence_map:
            return {"error": f"Output node {output_node_id} not found"}
        
        influencing_nodes = influence_map[output_node_id]
        
        # Build subgraph of influencing nodes
        subgraph_nodes = set(influencing_nodes + [output_node_id])
        subgraph = self.graph.subgraph(subgraph_nodes)
        
        return {
            "output_node": output_node_id,
            "influencing_nodes": influencing_nodes,
            "influence_count": len(influencing_nodes),
            "subgraph_size": subgraph.number_of_nodes(),
            "paths": self._find_all_paths_to_output(output_node_id, influencing_nodes)
        }
    
    def _find_all_paths_to_output(self, output_node: str, influencing_nodes: List[str]) -> List[List[str]]:
        """Find all paths from influencing nodes to the output node"""
        paths = []
        for node in influencing_nodes:
            try:
                for path in nx.all_simple_paths(self.graph, node, output_node):
                    paths.append(path)
            except nx.NetworkXNoPath:
                continue
        return paths[:10]  # Limit to first 10 paths for brevity

class SecurityCPGIntegrator:
    """Integrate CPG analysis with the main intelligence stack"""
    
    def __init__(self):
        self.cpg_analyzer = CodePropertyGraph()
    
    def analyze_code_assets(self, assets: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze code assets in the generated content for security insights
        """
        results = {}
        
        # Look for code snippets in assets
        for asset_type, asset in assets.items():
            if isinstance(asset, dict) and "content" in asset:
                content = asset["content"]
                if self._looks_like_code(content):
                    analysis = self.cpg_analyzer.analyze_script(content)
                    results[asset_type] = {
                        "cpg_analysis": analysis,
                        "security_grade": self._calculate_security_grade(analysis)
                    }
        
        return {
            "code_analysis": results,
            "overall_security_score": self._calculate_overall_score(results),
            "recommendations": self._generate_security_recommendations(results)
        }
    
    def _looks_like_code(self, text: str) -> bool:
        """Heuristic to detect if text contains code"""
        code_indicators = ["def ", "import ", "class ", "=", "(", ")", ":", "\n    "]
        return any(indicator in text for indicator in code_indicators)
    
    def _calculate_security_grade(self, analysis: Dict[str, Any]) -> str:
        """Calculate security grade from CPG analysis"""
        if "error" in analysis:
            return "UNKNOWN"
        
        insights = analysis.get("security_insights", [])
        if len(insights) == 0:
            return "SECURE"
        elif len(insights) <= 2:
            return "MODERATE"
        else:
            return "NEEDS_REVIEW"
    
    def _calculate_overall_score(self, results: Dict[str, Any]) -> float:
        """Calculate overall security score (0-100)"""
        if not results:
            return 100.0
        
        grades = {
            "SECURE": 100,
            "MODERATE": 70,
            "NEEDS_REVIEW": 30,
            "UNKNOWN": 50
        }
        
        scores = [grades.get(data.get("security_grade", "UNKNOWN"), 50) 
                 for data in results.values()]
        
        return sum(scores) / len(scores) if scores else 100.0
    
    def _generate_security_recommendations(self, results: Dict[str, Any]) -> List[str]:
        """Generate security recommendations based on analysis"""
        recommendations = []
        
        for asset_type, data in results.items():
            grade = data.get("security_grade")
            if grade == "NEEDS_REVIEW":
                recommendations.append(
                    f"Review code in {asset_type} for security vulnerabilities"
                )
            elif grade == "MODERATE":
                recommendations.append(
                    f"Consider adding input validation to code in {asset_type}"
                )
        
        if not recommendations:
            recommendations.append("All code assets appear secure")
        
        return recommendations
