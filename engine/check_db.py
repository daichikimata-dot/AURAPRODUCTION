from utils.db import SupabaseManager

def check_articles():
    try:
        db = SupabaseManager()
        print("Connected to Supabase.")
        
        # Fetch all articles
        res = db.client.table("articles").select("*").execute()
        
        if res.data:
            print(f"Found {len(res.data)} articles:")
            for article in res.data:
                print(f"- [{article['id']}] {article['title']} (Status: {article['status']})")
        else:
            print("No articles found in the database.")
            
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_articles()
