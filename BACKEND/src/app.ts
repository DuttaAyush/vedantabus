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

// ── CORS — dynamic & flexible origin handling ─────────────────────
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()) : []),
].filter(Boolean) as string[];

const isAllowedOrigin = (origin: string | undefined): boolean => {
  // Allow requests without Origin (e.g. server-to-server, curl, Postman, mobile native apps)
  if (!origin) return true;

  // Always allow localhost & 127.0.0.1 on any port
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;

  // Explicitly configured origins (from env vars)
  if (configuredOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed))) return true;

  // Allow production domain and any subdomains (e.g. vedbus.com, admin.vedbus.com, api.vedbus.com)
  const vedbusPattern = /^https?:\/\/([a-z0-9-]+\.)*vedbus\.com(:[0-9]+)?$/i;
  if (vedbusPattern.test(origin)) return true;

  // Allow vedantabus domain and any subdomains (e.g. admin.vedantabus.co.in, api.vedantabus.co.in)
  const domainPattern = /^https?:\/\/([a-z0-9-]+\.)*vedantabus\.(com|co\.in)(:[0-9]+)?$/i;
  if (domainPattern.test(origin)) return true;

  // In development mode, allow intranet / local network IPs and dev hosts automatically
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
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
