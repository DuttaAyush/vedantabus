import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const BUSES = [
  { plateNumber: "MH-31-AP-4921", type: "BharatBenz AC Sleeper (2+1)",     totalSeats: 40, amenities: { wifi: true,  charging: true,  blanket: true,  gps: true  }, status: "Active", lastServiced: new Date("2026-08-12"), busStyle: "sleeper" },
  { plateNumber: "MH-12-QZ-8812", type: "Multi-Axle Volvo B11R AC Seater (2+2)",    totalSeats: 42, amenities: { wifi: true,  charging: true,  blanket: true,  gps: true  }, status: "Active", lastServiced: new Date("2026-07-28"), busStyle: "seater"    },
  { plateNumber: "UK-07-PA-1008", type: "Scania Multi-Axle AC Sleeper (2+1)", totalSeats: 45, amenities: { wifi: true,  charging: true,  blanket: true, gps: true, sos: true }, status: "Active", lastServiced: new Date("2026-06-10"), busStyle: "sleeper" },
  { plateNumber: "MH-01-GA-7711", type: "Volvo B11R Multi-Axle AC Sleeper", totalSeats: 40, amenities: { wifi: true,  charging: true,  blanket: true,  gps: true, sos: true }, status: "Active", lastServiced: new Date("2026-09-01"), busStyle: "sleeper" },
  { plateNumber: "KA-01-HY-5522", type: "BharatBenz Executive AC Seater (2+2)", totalSeats: 48, amenities: { wifi: false, charging: true,  blanket: false, gps: true }, status: "Active", lastServiced: new Date("2026-08-18"), busStyle: "seater" },
];

const ROUTES = [
  {
    originCity: "Nagpur",
    destinationCity: "Pune",
    waypoints: ["Wardha", "Amravati", "Jalna", "Ahmednagar"],
    distanceKm: 720,
    trips: [
      { busIndex: 0, depHour: 20, depMin: 30, arrHour: 7, arrMin: 0, fare: 850 },
      { busIndex: 1, depHour: 6, depMin: 0, arrHour: 15, arrMin: 45, fare: 450 },
    ]
  },
  {
    originCity: "Pune",
    destinationCity: "Mumbai",
    waypoints: ["Lonavala", "Khandala", "Navi Mumbai", "Dadar"],
    distanceKm: 150,
    trips: [
      { busIndex: 1, depHour: 6, depMin: 0, arrHour: 9, arrMin: 45, fare: 450 },
      { busIndex: 0, depHour: 14, depMin: 0, arrHour: 17, arrMin: 45, fare: 480 },
    ]
  },
  {
    originCity: "Delhi",
    destinationCity: "Haridwar",
    waypoints: ["Meerut", "Muzaffarnagar", "Roorkee"],
    distanceKm: 220,
    trips: [
      { busIndex: 2, depHour: 6, depMin: 0, arrHour: 11, arrMin: 30, fare: 550 },
      { busIndex: 3, depHour: 22, depMin: 0, arrHour: 4, arrMin: 30, fare: 650 },
    ]
  },
  {
    originCity: "Mumbai",
    destinationCity: "Goa",
    waypoints: ["Pune", "Satara", "Kolhapur", "Belgaum", "Panaji"],
    distanceKm: 590,
    trips: [
      { busIndex: 3, depHour: 18, depMin: 0, arrHour: 7, arrMin: 0, fare: 1150 },
    ]
  },
  {
    originCity: "Bengaluru",
    destinationCity: "Hyderabad",
    waypoints: ["Anantapur", "Kurnool", "Mahbubnagar"],
    distanceKm: 570,
    trips: [
      { busIndex: 4, depHour: 21, depMin: 0, arrHour: 6, arrMin: 30, fare: 890 },
    ]
  },
];

