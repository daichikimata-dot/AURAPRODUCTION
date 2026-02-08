import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load explicitly from web/.env.local to get SERVICE_ROLE_KEY
web_env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../web/.env.local"))
print(f"Loading env from: {web_env_path}")
load_dotenv(web_env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

supabase: Client = create_client(url, key)

email = "admin@aura.com"
password = "auraadmin"

print(f"Creating/Updating user: {email}")

try:
    attributes = {
        "email": email,
        "password": password,
        "email_confirm": True
    }
    
    # Check if user exists first to update password if needed
    # (Checking by email is tricky without listing all users, but create_user might throw unique constraint error)
    
    try:
        user = supabase.auth.admin.create_user(attributes)
        print(f"User created successfully: {user.user.id}")
    except Exception as e:
        if "already registered" in str(e) or "constraint" in str(e):
            print("User already exists. Attempting to update password...")
            # We need the user ID to update. Listing users filter by email not supported directly in all client versions?
            # Actually, standard way is list_users() and filter.
            users = supabase.auth.admin.list_users()
            target_user = next((u for u in users if u.email == email), None)
            
            if target_user:
                res = supabase.auth.admin.update_user_by_id(target_user.id, {"password": password})
                print(f"Password updated for user: {target_user.id}")
            else:
                 print("Could not find user ID despite 'already registered' error.")
        else:
            raise e

except Exception as e:
    print(f"Operation failed: {e}")

print("\n---------------------------------------------------")
print(f"Login with: {email} / {password}")
print("---------------------------------------------------")
