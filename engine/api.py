from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import os
import asyncio
import logging
from generator.generator import AIGenerator
from crawler.crawler import BeautyCrawler
from utils.db import SupabaseManager
from utils.line_notifier import LineNotifier
import json
import re
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="AURA Engine API", description="API for AURA Beauty Content Engine")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components (Lazy loading or global init)
# We initialize them here for simplicity, but in prod might want lifespan events
try:
    db = SupabaseManager()
except:
    logger.warning("DB connection failed, running in mock db mode internally")
    db = None

generator = AIGenerator(mock=False) # We want real AI for trends if possible
crawler = BeautyCrawler()

class KeywordRequest(BaseModel):
    keyword: str
    target_count: int = 1

class TrendResponse(BaseModel):
    keywords: List[str]

@app.get("/trends", response_model=TrendResponse)
async def get_trends():
    """
    Generates trending beauty keywords using Gemini, 
    incorporating data from recently crawled articles (Learning Data).
    """
    try:
        # 1. Fetch recent learning data (last 7 days, limit 20)
        learning_context = ""
        if db:
            try:
                # Simple fetch of recent articles
                res = db.client.from_("crawled_articles")\
                    .select("title, content")\
                    .order("crawled_at", desc=True)\
                    .limit(10)\
                    .execute()
                
                if res.data:
                    titles = [a['title'] for a in res.data]
                    # Create a summary context
                    learning_context = "【直近の収集済みメディア記事タイトル】\n" + "\n".join(f"- {t}" for t in titles)
                    logger.info(f"Trends: Using {len(res.data)} articles for context.")
            except Exception as e:
                logger.warning(f"Trends: Failed to fetch learning data: {e}")

        # 2. Construct Prompt
        prompt = f"""
        2026年の最新美容医療・自由診療トレンドを分析してください。
        以下の「収集済みメディア記事」の傾向も加味しつつ、
        条件に合致する「おすすめキーワード」を10個抽出してJSON形式で返してください。
        
        {learning_context}
        
        【抽出条件】
        - 美容医療（クリニック施術、ドクターズコスメ、医療ダイエット）と親和性が極めて高い。
        - 日本および韓国のSNS（TikTok, Instagram, Naver）で爆発的に発信されている。
        - 収集済みの記事で頻出している、あるいはそこから読み取れる次なる流行。
        - Google検索シェアが急上昇中で、SEO対策としてブルーオーシャンである。
        - クリニックへの送客（CV）に繋がりやすい。

        Output format: {{"keywords": ["keyword1", "keyword2", ...]}}
        Only return the JSON.
        """
        
        # Use generator to get trends
        trends_json_str = await generator.generate_text(prompt)
        
        # Parse JSON
        cleaned_str = trends_json_str.replace("```json", "").replace("```", "").strip()
        try:
            data = json.loads(cleaned_str)
            return TrendResponse(keywords=data.get("keywords", []))
        except:
             # Try simple regex if json load fails
             import re
             matches = re.findall(r'"([^"]*)"', cleaned_str)
             # filtered matches that look like keywords (not keys like "keywords")
             kws = [m for m in matches if m != "keywords"]
             if kws:
                 return TrendResponse(keywords=kws[:10])
             raise ValueError("Failed to parse JSON")

    except Exception as e:
        logger.error(f"Error fetching trends: {e}")
        # Fallback
        return TrendResponse(keywords=[
            "韓国肌管理", "ポテンツァ", "水光注射", "レチノール", "医療ダイエット", 
            "アートメイク", "エクソソーム", "ピコレーザー", "脂肪冷却", "ダーマペン"
        ])

    except Exception as e:
        logger.error(f"Error fetching trends: {e}")
        # Fallback
        return TrendResponse(keywords=["韓国肌管理", "ポテンツァ", "水光注射", "レチノール", "医療ダイエット", "アートメイク"])