const PACKAGES = [
  // ── Spiritual Packages ────────────────────────────────────────────────────────
  {
    title: 'Char Dham Yatra & Haridwar Special',
    category: 'Spiritual',
    pricePerPerson: 24499,
    durationDays: 10,
    itinerary: {
      id: 'chardham',
      subtitle: 'Kedarnath • Badrinath • Gangotri • Yamunotri',
      duration: '10 Days / 9 Nights',
      destinations: 'Kedarnath • Badrinath • Gangotri • Yamunotri',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
      badge: 'VIP Darshan Pass Included',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Complete Himalayan circuit with 2x2 BharatBenz AC Pushback transit, verified warm Himalayan stays, hot Satvik meals, and medical oxygen kit onboard.',
      transitInfo: 'BharatBenz AC Sleeper Coach ex-Delhi/Haridwar with experienced mountain drivers & tour manager.',
      stayInfo: 'Deluxe Temple View Hotels in Haridwar, Barkot, Uttarkashi, Guptkashi, Badrinath & Kedarnath Homestays.',
      meals: '100% Satvik Pure Veg Meals (No onion/garlic options available). Fresh hot prasadam served daily.',
      highlights: ['VIP Queue Pass for Kedarnath & Badrinath', 'Helicopter Coordination at Phata', 'Daily Ganga Aarti Assist', 'Satvik Pure Veg Dining'],
    }
  },
  {
    title: 'Ayodhya Shri Ram Mandir & Kashi Corridor',
    category: 'Spiritual',
    pricePerPerson: 6499,
    durationDays: 4,
    itinerary: {
      id: 'kashi-ayodhya',
      subtitle: 'Ayodhya • Varanasi • Prayagraj Sangam',
      duration: '4 Days / 3 Nights',
      destinations: 'Ayodhya • Varanasi • Prayagraj',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
      badge: 'Ram Lalla & Kashi Pass',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Sacred journey through the spiritual heartlands of Uttar Pradesh with temple corridors, holy Sangam snan, and private boat aarti.',
      transitInfo: 'Luxury Volvo AC Multi-Axle coach ex-Lucknow / Varanasi.',
      stayInfo: '3-Star AC Hotels close to Ram Janmabhoomi and Dashashwamedh Ghat.',
      meals: 'Pure Banarasi Satvik Thali & Prasadam.',
      highlights: ['Shri Ram Mandir VIP Line Entry', 'Kashi Vishwanath Sugam Darshan', 'Private Bajra Boat for Ganga Aarti', 'Prayagraj Triveni Sangam Snan'],
    }
  },
  {
    title: 'Tirupati Balaji & Meenakshi Amman',
    category: 'Spiritual',
    pricePerPerson: 8950,
    durationDays: 5,
    itinerary: {
      id: 'tirupati-south',
      subtitle: 'Tirupati • Madurai • Rameshwaram Jyotirlinga',
      duration: '5 Days / 4 Nights',
      destinations: 'Tirupati • Madurai • Rameshwaram',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_11.jpg',
      badge: 'Special Entry Darshan Confirmed',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Holy South India pilgrimage covering Lord Venkateswara at Tirupati, Lord Ramanathaswamy at Rameshwaram, and Goddess Meenakshi at Madurai.',
      transitInfo: 'Luxury Volvo AC Multi-Axle Coach ex-Bengaluru / Chennai.',
      stayInfo: 'Handpicked 3-Star Hotels near temple complexes.',
      meals: 'Authentic South Indian Pure Veg Meals served on banana leaf & 2 Tirupati Laddus per seat.',
      highlights: ['Pre-booked ₹300 Seeghra Darshan Pass', 'Guaranteed 2 Original Tirupati Srivari Laddus', 'Rameshwaram 22 Teertham Snan Guided', 'Madurai Meenakshi Night Chariot'],
    }
  },
  {
    title: 'Gujarat Somnath-Dwarka & Nageshwar',
    category: 'Spiritual',
    pricePerPerson: 5850,
    durationDays: 4,
    itinerary: {
      id: 'somnath-dwarka',
      subtitle: 'Dwarkadhish • Somnath • Nageshwar',
      duration: '4 Days / 3 Nights',
      destinations: 'Dwarkadhish • Somnath • Nageshwar',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_12.jpg',
      badge: 'Guided Purohit Escort',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Divine West Coast Yatra visiting Lord Krishna Dwarkadhish Temple, Somnath First Jyotirlinga on the Arabian Sea, and Nageshwar Jyotirlinga.',
      transitInfo: 'BharatBenz AC Coach ex-Ahmedabad / Rajkot.',
      stayInfo: 'Premium Hotels walking distance from sea coast & temples.',
      meals: 'Daily Kathiyawadi & Gujarati Pure Veg Thali.',
      highlights: ['Somnath Temple Sound & Light Show Tickets', 'Bet Dwarka Island Boat Ferry', 'Nageshwar Rudrabhishek Pooja Assist', 'Porbandar Kirti Mandir Stop'],
    }
  },

  // ── Domestic Packages ─────────────────────────────────────────────────────────
  {
    title: 'Himachal & Manali Mountain Escape',
    category: 'Domestic',
    pricePerPerson: 9499,
    durationDays: 5,
    itinerary: {
      id: 'himachal-manali',
      subtitle: 'Shimla • Kullu • Rohtang Pass • Solang',
      duration: '5 Days / 4 Nights',
      destinations: 'Shimla • Kullu • Manali • Solang Valley',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_13.jpg',
      badge: 'Scenic Hill Station',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Rejuvenating mountain retreat through the snow-capped Himalayas with Solang Valley snow sports pass, Atal Tunnel excursion, and luxury hill resort stays.',
      transitInfo: 'Direct Luxury Volvo AC Sleeper Coach ex-Delhi / Chandigarh.',
      stayInfo: '4-Star Mountain View Resort in Manali with private balcony & bonfire evening.',
      meals: 'Daily Buffet Breakfast & Chef-Special North Indian Dinner included.',
      highlights: ['Solang Valley Snow Sports & Cable Car Pass', 'Rohtang Pass Permit Assistance', 'Kullu River Rafting Tour', 'Hadimba Temple & Mall Road Tour'],
    }
  },
  {
    title: 'Kerala Backwaters & Munnar Hills',
    category: 'Domestic',
    pricePerPerson: 12850,
    durationDays: 6,
    itinerary: {
      id: 'kerala-backwaters',
      subtitle: 'Kochi • Munnar • Alleppey • Thekkady',
      duration: '6 Days / 5 Nights',
      destinations: 'Kochi • Munnar • Alleppey Houseboat',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_14.jpg',
      badge: 'Private AC Houseboat Included',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Lush tropical escape featuring rolling Munnar tea gardens, Periyar wildlife sanctuary, and a private AC backwater houseboat cruise in Alleppey.',
      transitInfo: 'AC Executive Traveler Coach throughout Kerala.',
      stayInfo: '3 Nights Tea Garden Resort + 1 Night Alleppey Houseboat + 1 Night Kochi Heritage Hotel.',
      meals: 'Traditional Kerala Sadya & Authentic Coastal Vegetarian Meals.',
      highlights: ['Private Houseboat Cruise with Personal Chef', 'Munnar Tea Plantation Safari', 'Kathakali & Kalaripayattu Cultural Show', 'Periyar Lake Boat Safari'],
    }
  },
  {
    title: 'Goa Beachfront Villa & Catamaran Cruise',
    category: 'Domestic',
    pricePerPerson: 7999,
    durationDays: 4,
    itinerary: {
      id: 'goa-coastal',
      subtitle: 'North Goa • Candolim • Panaji • South Goa',
      duration: '4 Days / 3 Nights',
      destinations: 'Candolim • Baga • Old Goa • Panaji',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_15.jpg',
      badge: 'Sunset Catamaran Included',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Sun-drenched getaway with private sunset catamaran cruise on Mandovi River, Portuguese Latin Quarter walks, and beachside heritage villa stay.',
      transitInfo: 'Direct BharatBenz AC Sleeper Coach ex-Mumbai / Pune / Bengaluru.',
      stayInfo: '4-Star Beachside Heritage Villa near Candolim.',
      meals: 'Daily Buffet Breakfast with Continental & Indian spreads.',
      highlights: ['Private Sunset Catamaran Cruise with Music', 'Fontainhas Heritage Walk', 'Scuba & Water Sports Combo Pass', 'Old Goa Basilica & Spice Plantation Tour'],
    }
  },
  {
    title: 'Jim Corbett & Nainital Lake Paradise',
    category: 'Domestic',
    pricePerPerson: 6999,
    durationDays: 4,
    itinerary: {
      id: 'corbett-nainital',
      subtitle: 'Corbett Tiger Reserve • Naini Lake • Bhimtal',
      duration: '4 Days / 3 Nights',
      destinations: 'Jim Corbett • Nainital • Bhimtal',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_16.jpg',
      badge: '4x4 Open Jeep Safari Included',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Thrilling jungle safari in India\'s oldest national park combined with tranquil boating on the emerald waters of Naini Lake.',
      transitInfo: 'AC Deluxe Coach ex-Delhi NCR.',
      stayInfo: 'Riverside Jungle Resort in Corbett + Lakeview Hotel in Nainital.',
      meals: 'All Buffet Meals (Breakfast, Lunch & Dinner) at Jungle Resort.',
      highlights: ['Open 4x4 Jeep Tiger Safari Pass', 'Naini Lake Private Gondola Boat Ride', 'Naina Devi Temple Darshan', 'Corbett Waterfall Nature Trail'],
    }
  },

  // ── International Packages ────────────────────────────────────────────────────
  {
    title: 'Dubai Desert Safari & Marina Skyline',
    category: 'International',
    pricePerPerson: 48999,
    durationDays: 5,
    itinerary: {
      id: 'dubai-combo',
      subtitle: 'Dubai • Abu Dhabi • Desert Safari',
      duration: '5 Days / 4 Nights',
      destinations: 'Dubai • Abu Dhabi • Desert Safari',
      image: '/images/yatra_international_holiday_travel_packages_1.jpg',
      badge: '4-Star Marina Hotel & Visa Included',
      badgeColor: 'bg-teal-600 text-white',
      description: 'Bask in luxury with Burj Khalifa 124th floor entry, 4x4 Dune Bashing, BBQ Desert Camp with Tanoura Show, and Dhow Cruise Marina Dinner.',
      transitInfo: 'Private AC Airport & Excursion Transfers in Dubai.',
      stayInfo: '4-Star Marina View Hotel in Dubai.',
      meals: 'Daily Buffet Breakfast + Desert BBQ Dinner + Dhow Cruise Buffet.',
      highlights: ['Burj Khalifa 124th Floor Entry', 'Dhow Dinner Cruise', '4x4 Desert Safari with Dune Bashing', 'Instant Express eVisa Included'],
    }
  },
  {
    title: 'Dubai Luxury Dunes & Atlantis Aquaventure',
    category: 'International',
    pricePerPerson: 54999,
    durationDays: 6,
    itinerary: {
      id: 'dubai-dunes',
      subtitle: 'The Palm • Atlantis • Marina • Miracle Garden',
      duration: '6 Days / 5 Nights',
      destinations: 'The Palm • Atlantis • Downtown Dubai',
      image: '/images/yatra_international_holiday_travel_packages_2.jpg',
      badge: 'Atlantis Waterpark Pass Included',
      badgeColor: 'bg-teal-600 text-white',
      description: 'The ultimate Dubai luxury experience with Atlantis Aquaventure waterpark tickets, Palm Jumeirah monorail, and Dubai Mall fountain show.',
      transitInfo: 'Private Airport Transfers & Luxury AC Coach Tours.',
      stayInfo: '5-Star Hotel on Sheikh Zayed Road / Downtown.',
      meals: 'Daily 5-Star International Buffet Breakfast.',
      highlights: ['Atlantis Aquaventure & Lost Chambers Pass', 'Museum of the Future Tickets', 'Miracle Garden & Global Village Tour', 'Dhow Cruise Marina Dinner'],
    }
  },
  {
    title: 'Singapore Wonders & Sentosa Island',
    category: 'International',
    pricePerPerson: 62500,
    durationDays: 5,
    itinerary: {
      id: 'singapore-malaysia',
      subtitle: 'Marina Bay • Sentosa • Universal Studios',
      duration: '5 Days / 4 Nights',
      destinations: 'Marina Bay • Sentosa • Chinatown',
      image: '/images/yatra_international_holiday_travel_packages_3.jpg',
      badge: 'Universal Studios Pass Included',
      badgeColor: 'bg-teal-600 text-white',
      description: 'Futuristic city tour with Gardens by the Bay, Cloud Forest dome, Sentosa Island cable car, and full-day Universal Studios Singapore pass.',
      transitInfo: 'Private Airport Transfers & Singapore MRT Tourist Pass.',
      stayInfo: '4-Star Central Hotel near Clarke Quay.',
      meals: 'Daily Continental Buffet Breakfast.',
      highlights: ['Universal Studios Full-Day Pass', 'Gardens by the Bay Flower Dome & Cloud Forest', 'Sentosa Cable Car & Wings of Time Show', 'Marina Bay Sands SkyPark Observation Deck'],
    }
  },
  {
    title: 'Thailand Bangkok & Pattaya Beach Resort',
    category: 'International',
    pricePerPerson: 36999,
    durationDays: 5,
    itinerary: {
      id: 'thailand-holiday',
      subtitle: 'Bangkok • Coral Island • Pattaya',
      duration: '5 Days / 4 Nights',
      destinations: 'Bangkok • Pattaya • Coral Island',
      image: '/images/yatra_international_holiday_travel_packages_4.jpg',
      badge: 'Speedboat Coral Island Tour',
      badgeColor: 'bg-teal-600 text-white',
      description: 'Tropical getaway featuring Pattaya beach resorts, Coral Island speedboat tour with parasailing, and Bangkok golden temple excursions.',
      transitInfo: 'Private AC Airport & Intercity Transfers.',
      stayInfo: '4-Star Beach Resort in Pattaya + 4-Star Bangkok City Center Hotel.',
      meals: 'Daily Buffet Breakfast + Indian Lunch on Coral Island.',
      highlights: ['Coral Island Speedboat Tour with Water Activities', 'Alcazar Cabaret Show VIP Seat', 'Bangkok Reclining Buddha & Golden Temple Tour', 'Chao Phraya River Dinner Cruise'],
    }
  },
];

