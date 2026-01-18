"""
Enterprise AI Agents Actor for Apify

High-revenue Apify actor targeting:
- AI Agents Framework (250%+ growth, 94/100 SEO/AEO)
- Enterprise Automation
- Multi-Agent Systems

Monetization: Pay-per-Result ($1.00-2.00 per result)
Target: Enterprise customers, developers, automation teams
"""

import os
import sys

from apify import Actor

# Add enterprise agents to path
sys.path.insert(
    0,
    os.path.join(os.path.dirname(__file__), "../../../AUTOMATION/enterprise_ai_agents"),
)

from agent_orchestrator import AgentOrchestrator


async def main():
    """
    Main Apify actor function.
    Executes enterprise AI agents workflows.
    """
    async with Actor:
        # Get input
        input_data = await Actor.get_input() or {}
        workflow_type = input_data.get("workflow_type", "research")
        tasks = input_data.get("tasks", [])
        parallel = input_data.get("parallel", True)

        if not tasks:
            await Actor.set_status_message("No tasks provided")
            await Actor.push_data(
                [
                    {
                        "error": "Tasks required",
                        "example": {
                            "workflow_type": "research",
                            "tasks": [
                                {
                                    "query": "AI automation trends",
                                    "type": "trend_analysis",
                                }
                            ],
                        },
                    }
                ]
            )
            return

        # Initialize orchestrator
        orchestrator = AgentOrchestrator()

        # Create workflow
        workflow_steps = []
        for i, task in enumerate(tasks):
            agent_type = task.get("agent", workflow_type)
            step = {
                "id": f"step_{i+1}",
                "agent": agent_type,
                "task": task,
                "dependencies": task.get("dependencies", []),
            }
            workflow_steps.append(step)

        workflow_id = orchestrator.create_workflow(
            f"Enterprise Automation - {workflow_type}", workflow_steps
        )

        # Execute workflow
        await Actor.set_status_message(f"Executing workflow: {workflow_id}")
        result = orchestrator.execute_workflow(workflow_id, parallel=parallel)

        # Format results for Apify
        apify_results = []

        if result.get("status") == "completed":
            for step_id, step_result in result.get("results", {}).items():
                apify_result = {
                    "workflow_id": workflow_id,
                    "step_id": step_id,
                    "status": step_result.get("status"),
                    "agent": step_result.get("agent"),
                    "result": step_result.get("result", {}),
                    "duration": step_result.get("duration", 0),
                    "timestamp": step_result.get("timestamp"),
                }

                # Add SEO/AEO scores if available
                if "seo_score" in step_result.get("result", {}):
                    apify_result["seo_score"] = step_result["result"]["seo_score"]
                if "aeo_score" in step_result.get("result", {}):
                    apify_result["aeo_score"] = step_result["result"]["aeo_score"]

                apify_results.append(apify_result)
        else:
            apify_results.append(
                {
                    "workflow_id": workflow_id,
                    "status": "failed",
                    "error": result.get("error", "Unknown error"),
                }
            )

        # Push results (monetization: Pay-per-Result)
        await Actor.push_data(apify_results)

        # Set final status
        await Actor.set_status_message(
            f"Completed: {len(apify_results)} results generated"
        )

        # Add summary
        await Actor.push_data(
            [
                {
                    "summary": {
                        "workflow_id": workflow_id,
                        "total_steps": len(workflow_steps),
                        "results_count": len(apify_results),
                        "success_rate": len(
                            [r for r in apify_results if r.get("status") == "success"]
                        )
                        / max(len(apify_results), 1)
                        * 100,
                    }
                }
            ]
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
