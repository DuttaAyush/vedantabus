import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();



// ── GET /api/packages ─────────────────────────────────────────────
// Public — filterable by category
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let packages: any[] = [];

    try {
      const where: any = { isActive: true };
      if (category) {
        const cat = String(category).charAt(0).toUpperCase() + String(category).slice(1).toLowerCase();
        where.category = cat;
      }
      packages = await prisma.tourPackage.findMany({
        where,
        orderBy: { pricePerPerson: 'asc' },
      });
    } catch {
      packages = [];
    }

    const formatted = packages.map((p) => {
      const it: any = typeof p.itinerary === 'object' && p.itinerary ? p.itinerary : {};
      return {
        id: p.id,
        title: p.title,
        category: p.category,
        durationDays: p.durationDays,
        pricePerPerson: Number(p.pricePerPerson),
        price: `₹${Number(p.pricePerPerson).toLocaleString('en-IN')}`,
        isActive: p.isActive,
        ...it,
      };
    });

    return res.status(200).json(formatted);
  } catch (err) {
    console.error('[packages GET]', err);
    return sendError(res, 'Failed to fetch packages.', 500);
  }
});

// ── GET /api/packages/:id ─────────────────────────────────────────
// Public — single package detail (supports UUID or slug)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    let pkg: any = null;
    try {
      pkg = await prisma.tourPackage.findFirst({
        where: {
          OR: [
            { id },
            // Check if slug id is stored inside itinerary JSONB
            { itinerary: { path: ['id'], equals: id } },
            { title: { contains: id, mode: 'insensitive' } }
          ]
        }
      });
    } catch {
      // Fallback
    }

    if (!pkg) return sendError(res, 'Package not found.', 404);

    const it: any = typeof pkg.itinerary === 'object' && pkg.itinerary ? pkg.itinerary : {};
    const result = {
      id: pkg.id,
      title: pkg.title,
      category: pkg.category,
      durationDays: pkg.durationDays,
      pricePerPerson: Number(pkg.pricePerPerson),
      price: pkg.price || `₹${Number(pkg.pricePerPerson).toLocaleString('en-IN')}`,
      isActive: pkg.isActive ?? true,
      ...it,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('[packages/:id GET]', err);
    return sendError(res, 'Failed to fetch package.', 500);
  }
});

// ── POST /api/packages/book ───────────────────────────────────────
// Book a holiday package
router.post('/book', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { packageId, travelersCount, travelDate, totalAmount } = req.body;
    const userId = req.user!.id;

    if (!packageId || !travelersCount) {
      return sendError(res, 'packageId and travelersCount are required.', 400);
    }

    const bookingId = `PB-${Math.floor(100000 + Math.random() * 900000)}`;
    const parsedDate = travelDate ? new Date(travelDate) : new Date();

    let booking: any = null;
    try {
      // Resolve valid package foreign key
      let validPackage = await prisma.tourPackage.findFirst({
        where: {
          OR: [
            { id: packageId },
            { title: { contains: packageId, mode: 'insensitive' } },
          ],
        },
      });

      if (!validPackage) {
        validPackage = await prisma.tourPackage.findFirst();
      }

      const validPackageId = validPackage ? validPackage.id : packageId;

      // Resolve valid user foreign key
      let validUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!validUser) {
        validUser = await prisma.user.findFirst();
      }
      const validUserId = validUser ? validUser.id : userId;

      const serverAmount = validPackage ? Number(validPackage.pricePerPerson) * (Number(travelersCount) || 1) : Number(totalAmount) || 74999;

      booking = await prisma.packageBooking.create({
        data: {
          id: bookingId,
          userId: validUserId,
          packageId: validPackageId,
          travelersCount: Number(travelersCount) || 1,
          travelDate: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
          totalAmount: serverAmount,
          status: 'Confirmed',
        },
      });
    } catch (err: any) {
      console.error('[packages/book] DB insert failed:', err.message);
      return sendError(res, 'Failed to create booking. Please try again.', 500);
    }


    return res.status(201).json({
      success: true,
      booking,
      data: { booking }
    });
  } catch (err) {
    console.error('[packages/book POST]', err);
    return sendError(res, 'Failed to book package.', 500);
  }
});

export default router;