const OFFERS = [
  { code: 'YATRA2026',  discountPercentage: 15, maxDiscountAmount: 300,  validUntil: new Date('2026-12-31') },
  { code: 'YATRA10',    discountPercentage: 10, maxDiscountAmount: 200,  validUntil: new Date('2026-12-31') },
  { code: 'PILGRIM15',  discountPercentage: 15, maxDiscountAmount: 1500, validUntil: new Date('2026-12-31') },
  { code: 'FLYGLOBAL',  discountPercentage: 20, maxDiscountAmount: 5000, validUntil: new Date('2026-12-31') },
];

async function main() {
  console.log('[seed] Cleaning old records...');
  await prisma.supportTicket.deleteMany({});
  await prisma.busBooking.deleteMany({});
  await prisma.packageBooking.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.bus.deleteMany({});
  await prisma.tourPackage.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('[seed] Creating Users (Super Admin, Sub Admin & Customer)...');
  const passwordHash = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@VedantaBus.in',
      phone: '+918208024895',
      passwordHash,
      role: 'SUPER_ADMIN',
    }
  });

  const superAdminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'superadmin@VedantaBus.in',
      phone: '+919999988888',
      passwordHash,
      role: 'SUPER_ADMIN',
    }
  });

  const opsAdminUser = await prisma.user.create({
    data: {
      name: 'Operations Manager',
      email: 'ops@VedantaBus.in',
      phone: '+919876500001',
      passwordHash,
      role: 'ADMIN',
    }
  });

  const customerHash = await bcrypt.hash('customer123', 12);
  const demoCustomer = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'customer@VedantaBus.in',
      phone: '+919811122233',
      passwordHash: customerHash,
      role: 'USER',
    }
  });

  console.log('[seed] Seeding Buses...');
  const createdBuses = [];
  for (const bus of BUSES) {
    const b = await prisma.bus.create({
      data: {
        plateNumber:  bus.plateNumber,
        type:         bus.type,
        totalSeats:   bus.totalSeats,
        amenities:    bus.amenities,
        status:       bus.status as any,
        lastServiced: bus.lastServiced,
        busStyle:     bus.busStyle,
      }
    });
    createdBuses.push(b);
  }

  console.log('[seed] Seeding Routes & Trips...');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalTripsCount = 0;
  for (const r of ROUTES) {
    const createdRoute = await prisma.route.create({
      data: {
        originCity:      r.originCity,
        destinationCity: r.destinationCity,
        waypoints:       r.waypoints,
        distanceKm:      r.distanceKm,
      }
    });

    // Create trips for today and tomorrow
    for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + dayOffset);

      for (const t of r.trips) {
        const depDate = new Date(targetDate);
        depDate.setHours(t.depHour, t.depMin, 0, 0);

        const arrDate = new Date(targetDate);
        if (t.arrHour < t.depHour) arrDate.setDate(arrDate.getDate() + 1);
        arrDate.setHours(t.arrHour, t.arrMin, 0, 0);

        const trip = await prisma.trip.create({
          data: {
            busId:             createdBuses[t.busIndex].id,
            routeId:           createdRoute.id,
            departureDatetime: depDate,
            arrivalDatetime:   arrDate,
            baseFare:          t.fare,
            status:            'Scheduled',
          }
        });
        totalTripsCount++;

        // Add 2 sample bookings so seat availability is realistic
        if (dayOffset === 0 && t.busIndex === 0) {
          await prisma.busBooking.create({
            data: {
              id: `BK${Date.now()}_1`,
              userId: demoCustomer.id,
              tripId: trip.id,
              seatNumbers: ['L1', 'L2'],
              totalAmount: t.fare * 2,
              status: 'Confirmed',
            }
          });
        }
      }
    }
  }

  console.log('[seed] Seeding Packages...');
  for (const pkg of PACKAGES) {
    await prisma.tourPackage.create({
      data: {
        title:          pkg.title,
        category:       pkg.category as any,
        pricePerPerson: pkg.pricePerPerson,
        durationDays:   pkg.durationDays,
        itinerary:      pkg.itinerary,
        isActive:       true,
      }
    });
  }

  console.log('[seed] Seeding Offers...');
  for (const offer of OFFERS) {
    await prisma.offer.create({
      data: {
        code:               offer.code,
        discountPercentage: offer.discountPercentage,
        maxDiscountAmount:  offer.maxDiscountAmount,
        validUntil:         offer.validUntil,
        isActive:           true,
      }
    });
  }

  console.log(`[seed] DONE! Seeded 2 Users, ${createdBuses.length} Buses, ${ROUTES.length} Routes, ${totalTripsCount} Trips, ${PACKAGES.length} Packages, and ${OFFERS.length} Offers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
