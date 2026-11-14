'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DatePickerPopover from '@/components/ui/DatePickerPopover';

const internationalPackagesList = [
  { id: 'dubai-safari', title: 'Dubai Desert Safari & Marina Skyline', duration: '5 Days / 4 Nights', price: '₹48,999', badge: 'Best Seller', highlight: 'Burj Khalifa • Desert Camp • Marina Cruise' },
  { id: 'dubai-luxury', title: 'Dubai Luxury Dunes & Atlantis Aquaventure', duration: '6 Days / 5 Nights', price: '₹54,999', badge: 'Luxury Stays', highlight: 'Atlantis Palm • Private Yacht • Safari' },
  { id: 'singapore-wonders', title: 'Singapore Wonders & Sentosa Island', duration: '5 Days / 4 Nights', price: '₹62,500', badge: 'Family Favorite', highlight: 'Universal Studios • Marina Bay • Cable Car' },
  { id: 'thailand-bangkok', title: 'Thailand Bangkok & Pattaya Beach Resort', duration: '5 Days / 4 Nights', price: '₹36,999', badge: 'Island Tour', highlight: 'Coral Island • Chao Phraya Dinner Cruise' },
  { id: 'bali-paradise', title: 'Bali Tropical Paradise & Ubud Swing', duration: '6 Days / 5 Nights', price: '₹42,500', badge: 'Couples & Honeymoon', highlight: 'Kintamani Volcano • Tanah Lot Sunset' },
  { id: 'vietnam-scenic', title: 'Vietnam Scenic Da Nang & Halong Bay Cruise', duration: '6 Days / 5 Nights', price: '₹45,999', badge: 'UNESCO Heritage', highlight: 'Golden Bridge • Halong Overnight Luxury Cruise' },
  { id: 'europe-swiss', title: 'Europe Grand Swiss Alps & Paris Tour', duration: '8 Days / 7 Nights', price: '₹1,45,000', badge: 'Grand European', highlight: 'Mt Titlis • Eiffel Tower • Seine River Cruise' },
  { id: 'maldives-luxury', title: 'Maldives Luxury Overwater Pool Villa', duration: '4 Days / 3 Nights', price: '₹78,500', badge: 'All-Inclusive', highlight: 'Seaplane Transfer • Snorkeling Safari • Private Dining' },
  { id: 'malaysia-kl', title: 'Malaysia Kuala Lumpur & Genting Highlands', duration: '4 Days / 3 Nights', price: '₹34,999', badge: 'City & Casino', highlight: 'Batu Caves • Cable Car • Petronas Towers' },
];

const internationalDepartureAirports = [
  { code: 'BOM', city: 'Mumbai', desc: 'Chhatrapati Shivaji Maharaj T2' },
  { code: 'DEL', city: 'Delhi', desc: 'Indira Gandhi International T3' },
  { code: 'BLR', city: 'Bengaluru', desc: 'Kempegowda International T2' },
  { code: 'HYD', city: 'Hyderabad', desc: 'Rajiv Gandhi International' },
  { code: 'AMD', city: 'Ahmedabad', desc: 'Sardar Vallabhbhai Patel' },
  { code: 'NAG', city: 'Nagpur', desc: 'Dr. Babasaheb Ambedkar' },
];

