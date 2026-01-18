#!/usr/bin/env python3
"""
Enterprise AI Agents Orchestrator

Coordinates multiple agents for complex enterprise automation tasks.
Targets: "AI Agents Framework", "Enterprise Automation", "Multi-Agent Systems"
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from typing import Any, Dict, List, Optional

# Use absolute imports for compatibility
try:
    from .enterprise_agents import (
        AnalyticsAgent,
        AutomationAgent,
        ContentAgent,
        IntegrationAgent,
        ResearchAgent,
    )
except ImportError:
    # Fallback for direct script execution
    from enterprise_agents import (
        AnalyticsAgent,
        AutomationAgent,
        ContentAgent,
        IntegrationAgent,
        ResearchAgent,
    )


class AgentOrchestrator:
    """Orchestrates multiple agents for enterprise automation."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.agents = {}
        self.workflows = []
        self.execution_history = []
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize all enterprise agents."""
        self.agents = {
            "research": ResearchAgent("ResearchAgent", self.config),
            "content": ContentAgent("ContentAgent", self.config),
            "automation": AutomationAgent("AutomationAgent", self.config),
            "analytics": AnalyticsAgent("AnalyticsAgent", self.config),
            "integration": IntegrationAgent("IntegrationAgent", self.config),
        }

    def create_workflow(self, name: str, steps: List[Dict[str, Any]]) -> str:
        """
        Create a multi-agent workflow.

        Args:
            name: Workflow name
            steps: List of steps, each with 'agent', 'task', 'dependencies'

        Returns:
            Workflow ID
        """
        workflow = {
            "id": f"workflow_{len(self.workflows) + 1}",
            "name": name,
            "steps": steps,
            "status": "created",
            "created_at": datetime.now().isoformat(),
        }
        self.workflows.append(workflow)
        return workflow["id"]

    def execute_workflow(
        self, workflow_id: str, parallel: bool = True
    ) -> Dict[str, Any]:
        """
        Execute a workflow with agent orchestration.

        Args:
            workflow_id: Workflow ID to execute
            parallel: Whether to execute independent steps in parallel

        Returns:
            Workflow execution results
        """
        workflow = next((w for w in self.workflows if w["id"] == workflow_id), None)
        if not workflow:
            return {"error": f"Workflow {workflow_id} not found"}

        workflow["status"] = "running"
        workflow["started_at"] = datetime.now().isoformat()

        results = {}
        executed_steps = set()

        # Execute steps respecting dependencies
        while len(executed_steps) < len(workflow["steps"]):
            # Find steps ready to execute (dependencies met)
            ready_steps = [
                step
                for step in workflow["steps"]
                if step["id"] not in executed_steps
                and all(dep in executed_steps for dep in step.get("dependencies", []))
            ]

            if not ready_steps:
                # Circular dependency or missing step
                break

            # Execute ready steps
            if parallel and len(ready_steps) > 1:
                step_results = self._execute_steps_parallel(ready_steps)
            else:
                step_results = {}
                for step in ready_steps:
                    result = self._execute_step(step)
                    step_results[step["id"]] = result

            # Update results and executed steps
            results.update(step_results)
            executed_steps.update(step["id"] for step in ready_steps)

        workflow["status"] = "completed"
        workflow["completed_at"] = datetime.now().isoformat()
        workflow["results"] = results

        execution_record = {
            "workflow_id": workflow_id,
            "workflow_name": workflow["name"],
            "results": results,
            "executed_at": datetime.now().isoformat(),
            "duration": self._calculate_duration(workflow),
        }
        self.execution_history.append(execution_record)

        return {
            "workflow_id": workflow_id,
            "status": "completed",
            "results": results,
            "execution_record": execution_record,
        }

    def _execute_step(self, step: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single workflow step."""
        agent_name = step["agent"]
        task = step["task"]

        if agent_name not in self.agents:
            return {"error": f"Agent {agent_name} not found"}

        agent = self.agents[agent_name]
        result = agent.run(task)
        return result

    def _execute_steps_parallel(self, steps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute multiple steps in parallel."""
        results = {}
        with ThreadPoolExecutor(max_workers=len(steps)) as executor:
            futures = {
                executor.submit(self._execute_step, step): step["id"] for step in steps
            }

            for future in as_completed(futures):
                step_id = futures[future]
                try:
                    results[step_id] = future.result()
                except Exception as e:
                    results[step_id] = {"error": str(e)}

        return results

    def _calculate_duration(self, workflow: Dict[str, Any]) -> float:
        """Calculate workflow execution duration."""
        if "started_at" in workflow and "completed_at" in workflow:
            start = datetime.fromisoformat(workflow["started_at"])
            end = datetime.fromisoformat(workflow["completed_at"])
            return (end - start).total_seconds()
        return 0.0

    def get_agent_stats(self) -> Dict[str, Any]:
        """Get statistics for all agents."""
        return {
            agent_name: agent.get_stats() for agent_name, agent in self.agents.items()
        }

    def get_workflow_stats(self) -> Dict[str, Any]:
        """Get statistics for all workflows."""
        return {
            "total_workflows": len(self.workflows),
            "completed": len([w for w in self.workflows if w["status"] == "completed"]),
            "running": len([w for w in self.workflows if w["status"] == "running"]),
            "workflows": [
                {
                    "id": w["id"],
                    "name": w["name"],
                    "status": w["status"],
                    "steps_count": len(w["steps"]),
                }
                for w in self.workflows
            ],
        }