import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/ApiError.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();

// Enable CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// API v1 Router
const apiV1Router = express.Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/students', studentRoutes);
apiV1Router.use('/teachers', teacherRoutes);
apiV1Router.use('/sessions', sessionRoutes);
apiV1Router.use('/attendance', attendanceRoutes);

// Mount API v1
app.use('/api/v1', apiV1Router);

// 404 Handler for Unhandled Routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
