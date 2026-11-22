'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DatePickerPopover from '@/components/ui/DatePickerPopover';
import { OPERATIONAL_CITIES, getFilteredCities } from '@/lib/data/citiesData';

export default function BusHero() {
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const heroBackgroundRef = useRef(null);
  const heroContentRef = useRef(null);
  const openPopoverRef = useRef(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [passengers, setPassengers] = useState(2);
  const [selectedDate, setSelectedDate] = useState({
    mainText: 'Tomorrow, 24 Oct',
    subText: 'Thursday',
  });
  const [fromCity, setFromCity] = useState('Nagpur');
  const [toCity, setToCity] = useState('Pune');

  const filteredFromCities = getFilteredCities(fromCity);
  const filteredToCities = getFilteredCities(toCity, fromCity);

  const handleSwap = () => {
    const nextFrom = toCity;
    const nextTo = fromCity;
    setFromCity(nextFrom);
    setToCity(nextTo);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFromOpen(false);
        setIsToOpen(false);
        setIsPassengerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    openPopoverRef.current = isFromOpen || isToOpen || isDatePickerOpen || isPassengerOpen;
  }, [isFromOpen, isToOpen, isDatePickerOpen, isPassengerOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      // Close an open popover once, without scheduling React work on every scroll frame.
      if (openPopoverRef.current) {
        openPopoverRef.current = false;
        setIsFromOpen(false);
        setIsToOpen(false);
        setIsPassengerOpen(false);
        setIsDatePickerOpen(false);
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const calculatedScale = 1 + Math.min(Math.max(scrollY, 0) / 800, 1) * 0.25;
          const calculatedY = Math.min(Math.max(scrollY, 0) * 0.35, 150);
          const calculatedOpacity = Math.max(1 - Math.max(scrollY, 0) / 450, 0);
          const calculatedBgOpacity = Math.max(1 - Math.max(scrollY - 500, 0) / 400, 0);

          if (heroBackgroundRef.current) {
            heroBackgroundRef.current.style.setProperty('--hero-scale', String(calculatedScale));
            heroBackgroundRef.current.style.setProperty('--hero-background-opacity', String(calculatedBgOpacity));
          }
          if (heroContentRef.current) {
            heroContentRef.current.style.setProperty('--hero-content-y', `${calculatedY}px`);
            heroContentRef.current.style.setProperty('--hero-content-opacity', String(calculatedOpacity));
            heroContentRef.current.style.pointerEvents = calculatedOpacity < 0.05 ? 'none' : 'auto';
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDateSelect = (dateResult) => {
    setSelectedDate({
      mainText: dateResult.mainText,
      subText: dateResult.subText,
    });
  };

  return (
    <section
      className={`relative isolate min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5rem)] flex items-center justify-center pt-8 sm:pt-8 md:pt-10 pb-8 sm:pb-12 md:pb-16 bg-slate-950 sticky top-0 transition-all ${
        (isFromOpen || isToOpen || isDatePickerOpen || isPassengerOpen) ? 'z-40' : 'z-0'
      }`}
      id="heroSearch"
    >
      {/* TAJ MAHAL HERO BACKGROUND IMAGE WITH PARALLAX ZOOM & EXIT FADE */}
      <div
        ref={heroBackgroundRef}
        className="absolute inset-0 z-0 transition-opacity duration-150 overflow-hidden pointer-events-none"
        style={{ opacity: 'var(--hero-background-opacity, 1)' }}
      >
        <img
          alt="Ancient Indian Taj Mahal bathed in golden sunrise light"
          className="w-full h-full object-cover object-center will-change-transform transition-transform duration-100 ease-out"
          style={{ transform: 'scale(var(--hero-scale, 1))' }}
          src="/images/domestic-hero.jpg"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Subtle Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div
        ref={heroContentRef}
        className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 relative z-10 space-y-6 sm:space-y-8 md:space-y-10"
        style={{
          transform: 'translateY(var(--hero-content-y, 0px))',
          opacity: 'var(--hero-content-opacity, 1)',
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
        }}
      >
        {/* LEFT-ALIGNED HERO TEXT CONTENT */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 text-left text-white">
          {/* Official IATA Accreditation Trust Badge */}
          <div className="mb-3 sm:mb-5 -mt-1 sm:-mt-2">
            <div
              className="inline-flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-xl select-none w-fit"
            >
              <div className="px-2 py-1 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/images/iata-logo.svg"
                  alt="Official IATA Logo"
                  className="h-[22px] sm:h-[26px] w-auto object-contain"
                />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs md:text-[13px] font-extrabold text-white tracking-wide">
                    Proudly IATA Certified
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-white/80">
                  Accreditation No. <span className="font-mono font-bold text-amber-300">14041134</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tag / Badge */}
          <div className="flex items-center gap-2 sm:gap-3 text-[#e5a97d] font-semibold text-[10px] sm:text-xs uppercase tracking-[0.25em] mb-1 sm:mb-2">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#e5a97d]/80 inline-block"></span>
            <span>BHARAT &amp; SPIRITUAL YATRAS</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
            Sacred Yatras &amp;
            <br />
            <span className="text-white">Intercity Bus Network</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-xs sm:text-base md:text-lg text-slate-100 max-w-2xl font-medium leading-relaxed drop-shadow-md">
            Daily luxury BharatBenz AC sleeper coaches, VIP Temple Darshan passes, verified Satvik dining, and handpicked local escapes across India.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            <Link
              href="/spiritual"
              className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-500/30 backdrop-blur-md border border-amber-300/50 text-amber-200 text-[11px] sm:text-xs font-bold hover:bg-amber-500/40 transition-all shadow-sm"
            >
              🛕 Spiritual Circuits
            </Link>
            <Link
              href="/domestic"
              className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-red-500/30 backdrop-blur-md border border-red-300/50 text-red-200 text-[11px] sm:text-xs font-bold hover:bg-red-500/40 transition-all shadow-sm"
            >
              🚍 Bus &amp; Local Escapes
            </Link>
          </div>
        </div>

        {/* ULTRA-TRANSPARENT GLASS SEARCH BAR CAPSULE */}
        <div ref={searchContainerRef} className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-6xl mx-auto relative z-30">
          <div className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-full rounded-full p-1 sm:p-2 md:py-2 md:pl-4 md:pr-4 bg-white/[0.07] backdrop-blur-md border border-white/15 shadow-2xl relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsFromOpen(false);
                setIsToOpen(false);
                setIsPassengerOpen(false);
                const params = new URLSearchParams({
                  from: fromCity.trim() || 'Nagpur',
                  to: toCity.trim() || 'Pune',
                  date: selectedDate.mainText,
                  passengers: String(passengers),
                });
                router.push(`/search?${params.toString()}`);
              }}
              className="flex flex-row items-center justify-between w-full"
            >
              {/* 1. FROM FIELD */}
              <div className="relative flex-1 min-w-0 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2 md:py-2.5 flex items-center gap-1 sm:gap-2 md:gap-3">
                <span className="material-symbols-outlined text-amber-300 text-[15px] sm:text-[20px] md:text-[24px] shrink-0">
                  departure_board
                </span>
                <div className="min-w-0 flex-1">
                  <label className="block text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-amber-300/90 cursor-pointer truncate">
                    FROM
                  </label>
                  <input
                    type="text"
                    value={fromCity}
                    onClick={() => {
                      setIsFromOpen(true);
                      setIsToOpen(false);
                      setIsPassengerOpen(false);
                      setIsDatePickerOpen(false);
                    }}
                    onFocus={() => {
                      setIsFromOpen(true);
                      setIsToOpen(false);
                      setIsPassengerOpen(false);
                      setIsDatePickerOpen(false);
                    }}
                    onChange={(e) => {
                      setFromCity(e.target.value);
                      setIsFromOpen(true);
                    }}
                    className="w-full bg-transparent font-medium text-white text-[11px] sm:text-sm md:text-base lg:text-lg outline-none border-0 p-0 focus:ring-0 placeholder-white/40 truncate leading-tight sm:leading-snug"
                    placeholder="Departure city"
                    autoComplete="off"
                  />
                </div>

                {fromCity && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFromCity('');
                      setIsFromOpen(true);
                    }}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center shrink-0 text-[10px] transition-colors"
                    title="Clear departure city"
                  >
                    ✕
                  </button>
                )}

                {/* FROM AUTOCOMPLETE DROPDOWN */}
                {isFromOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 mb-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 z-50 text-left animate-fadeIn"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                      <span>{fromCity.trim() ? `Cities matching "${fromCity.trim()}"` : 'Select Departure City'}</span>
                      <span className="text-[9px] text-white/50">{filteredFromCities.length} Cities</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1 space-y-1 custom-scrollbar">
                      {filteredFromCities.length > 0 ? (
                        filteredFromCities.map((item) => {
                          const isSelected = fromCity.toLowerCase().trim() === item.city.toLowerCase();
                          return (
                            <button
                              key={item.city}
                              type="button"
                              onClick={() => {
                                setFromCity(item.city);
                                setIsFromOpen(false);
                                if (!toCity || toCity.toLowerCase() === item.city.toLowerCase()) {
                                  if (item.connectsTo && item.connectsTo.length > 0) {
                                    setToCity(item.connectsTo[0]);
                                  }
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-scarlet text-white font-bold shadow-sm'
                                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="material-symbols-outlined text-[17px] text-amber-300 shrink-0">location_on</span>
                                <div className="min-w-0">
                                  <span className="block text-xs font-bold leading-snug">{item.city}</span>
                                  <span className="text-[10px] text-white/60 block truncate">{item.tag}</span>
                                  {item.connectsTo && item.connectsTo.length > 0 && (
                                    <span className="text-[9px] text-emerald-400 block truncate">
                                      Buses to: {item.connectsTo.join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-amber-200 shrink-0 ml-1">
                                {item.state}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-white/70">
                          <p className="font-semibold text-amber-300">No direct bus hub matching &quot;{fromCity}&quot;</p>
                          <p className="text-[10px] text-white/50 mt-1">Available VedantaBus departure hubs:</p>
                          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
                            {OPERATIONAL_CITIES.slice(0, 6).map((c) => (
                              <button
                                key={c.city}
                                type="button"
                                onClick={() => {
                                  setFromCity(c.city);
                                  setIsFromOpen(false);
                                }}
                                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-brand-scarlet text-[11px] text-white font-bold transition-all"
                              >
                                {c.city}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER DIVIDER LINE & SWAP ARROW */}
              <div className="flex items-center justify-center relative shrink-0 w-5 sm:w-7 md:w-8 self-stretch">
                <div className="h-4 sm:h-5 md:h-6 w-[1px] bg-white/20 pointer-events-none" />
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/25 flex items-center justify-center text-amber-300 hover:text-amber-200 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer z-10"
                  title="Swap From and To"
                >
                  <span className="material-symbols-outlined text-[11px] sm:text-[15px] md:text-[17px]">swap_horiz</span>
                </button>
              </div>

              {/* 2. TO FIELD */}
              <div className="relative flex-1 min-w-0 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2 md:py-2.5 flex items-center gap-1 sm:gap-2 md:gap-3">
                <span className="material-symbols-outlined text-amber-300 text-[15px] sm:text-[20px] md:text-[24px] shrink-0">
                  pin_drop
                </span>
                <div className="min-w-0 flex-1">
                  <label className="block text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-amber-300/90 cursor-pointer truncate">
                    TO
                  </label>
                  <input
                    type="text"
                    value={toCity}
                    onClick={() => {
                      setIsToOpen(true);
                      setIsFromOpen(false);
                      setIsPassengerOpen(false);
                      setIsDatePickerOpen(false);
                    }}
                    onFocus={() => {
                      setIsToOpen(true);
                      setIsFromOpen(false);
                      setIsPassengerOpen(false);
                      setIsDatePickerOpen(false);
                    }}
                    onChange={(e) => {
                      setToCity(e.target.value);
                      setIsToOpen(true);
                    }}
                    className="w-full bg-transparent font-medium text-white text-[11px] sm:text-sm md:text-base lg:text-lg outline-none border-0 p-0 focus:ring-0 placeholder-white/40 truncate leading-tight sm:leading-snug"
                    placeholder="Destination city"
                    autoComplete="off"
                  />
                </div>

                {toCity && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setToCity('');
                      setIsToOpen(true);
                    }}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center shrink-0 text-[10px] transition-colors"
                    title="Clear destination city"
                  >
                    ✕
                  </button>
                )}

                {/* TO AUTOCOMPLETE DROPDOWN */}
                {isToOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 sm:right-auto sm:left-0 mb-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 z-50 text-left animate-fadeIn"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                      <span>
                        {toCity.trim()
                          ? `Matching Destinations (${filteredToCities.length})`
                          : fromCity
                          ? `Buses from ${fromCity}`
                          : 'Select Destination City'}
                      </span>
                      <span className="text-[9px] text-white/50">{filteredToCities.length} Cities</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1 space-y-1 custom-scrollbar">
                      {filteredToCities.length > 0 ? (
                        filteredToCities.map((item) => {
                          const isSelected = toCity.toLowerCase().trim() === item.city.toLowerCase();
                          const isDirectRoute =
                            fromCity &&
                            OPERATIONAL_CITIES.find(
                              (c) => c.city.toLowerCase() === fromCity.toLowerCase().trim()
                            )?.connectsTo?.some(
                              (d) => d.toLowerCase() === item.city.toLowerCase()
                            );

                          return (
                            <button
                              key={item.city}
                              type="button"
                              onClick={() => {
                                setToCity(item.city);
                                setIsToOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-scarlet text-white font-bold shadow-sm'
                                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`material-symbols-outlined text-[17px] shrink-0 ${isDirectRoute ? 'text-emerald-400' : 'text-amber-300'}`}>
                                  {isDirectRoute ? 'verified' : 'pin_drop'}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold leading-snug">{item.city}</span>
                                    {isDirectRoute && (
                                      <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                                        Direct Route
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-white/60 block truncate">{item.tag}</span>
                                </div>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-amber-200 shrink-0 ml-1">
                                {item.state}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-white/70">
                          <p className="font-semibold text-amber-300">No direct bus destination matching &quot;{toCity}&quot;</p>
                          <p className="text-[10px] text-white/50 mt-1">Available VedantaBus destinations:</p>
                          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
                            {OPERATIONAL_CITIES.slice(0, 6).map((c) => (
                              <button
                                key={c.city}
                                type="button"
                                onClick={() => {
                                  setToCity(c.city);
                                  setIsToOpen(false);
                                }}
                                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-brand-scarlet text-[11px] text-white font-bold transition-all"
                              >
                                {c.city}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DIVIDER */}
              <div className="h-4 sm:h-5 md:h-6 w-[1px] bg-white/20 shrink-0 mx-0.5 sm:mx-1" />

              {/* 3. DATE OF JOURNEY FIELD */}
              <div
                className={`relative flex-1 min-w-0 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2 md:py-2.5 flex items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer hover:bg-white/5 rounded-full transition-all ${
                  isDatePickerOpen ? 'z-[9999]' : 'z-10'
                }`}
                onClick={() => {
                  setIsDatePickerOpen(!isDatePickerOpen);
                  setIsFromOpen(false);
                  setIsToOpen(false);
                  setIsPassengerOpen(false);
                }}
              >
                <span className="material-symbols-outlined text-amber-300 text-[15px] sm:text-[20px] md:text-[24px] shrink-0">
                  calendar_month
                </span>
                <div className="min-w-0 flex-1">
                  <label className="block text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-amber-300/90 cursor-pointer truncate">
                    DATE OF JOURNEY
                  </label>
                  <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-medium text-white truncate leading-tight sm:leading-snug">
                    <span className="hidden sm:inline">{selectedDate.mainText}</span>
                    <span className="sm:hidden">{selectedDate.mainText.replace(/^(Today|Tomorrow),\s*/, '')}</span>
                  </div>
                </div>

                <DatePickerPopover
                  isOpen={isDatePickerOpen}
                  onClose={() => setIsDatePickerOpen(false)}
                  onSelectDate={handleDateSelect}
                  selectedDate={selectedDate.mainText}
                  themeColor="red"
                  position="auto"
                  defaultPosition="top"
                />
              </div>

              {/* DIVIDER */}
              <div className="h-4 sm:h-5 md:h-6 w-[1px] bg-white/20 shrink-0 mx-0.5 sm:mx-1" />

              {/* 4. PASSENGERS FIELD */}
              <div
                className="relative flex-1 min-w-0 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2 md:py-2.5 flex items-center gap-1 sm:gap-2 md:gap-3 cursor-pointer hover:bg-white/5 rounded-full transition-all select-none"
                onClick={() => {
                  setIsPassengerOpen(!isPassengerOpen);
                  setIsFromOpen(false);
                  setIsToOpen(false);
                  setIsDatePickerOpen(false);
                }}
              >
                <span className="material-symbols-outlined text-amber-300 text-[15px] sm:text-[20px] md:text-[24px] shrink-0">
                  group
                </span>
                <div className="min-w-0 flex-1">
                  <label className="block text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-amber-300/90 truncate cursor-pointer">
                    PASSENGERS
                  </label>
                  <div className="text-[11px] sm:text-sm md:text-base lg:text-lg font-medium text-white truncate leading-tight sm:leading-snug">
                    <span className="hidden sm:inline">{passengers} {passengers === 1 ? 'Passenger (1 Seat)' : `Passengers (${passengers} Seats)`}</span>
                    <span className="sm:hidden">{passengers} Pax</span>
                  </div>
                </div>

                {/* PASSENGERS SELECTION DROPDOWN */}
                {isPassengerOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 sm:right-auto sm:left-0 mb-3 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-50 text-left animate-fadeIn"
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300/80 pb-2 border-b border-white/10 flex items-center justify-between">
                      <span>Number of Passengers</span>
                      <span className="text-[10px] text-white/50">Max 6 per booking</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                      <div>
                        <span className="text-xs font-bold text-white block">Seats to reserve</span>
                        <span className="text-[10px] text-white/60">Direct coach berths</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-950/80 px-2 py-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => setPassengers(Math.max(1, passengers - 1))}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-sm text-amber-300 w-5 text-center">{passengers}</span>
                        <button
                          type="button"
                          onClick={() => setPassengers(Math.min(6, passengers + 1))}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
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
                              ? 'bg-brand-scarlet text-white shadow-sm'
                              : 'bg-white/5 hover:bg-white/15 text-white/80'
                          }`}
                        >
                          {num} {num === 1 ? 'Seat' : 'Seats'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. SEARCH BUTTON */}
              <div className="shrink-0 flex-shrink-0 p-0.5 sm:p-1">
                <button
                  type="submit"
                  aria-label="Search buses"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:px-7 md:py-3.5 rounded-full bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center md:gap-2 shadow-lg md:shadow-xl md:shadow-red-600/35 hover:scale-[1.03] active:scale-95 cursor-pointer shrink-0 flex-shrink-0"
                  title="Search buses"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px]">search</span>
                  <span className="hidden md:inline">SEARCH</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