export default function InternationalHero() {
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const [destination, setDestination] = useState('Dubai & Abu Dhabi');
  const [departureFrom, setDepartureFrom] = useState('Mumbai (BOM)');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [passengers, setPassengers] = useState(2);
  const [selectedDate, setSelectedDate] = useState({
    mainText: 'Nov - Dec 2026',
    subText: 'Holiday Season'
  });
  const [scrollScale, setScrollScale] = useState(1);
  const [textY, setTextY] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDestinationOpen(false);
        setIsDepartureOpen(false);
        setIsPassengerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const calculatedScale = 1 + Math.min(Math.max(scrollY, 0) / 800, 1) * 0.25;
          const calculatedY = Math.min(Math.max(scrollY, 0) * 0.35, 150);
          const calculatedOpacity = Math.max(1 - Math.max(scrollY, 0) / 550, 0);

          setScrollScale(calculatedScale);
          setTextY(calculatedY);
          setTextOpacity(calculatedOpacity);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDateSelect = (dateResult) => {
    setSelectedDate({
      mainText: dateResult.mainText,
      subText: dateResult.subText
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = destination.trim() || 'Dubai';
    router.push(`/packages?category=International&q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* 1. REFRESHING SUNLIT OCEAN HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24 pt-12 sticky top-0 z-0" id="hero">
        <div className="absolute inset-0 z-0">
          <img
            alt="Breathtaking sunlit turquoise ocean and mountains"
            className="w-full h-full object-cover object-center will-change-transform transition-transform duration-100 ease-out"
            style={{ transform: `scale(${scrollScale})` }}
            src="/images/yatra_international_holiday_travel_packages_1.jpg"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-teal-900/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div
            style={{
              transform: `translateY(${isLoaded ? textY * 0.7 : 20}px)`,
              opacity: isLoaded ? textOpacity : 0,
              transition: isLoaded && textY > 0
                ? 'transform 0.1s ease-out, opacity 0.1s ease-out'
                : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, opacity 0.8s ease-out 0.05s'
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-200 font-bold text-xs uppercase tracking-wider mb-4 border border-teal-400/30 shadow-lg shadow-teal-950/40"
          >
            <span className="material-symbols-outlined text-[16px] text-teal-300">flight_takeoff</span>
            WORLDWIDE CURATED HOLIDAY PACKAGES
          </div>

          <h1
            style={{
              transform: `translateY(${isLoaded ? textY : 35}px)`,
              opacity: isLoaded ? textOpacity : 0,
              transition: isLoaded && textY > 0
                ? 'transform 0.1s ease-out, opacity 0.1s ease-out'
                : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 0.9s ease-out 0.2s'
            }}
            className="text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-4 max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] font-serif font-medium"
          >
            Travel the World in <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-100 bg-clip-text text-transparent font-serif font-medium">Unmatched Comfort</span>
          </h1>

          <p
            style={{
              transform: `translateY(${isLoaded ? textY * 0.85 : 35}px)`,
              opacity: isLoaded ? textOpacity : 0,
              transition: isLoaded && textY > 0
                ? 'transform 0.1s ease-out, opacity 0.1s ease-out'
                : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, opacity 0.9s ease-out 0.35s'
            }}
            className="text-base md:text-lg text-teal-100/90 max-w-2xl mx-auto mb-8 font-medium drop-shadow-md leading-relaxed"
          >
            All-inclusive international journeys with flights, 4★ &amp; 5★ hotels, guided tours, and guaranteed Indian vegetarian dining worldwide.
          </p>

          <div
            style={{
              transform: `translateY(${isLoaded ? textY * 0.7 : 35}px)`,
              opacity: isLoaded ? textOpacity : 0,
              transition: isLoaded && textY > 0
                ? 'transform 0.1s ease-out, opacity 0.1s ease-out'
                : 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, opacity 0.9s ease-out 0.45s'
            }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-teal-200/90"
          >
            <div className="flex items-center gap-1.5 bg-slate-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-500/20">
              <span className="text-teal-400">✓</span> Return Flights &amp; Express Visas Included
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-500/20">
              <span className="text-teal-400">✓</span> 100% Guaranteed Indian &amp; Jain Meals
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-500/20">
              <span className="text-teal-400">✓</span> Hindi &amp; English Speaking Tour Managers
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING SEARCH BAR */}
      <div className="relative z-20 mx-auto px-4 sm:px-6 -mt-14 mb-12 max-w-7xl lg:px-8 w-full">
        <div ref={searchContainerRef} className="bg-white rounded-3xl shadow-2xl p-3 md:p-4 border border-slate-200/80 relative z-30">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* 1. DESTINATION / PACKAGE SELECTOR */}
            <div className="relative md:col-span-4 flex items-center bg-slate-50 rounded-2xl px-3.5 py-2.5 border border-slate-200 focus-within:border-teal-600 transition-colors">
              <span className="material-symbols-outlined text-teal-600 text-[20px] mr-2.5 shrink-0">flight_takeoff</span>
              <div className="flex-1 min-w-0 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Curated Package / Destination</label>
                <input
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none truncate"
                  placeholder="Select Package (Dubai, Bali, Singapore...)"
                  type="text"
                  value={destination}
                  onFocus={() => {
                    setIsDestinationOpen(true);
                    setIsDepartureOpen(false);
                    setIsPassengerOpen(false);
                    setIsDatePickerOpen(false);
                  }}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setIsDestinationOpen(true);
                  }}
                />
              </div>

              {/* PACKAGE AUTOCOMPLETE DROPDOWN */}
              {isDestinationOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 p-2 z-50 text-left animate-fadeIn"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span>Available International Tours</span>
                    <span className="text-[9px] text-slate-400">All-Inclusive</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 space-y-1 custom-scrollbar">
                    {internationalPackagesList
                      .filter(p =>
                        p.title.toLowerCase().includes(destination.toLowerCase().trim()) ||
                        p.highlight.toLowerCase().includes(destination.toLowerCase().trim())
                      )
                      .map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            setDestination(pkg.title);
                            setIsDestinationOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                            destination.toLowerCase() === pkg.title.toLowerCase()
                              ? 'bg-teal-50 text-teal-900 border border-teal-200'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-xs truncate">{pkg.title}</div>
                            <div className="text-[10px] text-slate-500 truncate">{pkg.highlight}</div>
                            <div className="text-[9px] text-teal-600 font-semibold mt-0.5">{pkg.duration}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-extrabold text-teal-700 block">{pkg.price}</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-teal-100/80 text-teal-800">{pkg.badge}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. DEPARTURE AIRPORT */}
            <div className="relative md:col-span-3 flex items-center bg-slate-50 rounded-2xl px-3.5 py-2.5 border border-slate-200 focus-within:border-teal-600 transition-colors">
              <span className="material-symbols-outlined text-teal-600 text-[20px] mr-2.5 shrink-0">connecting_airports</span>
              <div className="flex-1 min-w-0 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Departure Hub</label>
                <input
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none truncate"
                  type="text"
                  value={departureFrom}
                  onFocus={() => {
                    setIsDepartureOpen(true);
                    setIsDestinationOpen(false);
                    setIsPassengerOpen(false);
                    setIsDatePickerOpen(false);
                  }}
                  onChange={(e) => {
                    setDepartureFrom(e.target.value);
                    setIsDepartureOpen(true);
                  }}
                />
              </div>

              {/* DEPARTURE AIRPORT DROPDOWN */}
              {isDepartureOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 p-2 z-50 text-left animate-fadeIn"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 px-3 py-1.5 border-b border-slate-100">
                    Direct International Flights
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
                    {internationalDepartureAirports
                      .filter(a => a.city.toLowerCase().includes(departureFrom.toLowerCase().trim()) || a.code.toLowerCase().includes(departureFrom.toLowerCase().trim()))
                      .map((apt) => (
                        <button
                          key={apt.code}
                          type="button"
                          onClick={() => {
                            setDepartureFrom(`${apt.city} (${apt.code})`);
                            setIsDepartureOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            departureFrom.includes(apt.code)
                              ? 'bg-teal-50 text-teal-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="block text-xs font-bold text-slate-900">{apt.city} ({apt.code})</span>
                            <span className="text-[10px] text-slate-400">{apt.desc}</span>
                          </div>
                          <span className="text-[10px] font-mono text-teal-600 font-bold">✈</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. TRAVEL DATES PICKER */}
            <div
              className="md:col-span-2 flex items-center bg-slate-50 rounded-2xl px-3.5 py-2.5 border border-slate-200 focus-within:border-teal-600 transition-colors cursor-pointer relative select-none"
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);
                setIsDestinationOpen(false);
                setIsDepartureOpen(false);
                setIsPassengerOpen(false);
              }}
            >
              <span className="material-symbols-outlined text-teal-600 text-[20px] mr-2 shrink-0">calendar_month</span>
              <div className="flex-1 min-w-0 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Dates</label>
                <div className="text-xs font-bold text-slate-900 truncate">{selectedDate.mainText}</div>
              </div>

              <DatePickerPopover
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate.mainText}
                themeColor="teal"
                position="auto"
                defaultPosition="top"
              />
            </div>

            {/* 4. TRAVELERS SELECTOR */}
            <div
              className="relative md:col-span-2 flex items-center bg-slate-50 hover:bg-teal-50/50 rounded-2xl px-3 py-2.5 border border-slate-200 text-center cursor-pointer transition-all select-none"
              onClick={() => {
                setIsPassengerOpen(!isPassengerOpen);
                setIsDestinationOpen(false);
                setIsDepartureOpen(false);
                setIsDatePickerOpen(false);
              }}
            >
              <div className="flex-1 min-w-0 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Travelers</label>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {passengers} {passengers === 1 ? 'Adult' : 'Adults'}{passengers <= 2 ? ', 1 Room' : `, ${Math.ceil(passengers / 2)} Rooms`}
                </div>
              </div>

              {/* TRAVELERS POPUP */}
              {isPassengerOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 sm:right-auto sm:left-0 mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-200 p-3 z-50 text-left animate-fadeIn"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Number of Travelers</span>
                    <span className="text-[10px] text-slate-400">Hotel &amp; Visa</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Adults</span>
                      <span className="text-[10px] text-slate-500">12+ years</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-sm shadow-sm transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-teal-700 w-5 text-center">{passengers}</span>
                      <button
                        type="button"
                        onClick={() => setPassengers(Math.min(10, passengers + 1))}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-sm shadow-sm transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setPassengers(num);
                          setIsPassengerOpen(false);
                        }}
                        className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          passengers === num
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {num} {num === 1 ? 'Adult' : 'Adults'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. SEARCH BUTTON */}
            <div className="md:col-span-1">
              <button
                className="w-full min-h-[52px] rounded-2xl bg-teal-600 hover:bg-teal-700 text-white active:scale-[0.98] transition-all flex items-center justify-center gap-1 font-bold text-xs tracking-wider uppercase shadow-lg shadow-teal-600/30 cursor-pointer"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="hidden md:inline">GO</span>
              </button>
            </div>
          </form>
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">event_available</span>
              <span>Upcoming Fixed Departures:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => document.getElementById('fixed-departures')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-2.5 py-1 rounded-full bg-red-600/10 text-red-600 border border-red-600/20 text-[11px] font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                type="button"
                title="View Nov 28 Departure"
              >
                Nov 28 <span className="font-normal">(4 Seats Left)</span>
              </button>
              <button
                onClick={() => document.getElementById('fixed-departures')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
                type="button"
                title="View Dec 05 Departure"
              >
                Dec 05 <span className="font-normal">(Fast Filling)</span>
              </button>
              <button
                onClick={() => document.getElementById('fixed-departures')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
                type="button"
                title="View Dec 12 Departure"
              >
                Dec 12 <span className="font-normal">(Guaranteed Batch)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
