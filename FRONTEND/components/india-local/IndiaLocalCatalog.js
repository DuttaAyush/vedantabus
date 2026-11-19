'use client';

import React, { useState, useEffect } from 'react';
import PackageDetailModal from '@/components/site/PackageDetailModal';
import { apiFetch } from '@/lib/api';

const domesticPackagesData = [
  {
    id: 1,
    category: 'coastal',
    image: '/images/yatra_india_local_holiday_travel_packages_5.jpg',
    duration: '4 Nights / 5 Days',
    subtitle: 'Luxury Bus / Flight + Cab',
    title: 'Goa Luxury Coastal & Heritage Villa',
    desc: 'Candolim beachside resort, private cab for North/South Goa, Spice plantation tour with Goan buffet lunch.',
    tag1: '4★ Heritage Villa',
    tag2: 'Daily Breakfast & Dinner',
    price: '₹51,499'
  },
  {
    id: 2,
    category: 'heritage',
    image: '/images/yatra_india_local_holiday_travel_packages_6.jpg',
    duration: '5 Nights / 6 Days',
    subtitle: 'Houseboat + AC Sedan',
    title: 'Kerala Backwaters & Munnar Tea Trails',
    desc: 'Alleppey luxury houseboat overnight cruise, tea plantations in Munnar, Kathakali dance cultural show.',
    tag1: 'Private Houseboat',
    tag2: 'Pure Veg / Jain Chef',
    price: '₹11,899'
  },
  {
    id: 3,
    category: 'hills',
    image: '/images/yatra_india_local_holiday_travel_packages_7.jpg',
    duration: '6 Nights / 7 Days',
    subtitle: 'Volvo AC Sleeper + Cab',
    title: 'Himachal Snow Valley & Rohtang Pass',
    desc: 'Delhi/Chandigarh Volvo semi-sleeper transit, Beas river valley cottage, Solang snow sports, Manikaran hot springs.',
    tag1: 'Heated Chalet',
    tag2: 'All Meals Included',
    price: '₹10,499'
  },
  {
    id: 4,
    category: 'heritage',
    image: '/images/yatra_india_local_holiday_travel_packages_8.jpg',
    duration: '5 Nights / 6 Days',
    subtitle: 'BharatBenz AC Coach',
    title: 'Golden Triangle & Coastal Heritage Circuit',
    desc: 'Historic monument entries, guided royal fort walks, luxury coach transit with comfortable reclining leg-rests.',
    tag1: '4★ Heritage Hotels',
    tag2: 'Guided Excursions',
    price: '₹54,999'
  }
];

export default function IndiaLocalCatalog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalPkg, setModalPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const packages = domesticPackagesData;

  const filteredPackages = activeFilter === 'all'
    ? packages
    : packages.filter((pkg) => String(pkg.category || '').toLowerCase().includes(activeFilter) || String(pkg.title || '').toLowerCase().includes(activeFilter));

  const handleOpenModal = (pkg) => {
    setModalPkg(pkg);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/60" data-purpose="curated-packages-grid" id="curated-packages">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Section Title & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-teal-700 text-xs font-extrabold uppercase tracking-widest">All-Inclusive Domestic Bundles</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Featured Domestic Tour Packages</h2>
            <p className="text-slate-500 text-xs mt-1">Includes Intercity Transit • 4★/5★ Stays • Regional Pure Veg / Jain Dining • Private Sightseeing</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Escapes
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                activeFilter === 'coastal'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              onClick={() => setActiveFilter('coastal')}
            >
              Beach &amp; Coastal
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                activeFilter === 'hills'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              onClick={() => setActiveFilter('hills')}
            >
              Hill Stations
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                activeFilter === 'heritage'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              onClick={() => setActiveFilter('heritage')}
            >
              Heritage &amp; Backwaters
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleOpenModal(pkg)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={pkg.image} />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {pkg.duration}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-teal-900/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {pkg.subtitle}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-700 transition">{pkg.title}</h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2">{pkg.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="bg-teal-50 text-teal-800 text-[10px] font-semibold px-2 py-0.5 rounded">{pkg.tag1}</span>
                    <span className="bg-teal-50 text-teal-800 text-[10px] font-semibold px-2 py-0.5 rounded">{pkg.tag2}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">All-Inclusive</span>
                  <span className="text-lg font-black text-slate-900">{pkg.price}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(pkg);
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  View Itinerary
                </button>
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

