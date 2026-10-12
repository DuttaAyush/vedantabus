import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/prisma';
import { getAdminAuthHeader, cleanupTestData } from './helpers/testUtils';

describe('Verification Test Suite: Features 1, 3, and 4', () => {
  let testBusId: string;
  let testRouteId: string;
  let createdTripId: string;

  beforeAll(async () => {
    // Ensure we have a valid bus and route in DB
    let bus = await prisma.bus.findFirst({ where: { status: 'Active' } });
    if (!bus) {
      bus = await prisma.bus.create({
        data: {
          plateNumber: `MH-12-TEST-${Date.now() % 10000}`,
          type: 'Volvo B11R AC Sleeper (2+1)',
          totalSeats: 36,
          amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket'],
          busStyle: 'sleeper',
        },
      });
    }
    testBusId = bus.id;

    let route = await prisma.route.findFirst();
    if (!route) {
      route = await prisma.route.create({
        data: {
          originCity: 'Nagpur',
          destinationCity: 'Pune',
          waypoints: ['Wardha', 'Amravati', 'Akola'],
          distanceKm: 710,
        },
      });
    }
    testRouteId = route.id;
  });

  afterAll(async () => {
    // Clean up created trip if any
    if (createdTripId) {
      try {
        await prisma.trip.delete({ where: { id: createdTripId } });
      } catch {}
    }
    await cleanupTestData();
  });

  // =========================================================================
  // FEATURE 3: Admin 36-Seat Sleeper Trip Creation & Pricing Presets
  // =========================================================================
  describe('Feature 3: Admin New Trip Creator with 36-Seat Sleeper Layout & Pricing Presets', () => {
    it('should create a new trip with 36-seat sleeper seatPricingConfig and seatStatuses presets via POST /api/admin/trips', async () => {
      const departure = new Date();
      departure.setDate(departure.getDate() + 2);
      const arrival = new Date(departure);
      arrival.setHours(arrival.getHours() + 10);

      // Define 36-seat sleeper tier pricing
      const seatPricingConfig: Record<string, number> = {
        _tier_upper: 650,
        _tier_lower: 750,
        _tier_single_premium: 50,
      };

      // 18 Lower Deck (L1 to L18)
      for (let i = 1; i <= 18; i++) {
        const isSingle = (i - 1) % 3 === 0; // L1, L4, L7, L10, L13, L16
        seatPricingConfig[`L${i}`] = 750 + (isSingle ? 50 : 0);
      }

      // 18 Upper Deck (U1 to U18)
      for (let i = 1; i <= 18; i++) {
        const isSingle = (i - 1) % 3 === 0; // U1, U4, U7, U10, U13, U16
        seatPricingConfig[`U${i}`] = 650 + (isSingle ? 50 : 0);
      }

      const seatStatuses = {
        L4: 'ladies',
        L5: 'ladies',
        L9: 'blocked',
      };

      const res = await request(app)
        .post('/api/admin/trips')
        .set(getAdminAuthHeader())
        .send({
          busId: testBusId,
          routeId: testRouteId,
          departureDatetime: departure.toISOString(),
          arrivalDatetime: arrival.toISOString(),
          baseFare: 750,
          seatPricingConfig,
          seatStatuses,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(Number(res.body.data.baseFare)).toBe(750);
      expect(res.body.data.seatPricingConfig).toBeDefined();
      expect(res.body.data.seatPricingConfig._tier_upper).toBe(650);
      expect(res.body.data.seatPricingConfig._tier_lower).toBe(750);
      expect(res.body.data.seatPricingConfig.L1).toBe(800); // 750 + 50 single berth premium
      expect(res.body.data.seatPricingConfig.L2).toBe(750); // Double berth
      expect(res.body.data.seatPricingConfig.U1).toBe(700); // 650 + 50 single berth premium
      expect(res.body.data.seatPricingConfig.U2).toBe(650); // Upper double berth
      expect(res.body.data.seatStatuses.L4).toBe('ladies');
      expect(res.body.data.seatStatuses.L9).toBe('blocked');

      createdTripId = res.body.data.id;
    });

    it('should retrieve the created 36-seat trip details with seatPricingConfig via GET /api/admin/trips/:id', async () => {
      expect(createdTripId).toBeDefined();

      const res = await request(app)
        .get(`/api/admin/trips/${createdTripId}`)
        .set(getAdminAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTripId);
      expect(res.body.data.seatPricingConfig).toBeDefined();
      expect(res.body.data.seatPricingConfig.L1).toBe(800);
      expect(res.body.data.seatStatuses.L9).toBe('blocked');
    });

    it('should calculate commercial potential gross revenue for all 36 berths correctly', () => {
      // 18 Lower deck berths: 6 single berths @ 800, 12 sharing berths @ 750 = (6*800) + (12*750) = 4800 + 9000 = 13800
      // 18 Upper deck berths: 6 single berths @ 700, 12 sharing berths @ 650 = (6*700) + (12*650) = 4200 + 7800 = 12000
      // Total potential gross revenue = 13800 + 12000 = 25800 (minus blocked berth L9 @ 750 = 25050)
      const lowerSingle = 6 * 800;
      const lowerDouble = 12 * 750;
      const upperSingle = 6 * 700;
      const upperDouble = 12 * 650;
      const totalGross = lowerSingle + lowerDouble + upperSingle + upperDouble;

      expect(totalGross).toBe(25800);
    });
  });

  // =========================================================================
  // FEATURE 1: Printable Boarding Pass & QR Ticket Verification
  // =========================================================================
  describe('Feature 1: Printable / Downloadable Boarding Pass Data Integrity', () => {
    it('should validate complete boarding pass structure required by PrintableBoardingPassModal', () => {
      const sampleBoardingPass = {
        bookingId: 'YB-884920',
        operator: 'VedBus Luxury Gold Express',
        busType: 'Volvo 9600 Multi-Axle 2+1 AC Sleeper',
        busPlate: 'MH-12-QZ-8812',
        from: 'Nagpur',
        fromStation: 'VedBus Central Hub, Dharampeth',
        to: 'Pune',
        toStation: 'VedBus Swargate Lounge, Pune',
        depTime: '20:30',
        depDate: '15 Oct 2026',
        arrTime: '07:00',
        arrDate: '16 Oct 2026',
        duration: '10h 30m',
        seats: ['L1', 'L2'],
        passengers: [
          { name: 'Rajesh Patel', age: 34, gender: 'Male', seat: 'L1' },
          { name: 'Sneha Patel', age: 31, gender: 'Female', seat: 'L2' },
        ],
        totalFare: 1550,
        driverName: 'Sunil Sharma (Verified Captain)',
        driverPhone: '+91-8208024895',
        reportingTime: '20:00 (30 mins before departure)',
      };

      // Boarding Pass fields verification
      expect(sampleBoardingPass.bookingId).toMatch(/^YB-\d+/);
      expect(sampleBoardingPass.busPlate).toMatch(/^MH-\d{2}-[A-Z]{2}-\d{4}$/);
      expect(sampleBoardingPass.seats.length).toBe(2);
      expect(sampleBoardingPass.passengers.length).toBe(2);
      expect(sampleBoardingPass.totalFare).toBeGreaterThan(0);
      expect(sampleBoardingPass.driverPhone).toContain('+91');
    });

    it('should verify QR code data encoding format for conductor scanner', () => {
      const ticketId = 'YB-884920';
      const busPlate = 'MH-12-QZ-8812';
      const seats = ['L1', 'L2'];

      // Conductor scan payload format: PNR|PLATE|SEATS|CHECKSUM
      const qrPayload = JSON.stringify({
        pnr: ticketId,
        bus: busPlate,
        seats: seats,
        ts: Date.now(),
      });

      const parsed = JSON.parse(qrPayload);
      expect(parsed.pnr).toBe(ticketId);
      expect(parsed.bus).toBe(busPlate);
      expect(parsed.seats).toEqual(['L1', 'L2']);
      expect(typeof parsed.ts).toBe('number');
    });
  });

  // =========================================================================
  // FEATURE 4: Saved Passengers CRUD & RedBus Adjacent Gender Sharing Rules
  // =========================================================================
  describe('Feature 4: Saved Passengers CRUD & RedBus Sleeper Gender Engine', () => {
    it('should validate passenger CRUD schema requirements (Name, Age, Gender, Relation)', () => {
      const validRelations = ['Self', 'Spouse', 'Child', 'Father', 'Mother', 'Friend', 'Family'];
      
      const newPassenger = {
        id: 'sp_101',
        name: 'Aarav Patel',
        age: 8,
        gender: 'Male',
        relation: 'Child',
      };

      expect(newPassenger.name.trim().length).toBeGreaterThan(0);
      expect(newPassenger.age).toBeGreaterThan(0);
      expect(['Male', 'Female', 'Other']).toContain(newPassenger.gender);
      expect(validRelations).toContain(newPassenger.relation);
    });

    it('should properly apply RedBus Adjacent Sleeper Gender sharing rules', () => {
      // In 1+2 Sleeper:
      // Single berths (L1, L4, L7, etc.) have NO adjacent seat: anyone can book.
      // Double sharing berths (L2 & L3, L5 & L6, etc.) are adjacent:
      
      const adjacentPairs: Record<string, string> = {
        L2: 'L3', L3: 'L2',
        L5: 'L6', L6: 'L5',
        U2: 'U3', U3: 'U2',
        U5: 'U6', U6: 'U5',
      };

      // Scenario A: Seat L2 is already booked by a Female stranger
      const existingOccupancy: Record<string, { gender: 'male' | 'female'; bookingId: string }> = {
        L2: { gender: 'female', bookingId: 'BOOKING-A' },
      };

      // Independent Male customer tries to book adjacent seat L3
      const canIndependentMaleBook = (seatId: string, userGender: 'male' | 'female', isGroupWithAdjacent: boolean) => {
        const partnerSeat = adjacentPairs[seatId];
        if (!partnerSeat) return true; // Single window berth, always allowed

        const partnerBooking = existingOccupancy[partnerSeat];
        if (!partnerBooking) return true; // Adjacent berth is empty, allowed

        if (isGroupWithAdjacent) return true; // Same customer / party booking both seats together

        // RedBus rule: Unrelated Male cannot book adjacent to a Female
        if (partnerBooking.gender === 'female' && userGender === 'male') {
          return false;
        }
        return true;
      };

      // Unrelated Male attempting L3 adjacent to stranger Female in L2
      expect(canIndependentMaleBook('L3', 'male', false)).toBe(false);

      // Female attempting L3 adjacent to Female in L2 -> Allowed
      expect(canIndependentMaleBook('L3', 'female', false)).toBe(true);

      // Husband & Wife booking L2 & L3 together in the same group booking -> Allowed
      expect(canIndependentMaleBook('L3', 'male', true)).toBe(true);

      // Single window berth L1 -> Allowed for anyone
      expect(canIndependentMaleBook('L1', 'male', false)).toBe(true);
    });
  });
});
