#!/usr/bin/env python3
"""
Enterprise AI Agents - Base Agent Class

Foundation for all enterprise automation agents with:
- Task management
- Error handling with retry logic
- Comprehensive logging
- State management
- Performance metrics
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
import json
import logging
from enum import Enum
import time
import uuid

class AgentStatus(Enum):
    """Agent execution status."""
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"
    PAUSED = "paused"

class BaseAgent(ABC):
    """Base class for all enterprise AI agents."""

    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.agent_id = str(uuid.uuid4())[:8]
        self.config = config or {}
        self.status = AgentStatus.IDLE
        self.tasks_completed = 0
        self.tasks_failed = 0
        self.start_time = None
        self.end_time = None
        self.logger = self._setup_logger()
        self.results = []
        self.errors = []
        self.metrics = {
            'total_executions': 0,
            'success_rate': 0.0,
            'avg_execution_time': 0.0,
            'last_execution': None
        }

    def _setup_logger(self) -> logging.Logger:
        """Setup agent-specific logger."""
        logger = logging.getLogger(f"EnterpriseAgent.{self.name}")
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                f'%(asctime)s - {self.name}[{self.agent_id}] - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
        return logger

    @abstractmethod
    def execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a task. Must be implemented by subclasses.

        Args:
            task: Task dictionary with required parameters

        Returns:
            Dictionary with execution results
        """
        pass

    def run(self, task: Dict[str, Any], max_retries: int = 3) -> Dict[str, Any]:
        """
        Run agent with retry logic and error handling.

        Args:
            task: Task to execute
            max_retries: Maximum number of retry attempts

        Returns:
            Execution result with status and data
        """
        self.status = AgentStatus.RUNNING
        self.start_time = datetime.now()
        task_id = task.get('id', str(uuid.uuid4())[:8])
        self.logger.info(f"Starting task: {task_id}")

        for attempt in range(max_retries + 1):
            try:
                result = self.execute(task)
                self.status = AgentStatus.COMPLETED
                self.tasks_completed += 1
                self.end_time = datetime.now()
                duration = (self.end_time - self.start_time).total_seconds()

                # Update metrics
                self.metrics['total_executions'] += 1
                self.metrics['last_execution'] = datetime.now().isoformat()
                if self.metrics['total_executions'] > 0:
                    self.metrics['success_rate'] = (
                        self.tasks_completed /
                        (self.tasks_completed + self.tasks_failed) * 100
                    )
                    # Update average execution time
                    total_time = self.metrics['avg_execution_time'] * (self.metrics['total_executions'] - 1)
                    self.metrics['avg_execution_time'] = (total_time + duration) / self.metrics['total_executions']

                self.results.append({
                    'task_id': task_id,
                    'result': result,
                    'duration': duration,
                    'timestamp': datetime.now().isoformat()
                })

                self.logger.info(f"Task {task_id} completed successfully in {duration:.2f}s")
                return {
                    'status': 'success',
                    'agent': self.name,
                    'agent_id': self.agent_id,
                    'task_id': task_id,
                    'result': result,
                    'attempts': attempt + 1,
                    'duration': duration,
                    'timestamp': datetime.now().isoformat()
                }
            except Exception as e:
                self.logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
                self.errors.append({
                    'attempt': attempt + 1,
                    'error': str(e),
                    'error_type': type(e).__name__,
                    'task': task,
                    'timestamp': datetime.now().isoformat()
                })

                if attempt < max_retries:
                    self.status = AgentStatus.RETRYING
                    wait_time = 2 ** attempt  # Exponential backoff
                    self.logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    self.status = AgentStatus.FAILED
                    self.tasks_failed += 1
                    self.end_time = datetime.now()
                    duration = (self.end_time - self.start_time).total_seconds()

                    # Update metrics
                    self.metrics['total_executions'] += 1
                    if self.metrics['total_executions'] > 0:
                        self.metrics['success_rate'] = (
                            self.tasks_completed /
                            (self.tasks_completed + self.tasks_failed) * 100
                        )

                    return {
                        'status': 'failed',
                        'agent': self.name,
                        'agent_id': self.agent_id,
                        'task_id': task_id,
                        'error': str(e),
                        'error_type': type(e).__name__,
                        'attempts': attempt + 1,
                        'duration': duration,
                        'timestamp': datetime.now().isoformat()
                    }

        return {'status': 'failed', 'agent': self.name}

    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive agent statistics."""
        return {
            'name': self.name,
            'agent_id': self.agent_id,
            'status': self.status.value,
            'tasks_completed': self.tasks_completed,
            'tasks_failed': self.tasks_failed,
            'total_tasks': self.tasks_completed + self.tasks_failed,
            'success_rate': round(
                self.tasks_completed / max(self.tasks_completed + self.tasks_failed, 1) * 100,
                2
            ),
            'errors': len(self.errors),
            'metrics': self.metrics,
            'last_result': self.results[-1] if self.results else None,
            'last_error': self.errors[-1] if self.errors else None
        }

    def reset(self):
        """Reset agent state."""
        self.status = AgentStatus.IDLE
        self.tasks_completed = 0
        self.tasks_failed = 0
        self.results = []
        self.errors = []
        self.start_time = None
        self.end_time = None
        self.metrics = {
            'total_executions': 0,
            'success_rate': 0.0,
            'avg_execution_time': 0.0,
            'last_execution': None
        }
        self.logger.info("Agent state reset")
