import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

export const DEFAULT_FLEET = [
  { id: "b1", plateNumber: "MH-31-AP-4921", type: "BharatBenz AC Sleeper (2+1)", totalSeats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true, water: true }, status: "Active", busStyle: "sleeper" },
  { id: "b2", plateNumber: "MH-12-QZ-8812", type: "Multi-Axle Volvo B11R AC Seater (2+2)", totalSeats: 42, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "Active", busStyle: "seater" },
  { id: "b3", plateNumber: "UK-07-PA-1008", type: "Scania Multi-Axle AC Sleeper (2+1)", totalSeats: 45, amenities: { wifi: true, charging: true, blanket: true, gps: true, sos: true }, status: "Active", busStyle: "sleeper" },
  { id: "b4", plateNumber: "MH-01-GA-7711", type: "Volvo B11R Multi-Axle AC Sleeper", totalSeats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true, sos: true, water: true }, status: "Active", busStyle: "sleeper" },
  { id: "b5", plateNumber: "KA-01-HY-5522", type: "BharatBenz Executive AC Seater (2+2)", totalSeats: 48, amenities: { wifi: false, charging: true, blanket: false, gps: true }, status: "Active", busStyle: "seater" },
  { id: "b6", plateNumber: "DL-01-AX-9933", type: "Volvo 9600 AC Seater Pushback (2+2)", totalSeats: 44, amenities: { wifi: true, charging: true, blanket: false, gps: true, sos: true }, status: "Active", busStyle: "seater" },
  { id: "b7", plateNumber: "RJ-14-VB-2024", type: "Scania Intercity Luxury Seater (2+2)", totalSeats: 46, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "Active", busStyle: "seater" },
  { id: "b8", plateNumber: "MH-14-BT-3399", type: "BharatBenz Gold Club AC Sleeper (2+1)", totalSeats: 38, amenities: { wifi: true, charging: true, blanket: true, gps: true, water: true }, status: "Active", busStyle: "sleeper" },
  { id: "b9", plateNumber: "MP-09-VB-6622", type: "Volvo 9600 Multi-Axle AC Sleeper", totalSeats: 42, amenities: { wifi: true, charging: true, blanket: true, gps: true, sos: true }, status: "Active", busStyle: "sleeper" },
  { id: "b10", plateNumber: "TS-09-VB-3311", type: "Scania Metrolink AC Sleeper (2+1)", totalSeats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", busStyle: "sleeper" },
  { id: "b11", plateNumber: "MH-17-SD-1008", type: "BharatBenz Divine Express Seater (2+2)", totalSeats: 45, amenities: { wifi: false, charging: true, blanket: false, gps: true, sos: true }, status: "Active", busStyle: "seater" },
  { id: "b12", plateNumber: "GA-03-Z-9901", type: "Volvo B11R Coastal Luxury Sleeper", totalSeats: 36, amenities: { wifi: true, charging: true, blanket: true, gps: true, water: true }, status: "Active", busStyle: "sleeper" },
];

interface RouteSpec {
  distanceKm: number;
  durationHours: number;
  durationLabel: string;
  waypoints: string[];
  trips: Array<{
    busPlate: string;
    depHour: number;
    depMin: number;
    fare: number;
    operator: string;
    badge: string;
    reviews: string;
    rating: string;
  }>;
}

