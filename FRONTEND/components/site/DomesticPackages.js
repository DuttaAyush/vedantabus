'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const domesticData = [
  {
    id: 'himachal-manali',
    title: 'Himachal Snow Valley & Rohtang Pass',
    subtitle: 'Shimla • Kullu • Manali • Solang • Rohtang',
    badge: 'Atal Tunnel & Solang Snow Pass Included',
    badgeColor: 'bg-emerald-600 text-white',
    duration: '5 Days / 4 Nights',
    price: '₹54,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_13.jpg',
    transitInfo: 'Direct Luxury Volvo AC Sleeper Coach ex-Delhi / Chandigarh with charging points & blanket.',
    stayInfo: '4-Star Mountain View Resort in Manali with private balcony & bonfire evening.',
    meals: 'Daily Buffet Breakfast & Chef-Special North Indian Dinner included.',
    highlights: [
      'Solang Valley Snow Sports & Cable Car Pass',
      'Rohtang Pass Permit Assistance & Sightseeing',
      'Kullu Valley River Rafting & Shawl Factory Visit',
      'Hadimba Temple, Mall Road & Vashisht Hot Springs Tour',
    ],
    shortPlan:
      'Rejuvenating mountain retreat through the snow-capped Himalayas. Features Volvo AC sleeper coach travel, Solang Valley adventure sports, Rohtang Pass permits, and luxury hill resort stays.',
    itinerary: [
      { day: 'Day 1', title: 'Overnight Volvo Coach ex-Delhi to Manali', desc: 'Evening board luxury Volvo AC sleeper coach from Majnu Ka Tilla Delhi / Chandigarh. Overnight scenic mountain highway travel.' },
      { day: 'Day 2', title: 'Arrival in Manali & Local Sightseeing', desc: 'Morning arrival & check-in to 4★ resort. Afternoon visit to Hadimba Devi Temple, Vashisht Hot Springs, and Mall Road shopping.' },
      { day: 'Day 3', title: 'Solang Valley & Rohtang Pass Excursion', desc: 'Full day excursion to Solang Valley for paragliding, zorbing, ropeway, and snow activity experience at Rohtang Pass.' },
      { day: 'Day 4', title: 'Kullu Valley Rafting & Naggar Castle', desc: 'Guided tour to Naggar Castle art gallery, Beas River rafting point in Kullu, and local handicraft market.' },
      { day: 'Day 5', title: 'Free Morning & Return Volvo to Delhi', desc: 'Morning breakfast & souvenir shopping at Tibetan Market before evening boarding Volvo coach for return journey.' },
    ],
    inclusions: [
      'Round-Trip Volvo AC Sleeper Bus Tickets ex-Delhi',
      '3 Nights 4-Star Resort Stay in Manali',
      'Daily Buffet Breakfast & Dinner',
      'Solang Valley & Kullu Sightseeing Transfers',
    ],
    exclusions: ['Rohtang NGT Permit Fee (~₹600)', 'Adventure Sports Tickets'],
  },
  {
    id: 'kerala-backwaters',
    title: 'Kerala Backwaters & Munnar Tea Trails',
    subtitle: 'Kochi • Munnar Hills • Alleppey Backwaters • Fort Kochi',
    badge: 'Private AC Houseboat & Tea Trails',
    badgeColor: 'bg-emerald-600 text-white',
    duration: '5 Days / 4 Nights',
    price: '₹58,500',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_14.jpg',
    transitInfo: 'Private AC Highway Coach ex-Kochi / Madurai with English & Malayalam speaking driver.',
    stayInfo: '2 Nights Tea Garden Resort in Munnar + 1 Night Deluxe Alleppey Houseboat + 1 Night Kochi Hotel.',
    meals: 'Daily Breakfast & Traditional Malabar Fish/Veg Meals cooked fresh on Houseboat.',
    highlights: [
      'Private Alleppey Houseboat Cruise with Chef on board',
      'Munnar Tea Plantation, Eravikulam National Park & Mattupetty Dam',
      'Spice Plantation Tour & Kathakali Cultural Dance Show',
      'Kochi Fort & Chinese Fishing Nets Walking Tour',
    ],
    shortPlan:
      'Experience God’s Own Country with mist-covered tea gardens in Munnar and private luxury houseboat cruise along Alleppey backwaters. Includes all transfers, meals, and cultural shows.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival Kochi & Drive to Munnar Hills', desc: 'Welcome at Kochi Airport/Station. Scenic drive through Cheeyappara waterfalls to Munnar. Evening tea garden walk.' },
      { day: 'Day 2', title: 'Munnar Full Day Nature & Wildlife Tour', desc: 'Visit Eravikulam National Park (Nilgiri Tahr), Mattupetty Dam, Echo Point, and Tea Museum with tea tasting session.' },
      { day: 'Day 3', title: 'Munnar to Alleppey Houseboat Check-in', desc: 'Drive to Alleppey. Check-in to private deluxe houseboat at 12:00 PM. Cruise through narrow canals with traditional Malabar lunch & dinner.' },
      { day: 'Day 4', title: 'Alleppey to Fort Kochi Heritage Tour', desc: 'Disembark houseboat after breakfast. Drive to Fort Kochi to explore St. Francis Church, Jewish Synagogue, and Chinese Nets.' },
      { day: 'Day 5', title: 'Shopping at Marine Drive & Departure', desc: 'Souvenir shopping for banana chips & authentic spices before departure airport drop-off.' },
    ],
    inclusions: [
      'Private AC Coach Transfers throughout Kerala',
      '1 Night Deluxe Houseboat Stay + 3 Nights 4★ Resort Stays',
      'All Meals on Houseboat (Lunch, Dinner, Breakfast)',
      'Kathakali Dance Show Entry Pass',
    ],
    exclusions: ['Boating Fees at Mattupetty Dam', 'Personal Tipping'],
  },
  {
    id: 'goa-coastal',
    title: 'Goa Coastal & Heritage Villa / Watersports',
    subtitle: 'Calangute • Baga • Mandovi Cruise • Aguada',
    badge: 'Beachfront Villa & Sunset Cruise',
    badgeColor: 'bg-emerald-600 text-white',
    duration: '4 Days / 3 Nights',
    price: '₹51,999',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_15.jpg',
    transitInfo: 'Direct Luxury Sleeper Coach ex-Mumbai, Pune & Bengaluru directly to Panjim/Mapusa.',
    stayInfo: '4-Star Beachside Resort with Swimming Pool & 5min walk to Calangute Beach.',
    meals: 'Daily Buffet Breakfast + Welcome Drink & Dinner Pass included.',
    highlights: [
      '5-in-1 Water Sports Combo (Parasailing, Jet Ski, Banana Ride, Bumper, Speedboat)',
      'Complimentary Sunset Cruise on Mandovi River with Goan Folk Dance',
      'North Goa Beach Tour (Baga, Anjuna, Aguada Fort)',
      'South Goa Heritage Tour (Basilica of Bom Jesus & Mangueshi Temple)',
    ],
    shortPlan:
      'Ultimate beach vacation in Goa featuring 4-star pool resort, water sports combo ticket, Mandovi sunset cruise, and comfortable sleeper coach transit from major cities.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival Goa & Beach Sunset Relaxation', desc: 'Arrive via direct coach. Resort check-in & welcome drink. Relax at Calangute beach and night shacks.' },
      { day: 'Day 2', title: 'North Goa Beaches & Fort Aguada', desc: 'Explore 17th-century Fort Aguada, Sinquerim Beach, Baga Beach, Anjuna Beach, and Tito’s Lane nightlife.' },
      { day: 'Day 3', title: 'Water Sports Day & Mandovi River Cruise', desc: 'Morning water sports combo at Calangute beach. Evening 1-hour Mandovi river sunset cruise with live DJ.' },
      { day: 'Day 4', title: 'Old Goa Churches & Return Departure', desc: 'Visit Basilica of Bom Jesus UNESCO site, Se Cathedral, and Panjim casino road before evening coach departure.' },
    ],
    inclusions: [
      'Round-Trip AC Sleeper Coach Tickets',
      '3 Nights 4-Star Beach Resort Stay with Pool',
      'Daily Buffet Breakfast',
      'Mandovi Sunset Cruise Pass & Water Sports Combo',
    ],
    exclusions: ['Personal Casino Chips & Drinks', 'Scooter Rental Fuel'],
  },
  {
    id: 'corbett-nainital',
    title: 'Jim Corbett Safari & Nainital Lake',
    subtitle: 'Dhikala Tiger Zone • Naini Lake • Bhimtal',
    badge: 'Open 4x4 Jeep Safari Included',
    badgeColor: 'bg-emerald-600 text-white',
    duration: '4 Days / 3 Nights',
    price: '₹52,499',
    perPerson: 'per person',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_16.jpg',
    transitInfo: 'Comfortable AC Coach ex-Delhi / NCR with mountain route experienced driver.',
    stayInfo: '2 Nights Jungle Lodge at Ramnagar Corbett + 1 Night Lake View Hotel in Nainital.',
    meals: 'Daily Buffet Breakfast & Chef’s Special Buffet Dinner included.',
    highlights: [
      '4x4 Open Jeep Tiger Safari in Corbett Core/Buffer Zone',
      'Corbett Waterfalls & Garjiya Devi Temple Visit',
      'Naini Lake Boat Ride & Cable Car Ropeway Pass',
      'Mall Road Shopping & Snow View Point Excursion',
    ],
    shortPlan:
      'Action-packed wildlife adventure combined with serene hill station lake boating. Features open Gypsy tiger safari in Jim Corbett National Park and lake view resort in Nainital.',
    itinerary: [
      { day: 'Day 1', title: 'Delhi to Jim Corbett Jungle Resort', desc: 'Morning departure by AC coach from Delhi to Ramnagar Corbett. Resort check-in, poolside relaxation & evening bonfire.' },
      { day: 'Day 2', title: 'Early Morning 4x4 Jeep Safari & Drive to Nainital', desc: '5:30 AM open Gypsy jeep tiger safari in Corbett zone. Return for breakfast, visit Corbett Falls, then drive up to Nainital.' },
      { day: 'Day 3', title: 'Nainital Lake Boating & Ropeway Tour', desc: 'Boating on Naini Lake, visit Naina Devi Temple, Tiffin Top, and take cable car ropeway to Snow View Point.' },
      { day: 'Day 4', title: 'Bhimtal Lake Visit & Return to Delhi', desc: 'Check-out, visit Bhimtal & Sattal lakes before afternoon return coach ride back to Delhi.' },
    ],
    inclusions: [
      'AC Highway Coach Transfers ex-Delhi',
      '3 Nights Hotel & Jungle Resort Accommodations',
      '1 Confirmed 4x4 Open Jeep Safari Ticket & Permit',
      'Naini Lake Boating Pass & Daily Breakfast & Dinner',
    ],
    exclusions: ['Jeep Safari Camera Permits', 'Personal Expenses'],
  },
];

