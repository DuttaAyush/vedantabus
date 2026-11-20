'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function PackageDetailModal({ pkg, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'summary' | 'inclusions'
  const [isClosing, setIsClosing] = useState(false);
  const [cardScrollTop, setCardScrollTop] = useState(0);

  const cardContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('itinerary');
      setIsClosing(false);
      setCardScrollTop(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !pkg || !mounted) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (onClose) onClose();
    }, 250);
  };

  const handleScroll = (e) => {
    setCardScrollTop(e.target.scrollTop);
  };

  // Fallback defaults for missing properties
  const title = pkg.title || 'Curated Travel Package';
  const subtitle = pkg.subtitle || pkg.country || 'Exclusive Holiday Experience';
  const badge = pkg.badge || pkg.tag || 'Popular Package';
  const badgeColor = pkg.badgeColor || pkg.tagBg || 'bg-teal-600 text-white';
  const duration = pkg.duration || '7 Days / 6 Nights';
  const price = pkg.price || '₹54,999';
  const image = pkg.image || '/images/yatra_international_holiday_travel_packages_1.jpg';
  const shortPlan = pkg.shortPlan || pkg.description || 'Complete guided odyssey with luxury stays, sightseeing, and private AC transfers.';
  const itinerary = pkg.itinerary || [
    { day: 'Day 1', title: 'Arrival & Welcome Reception', desc: 'Private luxury transfer from airport/station to hotel. Relaxation and evening briefing.' },
    { day: 'Day 2', title: 'City Tour & Icon Sightseeing', desc: 'Guided morning tour past main monuments, photo points, and heritage landmarks.' },
    { day: 'Day 3', title: 'Excursion & Adventure Day', desc: 'Full day sightseeing excursion with special pass entry and curated lunch.' },
    { day: 'Day 4', title: 'Leisure & Cultural Experience', desc: 'Free morning for shopping followed by evening cultural show and specialty dinner.' },
    { day: 'Day 5', title: 'Departure & Return Transit', desc: 'Breakfast at hotel, free time for souvenirs, drop-off at transit station.' }
  ];
  const highlights = pkg.highlights || [
    'Handpicked 4★ / 5★ Luxury Accommodations',
    'Private AC Bus & Coach Transfers',
    'Verified Gourmet & Satvik Meals',
    'Sightseeing & Entry Passes Included'
  ];
  const inclusions = pkg.inclusions || [
    'All Sightseeing Tours & Entry Tickets',
    'Daily International/Regional Buffet Breakfast & Dinner',
    'Private AC Coach Transit with Professional Guide'
  ];
  const exclusions = pkg.exclusions || ['Personal Laundry & Mini Bar', 'Optional Water Sports / Activity Fees'];
  const hotels = pkg.hotels || [
    { city: 'Main City (3 Nights)', hotel: 'Grand Luxury Resort (4★/5★)', meal: 'Daily Breakfast & Dinner' },
    { city: 'Excursion Resort (2 Nights)', hotel: 'Heritage Hill Palace (4★)', meal: 'All Meals Included' }
  ];

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleClose}
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
            src={image}
            alt={title}
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
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-sm ${badgeColor}`}>
                {badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                {duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 cursor-pointer shadow-md"
                aria-label="Close Card"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Title & Subtitle Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-10 text-white pb-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-semibold truncate mt-1 drop-shadow">
              {subtitle}
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
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{price}</span>
                <span className="text-[11px] font-medium text-slate-500">/ person</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/customize-package/${pkg.id || 'chardham'}`}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Customize</span>
              </a>
              <a
                href={`/packages/checkout?package=${pkg.id || 'chardham'}`}
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
              {highlights.slice(0, 4).map((hl, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200/70"
                >
                  <span className="material-symbols-outlined text-[14px] text-teal-600">check_circle</span>
                  <span>{hl}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Full State Content Tabs */}
          <div className="space-y-6 pt-2">
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'itinerary'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Day-by-Day Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'summary'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Hotel &amp; Transit Stays
                </button>
                <button
                  onClick={() => setActiveTab('inclusions')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'inclusions'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Inclusions &amp; Policies
                </button>
              </div>

              {/* TAB 1: ITINERARY */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  {itinerary.map((dayItem, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-900 font-extrabold text-xs shrink-0 self-start">
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

              {/* TAB 2: SUMMARY & HOTELS */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
                    <h4 className="text-sm font-bold text-teal-900 mb-2 font-serif flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                      <span>Overview</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-teal-950 leading-relaxed mb-3">{shortPlan}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 font-serif">Accommodations &amp; Transit Details</h4>
                    <div className="space-y-2.5">
                      {hotels.map((h, i) => (
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

              {/* TAB 3: INCLUSIONS & POLICIES */}
              {activeTab === 'inclusions' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900 text-white">
                    <h4 className="text-sm font-bold text-teal-300 mb-3 font-serif flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>What is Included</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
                      {inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-teal-400 shrink-0 mt-0.5">check_circle</span>
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {exclusions && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950">
                      <h4 className="font-bold mb-2 text-red-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-red-600">cancel</span>
                        <span>Package Exclusions</span>
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {exclusions.map((exc, i) => (
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">south</span>
                  <span>Downsize Card</span>
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Close Card</span>
                </button>
              </div>
              */}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
