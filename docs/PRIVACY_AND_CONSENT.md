# Biometric Privacy, Ethics & Informed Consent Policy

This document defines the strict biometric data privacy guarantees implemented across the College Attendance System.

---

## 1. Core Ethical Principles

Biometric data constitutes sensitive personal identifiable information (SPII). Our architecture adheres to three non-negotiable principles:

1. **Explicit Informed Consent**: No biometric facial data is captured or processed without affirmative, documented student opt-in.
2. **Zero Raw Image Storage**: The system never stores, logs, or transmits raw photographs or video streams of student faces to central servers.
3. **One-Way Irreversible Vector Encoding**: Only 128-dimensional floating-point embeddings (spatial landmark distance vectors) are retained.

---

## 2. Technical Safeguards

- **Client-Side Feature Extraction**: Facial detection and embedding generation are executed directly inside the user's browser sandbox using WebAssembly or WebGL.
- **Immediate Frame Purge**: The browser memory canvas holding the camera frame is purged immediately following landmark extraction.
- **Database Obfuscation**: The `faceDescriptor` array field in MongoDB is excluded by default (`select: false`) from standard queries to guard against data leaks during bulk exports or logs.
- **Access Control**: Biometric vector comparisons take place server-side exclusively in ephemeral memory during the attendance handshake.

---

## 3. Student Rights & Data Life Cycle

- **Right to Opt-Out**: Students who do not consent to biometric facial verification are entitled to alternative verification methods (e.g. Dynamic QR code + Teacher manual roster check).
- **Right to Revocation**: A student may revoke consent at any time via their profile portal, which permanently zeroes the `faceDescriptor` vector in the database.
- **Data Retention Limit**: All biometric vector representations are slated for automatic deletion upon graduation or institutional withdrawal.
