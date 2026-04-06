# OpenIssue Backend Instructions

This folder contains the FastAPI backend for **OpenIssue**, an intelligent GitHub issue triage assistant.

## Features
- **Automatic Classification:** Classifies issues into 'bug', 'feature', or 'question' based on keywords.
- **Priority Assignment:** Assigns 'high', 'medium', or 'low' priority based on text content and critical keywords.
- **Duplicate Detection:** Uses `sentence-transformers` (`all-MiniLM-L6-v2`) and cosine similarity via `NumPy` to detect similar or duplicate issues.

## Tech Stack
- **Framework:** FastAPI + Uvicorn
- **Validation:** Pydantic
- **NLP / Embeddings:** `sentence-transformers`
- **Vector Operations:** `NumPy`

## Project Structure
```
backend/
├── app/
│   ├── main.py                 # FastAPI application, CORS, and router registration
│   ├── db.py                   # In-memory storage for issues
│   ├── models/                 # Additional data models
│   ├── schemas/
│   │   └── issue_schema.py     # Pydantic models for request/response validation
│   ├── services/
│   │   ├── classifier_service.py # Keyword-based classification logic
│   │   ├── embedding_service.py  # Lazy-loaded sentence transformer embedding generation
│   │   ├── priority_service.py   # Priority assignment logic
│   │   └── vector_service.py     # NumPy cosine similarity search
│   └── routes/
│       ├── analyze.py          # POST /analyze endpoint
│       ├── health.py           # GET /health endpoint
│       ├── issues.py           # GET /issues endpoint
│       └── similar.py          # GET /similar endpoint
├── requirements.txt            # Python dependencies
└── .env                        # Environment variables (if any)
```

## Running the Backend Locally

### 1. Prerequisites
Ensure you have Python 3.9+ installed.

### 2. Setup Virtual Environment
Navigate to the `backend` directory and create a virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
*(If `requirements.txt` is incomplete, the primary packages are: `fastapi uvicorn pydantic sentence-transformers numpy`)*

### 4. Start the Development Server
```bash
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`.

### 5. API Documentation
FastAPI automatically generates interactive API documentation.
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Key API Endpoints

### `GET /health`
Returns the health status of the API, the current loaded issue count, and metadata about the embedding model.

### `POST /analyze`
**Request Body:**
```json
{
  "title": "Login page crash on Firefox",
  "description": "When clicking the login button, the page becomes unresponsive."
}
```
**Response:**
Returns the predicted label, calculated priority, confidence scores, and a list of similar issues found in the database.

## Notes on Performance
- The `sentence-transformers` model is lazy-loaded on the first request to save memory during startup and idle times.
- Embeddings are generated and queried in-memory via `NumPy` for the MVP scope.
