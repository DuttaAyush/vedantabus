import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import SpiritualHero from '@/components/spiritual/SpiritualHero';
import DevsthanRoutes from '@/components/spiritual/DevsthanRoutes';
import UpcomingBatches from '@/components/spiritual/UpcomingBatches';
import YatraCatalog from '@/components/spiritual/YatraCatalog';
import DayWiseBlueprints from '@/components/spiritual/DayWiseBlueprints';
import DevoteeCare from '@/components/spiritual/DevoteeCare';
import Testimonials from '@/components/site/Testimonials';
import SpiritualFAQ from '@/components/spiritual/SpiritualFAQ';

export const metadata = {
  title: "Spiritual Yatra & Sacred Darshan Booking | VedantaBus",
  description: "Book 12 Jyotirlinga, Char Dham, Shirdi Sai Baba, and Ayodhya Ram Mandir spiritual yatras with direct AC sleeper buses, VIP Darshan passes, and pure Satvik meals.",
};

export default function SpiritualYatraPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-800 antialiased relative spiritual-page">
      <Header />
      <main className="flex-1 relative">
        <SpiritualHero />
        <div className="relative z-10 bg-[#FFFDF9] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4rem] shadow-[0_-25px_60px_rgba(15,23,42,0.35)] border-t border-amber-200/60 -mt-12 sm:-mt-16 pt-10 sm:pt-14 md:pt-16 overflow-hidden">
          <DevsthanRoutes />
          <UpcomingBatches />
          <YatraCatalog />
          <DayWiseBlueprints />
          <DevoteeCare />
          <Testimonials />
          <SpiritualFAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
}
