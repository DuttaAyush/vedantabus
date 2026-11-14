'use client';

import React, { useState } from 'react';
import PackageDetailModal from '@/components/site/PackageDetailModal';

const domesticSpotlightData = [
  {
    id: 'goa-spotlight',
    title: 'Goa Beach & Heritage Haven',
    subtitle: 'West Coast • Goa',
    duration: '4 Days / 3 Nights',
    price: '₹6,999',
    image: '/images/yatra_india_local_holiday_travel_packages_2.jpg',
    badge: 'Best Seller',
    rating: '4.8',
    reviews: '(1,120)',
    desc: 'Beachfront heritage villa in Candolim, private sunset catamaran cruise, and Old Goa Latin Quarter walking tour.',
    tag1: 'Beachfront Villa',
    tag2: 'Catamaran Cruise',
    shortPlan: 'Relaxing coastal escape with beachfront luxury stay, private catamaran cruise, and heritage Latin Quarter tour.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Candolim Beach Sunset', desc: 'Private transfer to beachfront resort, evening beach relaxation & Goan dinner.' },
      { day: 'Day 2', title: 'Old Goa & Latin Quarter Walk', desc: 'Guided tour of Fontainhas heritage homes, Basilica of Bom Jesus, and Panjim spice market.' },
      { day: 'Day 3', title: 'Catamaran Cruise & Water Sports', desc: 'Private catamaran sailing on Mandovi river with water sports combo and sunset DJ.' },
      { day: 'Day 4', title: 'Beach Leisure & Departure', desc: 'Morning spa treatment, souvenir shopping, and return airport/bus drop-off.' }
    ],
    inclusions: ['3 Nights Beach Villa Stay', 'Daily Breakfast & Dinner', 'Private Catamaran Cruise', 'AC Vehicle Transfers']
  },
  {
    id: 'kerala-spotlight',
    title: 'Kerala Backwaters & Lagoons',
    subtitle: "God's Own Country • Alleppey",
    duration: '5 Days / 4 Nights',
    price: '₹9,499',
    image: '/images/yatra_india_local_holiday_travel_packages_3.jpg',
    badge: '⭐ Top Recommended',
    rating: '4.9',
    reviews: '(1,840)',
    desc: 'Overnight private AC houseboat cruise with personal chef, traditional sadhya, and Kumarakom bird sanctuary tour.',
    tag1: 'Private Houseboat',
    tag2: 'Personal Chef',
    shortPlan: 'Overnight private AC houseboat cruise along tranquil Alleppey canals with authentic Malabar dining and Kumarakom bird watching.',
    itinerary: [
      { day: 'Day 1', title: 'Kochi Arrival & Transfer to Alleppey', desc: 'Welcome at Kochi, scenic transfer to Alleppey backwater resort.' },
      { day: 'Day 2', title: 'Private Houseboat Check-in & Cruise', desc: 'Board traditional luxury wooden houseboat at 12 PM. Enjoy sadhya lunch and canal cruising.' },
      { day: 'Day 3', title: 'Kumarakom Bird Sanctuary & Village Walk', desc: 'Guided nature trail in Kumarakom sanctuary and village coconut groves.' },
      { day: 'Day 4', title: 'Munnar Tea Hills Excursion', desc: 'Full day drive to Munnar tea estates, tea museum tour, and waterfall stops.' },
      { day: 'Day 5', title: 'Fort Kochi Heritage & Return Drop', desc: 'Explore St. Francis Church and Chinese fishing nets before departure.' }
    ],
    inclusions: ['1 Night Private AC Houseboat Stay + 3 Nights 4★ Resort', 'All Houseboat Meals Included', 'Private Sedan Sightseeing Transfers']
  },
  {
    id: 'himachal-spotlight',
    title: 'Himachal Pine & Snow Retreat',
    subtitle: 'Himachal • Manali',
    duration: '5 Days / 4 Nights',
    price: '₹8,499',
    image: '/images/yatra_india_local_holiday_travel_packages_4.jpg',
    badge: 'Winter Special',
    rating: '4.8',
    reviews: '(1,450)',
    desc: 'Heated cedar wood chalets by Beas River, Solang Valley snow adventures, Atal Tunnel pass, and bonfire nights.',
    tag1: 'Heated Chalet',
    tag2: 'Solang Snow Pass',
    shortPlan: 'Snowy Himalayan holiday featuring heated riverfront chalets, Solang Valley sports, Atal Tunnel pass, and evening bonfires.',
    itinerary: [
      { day: 'Day 1', title: 'Overnight AC Volvo Coach ex-Delhi', desc: 'Board luxury Volvo semi-sleeper coach to Manali with blankets and charging ports.' },
      { day: 'Day 2', title: 'Manali Resort Check-in & Mall Road', desc: 'Check-in to cedar wood chalet, afternoon stroll on Mall Road & Hadimba Temple.' },
      { day: 'Day 3', title: 'Solang Valley & Atal Tunnel Excursion', desc: 'Snow adventure sports in Solang Valley, cable car ride, and drive through Atal Tunnel.' },
      { day: 'Day 4', title: 'Kullu River Rafting & Kasol Trip', desc: 'Beas river rafting experience in Kullu and evening cafe culture in Kasol.' },
      { day: 'Day 5', title: 'Return Volvo Coach to Delhi', desc: 'Morning souvenir shopping and evening return bus transit.' }
    ],
    inclusions: ['Round-trip Volvo AC Bus Tickets', '3 Nights Heated Chalet Stay', 'Daily Breakfast & Dinner', 'Solang Valley Sightseeing']
  }
];