const INDIAN_ROUTES_MATRIX: Record<string, RouteSpec> = {
  'mumbai-pune': {
    distanceKm: 150,
    durationHours: 3.5,
    durationLabel: '3h 30m',
    waypoints: ['Navi Mumbai', 'Lonavala Expressway', 'Wakad', 'Shivajinagar'],
    trips: [
      { busPlate: 'MH-12-QZ-8812', depHour: 6, depMin: 0, fare: 380, operator: 'VedantaBus High-Frequency Intercity', badge: 'Expressway Fast Track', reviews: '2,410', rating: '4.8' },
      { busPlate: 'DL-01-AX-9933', depHour: 11, depMin: 30, fare: 420, operator: 'VedantaBus Metro Express', badge: 'Zero Aggregator Surcharge', reviews: '1,890', rating: '4.9' },
      { busPlate: 'RJ-14-VB-2024', depHour: 16, depMin: 15, fare: 450, operator: 'VedantaBus Platinum Executive', badge: 'On-Time Guarantee', reviews: '1,560', rating: '4.8' },
      { busPlate: 'MH-01-GA-7711', depHour: 21, depMin: 45, fare: 590, operator: 'VedantaBus Luxury Night Rider', badge: 'Verified Assigned Plate', reviews: '2,120', rating: '4.9' },
    ],
  },
  'pune-mumbai': {
    distanceKm: 150,
    durationHours: 3.5,
    durationLabel: '3h 30m',
    waypoints: ['Shivajinagar', 'Wakad', 'Lonavala Expressway', 'Dadar'],
    trips: [
      { busPlate: 'MH-12-QZ-8812', depHour: 6, depMin: 30, fare: 380, operator: 'VedantaBus High-Frequency Intercity', badge: 'Expressway Fast Track', reviews: '2,190', rating: '4.8' },
      { busPlate: 'DL-01-AX-9933', depHour: 12, depMin: 0, fare: 420, operator: 'VedantaBus Metro Express', badge: 'Zero Aggregator Surcharge', reviews: '1,750', rating: '4.9' },
      { busPlate: 'RJ-14-VB-2024', depHour: 17, depMin: 0, fare: 450, operator: 'VedantaBus Platinum Executive', badge: 'On-Time Guarantee', reviews: '1,640', rating: '4.8' },
      { busPlate: 'MH-01-GA-7711', depHour: 22, depMin: 15, fare: 590, operator: 'VedantaBus Luxury Night Rider', badge: 'Verified Assigned Plate', reviews: '2,080', rating: '4.9' },
    ],
  },
  'nagpur-pune': {
    distanceKm: 710,
    durationHours: 10.5,
    durationLabel: '10h 30m',
    waypoints: ['Wardha', 'Amravati', 'Jalna', 'Samruddhi Mahamarg'],
    trips: [
      { busPlate: 'MH-31-AP-4921', depHour: 20, depMin: 30, fare: 850, operator: 'VedantaBus Luxury Gold Express', badge: 'Verified Assigned Plate', reviews: '1,420', rating: '4.9' },
      { busPlate: 'MH-14-BT-3399', depHour: 21, depMin: 15, fare: 1050, operator: 'VedantaBus Samruddhi Superfast', badge: 'Expressway Non-Stop', reviews: '1,890', rating: '4.9' },
      { busPlate: 'KA-01-HY-5522', depHour: 6, depMin: 0, fare: 650, operator: 'VedantaBus Dayliner Executive', badge: 'Satvik Dining Halts', reviews: '980', rating: '4.7' },
    ],
  },
  'pune-nagpur': {
    distanceKm: 710,
    durationHours: 10.5,
    durationLabel: '10h 30m',
    waypoints: ['Samruddhi Mahamarg', 'Jalna', 'Amravati', 'Wardha'],
    trips: [
      { busPlate: 'MH-31-AP-4921', depHour: 20, depMin: 0, fare: 850, operator: 'VedantaBus Luxury Gold Express', badge: 'Verified Assigned Plate', reviews: '1,380', rating: '4.9' },
      { busPlate: 'MH-14-BT-3399', depHour: 21, depMin: 0, fare: 1050, operator: 'VedantaBus Samruddhi Superfast', badge: 'Expressway Non-Stop', reviews: '1,760', rating: '4.9' },
      { busPlate: 'KA-01-HY-5522', depHour: 6, depMin: 30, fare: 650, operator: 'VedantaBus Dayliner Executive', badge: 'Satvik Dining Halts', reviews: '910', rating: '4.7' },
    ],
  },
  'delhi-haridwar': {
    distanceKm: 220,
    durationHours: 5.25,
    durationLabel: '5h 15m',
    waypoints: ['Meerut', 'Muzaffarnagar', 'Roorkee', 'Rishikesh Bypass'],
    trips: [
      { busPlate: 'UK-07-PA-1008', depHour: 6, depMin: 0, fare: 550, operator: 'VedantaBus Devsthan Express', badge: 'Satvik Line Special', reviews: '980', rating: '4.9' },
      { busPlate: 'DL-01-AX-9933', depHour: 14, depMin: 0, fare: 480, operator: 'VedantaBus Ganga Link', badge: 'Ganga Aarti Special', reviews: '1,120', rating: '4.8' },
      { busPlate: 'UK-07-PA-1008', depHour: 22, depMin: 30, fare: 650, operator: 'VedantaBus Devsthan Night Line', badge: 'Satvik Line Special', reviews: '1,450', rating: '4.9' },
    ],
  },
  'haridwar-delhi': {
    distanceKm: 220,
    durationHours: 5.25,
    durationLabel: '5h 15m',
    waypoints: ['Roorkee', 'Muzaffarnagar', 'Meerut Expressway', 'ISBT Anand Vihar'],
    trips: [
      { busPlate: 'UK-07-PA-1008', depHour: 6, depMin: 30, fare: 550, operator: 'VedantaBus Devsthan Express', badge: 'Satvik Line Special', reviews: '890', rating: '4.9' },
      { busPlate: 'DL-01-AX-9933', depHour: 14, depMin: 30, fare: 480, operator: 'VedantaBus Ganga Link', badge: 'Direct Return', reviews: '1,050', rating: '4.8' },
      { busPlate: 'UK-07-PA-1008', depHour: 22, depMin: 0, fare: 650, operator: 'VedantaBus Devsthan Night Line', badge: 'Satvik Line Special', reviews: '1,380', rating: '4.9' },
    ],
  },
  'mumbai-goa': {
    distanceKm: 590,
    durationHours: 12,
    durationLabel: '12h 00m',
    waypoints: ['Panvel', 'Chiplun', 'Kankavli', 'Mapusa', 'Panaji'],
    trips: [
      { busPlate: 'GA-03-Z-9901', depHour: 18, depMin: 0, fare: 1250, operator: 'VedantaBus Coastal Luxury Liner', badge: 'Verified Assigned Plate', reviews: '1,840', rating: '4.9' },
      { busPlate: 'MH-01-GA-7711', depHour: 20, depMin: 30, fare: 1450, operator: 'VedantaBus Goa Royal Club', badge: 'Panoramic Windows', reviews: '2,200', rating: '4.9' },
    ],
  },
  'goa-mumbai': {
    distanceKm: 590,
    durationHours: 12,
    durationLabel: '12h 00m',
    waypoints: ['Panaji', 'Mapusa', 'Kankavli', 'Chiplun', 'Panvel'],
    trips: [
      { busPlate: 'GA-03-Z-9901', depHour: 18, depMin: 30, fare: 1250, operator: 'VedantaBus Coastal Luxury Liner', badge: 'Verified Assigned Plate', reviews: '1,690', rating: '4.9' },
      { busPlate: 'MH-01-GA-7711', depHour: 20, depMin: 0, fare: 1450, operator: 'VedantaBus Goa Royal Club', badge: 'Panoramic Windows', reviews: '1,980', rating: '4.9' },
    ],
  },
  'delhi-pune': {
    distanceKm: 1420,
    durationHours: 25,
    durationLabel: '25h 00m',
    waypoints: ['Jaipur', 'Kishangarh', 'Ratlam', 'Dhule', 'Nashik', 'Pune'],
    trips: [
      { busPlate: 'MP-09-VB-6622', depHour: 9, depMin: 0, fare: 2450, operator: 'VedantaBus Bharat Crosslink', badge: 'Twin Driver Crew', reviews: '1,120', rating: '4.9' },
      { busPlate: 'TS-09-VB-3311', depHour: 17, depMin: 30, fare: 2690, operator: 'VedantaBus Royal Grand Continental', badge: 'Free Meals Included', reviews: '1,450', rating: '4.9' },
    ],
  },
  'pune-delhi': {
    distanceKm: 1420,
    durationHours: 25,
    durationLabel: '25h 00m',
    waypoints: ['Nashik', 'Dhule', 'Ratlam', 'Kishangarh', 'Jaipur', 'Delhi'],
    trips: [
      { busPlate: 'MP-09-VB-6622', depHour: 9, depMin: 30, fare: 2450, operator: 'VedantaBus Bharat Crosslink', badge: 'Twin Driver Crew', reviews: '1,080', rating: '4.9' },
      { busPlate: 'TS-09-VB-3311', depHour: 18, depMin: 0, fare: 2690, operator: 'VedantaBus Royal Grand Continental', badge: 'Free Meals Included', reviews: '1,390', rating: '4.9' },
    ],
  },
  'pune-shirdi': {
    distanceKm: 185,
    durationHours: 4.25,
    durationLabel: '4h 15m',
    waypoints: ['Chakan', 'Alephata', 'Sangamner', 'Shirdi Temple Gate'],
    trips: [
      { busPlate: 'MH-17-SD-1008', depHour: 6, depMin: 30, fare: 420, operator: 'VedantaBus Sai Darshan Express', badge: 'Temple Entry Assistance', reviews: '2,310', rating: '4.9' },
      { busPlate: 'MH-14-BT-3399', depHour: 14, depMin: 0, fare: 550, operator: 'VedantaBus Devsthan Shuttle', badge: 'Satvik Line Special', reviews: '1,450', rating: '4.8' },
    ],
  },
  'shirdi-pune': {
    distanceKm: 185,
    durationHours: 4.25,
    durationLabel: '4h 15m',
    waypoints: ['Sangamner', 'Alephata', 'Chakan', 'Pune Swargate'],
    trips: [
      { busPlate: 'MH-17-SD-1008', depHour: 11, depMin: 30, fare: 420, operator: 'VedantaBus Sai Darshan Express', badge: 'Direct Highway', reviews: '2,150', rating: '4.9' },
      { busPlate: 'MH-14-BT-3399', depHour: 19, depMin: 0, fare: 550, operator: 'VedantaBus Devsthan Shuttle', badge: 'Satvik Line Special', reviews: '1,380', rating: '4.8' },
    ],
  },
  'mumbai-shirdi': {
    distanceKm: 240,
    durationHours: 5,
    durationLabel: '5h 00m',
    waypoints: ['Thane', 'Igatpuri', 'Nashik Bypass', 'Sinnar', 'Shirdi'],
    trips: [
      { busPlate: 'MH-17-SD-1008', depHour: 5, depMin: 45, fare: 490, operator: 'VedantaBus Shirdi Darshan Superfast', badge: 'Temple Entry Assistance', reviews: '2,890', rating: '4.9' },
      { busPlate: 'MH-01-GA-7711', depHour: 22, depMin: 30, fare: 680, operator: 'VedantaBus Sai Ratri Line', badge: 'Satvik Line Special', reviews: '1,940', rating: '4.9' },
    ],
  },
  'shirdi-mumbai': {
    distanceKm: 240,
    durationHours: 5,
    durationLabel: '5h 00m',
    waypoints: ['Sinnar', 'Nashik Bypass', 'Igatpuri', 'Thane', 'Dadar'],
    trips: [
      { busPlate: 'MH-17-SD-1008', depHour: 12, depMin: 0, fare: 490, operator: 'VedantaBus Shirdi Darshan Superfast', badge: 'Direct Return', reviews: '2,640', rating: '4.9' },
      { busPlate: 'MH-01-GA-7711', depHour: 23, depMin: 0, fare: 680, operator: 'VedantaBus Sai Ratri Line', badge: 'Satvik Line Special', reviews: '1,820', rating: '4.9' },
    ],
  },
  'bengaluru-hyderabad': {
    distanceKm: 570,
    durationHours: 8.75,
    durationLabel: '8h 45m',
    waypoints: ['Chikkaballapur', 'Anantapur', 'Kurnool', 'Shamshabad'],
    trips: [
      { busPlate: 'KA-01-HY-5522', depHour: 21, depMin: 0, fare: 890, operator: 'VedantaBus Executive Tech Express', badge: 'On-Time Guarantee', reviews: '1,210', rating: '4.8' },
      { busPlate: 'TS-09-VB-3311', depHour: 22, depMin: 15, fare: 1190, operator: 'VedantaBus Deccan Gold Club', badge: 'High-Speed Highway', reviews: '1,680', rating: '4.9' },
    ],
  },
  'hyderabad-bengaluru': {
    distanceKm: 570,
    durationHours: 8.75,
    durationLabel: '8h 45m',
    waypoints: ['Shamshabad', 'Kurnool', 'Anantapur', 'Hebbal'],
    trips: [
      { busPlate: 'KA-01-HY-5522', depHour: 21, depMin: 30, fare: 890, operator: 'VedantaBus Executive Tech Express', badge: 'On-Time Guarantee', reviews: '1,150', rating: '4.8' },
      { busPlate: 'TS-09-VB-3311', depHour: 22, depMin: 45, fare: 1190, operator: 'VedantaBus Deccan Gold Club', badge: 'High-Speed Highway', reviews: '1,590', rating: '4.9' },
    ],
  },
  'indore-pune': {
    distanceKm: 590,
    durationHours: 11.5,
    durationLabel: '11h 30m',
    waypoints: ['Sendhwa', 'Dhule', 'Malegaon', 'Nashik', 'Chakan'],
    trips: [
      { busPlate: 'MP-09-VB-6622', depHour: 19, depMin: 30, fare: 950, operator: 'VedantaBus Malwa Super Express', badge: 'Verified Assigned Plate', reviews: '1,320', rating: '4.8' },
    ],
  },
  'pune-indore': {
    distanceKm: 590,
    durationHours: 11.5,
    durationLabel: '11h 30m',
    waypoints: ['Chakan', 'Nashik', 'Malegaon', 'Dhule', 'Sendhwa'],
    trips: [
      { busPlate: 'MP-09-VB-6622', depHour: 19, depMin: 30, fare: 950, operator: 'VedantaBus Malwa Super Express', badge: 'Verified Assigned Plate', reviews: '1,280', rating: '4.8' },
    ],
  },
  'delhi-jaipur': {
    distanceKm: 280,
    durationHours: 4.5,
    durationLabel: '4h 30m',
    waypoints: ['Gurugram', 'Manesar', 'Kotputli', 'Shahpura', 'Sindhi Camp'],
    trips: [
      { busPlate: 'RJ-14-VB-2024', depHour: 7, depMin: 0, fare: 450, operator: 'VedantaBus Pink City Express', badge: 'Expressway Fast Track', reviews: '1,780', rating: '4.8' },
      { busPlate: 'DL-01-AX-9933', depHour: 15, depMin: 30, fare: 480, operator: 'VedantaBus Royal Rajasthan Line', badge: 'Zero Aggregator Surcharge', reviews: '1,420', rating: '4.9' },
    ],
  },
  'jaipur-delhi': {
    distanceKm: 280,
    durationHours: 4.5,
    durationLabel: '4h 30m',
    waypoints: ['Shahpura', 'Kotputli', 'Manesar', 'Gurugram', 'Dhaula Kuan'],
    trips: [
      { busPlate: 'RJ-14-VB-2024', depHour: 7, depMin: 30, fare: 450, operator: 'VedantaBus Pink City Express', badge: 'Expressway Fast Track', reviews: '1,690', rating: '4.8' },
      { busPlate: 'DL-01-AX-9933', depHour: 16, depMin: 0, fare: 480, operator: 'VedantaBus Royal Rajasthan Line', badge: 'Zero Aggregator Surcharge', reviews: '1,380', rating: '4.9' },
    ],
  },
};

