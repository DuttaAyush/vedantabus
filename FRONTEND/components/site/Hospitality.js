'use client';

import React from 'react';

export default function Hospitality() {
  const hospitalityCards = [
    {
      title: 'Pure Satvik Veg Dining',
      desc: 'Dedicated pure vegetarian kitchens with freshly cooked Satvik thalis and morning breakfast before temple aartis.',
      icon: 'restaurant',
      bgColor: 'bg-amber-50/90 hover:bg-amber-50',
      borderColor: 'border-amber-100',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'Temple Proximity Stays',
      desc: 'Hotels situated within 5–15 minutes walking radius of main Mandir gates, Shirdi temple complex, or safari gates.',
      icon: 'near_me',
      bgColor: 'bg-red-50/90 hover:bg-red-50',
      borderColor: 'border-red-100',
      iconBg: 'bg-red-100 text-brand-scarlet',
    },
    {
      title: '100% Sanitized AC Rooms',
      desc: 'Family-friendly rooms, fresh linens, sanitized western washrooms, 24/7 hot water, and uninterrupted power backup.',
      icon: 'clean_hands',
      bgColor: 'bg-emerald-50/90 hover:bg-emerald-50',
      borderColor: 'border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Early Bus Check-in Priority',
      desc: 'Arrive on overnight sleeper buses without awkward waiting. Coordinated 6:00 AM early freshen-up room access.',
      icon: 'schedule',
      bgColor: 'bg-blue-50/90 hover:bg-blue-50',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-b border-slate-200 scroll-mt-28 sm:scroll-mt-32 [content-visibility:auto] [contain-intrinsic-size:auto_520px]" id="hospitalitySection">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-brand-scarlet text-xs font-bold uppercase tracking-wider mb-2 border border-red-100">
              <span className="material-symbols-outlined text-[16px]">hotel</span>
              <span>OUR HOSPITALITY STANDARD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight font-serif font-extrabold">
              Comfortable Stays Aligned to Bus Timings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Hand-audited 3-star AC hotels synchronized with express coach arrivals.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 shrink-0">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            <span>100% On-Ground Audited Hotels</span>
          </div>
        </div>

        {/* 4 PASTEL HOSPITALITY CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 xl:gap-6">
          {hospitalityCards.map((card, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border ${card.bgColor} ${card.borderColor} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md space-y-2 sm:space-y-3 flex flex-col justify-between group cursor-pointer`}
            >
              <div className="space-y-1.5 sm:space-y-3">
                {/* ICON & TITLE SIDE-BY-SIDE */}
                <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[16px] sm:text-[20px]">{card.icon}</span>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[10px] sm:text-xs text-slate-600 leading-tight sm:leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
                  {card.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
