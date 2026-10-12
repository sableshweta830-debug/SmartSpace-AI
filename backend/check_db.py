"""
MongoDB Connection Diagnostic Tool for SmartSpace AI.
Tests connection to MongoDB Atlas (or local) and reports status.
"""

import sys
from app.core.config import settings


def check():
    uri = settings.MONGODB_URI
    db_name = settings.MONGODB_DB_NAME

    print("\n" + "=" * 60)
    print("  SmartSpace AI - MongoDB Connection Diagnostic")
    print("=" * 60)

    # Mask password for safe display
    masked_uri = uri
    if "@" in uri:
        at_idx = uri.rfind("@")
        proto_end = uri.find("://") + 3
        credentials = uri[proto_end:at_idx]
        host_part = uri[at_idx + 1:]
        user = credentials.split(":")[0]
        masked_uri = f"{uri[:proto_end]}{user}:****@{host_part}"

    print(f"MongoDB URI  : {masked_uri}")
    print(f"Database Name: {db_name}")

    # Detect placeholder
    if "your_password" in uri or "xxxx" in uri or "username:password" in uri:
        print("[ERROR] Placeholder URI detected in backend.env!")
        print("  MONGODB_URI mein apna actual MongoDB Atlas connection string daalein.")
        print("  MongoDB Atlas → Connect → Drivers → Copy URI")
        print("=" * 60 + "\n")
        return False

    try:
        from pymongo import MongoClient

        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Force a real connection
        client.admin.command("ping")

        db = client[db_name]
        collections = db.list_collection_names()

        print(f"\n[OK] SUCCESS: MongoDB connected successfully!")
        print(f"Collections Found ({len(collections)}): {collections if collections else '(empty — will be created on first use)'}")
        print("=" * 60 + "\n")
        client.close()
        return True

    except Exception as e:
        print(f"\n[FAIL] FAILED TO CONNECT:")
        print(f"Error: {e}")
        print("\nCheck karo:")
        print("  1. MONGODB_URI sahi hai? (backend.env mein)")
        print("  2. MongoDB Atlas mein IP whitelist mein 0.0.0.0/0 add hai?")
        print("  3. Username/password correct hai?")
        print("=" * 60 + "\n")
        return False


if __name__ == "__main__":
    success = check()
    sys.exit(0 if success else 1)
