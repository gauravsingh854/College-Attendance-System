import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  const server = app.listen(env.PORT, () => {
    console.log(`[Server] Backend listening on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[Server] Health check available at http://localhost:${env.PORT}/api/health`);
  });

  // Connect to Database
  connectDB().catch((err) => {
    console.error(`[Database Error] Initial connection failed: ${err.message}`);
  });

  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] Closed remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((error) => {
  console.error('[Server Error] Fatal startup error:', error);
  process.exit(1);
});
