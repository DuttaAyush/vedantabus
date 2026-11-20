'use client';

import React, { useState, useEffect } from 'react';
import PackageDetailModal from '@/components/site/PackageDetailModal';

const destinationsData = [
  {
    id: 'bali-escape',
    country: 'INDONESIA',
    title: 'Bali Tropical Beaches & Ubud Culture',
    rating: '4.7',
    reviews: '918',
    tag: 'Best Seller',
    tagBg: 'bg-[#EA384D] text-white',
    price: '₹1,39,999',
    priceLabel: 'STARTING FROM',
    description: 'Private pool villa in Seminyak, rice terrace jungle swing, and Mount Batur sunrise breakfast.',
    image: '/images/yatra_international_holiday_travel_packages_2.jpg'
  },
  {
    id: 'dubai-combo',
    country: 'UAE & SINGAPORE',
    title: 'Luxury Dubai & Singapore Combo Escape',
    rating: '4.9',
    reviews: '1,420',
    tag: 'Top Recommended',
    tagBg: 'bg-[#0D9488] text-white',
    price: '₹1,89,999',
    priceLabel: 'ALL-INCLUSIVE FLIGHTS + STAY',
    description: '5★ Marriott stay in Dubai, Marina Bay Sands SkyPark, Universal Studios pass, and return flights.',
    image: '/images/yatra_international_holiday_travel_packages_3.jpg'
  },
  {
    id: 'dubai-dunes',
    country: 'UNITED ARAB EMIRATES',
    title: 'Dubai Desert Safari & Marina Skyline',
    rating: '4.8',
    reviews: '1,240',
    tag: 'Quick Visa 24H',
    tagBg: 'bg-[#F59E0B] text-slate-950',
    price: '₹1,44,999',
    priceLabel: 'STARTING FROM',
    description: 'Burj Khalifa 124th floor VIP access, red dunes 4x4 safari with BBQ dinner, and luxury Marina yacht tour.',
    image: '/images/yatra_international_holiday_travel_packages_5.jpg'
  },
  {
    id: 'singapore-malaysia',
    country: 'SOUTHEAST ASIA',
    title: 'Singapore & Malaysia Twin Explorer',
    rating: '4.8',
    reviews: '1,105',
    tag: 'Family Favorite',
    tagBg: 'bg-indigo-600 text-white',
    price: '₹1,62,500',
    priceLabel: 'FLIGHTS + STAY INCLUDED',
    description: 'Universal Studios Sentosa, Batu Caves excursion, and Genting Cable Car highland getaway.',
    image: '/images/yatra_international_holiday_travel_packages_1.jpg'
  },
  {
    id: 'europe-wonders',
    country: 'EUROPE CIRCUIT',
    title: 'Grand Wonders of Europe: Swiss & Paris',
    rating: '4.9',
    reviews: '860',
    tag: 'Premium Luxury',
    tagBg: 'bg-purple-600 text-white',
    price: '₹2,24,999',
    priceLabel: 'ALL-INCLUSIVE GRAND TOUR',
    description: 'Mt. Titlis cable car, Eiffel Tower 2nd Level access, Seine river cruise, and Swiss rail pass.',
    image: '/images/yatra_international_holiday_travel_packages_3.jpg'
  },
  {
    id: 'thailand-holiday',
    country: 'THAILAND',
    title: 'Thailand Bangkok & Phuket / Pattaya Holiday',
    rating: '4.7',
    reviews: '2,050',
    tag: 'Trending Now',
    tagBg: 'bg-rose-600 text-white',
    price: '₹1,36,999',
    priceLabel: 'STARTING FROM',
    description: 'Phi Phi Island speed boat tour, James Bond Island canoeing, and luxury beachfront resort stay.',
    image: '/images/yatra_international_holiday_travel_packages_2.jpg'
  }
];

