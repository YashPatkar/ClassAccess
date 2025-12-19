# ClassAccess (PDF Session Viewer)

ClassAccess is a lightweight backend system that allows teachers to upload PDFs and share temporary access with students using a secure session code.

The goal is to enable simple, time-bound PDF access without public file exposure or complex streaming logic.

---

## Current Features

### Teacher Flow
- Teacher authentication using JWT (SimpleJWT)
- Secure PDF upload via authenticated API
- Files stored privately in Supabase Storage
- Each upload creates a unique session with expiry time

### Student Flow
- Students access PDFs using a session code
- Backend generates a time-limited signed URL
- No authentication required for students
- Files are never publicly exposed

---

## Tech Stack

- Django + Django REST Framework
- SimpleJWT for authentication
- Supabase Storage (private buckets)
- PostgreSQL (sessions metadata)
- Postman for API testing

---

## Security Design

- PDFs are stored in a **private Supabase bucket**
- Students never receive raw file paths
- Access is provided only via short-lived signed URLs
- Session expiry is enforced at backend level

---

## Project Status

This repository currently contains:
- Authenticated teacher upload flow
- Supabase storage integration
- Session creation with expiry

Upcoming:
- Student access endpoint
- Signed URL generation
- Auto cleanup of expired sessions
- Optional AI-based PDF summary

---

## Why this project?

This project focuses on **practical backend architecture**:
- Proper access control
- Secure file handling
- Clean separation of responsibilities
- Simple, explainable design

Built intentionally without over-engineering.
