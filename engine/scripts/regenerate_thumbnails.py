
import os
import sys
import asyncio
import logging

# Add engine directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.db import SupabaseManager
from generator.generator import AIGenerator

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def regenerate_thumbnails():
    logger.info("Starting thumbnail regeneration...")
    
    try:
        db = SupabaseManager()
        generator = AIGenerator()
        
        # Fetch all articles that might have broken thumbnails.
        # Check for NULL or local paths (starting with /generated/)
        # Supabase client doesn't support complex OR conditions easily in one go with 'like', 
        # so let's fetch all and filter in python for this batch job.
        
        response = db.client.table("articles").select("id, title, thumbnail_url").execute()
        articles = response.data
        
        if not articles:
            logger.info("No articles found.")
            return

        logger.info(f"Found {len(articles)} articles. Checking for broken thumbnails...")
        
        count = 0
        for article in articles:
            aid = article['id']
            title = article['title']
            url = article.get('thumbnail_url')
            
            # Condition to regenerate:
            # 1. URL is None/Empty
            # 2. URL matches local pattern (starts with /generated or contains localhost)
            # 3. URL is not from Supabase (optional check)
            
            needs_regen = False
            if not url:
                needs_regen = True
            elif url.startswith("/generated"):
                needs_regen = True
            elif "localhost" in url:
                needs_regen = True
            elif "127.0.0.1" in url:
                needs_regen = True
            # Check for Render internal URL?
            elif "onrender.com" in url and "/generated/" in url:
                 # This might be the broken one if it was pointing to ephemeral storage
                 needs_regen = True
                 
            if needs_regen:
                logger.info(f"Regenerating thumbnail for: {title} (ID: {aid}) - Old URL: {url}")
                
                # Generate new image
                # We use the title as the keyword/prompt for the image
                new_url = await generator.generate_image(keyword=title)
                
                if new_url:
                    # Update DB
                    db.client.table("articles").update({"thumbnail_url": new_url}).eq("id", aid).execute()
                    logger.info(f"Updated thumbnail: {new_url}")
                    count += 1
                    # Sleep to avoid rate limits?
                    await asyncio.sleep(2) 
                else:
                    logger.error(f"Failed to generate image for {title}")
            else:
                logger.info(f"Skipping {title}: Thumbnail looks valid ({url})")

        logger.info(f"Thumbnail regeneration completed. Updated {count} articles.")

    except Exception as e:
        logger.error(f"Regeneration failed: {e}")

if __name__ == "__main__":
    asyncio.run(regenerate_thumbnails())
