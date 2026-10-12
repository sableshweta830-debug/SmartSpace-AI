"""
MongoDB Database Connection for SmartSpace AI.
Uses pymongo (sync) for FastAPI dependency injection.
Collections replace SQL tables:
  - profiles
  - user_intents
  - workspaces
  - workspace_components
  - tasks
  - workspace_configurations
  - user_preferences
  - activity_logs
  - project_tasks
"""

from pymongo import MongoClient
from pymongo.database import Database
from app.core.config import settings

# ── Singleton MongoClient ────────────────────────────────────────────────────
_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
    return _client


def get_database() -> Database:
    """Return the primary MongoDB database instance."""
    return get_client()[settings.MONGODB_DB_NAME]


# ── FastAPI dependency ────────────────────────────────────────────────────────
def get_db() -> Database:
    """
    FastAPI dependency — yields MongoDB database.
    Use as:  db: Database = Depends(get_db)
    """
    return get_database()


# ── Collection helpers ────────────────────────────────────────────────────────
def col(name: str):
    """Shortcut: get a collection by name."""
    return get_database()[name]
