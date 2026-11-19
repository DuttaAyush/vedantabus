'use client';

import React from 'react';

export default function IndiaLocalFixedDepartures() {
  return (
    <section className="py-16 bg-white" data-purpose="fixed-departures-list" id="fixed-batches">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <span className="text-teal-700 text-xs font-extrabold uppercase tracking-widest">
              Guaranteed Departures • Indian Group Escort
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Upcoming Fixed Batch Departures &amp; Group Journeys</h2>
            <p className="text-slate-500 text-xs mt-1">Join certified Indian tour guides, curated vegetarian/Jain meal batches, and guaranteed flight or BharatBenz bus seats.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
            </svg>
            100% Departure Guarantee
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Batch 1 */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-teal-400 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">Goa Coastal Special</span>
              <span className="text-[11px] font-extrabold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">4 Seats Left</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Nov 29 – Dec 03, 2024</h3>
            <p className="text-xs text-slate-500 mt-1">Mumbai &amp; Pune Volvo pickup. Hindi/English tour escort, 4★ beachfront stay, and heritage latin quarter walk.</p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Batch Fare</span>
                <span className="text-lg font-black text-slate-900">₹51,499</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <a href="/packages/checkout?package=goa" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1 cursor-pointer">
                <span>Lock Seat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Batch 2 */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-teal-400 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">Kerala Backwaters &amp; Hill</span>
              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">Fast Filling</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Dec 06 – Dec 11, 2024</h3>
            <p className="text-xs text-slate-500 mt-1">Direct departures from Bengaluru &amp; Mumbai. Dedicated Jain chef on tour with private premium houseboat cruise.</p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Batch Fare</span>
                <span className="text-lg font-black text-slate-900">₹58,999</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <a href="/packages/checkout?package=goa" className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1 cursor-pointer">
                <span>Lock Seat</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Batch 3 */}
          <div className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-teal-400 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">Himachal Christmas Snow</span>
              <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full">Guaranteed Batch</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Dec 14 – Dec 20, 2024</h3>
            <p className="text-xs text-slate-500 mt-1">Delhi Kashmiri Gate AC BharatBenz pickup. Manali snow sports, Rohtang excursion, and river cottage stay.</p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Batch Fare</span>
                <span className="text-lg font-black text-slate-900">₹54,999</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <a href="/packages/checkout?package=himachal" className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1 cursor-pointer">
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
