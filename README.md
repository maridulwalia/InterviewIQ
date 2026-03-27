# InterviewIQ

**InterviewIQ** is an AI Interview Preparation Platform designed to help candidates prepare for interviews through realistic, automated mock interviews and analysis.

## Overview

This platform evaluates resumes, generates tailored interview questions using AI, tracks user responses, and analyzes the performance across structured sessions.

## Current Architecture & Tech Stack

### Frontend

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Routing:** React Router (`react-router-dom`)
- **State Management:** React Hook Form, TanStack React Query
- **Testing:** Vitest, Playwright

### Backend

- **Framework:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (`jsonwebtoken`), bcryptjs
- **File Parsing & Upload:** Multer, `pdf-parse`, and `mammoth` (for .docx support)
- **Validation:** `express-validator`

## Key Implemented Features

- **Secure Authentication:** Complete user registration, login, and protected routing.
- **Enhanced Document Processing:** Resume upload and parsing capabilities for both PDF and DOCX formats.
- **Environment API Integration:** Environment-based API configuration for smooth staging/production deployments.
- **Session Continuity:** Persistence implemented for interview flows, allowing users to pause and resume mock interviews.
- **Optimized Backend Performance:** Tuned backend payload structures for faster response and minimal latency.

## Future Advancements

We are actively working to expand the capabilities of InterviewIQ. The upcoming roadmap includes:

1. **AI-Driven Live Follow-Up Questions:** Adaptive conversation where AI generates increasingly difficult follow-up questions based on real-time candidate answers.
2. **Advanced Analytics Dashboard:** Comprehensive candidate tracking showing historical performance trends and areas for targeted improvement.
3. **Scalable Microservice Architecture:** Transitioning the core monolith AI module into independent scaling services for high load scenarios.

## Development Setup

Install dependencies across both frontend and backend:

```bash
npm run install:all
```

Run both frontend and backend concurrently in development mode:

```bash
npm run dev
```
