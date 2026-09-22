# Database Schema & Mongoose Models

The application uses MongoDB via Mongoose ODM.

---

## Entity Relationship Overview

```mermaid
erDiagram
    USER ||--o| STUDENT : "has profile"
    USER ||--o{ SUBJECT : "teaches"
    USER ||--o{ ATTENDANCE_SESSION : "conducts"
    SUBJECT ||--o{ ATTENDANCE_SESSION : "has sessions"
    ATTENDANCE_SESSION ||--o{ ATTENDANCE : "records"
    STUDENT ||--o{ ATTENDANCE : "attends"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        boolean isActive
        Date createdAt
    }

    STUDENT {
        ObjectId _id PK
        ObjectId user FK
        string rollNumber UK
        string department
        number semester
        Array faceDescriptor
        boolean isFaceEnrolled
        boolean consentGiven
        Date consentDate
    }

    SUBJECT {
        ObjectId _id PK
        string name
        string code UK
        string department
        number semester
        ObjectId teacher FK
    }

    ATTENDANCE_SESSION {
        ObjectId _id PK
        ObjectId subject FK
        ObjectId teacher FK
        Date sessionDate
        Date startTime
        Date endTime
        string status
        string qrSecret
        number tokenRefreshIntervalSec
    }

    ATTENDANCE {
        ObjectId _id PK
        ObjectId session FK
        ObjectId student FK
        ObjectId subject FK
        string status
        string verificationMethod
        number confidenceScore
        Date recordedAt
    }
```

---

## Collections Specification

### 1. `users`
- Stores primary authentication credentials and RBAC roles (`student`, `teacher`, `admin`).
- **Indexes**: `{ email: 1 }` (unique).

### 2. `students`
- Extends the `User` model with academic details and 128-dimensional biometric facial descriptors.
- **Indexes**: `{ user: 1 }` (unique), `{ rollNumber: 1 }` (unique).
- **Security**: `faceDescriptor` is marked `{ select: false }` so that it is never returned in standard queries.

### 3. `subjects`
- Stores course metadata, syllabus department, and the assigned faculty member.
- **Indexes**: `{ code: 1 }` (unique), `{ teacher: 1 }`.

### 4. `attendancesessions`
- Represents a discrete class lecture or lab.
- Contains the cryptographic `qrSecret` used as a rotating HMAC seed for dynamic QR generation.

### 5. `attendances`
- An individual verified attendance instance.
- **Indexes**: Composite unique index `{ session: 1, student: 1 }` preventing double-marking.
