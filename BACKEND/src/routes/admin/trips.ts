import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { sendSuccess, sendError } from '../../utils/response';

const router = Router();

// ── GET /api/admin/trips ──────────────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const page   = Math.max(1, parseInt(String(req.query.page   || '1')));
    const limit  = Math.min(50, parseInt(String(req.query.limit  || '20')));
    const skip   = (page - 1) * limit;
    const status = req.query.status  ? String(req.query.status)  : undefined;
    const date   = req.query.date    ? String(req.query.date)    : undefined;

    const where: any = {};
    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        where.departureDatetime = { gte: d, lt: next };
      }
    }

    const trips = await prisma.trip.findMany({
      where,
      skip,
      take: limit,
      orderBy: { departureDatetime: 'asc' },
      include: {
        bus:   true,
        route: true,
        _count: { select: { bookings: true } },
      },
    });

    const total = await prisma.trip.count({ where });

    // Attach real seat occupancy per trip
    const tripIds = trips.map((t) => t.id);
    const bookingSeats = await prisma.busBooking.findMany({
      where: { tripId: { in: tripIds }, status: { in: ['Confirmed', 'Pending'] } },
      select: { tripId: true, seatNumbers: true },
    });

    const occupancyMap: Record<string, number> = {};
    for (const b of bookingSeats) {
      occupancyMap[b.tripId] = (occupancyMap[b.tripId] || 0) + b.seatNumbers.length;
    }

    const result = trips.map((t) => ({
      ...t,
      bookedSeats: occupancyMap[t.id] || 0,
      seatsLeft:   Math.max(0, t.bus.totalSeats - (occupancyMap[t.id] || 0)),
    }));

    return sendSuccess(res, {
      trips: result,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[admin/trips GET]', err);
    return sendError(res, 'Failed to fetch trips.', 500);
  }
});

// ── POST /api/admin/trips ─────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { busId, routeId, departureDatetime, arrivalDatetime, baseFare, seatPricingConfig, seatStatuses } = req.body;

    if (!busId || !routeId || !departureDatetime || !arrivalDatetime || !baseFare) {
      return sendError(res, 'busId, routeId, departureDatetime, arrivalDatetime, and baseFare are required.', 400);
    }

    const dep = new Date(departureDatetime);
    const arr = new Date(arrivalDatetime);

    if (isNaN(dep.getTime()) || isNaN(arr.getTime())) {
      return sendError(res, 'Invalid datetime format.', 400);
    }
    if (arr <= dep) {
      return sendError(res, 'arrivalDatetime must be after departureDatetime.', 400);
    }
    if (isNaN(Number(baseFare)) || Number(baseFare) <= 0) {
      return sendError(res, 'baseFare must be a positive number.', 400);
    }

    const [bus, route] = await Promise.all([
      prisma.bus.findUnique({ where: { id: String(busId) } }),
      prisma.route.findUnique({ where: { id: String(routeId) } }),
    ]);
    if (!bus)   return sendError(res, 'Bus not found.', 404);
    if (!route) return sendError(res, 'Route not found.', 404);

    const trip = await prisma.trip.create({
      data: {
        busId:             String(busId),
        routeId:           String(routeId),
        departureDatetime: dep,
        arrivalDatetime:   arr,
        baseFare:          Number(baseFare),
        status:            'Scheduled',
        seatPricingConfig: seatPricingConfig || undefined,
        seatStatuses:      seatStatuses || undefined,
      },
      include: { bus: true, route: true },
    });

    return sendSuccess(res, trip, 'Trip created.', 201);
  } catch (err) {
    console.error('[admin/trips POST]', err);
    return sendError(res, 'Failed to create trip.', 500);
  }
});

// ── GET /api/admin/trips/:id ──────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        bus:      true,
        route:    true,
        bookings: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
      },
    });

    if (!trip) return sendError(res, 'Trip not found.', 404);
    return sendSuccess(res, trip);
  } catch (err) {
    console.error('[admin/trips/:id GET]', err);
    return sendError(res, 'Failed to fetch trip.', 500);
  }
});

// ── PATCH /api/admin/trips/:id ────────────────────────────────────
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { busId, routeId, departureDatetime, arrivalDatetime, baseFare, status, seatPricingConfig, seatStatuses } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return sendError(res, 'Trip not found.', 404);

    const validStatuses = ['Scheduled', 'On_Time', 'Delayed', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return sendError(res, `status must be one of: ${validStatuses.join(', ')}.`, 400);
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        ...(busId             && { busId: String(busId) }),
        ...(routeId           && { routeId: String(routeId) }),
        ...(departureDatetime && { departureDatetime: new Date(departureDatetime) }),
        ...(arrivalDatetime   && { arrivalDatetime:   new Date(arrivalDatetime) }),
        ...(baseFare          && { baseFare: Number(baseFare) }),
        ...(status            && { status }),
        ...(seatPricingConfig !== undefined && { seatPricingConfig }),
        ...(seatStatuses      !== undefined && { seatStatuses }),
      },
      include: { bus: true, route: true },
    });

    return sendSuccess(res, updated, 'Trip updated.');
  } catch (err) {
    console.error('[admin/trips/:id PATCH]', err);
    return sendError(res, 'Failed to update trip.', 500);
  }
});

// ── DELETE /api/admin/trips/:id ───────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!trip) return sendError(res, 'Trip not found.', 404);

    if (trip._count.bookings > 0) {
      return sendError(
        res,
        `Cannot delete trip with ${trip._count.bookings} existing booking(s). Cancel the trip instead.`,
        409
      );
    }

    await prisma.trip.delete({ where: { id } });
    return sendSuccess(res, null, 'Trip deleted.');
  } catch (err) {
    console.error('[admin/trips/:id DELETE]', err);
    return sendError(res, 'Failed to delete trip.', 500);
  }
});

// ── GET /api/admin/trips/:id/seats ───────────────────────────────
// Returns full seat map: bus capacity + which seats are booked
router.get('/:id/seats', async (req: Request, res: Response) => {
  try {
    const tripId = String(req.params.id);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { bus: true },
    });
    if (!trip) return sendError(res, 'Trip not found.', 404);

    const bookings = await prisma.busBooking.findMany({
      where: {
        tripId,
        status: { in: ['Confirmed', 'Pending'] },
      },
      select: { seatNumbers: true },
    });

    const bookedSeats = bookings.flatMap((b) => b.seatNumbers);

    return sendSuccess(res, {
      tripId,
      busPlate:          trip.bus.plateNumber,
      busType:           trip.bus.type,
      busStyle:          trip.bus.busStyle,
      totalSeats:        trip.bus.totalSeats,
      bookedSeats,
      seatsLeft:         Math.max(0, trip.bus.totalSeats - bookedSeats.length),
      seatPricingConfig: trip.seatPricingConfig,
      seatStatuses:      trip.seatStatuses,
    });
  } catch (err) {
    console.error('[admin/trips/:id/seats GET]', err);
    return sendError(res, 'Failed to fetch seat map.', 500);
  }
});

export default router;
