'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const spiritualData = [
  {
    id: 'chardham',
    title: 'Char Dham Yatra & Haridwar Special',
    subtitle: 'Kedarnath • Badrinath • Gangotri • Yamunotri • Haridwar',
    badge: 'VIP Darshan & Helicopter Assist',
    badgeColor: 'bg-amber-600 text-white',
    duration: '10 Days / 9 Nights',
    price: '₹74,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
    transitInfo: 'BharatBenz AC Sleeper Coach ex-Delhi/Haridwar with experienced mountain drivers & tour manager.',
    stayInfo: 'Deluxe Temple View Hotels in Haridwar, Barkot, Uttarkashi, Guptkashi, Badrinath & Kedarnath Homestays.',
    meals: '100% Satvik Pure Veg Meals (No onion/garlic options available). Fresh hot prasadam served daily.',
    highlights: [
      'VIP Queue Pass for Kedarnath & Badrinath Darshan',
      'Pony / Helicopter Coordination at Phata & Guptkashi',
      'Daily Ganga Aarti & Triveni Ghat Snan Assist',
      'Yamunotri & Gangotri Holy Water Sangam Pooja',
      'Experienced Hindi & English Speaking Yatra Captain',
    ],
    shortPlan:
      'Complete 4-Dham holy circuit across Uttarakhand Himalayas. Includes BharatBenz AC bus travel, pre-booked VIP darshan passes, priority queue access, deluxe hotel stays, and verified 100% Satvik pure veg meals throughout the journey.',
    itinerary: [
      { day: 'Day 1', title: 'Delhi / Haridwar to Barkot', desc: 'Departure by AC sleeper coach to Barkot via Mussoorie. Check-in at Barkot resort for evening briefing & Satvik dinner.' },
      { day: 'Day 2', title: 'Yamunotri Dham Darshan & Holy Snan', desc: 'Drive to Janki Chatti, trek to Yamunotri Temple for Holy Dip in Surya Kund and Divya Shila pooja. Return to Barkot.' },
      { day: 'Day 3', title: 'Barkot to Uttarkashi (Kashi Vishwanath Temple)', desc: 'Drive along Bhagirathi river to Uttarkashi. Evening Darshan at ancient Kashi Vishwanath Temple and Shakti Temple.' },
      { day: 'Day 4', title: 'Uttarkashi to Gangotri Dham & Return', desc: 'Early morning drive to Gangotri Temple. Offer holy prayers at Bhagirathi riverbank and collect holy Ganga jal.' },
      { day: 'Day 5', title: 'Uttarkashi to Guptkashi / Phata', desc: 'Scenic Himalayan transit to Guptkashi. Evening medical check-up & helicopter pass verification for Kedarnath.' },
      { day: 'Day 6', title: 'Guptkashi to Kedarnath Ji VIP Darshan', desc: 'Trek or helicopter to Kedarnath Dham. Special VIP pass entry for evening Aarti at Lord Shiva Jyotirlinga. Overnight stay at Kedarnath.' },
      { day: 'Day 7', title: 'Morning Bhasma Aarti & Return to Guptkashi', desc: 'Early morning Darshan at Kedarnath Temple, return trek down to Gaurikund and transfer to Guptkashi hotel.' },
      { day: 'Day 8', title: 'Guptkashi to Badrinath Dham', desc: 'Drive via Joshimath to Badrinath Dham. Dip in Tapt Kund thermal springs and evening Maha Aarti at Lord Vishnu Temple.' },
      { day: 'Day 9', title: 'Badrinath Mana Village & Return to Rudraprayag', desc: 'Visit Mana (First Indian Village), Vyas Gufa, and Saraswati River. Afternoon drive to Rudraprayag Sangam.' },
      { day: 'Day 10', title: 'Haridwar Ganga Aarti & Return to Delhi', desc: 'Return drive to Haridwar, attend grand Har Ki Pauri evening Ganga Aarti before return drop-off in Delhi.' },
    ],
    inclusions: [
      'Round-Trip AC Sleeper Bus Transit ex-Delhi / Haridwar',
      '9 Nights Accommodations (7 Deluxe Hotels + 2 Holy Shrine Stays)',
      '100% Pure Satvik Veg Breakfast & Dinner Daily',
      'Pre-booked VIP Darshan Line Passes for Kedarnath & Badrinath',
      'All Tolls, Driver Charges, Parking & Yatra Registration Fees',
    ],
    exclusions: ['Pony / Helicopter Charges (~₹3,000-₹7,000)', 'Personal Tipping & Laundry'],
  },
  {
    id: 'kashi-ayodhya',
    title: 'Ayodhya Ram Mandir & Kashi Corridor',
    subtitle: 'Ayodhya • Varanasi • Prayagraj Sangam',
    badge: 'Ram Lalla & Kashi Corridor Pass',
    badgeColor: 'bg-amber-600 text-white',
    duration: '4 Days / 3 Nights',
    price: '₹54,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
    transitInfo: 'Direct Luxury Volvo 2+1 AC Sleeper Coach from Nagpur, Pune & Delhi to Varanasi & Ayodhya.',
    stayInfo: '3-Star Deluxe Hotels within 1km of Ram Janmabhoomi & Kashi Vishwanath Corridor.',
    meals: 'Daily Satvik Breakfast & Banarasi Pure Veg Dinner with famous local Malaiyyo & Kachori thali.',
    highlights: [
      'Confirmed Ram Janmabhoomi Mandir Darshan Pass',
      'Kashi Vishwanath Corridor & Sugam Darshan Pass',
      'Private Wooden Boat Cruise for Dashashwamedh Ghat Ganga Aarti',
      'Prayagraj Triveni Sangam Holy Snan Boat Ride & Priest',
    ],
    shortPlan:
      'Spiritual voyage connecting Shri Ram Mandir Ayodhya, Bhagwan Shiv Kashi Vishwanath, and Triveni Sangam Prayagraj. Features direct AC sleeper coach, boat tickets for Ganga Aarti, and confirmed darshan line passes.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Ayodhya & Ram Janmabhoomi Darshan', desc: 'Land at Ayodhya Station/Airport or arrive by AC Coach. Check-in to hotel. Guided Darshan at Ram Lalla Temple, Hanumangarhi, and Saryu River Aarti.' },
      { day: 'Day 2', title: 'Ayodhya to Varanasi & Evening Ganga Aarti Boat Cruise', desc: 'Morning drive to Varanasi. Afternoon check-in. Evening private boat cruise past 84 Ghats with front-row view of Dashashwamedh Ghat Aarti.' },
      { day: 'Day 3', title: 'Kashi Vishwanath Corridor & Sarnath Excursion', desc: 'Early morning Mangala Aarti / Sugam Darshan at Kashi Vishwanath Temple, Annapurna Mandir, and Kal Bhairav. Afternoon visit to Sarnath Buddhist Stupa.' },
      { day: 'Day 4', title: 'Prayagraj Triveni Sangam Snan & Departure', desc: 'Morning drive to Prayagraj. Boat ride to Triveni Sangam for holy snan, visit Anand Bhavan and Bade Hanuman Temple before return departure.' },
    ],
    inclusions: [
      'Intercity AC Sleeper Coach Transfers',
      '3 Nights Deluxe AC Hotel Stay with Breakfast & Dinner',
      'Varanasi Ganga Aarti Boat Ticket Included',
      'Sugam Darshan & VIP Line Coordination',
    ],
    exclusions: ['Personal Ritual Offerings & Pujas', 'Local Auto Rickshaw Fares'],
  },
  {
    id: 'tirupati-south',
    title: 'Tirupati Balaji & Meenakshi Amman',
    subtitle: 'Tirupati • Madurai • Rameshwaram • Dhanushkodi',
    badge: '₹300 Seeghra Darshan & Laddu Prasadam Guaranteed',
    badgeColor: 'bg-amber-600 text-white',
    duration: '5 Days / 4 Nights',
    price: '₹56,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_11.jpg',
    transitInfo: 'Luxury Volvo AC Multi-Axle Coach ex-Bengaluru / Chennai with reserved seating.',
    stayInfo: 'Handpicked 3-Star Hotels in Tirupati, Madurai & Rameshwaram Beach Road.',
    meals: 'Authentic South Indian Pure Veg Meals served on banana leaf & 2 Tirupati Laddu Prasadam per seat.',
    highlights: [
      'Pre-booked ₹300 Seeghra Darshan Pass for Tirumala Balaji',
      'Guaranteed 2 Original Tirupati Srivari Laddus',
      'Rameshwaram 22 Holy Well (Teertham) Snan Guided Assist',
      'Madurai Meenakshi Amman Temple Night Chariot View',
    ],
    shortPlan:
      'Holy South India pilgrimage covering Lord Venkateswara at Tirupati, Lord Ramanathaswamy Jyotirlinga at Rameshwaram, and Goddess Meenakshi at Madurai. Includes pre-booked Seeghra Darshan passes and laddu prasadam.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Tirupati Tirumala Balaji Darshan', desc: 'Transfer up Tirumala Hills by special RTC coach. Special ₹300 Seeghra Darshan pass entry for Bhagwan Balaji. Collect Prasadam laddus.' },
      { day: 'Day 2', title: 'Padmavathi Temple & Drive to Madurai', desc: 'Morning Darshan at Tiruchanur Padmavathi Temple. Afternoon AC coach drive across Tamil Nadu to Madurai.' },
      { day: 'Day 3', title: 'Madurai Meenakshi Amman & Drive to Rameshwaram', desc: 'Early morning Darshan at historic Meenakshi Sundareswarar Temple. Afternoon transit over Pamban Bridge to holy island of Rameshwaram.' },
      { day: 'Day 4', title: 'Rameshwaram 22 Teertham Snan & Jyotirlinga Pooja', desc: 'Holy snan at 22 sacred wells inside Ramanathaswamy Temple, Agni Teertham beach prayer, and visit APJ Abdul Kalam Memorial.' },
      { day: 'Day 5', title: 'Dhanushkodi Border Visit & Return Departure', desc: 'Early morning 4x4 drive to Dhanushkodi beach point (Ram Setu origin point) before afternoon return transit back to Chennai/Bengaluru.' },
    ],
    inclusions: [
      'AC Volvo Coach Transit throughout South India',
      '4 Nights Hotel Stay + Daily Veg South Indian Breakfast & Dinner',
      'Confirmed ₹300 Tirupati Seeghra Darshan Pass & 2 Laddus',
      'Rameshwaram 22 Teertham Ticket Included',
    ],
    exclusions: ['Personal Temple Hair Tonsure (Mundan) Fee', 'Camera Pass Fees'],
  },
  {
    id: 'somnath-dwarka',
    title: 'Gujarat Somnath-Dwarka & Nageshwar',
    subtitle: 'Dwarkadhish • Somnath • Nageshwar • Bet Dwarka',
    badge: 'Sound & Light Show + Dhwajarohan Assist',
    badgeColor: 'bg-amber-600 text-white',
    duration: '4 Days / 3 Nights',
    price: '₹52,499',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_12.jpg',
    transitInfo: 'Luxury BharatBenz AC Coach ex-Ahmedabad / Rajkot with audio devotional player.',
    stayInfo: 'Premium Hotels within walking distance of Dwarkadhish & Somnath Sea Coast.',
    meals: 'Daily Kathiyawadi & Gujarati Pure Veg Thali (Unlimited Farsan & Sweets).',
    highlights: [
      'Somnath Temple Sound & Light Laser Show Front Tickets',
      'Bet Dwarka Boat Ferry & Rukmini Devi Temple Tour',
      'Nageshwar Jyotirlinga Rudrabhishek Pooja Assistance',
      'Porbandar Kirti Mandir (Mahatma Gandhi Birthplace) Stop',
    ],
    shortPlan:
      'Divine West Coast Yatra visiting Lord Krishna Dwarkadhish Temple, Somnath First Jyotirlinga on Arabian Sea, Nageshwar Jyotirlinga, and Bet Dwarka island ferry with verified Gujarati Satvik dining.',
    itinerary: [
      { day: 'Day 1', title: 'Ahmedabad to Dwarka & Evening Aarti', desc: 'Morning pick-up from Ahmedabad/Rajkot. Drive to holy city of Dwarka. Evening attendance at Dwarkadhish Jagat Mandir Dhwaja Aarti.' },
      { day: 'Day 2', title: 'Bet Dwarka Ferry, Nageshwar Jyotirlinga & Rukmini Temple', desc: 'Ferry ride to Bet Dwarka island, Darshan at Nageshwar Jyotirlinga, Gopi Talav, and 2,500-year-old Rukmini Devi Temple.' },
      { day: 'Day 3', title: 'Dwarka to Porbandar & Somnath Temple', desc: 'Coastal drive via Porbandar (Kirti Mandir & Sudama Temple) to Somnath. Evening VIP admission for Somnath Temple Light & Sound Show.' },
      { day: 'Day 4', title: 'Somnath Sea Snan & Return to Ahmedabad', desc: 'Morning Abhishek at Somnath Temple, Triveni Sangam snan, Bhalka Tirth (Lord Krishna swargdham), before return departure to Ahmedabad.' },
    ],
    inclusions: [
      'BharatBenz AC Coach Transit',
      '3 Nights AC Hotel Stay with Gujarati Breakfast & Thali Dinner',
      'Bet Dwarka Boat Ferry Tickets Included',
      'Somnath Sound & Light Show Entry Ticket',
    ],
    exclusions: ['Personal Abhishek Pujas', 'Auto Rickshaw to Temple Gates'],
  },
  {
    id: 'maharashtra-5jyotirlinga',
    title: 'Maharashtra 5 Jyotirlinga Circuit',
    subtitle: 'Trimbak • Bhimashankar • Grishneshwar • Aundha • Parli',
    badge: 'Complete Maharashtra Shiv Teerth',
    badgeColor: 'bg-amber-600 text-white',
    duration: '7 Days / 6 Nights',
    price: '₹64,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_6.jpg',
    transitInfo: 'Direct 2+1 AC Sleeper Coach with experienced mountain drivers & onboard devotional music.',
    stayInfo: 'Handpicked AC Hotels and Lodges near holy temple shrines with family accommodations.',
    meals: '100% Satvik Pure Veg Meals (traditional Maharashtrian dishes, Varadi thali & fasting options).',
    highlights: [
      'Complete circumambulation of all 5 Maharashtra Jyotirlingas',
      'Pre-arranged Trimbakeshwar Rudrabhishek Puja Slot',
      'Shirdi Sai Baba Samadhi Mandir VIP Darshan Pass',
      'UNESCO World Heritage Ellora Caves & Kailasa Temple Visit',
      'Experienced Hindi & Marathi Speaking Yatra Captain',
    ],
    shortPlan:
      'Complete circumambulation of all five sacred Jyotirlingas in Maharashtra with Shirdi Sai Baba darshan included. Pre-booked Rudrabhishek slots and verified Satvik pure veg meals throughout.',
    itinerary: [
      { day: 'Day 1', title: 'Pune / Mumbai to Trimbakeshwar & Nashik', desc: 'Board AC coach. Drive to Trimbakeshwar Jyotirlinga for holy darshan and Abhishek. Evening visit to Panchavati and Godavari Aarti.' },
      { day: 'Day 2', title: 'Nashik to Bhimashankar Jyotirlinga', desc: 'Early morning drive through Western Ghats to Bhimashankar Jyotirlinga. Perform special archana pooja and explore nature sanctuary.' },
      { day: 'Day 3', title: 'Bhimashankar to Shirdi Sai Samadhi', desc: 'Scenic morning transit to holy town of Shirdi. Check-in and afternoon VIP Samadhi Mandir darshan, Dwarkamai, and Chavadi.' },
      { day: 'Day 4', title: 'Shirdi to Grishneshwar & Ellora Caves', desc: 'Drive to Grishneshwar (12th Jyotirlinga). Holy Abhishek and afternoon guided tour of Ellora Caves Kailasa monolithic rock temple.' },
      { day: 'Day 5', title: 'Aurangabad to Aundha Nagnath Jyotirlinga', desc: 'Morning drive to Aundha Nagnath (associated with the Pandavas). Evening Shiv aarti and overnight stay at temple lodge.' },
      { day: 'Day 6', title: 'Aundha Nagnath to Parli Vaijnath Jyotirlinga', desc: 'Drive to Parli Vaijnath atop the hillock. Perform holy darshan and archana. Evening devotional bhajan satsang.' },
      { day: 'Day 7', title: 'Parli to Pune / Mumbai Return Transit', desc: 'Morning Maha-Prasadam followed by comfortable return coach journey back to Pune/Mumbai.' },
    ],
    inclusions: [
      'Round-Trip AC Sleeper Coach Transit',
      '6 Nights Verified AC Hotel Accommodations',
      '100% Pure Satvik Veg Breakfast & Dinner Daily',
      'Trimbakeshwar Special Rudrabhishek Assistance',
      'Shirdi Sai Baba VIP Samadhi Darshan Pass',
    ],
    exclusions: ['Personal Ritual Donations', 'Auto Rickshaw to Narrow Ghat Lanes'],
  },
  {
    id: 'shirdi-express',
    title: 'Shirdi Sai & Shani Shingnapur Express',
    subtitle: 'Shirdi Samadhi • Dwarkamai • Shani Shingnapur',
    badge: 'Samadhi Mandir Kakad Aarti Pass',
    badgeColor: 'bg-amber-600 text-white',
    duration: '2 Days / 1 Night',
    price: '₹49,999',
    perPerson: 'per person',
    image: '/images/yatra_dedicated_spiritual_yatra_sacred_darshan_booking_refined_2.jpg',
    transitInfo: 'Daily AC Express Coach ex-Pune / Mumbai / Nashik with comfortable pushback seats.',
    stayInfo: 'Verified AC Hotel located 100 meters walking distance from Shirdi Gate No. 2 with 6:00 AM early check-in.',
    meals: 'Daily Satvik Breakfast + Deluxe Buffet Dinner (No onion, no garlic options available).',
    highlights: [
      'Guaranteed Early Morning Samadhi Mandir Kakad Aarti Line Entry',
      'Hotel within 100m of Gate No. 2 (No local travel needed)',
      'Dwarkamai, Chavadi, Gurusthan & Lendi Baug Guided Walk',
      'Afternoon AC Transfer to Shani Shingnapur with Mustard Oil Pooja',
      'Guaranteed 6:00 AM Early Morning Check-in',
    ],
    shortPlan:
      'Short devotional getaway: Guaranteed morning Kakad Aarti entry pass, 100m walking-distance hotel from Gate No 2, early check-in, and holy mustard oil pooja coordination at Shani Shingnapur.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Shirdi & Afternoon Darshan', desc: 'Morning pickup from Pune/Mumbai/Nashik. 6 AM early check-in at hotel near Gate 2. Afternoon visit to Dwarkamai, Chavadi & Gurusthan with special evening Aarti.' },
      { day: 'Day 2', title: 'Kakad Aarti, Shani Shingnapur & Departure', desc: '5:00 AM guaranteed Kakad Aarti / Samadhi Darshan line assistance. Post breakfast, AC coach drive to Shani Shingnapur for oil pooja before evening return journey.' },
    ],
    inclusions: [
      'Intercity AC Express Coach Transfers',
      '1 Night AC Hotel Stay (100m from Gate No. 2) with 6 AM Check-in',
      'Satvik Breakfast & Deluxe Dinner Buffet',
      'Kakad Aarti Coordination & Line Assistance',
      'Shani Shingnapur Excursion & Pooja Coordination',
    ],
    exclusions: ['Personal Temple Donation Receipts', 'Special Puja Offerings'],
  },
];

