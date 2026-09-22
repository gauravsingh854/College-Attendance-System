# Setup & Deployment Guide

This guide walks through configuring and executing both Backend and Frontend applications locally.

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher (v24.x tested and supported)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or free MongoDB Atlas cluster

---

## 2. Environment Variables

### Backend Configuration
Create `backend/.env` from the provided example template:

```bash
# In the backend directory
copy .env.example .env
```

Review and adjust variables:
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express server |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `MONGODB_URI` | `mongodb://localhost:27017/college_attendance` | MongoDB connection string |
| `JWT_SECRET` | `supersecretjwtkey_replace_in_production` | Signing secret for authentication tokens |
| `JWT_EXPIRES_IN` | `7d` | Lifetime of user auth tokens |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |
| `QR_TOKEN_EXPIRES_IN` | `30s` | Rotation interval for attendance QR codes |

### Frontend Configuration
Create `frontend/.env` from the provided example template:

```bash
# In the frontend directory
copy .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:5000/api/v1` | URL pointing to backend API v1 router |

---

## 3. Dependency Installation

From the monorepo root:
```bash
npm run install:all
```

Or individually:
```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## 4. Running the Dev Servers

### Backend
```bash
cd backend
npm run dev
```
Verify the server is running by opening:
[http://localhost:5000/api/health](http://localhost:5000/api/health)

### Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Troubleshooting Common Issues

1. **MongoDB Connection Failed**:
   - Ensure MongoDB is running locally (`mongod` or MongoDB service).
   - If using Atlas, ensure your IP address is whitelisted in Network Access.
2. **CORS Blocked**:
   - Verify `CLIENT_URL` in `backend/.env` exactly matches the URL where the frontend is running (including protocol and port `http://localhost:5173`).
3. **Port In Use**:
   - If port 5000 is occupied, update `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env`.
