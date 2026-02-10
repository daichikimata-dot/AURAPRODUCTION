FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (Playwright needs these)
# We also need to install playwright browsers
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers (chromium only to save space/time)
RUN playwright install chromium --with-deps

COPY . .

# Expose port (Render sets PORT env var, default 8000 in our code?)
# Our code uses 8000. Render usually expects 10000 or sets PORT.
# We should update main.py to use os.getenv("PORT", 8000)
CMD ["python", "main.py"]