export default function SpiritualPackages() {
  const [mounted, setMounted] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [sheetState, setSheetState] = useState('expanded'); // 'collapsed' | 'expanded'
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isClosing, setIsClosing] = useState(false);
  const [cardScrollTop, setCardScrollTop] = useState(0);
  const packages = spiritualData;

  const cardContainerRef = useRef(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPkg) {
        handleCloseSheet();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPkg]);

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
    setSheetState('expanded');
    setActiveTab('itinerary');
    setIsClosing(false);
    setCardScrollTop(0);
  };

  const handleCloseSheet = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPkg(null);
      setSheetState('expanded');
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
    <section className="w-full py-16 bg-amber-50/40 border-b border-amber-200/60 scroll-mt-28 sm:scroll-mt-32" id="spiritualPackagesSection">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <span className="material-symbols-outlined text-[16px]">temple_hindu</span>
              PILGRIMAGE &amp; DIVINE DARSHAN
            </div>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-spiritual font-normal not-italic">
              Curated Spiritual Darshan Circuits
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Fully managed multi-day spiritual journeys across India with AC coach transit, verified temple accommodations, VIP Darshan line coordination, and pure Satvik meals. Click any card to preview.
            </p>
          </div>
          <div>
            <a
              className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
              href="/spiritual"
            >
              <span>Explore all Devsthan Circuits</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleOpenSheet(pkg)}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-amber-200 transition-all duration-300 flex flex-col group cursor-pointer active:scale-[0.99]"
            >
              <div className="relative h-28 sm:h-40 md:h-48 w-full overflow-hidden bg-slate-100">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pkg.image}
                />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg bg-amber-600 text-white font-bold text-[9px] sm:text-xs">
                  {pkg.duration}
                </span>
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950/80 text-white text-[9px] sm:text-xs font-medium truncate flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-amber-400">temple_hindu</span>
                  <span className="truncate">{pkg.subtitle}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs font-bold text-amber-700 mb-0.5 sm:mb-1 truncate">
                    <span className="material-symbols-outlined text-[13px] sm:text-[15px] shrink-0">verified</span>
                    <span className="truncate">{pkg.badge}</span>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold font-serif text-slate-900 mb-1 sm:mb-1.5 group-hover:text-amber-700 transition-colors line-clamp-1 sm:line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed mb-1.5 sm:mb-3 line-clamp-1 sm:line-clamp-2">
                    {pkg.shortPlan}
                  </p>
                  <div className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800 font-semibold mb-3">
                    Includes: Stay + Bus + VIP Pass + Satvik Meals
                  </div>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 block font-medium">Starts at</span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-sm sm:text-xl font-extrabold text-slate-900">{pkg.price}</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-400">/person</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSheet(pkg);
                    }}
                    className="px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs rounded-lg sm:rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-bold shadow-sm transition-all shrink-0"
                    type="button"
                  >
                    View &amp; Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SPIRITUAL DARSHAN 2D EXPANSION & 82.5% VH SCROLL CARD SHEET
         ========================================================================= */}
      {selectedPkg && mounted && createPortal(
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={handleCloseSheet}
        >
          {/* Floating Card Container */}
          <div
            ref={cardContainerRef}
            onClick={(e) => e.stopPropagation()}
            onScroll={handleScroll}
            className={`bg-white rounded-3xl shadow-2xl border border-amber-200/80 transition-all duration-300 flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            {/* STICKY PARALLAX HERO IMAGE HEADER */}
            <div className="sticky top-0 z-10 w-full overflow-hidden bg-slate-900 shrink-0 h-64 sm:h-72 md:h-80 rounded-t-3xl">
              <img
                src={selectedPkg.image}
                alt={selectedPkg.title}
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
                <p className="text-xs sm:text-sm text-amber-200 font-semibold truncate mt-1 drop-shadow">
                  🛕 {selectedPkg.subtitle}
                </p>
              </div>
            </div>

            {/* CONTENT SHEET BELOW IMAGE */}
            <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(15,23,42,0.12)] border-t border-amber-100 mt-0 p-4 sm:p-5 flex flex-col justify-between">
              {/* Quick Info Header Bar: Price & Book Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 mb-3 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                    All-Inclusive Devsthan Package
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{selectedPkg.price}</span>
                    <span className="text-[11px] font-medium text-slate-500">/ person</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/customize-package/${selectedPkg.id || 'chardham'}`}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">tune</span>
                    <span>Customize</span>
                  </a>
                  <a
                    href={`/packages/checkout?package=${selectedPkg.id || 'chardham'}`}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Yatra</span>
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-[11px] font-semibold border border-amber-200/60"
                    >
                      <span className="material-symbols-outlined text-[13px] text-amber-600">verified</span>
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
                      <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[10px]">
                        {selectedPkg.itinerary[0].day}
                      </span>
                      <span className="font-bold text-slate-900 truncate">{selectedPkg.itinerary[0].title}</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      +{selectedPkg.itinerary.length - 1} More Days
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 text-[11px]">{selectedPkg.itinerary[0].desc}</p>
                </div>
              )}

              {/* SCROLL UP TO SCALE PROMPT */}
              {sheetState === 'collapsed' ? (
                <div
                  onClick={handleExpandFullWindow}
                  className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between cursor-pointer group bg-gradient-to-r from-amber-50 via-amber-50/50 to-white px-4 py-2 rounded-2xl border border-amber-200/80 transition-all shadow-sm shrink-0"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span className="material-symbols-outlined text-[18px] text-amber-600 animate-bounce">
                      arrow_upward
                    </span>
                    <span>Scroll down or tap to expand (80% Width × 82.5% Height)</span>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-extrabold group-hover:scale-105 transition-transform shadow-sm">
                    EXPAND YATRA
                  </span>
                </div>
              ) : (
                /* TABBED SYSTEM FOR SPIRITUAL CIRCUIT */
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-6">
                  {/* Tab Navigation Switcher */}
                  <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1 font-bold text-xs">
                    <button
                      onClick={() => setActiveTab('itinerary')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'itinerary'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>Day-by-Day Yatra Plan ({selectedPkg.itinerary.length} Days)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'summary'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">temple_hindu</span>
                      <span>Short Summary &amp; Stays</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inclusions')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'inclusions'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Inclusions &amp; VIP Pass</span>
                    </button>
                  </div>

                  {/* TAB 1: COMPLETE DAY-BY-DAY DETAILED ITINERARY */}
                  {activeTab === 'itinerary' && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-serif">
                        Complete Day-by-Day Spiritual Itinerary ({selectedPkg.duration})
                      </h3>
                      {selectedPkg.itinerary.map((dayItem, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs sm:text-sm flex flex-col sm:flex-row gap-3.5 items-start hover:border-amber-400 transition-colors"
                        >
                          <span className="px-3 py-1 rounded-xl bg-amber-600 text-white font-extrabold text-xs shrink-0">
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
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <h4 className="text-sm font-bold text-amber-900 mb-2 font-serif flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">temple_hindu</span>
                          <span>Spiritual Yatra Summary</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed mb-3">{selectedPkg.shortPlan}</p>

                        <div className="space-y-2 text-xs text-amber-900 pt-2 border-t border-amber-200/60">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">directions_bus</span>
                            <span><strong>AC Bus Transit:</strong> {selectedPkg.transitInfo}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">restaurant</span>
                            <span><strong>Meals:</strong> {selectedPkg.meals}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">hotel</span>
                            <span><strong>Accommodations:</strong> {selectedPkg.stayInfo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: INCLUSIONS & VIP PASS */}
                  {activeTab === 'inclusions' && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-900 text-white">
                        <h4 className="text-sm font-bold text-amber-300 mb-3 font-serif flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>What is Included in Your Devsthan Yatra</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                          {selectedPkg.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[16px] text-amber-400 shrink-0 mt-0.5">check_circle</span>
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedPkg.exclusions && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950">
                          <h4 className="font-bold mb-2 text-red-900 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-red-600">cancel</span>
                            <span>Yatra Exclusions</span>
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
        </div>,
        document.body
      )}
    </section>
  );
}
