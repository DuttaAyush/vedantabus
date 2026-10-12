'use client';

import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-left">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight">
              Return &amp; Refunds Policy
            </h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: September 18, 2026</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">1. Bus Ticket Cancellation Schedule</h2>
              <p>
                Refunds for bus ticket cancellations are calculated based on the time remaining before scheduled bus departure:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>More than 24 Hours prior:</strong> 90% Refund (10% standard processing fee).</li>
                <li><strong>12 to 24 Hours prior:</strong> 75% Refund.</li>
                <li><strong>6 to 12 Hours prior:</strong> 50% Refund.</li>
                <li><strong>Less than 6 Hours prior:</strong> Non-refundable.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">2. Zero Markup Guarantee</h2>
              <p>
                We charge 0% aggregator markup fees. Refunds are processed directly to your original payment method or instantly credited to your Wallet for 100% redemption on future bookings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">3. Operator Cancellations &amp; Delays</h2>
              <p>
                In the rare event of a bus trip cancellation by our team due to mechanical failure or unavoidable depot circumstances, passengers will receive a <strong>100% Full Refund</strong> or guaranteed free transfer to an equivalent luxury AC coach.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">4. Tour Package &amp; VIP Pass Refunds</h2>
              <p>
                For spiritual yatra and international holiday packages, cancellation requests made 15 days prior to travel date qualify for a 100% refund. Cancellations made within 15 days are subject to non-refundable flight and hotel deposit charges.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">5. Refund Processing Timeline</h2>
              <p>
                Approved refunds are initiated immediately and credited to your original bank account, credit card, or UPI within <strong>3 to 5 business days</strong>. Instant Wallet credits are available within 60 seconds.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">6. How to Request a Refund</h2>
              <p>
                You can initiate cancellations directly under your Customer Profile page (`/profile`), or email our refund desk at <strong>vedantagroupofcom@gmail.com</strong> with your Booking ID.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
