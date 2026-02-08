import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Missing credentials")
    sys.exit(1)

supabase: Client = create_client(url, key)

# Get first draft article
response = supabase.table("articles").select("id, title").eq("status", "draft").limit(1).execute()
if not response.data:
    print("No draft articles found")
    sys.exit(0)

article = response.data[0]
print(f"Publishing article: {article['title']} ({article['id']})")

# Update to published
import datetime
now = datetime.datetime.now(datetime.timezone.utc).isoformat()
res = supabase.table("articles").update({"status": "published", "published_at": now}).eq("id", article['id']).execute()

print("Updated:", res.data)