function getProceduralRoute(fromCity: string, toCity: string): RouteSpec {
  const normKey = `${fromCity.toLowerCase().trim()}-${toCity.toLowerCase().trim()}`;
  if (INDIAN_ROUTES_MATRIX[normKey]) {
    return INDIAN_ROUTES_MATRIX[normKey];
  }

  // Calculate distance procedurally based on string hash
  let hash = 0;
  for (let i = 0; i < normKey.length; i++) {
    hash = (hash << 5) - hash + normKey.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);
  const distanceKm = 180 + (posHash % 600); // Between 180 and 780 km
  const durationHours = Math.round((distanceKm / 52) * 10) / 10;
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);

  const seaterFare = Math.round((distanceKm * 2.2) / 50) * 50;
  const sleeperFare = Math.round((distanceKm * 2.9) / 50) * 50;

  return {
    distanceKm,
    durationHours,
    durationLabel: `${hours}h ${minutes}m`,
    waypoints: ['National Highway Corridor', 'Midway Satvik Plaza', 'Bypass Toll Plaza'],
    trips: [
      { busPlate: 'MH-12-QZ-8812', depHour: 7, depMin: 0, fare: seaterFare, operator: 'VedantaBus Intercity Express', badge: 'Zero Aggregator Surcharge', reviews: '1,120', rating: '4.8' },
      { busPlate: 'DL-01-AX-9933', depHour: 14, depMin: 30, fare: Math.round(seaterFare * 1.1), operator: 'VedantaBus Platinum Line', badge: 'On-Time Guarantee', reviews: '940', rating: '4.8' },
      { busPlate: 'MH-31-AP-4921', depHour: 21, depMin: 15, fare: sleeperFare, operator: 'VedantaBus Luxury Gold Express', badge: 'Verified Assigned Plate', reviews: '1,560', rating: '4.9' },
      { busPlate: 'MH-01-GA-7711', depHour: 22, depMin: 45, fare: Math.round(sleeperFare * 1.15), operator: 'VedantaBus Royal Club Sleeper', badge: 'Verified Assigned Plate', reviews: '1,820', rating: '4.9' },
    ],
  };
}

