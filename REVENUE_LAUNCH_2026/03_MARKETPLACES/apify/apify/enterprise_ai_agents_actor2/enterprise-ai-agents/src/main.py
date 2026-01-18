"""Enterprise AI Agents Actor for Apify

High-revenue Apify actor targeting:
- AI Agents Framework (250%+ growth, 94/100 SEO/AEO)
- Enterprise Automation
- Multi-Agent Systems

Monetization: Pay-per-Result ($1.00-2.00 per result)
Target: Enterprise customers, developers, automation teams
"""

from __future__ import annotations

import time
from typing import Any, Dict

from apify import Actor
from agent_orchestrator import AgentOrchestrator


# Valid agent types
VALID_AGENTS = {"research", "content", "automation", "analytics", "integration"}

# Valid workflow types
VALID_WORKFLOW_TYPES = {"research", "content", "automation", "analytics", "integration", "multi"}


def validate_input(input_data: Dict[str, Any]) -> tuple[bool, str | None]:
    """
    Validate input data structure and values.

    Returns:
        (is_valid, error_message)
    """
    if not isinstance(input_data, dict):
        return False, "Input must be a JSON object"

    if "tasks" not in input_data:
        return False, "Missing required field: 'tasks'"

    tasks = input_data.get("tasks", [])
    if not isinstance(tasks, list):
        return False, "Field 'tasks' must be an array"

    if len(tasks) == 0:
        return False, "Field 'tasks' must contain at least one task"

    # Validate workflow_type if provided
    workflow_type = input_data.get("workflow_type", "research")
    if workflow_type not in VALID_WORKFLOW_TYPES:
        return False, f"Invalid workflow_type: {workflow_type}. Must be one of: {', '.join(VALID_WORKFLOW_TYPES)}"

    # Validate each task
    for i, task in enumerate(tasks):
        if not isinstance(task, dict):
            return False, f"Task {i+1} must be an object"

        agent_type = task.get("agent", workflow_type)
        if agent_type not in VALID_AGENTS:
            return False, f"Task {i+1}: Invalid agent type '{agent_type}'. Must be one of: {', '.join(VALID_AGENTS)}"

        # Validate dependencies if provided
        dependencies = task.get("dependencies", [])
        if dependencies:
            if not isinstance(dependencies, list):
                return False, f"Task {i+1}: 'dependencies' must be an array"
            # Check for circular dependencies (basic check)
            step_id = task.get("id", f"step_{i+1}")
            if step_id in dependencies:
                return False, f"Task {i+1}: Cannot depend on itself"

    return True, None


async def main() -> None:
    """
    Main Apify actor function.
    Executes enterprise AI agents workflows.
    """
    start_time = time.time()

    async with Actor:
        try:
            # Get input
            input_data = await Actor.get_input() or {}

            Actor.log.info("Enterprise AI Agents Framework - Starting execution")
            Actor.log.info(f"Input received: {len(input_data)} fields")

            # Validate input
            is_valid, error_message = validate_input(input_data)
            if not is_valid:
                await Actor.set_status_message(f"Input validation failed: {error_message}")
                await Actor.push_data(
                    [
                        {
                            "error": "Input validation failed",
                            "message": error_message,
                            "example": {
                                "workflow_type": "research",
                                "tasks": [
                                    {
                                        "agent": "research",
                                        "query": "AI automation trends",
                                        "type": "trend_analysis",
                                    }
                                ],
                                "parallel": True,
                            },
                        }
                    ]
                )
                return

            workflow_type = input_data.get("workflow_type", "research")
            tasks = input_data.get("tasks", [])
            parallel = input_data.get("parallel", True)
            max_retries = input_data.get("max_retries", 3)
            timeout = input_data.get("timeout", 300)

            Actor.log.info(f"Workflow type: {workflow_type}, Tasks: {len(tasks)}, Parallel: {parallel}")

            # Initialize orchestrator
            orchestrator = AgentOrchestrator({"max_retries": max_retries, "timeout": timeout})

            # Create workflow
            workflow_steps = []
            for i, task in enumerate(tasks):
                agent_type = task.get("agent", workflow_type)
                step = {
                    "id": task.get("id", f"step_{i+1}"),
                    "agent": agent_type,
                    "task": task,
                    "dependencies": task.get("dependencies", []),
                }
                workflow_steps.append(step)

            workflow_id = orchestrator.create_workflow(
                f"Enterprise Automation - {workflow_type}", workflow_steps
            )

            Actor.log.info(f"Created workflow: {workflow_id} with {len(workflow_steps)} steps")

            # Execute workflow
            await Actor.set_status_message(f"Executing workflow: {workflow_id}")
            execution_start = time.time()

            result = orchestrator.execute_workflow(workflow_id, parallel=parallel)

            execution_time = time.time() - execution_start
            Actor.log.info(f"Workflow execution completed in {execution_time:.2f}s")

            # Format results for Apify
            apify_results = []

            if result.get("status") == "completed":
                for step_id, step_result in result.get("results", {}).items():
                    apify_result = {
                        "workflow_id": workflow_id,
                        "step_id": step_id,
                        "status": step_result.get("status", "unknown"),
                        "agent": step_result.get("agent"),
                        "result": step_result.get("result", {}),
                        "duration": step_result.get("duration", 0),
                        "timestamp": step_result.get("timestamp"),
                    }

                    # Add SEO/AEO scores if available
                    result_data = step_result.get("result", {})
                    if isinstance(result_data, dict):
                        if "seo_score" in result_data:
                            apify_result["seo_score"] = result_data["seo_score"]
                        if "aeo_score" in result_data:
                            apify_result["aeo_score"] = result_data["aeo_score"]

                    apify_results.append(apify_result)
            else:
                error_msg = result.get("error", "Unknown error")
                Actor.log.error(f"Workflow failed: {error_msg}")
                apify_results.append(
                    {
                        "workflow_id": workflow_id,
                        "status": "failed",
                        "error": error_msg,
                        "error_code": "WORKFLOW_EXECUTION_FAILED",
                    }
                )

            # Push results (monetization: Pay-per-Result)
            await Actor.push_data(apify_results)

            # Calculate success rate
            success_count = len([r for r in apify_results if r.get("status") == "success"])
            success_rate = (success_count / max(len(apify_results), 1)) * 100

            # Set final status
            total_time = time.time() - start_time
            await Actor.set_status_message(
                f"Completed: {len(apify_results)} results generated in {total_time:.2f}s (Success: {success_rate:.1f}%)"
            )

            # Add summary with performance metrics
            await Actor.push_data(
                [
                    {
                        "summary": {
                            "workflow_id": workflow_id,
                            "total_steps": len(workflow_steps),
                            "results_count": len(apify_results),
                            "success_count": success_count,
                            "success_rate": success_rate,
                            "execution_time": execution_time,
                            "total_time": total_time,
                            "parallel_execution": parallel,
                        }
                    }
                ]
            )

            Actor.log.info(f"Workflow completed successfully: {success_count}/{len(apify_results)} steps succeeded")

        except Exception as e:
            Actor.log.exception(f"Unexpected error: {str(e)}")
            await Actor.set_status_message(f"Error: {str(e)}")
            await Actor.push_data(
                [
                    {
                        "error": "Unexpected error",
                        "error_code": "INTERNAL_ERROR",
                        "message": str(e),
                        "type": type(e).__name__,
                    }
                ]
            )