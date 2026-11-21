import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// ── GET /api/tracking/:tripId ─────────────────────────────────────
// Public — returns trip status + simulated progress (real GPS deferred)
router.get('/:tripId', async (req: Request, res: Response) => {
  try {
    const paramId = String(req.params.tripId);

    let trip = await prisma.trip.findUnique({
      where: { id: paramId },
      include: { bus: true, route: true },
    }).catch(() => null);

    // If paramId is a booking ID (e.g. YB-123456), look up the trip via BusBooking
    if (!trip) {
      const booking = await prisma.busBooking.findUnique({
        where: { id: paramId },
        include: {
          trip: { include: { bus: true, route: true } },
        },
      }).catch(() => null);

      if (booking?.trip) {
        trip = booking.trip;
      }
    }

    // Dev fallback if not found
    if (!trip) {
      trip = await prisma.trip.findFirst({
        where: { status: { notIn: ['Cancelled'] } },
        include: { bus: true, route: true },
      }).catch(() => null);
    }

    if (!trip) return sendError(res, 'Trip not found.', 404);

    const now       = Date.now();
    const startTime = new Date(trip.departureDatetime).getTime();
    const endTime   = new Date(trip.arrivalDatetime).getTime();

    let progress = 0;
    if (now > startTime && now < endTime) {
      progress = (now - startTime) / (endTime - startTime);
    } else if (now >= endTime) {
      progress = 1;
    }

    // NOTE: GPS coordinates are simulated until client provides GPS provider.
    const tracking = {
      tripId:             trip.id,
      ticketId:           paramId,
      busPlate:           trip.bus.plateNumber,
      busType:            trip.bus.type,
      status:             trip.status,
      origin:             trip.route.originCity,
      destination:        trip.route.destinationCity,
      progressPercentage: Math.round(progress * 100),
      departureDatetime:  trip.departureDatetime,
      arrivalDatetime:    trip.arrivalDatetime,
      lastUpdated:        new Date().toISOString(),
      gps: {
        simulated: true,
        note: 'Live GPS pending integration with client GPS provider.',
      },
    };

    return sendSuccess(res, tracking);
  } catch (err) {
    console.error('[tracking/:tripId]', err);
    return sendError(res, 'Failed to fetch tracking data.', 500);
  }
});

export default router;
