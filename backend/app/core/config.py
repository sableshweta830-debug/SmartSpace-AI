import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env or backend.env if present
backend_dir = Path(__file__).resolve().parent.parent.parent
for env_file in [backend_dir / ".env", backend_dir / "backend.env", backend_dir.parent / ".env"]:
    if env_file.exists():
        load_dotenv(dotenv_path=env_file)

class Settings:
    PROJECT_NAME: str = "Intent-to-Interface: Adaptive AI Workspace"
    PROJECT_TAGLINE: str = "An interface that adapts to your intent, not the other way around."
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # ─── MongoDB Configuration ────────────────────────────────────────────────
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "smartspace_ai")

    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

    # ─── AI API configuration ─────────────────────────────────────────────────
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")   # 'gemini' | 'openai'
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # Demo User ID
    DEMO_USER_ID: str = "demo_user"

settings = Settings()