@app.post("/generate_bulk")
async def generate_bulk_articles(background_tasks: BackgroundTasks):
    """
    Triggers bulk generation of articles based on current trends.
    Selects top 3 trending keywords that haven't been covered yet.
    """
    try:
        # 1. Fetch Trends (Re-using the logic from get_trends)
        
        prompt = """
        2026年の最新美容医療・自由診療トレンドを分析してください。
        以下の条件に合致する「おすすめキーワード」を10個抽出してJSON形式で返してください。
        
        【抽出条件】
        - 美容医療（クリニック施術、ドクターズコスメ、医療ダイエット）と親和性が極めて高い。
        - 日本および韓国のSNS（TikTok, Instagram, Naver）で爆発的に発信されている。
        - Google検索シェアが急上昇中で、SEO対策としてブルーオーシャンである。
        
        Output format: {"keywords": ["keyword1", "keyword2", ...]}
        Only return the JSON.
        """
        logger.info("Bulk Gen - Requesting trends from AI...")
        trends_json_str = await generator.generate_text(prompt)
        logger.info(f"Bulk Gen - Raw Trends Output: {trends_json_str}")
        
        cleaned_str = trends_json_str.replace("```json", "").replace("```", "").strip()
        # Attempt to find JSON if there's extra text
        if "{" in cleaned_str and "}" in cleaned_str:
            start = cleaned_str.find("{")
            end = cleaned_str.rfind("}") + 1
            cleaned_str = cleaned_str[start:end]
            
        try:
            data = json.loads(cleaned_str)
            candidates = data.get("keywords", [])
            logger.info(f"Bulk Gen - Parsed Candidates: {candidates}")
        except json.JSONDecodeError as e:
             logger.error(f"Bulk Gen - JSON Decode Error: {e}")
             # Fallback trends if AI fails
             candidates = ["韓国水光肌", "ポテンツァ", "医療ダイエット", "エクソソーム"]
             logger.info("Bulk Gen - Using Fallback Candidates")

        # 2. Filter out existing articles (Mocked for now)
        target_keywords = candidates[:3]
        
        # 3. Trigger Generation
        for kw in target_keywords:
            logger.info(f"Bulk Gen - Triggering task for: {kw}")
            background_tasks.add_task(process_keyword_generation, kw)
            
        return {"status": "accepted", "message": f"Bulk generation started for: {', '.join(target_keywords)}", "keywords": target_keywords}

    except Exception as e:
        logger.error(f"Bulk generation CRITICAL FAILURE: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/media/crawl")
