'use client';

import React, { useState, useEffect } from 'react';
import PackageDetailModal from '@/components/site/PackageDetailModal';
import { apiFetch } from '@/lib/api';

const packagesData = [
  {
    id: 'dubai-dunes',
    category: 'family',
    image: '/images/yatra_international_holiday_travel_packages_6.jpg',
    duration: '5 Days / 4 Nights',
    subtitle: 'Return Flights • Visa',
    title: 'Dubai Desert Safari & Marina Skyline',
    desc: 'Burj Khalifa VIP, Ferrari World, Desert Dune Safari & Marina Yacht Cruise with Indian Dinner.',
    tag: '5★ Marriott Stay • Daily Indian Meals',
    price: '₹1,44,999'
  },
  {
    id: 'bali-escape',
    category: 'honeymoon',
    image: '/images/yatra_international_holiday_travel_packages_8.jpg',
    duration: '6 Days / 5 Nights',
    subtitle: 'Direct Flights Included',
    title: 'Bali Tropical Beaches & Ubud Culture',
    desc: 'Ubud private pool villa, Tegalalang rice terraces swing, Uluwatu sunset temple & water sports.',
    tag: 'Private Pool Villa • Pure Veg / Jain',
    price: '₹1,39,999'
  },
  {
    id: 'europe-wonders',
    category: 'europe',
    image: '/images/yatra_international_holiday_travel_packages_9.jpg',
    duration: '8 Days / 7 Nights',
    subtitle: 'Schengen Visa Concierge',
    title: 'Grand Wonders of Europe: Swiss & Paris',
    desc: 'Eiffel Tower 2nd Level, Mt. Titlis Rotair Cable Car, Rhine Falls cruise, and scenic Interlaken trains.',
    tag: 'Premium 4★ Hotels • Hindi Tour Manager',
    price: '₹2,24,999'
  },
  {
    id: 'dubai-combo',
    category: 'family',
    image: '/images/yatra_international_holiday_travel_packages_1.jpg',
    duration: '10 Days / 9 Nights',
    subtitle: 'Dual Country Grand Tour',
    title: 'Luxury Dubai & Singapore Combo Escape',
    desc: 'Burj Khalifa VIP, Universal Studios Singapore, Marina Bay Sands SkyPark, and dual country e-visas.',
    tag: '5★ Luxury Resorts • All Inclusive',
    price: '₹1,89,999'
  }
];

export default function InternationalCatalog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalPkg, setModalPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const packages = packagesData;

  const filteredPackages = activeFilter === 'all'
    ? packages
    : packages.filter((pkg) => String(pkg.category || '').toLowerCase().includes(activeFilter) || String(pkg.title || '').toLowerCase().includes(activeFilter));

  const handleOpenModal = (pkg) => {
    setModalPkg(pkg);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full py-16 bg-[#F8FAFB] border-b border-slate-200" id="packages">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold text-teal-700 uppercase tracking-wider">All-Inclusive Bundles</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-serif">
              Featured International Tour Packages
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Includes International Flights • Visa Assistance • 4★/5★ Hotels • Private Sightseeing
            </p>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Escapes
            </button>
            <button
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'honeymoon'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
              onClick={() => setActiveFilter('honeymoon')}
            >
              Honeymoon
            </button>
            <button
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'family'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
              onClick={() => setActiveFilter('family')}
            >
              Family Special
            </button>
            <button
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'europe'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
              onClick={() => setActiveFilter('europe')}
            >
              Europe Classic
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="packageGrid">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleOpenModal(pkg)}
              className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-slate-200 card-lift flex flex-col group cursor-pointer"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pkg.image}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white font-bold text-xs">
                  {pkg.duration}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1.5 font-serif">{pkg.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{pkg.desc}</p>
                  <div className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded inline-block border border-teal-200 mb-3">
                    {pkg.tag}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ALL-INCLUSIVE</span>
                    <span className="text-xl font-extrabold text-slate-900">{pkg.price}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(pkg);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    View Itinerary
                  </button>
                </div>
              </div>
            </div>
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
