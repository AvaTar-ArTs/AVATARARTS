"""Query and response data models."""

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class QueryResult(BaseModel):
    """Result from a NotebookLM query."""

    question: str = Field(..., description="The question asked")
    answer: str = Field(..., description="The answer received")
    notebook_id: str = Field(..., description="Notebook queried")
    notebook_name: str = Field(..., description="Notebook name")
    timestamp: datetime = Field(
        default_factory=datetime.now, description="Query timestamp"
    )
    response_time: Optional[float] = Field(
        default=None, description="Response time in seconds"
    )
    sources: List[str] = Field(
        default_factory=list, description="Source citations from answer"
    )
    follow_up_suggested: bool = Field(
        default=False, description="Whether follow-up was suggested"
    )
    success: bool = Field(default=True, description="Whether query was successful")
    error_message: Optional[str] = Field(default=None, description="Error if failed")

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump(mode="json")

    @classmethod
    def from_dict(cls, data: dict) -> "QueryResult":
        """Create from dictionary."""
        if isinstance(data.get("timestamp"), str):
            data["timestamp"] = datetime.fromisoformat(data["timestamp"])
        return cls(**data)


class Query(BaseModel):
    """A query to be executed against NotebookLM."""

    question: str = Field(..., description="Question to ask")
    notebook_id: Optional[str] = Field(
        default=None, description="Target notebook ID (None = active)"
    )
    max_retries: int = Field(default=3, description="Maximum retry attempts")
    timeout: int = Field(default=60, description="Query timeout in seconds")
    follow_up_prompt: Optional[str] = Field(
        default=None, description="Follow-up prompt after answer"
    )
    context: Dict[str, str] = Field(
        default_factory=dict, description="Additional context for query"
    )
    metadata: Dict[str, str] = Field(
        default_factory=dict, description="Query metadata"
    )

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()


class QueryHistory(BaseModel):
    """History of queries and results."""

    queries: List[QueryResult] = Field(
        default_factory=list, description="List of query results"
    )
    total_queries: int = Field(default=0, description="Total number of queries")
    total_success: int = Field(default=0, description="Number of successful queries")
    total_failed: int = Field(default=0, description="Number of failed queries")
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Last update timestamp"
    )

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}

    def add_query(self, result: QueryResult) -> None:
        """Add a query result to history."""
        self.queries.append(result)
        self.total_queries += 1

        if result.success:
            self.total_success += 1
        else:
            self.total_failed += 1

        self.updated_at = datetime.now()

    def get_recent(self, limit: int = 10) -> List[QueryResult]:
        """Get recent query results."""
        return self.queries[-limit:]

    def get_by_notebook(self, notebook_id: str) -> List[QueryResult]:
        """Get queries for a specific notebook."""
        return [q for q in self.queries if q.notebook_id == notebook_id]

    def get_failed(self) -> List[QueryResult]:
        """Get all failed queries."""
        return [q for q in self.queries if not q.success]

    def get_statistics(self) -> dict:
        """Get query statistics."""
        if not self.queries:
            return {
                "total": 0,
                "success": 0,
                "failed": 0,
                "success_rate": 0.0,
                "avg_response_time": 0.0,
            }

        response_times = [
            q.response_time for q in self.queries if q.response_time is not None
        ]
        avg_response_time = (
            sum(response_times) / len(response_times) if response_times else 0.0
        )

        return {
            "total": self.total_queries,
            "success": self.total_success,
            "failed": self.total_failed,
            "success_rate": (
                self.total_success / self.total_queries if self.total_queries > 0 else 0.0
            ),
            "avg_response_time": avg_response_time,
        }

    def clear(self) -> None:
        """Clear all query history."""
        self.queries = []
        self.total_queries = 0
        self.total_success = 0
        self.total_failed = 0
        self.updated_at = datetime.now()

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            "queries": [q.to_dict() for q in self.queries],
            "total_queries": self.total_queries,
            "total_success": self.total_success,
            "total_failed": self.total_failed,
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "QueryHistory":
        """Create from dictionary."""
        queries = [
            QueryResult.from_dict(q) for q in data.get("queries", [])
        ]

        updated_at = data.get("updated_at")
        if isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at)
        else:
            updated_at = datetime.now()

        return cls(
            queries=queries,
            total_queries=data.get("total_queries", len(queries)),
            total_success=data.get("total_success", 0),
            total_failed=data.get("total_failed", 0),
            updated_at=updated_at,
        )
