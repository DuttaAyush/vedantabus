'use client';

import Header from '@/components/site/Header';
import BusHero from '@/components/site/BusHero';
import TrustBand from '@/components/site/TrustBand';
import StatsStrip from '@/components/site/StatsStrip';
import PopularRoutes from '@/components/site/PopularRoutes';
import OfferBanner from '@/components/site/OfferBanner';
import InternationalPackages from '@/components/site/InternationalPackages';
import SpiritualPackages from '@/components/site/SpiritualPackages';
import DomesticPackages from '@/components/site/DomesticPackages';
import Hospitality from '@/components/site/Hospitality';
import WhyUs from '@/components/site/WhyUs';
import Testimonials from '@/components/site/Testimonials';
import ContactForm from '@/components/site/ContactForm';
import Footer from '@/components/site/Footer';
import SpotlightDestinations from '@/components/international/SpotlightDestinations';
import FAQ from '@/components/site/FAQ';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-800 antialiased relative">
      <Header />
      <main className="flex-1 relative">
        <BusHero />
        <div className="relative z-10 isolate bg-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4rem] shadow-xl border-t border-slate-200 overflow-hidden">
          <TrustBand />
          <StatsStrip />
          <SpotlightDestinations />

          <PopularRoutes />
          <OfferBanner />
          <InternationalPackages />
          <SpiritualPackages />
          <DomesticPackages />
          <WhyUs />
          <Testimonials />
          <Hospitality />
          <ContactForm />
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}
