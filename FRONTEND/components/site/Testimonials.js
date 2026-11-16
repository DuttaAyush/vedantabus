'use client';

import React from 'react';
import Link from 'next/link';
import TestimonialCard from './TestimonialCard';

const testimonialData = [
  {
    id: 'aman',
    avatar: '/images/testimonials/aman-verma.jpg',
    name: 'Aman Verma',
    route: 'Delhi ➔ Leh',
    quote: 'Breathtaking views and super comfortable journey!',
    rating: 5,
    destImage: '/images/yatra_india_local_holiday_travel_packages_4.jpg',
    destLabel: 'Leh',
  },
  {
    id: 'sneha',
    avatar: '/images/testimonials/sneha-kulkarni.jpg',
    name: 'Sneha Kulkarni',
    route: 'Delhi ➔ Varanasi',
    quote: 'A soulful journey. Everything was well organised.',
    rating: 5,
    destImage: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_10.jpg',
    destLabel: 'Varanasi',
  },
  {
    id: 'priya',
    avatar: '/images/testimonials/priya-sharma.jpg',
    name: 'Priya Sharma',
    route: 'Mumbai ➔ Goa',
    quote: 'On-time, clean buses and a great experience throughout!',
    rating: 5,
    destImage: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_7.jpg',
    destLabel: 'Goa',
  },
  {
    id: 'rohan',
    avatar: '/images/testimonials/rohan-iyer.jpg',
    name: 'Rohan Iyer',
    route: 'Bangalore ➔ Kerala',
    quote: 'Smooth booking, friendly staff. Will travel again!',
    rating: 5,
    destImage: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_5.jpg',
    destLabel: 'Kerala',
  },
  {
    id: 'karan',
    avatar: '/images/testimonials/karan-mehta.jpg',
    name: 'Karan Mehta',
    route: 'Pune ➔ Jaipur',
    quote: 'Comfortable seats, smooth ride and hassle-free booking.',
    rating: 5,
    destImage: '/images/yatra_india_local_holiday_travel_packages_1.jpg',
    destLabel: 'Jaipur',
  },
];

export default function Testimonials() {
  return (
    <section
      className="w-full relative overflow-hidden bg-[#F4F2EB] scroll-mt-28 sm:scroll-mt-32 [content-visibility:auto] [contain-intrinsic-size:auto_720px]"
      id="testimonialsSection"
    >
      {/* BACKGROUND GRAPHIC IMAGE */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/testimonials_bg.png"
          alt="Testimonials Section Background"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top pointer-events-none"
        />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-center">
          
          {/* LEFT COLUMN: OVERLAY TEXT, ORIGINAL STATS PILLS & CTA */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 sm:space-y-7 -translate-y-0 lg:-translate-y-22">
            
            {/* Tagline */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#007A78] mb-2.5">
                <span>TRAVELLER STORIES</span>
                <span className="w-8 h-[2px] bg-[#007A78]/40" />
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                Real People.<br />
                <span className="text-[#007A78]">Real Journeys.</span>
              </h2>
            </div>

            <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed max-w-md">
              From mountains to beaches, cities to temples — our travellers are exploring a happier India with us.
            </p>

            {/* 3 Metric Stats (Original Clean Design) */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 pt-1">
              
              {/* Stat 1 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center font-bold text-lg border border-[#007A78]/20">
                  😊
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-none">50K+</h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Happy Travellers</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center font-bold text-lg border border-[#007A78]/20">
                  📍
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-none">1,000+</h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Destinations</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center font-bold text-lg border border-[#007A78]/20">
                  ⭐
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-none">4.8/5</h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">Average Rating</p>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0B1728] hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Destinations</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>



          </div>

          {/* RIGHT COLUMN: TESTIMONIAL CARDS MATRIX OVERLAY */}
          <div className="lg:col-span-7 xl:col-span-8 relative min-h-0 lg:min-h-[500px] flex flex-col justify-center">
            
            <div className="relative z-10 space-y-3 sm:space-y-5 lg:space-y-7 w-full">
              
              {/* TOP ROW: Card 1 (Aman) & Card 2 (Sneha) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-3 sm:gap-4 lg:gap-5">
                <div className="w-full sm:w-auto flex justify-center lg:translate-x-6 xl:translate-x-8 lg:-translate-y-16">
                  <TestimonialCard
                    avatar={testimonialData[0].avatar}
                    name={testimonialData[0].name}
                    route={testimonialData[0].route}
                    quote={testimonialData[0].quote}
                    rating={testimonialData[0].rating}
                    destImage={testimonialData[0].destImage}
                    destLabel={testimonialData[0].destLabel}
                  />
                </div>

                <div className="w-full sm:w-auto flex justify-center lg:-translate-x-16 xl:-translate-x-32 lg:-translate-y-5">
                  <TestimonialCard
                    avatar={testimonialData[1].avatar}
                    name={testimonialData[1].name}
                    route={testimonialData[1].route}
                    quote={testimonialData[1].quote}
                    rating={testimonialData[1].rating}
                    destImage={testimonialData[1].destImage}
                    destLabel={testimonialData[1].destLabel}
                  />
                </div>
              </div>

              {/* MIDDLE ROW: Card 3 (Priya) & Card 5 (Karan) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-3 sm:gap-4 lg:gap-5">
                <div className="w-full sm:w-auto flex justify-center lg:-translate-x-4 xl:-translate-x-6 lg:-translate-y-4">
                  <TestimonialCard
                    avatar={testimonialData[2].avatar}
                    name={testimonialData[2].name}
                    route={testimonialData[2].route}
                    quote={testimonialData[2].quote}
                    rating={testimonialData[2].rating}
                    destImage={testimonialData[2].destImage}
                    destLabel={testimonialData[2].destLabel}
                  />
                </div>

                <div className="w-full sm:w-auto flex justify-center lg:-translate-x-10 xl:-translate-x-20 lg:translate-y-6">
                  <TestimonialCard
                    avatar={testimonialData[4].avatar}
                    name={testimonialData[4].name}
                    route={testimonialData[4].route}
                    quote={testimonialData[4].quote}
                    rating={testimonialData[4].rating}
                    destImage={testimonialData[4].destImage}
                    destLabel={testimonialData[4].destLabel}
                  />
                </div>
              </div>

              {/* BOTTOM ROW: Card 4 (Rohan) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-5">
                <div className="w-full sm:w-auto flex justify-center lg:translate-x-10 xl:translate-x-16 lg:translate-y-8">
                  <TestimonialCard
                    avatar={testimonialData[3].avatar}
                    name={testimonialData[3].name}
                    route={testimonialData[3].route}
                    quote={testimonialData[3].quote}
                    rating={testimonialData[3].rating}
                    destImage={testimonialData[3].destImage}
                    destLabel={testimonialData[3].destLabel}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
