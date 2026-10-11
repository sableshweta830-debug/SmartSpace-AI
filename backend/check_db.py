"""
Database Connection Diagnostic Tool for Intent-to-Interface.
Tests connection to Supabase / PostgreSQL or SQLite and reports status.
"""

import sys
from app.core.config import settings
from app.database import engine
from sqlalchemy import text


def check():
    url = settings.DATABASE_URL
    print("\n" + "=" * 60)
    print("  SmartSpace AI - Database Connection Diagnostic")
    print("=" * 60)

    # Mask password for safe display
    masked_url = url
    if "@" in url:
        parts = url.split("@")
        credentials = parts[0].split(":")
        if len(credentials) >= 3:
            masked_url = f"{credentials[0]}:{credentials[1]}:****@{parts[1]}"

    print(f"Target Database URL: {masked_url}")

    if "apna_password" in url or "db.xxxx.supabase.co" in url:
        print("\n❌ ERROR: Placeholder detected in your .env / backend.env file!")
        print("Aapne file mein placeholder daala hai:")
        print("  - 'apna_password' ki jagah apna ACTUAL Supabase password daalein.")
        print("  - 'db.xxxx.supabase.co' ki jagah apna ACTUAL Supabase project URL daalein.")
        print("\nSupabase Dashboard -> Settings -> Database -> Connection string (URI) se copy karein.")
        print("=" * 60 + "\n")
        return False

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1;")).scalar()
            dialect = engine.dialect.name
            print(f"\n✅ SUCCESS: Database connected successfully!")
            print(f"Database Type: {dialect.upper()}")

            if dialect == "postgresql":
                tables = conn.execute(
                    text(
                        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
                    )
                ).fetchall()
                table_names = [t[0] for t in tables]
                print(f"Supabase Tables Found ({len(table_names)}): {table_names}")
            else:
                tables = conn.execute(
                    text("SELECT name FROM sqlite_master WHERE type='table';")
                ).fetchall()
                table_names = [t[0] for t in tables]
                print(f"SQLite Tables Found ({len(table_names)}): {table_names}")

            print("=" * 60 + "\n")
            return True
    except Exception as e:
        print(f"\n❌ FAILED TO CONNECT:")
        print(f"Error: {e}")
        print("=" * 60 + "\n")
        return False


if __name__ == "__main__":
    success = check()
    sys.exit(0 if success else 1)
