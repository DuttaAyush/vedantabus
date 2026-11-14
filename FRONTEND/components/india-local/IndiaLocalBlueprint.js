'use client';

import React from 'react';

export default function IndiaLocalBlueprint() {
  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60" data-purpose="detailed-itinerary" id="itinerary">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-teal-700 text-xs font-extrabold uppercase tracking-widest">Day-Wise Blueprint • 4 Days / 3 Nights</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Daily Itinerary: Goa Coastal &amp; Heritage Extravaganza</h2>
            <p className="text-slate-500 text-xs mt-1">Experience seamless private transit, verified regional dining, and curated beachside moments.</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
              title="Save or Print Brochure"
            >
              <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Download / Print PDF Brochure</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Day 1 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-tight opacity-80">Day</span>
              <span className="text-lg font-black leading-none">01</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">Arrival • Sunset Beach Lounge Check-in</h3>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">Evening Welcome</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Warm reception at Goa Airport/Madgaon Railway Station. Transfer in a private AC cab to your 4★ Candolim beachside resort. Unwind with a welcome tender coconut drink, followed by an evening sunset beach stroll and curated vegetarian coastal dinner buffet.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-teal-700">✓ Private Station/Airport Pickup</span>
                <span className="flex items-center gap-1 text-teal-700">✓ 4★ Beach Resort Check-in</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Welcome Coastal Dinner</span>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-tight opacity-80">Day</span>
              <span className="text-lg font-black leading-none">02</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">North Goa Heritage, Fort Aguada &amp; Fontainhas Walk</h3>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">Full Day Sightseeing</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Morning breakfast buffet. Explore 17th-century Portuguese heritage at Fort Aguada with panoramic Arabian Sea views. Post lunch, visit the vibrant Latin Quarter of Fontainhas in Panjim with an expert local storyteller guide.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-teal-700">✓ Fort Aguada Guided Entry</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Fontainhas Heritage Walk</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Panjim Shopping Leisure</span>
              </div>
            </div>
          </div>

          {/* Day 3 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-tight opacity-80">Day</span>
              <span className="text-lg font-black leading-none">03</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">South Goa Island Cruise, Water Sports &amp; Candlelight Dinner</h3>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">Leisure &amp; Adventure</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scenic cruise along the Mandovi river with dolphin-spotting opportunities. Optional water sports (parasailing/banana boat) at Calangute under certified safety instructors. Evening features a private beachside table dinner with live Goan serenades.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-teal-700">✓ Mandovi River Catamaran</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Water Sports Safety Passes</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Special Beachside Gala Dinner</span>
              </div>
            </div>
          </div>

          {/* Day 4 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-tight opacity-80">Day</span>
              <span className="text-lg font-black leading-none">04</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">Spice Plantation Traditional Lunch &amp; Departure</h3>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">Grand Finale</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check-out from resort. Visit an authentic Sahakari organic spice farm in Ponda. Enjoy a traditional lunch served on banana leaves. Assisted drop-off at Goa Airport or Volvo Sleeper bus lounge for your journey home.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-teal-700">✓ Sahakari Spice Farm Tour</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Organic Banana Leaf Lunch</span>
                <span className="flex items-center gap-1 text-teal-700">✓ Assisted Airport/Bus Departure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
