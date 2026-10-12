import 'dotenv/config';
import { app } from './app';

const PORT = process.env.PORT || 5000;

// ── Start Server ──────────────────────────────────────────────────
export const server = app.listen(PORT, () => {
  console.log(
    `[VedantaBus-api] Server running → http://localhost:${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`
  );
});

// ── Graceful shutdown (required for Railway/Render/Docker) ────────
let isShuttingDown = false;
const shutdown = (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`[VedantaBus-api] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('[VedantaBus-api] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

export default server;
