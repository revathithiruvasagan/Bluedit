from supabase import create_client, Client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "postgresql://postgres:[remo]@db.mmuwozizzhkazvzhzcle.supabase.co:5432/postgres")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "your-anon-key")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
