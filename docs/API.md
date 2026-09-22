# REST API Specification

The College Attendance System backend exposes a versioned REST API mounted at `/api/v1`.

---

## Base URL
```text
http://localhost:5000/api/v1
```

---

## Response Format

All responses follow a consistent JSON envelope:

### Success Response
```json
{
  "success": true,
  "message": "Optional human-readable confirmation",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Description of the validation or operational error",
  "errors": ["Specific validation error string 1"]
}
```

---

## System Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Auth**: Public
- **Response**:
```json
{
  "status": "ok",
  "uptime": 124.5,
  "timestamp": "2026-09-22T17:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints (`/api/v1/auth`)

### 1. Register User
- **Endpoint**: `POST /api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Dr. Alan Turing",
  "email": "alan.turing@college.edu",
  "password": "SecurePassword123",
  "role": "teacher" // "student" | "teacher" | "admin"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f123456789abcdef123456",
      "name": "Dr. Alan Turing",
      "email": "alan.turing@college.edu",
      "role": "teacher"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "alan.turing@college.edu",
  "password": "SecurePassword123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f123456789abcdef123456",
      "name": "Dr. Alan Turing",
      "email": "alan.turing@college.edu",
      "role": "teacher"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Current User Context
- **Endpoint**: `GET /api/v1/auth/me`
- **Auth**: Bearer Token
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f123456789abcdef123456",
      "name": "Dr. Alan Turing",
      "email": "alan.turing@college.edu",
      "role": "teacher"
    }
  }
}
```

---

## Student Endpoints (`/api/v1/students`)

### 1. Get Student Profile
- **Endpoint**: `GET /api/v1/students/profile`
- **Auth**: Bearer Token (Role: `student`)

### 2. Update Student Profile
- **Endpoint**: `PUT /api/v1/students/profile`
- **Auth**: Bearer Token (Role: `student`)
- **Request Body**:
```json
{
  "rollNumber": "CS2023001",
  "department": "Computer Science & Engineering",
  "semester": 6
}
```

### 3. Enroll Face Biometric Descriptor
- **Endpoint**: `POST /api/v1/students/face-enroll`
- **Auth**: Bearer Token (Role: `student`)
- **Request Body**:
```json
{
  "faceDescriptor": [-0.124, 0.056, ..., 0.812], // 128-float array
  "consentGiven": true
}
```

---

## Session & QR Endpoints (`/api/v1/sessions`)

### 1. Create Attendance Session
- **Endpoint**: `POST /api/v1/sessions`
- **Auth**: Bearer Token (Role: `teacher`, `admin`)
- **Request Body**:
```json
{
  "subjectId": "65f123456789abcdef123456",
  "startTime": "2026-09-22T09:00:00.000Z",
  "endTime": "2026-09-22T10:00:00.000Z",
  "geofence": {
    "enabled": false
  }
}
```

### 2. Get Rotating QR Token for Live Display
- **Endpoint**: `GET /api/v1/sessions/:id/qr`
- **Auth**: Bearer Token (Role: `teacher`, `admin`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "sessionId": "65f123456789abcdef123456",
    "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshIntervalSeconds": 30
  }
}
```

---

## Attendance Endpoints (`/api/v1/attendance`)

### 1. Mark Attendance
- **Endpoint**: `POST /api/v1/attendance/mark`
- **Auth**: Bearer Token (Role: `student`)
- **Request Body**:
```json
{
  "sessionId": "65f123456789abcdef123456",
  "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "verificationMethod": "qr_only" // "face_verified" | "qr_only"
}
```

### 2. Get Student Attendance History
- **Endpoint**: `GET /api/v1/attendance/my-history`
- **Auth**: Bearer Token (Role: `student`)

### 3. Export Attendance CSV
- **Endpoint**: `GET /api/v1/attendance/session/:sessionId/export`
- **Auth**: Bearer Token (Role: `teacher`, `admin`)
- **Response**: `text/csv` attachment.
