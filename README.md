# College Attendance System

A production-grade modern Web Application monorepo for managing college attendance using Dynamic QR Codes and Facial Biometric Verification.

---

## Architecture & Technology Stack

- **Frontend**: React (Vite), JavaScript, Vanilla CSS Design System, Axios, React Router v6, Lucide React
- **Backend**: Node.js, Express.js (ES Modules), MongoDB with Mongoose, JWT, BcryptJS
- **Database**: MongoDB (Local or Atlas)
- **Architecture**: Decoupled Monorepo with RESTful API contracts

---

## Monorepo Folder Structure

```text
college-attendance-system/
├── frontend/                     # React + Vite client application
│   ├── public/                   # Static public assets
│   ├── src/                      # Source code
│   │   ├── api/                  # Axios HTTP client and API endpoints
│   │   ├── assets/               # Local images, logos, icons
│   │   ├── components/           # Reusable UI components by domain
│   │   │   ├── common/           # Shared UI (Button, Modal, Card, Loader)
│   │   │   ├── auth/             # Auth-specific widgets (LoginForm, RegisterForm)
│   │   │   ├── attendance/       # Attendance tables, filters, stats
│   │   │   ├── qr/               # QR generator & QR scanner components
│   │   │   ├── faceRecognition/  # Camera capture & biometric enrollment widgets
│   │   │   └── dashboard/        # Stat cards, metrics, summary charts
│   │   ├── context/              # Global React Context providers (AuthContext)
│   │   ├── hooks/                # Custom React hooks (useAuth, useCamera, etc.)
│   │   ├── layouts/              # Shell layouts (AuthLayout, DashboardLayout)
│   │   ├── pages/                # Application page views
│   │   │   ├── auth/             # Login and Registration pages
│   │   │   ├── teacher/          # Teacher dashboard, session creator, reports
│   │   │   ├── student/          # Student dashboard, scan QR, face enrollment
│   │   │   └── NotFoundPage.jsx  # 404 view
│   │   ├── routes/               # Centralized router & protected routes (AppRoutes.jsx)
│   │   ├── utils/                # Helper utilities (formatters, date utils)
│   │   ├── App.jsx               # Root App wrapper
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Vanilla CSS design tokens, reset, utility classes
│   ├── .env.example              # Frontend environment variables template
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration and server proxy setup
├── backend/                      # Node.js + Express REST API
│   ├── src/                      # Backend source code
│   │   ├── config/               # Database connection and environment parsing
│   │   ├── controllers/          # Route handlers & business request orchestrators
│   │   ├── middleware/           # Auth, role check, validation, centralized error handling
│   │   ├── models/               # Mongoose data schemas (User, Student, Subject, Session, Attendance)
│   │   ├── routes/               # API endpoint route definitions (/api/v1/*)
│   │   ├── services/             # Core business logic (QR generation, token validation, CSV export)
│   │   ├── validators/           # Request body validation schemas
│   │   ├── utils/                # Custom errors (ApiError), async wrappers, constants
│   │   ├── app.js                # Express app setup, CORS, middleware, route mounting
│   │   └── server.js             # HTTP server entry point and DB connection
│   ├── tests/                    # Backend automated tests
│   ├── uploads/                  # Temporary upload storage for biometric/file assets
│   │   └── .gitkeep              # Git tracking placeholder
│   ├── .env.example              # Backend environment variables template
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   └── nodemon.json              # Nodemon configuration for hot reloading
├── docs/                         # System architecture & developer documentation
│   ├── API.md                    # REST API endpoints and data contract specifications
│   ├── DATABASE_SCHEMA.md        # Mongoose data models, relations, indexes
│   ├── ARCHITECTURE.md           # System design, data flow, security model
│   ├── SETUP.md                  # Comprehensive environment setup guide
│   └── PRIVACY_AND_CONSENT.md    # Biometric data handling, ethics & privacy standards
├── .gitignore                    # Root ignore rules
├── package.json                  # Root monorepo scripts
└── README.md                     # Project overview and instructions
```

