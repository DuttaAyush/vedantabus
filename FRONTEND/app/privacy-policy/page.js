'use client';

import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-left">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: September 18, 2026</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">1. Information We Collect</h2>
              <p>
                When you book tickets or travel packages with us (operated under legal entity <strong>Vedanta Group Of Companies</strong>), we collect personal information necessary to process your reservation, including full name, mobile number, email address, age, gender, and payment details.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">2. How We Use Your Information</h2>
              <p>
                Your information is used strictly to issue electronic tickets, dispatch WhatsApp &amp; SMS boarding updates, facilitate live GPS bus tracking, pre-register temple VIP queue passes, and provide customer concierge support.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">3. Data Security &amp; Encryption</h2>
              <p>
                We implement industry-standard 256-bit SSL encryption to safeguard your data during transmission. Payment processing is conducted through PCI-DSS compliant payment gateways, and we never store full credit card numbers or UPI PINs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">4. Sharing of Information</h2>
              <p>
                We do not sell or rent your personal data to third parties. Information is shared only with essential operational partners (such as verified hotel providers, temple trust registries, and driver depot coordinators) strictly to deliver booked travel services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">5. Your Privacy Rights</h2>
              <p>
                You have the right to access, update, or request deletion of your saved passenger profiles at any time through your Customer Profile dashboard or by contacting our support team.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif">6. Contact Us</h2>
              <p>
                For privacy inquiries or data requests, email our Data Protection Officer at <strong>vedantagroupofcom@gmail.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
