#!/usr/bin/env python3
"""
Enterprise AI Agents Framework - Main Entry Point

High-revenue enterprise automation system targeting:
- AI Agents Framework (250%+ growth, 94/100 SEO/AEO)
- Enterprise Automation
- Multi-Agent Systems
- Task Orchestration

Usage:
    python main.py --workflow enterprise_automation.json
    python main.py --agent research --query "AI automation trends"
    python main.py --orchestrate --workflow-id workflow_1
"""

#!/usr/bin/env python3
"""
Enterprise AI Agents Framework - Main Entry Point
"""

import argparse
import json
import sys
import os
from pathlib import Path

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent_orchestrator import AgentOrchestrator
from enterprise_agents import (
    AnalyticsAgent,
    AutomationAgent,
    ContentAgent,
    IntegrationAgent,
    ResearchAgent,
)


def main():
    """Main entry point for enterprise AI agents."""
    parser = argparse.ArgumentParser(
        description="Enterprise AI Agents Framework - High-Revenue Automation System"
    )

    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    # Agent execution
    agent_parser = subparsers.add_parser("agent", help="Execute single agent")
    agent_parser.add_argument(
        "--type",
        required=True,
        choices=["research", "content", "automation", "analytics", "integration"],
        help="Agent type",
    )
    agent_parser.add_argument(
        "--task", required=True, type=str, help="Task JSON string or file path"
    )

    # Workflow execution
    workflow_parser = subparsers.add_parser("workflow", help="Execute workflow")
    workflow_parser.add_argument(
        "--file", required=True, type=str, help="Workflow JSON file"
    )
    workflow_parser.add_argument(
        "--parallel", action="store_true", help="Execute steps in parallel"
    )

    # Orchestrator
    orch_parser = subparsers.add_parser("orchestrate", help="Use orchestrator")
    orch_parser.add_argument("--create", type=str, help="Create workflow with name")
    orch_parser.add_argument("--execute", type=str, help="Execute workflow by ID")
    orch_parser.add_argument("--steps", type=str, help="Workflow steps JSON file")
    orch_parser.add_argument(
        "--parallel", action="store_true", help="Parallel execution"
    )

    # Stats
    stats_parser = subparsers.add_parser("stats", help="Get statistics")
    stats_parser.add_argument("--agent", type=str, help="Agent name")
    stats_parser.add_argument("--workflow", action="store_true", help="Workflow stats")

    args = parser.parse_args()

    if args.command == "agent":
        execute_agent(args.type, args.task)
    elif args.command == "workflow":
        execute_workflow(args.file, args.parallel)
    elif args.command == "orchestrate":
        execute_orchestrator(args)
    elif args.command == "stats":
        show_stats(args)
    else:
        parser.print_help()


def execute_agent(agent_type: str, task_input: str):
    """Execute a single agent."""
    # Load task
    if Path(task_input).exists():
        with open(task_input) as f:
            task = json.load(f)
    else:
        task = json.loads(task_input)

    # Create agent
    agents = {
        "research": ResearchAgent("ResearchAgent"),
        "content": ContentAgent("ContentAgent"),
        "automation": AutomationAgent("AutomationAgent"),
        "analytics": AnalyticsAgent("AnalyticsAgent"),
        "integration": IntegrationAgent("IntegrationAgent"),
    }

    agent = agents[agent_type]
    result = agent.run(task)

    print(json.dumps(result, indent=2))
    return result


def execute_workflow(workflow_file: str, parallel: bool):
    """Execute a workflow from file."""
    with open(workflow_file) as f:
        workflow_data = json.load(f)

    orchestrator = AgentOrchestrator()
    workflow_id = orchestrator.create_workflow(
        workflow_data["name"], workflow_data["steps"]
    )

    result = orchestrator.execute_workflow(workflow_id, parallel=parallel)
    print(json.dumps(result, indent=2))
    return result


def execute_orchestrator(args):
    """Execute orchestrator commands."""
    orchestrator = AgentOrchestrator()

    if args.create:
        if args.steps:
            with open(args.steps) as f:
                steps = json.load(f)
        else:
            steps = []

        workflow_id = orchestrator.create_workflow(args.create, steps)
        print(f"Created workflow: {workflow_id}")
        return workflow_id

    elif args.execute:
        result = orchestrator.execute_workflow(args.execute, parallel=args.parallel)
        print(json.dumps(result, indent=2))
        return result


def show_stats(args):
    """Show statistics."""
    orchestrator = AgentOrchestrator()

    if args.agent:
        # Show specific agent stats
        if args.agent in orchestrator.agents:
            stats = orchestrator.agents[args.agent].get_stats()
            print(json.dumps(stats, indent=2))
    elif args.workflow:
        # Show workflow stats
        stats = orchestrator.get_workflow_stats()
        print(json.dumps(stats, indent=2))
    else:
        # Show all stats
        agent_stats = orchestrator.get_agent_stats()
        workflow_stats = orchestrator.get_workflow_stats()
        print(
            json.dumps({"agents": agent_stats, "workflows": workflow_stats}, indent=2)
        )


if __name__ == "__main__":
    main()
