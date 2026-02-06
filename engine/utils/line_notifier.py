import os
import logging
from linebot import LineBotApi
from linebot.models import TextSendMessage
from textwrap import shorten

logger = logging.getLogger(__name__)

class LineNotifier:
    def __init__(self):
        self.access_token = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN")
        if not self.access_token:
            logger.warning("LINE_CHANNEL_ACCESS_TOKEN not found. Notifications will be skipped.")
            self.line_bot_api = None
        else:
            self.line_bot_api = LineBotApi(self.access_token)
        
        # In a real scenario, you'd target all users or specific channels.
        # For this prototype, we might send to a debug user or broadcast.
        # Broadcast requires a paid plan or verified account in some regions/plans.
        # We'll assume a specific USER_ID or use broadcast if configured.
        self.target_user_id = os.environ.get("LINE_TARGET_USER_ID") 

    def notify_new_article(self, article):
        """Sends a notification about a new published article."""
        if not self.line_bot_api:
            return

        title = article.get('title', 'No Title')
        url = f"https://www.kireiaura.com/articles/{article.get('id')}" # Placeholder URL
        
        message_text = f"✨新着記事のお知らせ✨\n\n{title}\n\n美咲が最新トレンドをチェックしました！\n詳細はこちら: {url}"

        try:
            if self.target_user_id:
                self.line_bot_api.push_message(self.target_user_id, TextSendMessage(text=message_text))
                logger.info(f"LINE notification sent to {self.target_user_id}")
            else:
                # Fallback to broadcast (careful with quota)
                # self.line_bot_api.broadcast(TextSendMessage(text=message_text))
                logger.warning("No target user ID set for notification.")
        except Exception as e:
            logger.error(f"Failed to send LINE notification: {e}")

    def notify_owner_review(self, article):
        """Notifies the owner that a draft is ready for review."""
        if not self.line_bot_api or not self.target_user_id:
            logger.warning("Skipping owner notification (missing config).")
            return

        title = article.get('title', 'No Title')
        admin_url = f"https://www.kireiaura.com/admin/dashboard/articles/{article.get('id')}"

        message_text = f"🤖記事の生成が完了しました\n\nタイトル: {title}\n\n確認・承認はこちら: {admin_url}"

        try:
            self.line_bot_api.push_message(self.target_user_id, TextSendMessage(text=message_text))
            logger.info("Owner notification sent.")
        except Exception as e:
            logger.error(f"Failed to send owner notification: {e}")
