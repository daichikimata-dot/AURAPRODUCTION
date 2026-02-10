import os
import google.generativeai as genai
from dotenv import load_dotenv
import requests
import base64
import logging
import json
from utils.db import SupabaseManager

load_dotenv()

MISAKI_PERSONA = """
あなたは美容メディア「AURA」の編集長「美咲（みさき）」です。
「AURA」は、20代〜40代の美容関心層に向けた、信頼できる美容情報メディアです。
あなたは編集長として、日本の薬機法・景表法・医療広告ガイドラインに最大限配慮しつつ、読者が「理解→納得→行動」できる専門的かつ実践的なコラムを執筆します。

語り口は、プロフェッショナルでありながら親しみやすく（丁寧なデスマス調）、読者を導くような頼れるトーンで統一してください。
AIが生成したような機械的な表現や、不自然な記号（文中の無意味な**や##）は避け、自然な日本語の文章で執筆してください。
"""

MISAKI_PROMPT = """
あなたは美容メディア「AURA」の編集長「美咲（みさき）」です。
「AURA」は、20代〜40代の美容関心層に向けた、信頼できる美容情報メディアです。
あなたは編集長として、日本の薬機法・景表法・医療広告ガイドラインに最大限配慮しつつ、読者が「理解→納得→行動」できる専門的かつ実践的なコラムを執筆します。

語り口は、プロフェッショナルでありながら親しみやすく（丁寧なデスマス調）、読者を導くような頼れるトーンで統一してください。
AIが生成したような機械的な表現や、不自然な記号（文中の無意味な**や##）は避け、自然な日本語の文章で執筆してください。

# 入力
- キーワード：{keyword}
- カテゴリー：{category}
- 想定読者：{target_audience}

# 絶対ルール（文字数と密度）
- 本文は必ず【800文字以上、1000文字以内】。
- 簡潔にまとめすぎず、以下を必ず入れる：
  1) 背景知識（なぜ注目されているか／適応の考え方）
  2) 作用機序（メカニズムを具体的に）
  3) エビデンスの種類（RCT/メタ解析/観察研究など“種類”で言及。断定や誇張は避ける）
  4) リスク・副作用・よくある失敗
  5) 選び方のチェックリスト（読者が自分で判断できる形）
- 800字に届かない場合は「専門家によるQ&A」を追加して必ず800字以上にする。

# 薬機法・広告規制の安全設計（厳守）
- 効果の保証・断定表現は禁止（例：「必ず治る」「確実に効く」「最強」「永久」等NG）。
- ビフォーアフターの断定、誇大表現、比較優良（No.1等）は避ける。
- 医療行為に関しては、個別の診断・処方指示はしない。受診勧奨はOK。
- 有効性は「〜が示唆される」「〜という報告がある」などの表現に留める。
- 必ず末尾に免責事項を入れる（下の指定文を使用）。

# 構成ルール（見出し付き）
1. タイトル（CVしやすい）：必ず「【2026年最新】」を含め、検索意図に刺さる言葉で。
2. 導入（2〜3文）：悩みの言語化＋この記事で分かること
3. 仕組み（作用機序）：専門用語は噛み砕いて説明
4. エビデンスの見方：研究タイプに触れつつ、誤解されやすい点も補足
5. 注意点（副作用・向き不向き・併用NGなど）
6. 失敗しない選び方（チェックリスト形式）
7. 専門家Q&A（不足時 or 難しいテーマは必ず入れる）
8. 免責事項（指定文をそのまま貼る）

# 文章トーン
- 「専門医レベルの知識」だが、読者にマウントを取らず、安心感のある説明（です・ます調）。
- 箇条書きは使うが、箇条書きだけで終わらせない（本文の密度を担保）。
- 最後は“次に取る行動”が分かる一文で締める（例：パッチテスト/医師相談/成分表確認等）。

# 免責事項（必須・原文のまま）
- **免責事項:**
* このブログ記事は、一般的な情報提供を目的としており、医学的なアドバイスを提供するものではありません。
* 施術を受ける際は、必ず医師や専門家にご相談ください。
* 効果には個人差があります。

# 重要：出力形式の厳守事項
- **冒頭の挨拶（「はい、承知しました」等）は省略し、必ず記事のメインタイトル（# ...）から書き始めてください。**
- **Markdown形式で、記事の全文（導入から免責事項まで）を一度に出力してください。**
- **途中で止まらず、最後まで完結させてください。**


# 出力形式
- 日本語
- 見出し（H2/H3相当）を使う
- Markdown形式
- 800〜1000字に収める（厳守）

{reference_section}
"""

