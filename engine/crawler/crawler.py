import os
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BeautyCrawler:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None

    async def start_browser(self):
        """Starts the Playwright browser."""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        # Random user agent or typical browser context setup could go here
        self.context = await self.browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )

    async def close_browser(self):
        """Closes the Playwright browser."""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def fetch_page_content(self, url):
        """Fetches page content and extracts relevant text and metadata."""
        if not self.browser:
            await self.start_browser()

        page = await self.context.new_page()
        try:
            logger.info(f"Navigating to: {url}")
            await page.goto(url, timeout=30000, wait_until="domcontentloaded")
            
            # Simple wait for hydration if needed, but domcontentloaded is often enough for static extraction
            # await page.wait_for_timeout(2000) 

            html = await page.content()
            return self.parse_content(html, url)
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
        finally:
            await page.close()

    def parse_content(self, html, url):
        """Parses HTML and extracts clean content using BeautifulSoup."""
        soup = BeautifulSoup(html, 'html.parser')

        # 1. Metadata Extraction
        title = self.get_meta_property(soup, 'og:title') or soup.title.string if soup.title else 'No Title'
        site_name = self.get_meta_property(soup, 'og:site_name') or ''
        thumbnail = self.get_meta_property(soup, 'og:image') or ''
        
        # 2. Cleanup
        for tag in soup(['script', 'style', 'nav', 'header', 'footer', 'iframe', 'noscript']):
            tag.decompose()
            
        # Remove ads often found in common classes
        for ad in soup.select('.ad, .advertisement, .banner, .sidebar, .popup'):
             ad.decompose()

        # 3. Content Extraction Strategy
        # Priority: article > main > specific classes > body
        content_node = soup.find('article')
        if not content_node:
             content_node = soup.find('main')
        if not content_node:
            # Common content wrapper classes
            for cls in ['post-content', 'entry-content', 'article-body', 'news-body']:
                content_node = soup.find(class_=cls)
                if content_node:
                    break
        
        if not content_node:
            content_node = soup.body

        # Extract text
        if content_node:
            text = content_node.get_text(separator='\n\n', strip=True)
        else:
            text = ""

        # 4. Truncate if too long (simple safety for context limits)
        if len(text) > 10000:
            text = text[:10000] + "..."

        return {
            "title": title,
            "site_name": site_name,
            "thumbnail_url": thumbnail,
            "source_url": url,
            "content": text
        }

    def get_meta_property(self, soup, property_name):
        tag = soup.find('meta', property=property_name)
        if tag and tag.get('content'):
            return tag.get('content')
        return None

# Simple functional test if run directly
if __name__ == "__main__":
    async def main():
        crawler = BeautyCrawler()
        # Example URL (replace with a real one for actual testing)
        url = "https://example.com" 
        data = await crawler.fetch_page_content(url)
        print(data)
        await crawler.close_browser()

    asyncio.run(main())
