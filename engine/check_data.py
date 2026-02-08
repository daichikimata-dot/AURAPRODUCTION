import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")
    print(f"URL: {url}")
    print(f"Key: {'*' * 5 if key else 'None'}")
    # Try looking for other keys
    key = os.environ.get("SUPABASE_KEY")
    if not key:
        sys.exit(1)

try:
    supabase: Client = create_client(url, key)
    
    # Check Articles
    print("\n--- Articles ---")
    response = supabase.table("articles").select("id, title, status, created_at").execute()
    articles = response.data
    print(f"Total: {len(articles)}")
    
    counts = {}
    for a in articles:
        status = a.get('status', 'unknown')
        counts[status] = counts.get(status, 0) + 1
        print(f"[{status}] {a.get('title')} ({a.get('created_at')})")
        
    print(f"Counts: {counts}")

except Exception as e:
    print(f"Error: {e}")
