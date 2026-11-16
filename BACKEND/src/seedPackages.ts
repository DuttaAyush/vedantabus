import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PACKAGES = [
  // ── Spiritual Pilgrimage Yatras ─────────────────────────────────────────────
  {
    title: 'Char Dham Yatra & Haridwar Special',
    category: 'Spiritual',
    pricePerPerson: 24499,
    durationDays: 10,
    itinerary: {
      id: 'chardham',
      subtitle: 'Kedarnath • Badrinath • Gangotri • Yamunotri • Haridwar',
      duration: '10 Days / 9 Nights',
      destinations: 'Kedarnath • Badrinath • Gangotri • Yamunotri • Haridwar',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
      badge: 'VIP Darshan & Helicopter Assist',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Complete Himalayan circuit with 2x2 BharatBenz AC Pushback transit, verified warm Himalayan stays, hot Satvik meals, and medical oxygen kit onboard.',
      transitInfo: 'BharatBenz AC Sleeper Coach ex-Delhi/Haridwar with experienced mountain drivers & tour manager.',
      stayInfo: 'Deluxe Temple View Hotels in Haridwar, Barkot, Uttarkashi, Guptkashi, Badrinath & Kedarnath Homestays.',
      meals: '100% Satvik Pure Veg Meals (No onion/garlic options available). Fresh hot prasadam served daily.',
      highlights: ['VIP Queue Pass for Kedarnath & Badrinath', 'Helicopter Coordination at Phata', 'Daily Ganga Aarti Assist', 'Satvik Pure Veg Dining'],
      addons: [
        { id: 'heli', label: 'Kedarnath Helicopter Ticket ex-Phata', price: 3500, selected: false },
        { id: 'vip-pass', label: 'VIP Priority Queue Pass for Badrinath', price: 999, selected: true },
        { id: 'ganga-aarti', label: 'Har Ki Pauri Reserved Ganga Aarti Seat', price: 499, selected: true },
        { id: 'oxygen', label: 'Portable Medical Oxygen Cylinder Onboard', price: 650, selected: false },
      ]
    }
  },
  {
    title: 'Ayodhya Ram Mandir & Kashi Corridor',
    category: 'Spiritual',
    pricePerPerson: 6499,
    durationDays: 4,
    itinerary: {
      id: 'kashi-ayodhya',
      subtitle: 'Ayodhya • Varanasi • Prayagraj Sangam',
      duration: '4 Days / 3 Nights',
      destinations: 'Ayodhya • Varanasi • Prayagraj',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
      badge: 'Ram Lalla & Kashi Corridor Pass',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Sacred journey through the spiritual heartlands of Uttar Pradesh with temple corridors, holy Sangam snan, and private boat aarti.',
      transitInfo: 'Direct Luxury Volvo AC Sleeper Coach with multi-city departures (Nagpur, Pune, Delhi).',
      stayInfo: '3-Star Deluxe AC Hotels situated within 1 km of Ram Janmabhoomi & Kashi Vishwanath Corridor.',
      meals: 'Daily Satvik Breakfast & Banarasi Pure Veg Dinner featuring authentic local Malaiyyo & Kachori thali.',
      highlights: ['Confirmed Ram Janmabhoomi Mandir Darshan Pass', 'Kashi Vishwanath Sugam Darshan', 'Private Bajra Boat for Ganga Aarti', 'Prayagraj Triveni Sangam Snan'],
      addons: [
        { id: 'private-boat', label: 'Private Handcrafted Bajra Boat for Evening Aarti', price: 1200, selected: true },
        { id: 'sugam-darshan', label: 'Kashi Vishwanath Sugam Darshan Fast Pass', price: 600, selected: true },
        { id: 'ayodhya-guide', label: 'Dedicated Vedic Historian Guide in Ayodhya', price: 800, selected: false },
      ]
    }
  },
  {
    title: 'Tirupati Balaji & Meenakshi Amman',
    category: 'Spiritual',
    pricePerPerson: 8950,
    durationDays: 5,
    itinerary: {
      id: 'tirupati-south',
      subtitle: 'Tirupati • Madurai • Rameshwaram • Dhanushkodi',
      duration: '5 Days / 4 Nights',
      destinations: 'Tirupati • Madurai • Rameshwaram • Dhanushkodi',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_11.jpg',
      badge: '₹300 Seeghra Darshan & Laddu Prasadam Guaranteed',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Holy South India pilgrimage covering Lord Venkateswara at Tirupati, Lord Ramanathaswamy at Rameshwaram, and Goddess Meenakshi at Madurai.',
      transitInfo: 'Luxury Volvo AC Multi-Axle Coach ex-Bengaluru / Chennai with dedicated Tirumala uphill transit.',
      stayInfo: 'Handpicked 3-Star Hotels in Tirupati, Madurai, and Rameshwaram Beach Road.',
      meals: 'Authentic South Indian Pure Veg Meals served on traditional banana leaves + 2 Guaranteed Original Srivari Laddus per seat.',
      highlights: ['Pre-booked ₹300 Seeghra Darshan Pass', 'Guaranteed 2 Original Tirupati Srivari Laddus', 'Rameshwaram 22 Teertham Snan Guided', 'Madurai Meenakshi Night Chariot'],
      addons: [
        { id: 'laddu-combo', label: 'Special Prasadam Laddu Box (4 Pieces)', price: 200, selected: true },
        { id: 'teertham-purohit', label: 'Dedicated Purohit for Rameshwaram 22 Wells Snan', price: 950, selected: true },
        { id: 'uphill-suv', label: 'Private Uphill Tirumala AC Innova Upgrade', price: 2200, selected: false },
      ]
    }
  },
  {
    title: 'Maharashtra 5 Jyotirlinga Circuit',
    category: 'Spiritual',
    pricePerPerson: 11499,
    durationDays: 7,
    itinerary: {
      id: 'maharashtra-5jyotirlinga',
      subtitle: 'Trimbak • Bhimashankar • Grishneshwar • Aundha • Parli',
      duration: '7 Days / 6 Nights',
      destinations: 'Trimbak • Bhimashankar • Grishneshwar • Aundha • Parli',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_6.jpg',
      badge: 'Complete Maharashtra Shiv Teerth',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Holy circumambulation covering all five sacred Jyotirlingas in Maharashtra with Shirdi Sai Baba darshan included. Pre-booked Rudrabhishek slots.',
      transitInfo: 'Direct 2+1 AC Sleeper Coach with experienced mountain drivers & onboard devotional music.',
      stayInfo: 'Handpicked AC Hotels and Lodges near holy temple shrines with family accommodations.',
      meals: '100% Satvik Pure Veg Meals (traditional Maharashtrian dishes, Varadi thali & fasting options).',
      highlights: ['Complete circumambulation of all 5 Maharashtra Jyotirlingas', 'Pre-arranged Trimbakeshwar Rudrabhishek Puja Slot', 'Shirdi Sai Baba Samadhi Mandir VIP Darshan Pass', 'UNESCO World Heritage Ellora Caves Visit'],
      addons: [
        { id: 'rudrabhishek', label: 'Trimbakeshwar Special Rudrabhishek Puja Slot', price: 1500, selected: true },
        { id: 'shirdi-vip', label: 'Shirdi Sai Baba VIP Samadhi Darshan Pass', price: 500, selected: true },
        { id: 'ellora-caves', label: 'Ellora Kailasa Temple Guided Excursion', price: 750, selected: false },
      ]
    }
  },
  {
    title: 'Gujarat Somnath-Dwarka & Nageshwar',
    category: 'Spiritual',
    pricePerPerson: 5850,
    durationDays: 4,
    itinerary: {
      id: 'somnath-dwarka',
      subtitle: 'Dwarkadhish • Somnath • Nageshwar • Bet Dwarka',
      duration: '4 Days / 3 Nights',
      destinations: 'Dwarkadhish • Somnath • Nageshwar • Bet Dwarka',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_12.jpg',
      badge: 'Sound & Light Show + Dhwajarohan Assist',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Divine West Coast Yatra visiting Lord Krishna Dwarkadhish Temple, Somnath First Jyotirlinga on Arabian Sea, Nageshwar Jyotirlinga, and Bet Dwarka.',
      transitInfo: 'Luxury BharatBenz AC Coach ex-Ahmedabad / Rajkot with audio devotional player.',
      stayInfo: 'Premium Seafront and Temple-facing Hotels in Dwarka and Somnath.',
      meals: 'Daily Kathiyawadi & Gujarati Pure Veg Thali (Unlimited Farsan & Sweets).',
      highlights: ['Somnath Temple Sound & Light Laser Show Front Tickets', 'Bet Dwarka Boat Ferry & Rukmini Devi Temple Tour', 'Nageshwar Jyotirlinga Rudrabhishek Assistance', 'Porbandar Kirti Mandir Stop'],
      addons: [
        { id: 'rudrabhishek-nageshwar', label: 'Nageshwar Jyotirlinga Special Rudrabhishek', price: 1100, selected: true },
        { id: 'vip-dwarkadhish', label: 'Dwarkadhish Mangla Aarti Priority Entry', price: 500, selected: true },
        { id: 'porbandar-guide', label: 'Porbandar Kirti Mandir Guided Heritage Tour', price: 400, selected: false },
      ]
    }
  },
  {
    title: 'Shirdi Sai & Shani Shingnapur Express',
    category: 'Spiritual',
    pricePerPerson: 2899,
    durationDays: 2,
    itinerary: {
      id: 'shirdi-express',
      subtitle: 'Shirdi Samadhi • Dwarkamai • Shani Shingnapur',
      duration: '2 Days / 1 Night',
      destinations: 'Shirdi Samadhi • Dwarkamai • Shani Shingnapur',
      image: '/images/yatra_dedicated_spiritual_yatra_sacred_darshan_booking_refined_2.jpg',
      badge: 'Samadhi Mandir Kakad Aarti Pass',
      badgeColor: 'bg-amber-600 text-white',
      description: 'Short devotional getaway: Guaranteed morning Kakad Aarti entry pass, 100m walking-distance hotel from Gate No 2, early check-in, and holy mustard oil pooja.',
      transitInfo: 'Daily AC Express Coach ex-Pune / Mumbai / Nashik with comfortable pushback seats.',
      stayInfo: 'Verified AC Hotel located 100 meters walking distance from Shirdi Gate No. 2 with 6:00 AM early check-in.',
      meals: 'Daily Satvik Breakfast + Deluxe Buffet Dinner (No onion, no garlic options available).',
      highlights: ['Guaranteed Early Morning Kakad Aarti Entry', 'Hotel within 100m of Gate No. 2', 'Dwarkamai & Gurusthan Guided Walk', 'Shani Shingnapur Mustard Oil Pooja'],
      addons: [
        { id: 'kakad-aarti', label: 'Samadhi Mandir Kakad Aarti Reserved Pass', price: 600, selected: true },
        { id: 'shani-oil', label: 'Shani Shingnapur Sacred Mustard Oil & Thali Combo', price: 350, selected: true },
        { id: 'vip-darshan-sai', label: 'VIP Special Quick Darshan Pass for Shirdi', price: 400, selected: false },
      ]
    }
  },

  // ── Domestic Leisure & Hill Station Holidays ────────────────────────────────
  {
    title: 'Himachal Snow Valley & Rohtang Pass',
    category: 'Domestic',
    pricePerPerson: 9499,
    durationDays: 5,
    itinerary: {
      id: 'himachal-manali',
      subtitle: 'Shimla • Kullu • Manali • Solang • Rohtang',
      duration: '5 Days / 4 Nights',
      destinations: 'Shimla • Kullu • Manali • Solang Valley',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_13.jpg',
      badge: 'Atal Tunnel & Solang Snow Pass Included',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Rejuvenating mountain retreat through the snow-capped Himalayas with Solang Valley snow sports pass, Atal Tunnel excursion, and luxury hill resort stays.',
      transitInfo: 'Round-trip Volvo AC Semi-Sleeper Coach ex-Delhi / Chandigarh + private mountain cab.',
      stayInfo: '4-Star Cedar Wood Mountain Resort in Manali with private balconies and evening bonfire.',
      meals: 'Daily Buffet Breakfast & Chef-Special North Indian Dinner included.',
      highlights: ['Solang Valley Snow Sports & Cable Car Pass', 'Rohtang Pass Permit Assistance', 'Kullu River Rafting Tour', 'Hadimba Temple & Mall Road Tour'],
      addons: [
        { id: 'rohtang-pass', label: 'Special Green Permit for Rohtang Pass 4x4', price: 1800, selected: true },
        { id: 'paragliding', label: 'High Fly Paragliding in Solang Valley with GoPro', price: 2200, selected: false },
        { id: 'river-rafting', label: 'Kullu Beas River Rafting Combo (12 Km)', price: 1100, selected: true },
      ]
    }
  },
  {
    title: 'Kerala Backwaters & Munnar Tea Trails',
    category: 'Domestic',
    pricePerPerson: 11200,
    durationDays: 5,
    itinerary: {
      id: 'kerala-backwaters',
      subtitle: 'Kochi • Munnar Hills • Alleppey Backwaters • Fort Kochi',
      duration: '5 Days / 4 Nights',
      destinations: 'Kochi • Munnar • Alleppey Backwaters',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_14.jpg',
      badge: 'Private AC Houseboat & Tea Trails',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Lush tropical escape featuring rolling Munnar tea gardens, Periyar wildlife sanctuary, and a private AC backwater houseboat cruise in Alleppey.',
      transitInfo: 'Private AC Highway Coach / Sedan ex-Kochi / Madurai.',
      stayInfo: '2 Nights Tea Garden Resort in Munnar + 1 Night Private Deluxe Alleppey Houseboat + 1 Night Fort Kochi Hotel.',
      meals: 'Daily Buffet Breakfast + Fresh authentic Malabar Fish/Veg Meals cooked live by personal chef on houseboat.',
      highlights: ['Private Houseboat Cruise with Personal Chef', 'Munnar Tea Plantation Safari', 'Kathakali Dance VIP Front Row', 'Fort Kochi Chinese Fishing Nets'],
      addons: [
        { id: 'houseboat-upgrade', label: 'Luxury AC Houseboat Master Suite Upgrade', price: 2500, selected: true },
        { id: 'kathakali', label: 'Kathakali Dance & Martial Arts VIP Front Row', price: 450, selected: true },
        { id: 'spice-tour', label: 'Munnar Spice Plantation Guided Walk & Lunch', price: 750, selected: false },
      ]
    }
  },
  {
    title: 'Goa Coastal & Heritage Villa / Watersports',
    category: 'Domestic',
    pricePerPerson: 6999,
    durationDays: 4,
    itinerary: {
      id: 'goa-coastal',
      subtitle: 'Calangute • Baga • Mandovi Cruise • Aguada',
      duration: '4 Days / 3 Nights',
      destinations: 'Calangute • Baga • Mandovi River • Old Goa',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_15.jpg',
      badge: 'Beachfront Villa & Sunset Cruise',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Sun-drenched getaway with private sunset catamaran cruise on Mandovi River, Portuguese Latin Quarter walks, and beachside heritage villa stay.',
      transitInfo: 'Direct Luxury Sleeper Coach ex-Mumbai / Pune / Bengaluru or airport private cab.',
      stayInfo: '4-Star Beachside Boutique Resort / Heritage Villa with swimming pool (5 min walk to Calangute).',
      meals: 'Daily Buffet Breakfast + Welcome Drink & Dinner Pass included.',
      highlights: ['5-in-1 Water Sports Combo', 'Mandovi River Luxury Sunset Cruise with DJ', 'North Goa Beaches Tour', 'Old Goa UNESCO Basilica Tour'],
      addons: [
        { id: 'catamaran', label: 'Private Sunset Catamaran Cruise with Drinks', price: 1500, selected: true },
        { id: 'water-sports', label: '5-in-1 Water Sports Combo (Parasailing/JetSki)', price: 1200, selected: true },
        { id: 'scooter', label: 'Self-Drive Activa Scooter Rental (3 Days)', price: 900, selected: false },
      ]
    }
  },
  {
    title: 'Jim Corbett Safari & Nainital Lake',
    category: 'Domestic',
    pricePerPerson: 7450,
    durationDays: 4,
    itinerary: {
      id: 'corbett-nainital',
      subtitle: 'Dhikala Tiger Zone • Naini Lake • Bhimtal',
      duration: '4 Days / 3 Nights',
      destinations: 'Jim Corbett • Nainital • Bhimtal',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_16.jpg',
      badge: 'Open 4x4 Jeep Safari Included',
      badgeColor: 'bg-emerald-600 text-white',
      description: 'Thrilling jungle safari in India\'s oldest national park combined with tranquil boating on the emerald waters of Naini Lake.',
      transitInfo: 'Comfortable AC Highway Coach ex-Delhi/NCR + 4x4 Open Gypsy.',
      stayInfo: '2 Nights Luxury Jungle Resort in Ramnagar Corbett + 1 Night Scenic Lake View Hotel in Nainital.',
      meals: 'Daily Buffet Breakfast & Chef\'s Special Buffet Dinner included.',
      highlights: ['Morning 4x4 Open Gypsy Tiger Safari Pass', 'Naini Lake Private Gondola Boat Ride', 'Cable Car Ropeway Pass to Snow View', 'Corbett Waterfall Nature Trail'],
      addons: [
        { id: 'extra-safari', label: 'Early Morning Bijrani Zone Additional Safari', price: 2800, selected: false },
        { id: 'nainital-ropeway', label: 'Nainital Snow View Point Cable Car Pass', price: 400, selected: true },
        { id: 'jungle-bbq', label: 'Resort Riverside Barbeque Dinner Under Stars', price: 850, selected: true },
      ]
    }
  },

  // ── International Worldwide Holidays ────────────────────────────────────────
  {
    title: 'Luxury Dubai & Singapore Combo Escape',
    category: 'International',
    pricePerPerson: 89999,
    durationDays: 10,
    itinerary: {
      id: 'dubai-combo',
      subtitle: 'Dubai (4N) + Singapore (5N) Grand Tour',
      duration: '10 Days / 9 Nights',
      destinations: 'Dubai • Abu Dhabi • Singapore • Sentosa',
      image: '/images/yatra_international_holiday_travel_packages_1.jpg',
      badge: 'Featured Worldwide Grand Tour',
      badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
      description: '10-Day Dual Country Grand Odyssey: 4 Nights in Dubai + 5 Nights in Singapore with 5★ luxury stays, return international flights, red dune safari, and Universal Studios VIP pass.',
      transitInfo: 'Direct Round-Trip Flights ex-BOM/DEL/PNQ via Emirates & Singapore Airlines + Private AC Coach transfers.',
      stayInfo: 'JW Marriott Marquis Dubai (5★, 4 Nights) + Marina Bay Sands & Shangri-La Singapore (5★, 5 Nights).',
      meals: 'Daily 5★ International Buffet Breakfast + 100% Guaranteed Pure Veg Indian Satvik & Jain Dinners.',
      highlights: ['Burj Khalifa 124th & 125th Floor Observation Deck', '4x4 Red Dune Safari & Bedouin BBQ Camp', 'Universal Studios Singapore VIP Pass', 'Sentosa Island Cable Car & Wings of Time', 'Dual Country E-Visas Included'],
      addons: [
        { id: 'burj-prime', label: 'Burj Khalifa 148th Floor Sky Lounge Upgrade', price: 4200, selected: false },
        { id: 'universal-express', label: 'Universal Studios Express Unlimited Ride Pass', price: 3200, selected: true },
        { id: 'limo-transfer', label: 'VIP Stretch Limousine Airport Transfer in Dubai', price: 3500, selected: false },
      ]
    }
  },
  {
    title: 'Dubai Desert Safari & Marina Skyline',
    category: 'International',
    pricePerPerson: 44999,
    durationDays: 5,
    itinerary: {
      id: 'dubai-dunes',
      subtitle: 'Dubai Downtown • Desert Safari • Abu Dhabi',
      duration: '5 Days / 4 Nights',
      destinations: 'Dubai Downtown • Desert Safari • Abu Dhabi',
      image: '/images/yatra_international_holiday_travel_packages_2.jpg',
      badge: '4-Star Marina Hotel & Visa Included',
      badgeColor: 'bg-teal-600 text-white',
      description: '5-Day Action-Packed Dubai Escape: 4-Star Downtown/Marina hotel stay, red dune safari with BBQ, Burj Khalifa At The Top access, and Marina Dhow Cruise dinner.',
      transitInfo: 'Direct Non-Stop Flights ex-Mumbai & Pune via Air India Express / Indigo + Private AC Transfers.',
      stayInfo: '4★/5★ Downtown & Marina Hotels (Canal Central / Millennium Plaza Downtown).',
      meals: 'Daily International Buffet Breakfast + Unlimited Pure Veg Indian Buffet Dinners (Satvik & Jain).',
      highlights: ['Burj Khalifa 124th Floor At The Top Ticket', '4x4 Red Sand Dune Bashing & BBQ Night', 'Dubai Marina Wooden Dhow Cruise Dinner', 'Museum of the Future Photo Stop & Entry'],
      addons: [
        { id: 'burj-prime', label: 'Burj Khalifa 148th Floor Sky Lounge Upgrade', price: 4200, selected: false },
        { id: 'abu-dhabi', label: 'Full Day Abu Dhabi Tour & BAPS Hindu Mandir', price: 2800, selected: true },
        { id: 'limo-transfer', label: 'VIP Stretch Limousine Airport Transfer', price: 3500, selected: false },
      ]
    }
  },
  {
    title: 'Singapore & Malaysia Twin Explorer',
    category: 'International',
    pricePerPerson: 62500,
    durationDays: 7,
    itinerary: {
      id: 'singapore-malaysia',
      subtitle: 'Singapore • Malacca • Genting • Kuala Lumpur',
      duration: '7 Days / 6 Nights',
      destinations: 'Singapore • Genting Highlands • Kuala Lumpur',
      image: '/images/yatra_international_holiday_travel_packages_3.jpg',
      badge: 'Universal Studios & Cable Car Pass',
      badgeColor: 'bg-teal-600 text-white',
      description: '7-Day Twin Country Explorer: 3 Nights in Singapore + 3 Nights in Kuala Lumpur & Genting. Features Universal Studios, Sentosa Cable Car, Batu Caves, and Petronas Twin Towers.',
      transitInfo: 'Direct flight into Singapore Changi & return out of Kuala Lumpur International + AC Intercity Coach.',
      stayInfo: '4-Star City Center Hotels (Hotel Royal Singapore / Swiss-Garden KL / First World Genting).',
      meals: 'Daily Buffet Breakfast + Pure Veg South Indian & North Indian thali dinners.',
      highlights: ['Universal Studios Singapore Full Day Access', 'Sentosa Cable Car & S.E.A. Aquarium Entry', 'Sacred Batu Caves 272 Steps Guided Excursion', 'Awana SkyWay Cable Car to Genting Highlands'],
      addons: [
        { id: 'universal-express', label: 'Universal Studios Express Unlimited Ride Pass', price: 3200, selected: false },
        { id: 'night-safari', label: 'Singapore Night Safari Tram Adventure', price: 1900, selected: true },
        { id: 'batu-caves', label: 'Private Guided Tour of Batu Caves & Murugan Temple', price: 1100, selected: true },
      ]
    }
  },
  {
    title: 'Thailand Bangkok & Phuket / Pattaya Holiday',
    category: 'International',
    pricePerPerson: 36999,
    durationDays: 6,
    itinerary: {
      id: 'thailand-holiday',
      subtitle: 'Phuket • Phi Phi Islands • Bangkok City',
      duration: '6 Days / 5 Nights',
      destinations: 'Phuket • Phi Phi Islands • Bangkok City',
      image: '/images/yatra_international_holiday_travel_packages_5.jpg',
      badge: 'Speedboat Coral Island Tour',
      badgeColor: 'bg-teal-600 text-white',
      description: '6-Day Tropical Paradise Escape: 3 Nights Beachfront Resort in Phuket + 2 Nights City Hotel in Bangkok. Includes Phi Phi Island speedboat tour, Golden Buddha temple tour, and Chao Phraya cruise.',
      transitInfo: 'Round-trip International Flights ex-India + Internal Phuket-to-Bangkok flight + Private AC Transfers.',
      stayInfo: '4-Star Patong Beachfront Resort & Spa (Phuket) + The Berkeley Hotel Pratunam (Bangkok).',
      meals: 'Daily Resort Buffet Breakfast + Pure Veg Indian Dinners at Indian Delights Phuket & Bangkok.',
      highlights: ['Speedboat Tour to Phi Phi & Maya Bay', 'Coral Island Snorkeling & Water Sports', 'Wat Traimit Golden Buddha Temple Tour', 'Chao Phraya Princess Luxury Dinner Cruise'],
      addons: [
        { id: 'coral-watersports', label: 'Coral Island Parasailing & Sea Walker Combo', price: 2200, selected: true },
        { id: 'alcazar-vip', label: 'Alcazar Cabaret Show VIP Front Row Seat', price: 950, selected: true },
        { id: 'bangkok-safari', label: 'Safari World & Marine Park Full Day with Lunch', price: 1800, selected: false },
      ]
    }
  },
  {
    title: 'Bali Tropical Beaches & Ubud Culture',
    category: 'International',
    pricePerPerson: 39999,
    durationDays: 6,
    itinerary: {
      id: 'bali-escape',
      subtitle: 'Seminyak • Ubud Villa • Nusa Penida Island',
      duration: '6 Days / 5 Nights',
      destinations: 'Seminyak • Ubud • Kintamani Volcano • Nusa Penida',
      image: '/images/yatra_international_holiday_travel_packages_8.jpg',
      badge: 'Private Pool Villa & Floating Breakfast',
      badgeColor: 'bg-teal-600 text-white',
      description: '6-Day Island Paradise Escape: 2 Nights in Private Pool Luxury Villa in Seminyak + 3 Nights in Ubud Scenic Rainforest Resort with floating breakfast and Nusa Penida island ferry.',
      transitInfo: 'Round-Trip International Flights ex-India + Private AC Transfers throughout Bali.',
      stayInfo: '2 Nights in Private Pool Luxury Villa + 3 Nights in Ubud Scenic Rainforest Resort.',
      meals: 'Daily Breakfast with iconic Floating Pool Breakfast + Indian Veg/Jain Buffet Dinners.',
      highlights: ['Private Pool Villa with Iconic Floating Breakfast', 'Tegalalang Rice Terraces & Jungle Swing Excursion', 'Nusa Penida West Coast Island Ferry & Snorkeling', 'Kintamani Mount Batur Volcano Viewpoint', 'Uluwatu Sunset Cliff Temple & Kecak Fire Dance'],
      addons: [
        { id: 'floating-breakfast', label: 'Iconic Floating Breakfast in Villa Pool', price: 1400, selected: true },
        { id: 'nusa-penida', label: 'Nusa Penida West Coast Snorkeling Excursion', price: 2400, selected: true },
        { id: 'uluwatu-kecak', label: 'Uluwatu Sunset Temple & Kecak Fire Dance Pass', price: 1200, selected: false },
      ]
    }
  },
  {
    title: 'Grand Wonders of Europe: Swiss & Paris',
    category: 'International',
    pricePerPerson: 124999,
    durationDays: 8,
    itinerary: {
      id: 'europe-wonders',
      subtitle: 'Zurich • Mt Titlis • Lucerne • Paris',
      duration: '8 Days / 7 Nights',
      destinations: 'Zurich • Mt Titlis • Lucerne • Paris',
      image: '/images/yatra_international_holiday_travel_packages_10.jpg',
      badge: 'Jungfrau Train & Eiffel Tower Entry',
      badgeColor: 'bg-teal-600 text-white',
      description: '8-Day European Fairytale Odyssey: 4 Nights in Switzerland (Zurich & Lucerne) + 3 Nights in Paris. Features Eiffel Tower 2nd Level, Seine River cruise, Mt. Titlis revolving Rotair cable car, and Swiss Travel Pass.',
      transitInfo: 'Return International Flights ex-Delhi / Mumbai via Swiss International Airlines / Air France + TGV Lyria High-Speed Train.',
      stayInfo: 'Premium 4-Star Central City & Alpine Stays (Radisson Blu Zurich / Novotel Paris Centre Tour Eiffel).',
      meals: 'Daily Continental Buffet Breakfasts + Curated Pure Veg Indian Dinners with strict Jain options.',
      highlights: ['Eiffel Tower 2nd Level Priority Access', 'Romantic Seine River Bateaux Mouches Cruise', 'Mt. Titlis 360° Revolving Rotair Cable Car & Ice Flyer', 'Swiss Travel Pass Rail Transit', 'Schengen Visa Concierge Assistance'],
      addons: [
        { id: 'jungfrau', label: 'Jungfraujoch - Top of Europe Mountain Rail Pass', price: 9500, selected: true },
        { id: 'louvre', label: 'Louvre Museum Priority Entry with Audio Guide', price: 2600, selected: false },
        { id: 'disneyland', label: '1-Day Disneyland Paris 1-Park Entry Ticket', price: 6800, selected: false },
      ]
    }
  },
];

async function seedPackagesOnly() {
  console.log('[seedPackages] Updating Tour Packages catalogue in database...');
  
  // Clean old tour package records
  await prisma.packageBooking.deleteMany({});
  await prisma.tourPackage.deleteMany({});

  console.log(`[seedPackages] Inserting ${PACKAGES.length} packages...`);
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

  console.log(`[seedPackages] SUCCESS! Seeded ${PACKAGES.length} brand-neutral tour packages.`);
}

seedPackagesOnly()
  .catch((e) => {
    console.error('[seedPackages] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
