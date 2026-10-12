'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    service: 'Bus Ticket Reservation',
    mobile: '',
    email: '',
    note: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        service: 'Bus Ticket Reservation',
        mobile: '',
        email: '',
        note: '',
      });
    }, 4000);
  };

  return (
    <section className="w-full py-6 sm:py-10 bg-slate-50 scroll-mt-28 sm:scroll-mt-32" id="contactSection">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT SIDE: INSPIRATIONAL TRAVEL & SUPPORT IMAGE */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full flex flex-col justify-between p-8 text-white bg-slate-950 overflow-hidden group">
            <img
              alt="Customer Support Concierge"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
              src="/images/domestic-hero.jpg"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30"></div>

            {/* Top Pill Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider border border-white/30 shadow-md">
                <span className="material-symbols-outlined text-amber-300 text-[18px]">support_agent</span>
                <span>24/7 Dedicated Concierge</span>
              </div>
            </div>

            {/* Bottom Content Info */}
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
                Let&apos;s Plan Your Next Sacred or Luxury Escape
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                Whether you need assistance booking Volvo AC sleeper berths, customizing a spiritual yatra circuit, or organizing group charters, our team is ready to assist you.
              </p>

              <div className="pt-4 border-t border-white/20 space-y-2.5 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-scarlet text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">24/7 Helpline</span>
                    <a href="tel:918208024895" className="text-sm font-bold text-white">+91-8208024895</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email Concierge</span>
                    <a href="mailto:vedantagroupofcom@gmail.com" className="text-sm font-bold text-white">vedantagroupofcom@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CONTACT FORM */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-scarlet block mb-1">
                Reach Out To Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details below and our travel expert will connect with you shortly.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-950 font-serif">Thank You for Reaching Out!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your request has been received successfully. A travel concierge specialist will contact you on <strong>{formData.mobile}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      What You Want *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="Bus Ticket Reservation">Bus Ticket Reservation</option>
                      <option value="Spiritual Yatra / Devsthan Package">Spiritual Yatra / Devsthan Package</option>
                      <option value="International Holiday Package">International Holiday Package</option>
                      <option value="Domestic Tour & Resort">Domestic Tour &amp; Resort</option>
                      <option value="Group Charter & Private Bus Rental">Group Charter &amp; Private Bus Rental</option>
                      <option value="General Query / Feedback">General Query / Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91-8208024895"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Short Note / Travel Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Describe your travel dates, pickup location, passenger count, or specific requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>Submit Inquiry</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
