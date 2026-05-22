# InterviewIQ – AI Interview Preparation Platform


## 1. Project Title & Overview

**InterviewIQ** is an advanced, AI-powered interview preparation platform designed to help candidates land their dream jobs by providing highly personalized, resume-driven mock interviews.

Unlike generic interview prep tools, InterviewIQ ingests the user's uploaded resume, analyzes their specific skill set and projects, and dynamically generates custom interview sessions. Utilizing Google's Gemini AI, the platform evaluates candidate answers in real-time, providing immediate scoring, actionable feedback, and highlighting missing points.

Whether you are preparing for a technical deep-dive, behavioral questions, or HR rounds, InterviewIQ acts as your intelligent, 24/7 personal interviewer.

---

## 2. Features

### Authentication

* **Secure Signup/Login:** Standard email and password authentication.
* **JWT Auth:** Stateless, secure JSON Web Token (JWT) based session management.

### Resume System

* **Seamless Upload:** Support for PDF and DOCX files.
* **Intelligent Parsing:** Extracts text automatically for AI context.
* **Personalized Foundation:** Drives the entire interview generation process based on parsed text.

### AI Interview Engine

* **Resume-Aware Questions:** Questions strictly based on skills and projects found in the resume.
* **Difficulty Selection:** Choose between EASY, MEDIUM, and HARD.
* **Multi-Dimensional Questioning:** Automatically balances Technical, HR, Behavioral, and Aptitude questions.

### Mock Interview Mode

* **Configurable Sessions:** Users can configure question counts and specific technical categories (e.g., React, Node.js, System Design).
* **Timer-Based & Practice Modes:** Simulate real-time pressure or practice at your own pace.

### AI Evaluation

* **Real-Time Scoring:** Get a score out of 10 for every answer.
* **Constructive Feedback:** Detailed critique of the given answer.
* **Missing Points:** Identifies exactly what key concepts were missed.
* **Improvement Suggestions:** Actionable advice to improve future responses.

### Analytics

* **Performance Tracking:** Historical scoring across sessions.
* **Weak Area Identification:** Visual breakdown of performance by category.
* **Recommendations:** Insights derived from historical data to focus prep efforts.

---

## 3. Tech Stack

### Frontend

* **Core:** React 18, TypeScript, Vite
* **Routing:** React Router v6
* **Form Handling:** React Hook Form + Zod validation
* **Data Fetching:** TanStack React Query + Axios

### Backend

* **Core:** Node.js, Express.js
* **File Parsing:** multer, pdf-parse, mammoth
* **Validation:** Joi, express-validator

### Database

* **Database:** MongoDB
* **ORM/ODM:** Mongoose

### AI Services

* **Provider:** Google Generative AI (Gemini 1.5 Flash)

### Authentication

* **Security:** bcryptjs, jsonwebtoken (JWT)

### Charts & UI

* **Styling:** Tailwind CSS
* **Components:** shadcn/ui, Radix UI primitives
* **Animations:** Framer Motion
* **Charts:** Recharts

---

## 4. System Architecture

The application follows a modern decoupled Client-Server architecture:

**Frontend Architecture:** React Single Page Application (SPA) utilizing modular components, context-based state management, and React Query for server-state synchronization. Tailwind and Shadcn/ui ensure a highly consistent and accessible design system.

**Backend Architecture:** RESTful Express API following the Controller-Service-Route pattern. This separation of concerns ensures that business logic (Services) is decoupled from HTTP transport layers (Routes/Controllers).

**Data Flow:**
`Frontend (React)` ➔ `API Request (Axios)` ➔ `Express Routes` ➔ `Auth Middleware (JWT)` ➔ `Controllers` ➔ `Services (Business Logic)` ➔ `MongoDB / Gemini AI` ➔ `Response`

**AI Flow:** Resume text is extracted and stored. Upon starting an interview, the `aiService` constructs a strict prompt containing the resume context, difficulty, and category weights. The Gemini AI returns a structured JSON payload of questions. When an answer is submitted, another prompt is executed to evaluate the text against the original question and resume context.

---

## 5. Folder Structure

### Root Structure

```text
InterviewIQ/
├── backend/          # Node.js Express API
├── frontend/         # React Vite Application
├── package.json      # Root package (concurrently scripts)
└── README.md
```

### Backend Structure

```text
backend/
├── config/           # Database config & Seed scripts
├── controllers/      # HTTP request handlers (auth, resume, question, answer, analytics)
├── middleware/       # JWT auth, Multer upload, Joi validators
├── models/           # Mongoose schemas (User, Resume, Question, Answer, InterviewSession)
├── routes/           # Express router definitions
├── services/         # Business logic (aiService, analyticsService, resumeService)
├── uploads/          # Temporary local file storage
└── server.js         # Application entry point
```

