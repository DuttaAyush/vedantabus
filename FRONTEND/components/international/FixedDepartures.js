'use client';

import React from 'react';

export default function FixedDepartures() {
  return (
    <section className="w-full py-14 bg-white border-b border-slate-200" id="fixedDepartures">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">
              Guaranteed Departures • Indian Group Escort
            </span>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight mt-1 font-serif font-semibold">
              Upcoming Fixed Batch Departures &amp; Group Journeys
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Join certified Indian tour guides, curated vegetarian/Jain meal batches, and guaranteed flight seats.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-teal-600">verified</span>
              100% Departure Guarantee
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-300 card-lift transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">Dubai Winter Special</span>
              <span className="text-xs font-extrabold text-red-600">4 Seats Left</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mb-1">Nov 28 - Dec 03, 2024</h4>
            <p className="text-xs text-slate-600 mb-3">
              Mumbai &amp; Delhi departures. Hindi/English tour escort, 5★ Marriott stay, and desert camp celebration.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">BATCH FARE</span>
                <span className="font-extrabold text-slate-900 text-sm">₹1,58,999 / person</span>
              </div>
              <a
                href="/packages/checkout?package=dubai"
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Lock Seat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-300 card-lift transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">Bali Year-End Gala</span>
              <span className="text-xs font-extrabold text-amber-700">Fast Filling</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mb-1">Dec 05 - Dec 11, 2024</h4>
            <p className="text-xs text-slate-600 mb-3">
              Direct flights from Bengaluru &amp; Mumbai. Dedicated Jain chef on tour with private pool villa stay.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">BATCH FARE</span>
                <span className="font-extrabold text-slate-900 text-sm">₹1,44,999 / person</span>
              </div>
              <a
                href="/packages/checkout?package=dubai"
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Lock Seat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-300 card-lift transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">Christmas in Europe</span>
              <span className="text-xs font-extrabold text-teal-700">Guaranteed Batch</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mb-1">Dec 12 - Dec 20, 2024</h4>
            <p className="text-xs text-slate-600 mb-3">
              Swiss Alps &amp; Paris Christmas lights. Experienced multilingual group manager &amp; Schengen visa assist.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">BATCH FARE</span>
                <span className="font-extrabold text-slate-900 text-sm">₹2,49,999 / person</span>
              </div>
              <a
                href="/packages/checkout?package=europe"
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Lock Seat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
