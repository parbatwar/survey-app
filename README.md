# Dynamic Survey Builder

A full-stack survey application built as a take-home project for the AiGeeks Full Stack Engineer internship.

The application allows authenticated admins to create and manage dynamic surveys, while public users can submit responses without logging in. It also includes question-level analytics, conditional logic, drag-and-drop reordering, editing, sharing, and basic submission spam protection.

---

## Features

### Admin

- Admin registration and login
- JWT-based authentication
- Protected admin routes
- Create surveys with:
  - Title
  - Description
  - Text input questions
  - Multiple-choice questions
  - Checkbox questions
  - Rating questions from 1 to 5
- Mark questions as required
- Add and remove questions
- Drag and drop to reorder questions
- Conditional logic
  - A question can be shown when a previous multiple-choice answer matches a selected value
- Edit existing surveys
- Share public survey links
- View survey analytics
- Basic IP-based rate limiting for public survey submissions

### Public Survey

- No login required
- Dynamic rendering based on the survey schema
- Supports:
  - Text answers
  - Single-choice answers
  - Multiple checkbox answers
  - Rating from 1 to 5
- Required-field validation
- Conditional question visibility
- Respondent email collection
- Success state after submission
- Basic spam protection on submissions

### Analytics

- Total response count
- Multiple-choice response counts
- Checkbox response counts
- Average rating
- List of text responses

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- dnd-kit

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic
- JWT authentication
- bcrypt password hashing

### Development / Infrastructure

- Docker
- Docker Compose
- PostgreSQL container for local development

---

## Architecture

The application follows a simple layered architecture.

```text
React Frontend
      |
      | REST API
      v
FastAPI Routers
      |
      v
Service Layer
      |
      v
SQLAlchemy Models
      |
      v
PostgreSQL
```

### Frontend Structure

The frontend separates pages from reusable survey-builder components.

```text
frontend/
└── src/
    ├── api/
    │   └── api.js
    ├── components/
    │   ├── ProtectedRoute.jsx
    │   └── survey-builder/
    │       ├── QuestionCard.jsx
    │       ├── SortableQuestion.jsx
    │       └── SurveyDetails.jsx
    ├── pages/
    │   ├── Admin.jsx
    │   ├── Analytics.jsx
    │   ├── CreateSurvey.jsx
    │   ├── EditSurvey.jsx
    │   ├── Login.jsx
    │   ├── PublicSurvey.jsx
    │   └── Register.jsx
    └── App.jsx
```

### Backend Structure

The backend separates HTTP handling, business logic, validation, persistence, and core utilities.

```text
backend/
└── app/
    ├── core/
    │   ├── rate_limiter.py
    │   └── security.py
    ├── models/
    │   ├── admin.py
    │   ├── response.py
    │   └── survey.py
    ├── routers/
    │   ├── admin_surveys.py
    │   ├── auth.py
    │   └── public_surveys.py
    ├── schemas/
    │   ├── auth.py
    │   ├── response.py
    │   └── survey.py
    ├── services/
    │   ├── analytics_service.py
    │   ├── auth_service.py
    │   ├── response_service.py
    │   └── survey_service.py
    ├── database.py
    ├── dependencies.py
    ├── enums.py
    └── main.py
```

### Why This Structure?

- **Routers** handle HTTP requests and responses.
- **Services** contain business logic.
- **Schemas** validate incoming and outgoing data.
- **Models** define database persistence.
- **Core** contains reusable security and rate-limiting utilities.

This keeps the code easier to maintain and prevents route files from becoming overloaded with business logic.

---

## Database Design

The application uses three main tables.

### Admin

Stores administrator accounts.

```text
admins
- id
- email
- hashed_password
- created_at
```

### Survey

Stores survey metadata and the complete question schema.

```text
surveys
- id
- admin_id
- title
- description
- questions (JSONB)
- created_at
- updated_at
```

The question structure is stored in PostgreSQL `JSONB`.

Example:

```json
{
  "id": "8d2f...",
  "type": "single_choice",
  "label": "Do you use our service?",
  "required": true,
  "options": ["Yes", "No"],
  "condition": null
}
```

Using JSONB makes the survey schema flexible while avoiding a large number of relational tables for every question type.

### Survey Response

Responses are stored separately from survey definitions.

```text
survey_responses
- id
- survey_id
- respondent_email
- answers (JSONB)
- created_at
```

Example answer payload:

```json
{
  "question-id-1": "Yes",
  "question-id-2": 5,
  "question-id-3": ["Design", "Development"]
}
```

Question IDs remain stable even when questions are reordered, so responses and conditional logic do not depend on array position.

---

## Conditional Logic

Conditional logic is intentionally kept simple.

A question can depend on a previous **multiple-choice** question.

Example:

```text
Q1: Do you use our service?
- Yes
- No

Q2: How would you rate it?

Show Q2 when:
Q1 = Yes
```

Stored schema:

```json
{
  "condition": {
    "question_id": "question-1-id",
    "operator": "equals",
    "value": "Yes"
  }
}
```

Only `equals` is currently supported.

The admin interface therefore does not expose multiple operators unnecessarily.

---

## Authentication

Admin authentication uses JWT.

Flow:

```text
Register/Login
     |
     v
JWT Access Token
     |
     v
Stored in localStorage
     |
     v
Axios Authorization Header
     |
     v
Protected FastAPI Route
```

Protected requests send:

```http
Authorization: Bearer <token>
```

Public survey routes do not require authentication.

---

## Rate Limiting / Spam Protection

Public survey submissions are protected with basic IP-based rate limiting.

Current rule:

```text
Maximum 5 submissions
per IP address
per survey
per 60-second window
```

If the limit is exceeded, the API returns:

```http
429 Too Many Requests
```

Example response:

