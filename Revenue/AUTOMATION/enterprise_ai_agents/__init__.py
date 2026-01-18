"""
Enterprise AI Agents Framework

High-revenue automation system targeting top SEO/AEO keywords:
- AI Agents Framework (250%+ growth, 94/100 SEO/AEO)
- Enterprise Automation (high enterprise value)
- Multi-Agent Systems (trending)
- Task Orchestration (enterprise focus)

Monetization:
- Apify Actors: $0.50-2.00 per execution
- SaaS: $99-499/month
- Gumroad: $199-999 one-time
- Enterprise: Custom pricing
"""

__version__ = "1.0.0"
__author__ = "Steven Chaplinski | QuantumForgeLabs"

from .agent_base import BaseAgent, AgentStatus
from .agent_orchestrator import AgentOrchestrator
from .enterprise_agents import (
    ResearchAgent,
    ContentAgent,
    AutomationAgent,
    AnalyticsAgent,
    IntegrationAgent
)

__all__ = [
    'BaseAgent',
    'AgentStatus',
    'AgentOrchestrator',
    'ResearchAgent',
    'ContentAgent',
    'AutomationAgent',
    'AnalyticsAgent',
    'IntegrationAgent'
]