class AIGenerator:
    def __init__(self, mock=False):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            if not mock:
                raise ValueError("GEMINI_API_KEY not found in environment variables.")
            if mock:
                print("Mock mode enabled: AI generation will be simulated.")
                self.model = None
                return
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def generate_article(self, keyword, source_content=None, category="美容", target_audience="美容に関心のある女性"):
        """Generates a blog post using the strict Misaki prompt."""
        
        reference_section = ""
        if source_content:
            reference_section = f"""# 参考情報（ソース記事）
以下は検索された関連情報です。情報の正確性の参考・補強として活用してください。
ただし、これの単なる要約にはせず、独自の構成で執筆してください。

{source_content[:5000]}
"""

        prompt = MISAKI_PROMPT.format(
            keyword=keyword,
            category=category,
            target_audience=target_audience,
            reference_section=reference_section
        )
        
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating content: {e}")
            return None
    async def generate_article_with_grounding(self, keyword, category="美容", target_audience="美容に関心のある女性", learning_context=None, existing_categories=None):
        """
        Generates a blog post using Gemini 2.0 Flash + Google Search Grounding (REST API).
        This replaces the need for manual crawling.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None
            
        # Use gemini-2.0-flash (stable/available fast model with grounding capabilities)
        model_name = "models/gemini-2.0-flash" 
        url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={api_key}"
        
        # Prepare Reference Section with Learning Context
        reference_info = "(Google検索に基づき自動生成)"
        if learning_context:
            reference_info = f"""
(Google検索に基づき自動生成)

# 学習データ（過去の優良記事・メディア情報）
以下は「AURA」が信頼するメディアから収集した学習データです。
記事のトーン、構成、専門用語の使い方などの参考にしてください。
ただし、情報の鮮度についてはGoogle検索結果（最新情報）を優先してください。

