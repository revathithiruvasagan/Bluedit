from supabase import create_client, Client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://mmuwozizzhkazvzhzcle.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdXdveml6emhrYXp2emh6Y2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjczNTQsImV4cCI6MjA3NjA0MzM1NH0.9ig4IEHdVOpaNl6fiG-nuOEO9ci6-TxbTYNr_Aj7pm0")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
