'use client';

import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ContactForm from '@/components/site/ContactForm';
import Testimonials from '@/components/site/Testimonials';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-800 antialiased relative">
      <Header />
      
      <main className="flex-1 relative">
        {/* HERO SECTION - FULL INITIAL VIEWPORT COVERAGE */}
        <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-slate-950 sticky top-0 z-0 px-4 sm:px-6 lg:px-8 py-10">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              alt="Travel Concierge Support Desk"
              className="w-full h-full object-cover object-center"
              src="/images/contact_concierge_bg.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-brand-scarlet/45 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60"></div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10 text-center text-white space-y-6 my-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 font-bold text-xs uppercase tracking-wider border border-white/20 shadow-md">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">support_agent</span>
              <span>24/7 Dedicated Support &amp; Concierge</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Contact Our Travel Concierge
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
              Need assistance with bus seat reservations, spiritual yatra itineraries, or international holiday packages? Our dedicated fleet team is at your service 24/7.
            </p>

            {/* QUICK CONTACT CARDS / BADGES STRIP INSIDE HERO */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto text-left">
              {/* Toll Free */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-scarlet/80 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 block">Toll Free 24/7</span>
                  <a href="tel:918208024895" className="text-sm font-bold text-white hover:text-amber-300 transition-colors truncate block">
                    +91-8208024895
                  </a>
                </div>
              </div>

              {/* WhatsApp Assist */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/80 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">send_to_mobile</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 block">WhatsApp Ticket Assist</span>
                  <a href="https://wa.me/918208024895" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white hover:text-emerald-300 transition-colors truncate block">
                    +91-8208024895
                  </a>
                </div>
              </div>

              {/* Corporate Email */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/80 text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 block">Corporate Email</span>
                  <a href="mailto:vedantagroupofcom@gmail.com" className="text-sm font-bold text-white hover:text-amber-300 transition-colors truncate block">
                    vedantagroupofcom@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="relative z-10 pt-4 pb-2 animate-bounce flex flex-col items-center gap-1 text-slate-300 text-[11px] font-semibold tracking-wider uppercase">
            <span>Scroll for Inquiry &amp; Regional Hubs</span>
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </div>
        </section>

        {/* MAIN CONTENT SECTION OVERLAPPING SHEET */}
        <div className="relative z-10 bg-slate-50 rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-2xl border-t border-slate-200 overflow-hidden space-y-16 pt-12 pb-0">
          
          {/* CONTACT FORM */}
          <ContactForm />

          {/* REGIONAL HUB OFFICES GRID */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-scarlet bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
                OUR REGIONAL TERMINALS &amp; HUBS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
                Visit Our Regional Operational Offices
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
                Walk into any of our flagship terminal counters for instant physical ticket booking, luggage assistance, and boarding help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-lg mx-auto">
              {/* HQ Office */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase">
                  HEADQUARTERS
                </span>
                <h3 className="text-lg font-serif font-bold text-slate-900">Vedanta Group Of Companies</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Block No 132, Shriram Tower, Next to N.I.T,<br />
                  Kingsway, Civil Line, Sadar,<br />
                  Nagpur, Maharashtra - 440001
                </p>
                <div className="pt-2 text-xs font-bold text-brand-scarlet flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Counter Open: 24 Hours Daily</span>
                </div>
                <div className="pt-1 text-xs flex items-center gap-1 text-slate-600">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">call</span>
                  <a href="tel:918208024895" className="font-bold hover:text-brand-scarlet transition-colors">+91-8208024895</a>
                </div>
                <div className="text-xs flex items-center gap-1 text-slate-600">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">mail</span>
                  <a href="mailto:vedantagroupofcom@gmail.com" className="font-bold hover:text-brand-scarlet transition-colors">vedantagroupofcom@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Testimonials />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
