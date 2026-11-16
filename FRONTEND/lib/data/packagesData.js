export const allPackagesData = {
  // ── Spiritual Pilgrimage Yatras ─────────────────────────────────────────────
  'chardham': {
    id: 'chardham',
    title: 'Char Dham Yatra & Haridwar Special',
    subtitle: 'Kedarnath • Badrinath • Gangotri • Yamunotri • Haridwar',
    duration: '10 Days / 9 Nights',
    basePrice: 24499,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
    category: 'Spiritual Pilgrimage',
    badge: 'VIP Darshan & Helicopter Assist',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['2x2 BharatBenz AC Pushback Coach', 'Verified Warm Stays', 'Pure Satvik Dining', 'Har Ki Pauri Aarti Slot', 'VIP Darshan Passes'],
    addons: [
      { id: 'heli', label: 'Kedarnath Helicopter Ticket ex-Phata', price: 3500, selected: false },
      { id: 'vip-pass', label: 'VIP Priority Queue Pass for Badrinath', price: 999, selected: true },
      { id: 'ganga-aarti', label: 'Har Ki Pauri Reserved Ganga Aarti Seat', price: 499, selected: true },
      { id: 'oxygen', label: 'Portable Medical Oxygen Cylinder Onboard', price: 650, selected: false },
    ]
  },
  'kashi-ayodhya': {
    id: 'kashi-ayodhya',
    title: 'Ayodhya Ram Mandir & Kashi Corridor',
    subtitle: 'Ayodhya • Varanasi • Prayagraj Sangam',
    duration: '4 Days / 3 Nights',
    basePrice: 6499,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
    category: 'Spiritual Pilgrimage',
    badge: 'Ram Lalla & Kashi Corridor Pass',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['3★ AC Hotel', 'Ganga Boat Included', 'Sugam Darshan Entry', 'Banarasi Pure Veg Thali'],
    addons: [
      { id: 'private-boat', label: 'Private Handcrafted Bajra Boat for Evening Aarti', price: 1200, selected: true },
      { id: 'sugam-darshan', label: 'Kashi Vishwanath Sugam Darshan Fast Pass', price: 600, selected: true },
      { id: 'ayodhya-guide', label: 'Dedicated Vedic Historian Guide in Ayodhya', price: 800, selected: false },
    ]
  },
  'tirupati-south': {
    id: 'tirupati-south',
    title: 'Tirupati Balaji & Meenakshi Amman',
    subtitle: 'Tirupati • Madurai • Rameshwaram • Dhanushkodi',
    duration: '5 Days / 4 Nights',
    basePrice: 8950,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_11.jpg',
    category: 'Spiritual Pilgrimage',
    badge: '₹300 Seeghra Darshan & Laddu Prasadam Guaranteed',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['VIP Laddu Combo', 'Uphill AC Transit', '22 Teertham Snan', 'Banana Leaf Satvik Meals'],
    addons: [
      { id: 'laddu-combo', label: 'Special Prasadam Laddu Box (4 Pieces)', price: 200, selected: true },
      { id: 'teertham-purohit', label: 'Dedicated Purohit for Rameshwaram 22 Wells Snan', price: 950, selected: true },
      { id: 'uphill-suv', label: 'Private Uphill Tirumala AC Innova Upgrade', price: 2200, selected: false },
    ]
  },
  'maharashtra-5jyotirlinga': {
    id: 'maharashtra-5jyotirlinga',
    title: 'Maharashtra 5 Jyotirlinga Circuit',
    subtitle: 'Trimbak • Bhimashankar • Grishneshwar • Aundha • Parli',
    duration: '7 Days / 6 Nights',
    basePrice: 11499,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_6.jpg',
    category: 'Spiritual Pilgrimage',
    badge: 'Complete Maharashtra Shiv Teerth',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['Direct AC Sleeper', 'Pundit Escort', 'VIP Rudrabhishek', 'Shirdi Sai Darshan'],
    addons: [
      { id: 'rudrabhishek', label: 'Trimbakeshwar Special Rudrabhishek Puja Slot', price: 1500, selected: true },
      { id: 'shirdi-vip', label: 'Shirdi Sai Baba VIP Samadhi Darshan Pass', price: 500, selected: true },
      { id: 'ellora-caves', label: 'Ellora Kailasa Temple Guided Excursion', price: 750, selected: false },
    ]
  },
  'somnath-dwarka': {
    id: 'somnath-dwarka',
    title: 'Gujarat Somnath-Dwarka & Nageshwar',
    subtitle: 'Dwarkadhish • Somnath • Nageshwar • Bet Dwarka',
    duration: '4 Days / 3 Nights',
    basePrice: 5850,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_12.jpg',
    category: 'Spiritual Pilgrimage',
    badge: 'Sound & Light Show + Dhwajarohan Assist',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['BharatBenz AC Coach', 'Seafront / Temple Hotel', 'Daily Gujarati Satvik Thali', 'Bet Dwarka Ferry Tickets', 'Somnath Light Show'],
    addons: [
      { id: 'rudrabhishek-nageshwar', label: 'Nageshwar Jyotirlinga Special Rudrabhishek', price: 1100, selected: true },
      { id: 'vip-dwarkadhish', label: 'Dwarkadhish Mangla Aarti Priority Entry', price: 500, selected: true },
      { id: 'porbandar-guide', label: 'Porbandar Kirti Mandir Guided Heritage Tour', price: 400, selected: false },
    ]
  },
  'shirdi-express': {
    id: 'shirdi-express',
    title: 'Shirdi Sai & Shani Shingnapur Express',
    subtitle: 'Shirdi Samadhi • Dwarkamai • Shani Shingnapur',
    duration: '2 Days / 1 Night',
    basePrice: 2899,
    image: '/images/yatra_dedicated_spiritual_yatra_sacred_darshan_booking_refined_2.jpg',
    category: 'Spiritual Pilgrimage',
    badge: 'Samadhi Mandir Kakad Aarti Pass',
    badgeColor: 'bg-amber-600 text-white',
    inclusions: ['Daily AC Express Coach', 'Hotel 100m from Gate No. 2', 'Early 6 AM Check-in', 'Satvik Breakfast & Dinner', 'Shani Shingnapur Pooja'],
    addons: [
      { id: 'kakad-aarti', label: 'Samadhi Mandir Kakad Aarti Reserved Pass', price: 600, selected: true },
      { id: 'shani-oil', label: 'Shani Shingnapur Sacred Mustard Oil & Thali Combo', price: 350, selected: true },
      { id: 'vip-darshan-sai', label: 'VIP Special Quick Darshan Pass for Shirdi', price: 400, selected: false },
    ]
  },

  // ── Domestic Leisure & Hill Station Holidays ────────────────────────────────
  'himachal-manali': {
    id: 'himachal-manali',
    title: 'Himachal Snow Valley & Rohtang Pass',
    subtitle: 'Shimla • Kullu • Manali • Solang • Rohtang',
    duration: '5 Days / 4 Nights',
    basePrice: 9499,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_13.jpg',
    category: 'Domestic Holiday',
    badge: 'Atal Tunnel & Solang Snow Pass Included',
    badgeColor: 'bg-emerald-600 text-white',
    inclusions: ['Cedar Wood Mountain Resort', 'Round-Trip Volvo AC Sleeper', 'Solang Valley Transit', 'Atal Tunnel Crossing', 'Daily Buffet Breakfast & Dinner'],
    addons: [
      { id: 'rohtang-pass', label: 'Special Green Permit for Rohtang Pass 4x4', price: 1800, selected: true },
      { id: 'paragliding', label: 'High Fly Paragliding in Solang Valley with GoPro', price: 2200, selected: false },
      { id: 'river-rafting', label: 'Kullu Beas River Rafting Combo (12 Km)', price: 1100, selected: true },
    ]
  },
  'kerala-backwaters': {
    id: 'kerala-backwaters',
    title: 'Kerala Backwaters & Munnar Tea Trails',
    subtitle: 'Kochi • Munnar Hills • Alleppey Backwaters • Fort Kochi',
    duration: '5 Days / 4 Nights',
    basePrice: 11200,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_14.jpg',
    category: 'Domestic Holiday',
    badge: 'Private AC Houseboat & Tea Trails',
    badgeColor: 'bg-emerald-600 text-white',
    inclusions: ['Deluxe Tea Garden Resort', 'Private AC Houseboat Cruise', 'Kathakali Dance Show VIP Pass', 'All Intercity AC Transfers', 'Daily Breakfast & Houseboat Meals'],
    addons: [
      { id: 'houseboat-upgrade', label: 'Luxury AC Houseboat Master Suite Upgrade', price: 2500, selected: true },
      { id: 'kathakali', label: 'Kathakali Dance & Martial Arts VIP Front Row', price: 450, selected: true },
      { id: 'spice-tour', label: 'Munnar Spice Plantation Guided Walk & Lunch', price: 750, selected: false },
    ]
  },
  'goa-coastal': {
    id: 'goa-coastal',
    title: 'Goa Coastal & Heritage Villa / Watersports',
    subtitle: 'Calangute • Baga • Mandovi Cruise • Aguada',
    duration: '4 Days / 3 Nights',
    basePrice: 6999,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_15.jpg',
    category: 'Domestic Holiday',
    badge: 'Beachfront Villa & Sunset Cruise',
    badgeColor: 'bg-emerald-600 text-white',
    inclusions: ['4★ Beachside Heritage Villa Stay', 'Mandovi Luxury Sunset Cruise', '5-in-1 Water Sports Combo', 'North & South Goa Sightseeing', 'Daily Buffet Breakfast'],
    addons: [
      { id: 'catamaran', label: 'Private Sunset Catamaran Cruise with Drinks', price: 1500, selected: true },
      { id: 'water-sports', label: '5-in-1 Water Sports Combo (Parasailing/JetSki)', price: 1200, selected: true },
      { id: 'scooter', label: 'Self-Drive Activa Scooter Rental (3 Days)', price: 900, selected: false },
    ]
  },
  'corbett-nainital': {
    id: 'corbett-nainital',
    title: 'Jim Corbett Safari & Nainital Lake',
    subtitle: 'Dhikala Tiger Zone • Naini Lake • Bhimtal',
    duration: '4 Days / 3 Nights',
    basePrice: 7450,
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_16.jpg',
    category: 'Domestic Holiday',
    badge: 'Open 4x4 Jeep Safari Included',
    badgeColor: 'bg-emerald-600 text-white',
    inclusions: ['2 Nights Luxury Jungle Resort', '1 Night Nainital Lake View Stay', 'Open 4x4 Jeep Tiger Safari', 'Naini Lake Private Boat Ride', 'Daily Buffet Breakfast & Dinner'],
    addons: [
      { id: 'extra-safari', label: 'Early Morning Bijrani Zone Additional Safari', price: 2800, selected: false },
      { id: 'nainital-ropeway', label: 'Nainital Snow View Point Cable Car Pass', price: 400, selected: true },
      { id: 'jungle-bbq', label: 'Resort Riverside Barbeque Dinner Under Stars', price: 850, selected: true },
    ]
  },

  // ── International Worldwide Holidays ────────────────────────────────────────
  'dubai-combo': {
    id: 'dubai-combo',
    title: 'Luxury Dubai & Singapore Combo Escape',
    subtitle: 'Dubai (4N) + Singapore (5N) Grand Tour',
    duration: '10 Days / 9 Nights',
    basePrice: 89999,
    image: '/images/yatra_international_holiday_travel_packages_1.jpg',
    category: 'International Holiday',
    badge: 'Featured Worldwide Grand Tour',
    badgeColor: 'bg-amber-500 text-slate-950 font-extrabold',
    inclusions: ['Return International Flights', '4 Nights JW Marriott Dubai (5★)', '5 Nights Marina Bay Sands / Shangri-La (5★)', 'Burj Khalifa 124th Floor Entry', 'Universal Studios VIP Pass', 'Dual Country E-Visas Included'],
    addons: [
      { id: 'burj-prime', label: 'Burj Khalifa 148th Floor Sky Lounge Upgrade', price: 4200, selected: false },
      { id: 'universal-express', label: 'Universal Studios Express Unlimited Ride Pass', price: 3200, selected: true },
      { id: 'limo-transfer', label: 'VIP Stretch Limousine Airport Transfer in Dubai', price: 3500, selected: false },
    ]
  },
  'dubai-dunes': {
    id: 'dubai-dunes',
    title: 'Dubai Desert Safari & Marina Skyline',
    subtitle: 'Dubai Downtown • Desert Safari • Abu Dhabi',
    duration: '5 Days / 4 Nights',
    basePrice: 44999,
    image: '/images/yatra_international_holiday_travel_packages_2.jpg',
    category: 'International Holiday',
    badge: '4-Star Marina Hotel & Visa Included',
    badgeColor: 'bg-teal-600 text-white',
    inclusions: ['Direct Flights ex-Mumbai/Pune', '4★ Downtown / Marina Stay', 'Burj Khalifa 124th Floor Ticket', '4x4 Desert Safari & BBQ Dinner', 'Dhow Marina Cruise Dinner', 'Express eVisa Assistance'],
    addons: [
      { id: 'burj-prime', label: 'Burj Khalifa 148th Floor Sky Lounge Upgrade', price: 4200, selected: false },
      { id: 'abu-dhabi', label: 'Full Day Abu Dhabi Tour & BAPS Hindu Mandir', price: 2800, selected: true },
      { id: 'limo-transfer', label: 'VIP Stretch Limousine Airport Transfer', price: 3500, selected: false },
    ]
  },
  'singapore-malaysia': {
    id: 'singapore-malaysia',
    title: 'Singapore & Malaysia Twin Explorer',
    subtitle: 'Singapore • Malacca • Genting • Kuala Lumpur',
    duration: '7 Days / 6 Nights',
    basePrice: 62500,
    image: '/images/yatra_international_holiday_travel_packages_3.jpg',
    category: 'International Holiday',
    badge: 'Universal Studios & Cable Car Pass',
    badgeColor: 'bg-teal-600 text-white',
    inclusions: ['Universal Studios Pass', 'Gardens by the Bay Entry', 'Genting Cable Car Ride', '4★ City Center Stays', 'Dual Country Visa Assist'],
    addons: [
      { id: 'universal-express', label: 'Universal Studios Express Unlimited Ride Pass', price: 3200, selected: false },
      { id: 'night-safari', label: 'Singapore Night Safari Tram Adventure', price: 1900, selected: true },
      { id: 'batu-caves', label: 'Private Guided Tour of Batu Caves & Murugan Temple', price: 1100, selected: true },
    ]
  },
  'thailand-holiday': {
    id: 'thailand-holiday',
    title: 'Thailand Bangkok & Phuket / Pattaya Holiday',
    subtitle: 'Phuket • Phi Phi Islands • Bangkok City',
    duration: '6 Days / 5 Nights',
    basePrice: 36999,
    image: '/images/yatra_international_holiday_travel_packages_5.jpg',
    category: 'International Holiday',
    badge: 'Speedboat Coral Island Tour',
    badgeColor: 'bg-teal-600 text-white',
    inclusions: ['Round-Trip International & Domestic Flights', '4★ Beachfront Resort & City Hotel', 'Phi Phi Island Speedboat & Buffet', 'Chao Phraya Dinner Cruise', 'Visa on Arrival Assistance'],
    addons: [
      { id: 'coral-watersports', label: 'Coral Island Parasailing & Sea Walker Combo', price: 2200, selected: true },
      { id: 'alcazar-vip', label: 'Alcazar Cabaret Show VIP Front Row Seat', price: 950, selected: true },
      { id: 'bangkok-safari', label: 'Safari World & Marine Park Full Day with Lunch', price: 1800, selected: false },
    ]
  },
  'bali-escape': {
    id: 'bali-escape',
    title: 'Bali Tropical Beaches & Ubud Culture',
    subtitle: 'Seminyak • Ubud Villa • Nusa Penida Island',
    duration: '6 Days / 5 Nights',
    basePrice: 39999,
    image: '/images/yatra_international_holiday_travel_packages_8.jpg',
    category: 'International Holiday',
    badge: 'Private Pool Villa & Floating Breakfast',
    badgeColor: 'bg-teal-600 text-white',
    inclusions: ['Private Pool Villa 2 Nights', 'Ubud Rainforest Resort 3 Nights', 'Iconic Floating Breakfast in Villa Pool', 'Nusa Penida West Coast Snorkeling', 'Tegalalang Rice Terraces & Swing'],
    addons: [
      { id: 'floating-breakfast', label: 'Iconic Floating Breakfast in Villa Pool', price: 1400, selected: true },
      { id: 'nusa-penida', label: 'Nusa Penida West Coast Snorkeling Excursion', price: 2400, selected: true },
      { id: 'uluwatu-kecak', label: 'Uluwatu Sunset Temple & Kecak Fire Dance Pass', price: 1200, selected: false },
    ]
  },
  'europe-wonders': {
    id: 'europe-wonders',
    title: 'Grand Wonders of Europe: Swiss & Paris',
    subtitle: 'Zurich • Mt Titlis • Lucerne • Paris',
    duration: '8 Days / 7 Nights',
    basePrice: 124999,
    image: '/images/yatra_international_holiday_travel_packages_10.jpg',
    category: 'International Holiday',
    badge: 'Jungfrau Train & Eiffel Tower Entry',
    badgeColor: 'bg-teal-600 text-white',
    inclusions: ['Eiffel Tower 2nd Level Access', 'Seine River Cruise', 'Mt. Titlis Rotair Cable Car', 'Swiss Travel Pass', 'Curated Indian Dinners with Jain Options', 'Schengen Visa Concierge'],
    addons: [
      { id: 'jungfrau', label: 'Jungfraujoch - Top of Europe Mountain Rail Pass', price: 9500, selected: true },
      { id: 'louvre', label: 'Louvre Museum Priority Entry with Audio Guide', price: 2600, selected: false },
      { id: 'disneyland', label: '1-Day Disneyland Paris 1-Park Entry Ticket', price: 6800, selected: false },
    ]
  }
};

// Backward-compatibility aliases for legacy URLs & stored booking drafts
allPackagesData['corbett-safari'] = allPackagesData['corbett-nainital'];
allPackagesData['dubai-marina'] = allPackagesData['dubai-dunes'];
allPackagesData['shirdi'] = allPackagesData['shirdi-express'];
