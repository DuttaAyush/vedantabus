'use client';

import React, { useRef, useState, useEffect } from 'react';

const popularRoutesData = [
  {
    id: 'nagpur-pune',
    route: 'Nagpur ⇄ Pune',
    frequency: '4 Daily',
    busType: 'BharatBenz AC Sleeper (2+1)',
    plate: 'MH-31-AP-4921',
    price: '₹850',
    depTime: '20:30',
    depStation: 'Dharampeth, Nagpur',
    duration: '10h 30m',
    via: 'Samruddhi Mahamarg',
    arrTime: '07:00',
    arrStation: 'Wakad, Pune',
    badge: 'Most Popular Express',
    badgeColor: 'bg-brand-scarlet text-white',
    statusText: 'Only 4 seats left!',
    statusBg: 'bg-red-50 text-brand-scarlet',
    perk: 'Free Water & Blanket',
  },
  {
    id: 'pune-mumbai',
    route: 'Pune ⇄ Mumbai',
    frequency: '8 Daily',
    busType: 'Multi-Axle Volvo B11R AC Seater',
    plate: 'MH-12-QZ-8812',
    price: '₹450',
    depTime: '06:00',
    depStation: 'Swargate, Pune',
    duration: '3h 45m',
    via: 'Mumbai-Pune Expwy',
    arrTime: '09:45',
    arrStation: 'Dadar TT, Mumbai',
    badge: 'High Frequency Shuttle',
    badgeColor: 'bg-blue-600 text-white',
    statusText: '12 seats available',
    statusBg: 'bg-slate-100 text-slate-700',
    perk: 'High Speed Wi-Fi',
  },
  {
    id: 'delhi-haridwar',
    route: 'Delhi ⇄ Haridwar',
    frequency: '6 Daily',
    busType: 'Scania Multi-Axle AC Sleeper',
    plate: 'UK-07-PA-1008',
    price: '₹550',
    depTime: '06:00',
    depStation: 'Majnu Ka Tilla, Delhi',
    duration: '5h 30m',
    via: 'Delhi-Meerut Expwy',
    arrTime: '11:30',
    arrStation: 'Har Ki Pauri, Haridwar',
    badge: 'Devsthan Pilgrimage Express',
    badgeColor: 'bg-amber-600 text-white',
    statusText: 'Only 6 berths left!',
    statusBg: 'bg-amber-50 text-amber-900',
    perk: 'Satvik Refreshment Box',
  },
  {
    id: 'mumbai-goa',
    route: 'Mumbai ⇄ Goa',
    frequency: '5 Daily',
    busType: 'Volvo B11R 2+1 AC Sleeper',
    plate: 'GA-03-X-7744',
    price: '₹990',
    depTime: '19:30',
    depStation: 'Borivali E, Mumbai',
    duration: '11h 00m',
    via: 'NH 66 Coastal Highway',
    arrTime: '06:30',
    arrStation: 'Calangute, Goa',
    badge: 'Coastal Sleeper Liner',
    badgeColor: 'bg-emerald-600 text-white',
    statusText: '8 berths left!',
    statusBg: 'bg-emerald-50 text-emerald-900',
    perk: 'Charging Ports & Reading Light',
  },
  {
    id: 'bengaluru-hyderabad',
    route: 'Bengaluru ⇄ Hyderabad',
    frequency: '7 Daily',
    busType: 'BharatBenz 2+1 AC Sleeper',
    plate: 'KA-01-F-3321',
    price: '₹790',
    depTime: '21:00',
    depStation: 'Majestic, Bengaluru',
    duration: '9h 15m',
    via: 'NH 44 Express Corridor',
    arrTime: '06:15',
    arrStation: 'Ameerpet, Hyderabad',
    badge: 'Night Captain Sleeper',
    badgeColor: 'bg-indigo-600 text-white',
    statusText: '15 seats available',
    statusBg: 'bg-indigo-50 text-indigo-900',
    perk: 'Reading Light & Pillow',
  },
];

