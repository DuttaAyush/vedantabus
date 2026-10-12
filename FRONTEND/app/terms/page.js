'use client';

import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-left">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: September 18, 2026</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">1. Agreement to Terms</h2>
              <p>
                By accessing or using this website, mobile application, or services operated by <strong>Vedanta Group Of Companies</strong> (&ldquo;Legal Venture&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">2. Bus Ticket Reservations</h2>
              <p>
                Our platform operates as a direct intercity fleet operator and ticketing platform. Seat bookings are confirmed upon successful payment processing and generation of a valid booking ID with assigned vehicle plate details.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">3. Passenger Responsibilities</h2>
              <p>
                Passengers are required to carry a valid government-issued photo ID (Aadhaar, Passport, Driving License) and present the electronic ticket confirmation at the boarding depot. Passengers must arrive at designated boarding points at least 15 minutes prior to scheduled departure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">4. Tour &amp; Devsthan Packages</h2>
              <p>
                Spiritual yatra and holiday tour package itineraries, hotel check-in timings, and temple VIP queue slots are subject to local administrative protocols and weather conditions. We reserve the right to modify routes in emergency or unavoidable circumstances.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">5. Limitation of Liability</h2>
              <p>
                We shall not be liable for indirect, incidental, or consequential damages resulting from highway traffic delays, extreme weather events, or individual passenger non-compliance with boarding guidelines.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">6. Contact Information</h2>
              <p>
                For questions regarding these Terms &amp; Conditions, please contact us at <strong>vedantagroupofcom@gmail.com</strong> or via toll-free helpline at <strong>+91-8208024895</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
