
import os
import sys
import base64

# Add engine directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.db import SupabaseManager

def test_upload():
    print("Testing Supabase Storage Upload...")
    try:
        db = SupabaseManager()
        
        # Create dummy image data (1x1 transparent png)
        # Base64 for 1x1 transparent PNG
        dummy_png_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
        file_bytes = base64.b64decode(dummy_png_b64)
        filename = "test_upload_verify.png"
        
        print(f"Uploading {filename}...")
        url = db.upload_image(file_bytes, filename)
        
        if url:
            print(f"SUCCESS: Image uploaded to {url}")
        else:
            print("FAILURE: Upload returned None")
            
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_upload()
