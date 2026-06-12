FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

RUN addgroup --system django && adduser --system --ingroup django django && \
    chown -R django:django /app
USER django

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "brain.wsgi:application"]