async def crawl_media_sources(background_tasks: BackgroundTasks):
    """
    Triggers crawling for all active media sources.
    """
    try:
        if not db:
            raise HTTPException(status_code=503, detail="Database not available")
            
        # 1. Fetch active sources
        response = db.client.from_("sources").select("*").eq("is_active", True).execute()
        sources = response.data
        
        if not sources:
            return {"message": "No active sources found to crawl."}
            
        # 2. Trigger crawling for each source (in background to avoid timeout)
        background_tasks.add_task(process_media_crawl, sources)
        
        return {"status": "accepted", "message": f"Started crawling for {len(sources)} sources."}
        
    except Exception as e:
        logger.error(f"Media crawl initiation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_media_crawl(sources):
    """Background task to crawl sources and save data."""
    logger.info("Starting media crawl...")
    await crawler.start_browser()
    
    try:
        from datetime import datetime, timezone
        
        for source in sources:
            url = source['url']
            source_id = source['id']
            logger.info(f"Crawling source: {source['name']} ({url})")
            
            # Fetch content
            data = await crawler.fetch_page_content(url)
            
            if data and data.get('content'):
                # Save to crawled_articles
                article_data = {
                    "source_id": source_id,
                    "title": data.get('title', 'No Title'),
                    "content": data.get('content'),
                    "url": data.get('source_url', url),
                    # "crawled_at": is auto-generated or we can set it
                }
                
                # Upsert based on URL to avoid duplicates (requires unique constraint on url)
                try:
                    db.client.from_("crawled_articles").upsert(article_data, on_conflict="url").execute()
                    
                    # Update source last_crawled_at
                    db.client.from_("sources").update({
                        "last_crawled_at": datetime.now(timezone.utc).isoformat()
                    }).eq("id", source_id).execute()
                    
                    logger.info(f"Successfully crawled and saved: {url}")
                except Exception as e:
                    logger.error(f"Failed to save crawled data for {url}: {e}")
            else:
                 logger.warning(f"No content found for {url}")
                 
    except Exception as e:
        logger.error(f"Media crawl process failed: {e}")
    finally:
        await crawler.close_browser()


@app.get("/debug/rag")
async def debug_rag(keyword: str):
    """Debug endpoint to check RAG retrieval."""
    if not db:
        return {"error": "DB not available"}
    
    try:
        # Cross-Language Search
        kr_keyword = await generator.translate_to_korean(keyword)
        
        # Search for keyword (JP) OR translated keyword (KR)
        query = f"title.ilike.%{keyword}%,content.ilike.%{keyword}%"
        if kr_keyword and kr_keyword != keyword:
             query += f",title.ilike.%{kr_keyword}%,content.ilike.%{kr_keyword}%"
             
        res = db.client.from_("crawled_articles")\
            .select("title, content, url, source:sources(name)")\
            .or_(query)\
            .limit(5)\
            .execute()
        return {
            "keyword_jp": keyword,
            "keyword_kr": kr_keyword,
            "count": len(res.data) if res.data else 0, 
            "results": res.data
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/generate")
async def generate_article_from_keyword(request: KeywordRequest, background_tasks: BackgroundTasks):
    """
    Triggers article generation based on a keyword.
    Starts a background task to crawl and generate.
    """
    background_tasks.add_task(process_keyword_generation, request.keyword)
    return {"status": "accepted", "message": f"Generation started for keyword: {request.keyword}"}

async def process_keyword_generation(keyword: str):
    # Use uvicorn logger for visibility
    logger = logging.getLogger("uvicorn")
    logger.info(f"Processing keyword: {keyword}")
    found_urls = [] # Initialize for compatibility
    
    # MIGRATED: User requested to use "googleSearch" tool natively.
    # We skip manual `search()` and `crawler` access.
    # The generation is now handled by `generate_article_with_grounding` via REST API.
     
    # (Old search logic removed for clarity and speed)

    
    # 1. Fetch Learning Context (RAG)
    learning_context = ""
    try:
        if db:
            logger.info(f"Searching for learning data for keyword: {keyword}...")
            # Cross-Language Search
            kr_keyword = await generator.translate_to_korean(keyword)
            logger.info(f"RAG: Translated '{keyword}' to '{kr_keyword}' for search.")
            
            # Construct OR query for JP and KR
            query = f"title.ilike.%{keyword}%,content.ilike.%{keyword}%"
            if kr_keyword and kr_keyword != keyword:
                 query += f",title.ilike.%{kr_keyword}%,content.ilike.%{kr_keyword}%"

            res = db.client.from_("crawled_articles")\
                .select("title, content, url, source:sources(name)")\
                .or_(query)\
                .limit(3)\
                .execute()
            
            if res.data:
                articles = res.data
                context_parts = []
                for art in articles:
                    source_name = art.get('source', {}).get('name') if art.get('source') else 'Unknown Source'
                    # Truncate content to avoid token overflow (though Gemini Flash has large window, let's differ to 2000 chars per article)
                    content_preview = art['content'][:2000].replace('\n', ' ')
                    context_parts.append(f"## 参考記事: {art['title']}\n- 出典: {source_name}\n- URL: {art['url']}\n- 内容抜粋: {content_preview}...")
                
                learning_context = "\n\n".join(context_parts)
                logger.info(f"RAG: Retrieved {len(articles)} articles for learning context.")
            else:
                logger.info("RAG: No relevant learning data found (count=0).")
        else:
             logger.warning("RAG: DB not available working in mock mode.")
             
    except Exception as e:
        logger.error(f"RAG Search failed: {e}")
        # Proceed without context

    # 2. Generate Article with Google Search Grounding (Simpler, latest approach)
    # This effectively replaces "Search -> Crawl -> Generate" with "Generate(tools=[google_search])"
    logger.info("Generating article using Gemini Grounding...")
    
    article_content = await generator.generate_article_with_grounding(
        keyword=keyword,
        learning_context=learning_context
    )
    
    if article_content:
        # Clean up markdown
        article_content = re.sub(r'^```[a-zA-Z]*\n', '', article_content.strip())
        article_content = re.sub(r'\n```$', '', article_content.strip())
        article_content = article_content.strip()

        # Extract title
        title = f"【徹底解説】{keyword}の最新事情"
        if article_content.startswith("#"):
             lines = article_content.split('\n')
             first_line = lines[0]
             title = first_line.replace("#", "").strip()
             article_content = "\n".join(lines[1:]).strip()
        
        # Generate Thumbnail (AI)
        logger.info("Generating thumbnail with AI...")
        thumb = await generator.generate_image(keyword, title=title)
        if not thumb:
            thumb = "https://placehold.co/1200x630/ffe4e6/be123c?text=AURA+Beauty"

        # Save Draft
        article_data = {
            "title": title,
            "content": article_content,
            "status": "draft",
            "source_url": "google_search_grounding",
            "thumbnail_url": thumb, 
            "generated_by": "gemini-2.0-flash-grounding"
        }
        
        if db:
            db.insert_article(article_data)
            logger.info(f"Saved grounded draft for {keyword}")
        return

    # Fallback to old logic if grounding returns empty (rare)
    logger.warning("Grounding failed, falling back to manual crawl...")
    
    # ... (Keep existing crawl logic as deeper fallback if needed, or just return)
    # For now, let's just return to keep it simple as per user request to use "googleSearch tool".

    # 2. Crawl & Generate
    await crawler.start_browser()
    try:
        # Crawl top 1
        url = found_urls[0]
        logger.info(f"Crawling: {url}")
        crawled_data = await crawler.fetch_page_content(url)
        
        if crawled_data and crawled_data.get('content'):
            # Generate using new signature
            article_content = await generator.generate_article(
                keyword=keyword,
                source_content=crawled_data['content']
            )
            
            if article_content:
                # Clean up markdown code blocks using regex
                article_content = re.sub(r'^```[a-zA-Z]*\n', '', article_content.strip())
                article_content = re.sub(r'\n```$', '', article_content.strip())
                article_content = article_content.strip()

                # Extract title from generated markdown content if available
                title = f"【話題の{keyword}】{crawled_data['title']}"
                if article_content.startswith("#"):
                     lines = article_content.split('\n')
                     first_line = lines[0]
                     title = first_line.replace("#", "").strip()
                     # Remove title from content if it's duplicated in H1
                     article_content = "\n".join(lines[1:]).strip()

                # Determine thumbnail
                # 1. Start with AI Generation (Priority as requested)
                logger.info("Generating thumbnail with AI...")
                # Pass extracted title to potentially improve relevance
                thumb = await generator.generate_image(keyword, title=title)
                
                # 2. If AI fails, fallback to crawled image
                if not thumb:
                     logger.info("AI image generation failed, checking crawled data...")
                     thumb = crawled_data.get('thumbnail_url', '')
                
                # 3. Last fallback
                if not thumb:
                    # Fallback if AI fails: Use a reliable static image to avoid encoding issues with Japanese
                    # Or use English text "Beauty".
                    thumb = "https://placehold.co/1200x630/ffe4e6/be123c?text=AURA+Beauty"

                # Save Draft
                article_data = {
                    "title": title,
                    "content": article_content,
                    "status": "draft",
                    "source_url": url,
                    "thumbnail_url": thumb, 
                    "generated_by": "ai_misaki_keyword"
                }
                if db:
                        db.insert_article(article_data)
                        logger.info(f"Saved draft for {keyword}")
                else:
                    logger.info(f"Mock Save Draft: {article_data['title']}")
        else:
             logger.warning("Crawled content was empty.")
    except Exception as e:
        logger.error(f"Error in generation process: {e}")
    finally:
        await crawler.close_browser()

import random
from urllib.parse import urlparse

RECOMMENDATION_QUERIES = [
    "美容整形 ブログ おすすめ",
    "美容クリニック 評判 ブログ",
    "美容皮膚科 体験記",
    "医療ダイエット 経過 ブログ",
    "AGA治療 体験 ブログ",
    "低用量ピル 服用日記",
    "韓国美容整形 レポ ブログ",
    "美容ナース ブログ",
    "美容情報サイト ランキング"
]

@app.get("/media/recommendations")
async def get_media_recommendations():
    """
    Returns 3 recommended beauty sources that are not yet in the database.
    Process:
    1. Pick a random query.
    2. Search Google.
    3. Filter out existing URLs (matching domain/host).
    4. Fetch titles for top 3 candidates.
    """
    if not db:
        return {"error": "DB not available"}

    try:
        # 1. Get existing domains to exclude
        res = db.client.from_("sources").select("url").execute()
        existing_urls = [r['url'] for r in res.data] if res.data else []
        existing_domains = set()
        for u in existing_urls:
             try:
                 existing_domains.add(urlparse(u).netloc)
             except:
                 pass

        # 2. Search using Gemini Grounding
        query = random.choice(RECOMMENDATION_QUERIES)
        logger.info(f"Recommendation Search Query: {query}")
        
        # Use Gemini to get raw candidates
        raw_candidates = await generator.recommend_media_sources(query)
        logger.info(f"AI Recommendations: {raw_candidates}")
        
        filtered_results = []
        seen_domains = set()
        
        for cand in raw_candidates:
            try:
                url = cand.get('url')
                name = cand.get('name')
                if not url: continue
                
                parsed = urlparse(url)
                domain = parsed.netloc
                
                # Exclude if already in manual sources
                if domain in existing_domains:
                    continue
                    
                # Exclude if already in current candidates
                if domain in seen_domains:
                    continue
                
                # Exclude major platforms if path is root (generic)
                if domain in ["twitter.com", "instagram.com", "facebook.com", "youtube.com", "tiktok.com"]:
                    continue
                
                # Add to results
                filtered_results.append({
                    "name": name,
                    "url": url,
                    "query_used": query
                })
                seen_domains.add(domain)
                
                if len(filtered_results) >= 3:
                    break
            except:
                continue
        
        return {"recommendations": filtered_results}

    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        return {"error": str(e), "recommendations": []}

    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        return {"error": str(e), "recommendations": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
