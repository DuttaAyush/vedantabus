'use client';

import React from 'react';

export default function InternationalBlueprint() {
  return (
    <section className="w-full py-16 bg-white border-b border-slate-200" id="itineraryBlueprint">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">
              Day-Wise Blueprint • 5 Days / 4 Nights
            </span>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight mt-1 font-serif font-semibold">
              Daily Itinerary: Dubai &amp; Marina Extravaganza
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Experience seamless private transit, verified Indian restaurants, and priority monuments access.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            title="Save or Print Brochure"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download / Print PDF Brochure</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Day 1 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 transition-all flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              D01
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Arrival at Dubai International (DXB) &amp; Illuminated Marina Dhow Cruise
                </h3>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Evening Activity
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Warm airport reception by our local concierge liaison; private Mercedes Sprinter transfer to your 5★ hotel in Downtown Dubai. Refresh before embarking on a private sunset cruise across Dubai Marina featuring an international buffet with specialized Jain &amp; North Indian counters and live Tanoura artistry.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-semibold">
                <span>✓ Private Airport Transfer</span> • <span>✓ 5★ Marriott Marquis Check-in</span> •{' '}
                <span className="text-emerald-700">✓ Indian Buffet Dinner Included</span>
              </div>
            </div>
          </div>

          {/* Day 2 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 transition-all flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              D02
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Historic Old Dubai Tour &amp; Burj Khalifa 124th + 125th Floor VIP Deck
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Full Day Sightseeing
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Explore the historic Al Fahidi District, Abra boat ride across Dubai Creek, and Gold &amp; Spice Souks with Hindi/English tour guides. In the afternoon, enjoy skip-the-line VIP entry to Burj Khalifa's sky lounge during prime golden hour, followed by the world-famous Dubai Fountain show.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-semibold">
                <span>✓ Burj Khalifa Skip-the-Line</span> • <span>✓ Traditional Abra Ride</span> •{' '}
                <span className="text-emerald-700">✓ Authentic Gujarati/Punjabi Lunch</span>
              </div>
            </div>
          </div>

          {/* Day 3 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 transition-all flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              D03
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Dubai Mall Shopping &amp; Premium 4x4 Red Dunes Desert Safari with BBQ
                </h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Adventure &amp; Culture
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Morning leisure for luxury retail at Dubai Mall. At 3:00 PM, 4x4 Land Cruisers escort you into the Lahbab Red Desert for thrilling dune bashing, sandboarding, camel rides, henna artisans, and an exclusive starlit desert camp banquet with live fire &amp; belly dance shows.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-semibold">
                <span>✓ 4x4 Land Cruiser Dune Bashing</span> • <span>✓ Camel Trekking &amp; Henna</span> •{' '}
                <span className="text-emerald-700">✓ Dedicated Jain / Veg BBQ Camp</span>
              </div>
            </div>
          </div>

          {/* Day 4 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-teal-300 transition-all flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              D04
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Abu Dhabi Royal Excursion (Sheikh Zayed Mosque) &amp; Return Flight
                </h3>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Grand Finale
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Full day excursion to the capital city Abu Dhabi. Marvel at the architectural masterpiece Sheikh Zayed Grand Mosque, photo-stop at Emirates Palace &amp; Ferrari World on Yas Island. Private transfer to DXB airport on Day 05 with complete luggage &amp; VAT refund assistance.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-700 font-semibold">
                <span>✓ Sheikh Zayed Mosque Entry</span> • <span>✓ Private Airport Departure</span> • <span>✓ Airport Lounge Passes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