export default function DomesticPackages() {
  const [mounted, setMounted] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [sheetState, setSheetState] = useState('expanded');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isClosing, setIsClosing] = useState(false);
  const [cardScrollTop, setCardScrollTop] = useState(0);
  const packages = domesticData;

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
    <section className="w-full py-16 bg-white border-b border-slate-200 scroll-mt-28 sm:scroll-mt-32 [content-visibility:auto] [contain-intrinsic-size:auto_700px]" id="domesticPackagesSection">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <span className="material-symbols-outlined text-[16px]">landscape</span>
              WEEKEND ESCAPES &amp; SAFARIS
            </div>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-serif font-semibold">
              Curated Leisure &amp; Holiday Tours
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Handcrafted all-inclusive domestic holidays, hill stations, coastal escapes, and wildlife sanctuaries across India with luxury bus transit and boutique stays. Click any card to preview.
            </p>
          </div>
          <div>
            <a
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              href="/domestic"
            >
              <span>View all holiday getaways</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleOpenSheet(pkg)}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col group cursor-pointer active:scale-[0.99]"
            >
              <div className="relative h-28 sm:h-40 md:h-48 w-full overflow-hidden bg-slate-100">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pkg.image}
                />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg bg-slate-900/80 text-white font-bold text-[9px] sm:text-xs">
                  {pkg.duration}
                </span>
                <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-950/80 text-white text-[9px] sm:text-xs font-medium truncate flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-emerald-400">landscape</span>
                  <span className="truncate">{pkg.subtitle}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] sm:text-xs font-bold text-emerald-600 block mb-0.5 sm:mb-1 truncate">{pkg.badge}</span>
                  <h3 className="text-xs sm:text-base font-bold font-serif text-slate-900 mb-1 sm:mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1 sm:line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-snug sm:leading-relaxed mb-1.5 sm:mb-3 line-clamp-1 sm:line-clamp-2">{pkg.shortPlan}</p>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 block font-medium">Package from</span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-sm sm:text-xl font-extrabold text-brand-scarlet">{pkg.price}</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-400">/person</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSheet(pkg);
                    }}
                    className="px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs rounded-lg sm:rounded-xl bg-slate-900 hover:bg-brand-scarlet text-white font-bold transition-colors shrink-0"
                    type="button"
                  >
                    Explore Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          DOMESTIC HOLIDAY 2D EXPANSION & 82.5% VH SCROLL CARD SHEET
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
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 transition-all duration-300 flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] ${
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

              {/* Controls Bar */}
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
                <p className="text-xs sm:text-sm text-emerald-200 font-semibold truncate mt-1 drop-shadow">
                  🏔️ {selectedPkg.subtitle}
                </p>
              </div>
            </div>

            {/* CONTENT SHEET BELOW IMAGE */}
            <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(15,23,42,0.12)] border-t border-slate-100 mt-0 p-4 sm:p-5 flex flex-col justify-between">
              {/* Quick Info Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 mb-3 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                    All-Inclusive Holiday Rate
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
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-semibold border border-emerald-200/60"
                    >
                      <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
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
                      <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-extrabold text-[10px]">
                        {selectedPkg.itinerary[0].day}
                      </span>
                      <span className="font-bold text-slate-900 truncate">{selectedPkg.itinerary[0].title}</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      +{selectedPkg.itinerary.length - 1} More Days
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 text-[11px]">{selectedPkg.itinerary[0].desc}</p>
                </div>
              )}

              {/* SCROLL PROMPT */}
              {sheetState === 'collapsed' ? (
                <div
                  onClick={handleExpandFullWindow}
                  className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between cursor-pointer group bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white px-4 py-2 rounded-2xl border border-emerald-200/80 transition-all shadow-sm shrink-0"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 animate-bounce">
                      arrow_upward
                    </span>
                    <span>Scroll down or tap to expand (80% Width × 82.5% Height)</span>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold group-hover:scale-105 transition-transform shadow-sm">
                    EXPAND TOUR
                  </span>
                </div>
              ) : (
                /* TABBED SYSTEM FOR DOMESTIC HOLIDAY */
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-6">
                  {/* Tab Navigation Switcher */}
                  <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1 font-bold text-xs">
                    <button
                      onClick={() => setActiveTab('itinerary')}
                      className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'itinerary'
                          ? 'bg-emerald-600 text-white shadow-md'
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
                          ? 'bg-emerald-600 text-white shadow-md'
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
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Inclusions &amp; Bus Transit</span>
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
                          className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 text-xs sm:text-sm flex flex-col sm:flex-row gap-3.5 items-start hover:border-emerald-400 transition-colors"
                        >
                          <span className="px-3 py-1 rounded-xl bg-emerald-700 text-white font-extrabold text-xs shrink-0">
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
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <h4 className="text-sm font-bold text-emerald-900 mb-2 font-serif flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">landscape</span>
                          <span>Holiday Getaway Overview</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed mb-3">{selectedPkg.shortPlan}</p>

                        <div className="space-y-2 text-xs text-emerald-900 pt-2 border-t border-emerald-200/60">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">directions_bus</span>
                            <span><strong>Bus Transit:</strong> {selectedPkg.transitInfo}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">restaurant</span>
                            <span><strong>Meals:</strong> {selectedPkg.meals}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">hotel</span>
                            <span><strong>Resort Stays:</strong> {selectedPkg.stayInfo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: INCLUSIONS */}
                  {activeTab === 'inclusions' && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-900 text-white">
                        <h4 className="text-sm font-bold text-amber-300 mb-3 font-serif flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>What is Included in Your Holiday</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                          {selectedPkg.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0 mt-0.5">check_circle</span>
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
        </div>,
        document.body
      )}
    </section>
  );
}