---

## Directory Purpose Overview

| Directory / File | Description |
| :--- | :--- |
| `frontend/` | Complete React + Vite single-page application handling user interfaces for Teachers and Students. |
| `frontend/src/api/` | Axios instance (`axiosClient.js`) and modular API calls for auth, students, sessions, and attendance. |
| `frontend/src/components/` | Modular component hierarchy divided by business feature (QR, Face Biometrics, Dashboard, Common). |
| `frontend/src/layouts/` | Page wrappers containing shared sidebars, headers, and navigation bars for authenticated dashboards. |
| `frontend/src/routes/` | Declarative routing system routing to auth, student, and teacher dashboards with role guards. |
| `backend/` | Express.js REST API providing secure endpoints, business services, and database persistence. |
| `backend/src/models/` | Mongoose ODM schemas enforcing data integrity for Users, Students, Subjects, Sessions, and Attendance. |
| `backend/src/services/` | Decoupled business logic such as cryptographic dynamic QR generation, JWT token issuance, and CSV reporting. |
| `backend/src/middleware/`| Security layers including JWT verification, role-based access control (RBAC), and standardized error handling. |
| `docs/` | Technical documentation covering architecture, database relations, REST specs, setup, and privacy policies. |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on v24.x)
- **npm**: v9.0.0 or higher (Tested on v11.x)
- **MongoDB**: Running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI
- **Git** (optional, recommended)

### 1. Install Dependencies

You can install all dependencies from the root directory or per workspace:

```bash
# Option A: From root (installs backend and frontend dependencies)
npm run install:all

# Option B: Individually
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Default values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/college_attendance
JWT_SECRET=supersecretjwtkey_replace_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
QR_TOKEN_EXPIRES_IN=30s
```

**Frontend (`frontend/.env`):**
Copy `frontend/.env.example` to `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```
Default value:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Running the Applications

### Run Backend Separately
```bash
cd backend
npm run dev
```
The Express API starts at `http://localhost:5000`.  
Health check endpoint: `http://localhost:5000/api/health`

### Run Frontend Separately
```bash
cd frontend
npm run dev
```
The React development server starts at `http://localhost:5173`.

### Run from Root
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

---

## Available Scripts

### Root Scripts
- `npm run install:all`: Installs dependencies for root, backend, and frontend.
- `npm run dev:backend`: Starts the backend in development mode with nodemon.
- `npm run dev:frontend`: Starts the frontend in Vite dev mode.
- `npm run build:frontend`: Builds the production bundle of the React frontend.
- `npm run start:backend`: Runs the backend in production mode.
- `npm run lint`: Runs linting across both backend and frontend.
- `npm run test`: Runs backend test suite.

### Backend Scripts (`cd backend`)
- `npm run dev`: Starts Express server with hot-reload via `nodemon`.
- `npm start`: Runs `node src/server.js` directly.
- `npm test`: Runs test suite.
- `npm run lint`: Syntax and style check.

### Frontend Scripts (`cd frontend`)
- `npm run dev`: Starts Vite local development server.
- `npm run build`: Bundles the application for production to `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Checks for linting errors.

---

## Documentation Links

- [Architecture & Design Flow](file:///C:/Users/gk669/.gemini/antigravity-ide/scratch/college-attendance-system/docs/ARCHITECTURE.md)
- [REST API Specification](file:///C:/Users/gk669/.gemini/antigravity-ide/scratch/college-attendance-system/docs/API.md)
- [Database Schema & ER Models](file:///C:/Users/gk669/.gemini/antigravity-ide/scratch/college-attendance-system/docs/DATABASE_SCHEMA.md)
- [Setup & Troubleshooting Guide](file:///C:/Users/gk669/.gemini/antigravity-ide/scratch/college-attendance-system/docs/SETUP.md)
- [Privacy, Ethics & Biometric Consent](file:///C:/Users/gk669/.gemini/antigravity-ide/scratch/college-attendance-system/docs/PRIVACY_AND_CONSENT.md)
