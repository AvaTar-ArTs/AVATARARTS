#!/usr/bin/env python3
"""
Enterprise AI Agents - Quick Start Example

High-revenue automation example targeting:
- AI Agents Framework (250%+ growth, 94/100 SEO/AEO)
- Enterprise Automation
- Multi-Agent Systems
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent_orchestrator import AgentOrchestrator
from enterprise_agents import ResearchAgent, ContentAgent

def main():
    """Quick start example."""

    print("=" * 80)
    print("Enterprise AI Agents Framework - Quick Start")
    print("=" * 80)
    print()

    # Example 1: Single Agent
    print("Example 1: Single Research Agent")
    print("-" * 80)

    research_agent = ResearchAgent('ResearchAgent')
    result = research_agent.run({
        'query': 'AI Agents Framework enterprise automation',
        'type': 'trend_analysis'
    })

    print(f"Status: {result['status']}")
    print(f"Agent: {result['agent']}")
    print(f"Duration: {result.get('duration', 0):.2f}s")
    print()

    # Example 2: Multi-Agent Workflow
    print("Example 2: Multi-Agent Workflow")
    print("-" * 80)

    orchestrator = AgentOrchestrator()

    workflow_id = orchestrator.create_workflow('Enterprise Automation', [
        {
            'id': 'step_1',
            'agent': 'research',
            'task': {
                'query': 'enterprise automation trends',
                'type': 'market_research'
            },
            'dependencies': []
        },
        {
            'id': 'step_2',
            'agent': 'content',
            'task': {
                'topic': 'Enterprise AI Agents Framework',
                'format': 'article',
                'target_keywords': ['AI Agents Framework', 'Enterprise Automation'],
                'seo_optimize': True,
                'aeo_optimize': True
            },
            'dependencies': ['step_1']
        }
    ])

    print(f"Created workflow: {workflow_id}")
    print("Executing workflow...")

    result = orchestrator.execute_workflow(workflow_id, parallel=False)

    print(f"Workflow Status: {result['status']}")
    print(f"Steps Completed: {len(result['results'])}")
    print()

    # Example 3: Agent Statistics
    print("Example 3: Agent Statistics")
    print("-" * 80)

    stats = orchestrator.get_agent_stats()
    for agent_name, agent_stats in stats.items():
        print(f"{agent_name}:")
        print(f"  Status: {agent_stats['status']}")
        print(f"  Tasks Completed: {agent_stats['tasks_completed']}")
        print(f"  Success Rate: {agent_stats['success_rate']:.2f}%")
        print()

    print("=" * 80)
    print("Quick Start Complete!")
    print("=" * 80)

if __name__ == '__main__':
    main()
