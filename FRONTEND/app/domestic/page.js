import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import IndiaLocalHero from '@/components/india-local/IndiaLocalHero';
import IndiaLocalTrustBand from '@/components/india-local/IndiaLocalTrustBand';
import SpotlightDomesticDestinations from '@/components/india-local/SpotlightDomesticDestinations';
import IndiaLocalHowItWorks from '@/components/india-local/IndiaLocalHowItWorks';
import IndiaLocalCatalog from '@/components/india-local/IndiaLocalCatalog';
import IndiaLocalFixedDepartures from '@/components/india-local/IndiaLocalFixedDepartures';
import IndiaLocalBlueprint from '@/components/india-local/IndiaLocalBlueprint';
import Testimonials from '@/components/site/Testimonials';
import IndiaLocalFAQ from '@/components/india-local/IndiaLocalFAQ';

export const metadata = {
  title: 'Domestic Holiday & Travel Packages | VedantaBus',
  description: 'Curated domestic holiday packages across coastal retreats, serene backwaters, and misty Himalayan valleys.'
};

export default function DomesticPackagesPage() {
  return (
    <div className="bg-slate-950 font-sans text-slate-800 antialiased min-h-screen relative flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <IndiaLocalHero />
        <div className="relative z-10 bg-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4rem] shadow-[0_-25px_60px_rgba(15,23,42,0.35)] border-t border-white/60 -mt-12 sm:-mt-16 pt-10 sm:pt-14 md:pt-16 overflow-hidden">
          <IndiaLocalTrustBand />
          <SpotlightDomesticDestinations />
          <IndiaLocalHowItWorks />
          <IndiaLocalCatalog />
          <IndiaLocalFixedDepartures />
          <IndiaLocalBlueprint />
          <Testimonials />
          <IndiaLocalFAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}
