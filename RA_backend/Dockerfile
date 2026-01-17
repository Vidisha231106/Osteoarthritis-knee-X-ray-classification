# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements_runtime.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements_runtime.txt && \
    pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchvision

# Copy application code (this copies everything including RA_Ordinal_Classification)
COPY . .

# Verify directory structure exists
RUN echo "=== Checking file structure ===" && \
    ls -la /app/ && \
    echo "=== Checking RA_Ordinal_Classification ===" && \
    ls -la /app/RA_Ordinal_Classification/ 2>&1 || echo "RA_Ordinal_Classification folder missing!" && \
    echo "=== Checking src folder ===" && \
    ls -la /app/RA_Ordinal_Classification/src/ 2>&1 || echo "src folder missing!" && \
    echo "=== Checking for model.py ===" && \
    ls -la /app/RA_Ordinal_Classification/src/model.py 2>&1 || echo "model.py missing!" && \
    echo "=== Checking for .pth model ===" && \
    ls -la /app/RA_Ordinal_Classification/*.pth 2>&1 || echo "Model file missing!"

# Expose port (Render will override with PORT env var)
EXPOSE $PORT

# Use gunicorn for production
CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120 app:app
