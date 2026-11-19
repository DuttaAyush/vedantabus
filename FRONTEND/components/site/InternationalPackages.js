'use client';

import React, { useState, useEffect, useRef } from 'react';

const packagesData = [
  {
    id: 'dubai-combo',
    title: 'Luxury Dubai & Singapore Combo Escape',
    subtitle: 'Dubai (4N) + Singapore (5N) Grand Tour',
    badge: 'Featured Worldwide Grand Tour',
    badgeColor: 'bg-amber-400 text-slate-950',
    duration: '10 Days / 9 Nights',
    price: '₹89,999',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_1.jpg',
    flightInfo: 'Direct Round-Trip Flights ex-Mumbai (BOM), Delhi (DEL), & Pune (PNQ) via Emirates & Singapore Airlines (25kg baggage included).',
    visaDetails: 'UAE Express 30-Day Tourist E-Visa & Singapore E-Visa included with 48-hour fast-track approval (Passport valid min. 6 months required).',
    mealPlan: 'Daily 5★ International Buffet Breakfast + 100% Guaranteed Pure Veg Indian Satvik & Jain Dinners served at curated partner restaurants.',
    cancellationPolicy: '100% Refundable up to 15 days prior to travel date. Zero cancellation markup guarantee.',
    shortPlan:
      '10-Day Dual Country Grand Odyssey: 4 Nights in Dubai + 5 Nights in Singapore with 5★ luxury stays, return international flights, red dune safari, Burj Khalifa VIP access, Universal Studios VIP pass, and 100% verified Indian Satvik dinners.',
    hotels: [
      { city: 'Dubai (4 Nights)', hotel: 'JW Marriott Marquis Dubai (5★)', meal: 'Daily Buffet Breakfast & Indian Satvik Dinner' },
      { city: 'Singapore (5 Nights)', hotel: 'Marina Bay Sands & Shangri-La Singapore (5★)', meal: 'Daily Breakfast & Jain Veg Meals' },
    ],
    highlights: [
      'Burj Khalifa 124th & 125th Floor Access',
      '4x4 Red Dune Safari & Bedouin BBQ Camp',
      'Singapore Marina Bay Sands SkyPark',
      'Universal Studios Singapore VIP Pass',
      'Sentosa Island Cable Car & Wings of Time',
      'Guaranteed Indian Satvik Veg & Jain Dining',
      'Fast-Track UAE & Singapore Visa Assistance',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Dubai & Marina Dhow Cruise',
        desc: 'Arrive at DXB Airport with private luxury AC coach transfer to JW Marriott Marquis. Evening luxury Dhow Cruise along Dubai Marina with live Tanoura dance show and 5★ dinner buffet.',
      },
      {
        day: 'Day 2',
        title: 'Dubai City Tour & Burj Khalifa 124th & 125th Floor',
        desc: 'Guided morning city tour past Dubai Frame, Zabeel Palace, Palm Jumeirah, and Gold Souk. Sunset admission to Burj Khalifa observation deck with panoramic view.',
      },
      {
        day: 'Day 3',
        title: '4x4 Red Dune Desert Safari & Bedouin BBQ Camp',
        desc: 'Morning leisure at Dubai Mall & Aquarium. 3:00 PM pickup in Land Cruisers for red dune bashing, camel rides, henna art, belly dance, and authentic BBQ dinner.',
      },
      {
        day: 'Day 4',
        title: 'Museum of the Future & Flight to Singapore',
        desc: 'Visit Museum of the Future. Evening airport transfer for flight to Singapore. Private transfer to Shangri-La Singapore upon landing.',
      },
      {
        day: 'Day 5',
        title: 'Singapore City Drive & Night Safari Excursion',
        desc: 'Explore Merlion Park, Gardens by the Bay Flower Dome, and Cloud Forest. Evening tram ride through world-famous Singapore Night Safari.',
      },
      {
        day: 'Day 6',
        title: 'Universal Studios Singapore Full Day Pass',
        desc: 'All-day access to Sentosa Island Universal Studios. Experience Transformers 3D, Jurassic Park Rapids, Sci-Fi City, and Hollywood Boulevard.',
      },
      {
        day: 'Day 7',
        title: 'Sentosa Cable Car, S.E.A. Aquarium & Wings of Time',
        desc: 'Scenic cable car ride across Singapore Harbor, visit S.E.A. Aquarium, and night multi-sensory laser & water show at Siloso Beach.',
      },
      {
        day: 'Day 8',
        title: 'Marina Bay Sands SkyPark & Shopping at Orchard',
        desc: 'Check in to iconic Marina Bay Sands hotel. Afternoon entry to 57th Floor SkyPark infinity view and high-end shopping at Orchard Road.',
      },
      {
        day: 'Day 9',
        title: 'Jewel Changi Canopy Park & Waterfall Tour',
        desc: 'Explore HSBC Rain Vortex, Canopy Park, and Jewel Changi indoor waterfall wonderland with complimentary local tea sampling.',
      },
      {
        day: 'Day 10',
        title: 'Souvenir Shopping & Flight Back to India',
        desc: 'Breakfast at hotel, free morning for shopping at Mustafa Centre, followed by airport drop-off for flight back to India.',
      },
    ],
    inclusions: [
      'Return International Flight Tickets (ex-BOM/DEL/PNQ)',
      '4 Nights in Dubai 5★ Hotel + 5 Nights in Singapore 5★ Hotel',
      'Daily International Buffet Breakfasts & Indian Satvik Dinners',
      'UAE Express E-Visa & Singapore E-Visa Processing Fee Included',
      'All Sightseeing Entry Tickets (Burj Khalifa, Universal Studios, Night Safari)',
      'Private AC Coach Transfers throughout both countries with English/Hindi Guide',
    ],
    exclusions: ['Personal Expenses & Mini Bar', 'Tourism Dirham Fee (~₹400/night)', 'Optional Water Sports Activities'],
  },
  {
    id: 'dubai-dunes',
    title: 'Dubai Desert Safari & Marina Skyline',
    subtitle: 'Dubai Downtown • Desert Safari • Abu Dhabi',
    badge: '4-Star Marina Hotel & Visa Included',
    badgeColor: 'bg-teal-600 text-white',
    duration: '5 Days / 4 Nights',
    price: '₹44,999',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_2.jpg',
    flightInfo: 'Direct Non-Stop Flights ex-Mumbai & Pune via Air India Express / Indigo (20kg baggage + 7kg cabin).',
    visaDetails: 'UAE 30-Day Single Entry Tourist E-Visa with complimentary COVID-19 & travel health insurance.',
    mealPlan: 'Daily Buffet Breakfast at Downtown Hotel + Unlimited Indian Buffet Dinners (Satvik Veg & Jain options).',
    cancellationPolicy: 'Free cancellation up to 10 days prior to departure date with 100% money back.',
    shortPlan:
      '5-Day Action-Packed Dubai Escape: 4-Star Downtown hotel stay, red dune safari with BBQ, Burj Khalifa At The Top access, Marina Dhow Cruise dinner, and Museum of the Future excursion.',
    hotels: [
      { city: 'Dubai Downtown (4 Nights)', hotel: 'Canal Central / Millennium Plaza Downtown (4★)', meal: 'Daily Breakfast & Indian Dinner' },
    ],
    highlights: [
      'Burj Khalifa 124th Floor At The Top Ticket',
      '4x4 Red Sand Dune Bashing & BBQ Night',
      'Dubai Marina Dhow Cruise with Live Shows',
      'Museum of the Future Photo Stop & Entry',
      'Dubai Frame & Gold Souk Guided Walking Tour',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival DXB & Marina Dhow Cruise',
        desc: 'Land at DXB. Private transfer to 4★ Downtown hotel. Evening relaxation on wooden Dhow cruise along Dubai Marina with live Tanoura dance & buffet dinner.',
      },
      {
        day: 'Day 2',
        title: 'Half Day City Tour & Burj Khalifa 124th Floor',
        desc: 'Photo stops at Burj Al Arab, Atlantis Palm, and Jumeirah Mosque. Afternoon entrance to 124th floor Burj Khalifa elevator ride.',
      },
      {
        day: 'Day 3',
        title: '4x4 Red Dune Safari & Bedouin BBQ Camp',
        desc: 'Thrilling sand dunes riding in 4x4 Land Cruiser, camel rides, quad biking option, belly dance, and BBQ dinner under the desert stars.',
      },
      {
        day: 'Day 4',
        title: 'Museum of the Future & Gold Souk Shopping',
        desc: 'Morning visit to Museum of the Future. Afternoon guided shopping tour at Deira Gold Souk & Spice Souk.',
      },
      {
        day: 'Day 5',
        title: 'Mall of the Emirates & Departure Flight',
        desc: 'Check-out from hotel, souvenir shopping at Mall of the Emirates before airport transfer for flight home.',
      },
    ],
    inclusions: [
      'Direct Round-Trip Flights ex-Mumbai / Pune',
      '4 Nights in 4-Star Downtown Dubai Hotel',
      'Daily Buffet Breakfast & Pure Veg Indian Dinner',
      'UAE Tourist E-Visa & Travel Insurance',
      'All Entry Tickets & Private Airport Transfers',
    ],
    exclusions: ['Tourism Dirham Tax (₹350/room/night)', 'Personal Shopping'],
  },
  {
    id: 'singapore-malaysia',
    title: 'Singapore & Malaysia Twin Explorer',
    subtitle: 'Singapore • Malacca • Genting • Kuala Lumpur',
    badge: 'Universal Studios & Cable Car Pass',
    badgeColor: 'bg-teal-600 text-white',
    duration: '7 Days / 6 Nights',
    price: '₹62,500',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_3.jpg',
    flightInfo: 'Direct Flights to Singapore Changi & Return ex-Kuala Lumpur International via Singapore Airlines & Malaysia Airlines.',
    visaDetails: 'Singapore E-Visa & Malaysia Digital Arrival Card (MDAC) processed by our documentation team.',
    mealPlan: 'Daily International Breakfast + Pure Veg South Indian & North Indian thali dinners.',
    cancellationPolicy: '100% Refundable up to 14 days before departure.',
    shortPlan:
      '7-Day Twin Country Explorer: 3 Nights in Singapore + 3 Nights in Kuala Lumpur & Genting. Features Universal Studios, Sentosa Cable Car, Batu Caves, and Petronas Twin Towers.',
    hotels: [
      { city: 'Singapore (3 Nights)', hotel: 'Hotel Royal / V Hotel Lavender (4★)', meal: 'Daily Breakfast & Indian Meals' },
      { city: 'Kuala Lumpur & Genting (3 Nights)', hotel: 'Swiss-Garden Hotel KL / First World Genting (4★)', meal: 'Daily Breakfast & Dinners' },
    ],
    highlights: [
      'Universal Studios Singapore Full Day Access',
      'Sentosa Cable Car & S.E.A. Aquarium Entry',
      'Sacred Batu Caves Guided Excursion',
      'Genting Highlands Cable Car Ride & Casino',
      'Petronas Twin Towers & KL Tower Photo Stop',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Singapore & City Drive',
        desc: 'Welcome at Changi Airport. Transfer to hotel. Afternoon drive past Merlion Park, Chinatown, Little India, and Civic District.',
      },
      {
        day: 'Day 2',
        title: 'Universal Studios Singapore Full Day',
        desc: 'Full day fun at Sentosa Island Universal Studios. Experience Transformers, Mummy Revenge, and Jurassic Park.',
      },
      {
        day: 'Day 3',
        title: 'Sentosa Cable Car & Night Laser Show',
        desc: 'Cable car ride over harbor, S.E.A. Aquarium visit, and spectacular Wings of Time laser water show.',
      },
      {
        day: 'Day 4',
        title: 'Intercity AC Coach to Kuala Lumpur',
        desc: 'Scenic overland travel across Malaysia border with lunch stop at historic UNESCO Malacca city.',
      },
      {
        day: 'Day 5',
        title: 'Batu Caves & Genting Highlands Day Trip',
        desc: 'Ascend the 272 steps at Lord Murugan Batu Caves, then take Awana SkyWay cable car to Genting Highlands resort.',
      },
      {
        day: 'Day 6',
        title: 'Kuala Lumpur City Tour & Petronas Towers',
        desc: 'Visit Petronas Twin Towers photo point, King Palace, National Mosque, and shopping at Bukit Bintang.',
      },
      {
        day: 'Day 7',
        title: 'Jewel Changi Visit & Return Flight',
        desc: 'Transfer back to airport for flight back to India.',
      },
    ],
    inclusions: [
      'Singapore & Malaysia E-Visas Included',
      '6 Nights in 4-Star Hotels with Daily Breakfast & Dinner',
      'Universal Studios & Sentosa Cable Car Passes',
      'AC Intercity Coach Transfer between SG & KL',
      'English & Hindi Speaking Tour Manager',
    ],
    exclusions: ['Malaysia Tourism Tax (RM 10/night)', 'Laundry & Mini Bar'],
  },
  {
    id: 'thailand-holiday',
    title: 'Thailand Bangkok & Phuket / Pattaya Holiday',
    subtitle: 'Phuket • Phi Phi Islands • Bangkok City',
    badge: 'Speedboat Coral Island Tour',
    badgeColor: 'bg-teal-600 text-white',
    duration: '6 Days / 5 Nights',
    price: '₹36,999',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_5.jpg',
    flightInfo: 'Round-Trip International Flights ex-India + Internal Domestic Flight (Phuket to Bangkok) included.',
    visaDetails: 'Thailand Visa Waiver / Visa on Arrival Express Clearance Assistance at Phuket International Airport.',
    mealPlan: 'Daily Resort Breakfast + Pure Veg Indian Dinners at Indian Delights Phuket & Bangkok.',
    cancellationPolicy: 'Cancel up to 10 days before travel with 100% money back.',
    shortPlan:
      '6-Day Tropical Paradise Escape: 3 Nights Beachfront Resort in Phuket + 2 Nights City Hotel in Bangkok. Includes Phi Phi Island speedboat tour, Golden Buddha temple tour, and Chao Phraya cruise.',
    overview:
      '6-Day Tropical Paradise Escape: 3 Nights Beachfront Resort in Phuket + 2 Nights City Hotel in Bangkok. Includes Phi Phi Island speedboat tour, Golden Buddha temple tour, and Chao Phraya cruise.',
    hotels: [
      { city: 'Phuket Beachfront (3 Nights)', hotel: 'Patong Beach Resort & Spa (4★)', meal: 'Daily Breakfast & Indian Dinner' },
      { city: 'Bangkok City (2 Nights)', hotel: 'The Berkeley Hotel Pratunam (4★)', meal: 'Daily Breakfast & Dinners' },
    ],
    highlights: [
      'Speedboat Tour to Phi Phi & Maya Bay',
      'Coral Island Water Sports & Snorkeling',
      'Wat Traimit Golden Buddha & Wat Pho Temple Tour',
      'Chao Phraya Princess Luxury Cruise & Buffet',
      '100% Guaranteed Pure Veg Indian Restaurants',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Phuket & Patong Beach',
        desc: 'Arrive at Phuket Airport. Transfer to beachfront resort near Patong Beach. Relax at Patong Night Market and beach.',
      },
      {
        day: 'Day 2',
        title: 'Full Day Phi Phi Islands by Speedboat',
        desc: 'Speedboat cruise to Maya Bay, Viking Cave, Monkey Beach, and snorkeling at Khai Island with buffet lunch included.',
      },
      {
        day: 'Day 3',
        title: 'Phuket City Tour & Coral Island',
        desc: 'Visit Big Buddha viewpoint, Wat Chalong, Karon Viewpoint, and option for parasailing at Coral Island.',
      },
      {
        day: 'Day 4',
        title: 'Flight to Bangkok & Temple Tour',
        desc: 'Domestic flight to Bangkok. Tour Wat Traimit (Golden Buddha) and Wat Pho (Reclining Buddha).',
      },
      {
        day: 'Day 5',
        title: 'Chao Phraya River Cruise & Shopping',
        desc: 'Shopping at Siam Paragon & MBK Mall. Evening Chao Phraya Princess luxury dinner cruise with live saxophone.',
      },
      {
        day: 'Day 6',
        title: 'Central World Shopping & Flight Back',
        desc: 'Free morning for shopping before airport drop-off for flight back to India.',
      },
    ],
    inclusions: [
      'Round-Trip Flights ex-India & Internal Phuket-Bangkok Flight',
      '5 Nights 4-Star Resort Stays with Daily Breakfast & Dinner',
      'Phi Phi Island Speedboat & National Park Park Fee',
      'All Sightseeing Tours & Private AC Transfers',
      'Thailand Visa Waiver / Visa on Arrival Support',
    ],
    exclusions: ['Optional Water Sports Fees', 'Personal Tipping'],
  },
  {
    id: 'bali-escape',
    title: 'Bali Tropical Beaches & Ubud Culture',
    subtitle: 'Seminyak • Ubud Villa • Nusa Penida Island',
    badge: 'Private Pool Villa & Floating Breakfast',
    badgeColor: 'bg-teal-600 text-white',
    duration: '6 Days / 5 Nights',
    price: '₹39,999',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_8.jpg',
    flightInfo: 'Round-Trip International Flights ex-India via Singapore Airlines / Malindo Air with 25kg checked baggage.',
    visaDetails: 'Indonesia 30-Day Visa on Arrival / e-VOA express clearance assistance at Denpasar Ngurah Rai Airport.',
    mealPlan: 'Daily Breakfast with iconic Floating Pool Breakfast + 100% Guaranteed Indian Veg/Jain Dinners at Queens Tandoor Bali.',
    cancellationPolicy: '100% Refundable up to 14 days before departure. Zero cancellation fee guarantee.',
    shortPlan:
      '6-Day Island Paradise Escape: 2 Nights in Private Pool Luxury Villa in Seminyak + 3 Nights in Ubud Scenic Rainforest Resort with floating breakfast, Tegalalang rice terrace swing, and Nusa Penida island ferry.',
    overview:
      '6-Day Island Paradise Escape: 2 Nights in Private Pool Luxury Villa in Seminyak + 3 Nights in Ubud Scenic Rainforest Resort with floating breakfast, Tegalalang rice terrace swing, and Nusa Penida island ferry.',
    hotels: [
      { city: 'Seminyak (2 Nights)', hotel: 'Aksari Villa Seminyak (Private Pool Villa)', meal: 'Floating Breakfast & Indian Dinner' },
      { city: 'Ubud (3 Nights)', hotel: 'Kamandalu Ubud Resort (5★)', meal: 'Daily Buffet Breakfast & Jain Meals' },
    ],
    highlights: [
      'Private Pool Villa with Iconic Floating Breakfast',
      'Tegalalang Rice Terraces & Jungle Swing Excursion',
      'Nusa Penida West Coast Island Ferry & Snorkeling',
      'Kintamani Mount Batur Volcano Viewpoint',
      'Uluwatu Sunset Cliff Temple & Kecak Fire Dance',
      '100% Verified Indian Satvik Veg & Jain Dining',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Bali & Private Villa Check-in',
        desc: 'Land at Denpasar Airport with flower garland welcome. Private AC transfer to luxury private pool villa in Seminyak. Evening beach sunset walk.',
      },
      {
        day: 'Day 2',
        title: 'Iconic Floating Breakfast & Water Sports',
        desc: 'Enjoy iconic morning floating breakfast in your private pool. Afternoon water sports at Tanjung Benoa (parasailing, jet ski) & Tanah Lot sunset temple.',
      },
      {
        day: 'Day 3',
        title: 'Transfer to Ubud via Tegalalang Rice Terraces',
        desc: 'Scenic drive to Ubud cultural capital. Visit Tegalalang Rice Terraces, coffee tasting at Luwak plantation, and giant jungle swing.',
      },
      {
        day: 'Day 4',
        title: 'Kintamani Volcano & Ubud Sacred Monkey Forest',
        desc: 'Panoramic views of Mount Batur active volcano and Lake Batur. Afternoon guided walk through Ubud Sacred Monkey Forest Sanctuary and art market.',
      },
      {
        day: 'Day 5',
        title: 'Nusa Penida Island Speedboat Day Tour',
        desc: 'Fast boat ferry to Nusa Penida island. Visit iconic Kelingking T-Rex Beach, Broken Beach, Angel’s Billabong, and snorkeling at Crystal Bay.',
      },
      {
        day: 'Day 6',
        title: 'Uluwatu Temple & Return Flight to India',
        desc: 'Check-out from resort. Visit clifftop Uluwatu Temple before airport transfer for flight back home.',
      },
    ],
    inclusions: [
      'Return International Flights ex-India',
      '2 Nights Private Pool Villa + 3 Nights 5★ Ubud Resort',
      'Iconic Floating Breakfast in Villa Pool Included',
      'Nusa Penida Island Fast Boat Ferry & Island Tour',
      'All Sightseeing Entry Passes & Private AC Transfers',
      'Indonesia e-VOA Visa Assistance',
    ],
    exclusions: ['Bali Tourism Tax (IDR 150,000 / ~₹800)', 'Personal Spa Treatments'],
  },
  {
    id: 'europe-wonders',
    title: 'Grand Wonders of Europe: Swiss & Paris',
    subtitle: 'Zurich • Mt Titlis • Lucerne • Paris',
    badge: 'Jungfrau Train & Eiffel Tower Entry',
    badgeColor: 'bg-purple-600 text-white',
    duration: '8 Days / 7 Nights',
    price: '₹1,24,999',
    perPerson: 'per person',
    image: '/images/yatra_international_holiday_travel_packages_10.jpg',
    flightInfo: 'Return International Flights ex-Delhi / Mumbai via Swiss International Airlines / Air France (30kg baggage included).',
    visaDetails: 'Schengen Visa Concierge Assistance with biometric appointment scheduling and complete documentation review.',
    mealPlan: 'Daily Continental Buffet Breakfasts + Curated Pure Veg Indian Dinners with strict Jain options in Paris & Switzerland.',
    cancellationPolicy: 'Free cancellation and full refund up to 21 days before departure.',
    shortPlan:
      '8-Day European Fairytale Odyssey: 4 Nights in Switzerland (Zurich & Lucerne) + 3 Nights in Paris. Features Eiffel Tower 2nd Level, Seine River cruise, Mt. Titlis revolving Rotair cable car, Swiss Travel Pass, and Hindi/English speaking tour manager.',
    overview:
      '8-Day European Fairytale Odyssey: 4 Nights in Switzerland (Zurich & Lucerne) + 3 Nights in Paris. Features Eiffel Tower 2nd Level, Seine River cruise, Mt. Titlis revolving Rotair cable car, Swiss Travel Pass, and Hindi/English speaking tour manager.',
    hotels: [
      { city: 'Switzerland (4 Nights)', hotel: 'Radisson Blu Zurich / Hotel Astoria Lucerne (4★)', meal: 'Daily Breakfast & Indian Dinner' },
      { city: 'Paris (3 Nights)', hotel: 'Novotel Paris Centre Tour Eiffel (4★)', meal: 'Daily Continental Breakfast & Indian Meals' },
    ],
    highlights: [
      'Eiffel Tower 2nd Level Priority Access',
      'Romantic Seine River Bateaux Mouches Cruise',
      'Mt. Titlis 360° Revolving Rotair Cable Car & Ice Flyer',
      'Lucerne Lion Monument & Chapel Bridge Tour',
      'Rhine Falls Boat Ride to the Middle Rock',
      'Swiss Travel Pass First Class Rail Transit',
      'Guaranteed Indian Satvik Veg & Jain Dinners',
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Zurich & Rhine Falls Boat Ride',
        desc: 'Land at Zurich Airport. Private AC transfer to hotel. Afternoon excursion to Rhine Falls, Europe’s largest waterfall, with boat ride right to the rock.',
      },
      {
        day: 'Day 2',
        title: 'Lucerne City Tour & Lake Lucerne Cruise',
        desc: 'Scenic train ride to Lucerne. Guided walking tour to Chapel Bridge and Lion Monument. Afternoon steamboat cruise on Lake Lucerne.',
      },
      {
        day: 'Day 3',
        title: 'Mount Titlis Snow Mountain & Rotair Cable Car',
        desc: 'Ascend to 10,000 feet on Mt. Titlis via world’s first revolving Rotair cable car. Experience Cliff Walk suspension bridge, Glacier Cave & Ice Flyer.',
      },
      {
        day: 'Day 4',
        title: 'Interlaken & Optional Jungfraujoch Excursion',
        desc: 'Day trip to Interlaken between Lake Thun and Lake Brienz. Optional mountain train excursion to Jungfraujoch - Top of Europe at 3,454m.',
      },
      {
        day: 'Day 5',
        title: 'TGV High-Speed Train to Paris & Evening Seine Cruise',
        desc: 'Board TGV Lyria high-speed train to Paris (3 hours). Check-in to hotel. Evening 1-hour Seine River cruise past illuminated Parisian monuments.',
      },
      {
        day: 'Day 6',
        title: 'Paris City Tour & Eiffel Tower 2nd Level Access',
        desc: 'Guided tour past Champs-Élysées, Arc de Triomphe, Louvre, and Notre Dame. Priority elevator access to Eiffel Tower 2nd floor with panoramic view.',
      },
      {
        day: 'Day 7',
        title: 'Full Day at Leisure or Optional Disneyland Paris',
        desc: 'Free day for shopping at Galeries Lafayette or optional full-day 1-Park ticket to Disneyland Paris.',
      },
      {
        day: 'Day 8',
        title: 'Louvre Museum Photo Stop & Flight Back to India',
        desc: 'Morning stroll around Louvre glass pyramid before afternoon transfer to Paris Charles de Gaulle Airport for return flight home.',
      },
    ],
    inclusions: [
      'Return International Flights ex-India',
      '4 Nights in Switzerland + 3 Nights in Paris (4★ Hotels)',
      'TGV High-Speed Train Ticket Switzerland to Paris',
      'Eiffel Tower 2nd Level Entry & Seine River Cruise',
      'Mt. Titlis Cable Car & Ice Flyer Tickets Included',
      'Daily Breakfast & Pure Veg Indian Dinners Throughout',
      'Schengen Visa Concierge Assistance',
    ],
    exclusions: ['Optional Jungfraujoch Rail Pass (₹9,500)', 'Optional Disneyland Ticket (₹6,800)', 'City Tourist Tax (~€3/night)'],
  },
];

