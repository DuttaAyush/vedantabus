import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes     from './routes/auth';
import userRoutes     from './routes/users';
import busRoutes      from './routes/buses';
import bookingRoutes  from './routes/bookings';
import packageRoutes  from './routes/packages';
import homepageRoutes from './routes/homepage';
import supportRoutes  from './routes/support';
import offerRoutes    from './routes/offers';
import trackingRoutes from './routes/tracking';
import adminRoutes    from './routes/admin/index';
import { prisma }     from './prisma';

export const app = express();

// ── Security headers ──────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow known origins ──────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.ADMIN_URL || 'http://localhost:3001',
  'http://127.0.0.1:3001',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server) or localhost
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed.`));
      }
    },
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────
// Skip rate limiting for local development and test environments
const skipLocalhostOrTest = (req: Request): boolean => {
  if (process.env.NODE_ENV === 'test') return true;
  const ip = req.ip || req.socket?.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhostOrTest,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Stricter limiter for auth endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhostOrTest,
  message: { success: false, message: 'Too many auth attempts. Please try again in 15 minutes.' },
});

app.use(globalLimiter);

// ── Request utilities ─────────────────────────────────────────────
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check — used by Railway/Render/uptime monitors ─────────
app.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'unreachable';
  }

  const { getSeatLockEngineStatus } = await import('./utils/seatLock');

  res.status(200).json({
    status: 'ok',
    service: 'VedantaBus-api',
    database: dbStatus,
    seatLock: getSeatLockEngineStatus(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/buses',    busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/support',  supportRoutes);
app.use('/api/offers',   offerRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin',    adminRoutes);

// ── 404 ───────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode: number = err.statusCode || err.status || 500;
  console.error(`[error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