{learning_context}
"""
        
        # Construct specific prompt for Grounding
        categories_str = ", ".join(existing_categories) if existing_categories else "美容, コスメ, スキンケア, ダイエット"

        prompt_text = f"""
        あなたは美容メディア「AURA」の編集長「美咲（みさき）」です。
        以下のキーワードについて、最新のGoogle検索結果に基づいて、専門的かつ実践的なコラムを執筆してください。
        
        キーワード: {keyword}
        
        {MISAKI_PROMPT.format(keyword=keyword, category=category, target_audience=target_audience, reference_section=reference_info)}
        
        【重要：出力形式の変更】
        今回は、Markdownだけでなく、記事のメタデータ（タイトル、カテゴリー）も構造化して取得したいため、
        **必ず以下のJSON形式のみ**で出力してください。Markdownのコードブロック(```json ... ```)で囲ってください。

        既存のカテゴリー: {categories_str}
        
        カテゴリー選定ルール:
        1. 既存のカテゴリーの中から最も適切なものがあれば、それを選んでください。
        2. もし既存のカテゴリーに当てはまらない、あるいは「新しいトレンド」として独立させるべきトピックであれば、新しいカテゴリー名を提案してください。

        Output Format:
        ```json
        {{
            "title": "記事のタイトル",
            "category": "選定または新規作成したカテゴリー名",
            "content": "記事の本文（Markdown形式、見出し含む、800文字以上）"
        }}
        ```
        """
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt_text}]
            }],
            "tools": [{
                "google_search": {} 
            }]
        }
        
        try:
            # Using REST API directly to access tools configuration more reliably than old SDK
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                # Extract text
                # Note: Grounding metadata is also available in candidates[0].groundingMetadata
                if 'candidates' in data and len(data['candidates']) > 0:
                    candidate = data['candidates'][0]
                    content_parts = candidate.get('content', {}).get('parts', [])
                    text = "".join([p.get('text', '') for p in content_parts])
                    return text
                else:
                    logging.error(f"Grounding generation empty: {data}")
                    return None
            else:
                logging.error(f"Grounding generation failed: {response.text}")
                return None
                
        except Exception as e:
            logging.error(f"Error generating with grounding: {e}")
            return None
    async def generate_image(self, keyword, title=None):
        """Generates a thumbnail using a 2-step process: 1. Generate Prompt 2. Generate Image."""
        subject_text = title if title else keyword
        
        # Step 1: Use Gemini to write a high-fidelity image prompt
        prompt_generation_prompt = f"""
        You are an expert Art Director for a high-end Japanese beauty magazine.
        Write a specific, highly descriptive prompt for an AI Image Generator (Imagen 3/4) to create a header image for this article:
        Title: {subject_text}
        Keyword: {keyword}
        
        Requirements for the prompt:
        - Aesthetics: High-end Japanese Beauty Magazine style (like MAQUIA, VOCE, bi-teki), Glossy 'Water Glow' skin, Vibrant and Eye-catching colors (Rich Pink, Gold, Beige, Emerald), Crystal clean.
        - Style: High-end Commercial Beauty Photography, Studio Lighting, High Contrast, 8k, Photorealistic, Masterpiece.
        - Atmosphere: Aspirational, Trendy, Confident, Professional, "Must-Click" quality.
        - Composition: Dynamic, Focus on beauty details (face or product), Clean background, Magazine Cover Quality.
        - Exclusions: No text, no charts, no gore, no distorted faces.
        
        Output ONLY the prompt text in English.
        """
        
        image_prompt = await self.generate_text(prompt_generation_prompt)
        # Fallback if generation fails or returns weird JSON
        if not image_prompt or "Error" in image_prompt:
             image_prompt = f"High-end beauty photography of {keyword}, clean, pastel colors, aesthetic, photorealistic, 8k"
        
        logger = logging.getLogger("uvicorn")
        logger.info(f"Generated Image Prompt: {image_prompt}")

        try:
            # Step 2: Call Imagen 4.0 Ultra with the generated prompt
            # Using REST API directly avoids SDK version issues (google-generativeai vs google-genai)
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                logger.error("GEMINI_API_KEY not found")
                return None

            model_name = "models/imagen-4.0-ultra-generate-001"
            url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:predict?key={api_key}"
            
            headers = {"Content-Type": "application/json"}
            payload = {
                "instances": [{"prompt": image_prompt}],
                "parameters": {
                    "sampleCount": 1,
                    "aspectRatio": "16:9",
                    # Add negative prompt if supported by the model/API, otherwise rely on prompt engineering
                    # "negativePrompt": "text, watermark, low quality, blurry, distorted, ugly" 
                }
            }
            
            # Using synchronous requests in async via loop or just blocking (ok for low traffic tool)
            # ideally use aiohttp, but requests is simpler and available.
            # To avoid blocking event loop too much, we could run in executor, but for now direct call is fine for this scale.
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if 'predictions' in data and len(data['predictions']) > 0:
                    b64_data = data['predictions'][0]['bytesBase64Encoded']
                    image_bytes = base64.b64decode(b64_data)
                    
                    filename = f"generated_{os.urandom(4).hex()}.png"

                    # Upload to Supabase Storage
                    try:
                        db = SupabaseManager()
                        full_url = db.upload_image(image_bytes, filename)
                        
                        if full_url:
                            logger.info(f"Image uploaded successfully: {full_url}")
                            return full_url
                        else:
                            logger.error("Failed to upload image to Supabase")
                            return None
                    except Exception as e:
                        logger.error(f"Error uploading to Supabase: {e}")
                        return None
                else:
                    logger.error(f"Image generation response empty: {data}")
            else:
                 logger.error(f"Image generation failed: {response.text}")

        except Exception as e:
            logger.error(f"Error generating image: {e}")
            return None

    async def revise_article(self, current_content, feedback):
        """Revises an existing article based on feedback."""
        prompt = f"""
{MISAKI_PERSONA}

