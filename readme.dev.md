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
- Heavy third-party abstractions
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

## Phase 2 — AI / RAG Integration (In Progress)

### Goal
Enable question-answering over uploaded PDFs without increasing infra cost or memory usage.

Constraints:
- Backend hosted on Render (512 MB RAM)
- No heavy ML dependencies (torch, transformers)
- No paid embedding APIs
- Predictable memory usage

---

### Initial Approach (Abandoned)
- Used LlamaIndex for RAG pipeline
- Pulled heavy dependencies:
  - torch
  - transformers
  - sentence-transformers
- Caused memory pressure and dependency bloat
- Not suitable for Render free / low-tier plans

Decision:
- Removed LlamaIndex entirely
- Replaced with custom, minimal RAG implementation

---

### Current RAG Design (Lightweight)

#### Text Processing
- PDF text extracted
- Split into small, fixed-size chunks
- Chunks processed at upload time only

#### Embeddings
- TF-IDF used instead of neural embeddings
- Implemented via scikit-learn
- Vectors padded to fixed dimension (1536) to match pgvector schema

Reasoning:
- Free
- Fast
- Low memory
- Good enough for document-scoped retrieval
- Easy to swap later for semantic embeddings

---

### Vector Storage
- PostgreSQL + pgvector
- Fixed 1536-dimension vectors
- Stored per document chunk
- Insert happens during PDF upload pipeline

---

## Key Design Decisions

### Why remove LlamaIndex?
- Too many transitive ML dependencies
- Memory-heavy for simple RAG needs
- Reduced observability and control
- Overkill for single-document Q&A

---

### Why TF-IDF instead of cloud embeddings?
- Google embeddings require quota/billing
- OpenAI requires credit card
- TF-IDF satisfies all constraints:
  - Free
  - Lightweight
  - Deterministic
  - Render-safe

---

## Current State Summary

- JWT auth working
- Teacher upload working
- Files saved in Supabase
- Session expiry stored
- Lightweight RAG pipeline implemented
- No heavy ML dependencies
- Stable on 512 MB memory

---

## Next Planned Steps

1. Student access endpoint
2. Signed URL generation with expiry bound to session
3. Error handling for expired/invalid codes
4. Optional cleanup job for expired sessions
5. Improve retrieval ranking
6. Optional future switch to semantic embeddings (paid tier)

---

## Interview Talking Point

"I intentionally removed heavyweight frameworks when they didn’t fit my infra constraints.
I prefer simple, explainable systems that I fully control and can scale incrementally."

This README documents that process.
