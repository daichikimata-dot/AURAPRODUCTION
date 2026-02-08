import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../web/.env.local"))

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing credentials")
    sys.exit(1)

supabase: Client = create_client(url, key)

# SQL to create table
sql = """
create table if not exists crawled_articles (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references sources(id),
  title text,
  content text,
  url text unique not null,
  crawled_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policy (might fail if exists, wrap in do block or ignore error)
do $$
begin
  if not exists (select from pg_policies where tablename = 'crawled_articles' and policyname = 'Authenticated users can do everything') then
      alter table crawled_articles enable row level security;
      create policy "Authenticated users can do everything" on crawled_articles for all using (auth.role() = 'authenticated');
  end if;
end
$$;
"""

try:
    # Use rpc if available or direct sql execution via some client extension if supported. 
    # Supabase-py doesn't support raw SQL directly on some tiers/versions without a stored procedure.
    # However, 'postgres' generic query might work if using a postgres client.
    # But often we can just use the 'rest' api to create if we use the platform API.
    # Actually, simplest way for an Agent is to assume there's a way.
    # If not, I can create a stored procedure via the dashboard? No UI access.
    # Using `pg8000` or `psycopg2` if available?
    
    # Check if we can use a "rpc" that executes sql? Usually dangerous and disabled.
    # Alternative: check if table exists by selecting?
    
    print("Attempting to verify table existence via SELECT...")
    res = supabase.table("crawled_articles").select("count", count="exact").execute()
    print("Table exists.")
    
except Exception as e:
    print(f"Table might not exist or verify failed: {e}")
    print("NOTE: The Python client cannot execute raw CREATE TABLE statements. Please run 'engine/apply_media_schema.sql' in the Supabase Dashboard SQL Editor.")
    # For now, I will proceed assuming the user might run it, or I'll implement the logic without it first (mocking DB calls if needed).
    # But actually, I can't build the feature without the table.
    # I will ask the user to run the SQL or use a workaround.
    # Workaround: Use the 'psycopg2' library if installed?
    pass
