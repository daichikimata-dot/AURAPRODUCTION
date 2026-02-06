import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseManager:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Supabase credentials not found in environment variables.")
        self.client: Client = create_client(url, key)

    def insert_article(self, article_data):
        """Inserts a new article draft."""
        return self.client.table("articles").insert(article_data).execute()

    def get_sources(self):
        """Retrieves active sources."""
        return self.client.table("sources").select("*").eq("is_active", True).execute()
    
    def get_categories(self):
        """Retrieves categories."""
        return self.client.table("categories").select("id, name, slug").execute()

    def fetch_articles_by_status(self, status='draft'):
        """Fetches articles by status."""
        return self.client.table("articles").select("*").eq("status", status).execute()

    def update_article_status(self, article_id, status):
        """Updates article status."""
        return self.client.table("articles").update({"status": status}).eq("id", article_id).execute()

if __name__ == "__main__":
    # Test connection
    try:
        db = SupabaseManager()
        print("Supabase connection successful.")
    except Exception as e:
        print(f"Supabase connection failed: {e}")
