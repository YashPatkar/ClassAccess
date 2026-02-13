FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./

# Install exactly what is in uv.lock globally
RUN uv export --frozen --no-dev > requirements.txt \
    && uv pip install --system -r requirements.txt \
    && rm requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput || true

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]