import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

const REFRESH_COOKIE = 'yatra_refresh';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ── POST /api/auth/register ───────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return sendError(res, 'name, email, phone, and password are required.', 400);
    }

    if (password.length < 8) {
      return sendError(res, 'Password must be at least 8 characters.', 400);
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existing) {
      return sendError(res, 'An account with this email or phone already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const accessToken  = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);

    return sendSuccess(res, { accessToken, user }, 'Account created successfully.', 201);
  } catch (err) {
    console.error('[auth/register]', err);
    return sendError(res, 'Failed to register. Please try again.', 500);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = (email || phone || '').trim();

    if (!identifier) {
      return sendError(res, 'Email or phone number is required.', 400);
    }

    let user: any = null;
    try {
      // 1. Check dedicated Admin table first
      const adminRecord = await prisma.admin.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier },
            { phone: `+91 ${identifier}` },
            { phone: `+91${identifier}` },
          ],
        },
      });

      if (adminRecord) {
        user = adminRecord;
      } else {
        // 2. Check customer User table
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
              { phone: `+91 ${identifier}` },
              { phone: `+91${identifier}` },
            ],
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('[auth/login] Database check warning:', dbErr.message);
      // Dev-only fallback mock users — NEVER in production
      if (process.env.NODE_ENV !== 'production') {
        const isSuperAdminEmail =
          identifier === 'admin@VedantaBus.com' ||
          identifier === 'admin@VedantaBus.in' ||
          identifier === 'superadmin@VedantaBus.com' ||
          identifier === 'superadmin@VedantaBus.in' ||
          identifier === 'admin@vedbus.com' ||
          identifier === 'admin@vedbus.in' ||
          identifier === 'superadmin@vedbus.com' ||
          identifier === 'superadmin@vedbus.in';

        if (
          isSuperAdminEmail &&
          (password === 'Password@123' || password === 'admin123' || password === 'admin' || password === 'superadmin' || password === 'Admin@123')
        ) {
          user = {
            id: 'dev-admin-uuid-001',
            name: 'Super Admin',
            email: identifier,
            phone: '+91 99999 88888',
            role: 'SUPER_ADMIN',
            passwordHash: 'dev_mock_hash',
            isActive: true,
          };
        } else if (
          identifier === 'rahul.sharma@example.com' &&
          (password === 'Password@123' || password === 'user123')
        ) {
          user = {
            id: 'dev-user-uuid-001',
            name: 'Rahul Sharma',
            email: identifier,
            phone: '+91-8208024895',
            role: 'USER',
            passwordHash: 'dev_mock_hash',
            isActive: true,
          };
        }
      } else {
        // Production: DB failure is a hard stop
        return sendError(res, 'Service temporarily unavailable. Please try again later.', 500);
      }
    }

    // Dev fallback if DB returned null (e.g. user not yet seeded in database)
    if (!user && process.env.NODE_ENV !== 'production') {
      const isSuperAdminEmail =
        identifier === 'admin@VedantaBus.com' ||
        identifier === 'admin@VedantaBus.in' ||
        identifier === 'superadmin@VedantaBus.com' ||
        identifier === 'superadmin@VedantaBus.in' ||
        identifier === 'admin@vedbus.com' ||
        identifier === 'admin@vedbus.in' ||
        identifier === 'superadmin@vedbus.com' ||
        identifier === 'superadmin@vedbus.in';

      if (
        isSuperAdminEmail &&
        (password === 'Password@123' || password === 'admin123' || password === 'admin' || password === 'superadmin' || password === 'Admin@123')
      ) {
        user = {
          id: 'dev-admin-uuid-001',
          name: 'Super Admin',
          email: identifier,
          phone: '+91 99999 88888',
          role: 'SUPER_ADMIN',
          passwordHash: 'dev_mock_hash',
          isActive: true,
        };
      }
    }

    // Phone login requires an existing account — do NOT auto-create
    if (!user && phone) {
      return sendError(res, 'No account found with this phone number. Please sign up first.', 401);
    }

    if (!user) {
      return sendError(res, 'Invalid credentials. User not found.', 401);
    }

    // Verify password if provided and not an OTP / demo bypass
    if (password && user.passwordHash !== 'dev_mock_hash') {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      // Allow 6-digit OTP codes in non-production (no real SMS integration yet)
      const isDevOtpBypass = process.env.NODE_ENV !== 'production' && /^\d{6}$/.test(password);
      const isAdminDevBypass = process.env.NODE_ENV !== 'production' &&
        (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') &&
        (password === 'admin' || password === 'admin123' || password === 'Admin@123' || password === 'Password@123' || password === 'superadmin');

      if (!isMatch && !isDevOtpBypass && !isAdminDevBypass) {
        return sendError(res, 'Invalid password or verification code.', 401);
      }
    }

    // Block disabled accounts (toggled off by super admin)
    if (user.isActive === false) {
      return sendError(res, 'Your account has been disabled. Please contact the administrator.', 403);
    }

    const accessToken  = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.cookie('yatra_access', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(
      res,
      {
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      },
      'Login successful.'
    );
  } catch (err) {
    console.error('[auth/login]', err);
    return sendError(res, 'Failed to login. Please try again.', 500);
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('yatra_access', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.clearCookie('yatra_refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.clearCookie('vedbus_access', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.clearCookie('vedbus_refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  return sendSuccess(res, null, 'Logged out successfully.');
});

// ── POST /api/auth/refresh ────────────────────────────────────────
router.post('/refresh', (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE] || req.cookies?.vedbus_refresh;

  if (!token) {
    return sendError(res, 'Refresh token missing. Please login again.', 401);
  }

  try {
    const payload     = verifyRefreshToken(token);
    const accessToken = generateAccessToken(payload.id, payload.role);
    res.cookie('yatra_access', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, { accessToken }, 'Token refreshed.');
  } catch {
    res.clearCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: 'strict' });
    return sendError(res, 'Invalid or expired refresh token. Please login again.', 403);
  }
});

// ── POST /api/auth/forgot-password ───────────────────────────────
// Stub — will be wired to email service when client provides SMTP config
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return sendError(res, 'email is required.', 400);

  // Always return the same response — do not reveal if email exists
  await prisma.user.findUnique({ where: { email } }); // keeps timing consistent
  return sendSuccess(
    res,
    null,
    'If an account with that email exists, a reset link has been sent.'
  );
});

export default router;