### Frontend Structure

```text
frontend/
├── public/           # Static assets
└── src/
    ├── components/   # Reusable UI components (shadcn ui)
    ├── hooks/        # Custom React hooks
    ├── lib/          # Utilities (tailwind merge, formatting)
    ├── pages/        # Route components (Dashboard, Interview, Login, etc.)
    ├── services/     # API client wrappers (Axios calls)
    ├── App.tsx       # Main React component
    └── main.tsx      # React DOM entry point
```

---

## 6. API Documentation

All protected routes require an `Authorization: Bearer <token>` header.

### Authentication

| Method   | Endpoint             | Auth | Purpose           | Request Body                  |
| -------- | -------------------- | ---- | ----------------- | ----------------------------- |
| `POST` | `/api/auth/signup` | No   | Register new user | `{ name, email, password }` |
| `POST` | `/api/auth/login`  | No   | Authenticate user | `{ email, password }`       |

### Resume

| Method     | Endpoint               | Auth | Purpose                 | Request Body                |
| ---------- | ---------------------- | ---- | ----------------------- | --------------------------- |
| `POST`   | `/api/resume/upload` | Yes  | Upload and parse resume | `FormData (file: resume)` |
| `GET`    | `/api/resume/me`     | Yes  | Get active user resume  | -                           |
| `GET`    | `/api/resume`        | Yes  | Get all user resumes    | -                           |
| `DELETE` | `/api/resume/:id`    | Yes  | Delete a resume         | -                           |

### Questions & Interviews

| Method   | Endpoint                | Auth | Purpose                   | Request Body                     |
| -------- | ----------------------- | ---- | ------------------------- | -------------------------------- |
| `POST` | `/api/questions`      | Yes  | Generate custom questions | `{ role, difficulty, config }` |
| `GET`  | `/api/questions/all`  | Yes  | Get predefined questions  | -                                |
| `POST` | `/api/questions/mock` | Yes  | Generate a mock session   | `{ role, difficulty, config }` |

### Answers

| Method   | Endpoint         | Auth | Purpose                  | Request Body                              |
| -------- | ---------------- | ---- | ------------------------ | ----------------------------------------- |
| `POST` | `/api/answers` | Yes  | Submit & evaluate answer | `{ questionId, answerText, sessionId }` |
| `GET`  | `/api/answers` | Yes  | Get historical answers   | -                                         |

### Analytics

| Method  | Endpoint           | Auth | Purpose                   | Request Body |
| ------- | ------------------ | ---- | ------------------------- | ------------ |
| `GET` | `/api/analytics` | Yes  | Get user performance data | -            |

---

## 7. Database Models

* **User**: Core identity model. Stores `name`, `email`, and hashed `password`.
* **Resume**: Represents uploaded files. Stores `userId`, `originalName`, `fileUrl`, and the highly critical `extractedText` used for AI context.
* **Question**: Static repository of predefined fallback questions (contains `text`, `type`, `category`).
* **Answer**: Stores user attempts. Links `userId`, `questionId`, and `sessionId`. Holds AI evaluation results: `answerText`, `score`, `feedback`, `missingPoints`, and `improvementSuggestion`.
* **InterviewSession**: Represents a discrete interview event. Stores the configuration (`role`, `difficulty`, `questionConfig`), the generated `questions` array, and a `generatedByAI` flag. Enables session caching and reuse.

---

## 8. AI Workflow

