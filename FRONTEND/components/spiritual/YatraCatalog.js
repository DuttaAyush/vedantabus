'use client';

import { useState, useEffect } from 'react';
import PackageDetailModal from '@/components/site/PackageDetailModal';
import { apiFetch } from '@/lib/api';

const yatraPackages = [
  {
    id: 'chardham',
    category: 'chardham',
    title: 'Char Dham Yatra & Haridwar Special',
    duration: '10 Days / 9 Nights',
    destinations: 'Kedarnath • Badrinath • Gangotri • Yamunotri • Haridwar',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
    badge: 'VIP Darshan & Helicopter Assist',
    description: 'Complete Himalayan circuit with 2x2 BharatBenz AC Pushback transit, verified warm Himalayan stays, hot Satvik meals, and medical oxygen kit onboard.',
    tags: ['Deluxe Stays', 'Pure Satvik Food', 'Har Ki Pauri Aarti'],
    price: '₹24,499'
  },
  {
    id: 'maharashtra-5jyotirlinga',
    category: 'jyotirlinga maharashtra',
    title: 'Maharashtra 5 Jyotirlinga Circuit',
    duration: '7 Days / 6 Nights',
    destinations: 'Trimbak • Bhimashankar • Grishneshwar • Aundha • Parli',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_6.jpg',
    badge: 'Complete Maharashtra Shiv Teerth',
    description: 'Holy circumambulation covering all five sacred Jyotirlingas in Maharashtra with Shirdi Sai Baba darshan included. Pre-booked Rudrabhishek slots.',
    tags: ['Direct AC Sleeper', 'Pundit Escort', 'VIP Abhishek'],
    price: '₹11,499'
  },
  {
    id: 'kashi-ayodhya',
    category: 'jyotirlinga ayodhya',
    title: 'Ayodhya Ram Mandir & Kashi Corridor',
    duration: '4 Days / 3 Nights',
    destinations: 'Ayodhya • Varanasi • Prayagraj Sangam',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
    badge: 'Ram Lalla & Kashi Corridor Pass',
    description: 'Experience grand Ram Mandir darshan in Ayodhya, holy Triveni Sangam snan in Prayagraj, and private reserved boat for evening Varanasi Ganga Aarti.',
    tags: ['3★ AC Hotel', 'Ganga Boat Included', 'Fast-track Mandir Entry'],
    price: '₹6,499'
  },
  {
    id: 'tirupati-south',
    category: 'south',
    title: 'Tirupati Balaji & Meenakshi Amman',
    duration: '5 Days / 4 Nights',
    destinations: 'Tirupati • Madurai • Rameshwaram • Dhanushkodi',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_11.jpg',
    badge: '₹300 Seeghra Darshan & Laddu Prasadam Guaranteed',
    description: 'Pre-booked Tirumala special entry darshan, tonsure assistance, holy snan at 22 teerthams of Rameshwaram, and Madurai Meenakshi temple guide.',
    tags: ['VIP Laddu Combo', 'Uphill AC Transit', 'South Satvik Meals'],
    price: '₹8,950'
  },
  {
    id: 'shirdi-express',
    category: 'maharashtra',
    title: 'Shirdi Sai & Shani Shingnapur Express',
    duration: '2 Days / 1 Night',
    destinations: 'Shirdi Samadhi • Dwarkamai • Shani Shingnapur',
    image: '/images/yatra_dedicated_spiritual_yatra_sacred_darshan_booking_refined_2.jpg',
    badge: 'Samadhi Mandir Kakad Aarti Pass',
    description: 'Short devotional getaway: Guaranteed morning Kakad Aarti entry pass, 100m walking-distance hotel from Gate No 2, early check-in, and holy mustard oil pooja at Shani Shingnapur.',
    tags: ['Hotel Gate 2', 'Breakfast + Dinner', 'Early 6 AM Check-in'],
    price: '₹2,899'
  },
  {
    id: 'somnath-dwarka',
    category: 'jyotirlinga',
    title: 'Gujarat Somnath-Dwarka & Nageshwar',
    duration: '4 Days / 3 Nights',
    destinations: 'Dwarkadhish • Somnath • Nageshwar • Bet Dwarka',
    image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_12.jpg',
    badge: 'Sound & Light Show + Dhwajarohan Assist',
    description: 'Somnath Jyotirlinga sea temple darshan with evening light show, Bet Dwarka ferry ride, Nageshwar Jyotirlinga Abhishek, and comfortable AC transit.',
    tags: ['Seafront Hotel', 'Gujarati Satvik Thali', 'Ferry Pass Included'],
    price: '₹5,850'
  }
];

export default function YatraCatalog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalPkg, setModalPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const packages = yatraPackages;

  const filteredPackages = packages.filter(pkg => {
    if (activeFilter === 'all') return true;
    return String(pkg.category || '').toLowerCase().includes(activeFilter) || String(pkg.title || '').toLowerCase().includes(activeFilter);
  });

  const handleOpenModal = (pkg) => {
    setModalPkg(pkg);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full py-16 bg-white border-y border-amber-200/60" id="spiritualPackages">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <span className="material-symbols-outlined text-[16px] text-brand-scarlet">temple_hindu</span>
            DEVSTHAN & TEERTH YATRA CATALOG
          </div>
          <h2 className="text-3xl md:text-4xl text-slate-900 tracking-tight font-spiritual font-normal not-italic">Curated Spiritual Darshan Circuits</h2>
          <p className="text-sm text-slate-600 mt-2">Multi-day hassle-free devotional yatras with AC coach transfers, verified stays within 500m of temple sanctums, pre-booked VIP lines, and Satvik cuisine.</p>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { label: 'All Sacred Circuits', key: 'all' },
              { label: '12 Jyotirlingas', key: 'jyotirlinga' },
              { label: 'Shirdi & Maharashtra', key: 'maharashtra' },
              { label: 'Char Dham & Himalayas', key: 'chardham' },
              { label: 'South Divya Desam', key: 'south' },
              { label: 'Ayodhya & North Devsthan', key: 'ayodhya' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setActiveFilter(btn.key)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  activeFilter === btn.key
                    ? 'bg-brand-scarlet text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Yatra Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => handleOpenModal(pkg)}
              className="bg-[#FFFDF9] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-amber-200 transition-all flex flex-col group cursor-pointer"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pkg.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-scarlet text-white font-bold text-xs shadow-sm">
                  {pkg.duration}
                </span>
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-semibold truncate">
                  {pkg.destinations}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-scarlet mb-2">
                    <span className="material-symbols-outlined text-[16px]">stars</span> {pkg.badge}
                  </div>
                  <h3 className="text-lg text-slate-900 mb-2 font-semibold">{pkg.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{pkg.description}</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] mb-4">
                    {(Array.isArray(pkg.tags) ? pkg.tags : (Array.isArray(pkg.highlights) ? pkg.highlights : [])).map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-bold border border-amber-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Starts at</span>
                    <span className="text-2xl font-extrabold text-slate-900">{pkg.price}</span>
                    <span className="text-[10px] text-slate-500">/person</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(pkg);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    View &amp; Book
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
