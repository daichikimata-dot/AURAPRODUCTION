import os
import sys
from utils.db import SupabaseManager

def add_source():
    try:
        db = SupabaseManager()
        print("Connected to Supabase.")
        
        # Check if source already exists
        existing = db.client.table("sources").select("*").eq("url", "https://news.yahoo.co.jp/categories/life").execute()
        if existing.data:
            print("Sample source already exists.")
            return

        # Add sample source (Yahoo News Life/Beauty category as an example)
        source_data = {
            "name": "Yahoo News (Life)",
            "url": "https://news.yahoo.co.jp/categories/life",
            "type": "japanese_media",
            "is_active": True
        }
        
        db.client.table("sources").insert(source_data).execute()
        print(f"Successfully added source: {source_data['name']}")
        
    except Exception as e:
        print(f"Error adding source: {e}")

if __name__ == "__main__":
    add_source()
