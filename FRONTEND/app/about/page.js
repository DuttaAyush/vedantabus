'use client';

import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function AboutUsPage() {
  const stats = [
    { label: 'Luxury Fleet Coaches', value: '15+', sub: 'Volvo B11R & BharatBenz' },
    { label: 'Daily Direct Routes', value: '45+', sub: 'Intercity Expressway Network' },
    { label: 'Happy Passengers', value: '1,20,000+', sub: '4.8 ★ Avg Customer Rating' },
    { label: 'Aggregator Markup', value: '0%', sub: 'Pure Transparent Pricing' },
  ];

  const services = [
    {
      icon: 'directions_bus',
      badge: 'BUS TRAVEL',
      title: 'Go farther, comfortably.',
      desc: 'Reliable intercity journeys with comfortable coaches and carefully planned routes.',
      cta: 'Explore Bus Travel →',
      href: '/search',
      image: '/images/yatra_india_local_holiday_travel_packages_1.jpg',
    },
    {
      icon: 'temple_hindu',
      badge: 'SPIRITUAL JOURNEYS',
      title: 'Travel with purpose.',
      desc: "Thoughtfully planned yatras that make visiting India's spiritual destinations easier and more comfortable.",
      cta: 'Explore Yatras →',
      href: '/spiritual',
      image: '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_3.jpg',
    },
    {
      icon: 'flight_takeoff',
      badge: 'INTERNATIONAL HOLIDAYS',
      title: 'See the world your way.',
      desc: 'Discover new countries with curated holidays, stays, experiences, and itineraries.',
      cta: 'Explore International →',
      href: '/international',
      image: '/images/yatra_international_holiday_travel_packages_9.jpg',
    },
    {
      icon: 'landscape',
      badge: 'DOMESTIC HOLIDAYS',
      title: 'There is always more to discover.',
      desc: "Explore India's beaches, mountains, cities, heritage, and hidden escapes.",
      cta: 'Explore India →',
      href: '/domestic',
      image: '/images/yatra_india_local_holiday_travel_packages_5.jpg',
    },
  ];

  const whyUsCards = [
    {
      icon: 'airline_seat_recline_extra',
      title: 'Comfort',
      desc: 'Travel should feel comfortable from the moment you leave.',
    },
    {
      icon: 'visibility',
      title: 'Clarity',
      desc: "Know what you're booking, where you're going, and what to expect.",
    },
    {
      icon: 'favorite',
      title: 'Care',
      desc: 'Thoughtful planning that takes care of the little things.',
    },
    {
      icon: 'tune',
      title: 'Choice',
      desc: 'From a bus ride to a complete holiday, choose the journey that fits you.',
    },
  ];

  const destinationChips = [
    'Mumbai', 'Pune', 'Goa', 'Delhi', 'Kashi', 'Shirdi', 'Dubai', 'Singapore', 'Bali'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      {/* 01. HERO SECTION (PRESERVED INTACT) */}
      <section className="relative bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/yatra_india_local_holiday_travel_packages_5.jpg"
            alt="Luxury Coach Fleet & Expressway Network"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-brand-scarlet/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 font-bold text-xs uppercase tracking-wider border border-white/20">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            <span>India's Dedicated Bus &amp; Pilgrimage Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Redefining Intercity Travel Across Bharat
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Built on absolute transparency — zero hidden aggregator markups, assigned bus plate registration numbers at booking, and a dedicated fleet committed to premium comfort, safety, and spiritual yatras.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="/search"
              className="px-6 py-3 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 transition-all"
            >
              EXPLORE BUS ROUTES
            </a>
            <a
              href="/packages"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wider uppercase border border-white/20 backdrop-blur-md transition-all"
            >
              DISCOVER PACKAGES
            </a>
          </div>
        </div>
      </section>

      {/* STATS STRIP (PRESERVED INTACT) */}
      <section className="bg-white border-b border-slate-200/90 py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((st, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-brand-scarlet">{st.value}</div>
              <div className="text-xs sm:text-sm font-serif font-bold text-slate-900">{st.label}</div>
              <div className="text-[11px] text-slate-500 font-medium">{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 02. WHO WE ARE */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-scarlet bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
              WHO WE ARE
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Travel Made More Meaningful.
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              <p>
                We are a travel platform operated by <strong>Vedanta Group Of Companies</strong> (Legal Venture), built for people who love discovering new destinations with absolute peace of mind.
              </p>
              <p>
                From everyday intercity journeys to spiritual trips, weekend escapes, and international holidays, we bring different ways of travelling together in one place.
              </p>
              <p className="text-slate-900 font-serif font-bold">
                Simple planning. Comfortable journeys. Memorable experiences.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/packages"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
              >
                <span>Explore Our Journeys</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Visual Photograph */}
          <div className="lg:col-span-6 h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group">
            <img
              src="/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_8.jpg"
              alt="Expressway Journey Across Bharat"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <div className="text-xs font-bold uppercase text-amber-300">Indian Expressway Fleet &amp; Holiday Experiences</div>
              <div className="text-sm font-serif">Connecting People with Places Across Bharat &amp; Beyond</div>
            </div>
          </div>

        </div>
      </section>

      {/* 03. WHAT WE DO */}
      <section className="bg-white border-y border-slate-200/90 py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-scarlet bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
              WHAT WE DO
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
              One Place. Many Ways to Travel.
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Whether you're travelling across the country or planning your next holiday, we help you get there.
            </p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-amber-300 font-serif font-bold text-xs px-3.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">{srv.icon}</span>
                    <span>{srv.badge}</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-slate-900">{srv.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{srv.desc}</p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={srv.href}
                      className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-brand-scarlet hover:text-brand-hover transition-colors"
                    >
                      <span>{srv.cta}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 04. OUR PHILOSOPHY (TYPOGRAPHY & HIGHWAY BACKDROP) */}
      <section className="relative bg-slate-950 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/yatra_dedicated_spiritual_yatra_sacred_darshan_booking_refined_2.jpg"
            alt="Philosophy Highway Travel"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/95"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            OUR PHILOSOPHY
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            We Believe the Journey Matters Too.
          </h2>

          <div className="space-y-3 text-base sm:text-xl text-slate-300 font-serif italic max-w-2xl mx-auto leading-relaxed">
            <p>A great trip isn't just about reaching the destination.</p>
            <p className="text-white not-italic font-sans font-medium text-sm sm:text-base space-y-1">
              <span className="block">It's the excitement before leaving.</span>
              <span className="block">The conversations along the way.</span>
              <span className="block">The places you discover unexpectedly.</span>
              <span className="block">And the memories you bring back home.</span>
            </p>
            <p className="pt-2 text-amber-300 not-italic font-sans font-semibold text-sm sm:text-base">
              That's what we want every journey with us to feel like.
            </p>
          </div>

          <div className="pt-4">
            <span className="inline-block px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 font-serif font-bold text-sm tracking-wider border border-white/20">
              Good journeys. Brighter people.
            </span>
          </div>
        </div>
      </section>

      {/* 05. WHY TRAVEL WITH US? */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            WHY TRAVEL WITH US?
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
            Made for Better Journeys.
          </h2>
        </div>

        {/* 4 Small Clean Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUsCards.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">{c.icon}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 06. OUR STORY */}
      <section className="bg-white border-y border-slate-200/90 py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-scarlet bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
            OUR STORY
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
            It Started With a Simple Idea.
          </h2>

          <p className="text-lg sm:text-xl text-brand-scarlet font-serif font-bold">
            Travel should be easier.
          </p>

          <div className="space-y-5 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
            <p>
              What began with the idea of making bus journeys better grew into something bigger — a travel platform connecting people with places, experiences, and journeys across India and beyond.
            </p>
            <p>
              Today, our platform brings together bus travel, spiritual journeys, domestic holidays, and international experiences under one roof. Operated under the legal venture <strong>Vedanta Group Of Companies</strong>, we are committed to delivering trusted, transparent, and seamless hospitality on every route.
            </p>
            <p className="text-slate-900 font-serif font-bold text-center">
              And we&apos;re still exploring where the road takes us next.
            </p>
          </div>

          {/* Legal Venture Callout Box */}
          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Legal Entity</span>
            <div className="text-base sm:text-lg font-serif font-bold text-slate-900">
              Legal Venture Name: <span className="text-brand-scarlet">Vedanta Group Of Companies</span>
            </div>
            <p className="text-xs text-slate-500">
              All bookings, operations, and transportation agreements are officially managed under Vedanta Group Of Companies.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              📍 Block No 132, Shriram Tower, Next to N.I.T, Kingsway, Civil Line, Sadar, Nagpur, Maharashtra - 440001
            </p>
            <p className="text-xs text-slate-500">
              📞 <a href="tel:918208024895" className="font-bold text-brand-scarlet">+91-8208024895</a> &nbsp;|&nbsp;
              ✉️ <a href="mailto:vedantagroupofcom@gmail.com" className="font-bold text-brand-scarlet">vedantagroupofcom@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* 07. DESTINATIONS */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-scarlet bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200">
            DESTINATIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
            From Here to Somewhere New.
          </h2>
          <p className="text-base font-serif font-bold text-slate-600">
            India. Asia. The World.
          </p>
        </div>

        {/* India Map Graphic */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl max-w-4xl mx-auto bg-slate-950 p-6 sm:p-10">
          <img
            src="/images/india_map_route.jpg"
            alt="India Route Network Map"
            className="w-full h-80 sm:h-96 object-contain mx-auto opacity-85"
          />
          
          {/* Destination Chips */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {destinationChips.map((chip, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all cursor-default"
              >
                ● {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-sm font-semibold text-slate-600 italic">
            Your next story could start anywhere.
          </p>
          <div>
            <a
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
            >
              <span>Explore Destinations</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* 08. FINAL CTA */}
      <section className="relative bg-slate-950 text-white py-24 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/testimonials_bg.png"
            alt="Highway Sunset Travel"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/80 to-brand-scarlet/50 mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Where Will You Go Next?
          </h2>

          <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto font-medium leading-relaxed">
            Whether it's a quick getaway, a spiritual journey, or a trip you've been dreaming about for years — we'll help you get there.
          </p>

          <div className="pt-2">
            <a
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 transition-all"
            >
              <span>Start Exploring</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="pt-6 text-xs font-serif font-bold text-amber-300 tracking-wider">
            Good journeys. Brighter people.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