export default function InternationalPackages() {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [sheetState, setSheetState] = useState('collapsed'); // 'collapsed' | 'expanded'
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'summary' | 'inclusions'
  const [isClosing, setIsClosing] = useState(false);
  const [cardScrollTop, setCardScrollTop] = useState(0);
  const packages = packagesData;

  const cardContainerRef = useRef(null);
  const touchStartY = useRef(0);

  // Keyboard Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPkg) {
        handleCloseSheet();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPkg]);

  // Lock body scroll when card is open
  useEffect(() => {
    if (selectedPkg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPkg]);

  const handleOpenSheet = (pkg) => {
    setSelectedPkg(pkg);
    setSheetState('collapsed');
    setActiveTab('itinerary');
    setIsClosing(false);
    setCardScrollTop(0);
  };

  const handleCloseSheet = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPkg(null);
      setSheetState('collapsed');
      setIsClosing(false);
    }, 280);
  };

  const handleExpandFullWindow = () => {
    setSheetState('expanded');
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollTop = 0;
    }
    setCardScrollTop(0);
  };

  const handleDownsizeToPeek = () => {
    setSheetState('collapsed');
  };

  const handleWheel = (e) => {
    if (sheetState === 'collapsed' && e.deltaY > 5) {
      handleExpandFullWindow();
    } else if (sheetState === 'expanded' && cardContainerRef.current) {
      if (cardContainerRef.current.scrollTop <= 0 && e.deltaY < -15) {
        handleDownsizeToPeek();
      }
    }
  };

  const handleScroll = (e) => {
    const st = e.target.scrollTop;
    setCardScrollTop(st);
    if (sheetState === 'collapsed' && st > 10) {
      handleExpandFullWindow();
    } else if (sheetState === 'expanded' && st < -20) {
      handleDownsizeToPeek();
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const diffY = touchStartY.current - touchY;

    if (sheetState === 'collapsed') {
      if (diffY > 25) {
        handleExpandFullWindow();
      } else if (diffY < -40) {
        handleCloseSheet();
      }
    } else if (sheetState === 'expanded' && cardContainerRef.current) {
      if (cardContainerRef.current.scrollTop <= 0 && diffY < -40) {
        handleDownsizeToPeek();
      }
    }
  };

  return (
    <section className="w-full py-16 bg-white border-b border-slate-200 scroll-mt-28 sm:scroll-mt-32" id="internationalPackagesSection">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              WORLD TOUR COLLECTIONS
            </div>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-serif font-semibold">
              International Holiday Packages
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Seamless global vacations featuring flight assistance, handpicked 4★ &amp; 5★ resort stays, curated city tours, and verified Indian meals. Click any card to preview.
            </p>
          </div>
          <div>
            <a
              className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
              href="/international"
            >
              <span>Explore all Global Packages</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Hero Spotlight Banner */}
        {packages[0] && (
          <div
            onClick={() => handleOpenSheet(packages[0])}
            className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200 relative group cursor-pointer transition-transform active:scale-[0.99]"
          >
            <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden bg-slate-900">
              <img
                alt="Luxury Dubai & Singapore Escape collage banner"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={packages[0].image}
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent"></div>
              <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                    {packages[0].badge}
                  </span>
                </div>
                <div className="max-w-2xl">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-serif tracking-tight mb-1 sm:mb-2 font-semibold">
                    {packages[0].title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-2.5 sm:mb-4 line-clamp-2">
                    {packages[0].overview || packages[0].shortPlan}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/20">
                      <span className="text-[9px] sm:text-[10px] text-amber-300 block font-semibold">Duration</span>
                      <span className="text-xs md:text-sm font-extrabold">{packages[0].duration}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/20">
                      <span className="text-[9px] sm:text-[10px] text-amber-300 block font-semibold">All-Inclusive</span>
                      <span className="text-xs md:text-sm font-extrabold">{packages[0].price} / person</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3 International Tour Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {packages.slice(1).map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleOpenSheet(pkg)}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col group cursor-pointer active:scale-[0.99]"
            >
              <div className="relative h-28 sm:h-40 md:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pkg.image}
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg bg-slate-900/80 backdrop-blur-md text-white font-bold text-[9px] sm:text-xs">
                  {pkg.duration}
                </span>
              </div>
              <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] sm:text-xs font-bold text-teal-600 block mb-0.5 sm:mb-1 truncate">{pkg.badge}</span>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-teal-600 transition-colors font-serif line-clamp-1 sm:line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">{pkg.overview || pkg.shortPlan}</p>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 block font-medium">Starts from</span>
                    <span className="text-sm sm:text-xl font-extrabold text-slate-900">{pkg.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSheet(pkg);
                    }}
                    className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-bold text-[10px] sm:text-xs shadow-sm flex items-center gap-1 transition-all shrink-0"
                    type="button"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-[12px] sm:text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          LARGER HERO IMAGE SIZE (H-[270px] peek / H-72-h-96 expanded)
         ========================================================================= */}
      {selectedPkg && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/25 backdrop-blur-[3px] transition-opacity duration-300 ${
            isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={handleCloseSheet}
        >
          {/* Floating Card Container */}
          <div
            ref={cardContainerRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 transition-all duration-500 ease-out flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar pb-[2.5vh] mb-[2.5vh] ${
              sheetState === 'collapsed'
                ? 'w-[90vw] max-w-2xl sm:w-[660px] h-[500px] sm:h-[530px] translate-y-0 shadow-teal-900/15'
                : 'w-[90vw] max-w-2xl sm:w-[660px] h-[82.5vh] max-h-[82.5vh] shadow-2xl ring-1 ring-slate-900/10'
            } ${isClosing ? 'translate-y-full scale-95 opacity-0' : 'translate-y-0 scale-100 opacity-100'}`}
          >
            {/* STICKY PARALLAX HERO IMAGE HEADER */}
            <div
              className={`sticky top-0 z-0 w-full overflow-hidden bg-slate-900 shrink-0 transition-all duration-500 rounded-t-3xl ${
                sheetState === 'collapsed' ? 'h-[250px] sm:h-[270px]' : 'h-72 sm:h-96 md:h-[360px]'
              }`}
            >
              <img
                src={selectedPkg.image}
                alt={selectedPkg.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover will-change-transform transition-all duration-150 ease-out"
                style={{
                  transform: `scale(${1 + Math.min(cardScrollTop / 600, 0.25)})`,
                  opacity: Math.max(1 - cardScrollTop / 600, 0.45)
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent"></div>

              {/* Controls Bar inside Hero */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-sm ${selectedPkg.badgeColor}`}>
                    {selectedPkg.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                    {selectedPkg.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Downsize Card button (Commented out as requested)
                  {sheetState === 'expanded' && (
                    <button
                      onClick={handleDownsizeToPeek}
                      className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1 transition-all"
                      title="Downsize Card"
                    >
                      <span className="material-symbols-outlined text-[16px]">south</span>
                      <span className="hidden sm:inline font-sans">Downsize Card</span>
                    </button>
                  )}
                  */}
                  <button
                    onClick={handleCloseSheet}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90"
                    aria-label="Close Card"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              {/* Title & Subtitle Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-10 text-white pb-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
                  {selectedPkg.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-semibold truncate mt-1 drop-shadow">
                  {selectedPkg.subtitle}
                </p>
              </div>
            </div>

            {/* CONTENT SHEET BELOW IMAGE */}
            <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(15,23,42,0.12)] border-t border-slate-100 mt-0 p-4 sm:p-5 flex flex-col justify-between">
              {/* Quick Info Header Bar: Price & Book Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-3 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Package Price
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{selectedPkg.price}</span>
                    <span className="text-[11px] font-medium text-slate-500">/ person</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/customize-package/${selectedPkg.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">tune</span>
                    <span>Customize</span>
                  </a>
                  <a
                    href={`/packages/checkout?package=${selectedPkg.id}`}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Package</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Highlights Snippet */}
              <div className="mb-3 shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {selectedPkg.highlights.slice(0, 4).map((hl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-[11px] font-semibold border border-teal-100"
                    >
                      <span className="material-symbols-outlined text-[13px] text-teal-600">check</span>
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Day 1 Teaser Snippet */}
              {selectedPkg.itinerary && selectedPkg.itinerary.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-3 text-xs shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-extrabold text-[10px]">
                        {selectedPkg.itinerary[0].day}
                      </span>
                      <span className="font-bold text-slate-900 truncate">{selectedPkg.itinerary[0].title}</span>
                    </div>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded">
                      +{selectedPkg.itinerary.length - 1} More Days
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 text-[11px]">{selectedPkg.itinerary[0].desc}</p>
                </div>
              )}

              {/* SCROLL UP TO SCALE TO 82.5% VH PROMPT */}
              {sheetState === 'collapsed' ? (
                <div
                  onClick={handleExpandFullWindow}
                  className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between cursor-pointer group bg-gradient-to-r from-teal-50 via-teal-50/50 to-white px-4 py-2 rounded-2xl border border-teal-200/80 transition-all shadow-sm shrink-0"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                    <span className="material-symbols-outlined text-[18px] text-teal-600 animate-bounce">
                      arrow_upward
                    </span>
                    <span>Scroll down or tap to expand (80% Width × 82.5% Height)</span>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-extrabold group-hover:scale-105 transition-transform shadow-sm">
                    EXPAND CARD
                  </span>
                </div>
              ) : (
                /* 82.5% VH EXPANDED DETAILS (TABBED SYSTEM) */
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-6">
                  {/* Tab Navigation Switcher */}
                  <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1 font-bold text-xs">
                    <button
                      onClick={() => setActiveTab('itinerary')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'itinerary'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Day-by-Day Plan ({selectedPkg.itinerary.length} Days)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'summary'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">hotel</span>
                      <span>Short Summary &amp; Hotels</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inclusions')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'inclusions'
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Inclusions &amp; Visas</span>
                    </button>
                  </div>

                  {/* TAB 1: COMPLETE DAY-BY-DAY DETAILED ITINERARY */}
                  {activeTab === 'itinerary' && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-serif">
                        Complete Day-by-Day Travel Plan ({selectedPkg.duration})
                      </h3>
                      {selectedPkg.itinerary.map((dayItem, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm flex flex-col sm:flex-row gap-3.5 items-start hover:border-teal-300 transition-colors"
                        >
                          <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-extrabold text-xs shrink-0">
                            {dayItem.day}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1 text-sm">{dayItem.title}</h4>
                            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{dayItem.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: SHORT SUMMARY & HOTEL STAYS */}
                  {activeTab === 'summary' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                        <h4 className="text-sm font-bold text-teal-900 mb-2 font-serif flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                          <span>Short Plan Overview</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-teal-950 leading-relaxed mb-3">{selectedPkg.shortPlan}</p>

                        {/* Flight & Meal Details */}
                        <div className="space-y-2 text-xs text-teal-900 pt-2 border-t border-teal-200/60">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-teal-600 shrink-0">flight</span>
                            <span><strong>Flight Schedule:</strong> {selectedPkg.flightInfo}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-teal-600 shrink-0">restaurant</span>
                            <span><strong>Meal Plan:</strong> {selectedPkg.mealPlan}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-teal-600 shrink-0">verified_user</span>
                            <span><strong>Policy:</strong> {selectedPkg.cancellationPolicy}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 font-serif">Handpicked Luxury Hotel Accommodations</h4>
                        <div className="space-y-2.5">
                          {selectedPkg.hotels.map((h, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs sm:text-sm">
                              <div>
                                <span className="font-bold text-slate-900 block">{h.city}</span>
                                <span className="text-teal-700 font-semibold">{h.hotel}</span>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                {h.meal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: INCLUSIONS, VISAS & TERMS */}
                  {activeTab === 'inclusions' && (
                    <div className="space-y-4">
                      {/* Visa Details */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                        <h4 className="font-bold mb-1.5 text-amber-900 flex items-center gap-1.5 text-sm font-serif">
                          <span className="material-symbols-outlined text-[18px] text-amber-600">assignment</span>
                          <span>Visa Assistance &amp; Requirements</span>
                        </h4>
                        <p className="text-amber-900 leading-relaxed mb-2">{selectedPkg.visaDetails}</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900 text-white">
                        <h4 className="text-sm font-bold text-amber-300 mb-3 font-serif flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>What is Included in Your Package</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                          {selectedPkg.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[16px] text-teal-400 shrink-0 mt-0.5">check_circle</span>
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedPkg.exclusions && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950">
                          <h4 className="font-bold mb-2 text-red-900 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-red-600">cancel</span>
                            <span>Package Exclusions</span>
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {selectedPkg.exclusions.map((exc, i) => (
                              <li key={i}>{exc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Controls (Commented out as requested)
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleDownsizeToPeek}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-[16px]">south</span>
                      <span>Downsize Card</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={handleCloseSheet}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Close Card</span>
                    </button>
                  </div>
                  */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
