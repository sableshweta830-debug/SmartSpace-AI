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
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./workspace.db")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    
    # AI API configuration
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    
    # Demo User ID
    DEMO_USER_ID: str = "demo_user"

settings = Settings()
