"""Profile data models for multi-account support."""

from datetime import datetime
from pathlib import Path
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ProfileMetadata(BaseModel):
    """Metadata for a user profile."""

    name: str = Field(..., description="Profile display name")
    email: str = Field(..., description="Associated email address")
    description: Optional[str] = Field(default=None, description="Profile description")
    github_username: Optional[str] = Field(
        default=None, description="Associated GitHub username"
    )
    created_at: datetime = Field(
        default_factory=datetime.now, description="Profile creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Profile update timestamp"
    )
    last_used: Optional[datetime] = Field(
        default=None, description="Last usage timestamp"
    )
    use_count: int = Field(default=0, description="Number of times used")
    settings: dict = Field(default_factory=dict, description="Profile-specific settings")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Basic email validation."""
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v.lower()

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}


class Profile(BaseModel):
    """User profile for multi-account support."""

    id: str = Field(..., description="Unique profile identifier")
    name: str = Field(..., description="Profile name")
    email: str = Field(..., description="Profile email")
    description: Optional[str] = Field(default=None, description="Profile description")
    github_username: Optional[str] = Field(
        default=None, description="GitHub username"
    )
    profile_dir: Path = Field(..., description="Profile data directory")
    created_at: datetime = Field(
        default_factory=datetime.now, description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.now, description="Update timestamp"
    )
    last_used: Optional[datetime] = Field(default=None, description="Last used")
    use_count: int = Field(default=0, description="Usage count")
    is_active: bool = Field(default=False, description="Whether profile is active")

    @field_validator("id")
    @classmethod
    def validate_id(cls, v: str) -> str:
        """Validate profile ID format."""
        if not v or not v.strip():
            raise ValueError("Profile ID cannot be empty")
        # Replace invalid characters
        return v.strip().lower().replace(" ", "-")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        """Basic email validation."""
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email format")
        return v.lower()

    class Config:
        """Pydantic configuration."""

        json_encoders = {datetime: lambda v: v.isoformat()}
        arbitrary_types_allowed = True

    def increment_usage(self) -> None:
        """Increment usage count and update last_used timestamp."""
        self.use_count += 1
        self.last_used = datetime.now()
        self.updated_at = datetime.now()

    def get_library_path(self) -> Path:
        """Get path to profile's library.json."""
        return self.profile_dir / "library.json"

    def get_auth_path(self) -> Path:
        """Get path to profile's auth_info.json."""
        return self.profile_dir / "auth_info.json"

    def get_browser_state_path(self) -> Path:
        """Get path to profile's browser_state directory."""
        return self.profile_dir / "browser_state"

    def get_metadata_path(self) -> Path:
        """Get path to profile's metadata file."""
        return self.profile_dir / "profile_metadata.json"

    def to_dict(self) -> dict:
        """Convert to dictionary with serializable types."""
        data = self.model_dump(mode="json")
        data["profile_dir"] = str(self.profile_dir)
        return data

    @classmethod
    def from_dict(cls, data: dict) -> "Profile":
        """Create profile from dictionary."""
        # Convert ISO strings back to datetime
        if isinstance(data.get("created_at"), str):
            data["created_at"] = datetime.fromisoformat(data["created_at"])
        if isinstance(data.get("updated_at"), str):
            data["updated_at"] = datetime.fromisoformat(data["updated_at"])
        if isinstance(data.get("last_used"), str):
            data["last_used"] = datetime.fromisoformat(data["last_used"])

        # Convert string path to Path
        if isinstance(data.get("profile_dir"), str):
            data["profile_dir"] = Path(data["profile_dir"])

        return cls(**data)

    def to_metadata(self) -> ProfileMetadata:
        """Convert profile to metadata object."""
        return ProfileMetadata(
            name=self.name,
            email=self.email,
            description=self.description,
            github_username=self.github_username,
            created_at=self.created_at,
            updated_at=self.updated_at,
            last_used=self.last_used,
            use_count=self.use_count,
        )

    @classmethod
    def from_metadata(
        cls, profile_id: str, metadata: ProfileMetadata, profile_dir: Path
    ) -> "Profile":
        """Create profile from metadata."""
        return cls(
            id=profile_id,
            name=metadata.name,
            email=metadata.email,
            description=metadata.description,
            github_username=metadata.github_username,
            profile_dir=profile_dir,
            created_at=metadata.created_at,
            updated_at=metadata.updated_at,
            last_used=metadata.last_used,
            use_count=metadata.use_count,
        )