// ── GET /api/buses ────────────────────────────────────────────────
// Public — all active buses in the fleet
router.get('/', async (_req: Request, res: Response) => {
  try {
    let buses = [];
    try {
      buses = await prisma.bus.findMany({
        where: { status: 'Active' },
        orderBy: { plateNumber: 'asc' },
      });
    } catch {
      buses = DEFAULT_FLEET;
    }

    if (!buses || buses.length === 0) {
      buses = DEFAULT_FLEET;
    }

    return res.status(200).json(buses);
  } catch (err) {
    console.error('[buses GET]', err);
    return res.status(200).json(DEFAULT_FLEET);
  }
});

// ── GET /api/buses/gallery ─────────────────────────────────────────
// Public — aggregated photos and gallery items from active fleet
router.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const buses = await prisma.bus.findMany({
      where: { status: 'Active' },
      select: {
        id: true,
        plateNumber: true,
        type: true,
        busStyle: true,
        totalSeats: true,
        amenities: true,
        images: true,
      },
    });

    const galleryItems: any[] = [];
    buses.forEach((b) => {
      if (Array.isArray(b.images) && b.images.length > 0) {
        b.images.forEach((img: any, idx: number) => {
          const url = typeof img === 'string' ? img : img?.url;
          if (url) {
            galleryItems.push({
              id: `${b.id}-${idx}`,
              busId: b.id,
              busPlate: b.plateNumber,
              busType: b.type,
              title: (typeof img === 'object' && img.caption) ? img.caption : `${b.type} (${b.plateNumber})`,
              category: (typeof img === 'object' && img.category) ? img.category : (b.busStyle || 'sleeper'),
              categoryName: (typeof img === 'object' && img.categoryName) ? img.categoryName : 'Fleet Gallery',
              image: url,
              description: (typeof img === 'object' && img.description) ? img.description : `Official luxury coach of VedantaBus fleet. Registration ${b.plateNumber}.`,
              badge: (typeof img === 'object' && img.badge) ? img.badge : (b.busStyle === 'sleeper' ? '36-Berth Sleeper' : 'Executive Coach'),
              isPrimary: typeof img === 'object' ? !!img.isPrimary : idx === 0,
            });
          }
        });
      }
    });

    return res.status(200).json({
      success: true,
      totalFleetBuses: buses.length,
      count: galleryItems.length,
      items: galleryItems,
    });
  } catch (err) {
    console.error('[buses/gallery GET]', err);
    return res.status(200).json({ success: true, count: 0, items: [] });
  }
});