export default function SpotlightDestinations({ rotating = true }) {
  const [activeMidIndex, setActiveMidIndex] = useState(3); // Default center on Singapore & Malaysia (index 3)
  const [windowWidth, setWindowWidth] = useState(1200);
  const [touchStartX, setTouchStartX] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [modalPkg, setModalPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const total = destinationsData.length;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setActiveMidIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveMidIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (!rotating || isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 900);
    return () => clearInterval(timer);
  }, [rotating, isHovered, total]);

  const handleCardClick = (index) => {
    setActiveMidIndex(index);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 40) {
      handlePrev();
    } else if (deltaX < -40) {
      handleNext();
    }
    setTouchStartX(null);
  };

  // Helper to calculate cyclic difference (-2, -1, 0, 1, 2, 3)
  const getDiff = (idx) => {
    let diff = (idx - activeMidIndex) % total;
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;
    return diff;
  };

  // 2D Side Offsets (Pure linear translateX values)
  const offset1 = windowWidth < 640 ? 250 : windowWidth < 1024 ? 310 : 385;
  const offset2 = windowWidth < 640 ? 410 : windowWidth < 1024 ? 520 : 650;
  const offset3 = windowWidth < 640 ? 650 : windowWidth < 1024 ? 900 : 1200;

  return (
    <section
      className="w-full py-12 md:py-16 bg-[#F8FAFB] overflow-hidden select-none isolate"
      id="destinations"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header with Circular Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <span className="font-serif italic text-teal-600 font-semibold text-xs tracking-wide block mb-1">Top Global Picks</span>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight font-semibold">Popular International Destinations</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-normal">Fly to iconic world capitals and sun-kissed archipelagos with curated ease</p>
          </div>
          <div className="w-full md:w-auto flex items-center justify-between mt-3 md:mt-0 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={handlePrev}
                aria-label="Previous destination"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 hover:border-teal-600 hover:text-teal-700 bg-white text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
              </button>
              <span className="text-xs font-bold text-slate-400 font-mono">
                {activeMidIndex + 1} / {total}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next destination"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-teal-700 text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
              </button>
            </div>
            <a className="text-teal-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1 ml-auto md:ml-6 transition-colors" href="#packages">
              <span>View All</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* 2D TILTED CARD DECK CAROUSEL (PURE SIDE-TO-SIDE SLIDING) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative h-[500px] sm:h-[530px] w-full flex items-center justify-center"
        >
          {destinationsData.map((item, index) => {
            const diff = getDiff(index);
            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isFarLeft = diff === -2;
            const isFarRight = diff === 2;
            const isHovered = index === hoveredIndex;

            // Pure 2D Side-to-Side Transforms (Flat horizontal sliding from left/right screen edges)
            let transform = `translate(${diff < 0 ? -offset3 : offset3}px, 20px) scale(0.72) rotate(${diff < 0 ? -10 : 10}deg)`;
            let opacity = 0;
            let zIndex = 0;
            let widthClass = 'w-[300px] sm:w-[340px]';
            let heightClass = 'h-[390px] sm:h-[420px]';

            if (isCenter) {
              // Center Active Featured Card
              transform = isHovered
                ? 'translate(0px, -14px) scale(1.02) rotate(0deg)'
                : 'translate(0px, 0px) scale(1) rotate(0deg)';
              opacity = 1;
              zIndex = isHovered ? 50 : 30;
              widthClass = 'w-full max-w-[410px] sm:max-w-[470px]';
              heightClass = 'h-[465px]';
            } else if (isLeft) {
              // Immediate Left Card
              transform = isHovered
                ? `translate(-${offset1}px, -16px) scale(0.90) rotate(-1.5deg)`
                : `translate(-${offset1}px, 8px) scale(0.86) rotate(-4.5deg)`;
              opacity = 0.95;
              zIndex = isHovered ? 40 : 20;
            } else if (isRight) {
              // Immediate Right Card
              transform = isHovered
                ? `translate(${offset1}px, -16px) scale(0.90) rotate(1.5deg)`
                : `translate(${offset1}px, 8px) scale(0.86) rotate(4.5deg)`;
              opacity = 0.95;
              zIndex = isHovered ? 40 : 20;
            } else if (isFarLeft) {
              // Far Left Card
              transform = isHovered
                ? `translate(-${offset2}px, -12px) scale(0.78) rotate(-4deg)`
                : `translate(-${offset2}px, 20px) scale(0.72) rotate(-7.5deg)`;
              opacity = windowWidth < 640 ? 0 : 0.75;
              zIndex = isHovered ? 30 : 10;
            } else if (isFarRight) {
              // Far Right Card
              transform = isHovered
                ? `translate(${offset2}px, -12px) scale(0.78) rotate(4deg)`
                : `translate(${offset2}px, 20px) scale(0.72) rotate(4deg)`;
              opacity = windowWidth < 640 ? 0 : 0.75;
              zIndex = isHovered ? 30 : 10;
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCenter) {
                    setModalPkg(item);
                    setIsModalOpen(true);
                  } else {
                    handleCardClick(index);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform,
                  opacity,
                  zIndex,
                  willChange: 'transform, opacity',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className={`absolute rounded-3xl overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between p-5 bg-slate-900 border transition-all group pointer-events-auto ${widthClass} ${heightClass} ${
                  isCenter
                    ? 'border-[3px] border-[#14B8A6] ring-4 ring-[#14B8A6]/25 shadow-[0_30px_60px_-12px_rgba(20,184,166,0.45)] p-6 sm:p-7'
                    : 'border-slate-200/20 hover:border-teal-400 hover:shadow-2xl'
                }`}
              >
                <img
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0 pointer-events-none"
                  src={item.image}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-black/20 z-10 pointer-events-none"></div>

                {/* Top Badge Bar */}
                <div className="relative z-20 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-xs shadow-sm">
                    <span className="text-amber-500 text-xs">★</span> {item.rating} <span className="text-slate-500 font-medium">({item.reviews})</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full ${item.tagBg} font-extrabold text-xs shadow-md tracking-wide`}>
                    {isCenter && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>}
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-20 mt-auto">
                  <span className={`text-[10px] font-extrabold tracking-widest uppercase block mb-0.5 pointer-events-none ${isCenter ? 'text-[#FCD34D]' : 'text-[#2DD4BF]'}`}>
                    {item.country}
                  </span>
                  <h3 className={`text-white leading-tight mb-1.5 tracking-tight font-serif font-semibold pointer-events-none ${isCenter ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs sm:text-sm text-white/85 leading-relaxed font-normal pointer-events-none ${isCenter ? 'line-clamp-3 mb-4' : 'line-clamp-2 mb-3.5'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="pointer-events-none">
                      <span className="text-[9px] tracking-wider font-bold uppercase text-white/70 block">{item.priceLabel}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-extrabold text-white ${isCenter ? 'text-2xl sm:text-3xl text-[#FCD34D]' : 'text-xl sm:text-2xl'}`}>{item.price}</span>
                        <span className="text-xs text-white/70 font-medium">/ person</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCenter) {
                          setModalPkg(item);
                          setIsModalOpen(true);
                        } else {
                          handleCardClick(index);
                        }
                      }}
                      className={`font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer ${
                        isCenter
                          ? 'px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white shadow-teal-600/50'
                          : 'px-5 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30'
                      }`}
                    >
                      {isCenter ? 'Book Now' : 'Explore'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {destinationsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeMidIndex ? 'w-10 bg-teal-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      <PackageDetailModal
        pkg={modalPkg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

