
import os
import requests
import json
from dotenv import load_dotenv
import base64

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    try:
        with open('.env') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    api_key = line.strip().split('=')[1]
                    break
    except:
        pass

def test_rest_image_gen_v4():
    print("Attempting REST API Image Generation (Imagen 4.0 Fast)...")
    
    # Using the model found in the list
    model_name = "models/imagen-4.0-fast-generate-001" 
    url = f"https://generativelanguage.googleapis.com/v1beta/{model_name}:predict?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    payload = {
        "instances": [
            {
                "prompt": "A beautiful aesthetic japanese clinic, pastel colors, high quality, photorealistic"
            }
        ],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "16:9"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("Success! Response contains image data.")
            data = response.json()
            if 'predictions' in data:
                b64_data = data['predictions'][0]['bytesBase64Encoded']
                # decoding to ensure it's valid, not saving to avoid cluttering unless needed
                img_bytes = base64.b64decode(b64_data)
                print(f"Received {len(img_bytes)} bytes of image data.")
            else:
                print("No predictions found in healthy response.")
                print(data)
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    test_rest_image_gen_v4()