// ── GET /api/buses/search & /api/buses/routes ─────────────────────
// Public — search trips with filters
router.get(['/search', '/routes'], async (req: Request, res: Response) => {
  try {
    const { from, to, category, timeSlots } = req.query;

    if (!from || !to) {
      // If neither is provided, return default scheduled trips
      const allTrips = await prisma.trip.findMany({
        where: { status: { notIn: ['Cancelled', 'Completed'] } },
        include: { bus: true, route: true },
        take: 10,
      }).catch(() => []);
      
      if (allTrips.length > 0) {
        const formatted = allTrips.map(mapTripToOutput);
        return res.status(200).json(formatted);
      }
      return res.status(200).json([]);
    }

    const qFrom = String(from).trim();
    const qTo = String(to).trim();

    // 1. Check if matching routes with trips exist in Prisma
    let matchingRoutes = await prisma.route.findMany({
      where: {
        AND: [
          { originCity: { contains: qFrom, mode: 'insensitive' } },
          { destinationCity: { contains: qTo, mode: 'insensitive' } },
        ],
      },
      include: {
        trips: {
          where: { status: { notIn: ['Cancelled', 'Completed'] } },
          include: { bus: true, route: true },
        },
      },
    }).catch(() => []);

    let routeWithTrips = matchingRoutes.find(r => r.trips && r.trips.length > 0);

    // 2. If no matching route with trips found, auto-provision authentic route & trips
    if (!routeWithTrips || routeWithTrips.trips.length === 0) {
      try {
        const routeSpec = getProceduralRoute(qFrom, qTo);

        // Find or create route record
        let route = matchingRoutes[0];
        if (!route) {
          route = await prisma.route.create({
            data: {
              originCity: qFrom,
              destinationCity: qTo,
              waypoints: routeSpec.waypoints,
              distanceKm: routeSpec.distanceKm,
            },
            include: { trips: { include: { bus: true, route: true } } },
          });
        }

        // Get fleet of buses to assign
        const dbBuses = await prisma.bus.findMany({ where: { status: 'Active' } });
        const busMap = new Map<string, any>();
        for (const b of dbBuses) {
          busMap.set(b.plateNumber, b);
        }

        const now = new Date();
        const createdTrips = [];

        // Create trips for today & tomorrow
        for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
          const tripDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);

          for (let i = 0; i < routeSpec.trips.length; i++) {
            const tSpec = routeSpec.trips[i];
            const assignedBus = busMap.get(tSpec.busPlate) || dbBuses[i % dbBuses.length] || DEFAULT_FLEET[0];

            const depDatetime = new Date(tripDate);
            depDatetime.setHours(tSpec.depHour, tSpec.depMin, 0, 0);

            const arrDatetime = new Date(depDatetime.getTime() + Math.round(routeSpec.durationHours * 60 * 60 * 1000));

            const trip = await prisma.trip.create({
              data: {
                busId: assignedBus.id,
                routeId: route.id,
                departureDatetime: depDatetime,
                arrivalDatetime: arrDatetime,
                baseFare: tSpec.fare,
                status: 'Scheduled',
              },
              include: { bus: true, route: true },
            });
            createdTrips.push(trip);
          }
        }

        routeWithTrips = { ...route, trips: createdTrips };
      } catch (err) {
        console.error('[buses/search] Failed to auto-provision route trips:', err);
      }
    }

    let tripsToReturn: any[] = routeWithTrips?.trips || [];

    if (tripsToReturn.length === 0) {
      const fallbackSpec = getProceduralRoute(qFrom, qTo);
      const now = new Date();
      tripsToReturn = fallbackSpec.trips.map((tSpec, idx) => {
        const depDatetime = new Date(now);
        depDatetime.setHours(tSpec.depHour, tSpec.depMin, 0, 0);
        const arrDatetime = new Date(depDatetime.getTime() + Math.round(fallbackSpec.durationHours * 60 * 60 * 1000));
        return {
          id: `trip_proc_${idx + 1}`,
          departureDatetime: depDatetime,
          arrivalDatetime: arrDatetime,
          baseFare: tSpec.fare,
          status: 'Scheduled',
          bus: {
            id: `bus_proc_${idx + 1}`,
            plateNumber: tSpec.busPlate,
            type: tSpec.fare >= 700 ? 'BharatBenz AC Sleeper (2+1)' : 'Volvo Multi-Axle AC Seater',
            busStyle: tSpec.fare >= 700 ? 'sleeper' : 'seater',
            amenities: ['wifi', 'charging', 'water', 'blanket'],
          },
          route: {
            originCity: qFrom,
            destinationCity: qTo,
            waypoints: fallbackSpec.waypoints,
          },
        };
      });
    }

    let results = tripsToReturn.map(mapTripToOutput);

    // Filter by category
    if (category && category !== 'all') {
      results = results.filter(r => r.category === String(category));
    }

    // Filter by timeSlots
    if (timeSlots && typeof timeSlots === 'string' && timeSlots.length > 0) {
      const slots = timeSlots.split(',');
      results = results.filter(r => slots.includes(r.timeSlot));
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('[buses/search]', err);
    return res.status(200).json([]);
  }
});

