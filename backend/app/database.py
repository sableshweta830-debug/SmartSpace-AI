import re
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Normalize Postgres dialect for SQLAlchemy 2.0 (postgres:// -> postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

is_sqlite = "sqlite" in db_url.lower()

# SQLite specific connect args
connect_args = {"check_same_thread": False} if is_sqlite else {}

# Engine configuration with Supabase / PostgreSQL resilience
engine_kwargs = {
    "connect_args": connect_args,
    "echo": False
}

if not is_sqlite:
    # Supabase connection resilience
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(db_url, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