```json
{
  "detail": "Too many submissions. Please try again in a minute."
}
```

The current implementation uses in-memory storage because this is a small take-home project.

For a production system, the limiter should use a shared store such as Redis so limits remain consistent across multiple backend instances and survive application restarts.

---

## API Overview

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Admin Survey Routes

Authentication required.

```http
POST   /admin/surveys
GET    /admin/surveys
GET    /admin/surveys/{survey_id}
PATCH  /admin/surveys/{survey_id}
DELETE /admin/surveys/{survey_id}
GET    /admin/surveys/{survey_id}/analytics
```

### Public Routes

No authentication required.

```http
GET  /public/surveys/{survey_id}
POST /public/surveys/{survey_id}/responses
```

The response submission endpoint is rate-limited.

---

## Local Setup

## Prerequisites

Install:

- Git
- Node.js
- Python
- Docker Desktop

---

## 1. Clone the Repository

```bash
git clone https://github.com/parbatwar/survey-app.git
cd survey-app
```

---

## 2. Environment Variables

Create the required `.env` file using the provided `.env.example`.

Typical backend variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/survey_db
SECRET_KEY=replace-with-a-secure-secret-key
```

Do not commit your real `.env` file.

---

## 3. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Confirm PostgreSQL is running:

```bash
docker compose ps
```

---

## 4. Backend Setup

Open a terminal:

```bash
cd backend
```

Create and activate a virtual environment.

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
alembic upgrade head
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend should run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 5. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend should run at:

```text
http://localhost:5173
```

---

## Application Flow

### Admin Flow

```text
Register
   ↓
Login
   ↓
Admin Dashboard
   ↓
Create Survey
   ↓
Configure Questions
   ↓
Share Public Survey
   ↓
View Analytics
```

### Respondent Flow

```text
Open Shared Survey URL
   ↓
Enter Email
   ↓
Answer Questions
   ↓
Conditional Questions Render Dynamically
   ↓
Submit Response
```

---

## Assumptions and Business Rules

### Admin-Only Survey Management

Only authenticated admins can create, edit, delete, or view analytics for their surveys.

Public users only have access to the public survey and response submission endpoints.

### Conditional Logic Source

Conditional logic currently uses previous multiple-choice questions only.

This was chosen because single-choice answers provide a predictable scalar value for `equals` comparisons.

Checkbox questions would require additional operators such as `contains`, while text conditions would introduce issues such as casing and whitespace.

### Stable Question IDs

Question IDs are generated in the frontend using:

```js
crypto.randomUUID()
```

This allows questions to be reordered without breaking:

- Existing answer mappings
- Conditional logic references

### Survey Schema as JSONB

The survey question schema is stored as JSONB rather than normalized into multiple question tables.

This was chosen because:

- Different question types contain different fields
- The assignment preferred JSON storage
- It keeps dynamic rendering straightforward
- The schema can be fetched and rendered in one API response

### Responses Stored Separately

Survey responses are not embedded inside the survey schema.

This keeps survey definitions separate from submitted data and allows analytics to operate on response records independently.

### Editing Existing Surveys

The current implementation allows surveys to be edited after creation.

In a larger production system, editing a survey after responses exist would require a stronger policy because changing question types, deleting questions, or changing options can affect historical analytics.

A production-ready extension would use one of these approaches:

1. Lock structural survey changes after the first response.
2. Allow only title and description edits after responses exist.
3. Introduce survey versioning and associate each response with a specific survey version.

Survey versioning was not implemented because it is an optional bonus and was intentionally kept outside the core scope.

### Publishing

A separate draft/published lifecycle was not added because publishing was not part of the required task.

A created survey is accessible through its public survey URL.

### Respondent Authentication

Respondents do not need accounts.

Only an email address is collected with each submission.

### Rate Limiting

Public survey submissions are limited to 5 submissions per minute per IP per survey.

This is intended as basic spam protection rather than a complete abuse-prevention system.

---

## Trade-Offs

### JSONB vs Fully Relational Questions

**Chosen:** JSONB

Advantages:

- Flexible schema
- Faster implementation for dynamic question types
- Simple frontend rendering
- Easy reorder support

Trade-off:

- Advanced database-level analytics and question querying are less relationally structured.

### Simple Conditional Logic

**Chosen:** single-choice + equals

Advantages:

- Easy to understand
- Matches the assignment example
- Predictable validation
- Simple dynamic rendering

Trade-off:

- Does not currently support:
  - Contains
  - Greater than
  - Multiple conditions
  - AND / OR groups

### JWT in localStorage

JWT is stored in `localStorage` for simplicity.

For a larger production application, authentication could be strengthened using secure HTTP-only cookies, refresh tokens, token rotation, and CSRF protection depending on the architecture.

### Analytics

Analytics are calculated from stored responses when requested.

This is simple and appropriate for the expected take-home project scale.

For very large datasets, analytics could be moved to pre-aggregated tables, background processing, caching, or database-level aggregation.

### In-Memory Rate Limiting

**Chosen:** In-memory IP-based rate limiting

Advantages:

- Simple implementation
- No additional infrastructure required
- Protects the public submission endpoint from basic spam

Trade-offs:

- Rate-limit state resets when the backend restarts
- Limits are not shared between multiple backend instances

For production, Redis or another shared store would be preferred.

---

## Optional Features Not Implemented

The following bonus features were intentionally left outside the core implementation:

- Survey versioning
- Partial response saving
- Respondent authentication

The project focuses on completing the required functionality cleanly within the expected take-home scope.

---

## Deployment

### Live Application

Frontend:

```text
ADD_FRONTEND_URL_HERE
```

Backend:

```text
ADD_BACKEND_URL_HERE
```

After deployment, update the frontend API base URL and backend CORS configuration to use the production URLs.