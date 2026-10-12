import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          <div>
            <Link href="/">
              <img
                alt="VedantaBus Logo"
                className="h-8 w-auto brightness-0 invert mb-3"
                src="/images/logo.png"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              India&apos;s dedicated bus reservation and curated tour booking network. Fast, reliable, and verified comfort.
            </p>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-brand-scarlet text-[18px]">support_agent</span>
              24/7 Helpline: +91-8208024895
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Top Bus Routes</h4>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-white transition-colors" href="/#popularRoutesSection">Pune to Nagpur Sleeper</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#popularRoutesSection">Mumbai to Pune Daily Volvo</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#popularRoutesSection">Nagpur to Indore Express</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/#popularRoutesSection">Pune to Shirdi Temple Drop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Tour Packages</h4>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-white transition-colors" href="/international">International Holiday Packages</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/spiritual">Spiritual Darshan &amp; Jyotirlinga</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/domestic">Domestic Escapes &amp; Safaris</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/">Custom Group Charters</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Support &amp; Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/terms">Terms &amp; Conditions</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/refund-policy">Return &amp; Refunds</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/contact">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2025 Vedanta Group Of Companies. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <Link className="hover:text-slate-300 transition-colors" href="/terms">Terms</Link>
            <Link className="hover:text-slate-300 transition-colors" href="/privacy-policy">Privacy</Link>
            <Link className="hover:text-slate-300 transition-colors" href="/refund-policy">Refunds</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
            <span>256-Bit SSL Encrypted Booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