function mapTripToOutput(t: any) {
  const durationMs = new Date(t.arrivalDatetime).getTime() - new Date(t.departureDatetime).getTime();
  const hours = Math.floor(durationMs / 3_600_000);
  const minutes = Math.floor((durationMs % 3_600_000) / 60_000);

  const depDate = new Date(t.departureDatetime);
  const arrDate = new Date(t.arrivalDatetime);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  const hour = depDate.getHours();
  let timeSlot = 'morning';
  if (hour >= 5 && hour < 12) timeSlot = 'morning';
  if (hour >= 12 && hour < 17) timeSlot = 'afternoon';
  if (hour >= 17 && hour < 21) timeSlot = 'evening';
  if (hour >= 21 || hour < 5) timeSlot = 'night';

  // Seeded deterministic seats left calculation
  const idHash = t.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const totalSeats = t.bus?.totalSeats || 40;
  const bookedSeed = (idHash % 14) + 6;
  const seatsLeft = Math.max(4, totalSeats - bookedSeed);

  const busStyle = t.bus?.busStyle || (t.bus?.type?.toLowerCase().includes('sleeper') ? 'sleeper' : 'seater');

  return {
    id: t.id,
    operator: busStyle === 'sleeper' ? 'Luxury Gold Express' : 'High-Frequency Intercity',
    rating: (4.7 + ((idHash % 3) * 0.1)).toFixed(1),
    reviews: (1200 + ((idHash % 15) * 85)).toLocaleString('en-IN'),
    busType: t.bus?.type || 'Volvo B11R AC Multi-Axle',
    busPlate: t.bus?.plateNumber || 'MH-12-QZ-8812',
    badge: busStyle === 'sleeper' ? 'Verified Assigned Plate' : 'Zero Aggregator Surcharge',
    category: busStyle,
    totalSeats,
    seatsLeft,
    price: Number(t.baseFare),
    status: t.status,
    rawDepDate: t.departureDatetime,
    depTime: formatTime(depDate),
    arrTime: formatTime(arrDate),
    depLocation: t.route?.originCity || 'Origin',
    arrLocation: t.route?.destinationCity || 'Destination',
    routeVia: t.route?.waypoints?.join(', ') || 'Direct Highway',
    duration: `${hours}h ${minutes > 0 ? `${minutes}m` : '00m'}`,
    timeSlot,
    amenities: t.bus?.amenities && typeof t.bus.amenities === 'object'
      ? Object.keys(t.bus.amenities).filter((k) => (t.bus.amenities as any)[k])
      : ['wifi', 'charging', 'gps'],
  };
}

export default router;
