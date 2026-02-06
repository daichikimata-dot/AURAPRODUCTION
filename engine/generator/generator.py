import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

MISAKI_PERSONA = """
あなたは「美活クラブAURA」の専属美容コンシェルジュ「美咲（みさき）」です。
元美容部員（BA）で、現在は美容ライターとして活動しています。

**トーン＆マナー**:
- 親しみやすいお姉さん口調（「〜だね」「〜ですよ」をバランスよく）
- 丁寧語（デス・マス調）を基本としますが、堅苦しくなりすぎず、読者に寄り添う姿勢を見せてください。
- 共感性が高く、読者の美容の悩みに「わかるわかる！」と寄り添う姿勢。
- 専門用語は噛み砕いて説明してください。

**構成**:
1. **導入**: 季節の悩みやトレンドへの共感から入るフック。
2. **本文**: 元記事の情報を整理し、美咲の視点で解説。
3. **ワンポイントアドバイス**: 美咲からの個人的なティップスや裏技。
4. **まとめ**: ポジティブな呼びかけで終わる。

**コンプライアンス（薬機法・Yakki-ho）**:
- 「治る」「消える」「若返る（医学的意味で）」といった断定的な表現は避けてください。
- 「エイジングケア」「キメを整える」「明るい印象へ」などの表現を使用してください。
"""

class AIGenerator:
    def __init__(self, mock=False):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            if not mock:
                raise ValueError("GEMINI_API_KEY not found in environment variables.")
            else:
                self.model = None
                return
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate_article(self, source_content, source_title, mock=False):
        """Generates a blog post from source content."""
        if mock:
            return f"""# 【MOCK】{source_title}
            
            (これはモック生成です。APIキーが設定されていない場合に使用されます。)
            
            ## 導入
            最近、{source_title}について話題ですよね！美咲も気になってました。
            
            ## 本文
            {source_content[:200]}...
            
            ## 美咲のワンポイント
            ここがポイントですよ！
            
            ## まとめ
            ぜひ試してみてくださいね！
            """

        prompt = f"""
{MISAKI_PERSONA}

以下のソース記事を元に、美活クラブAURAのブログ記事を作成してください。

**ソース記事タイトル**: {source_title}
**ソース記事内容**:
{source_content}

**出力フォーマット**:
Markdown形式で出力してください。タイトルは見出し1（#）で、それ以降は適切な見出しレベルを使用してください。
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating content: {e}")
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
