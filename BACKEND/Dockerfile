FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user with ID 1000 (standard for Hugging Face Spaces)
RUN useradd -m -u 1000 user

# Copy requirements
COPY requirements.txt .

# Install Python dependencies globally (as root)
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy project files with ownership set to the non-root user
COPY --chown=user:user . .

# Switch to the non-root user
USER user

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PATH="/home/user/.local/bin:$PATH"

# Collect static files (ignore error if STATIC_ROOT not set)
RUN python manage.py collectstatic --noinput || true

# Expose port (Hugging Face uses 7860)
EXPOSE 7860

# Run migrations and start server
CMD python manage.py migrate && \
    gunicorn ScamGuardBackend.wsgi:application --bind 0.0.0.0:7860 --workers 2 --timeout 120
