import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma';
import { authenticateJWT, isSuperAdmin, AuthRequest } from '../../middleware/auth';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();

// In-memory fallback for dev/offline resilience
let devAdmins: any[] = [
  {
    id: 'dev-admin-uuid-001',
    name: 'Super Admin',
    email: 'admin@VedantaBus.in',
    phone: '+91 99999 88888',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date('2025-01-01').toISOString(),
    _count: { busBookings: 14, packageBookings: 6 },
  },
  {
    id: 'dev-admin-uuid-002',
    name: 'Operations Manager',
    email: 'ops@VedantaBus.in',
    phone: '+91 98765 00001',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date('2025-02-15').toISOString(),
    _count: { busBookings: 8, packageBookings: 3 },
  },
  {
    id: 'dev-admin-uuid-003',
    name: 'Support Supervisor',
    email: 'support.lead@VedantaBus.in',
    phone: '+91 98765 00002',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date('2025-03-01').toISOString(),
    _count: { busBookings: 4, packageBookings: 2 },
  },
];

// All routes here require a valid JWT + SUPER_ADMIN role
router.use(authenticateJWT, isSuperAdmin);

// ── GET /api/admin/admins ─────────────────────────────────────────
// List all ADMIN and SUPER_ADMIN users
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id:        true,
        name:      true,
        email:     true,
        phone:     true,
        role:      true,
        isActive:  true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if ((!admins || admins.length === 0) && process.env.NODE_ENV !== 'production') {
      return sendSuccess(res, devAdmins);
    }

    return sendSuccess(res, admins);
  } catch (err: any) {
    console.warn('[admin/admins GET] Database query failed, using dev fallback:', err.message);
    if (process.env.NODE_ENV !== 'production') {
      return sendSuccess(res, devAdmins);
    }
    return sendError(res, 'Failed to fetch admin list.', 500);
  }
});

// ── POST /api/admin/admins ────────────────────────────────────────
// Create a new ADMIN account
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password, role = 'ADMIN' } = req.body;

    if (!name || !email || !phone || !password) {
      return sendError(res, 'name, email, phone, and password are all required.', 400);
    }
    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters.', 400);
    }

    try {
      const existing = await prisma.admin.findFirst({
        where: { OR: [{ email }, { phone }] },
      });
      if (existing) {
        return sendError(res, 'An account with this email or phone already exists.', 409);
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const admin = await prisma.admin.create({
        data: { name, email, phone, passwordHash, role: (role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'), isActive: true },
        select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
      });

      return sendSuccess(res, admin, 'Admin account created successfully.', 201);
    } catch (dbErr: any) {
      if (process.env.NODE_ENV !== 'production') {
        const newAdmin = {
          id: `dev-admin-uuid-${Date.now()}`,
          name,
          email,
          phone,
          role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
          isActive: true,
          createdAt: new Date().toISOString(),
          _count: { busBookings: 0, packageBookings: 0 },
        };
        devAdmins.push(newAdmin);
        return sendSuccess(res, newAdmin, 'Admin account created successfully.', 201);
      }
      throw dbErr;
    }
  } catch (err: any) {
    console.error('[admin/admins POST]', err);
    return sendError(res, 'Failed to create admin.', 500);
  }
});

// ── PATCH /api/admin/admins/:id ───────────────────────────────────
// Edit name, email, phone, and/or reset password for an ADMIN
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, email, phone, password, role } = req.body;

    try {
      const target = await prisma.admin.findUnique({ where: { id } });
      if (target) {
        if (target.role === 'SUPER_ADMIN' && req.user?.id !== target.id) {
          return sendError(res, 'Super Admin accounts cannot be edited through this panel.', 403);
        }

        const updateData: any = {};
        if (name)     updateData.name  = name;
        if (email)    updateData.email = email;
        if (phone)    updateData.phone = phone;
        if (role)     updateData.role  = role;
        if (password) {
          if (password.length < 6) return sendError(res, 'Password must be at least 6 characters.', 400);
          updateData.passwordHash = await bcrypt.hash(password, 12);
        }

        const updated = await prisma.admin.update({
          where: { id },
          data: updateData,
          select: { id: true, name: true, email: true, phone: true, role: true, isActive: true },
        });

        return sendSuccess(res, updated, 'Admin updated successfully.');
      }
    } catch {}

    // Dev fallback
    if (process.env.NODE_ENV !== 'production') {
      const idx = devAdmins.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (name)  devAdmins[idx].name = name;
        if (email) devAdmins[idx].email = email;
        if (phone) devAdmins[idx].phone = phone;
        if (role)  devAdmins[idx].role = role;
        return sendSuccess(res, devAdmins[idx], 'Admin updated successfully.');
      }
    }

    return sendError(res, 'Admin not found.', 404);
  } catch (err) {
    console.error('[admin/admins PATCH]', err);
    return sendError(res, 'Failed to update admin.', 500);
  }
});

// ── PATCH /api/admin/admins/:id/toggle ───────────────────────────
// Toggle isActive (enable / disable the admin account)
router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    try {
      const target = await prisma.admin.findUnique({ where: { id } });
      if (target) {
        if (target.role === 'SUPER_ADMIN') {
          return sendError(res, 'Cannot disable a Super Admin account.', 403);
        }

        const updated = await prisma.admin.update({
          where: { id },
          data: { isActive: !target.isActive },
          select: { id: true, name: true, isActive: true },
        });

        const msg = updated.isActive ? 'Admin account enabled.' : 'Admin account disabled.';
        return sendSuccess(res, updated, msg);
      }
    } catch {}

    // Dev fallback
    if (process.env.NODE_ENV !== 'production') {
      const idx = devAdmins.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (devAdmins[idx].role === 'SUPER_ADMIN') {
          return sendError(res, 'Cannot disable a Super Admin account.', 403);
        }
        devAdmins[idx].isActive = !devAdmins[idx].isActive;
        const msg = devAdmins[idx].isActive ? 'Admin account enabled.' : 'Admin account disabled.';
        return sendSuccess(res, devAdmins[idx], msg);
      }
    }

    return sendError(res, 'Admin not found.', 404);
  } catch (err) {
    console.error('[admin/admins/:id/toggle]', err);
    return sendError(res, 'Failed to toggle admin status.', 500);
  }
});

// ── DELETE /api/admin/admins/:id ──────────────────────────────────
// Permanently delete an ADMIN account
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    try {
      const target = await prisma.admin.findUnique({ where: { id } });
      if (target) {
        if (target.role === 'SUPER_ADMIN') {
          return sendError(res, 'Super Admin accounts cannot be deleted.', 403);
        }

        await prisma.admin.delete({ where: { id } });
        return sendSuccess(res, { id }, 'Admin deleted successfully.');
      }
    } catch {}

    // Dev fallback
    if (process.env.NODE_ENV !== 'production') {
      const idx = devAdmins.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (devAdmins[idx].role === 'SUPER_ADMIN') {
          return sendError(res, 'Super Admin accounts cannot be deleted.', 403);
        }
        devAdmins.splice(idx, 1);
        return sendSuccess(res, { id }, 'Admin deleted successfully.');
      }
    }

    return sendError(res, 'Admin not found.', 404);
  } catch (err) {
    console.error('[admin/admins DELETE]', err);
    return sendError(res, 'Failed to delete admin.', 500);
  }
});

export default router;