export default function SpotlightDomesticDestinations() {
  const [modalPkg, setModalPkg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (pkg) => {
    setModalPkg(pkg);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200/60" data-purpose="popular-destinations-showcase" id="destinations">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-teal-700 text-xs font-extrabold uppercase tracking-widest">Top Domestic Picks</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">Popular Domestic Destinations</h2>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl">From sun-kissed Arabian shores to tranquil emerald backwaters and pine-clad peaks</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                document.getElementById('curated-packages')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Previous Destinations"
              className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-white transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById('curated-packages')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Next Destinations"
              className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-teal-700 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            <a className="ml-3 text-xs font-bold text-teal-800 hover:text-teal-600 flex items-center gap-1" href="#curated-packages">
              View All <span className="text-sm">→</span>
            </a>
          </div>
        </div>

        {/* Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-4 pb-6">
          {/* Left Card: Goa */}
          <div
            onClick={() => handleOpenModal(domesticSpotlightData[0])}
            className="card-tilt-left bg-white rounded-3xl overflow-hidden shadow-custom-card border border-slate-200/80 group cursor-pointer"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                alt="Scenic coastal Goa beach resort with turquoise Arabian sea"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                src={domesticSpotlightData[0].image}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow">{domesticSpotlightData[0].badge}</span>
              </div>
              <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                <span className="text-amber-400">★</span> {domesticSpotlightData[0].rating} <span className="text-slate-400 text-[10px] font-normal">{domesticSpotlightData[0].reviews}</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-teal-300">{domesticSpotlightData[0].subtitle}</span>
                <h3 className="font-serif text-xl font-bold text-white">{domesticSpotlightData[0].title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-600 line-clamp-2">
                {domesticSpotlightData[0].desc}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Starting From</span>
                  <span className="text-xl font-black text-slate-900">{domesticSpotlightData[0].price}</span>
                  <span className="text-xs text-slate-500 font-normal"> / person</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(domesticSpotlightData[0]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>

          {/* Center Card: Kerala */}
          <div
            onClick={() => handleOpenModal(domesticSpotlightData[1])}
            className="card-elevated-center bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/50 group relative cursor-pointer"
          >
            <div className="relative h-80 overflow-hidden">
              <img
                alt="Idyllic Kerala backwaters in Alleppey with luxury traditional wooden houseboat"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                src={domesticSpotlightData[1].image}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-teal-600 text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-lg">{domesticSpotlightData[1].badge}</span>
              </div>
              <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                <span className="text-amber-400">★</span> {domesticSpotlightData[1].rating} <span className="text-slate-300 text-[10px] font-normal">{domesticSpotlightData[1].reviews}</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="text-[11px] uppercase font-black tracking-widest text-emerald-400">{domesticSpotlightData[1].subtitle}</span>
                <h3 className="font-serif text-2xl font-bold text-white mt-0.5">{domesticSpotlightData[1].title}</h3>
              </div>
            </div>
            <div className="p-6 bg-slate-900">
              <p className="text-xs text-slate-300 leading-relaxed">
                {domesticSpotlightData[1].desc}
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-emerald-400 font-bold block tracking-wider">All-Inclusive Houseboat</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{domesticSpotlightData[1].price}</span>
                    <span className="text-xs text-slate-400 font-normal">/ person</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(domesticSpotlightData[1]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition shadow-lg cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Himachal */}
          <div
            onClick={() => handleOpenModal(domesticSpotlightData[2])}
            className="card-tilt-right bg-white rounded-3xl overflow-hidden shadow-custom-card border border-slate-200/80 group cursor-pointer"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                alt="Majestic snow-capped Himalayan valley in Himachal Manali"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                src={domesticSpotlightData[2].image}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-amber-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow">{domesticSpotlightData[2].badge}</span>
              </div>
              <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                <span className="text-amber-400">★</span> {domesticSpotlightData[2].rating} <span className="text-slate-400 text-[10px] font-normal">{domesticSpotlightData[2].reviews}</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-teal-300">{domesticSpotlightData[2].subtitle}</span>
                <h3 className="font-serif text-xl font-bold text-white">{domesticSpotlightData[2].title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-600 line-clamp-2">
                {domesticSpotlightData[2].desc}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Starting From</span>
                  <span className="text-xl font-black text-slate-900">{domesticSpotlightData[2].price}</span>
                  <span className="text-xs text-slate-500 font-normal"> / person</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(domesticSpotlightData[2]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>
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

