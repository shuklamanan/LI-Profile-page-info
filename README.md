# LinkedIn Profile Intelligence & API Explorer

A modern, full-stack application designed to extract, normalize, and visually inspect public LinkedIn profile data (including experience, education, verified skills, headline, summary, certifications, and metadata telemetry) via the LinkedIn Voyager Dash API.

Built as a clean monorepo containing an **Express TypeScript Backend API** and a **React + TypeScript Frontend Dashboard**.

---

## Project Architecture

```
LI-Profile/
├── package.json              # Monorepo orchestration scripts (dev, build, install)
├── .gitignore                # Root gitignore for both frontend & backend
├── README.md                 # Project documentation
│
├── backend/                  # Express + TypeScript Backend
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies & scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── src/
│       ├── index.ts          # Server entrypoint with error handling
│       ├── app.ts            # Express application middleware & routing
│       ├── core/             # Configuration (dotenv) & custom exceptions
│       ├── integrations/     # LinkedIn Voyager Dash API client
│       ├── middlewares/      # Error handler middleware
│       ├── models/           # TypeScript interfaces (ProfileData, ResponseMeta, etc.)
│       ├── parsers/          # Profile normalization & extraction parsers
│       ├── routes/           # Routes (/health, /api/v1/profiles)
│       └── services/         # Profile aggregation & business logic
│
└── frontend/                 # React 19 + TypeScript + Vite Frontend
    ├── .env.example          # Frontend environment variables template
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.ts        # Vite configuration with API proxy (port 3000)
    ├── index.html            # Entry HTML with custom typography (Plus Jakarta Sans)
    └── src/
        ├── index.css         # Modern dark-mode design system & glassmorphism
        ├── App.tsx           # Main application dashboard layout
        ├── main.tsx          # React application root
        ├── types/            # TypeScript interfaces for API responses
        ├── services/         # Fetch client for /health and /api/v1/profiles
        └── components/
            ├── Header.tsx           # Top navigation with live Backend Health badge & latency
            ├── ProfileSearch.tsx    # Search box with sample profile chips & loading skeletons
            ├── ProfileView.tsx      # Comprehensive visual profile dashboard & metric cards
            ├── ExperienceList.tsx   # Experience timeline cards
            ├── EducationList.tsx    # Education cards
            ├── SkillsCloud.tsx      # Interactive skill badges with search filter
            ├── CertificationsList.tsx # Certifications & credentials
            ├── LanguagesList.tsx    # Language proficiency meters
            ├── MetaSection.tsx      # Telemetry info (freshness, partial status)
            └── JsonViewer.tsx       # Raw API JSON viewer with Copy & Download
```

---

## Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0+ (Node v20+ recommended)
- **npm**: v9.0.0+

### 2. Installation
Install all dependencies across the workspace with a single command:

```bash
npm run install:all
```

*(Or install individually in `backend/` and `frontend/` using `npm install`)*

---

### 3. Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

Populate with your LinkedIn session credentials:
```env
PORT=3000
COOKIE="your_li_at_cookie_value"
CSRF_TOKEN="ajax:1234567890123456789"
```

#### How to obtain LinkedIn Cookies:
1. Log in to **LinkedIn** (https://www.linkedin.com) in your browser.
2. Open **Developer Tools** (`F12` or `Cmd + Option + I`).
3. Go to **Application** (Chrome/Brave) or **Storage** (Firefox) -> **Cookies** -> `https://www.linkedin.com`.
4. Copy the value of **`li_at`** into `COOKIE`.
5. Copy the value of **`JSESSIONID`** into `CSRF_TOKEN`.

---

### 4. Running Locally

You can launch both the Backend and Frontend simultaneously from the root directory:

```bash
# Starts Backend (http://localhost:3000) and Frontend (http://localhost:5173) concurrently
npm run dev
```

Alternatively, run each service independently:

```bash
# Start Backend API only
npm run dev:backend

# Start Frontend App only
npm run dev:frontend
```

---

## API Reference (Backend)

### `GET /health`
Checks backend service availability and connectivity.

* **Response (`200 OK`)**:
```json
{
  "status": "ok"
}
```

---

### `POST /api/v1/profiles`
Fetches and structures profile data for a given LinkedIn public URL or vanity username.

* **Request Body**:
```json
{
  "profileUrl": "https://www.linkedin.com/in/manan-shukla-881686226"
}
```

* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": "manan-shukla-881686226",
    "url": "https://www.linkedin.com/in/manan-shukla-881686226",
    "firstName": "Manan",
    "lastName": "Shukla",
    "name": "Manan Shukla",
    "headline": "Application Developer @ Noovosoft Technologies",
    "about": "Application Developer leveraging expertise in backend technologies, data scraping, and API frameworks...",
    "location": {
      "city": "Ahmedabad",
      "region": "Gujarat",
      "country": "India"
    },
    "profileImage": {
      "url": "https://media.licdn.com/..."
    },
    "experience": [
      {
        "title": "Application Developer",
        "company": "Noovosoft Technologies",
        "companyUrl": "https://www.linkedin.com/company/noovosoft",
        "startDate": "2023-01",
        "endDate": "Present",
        "description": "Developing high-performance backend systems..."
      }
    ],
    "education": [
      {
        "institution": "Gujarat Technological University",
        "degree": "Bachelor of Engineering",
        "fieldOfStudy": "Computer Engineering"
      }
    ],
    "skills": ["Node.js", "TypeScript", "Express", "MongoDB", "Data Scraping"],
    "certifications": [],
    "languages": []
  },
  "meta": {
    "partial": false,
    "missingSections": [],
    "retrievedAt": "2026-08-31T17:16:20.537Z"
  }
}
```

---

## Frontend Features

- **Real-time Backend Health Monitor**: Header badge pings `/health` periodically and shows live latency in milliseconds with manual re-ping support.
- **Smart Search Bar**: Accepts full URLs (`https://www.linkedin.com/in/...`) or vanity usernames with pre-configured quick-test chips (`Sample Profile`, `Satya Nadella`, `Bill Gates`).
- **Executive Metrics Bar**: Summarizes total experience records, education count, skill listings, and extraction status.
- **Profile Hero & Avatar Fallback**: Dynamic monogram initials avatar (`MS`) if no profile picture is available.
- **Copy Actions & JSON Explorer**: Includes one-click **Copy About**, **Copy JSON**, and **Download JSON** `.json` export buttons.

---

## Deployment Guide

### Deploying the Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set the root directory of your build to `frontend`.
2. Add the environment variable pointing to your deployed backend:
   ```env
   VITE_API_URL=https://your-deployed-backend-api.com
   ```
3. Build command: `npm run build`
4. Output directory: `dist`

### Deploying the Backend (Render / Railway / AWS / Docker)
1. Set root directory to `backend`.
2. Add environment variables:
   ```env
   PORT=3000
   COOKIE="your_li_at_cookie_value"
   CSRF_TOKEN="your_jsessionid_value"
   ```
3. Build command: `npm run build`
4. Start command: `npm run start`

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Runs both backend and frontend development servers concurrently |
| `npm run dev:backend` | Starts backend development server with `tsx watch` |
| `npm run dev:frontend` | Starts frontend Vite development server |
| `npm run build` | Builds both backend (`tsc`) and frontend (`vite build`) for production |
| `npm run build:backend` | Compiles backend TypeScript to `backend/dist` |
| `npm run build:frontend` | Compiles frontend React app to `frontend/dist` |
| `npm run install:all` | Installs dependencies for root, backend, and frontend |
