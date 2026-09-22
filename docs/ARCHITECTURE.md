# System Architecture & Technical Flow

The College Attendance System operates on a decoupled client-server architecture designed for high security, zero proxy attendance, and strict biometric privacy.

---

## High-Level System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React + Vite SPA                     │
│  (Teacher Dashboard / Projector, Student Mobile Web)   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│                  Express.js Gateway                    │
│   ├── CORS, JSON Parsing, Rate Limiting                │
│   ├── JWT Authentication & RBAC Guards                 │
│   └── Centralized Error Middleware                     │
└────────────┬─────────────────────────────┬─────────────┘
             │                             │
             ▼                             ▼
   ┌───────────────────┐         ┌───────────────────────┐
   │ Business Services │         │     MongoDB Atlas     │
   │  - Dynamic QR HMAC│         │  - Normalized Models  │
   │  - Face Embeddings│         │  - Composite Indexes  │
   │  - CSV Generator  │         │  - Protected Fields   │
   └───────────────────┘         └───────────────────────┘
```

---

## 1. Dynamic Rotating QR Security Flow

Traditional static QR codes are vulnerable to photo sharing and remote proxy scanning. This architecture prevents proxy attendance via short-lived rotating JWT tokens:

1. **Session Creation**: Faculty member launches an attendance session. The backend generates a cryptographically random `qrSecret`.
2. **Display Token Polling**: The faculty projector client requests a fresh QR token every 30 seconds (`/api/v1/sessions/:id/qr`).
3. **Token Construction**: Token is signed using an HMAC composed of `JWT_SECRET + qrSecret`, packed with a short TTL (30s) and random nonces.
4. **Student Scan**: The student scans the live projected QR with their device camera.
5. **Validation**: The backend verifies signature and expiration. If the token is older than 30s, the scan is rejected with `400 Bad Request`.

---

## 2. Facial Biometric Verification Flow

To eliminate buddy-punching, student attendance can be paired with biometric validation:

1. **Client-Side Extraction**: Using client-side computer vision (e.g. face-api.js or MediaPipe), 68 facial landmarks are converted into a 128-float Euclidean descriptor vector.
2. **Raw Photos Discarded**: No facial photographs or video frames are transmitted to the server.
3. **Enrollment**: During profile registration, the student signs consent and uploads their reference embedding vector.
4. **Verification**: During classroom scan, client extracts the current embedding, sends both QR token and current embedding vector. The backend computes Euclidean distance:
   $$\text{distance} = \sqrt{\sum_{i=1}^{128} (v_1[i] - v_2[i])^2}$$
   If distance $< 0.55$, presence is confirmed.