1. **Context Extraction:** Upon PDF/DOCX upload, `pdf-parse`/`mammoth` extracts raw text. This text is saved to the `Resume` model.
2. **Prompt Construction:** The `aiService.js` constructs a heavily engineered prompt passing the target Role, Difficulty, Config (e.g., 5 tech, 2 HR), and the exact Resume Text.
3. **Strict Formatting:** The prompt demands strict JSON output conforming to the required schema, mitigating AI hallucination.
4. **Resilient Parsing:** A custom Regex-based JSON extractor cleans markdown blocks (` ```json `) to prevent JSON parse errors.
5. **Evaluation:** When an answer is submitted, the AI receives the Question, the User's Answer, and the Resume Context. It grades the answer from 0-10 and outputs structured feedback and missing points.

---

## 9. Local Development Setup

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (Local instance or Atlas URI)
* Google Gemini API Key

### 1. Clone & Root Setup

```bash
git clone <repository-url>
cd InterviewIQ
npm run install:all
```

*(This installs root dependencies, backend dependencies, and frontend dependencies concurrently).*

### 2. Backend Setup

Navigate to the backend directory and set up environment variables:

```bash
cd backend
cp .env.example .env
```

Update `.env` with your actual MongoDB URI and Gemini API Key.
Run the server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
cp .env.example .env
npm run dev
```

The frontend defaults to `http://localhost:5000/api` for backend requests. If your backend runs somewhere else, update `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For the deployed Render backend, set the Vercel environment variable to:

```env
VITE_API_BASE_URL=https://interviewiq-gnfx.onrender.com/api
```

### 4. Run Concurrently (Recommended)

From the root directory, simply run:

```bash
npm run dev
```

This will start both the Express backend and the Vite frontend simultaneously.

---

## 10. Environment Variables

Create a `.env` file in the `backend/` directory.

```env
# Server Configuration
PORT=5000
FRONTEND_URLS=http://localhost:8080,http://localhost:5173,http://localhost:3000,https://interview-iq-bice.vercel.app

# Database
MONGO_URI=mongodb://localhost:27017/interviewiq

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
```

Create a `.env` file in the `frontend/` directory.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 11. Application Flow

1. **Onboarding:** User signs up and logs in, receiving a JWT.
2. **Setup:** User navigates to Resume Management and uploads their current CV.
3. **Configuration:** User goes to Dashboard and configures a new mock interview (selects role, difficulty, and question distribution).
4. **Generation:** Backend AI service reads the parsed resume and generates a personalized `InterviewSession`.
5. **Execution:** User takes the mock interview. Each submitted answer is evaluated by AI in real-time.
6. **Review:** User views their analytics dashboard, tracking scores, weak categories, and reading detailed feedback.

---

## 12. Scalability & Architecture Decisions

* **Modular Service Layer:** By decoupling business logic into `services/`, we can easily swap AI providers (e.g., from Gemini to OpenAI) without touching controllers or routing logic.
* **Session Caching:** The `InterviewSession` model caches AI-generated questions. This reduces API costs and allows users to retake the exact same interview.
* **Compound Database Indexing:** `InterviewSession` utilizes compound indexes on `[userId, role, difficulty, config]` for blazing-fast lookups.
* **Robust AI Parsing:** The `aiService` implements a fallback mechanism and regex-based JSON cleaning to gracefully handle API timeouts or malformed AI responses.
* **Component-Driven UI:** Using Shadcn UI and Tailwind ensures highly reusable, performant, and CSS-bloat-free components.

---

## 13. Future Improvements

* **Speech-to-Text Integration:** Allow users to answer questions using their microphone via Web Speech API.
* **Video Interviews:** Implement WebRTC to record sessions and analyze body language or eye contact.
* **Adaptive Difficulty:** Automatically scale difficulty mid-interview based on the rolling average of previous answer scores.
* **Real-time Voice Agent:** Implement an active conversational AI voice that asks the questions aloud.
* **Dockerization:** Add Docker and docker-compose files for streamlined one-click deployments.

---

## 14. Automated Testing

The project includes an automated script to verify the core system flow and detect authentication or state persistence bugs. 

To run the full system test simulation:
```bash
node script-tests.js
```

**Test Coverage Includes:**
1. **Login Test:** Verifies authentication and JWT generation.
2. **Token Persistence Check:** Simulates tab switching to detect frontend state reset bugs.
3. **Questions API Test:** Validates protected route access using the generated token.
4. **Answer Submission:** Tests the end-to-end flow of saving a generated answer.
5. **Analytics Test:** Ensures performance data is successfully retrieved.
6. **Route Switch Stress Test:** Rapidly queries endpoints to simulate stress and ensure the token is not invalidated on navigation.

---

## 15. Troubleshooting

* **MongoDB Connection Refused:** Ensure your local MongoDB server is running on port 27017, or verify your Atlas IP whitelist.
* **AI Generation Fails / Fallback Triggered:** Check your `GEMINI_API_KEY`. If the quota is exceeded, the system will seamlessly fall back to static predefined questions.
* **CORS Errors:** Ensure the frontend URL matches the CORS configuration in `backend/server.js`. By default, Vite runs on `http://localhost:5173`.
* **Empty Resume Text:** If PDF parsing fails, the AI will generate questions based purely on the target role. Check `uploads/` directory permissions.
* **JWT Expiration:** If API calls suddenly return 401 Unauthorized, log out and log back in to refresh the token stored in localStorage.

---

## 16. Contributors / Author

* **Architecture & Development:** [Maridul Walia]
* **Project Status:** Active Development

*Designed to bridge the gap between candidate preparation and real-world expectations.*
