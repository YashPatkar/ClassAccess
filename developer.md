# ClassAccess Developer Guide

## Overview
This document covers development setup, technologies used, and application flows.

## Tech Stack

### Backend
- Django, Django REST Framework
- SimpleJWT for JWT auth
- Supabase Storage (private bucket)
- PostgreSQL with pgvector (optional) or SQLite
- Redis (optional) with LocMemCache fallback
- Celery (optional)

### Frontend
- React 18, Vite
- React Router
- Tailwind CSS
- Axios

## Project Structure

- backend/ - Django project and apps
- frontend/ - React application

## Local Setup

### Backend
1) Create and activate a Python environment.
2) Install dependencies:
   - `pip install -r backend/requirements.txt`
3) Create a `.env` file in `backend/` and set required values:
   - `SECRET_KEY`
   - `DEBUG=true`
   - `ALLOWED_HOSTS=localhost,127.0.0.1`
   - `CORS_ALLOWED_ORIGINS=http://localhost:5173`
   - `CSRF_TRUSTED_ORIGINS=http://localhost:5173`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_BUCKET`
   - `GROQ_API_KEY` (optional if AI features are used)
4) Run migrations:
   - `python backend/manage.py migrate`
5) Start the server:
   - `python backend/manage.py runserver`

### Frontend
1) Install dependencies:
   - `cd frontend`
   - `npm install`
2) Create `.env` in `frontend/` and set:
   - `VITE_API_BASE_URL=http://localhost:8000`
3) Start the dev server:
   - `npm run dev`

## Auth Flow (LocalStorage + Refresh)

1) User logs in at `/login`.
2) Backend returns `access` and `refresh` tokens.
3) Frontend stores tokens in `localStorage`:
   - `token` (access)
   - `refresh_token`
4) Axios attaches `Authorization: Bearer <token>` to non-public requests.
5) On 401 from protected endpoints, frontend calls `/auth/refresh/`.
6) On success, it updates `token` and retries the original request.
7) On refresh failure, tokens are cleared and user is redirected to `/login`.

## Teacher Upload Flow

1) Teacher uploads a PDF and sets expiry.
2) Backend stores the file in a private Supabase bucket.
3) A unique session code is generated and returned.
4) Teacher shares the code with students.

## Student Access Flow

1) Student enters the session code at `/access`.
2) Backend validates code and expiry.
3) Backend returns a signed URL to the PDF.
4) Frontend opens the PDF viewer at `/access/view`.

## RAG / AI Flow (Optional)

1) PDF text is extracted after upload.
2) Text is chunked and vectorized using TF-IDF.
3) Vectors are stored in pgvector.
4) Retrieval is done against the document only.

## Notes

- Redis and Celery are optional. If Redis is not set, the app falls back to LocMemCache.
- Use HTTPS in production when storing secrets and tokens.