export default function PopularRoutes({ onOpenSeatDrawer, rotating = true }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const isAnimatingButtonRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const routes = popularRoutesData;

  const routesTrack = [...routes, ...routes, ...routes];

  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isHovered && rotating && trackRef.current && !isAnimatingButtonRef.current) {
        // Continuous speed: ~50px per second
        offsetRef.current += (delta * 50) / 1000;

        const singleSetWidth = trackRef.current.scrollWidth / 3;
        if (singleSetWidth > 0 && offsetRef.current >= singleSetWidth) {
          offsetRef.current -= singleSetWidth;
        }

        trackRef.current.style.transition = 'none';
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [rotating, isHovered]);

  const getCardStep = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.min(window.innerWidth * 0.82 + 16, 320);
    }
    return 460;
  };

  const scrollLeft = () => {
    if (trackRef.current) {
      isAnimatingButtonRef.current = true;
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      const step = getCardStep();
      offsetRef.current -= step;
      if (offsetRef.current < 0 && singleSetWidth > 0) {
        offsetRef.current += singleSetWidth;
      }
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      setTimeout(() => {
        isAnimatingButtonRef.current = false;
      }, 400);
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      isAnimatingButtonRef.current = true;
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      const step = getCardStep();
      offsetRef.current += step;
      if (singleSetWidth > 0 && offsetRef.current >= singleSetWidth * 2) {
        offsetRef.current -= singleSetWidth;
      }
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      setTimeout(() => {
        isAnimatingButtonRef.current = false;
      }, 400);
    }
  };

  const handleTouchStart = (e) => {
    setIsHovered(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setIsHovered(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 40) {
      scrollLeft();
    } else if (deltaX < -40) {
      scrollRight();
    }
    setTouchStartX(null);
  };

  return (
    <section
      className="w-full py-8 sm:py-10 bg-slate-50 select-none overflow-hidden scroll-mt-28 sm:scroll-mt-32"
      id="popularRoutesSection"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-brand-scarlet text-xs font-extrabold uppercase tracking-wider mb-2.5 shadow-sm border border-red-200">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              DIRECT FLEET OPERATOR • 0% MARKUP
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight font-serif font-semibold">
              Popular Intercity Express Routes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Guaranteed seats with assigned vehicle registration plates and real-time live seat lock.
            </p>
          </div>

          {/* Interactive Navigation Controls + View All */}
          <div className="w-full md:w-auto flex items-center justify-between mt-3 md:mt-0 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Scroll left"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 hover:border-brand-scarlet hover:text-brand-scarlet bg-white text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={scrollRight}
                aria-label="Scroll right"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-brand-scarlet text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
              </button>
            </div>
            <a
              className="text-brand-scarlet hover:text-brand-hover font-bold text-xs flex items-center gap-1 ml-auto md:ml-6 transition-colors"
              href="/search"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* HORIZONTALLY SCROLLABLE POPULAR ROUTES TRACK */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden pb-4 pt-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={trackRef}
            className="flex flex-row items-stretch gap-4 sm:gap-6 w-max will-change-transform"
            style={{ transform: 'translate3d(0px, 0, 0)' }}
          >
          {routesTrack.map((r, idx) => (
            <div
              key={`${r.id}-${idx}`}
              className="min-w-[280px] w-[82vw] sm:w-auto sm:min-w-[440px] md:min-w-[500px] max-w-[540px] shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md border-2 border-brand-scarlet/20 transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 px-4 py-1 font-bold text-[11px] rounded-bl-2xl uppercase tracking-wider ${r.badgeColor}`}>
                {r.badge}
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <span className="text-base sm:text-xl font-extrabold text-slate-900">{r.route}</span>
                      <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-bold">{r.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 flex-wrap">
                      <span>{r.busType}</span>
                      <span>•</span>
                      <span className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[10px] sm:text-xs">{r.plate}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">Starts from</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-brand-scarlet">{r.price}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-3 items-center py-2.5 sm:py-3 px-3 sm:px-4 bg-slate-50 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 border border-slate-100 text-center">
                  <div className="text-left">
                    <div className="text-base sm:text-lg font-bold text-slate-900">{r.depTime}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 truncate">{r.depStation}</div>
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">{r.duration}</span>
                    <div className="w-full h-0.5 bg-slate-200 my-1 relative">
                      <span className="material-symbols-outlined text-brand-scarlet text-[14px] sm:text-[16px] absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-50 px-1">directions_bus</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded truncate inline-block max-w-full">
                      {r.via}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-slate-900">{r.arrTime}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 truncate">{r.arrStation}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-xs">
                  <span className={`font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs ${r.statusBg}`}>{r.statusText}</span>
                  <span className="hidden sm:inline text-slate-400 text-xs">• {r.perk}</span>
                </div>
                <a
                  href={`/select-seats?busId=${r.id}&operator=${encodeURIComponent('Vedanta ' + (r.badge || 'Express'))}&from=${encodeURIComponent(r.route.split('⇄')[0]?.trim() || 'Nagpur')}&to=${encodeURIComponent(r.route.split('⇄')[1]?.trim() || 'Pune')}&price=${r.price.replace(/[^\d]/g, '')}&busPlate=${encodeURIComponent(r.plate)}&busType=${encodeURIComponent(r.busType)}&depTime=${encodeURIComponent(r.depTime)}&arrTime=${encodeURIComponent(r.arrTime)}&depLocation=${encodeURIComponent(r.depStation)}&arrLocation=${encodeURIComponent(r.arrStation)}`}
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-brand-scarlet text-white hover:bg-brand-hover font-bold text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <span>Select Seats</span>
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px]">event_seat</span>
                </a>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
