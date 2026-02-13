# ClassAccess

ClassAccess is a secure PDF sharing platform that lets teachers upload documents and share temporary access with students using session codes.

## Features

- JWT-based teacher authentication (SimpleJWT)
- PDF upload with session codes and expiry windows
- Private Supabase Storage with signed URL access
- Student access by code without login
- Teacher dashboard for managing uploads
- Optional Redis and Celery, with safe fallbacks
- Lightweight RAG pipeline (optional)
- Responsive React UI

## First Setup (Main Folder)

1) Backend setup:
	- `pip install -r backend/requirements.txt`
	- Create `backend/.env` with required values (see developer.md)
	- `python backend/manage.py migrate`
	- `python backend/manage.py runserver`

2) Frontend setup:
	- `cd frontend`
	- `npm install`
	- Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8000`
	- `npm run dev`

For development details, see developer.md.
