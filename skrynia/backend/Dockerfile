FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Build args for Facebook variables (optional, for build-time validation)
ARG FACEBOOK_PIXEL_ID
ARG FACEBOOK_ACCESS_TOKEN
ARG FACEBOOK_DATASET_QUALITY_TOKEN
ARG FACEBOOK_API_VERSION=v18.0

# Set environment variables for build (optional, for validation)
ENV FACEBOOK_PIXEL_ID=${FACEBOOK_PIXEL_ID}
ENV FACEBOOK_ACCESS_TOKEN=${FACEBOOK_ACCESS_TOKEN}
ENV FACEBOOK_DATASET_QUALITY_TOKEN=${FACEBOOK_DATASET_QUALITY_TOKEN}
ENV FACEBOOK_API_VERSION=${FACEBOOK_API_VERSION}

# Copy application code
COPY . .

# Generate build marker
RUN python3 generate_build_marker.py || echo "Build marker generation skipped"

# Copy and set permissions for entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create non-root user (but don't switch yet - entrypoint will handle it)
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Run database migrations and start server
CMD ["sh", "-c", "python ensure_tables.py && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
