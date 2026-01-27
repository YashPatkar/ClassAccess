# ClassAccess (PDF Session Viewer)

ClassAccess is a lightweight backend system that allows teachers to upload PDFs and share temporary access with students using a secure session code.

The system is designed to be secure, memory-efficient, and easy to reason about.

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

### AI / RAG (Experimental)
- PDF text is chunked and indexed at upload time
- Lightweight TF-IDF embeddings used for retrieval
- No heavy ML libraries or paid APIs
- Designed to work within low-memory environments

---

## Tech Stack

- Django + Django REST Framework
- SimpleJWT for authentication
- Supabase Storage (private buckets)
- PostgreSQL + pgvector
- scikit-learn (TF-IDF embeddings)
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
- Lightweight RAG indexing pipeline

Upcoming:
- Student access endpoint
- Signed URL generation
- Auto cleanup of expired sessions
- Improved retrieval quality

---

## Why this project?

This project focuses on **practical backend engineering**:
- Secure access control
- Memory-aware system design
- Avoiding unnecessary abstractions
- Clear trade-offs and incremental scaling

Built intentionally without over-engineering.