以下の記事に対して、オーナーから修正指示がありました。
指示に従って記事を修正してください。

**修正指示**:
{feedback}

**現在の記事**:
{current_content}
        """
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error revising content: {e}")
            return None
    async def generate_text(self, prompt, mock=False):
        """Generates generic text based on a prompt."""
        if mock or not self.model: # Handle mock mode within method or if init failed
             return """{"keywords": ["Mock Keyword 1", "Mock Keyword 2", "Mock Keyword 3", "Mock Keyword 4", "Mock Keyword 5", "Mock Keyword 6"]}"""

        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating text: {e}")
            return """{"keywords": ["Error Keyword"]}"""

    async def translate_to_korean(self, text):
        """Translates text to Korean for cross-language search."""
        if not self.model: return text
        
        prompt = f"""
        Translate the following text into natural Korean.
        Only output the translated text. No explanations.
        
        Text: {text}
        """
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text.strip()
        except Exception as e:
            logger = logging.getLogger("uvicorn")
            logger.error(f"Translation failed: {e}")
            return text

    async def recommend_media_sources(self, keyword):
        """
        Uses Gemini + Google Search Grounding to find media sources.
        Returns a list of dicts: [{"name":Str, "url":Str}]
        """
        if not self.model: return []
        
        # Use REST API for grounding as in generate_article_with_grounding
        # Re-implementing simplified version here or reusing logic
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger = logging.getLogger("uvicorn")
            logger.error("Media Rec: Missing API Key")
            return []
        
        model_name = "models/gemini-2.0-flash" 
        url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:generateContent?key={api_key}"
        
        prompt_text = f"""
        Find 5 high-quality, popular Japanese blog or media websites about '{keyword}'.
        Focus on authoritative sites, clinics' blogs, or popular personal blogs.
        Exclude major platforms like Twitter, Instagram, YouTube, TikTok.
        
        Return the result strictly in JSON format as a list of objects with 'name' and 'url' keys.
        Example:
        [
            {{"name": "Site Name", "url": "https://example.com"}},
            ...
        ]
        """
        
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt_text}]}],
            "tools": [{"google_search": {}}]
        }
        
        try:
            import requests
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    content_parts = data['candidates'][0].get('content', {}).get('parts', [])
                    text = "".join([p.get('text', '') for p in content_parts])
                    
                    # Clean json
                    text = text.replace("```json", "").replace("```", "").strip()
                    try:
                        import json
                        results = json.loads(text)
                        # Normalize keys if needed
                        return results if isinstance(results, list) else []
                    except Exception as e:
                        logger = logging.getLogger("uvicorn")
                        logger.error(f"Media Rec: JSON Parse Error: {e} Text: {text}")
                        return []
                else:
                    logger = logging.getLogger("uvicorn")
                    logger.error(f"Media Rec: No candidates in response: {data}")
            else:
                logger = logging.getLogger("uvicorn")
                logger.error(f"Media Rec: API Error {response.status_code}: {response.text}")
            return []
        except Exception as e:
            logger = logging.getLogger("uvicorn")
            logger.error(f"Media recommendation failed: {e}")
            return []
