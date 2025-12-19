# ClassAccess — Developer Progress Notes

This README tracks backend implementation progress and design decisions.
I maintain this file to document thinking, trade-offs, and system evolution.

---

## Phase 1 — Core Architecture (Completed)

### Goal
Build a minimal, secure system for temporary PDF sharing.

Avoid:
- Public file URLs
- Server-side PDF streaming
- Over-engineered real-time systems

---

## Implemented Flow

### 1. Teacher Upload (Authenticated)
- JWT-based authentication using SimpleJWT
- Multipart form-data upload
- PDF stored in Supabase private bucket
- Unique session created per upload
- Session has:
  - unique access code
  - expiry timestamp
  - file path reference

Reasoning:
- Teachers are trusted, authenticated actors
- Files should never be public
- Supabase handles storage scalability

---

### 2. Storage Design (Supabase)
- Private bucket (`pdf-sessions`)
- Files stored under `sessions/<uuid>.pdf`
- No public access enabled
- Signed URLs generated only on demand

Lesson learned:
- Supabase Python SDK emits misleading warnings
- Actual storage operations still succeed
- Verified via dashboard and SDK list calls

---

### 3. API Testing
- Postman used instead of DRF browser
- Tested JWT auth, upload, storage persistence
- Confirmed files are physically stored in Supabase

---

## Key Design Decisions

### Why not return file URL on upload?
- Upload URL should not be public
- Signed URLs should be short-lived
- URL generation is a **student responsibility**, not teacher

Instead:
- Teacher receives a session code
- Student uses code to request access

---

### Why Supabase over local storage?
- Avoids server disk issues
- Easier future scaling
- Clean separation between API and file storage

---

## Current State Summary

- JWT auth working
- Teacher upload working
- Files saved in Supabase
- Session expiry stored
- Ready for student access endpoint

---

## Next Planned Steps

1. Student access endpoint
2. Signed URL generation with expiry bound to session
3. Error handling for expired/invalid codes
4. Optional cleanup job for expired sessions
5. Optional AI-based PDF summary

---

## Interview Talking Point

"I design features in small, testable steps.  
I document progress so I can clearly explain decisions, trade-offs, and future improvements."

This README is part of that process.
