import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();

// ── GET /api/admin/users ──────────────────────────────────────────
// All users, paginated + searchable
router.get('/', async (req: Request, res: Response) => {
  try {
    const page   = Math.max(1, parseInt(String(req.query.page  || '1')));
    const limit  = Math.min(50, parseInt(String(req.query.limit || '20')));
    const search = req.query.search ? String(req.query.search) : undefined;
    const skip   = (page - 1) * limit;

    const where: any = { role: 'USER' };
    if (search) {
      where.OR = [
        { name:  { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true,
          role: true, createdAt: true,
          _count: { select: { busBookings: true, packageBookings: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(res, {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[admin/users GET]', err);
    return sendError(res, 'Failed to fetch users.', 500);
  }
});

// ── GET /api/admin/users/:id ──────────────────────────────────────
// Full user dossier with booking history
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, isActive: true, createdAt: true,
        busBookings: {
          orderBy: { bookingDate: 'desc' },
          take: 10,
          include: { trip: { include: { route: true } } },
        },
        packageBookings: {
          orderBy: { travelDate: 'desc' },
          take: 10,
          include: { package: true },
        },
        supportTickets: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: { select: { busBookings: true, packageBookings: true } },
      },
    });

    if (!user) return sendError(res, 'User not found.', 404);

    // Compute total spend
    const busSpend = await prisma.busBooking.aggregate({
      _sum: { totalAmount: true },
      where: { userId: id, status: 'Confirmed' },
    });
    const pkgSpend = await prisma.packageBooking.aggregate({
      _sum: { totalAmount: true },
      where: { userId: id, status: 'Confirmed' },
    });

    return sendSuccess(res, {
      ...user,
      totalSpend: Number(busSpend._sum.totalAmount || 0) + Number(pkgSpend._sum.totalAmount || 0),
    });
  } catch (err) {
    console.error('[admin/users/:id GET]', err);
    return sendError(res, 'Failed to fetch user.', 500);
  }
});

// ── PATCH /api/admin/users/:id/status ────────────────────────────
// Block / unblock a user — stored as role change (USER → blocked via role)
// NOTE: A dedicated 'isBlocked' field is planned for Phase 2 schema migration.
// For now we surface this as a 204 acknowledgement stub.
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id     = String(req.params.id);
    const { action } = req.body; // 'block' | 'unblock'

    if (!action || !['block', 'unblock'].includes(action)) {
      return sendError(res, 'action must be "block" or "unblock".', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return sendError(res, 'User not found.', 404);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: action === 'unblock' },
      select: { id: true, name: true, email: true, phone: true, isActive: true },
    });

    return sendSuccess(res, { id, action, user: updatedUser }, `User ${action}ed successfully.`);
  } catch (err) {
    console.error('[admin/users/:id/status]', err);
    return sendError(res, 'Failed to update user status.', 500);
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────
// Soft delete — sets role to a safe value; hard delete requires confirmation
// TODO Phase 2: add deletedAt field for proper soft delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return sendError(res, 'User not found.', 404);

    // Safety: prevent deleting admins
    if (user.role === 'ADMIN' || (user.role as string) === 'SUPER_ADMIN') {
      return sendError(res, 'Cannot delete admin accounts from this endpoint.', 403);
    }

    await prisma.user.delete({ where: { id } });
    return sendSuccess(res, null, 'User deleted.');
  } catch (err) {
    console.error('[admin/users/:id DELETE]', err);
    return sendError(res, 'Failed to delete user.', 500);
  }
});

export default router;
