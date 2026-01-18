"""Notebook data models."""

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator, HttpUrl


class NotebookMetadata(BaseModel):
    """Metadata for a NotebookLM notebook."""

    topics: List[str] = Field(default_factory=list, description="Notebook topics")
    content_types: List[str] = Field(
        default_factory=list, description="Types of content in notebook"
    )
    use_cases: List[str] = Field(
        default_factory=list, description="Use cases for this notebook"
    )
    tags: List[str] = Field(default_factory=list, description="Custom tags")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Last update timestamp"
    )
    use_count: int = Field(default=0, description="Number of times used")
    last_used: Optional[datetime] = Field(
        default=None, description="Last usage timestamp"
    )
    source_count: Optional[int] = Field(
        default=None, description="Number of sources in notebook"
    )
    notes: Optional[str] = Field(default=None, description="Additional notes")

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}


class Notebook(BaseModel):
    """NotebookLM notebook model."""

    id: str = Field(..., description="Unique notebook identifier")
    name: str = Field(..., description="Notebook name")
    url: str = Field(..., description="NotebookLM URL")
    description: Optional[str] = Field(
        default=None, description="Notebook description"
    )
    topics: List[str] = Field(default_factory=list, description="Notebook topics")
    content_types: List[str] = Field(
        default_factory=list, description="Content types"
    )
    use_cases: List[str] = Field(default_factory=list, description="Use cases")
    tags: List[str] = Field(default_factory=list, description="Tags")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Update timestamp"
    )
    use_count: int = Field(default=0, description="Usage count")
    last_used: Optional[datetime] = Field(default=None, description="Last used")

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        """Validate NotebookLM URL format."""
        if not v.startswith("https://notebooklm.google.com/"):
            raise ValueError("URL must be a valid NotebookLM URL")
        return v

    @field_validator("id")
    @classmethod
    def validate_id(cls, v: str) -> str:
        """Validate notebook ID format."""
        if not v or not v.strip():
            raise ValueError("Notebook ID cannot be empty")
        # Replace invalid characters
        return v.strip().lower().replace(" ", "-")

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}

    def increment_usage(self) -> None:
        """Increment usage count and update last_used timestamp."""
        self.use_count += 1
        self.last_used = datetime.now()
        self.updated_at = datetime.now()

    def add_topics(self, *topics: str) -> None:
        """Add topics to notebook."""
        for topic in topics:
            if topic not in self.topics:
                self.topics.append(topic)
        self.updated_at = datetime.now()

    def add_tags(self, *tags: str) -> None:
        """Add tags to notebook."""
        for tag in tags:
            if tag not in self.tags:
                self.tags.append(tag)
        self.updated_at = datetime.now()

    def to_dict(self) -> dict:
        """Convert to dictionary with ISO format dates."""
        return self.model_dump(mode="json")

    @classmethod
    def from_dict(cls, data: dict) -> "Notebook":
        """Create notebook from dictionary."""
        # Convert ISO strings back to datetime
        if isinstance(data.get("created_at"), str):
            data["created_at"] = datetime.fromisoformat(data["created_at"])
        if isinstance(data.get("updated_at"), str):
            data["updated_at"] = datetime.fromisoformat(data["updated_at"])
        if isinstance(data.get("last_used"), str):
            data["last_used"] = datetime.fromisoformat(data["last_used"])

        return cls(**data)


class Library(BaseModel):
    """NotebookLM library containing multiple notebooks."""

    notebooks: Dict[str, Notebook] = Field(
        default_factory=dict, description="Notebooks indexed by ID"
    )
    active_notebook_id: Optional[str] = Field(
        default=None, description="Currently active notebook ID"
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Library last update time"
    )
    version: str = Field(default="1.0", description="Library format version")

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}

    def add_notebook(self, notebook: Notebook) -> None:
        """
        Add notebook to library.

        Args:
            notebook: Notebook to add

        Raises:
            ValueError: If notebook with same ID already exists
        """
        if notebook.id in self.notebooks:
            raise ValueError(f"Notebook with ID '{notebook.id}' already exists")

        self.notebooks[notebook.id] = notebook
        self.updated_at = datetime.now()

        # Set as active if it's the first notebook
        if len(self.notebooks) == 1:
            self.active_notebook_id = notebook.id

    def remove_notebook(self, notebook_id: str) -> None:
        """
        Remove notebook from library.

        Args:
            notebook_id: ID of notebook to remove

        Raises:
            KeyError: If notebook not found
        """
        if notebook_id not in self.notebooks:
            raise KeyError(f"Notebook with ID '{notebook_id}' not found")

        del self.notebooks[notebook_id]
        self.updated_at = datetime.now()

        # Clear active if removed notebook was active
        if self.active_notebook_id == notebook_id:
            self.active_notebook_id = (
                next(iter(self.notebooks.keys())) if self.notebooks else None
            )

    def get_notebook(self, notebook_id: str) -> Optional[Notebook]:
        """
        Get notebook by ID.

        Args:
            notebook_id: Notebook ID to retrieve

        Returns:
            Notebook if found, None otherwise
        """
        return self.notebooks.get(notebook_id)

    def set_active(self, notebook_id: str) -> None:
        """
        Set active notebook.

        Args:
            notebook_id: ID of notebook to set as active

        Raises:
            KeyError: If notebook not found
        """
        if notebook_id not in self.notebooks:
            raise KeyError(f"Notebook with ID '{notebook_id}' not found")

        self.active_notebook_id = notebook_id
        self.updated_at = datetime.now()

    def get_active_notebook(self) -> Optional[Notebook]:
        """
        Get currently active notebook.

        Returns:
            Active notebook if set, None otherwise
        """
        if self.active_notebook_id:
            return self.notebooks.get(self.active_notebook_id)
        return None

    def search(self, query: str) -> List[Notebook]:
        """
        Search notebooks by query string.

        Args:
            query: Search query

        Returns:
            List of matching notebooks
        """
        query_lower = query.lower()
        results = []

        for notebook in self.notebooks.values():
            # Search in name, description, topics, tags
            if (
                query_lower in notebook.name.lower()
                or (notebook.description and query_lower in notebook.description.lower())
                or any(query_lower in topic.lower() for topic in notebook.topics)
                or any(query_lower in tag.lower() for tag in notebook.tags)
            ):
                results.append(notebook)

        return results

    def to_dict(self) -> dict:
        """Convert library to dictionary."""
        return {
            "notebooks": {
                nid: nb.to_dict() for nid, nb in self.notebooks.items()
            },
            "active_notebook_id": self.active_notebook_id,
            "updated_at": self.updated_at.isoformat(),
            "version": self.version,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Library":
        """Create library from dictionary."""
        # Convert notebook dicts to Notebook objects
        notebooks = {
            nid: Notebook.from_dict(nb_data)
            for nid, nb_data in data.get("notebooks", {}).items()
        }

        # Convert ISO string to datetime
        updated_at = data.get("updated_at")
        if isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at)
        else:
            updated_at = datetime.now()

        return cls(
            notebooks=notebooks,
            active_notebook_id=data.get("active_notebook_id"),
            updated_at=updated_at,
            version=data.get("version", "1.0"),
        )
