import asyncio
import argparse
import logging
from utils.db import SupabaseManager
from crawler.crawler import BeautyCrawler
from generator.generator import AIGenerator
from utils.line_notifier import LineNotifier

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def run_pipeline(source_url=None, mock=False):
    """Runs the full content generation pipeline."""
    # Initialize components
    # Logic: If mock is True, we tolerate missing keys for some components
    db = None
    try:
        db = SupabaseManager()
    except Exception as e:
        if mock:
             logger.warning(f"DB Connection failed: {e}. Using mock DB mode.")
        else:
            raise e

    crawler = BeautyCrawler()
    generator = AIGenerator(mock=mock)
    notifier = LineNotifier()

    try:
        # 1. Identify Target
        targets = []
        if source_url:
            targets.append({"url": source_url, "name": "Manual Input"})
        else:
            if db:
                try:
                    targets = db.get_sources().data
                except Exception as e:
                    if mock:
                        logger.warning(f"Failed to fetch sources from DB: {e}. Using mock targets.")
                        targets = [{"url": "https://www.example.com", "name": "Mock Source"}]
                    else:
                        raise e
            elif mock:
                logger.info("Using mock targets.")
                targets = [{"url": "https://www.example.com", "name": "Mock Source"}]
            else:
                 logger.error("No source URL provided and DB not available.")
                 return

        if not targets:
            logger.info("No active sources found.")
            return

        # 2. Crawl & Generate
        await crawler.start_browser()
        
        for target in targets:
            url = target['url']
            logger.info(f"Processing source: {url}")
            
            # Crawl
            if mock and url == "https://www.example.com":
                crawled_data = {
                    "title": "Mock Article Title",
                    "content": "This is mock content found on the page.",
                    "thumbnail_url": "",
                    "source_url": url
                }
            else:
                crawled_data = await crawler.fetch_page_content(url)
            
            if not crawled_data or not crawled_data.get('content'):
                logger.warning(f"Failed to crawl or empty content: {url}")
                continue

            # Generate
            logger.info(f"Generating article for: {crawled_data['title']}")
            article_content = await generator.generate_article(
                source_content=crawled_data['content'],
                source_title=crawled_data['title'],
                mock=mock
            )

            if not article_content:
                logger.error("Failed to generate article content.")
                continue

            # Save Draft
            logger.info("Saving draft to Supabase...")
            article_data = {
                "title": f"【美咲のトレンドcheck】{crawled_data['title']}",
                "content": article_content,
                "status": "draft",
                "source_url": url,
                "thumbnail_url": crawled_data['thumbnail_url'],
                "generated_by": "ai_misaki"
            }
            if db:
                try:
                    res = db.insert_article(article_data)
                    
                    # Notify Owner
                    if res and res.data and len(res.data) > 0:
                        saved_article = res.data[0]
                        logger.info("Sending LINE notification to owner...")
                        notifier.notify_owner_review(saved_article)
                    else:
                        logger.info("Draft saved (ID unknown). notification skipped.")

                except Exception as e:
                    logger.error(f"Failed to save to DB: {e}")
            elif mock:
                 logger.info(f"Mock Save: {article_data['title']}")
                 # Mock notification
                 notifier.notify_owner_review({'title': article_data['title'], 'id': 'mock-id'})

    except Exception as e:
        logger.error(f"Pipeline error: {e}")
    finally:
        await crawler.close_browser()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bikatsu Club AURA Engine")
    parser.add_argument("--url", type=str, help="Specific URL to crawl and process")
    parser.add_argument("--mock", action="store_true", help="Run in mock mode (no API calls)")
    args = parser.parse_args()

    asyncio.run(run_pipeline(args.url, args.mock))
