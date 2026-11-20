'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';
import { allPackagesData } from '@/lib/data/packagesData';

export default function CustomizePackageClient({ params }) {
  const router = useRouter();
  const packageId = params?.id || 'chardham';
  const defaultPkg = allPackagesData[packageId] || allPackagesData['chardham'];
  
  const [pkg, setPkg] = useState(defaultPkg);
  const [hotelTier, setHotelTier] = useState('4star'); // '3star' | '4star' | '5star'
  const [transportMode, setTransportMode] = useState('coach'); // 'coach' | 'private-suv' | 'private-sedan'
  const [mealPlan, setMealPlan] = useState('satvik'); // 'satvik' | 'standard'
  const [travelerCount, setTravelerCount] = useState(2);
  const [activeAddons, setActiveAddons] = useState(defaultPkg.addons || []);

  useEffect(() => {
    const currentBase = allPackagesData[packageId] || allPackagesData['chardham'];
    setPkg(currentBase);
    setActiveAddons(currentBase.addons || []);

    apiFetch(`/api/packages/${packageId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data.data || data.title)) {
          const fetchedPkg = data.data || data;
          const merged = {
            id: fetchedPkg.id || currentBase.id || packageId,
            title: fetchedPkg.title || currentBase.title,
            subtitle: fetchedPkg.subtitle || fetchedPkg.destinations || currentBase.subtitle,
            duration: fetchedPkg.duration || `${fetchedPkg.durationDays || 5} Days`,
            basePrice: fetchedPkg.pricePerPerson ? Number(fetchedPkg.pricePerPerson) : currentBase.basePrice,
            image: fetchedPkg.image || currentBase.image,
            category: fetchedPkg.category || currentBase.category,
            badge: fetchedPkg.badge || currentBase.badge,
            badgeColor: fetchedPkg.badgeColor || currentBase.badgeColor,
            inclusions: fetchedPkg.highlights || fetchedPkg.inclusions || currentBase.inclusions,
            addons: fetchedPkg.addons || currentBase.addons,
          };
          setPkg(merged);
          if (merged.addons && Array.isArray(merged.addons)) {
            setActiveAddons(merged.addons);
          }
        }
      })
      .catch(() => {});
  }, [packageId]);

  const getHotelCost = () => {
    if (hotelTier === '4star') return 4500;
    if (hotelTier === '5star') return 9500;
    return 0; // 3star base
  };

  const getTransportCost = () => {
    if (transportMode === 'private-suv') return 8000;
    if (transportMode === 'private-sedan') return 5000;
    return 0; // shared coach base
  };

  const toggleAddon = (addonId) => {
    setActiveAddons(prev => prev.map(a => a.id === addonId ? { ...a, selected: !a.selected } : a));
  };

  const calculateAddonsTotal = () => {
    return activeAddons.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
  };

  const pricePerPerson = pkg.basePrice + getHotelCost() + calculateAddonsTotal();
  const transportTotal = getTransportCost();
  const grandTotal = (pricePerPerson * travelerCount) + transportTotal;

  const handleConfirmAndBook = (e) => {
    e.preventDefault();
    const packagePayload = {
      pkgId: pkg.id,
      title: pkg.title,
      subtitle: pkg.subtitle,
      duration: pkg.duration,
      image: pkg.image,
      category: pkg.category,
      badge: pkg.badge,
      badgeColor: pkg.badgeColor,
      inclusions: pkg.inclusions || [],
      basePrice: pkg.basePrice,
      hotelTier,
      hotelCostPerPerson: getHotelCost(),
      transportMode,
      transportTotal: getTransportCost(),
      mealPlan,
      travelerCount,
      selectedAddons: activeAddons.filter(a => a.selected),
      addonsTotalPerPerson: calculateAddonsTotal(),
      pricePerPerson,
      grandTotal,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pending_package', JSON.stringify(packagePayload));
      } catch (err) {
        console.error('Failed to store pending package:', err);
      }
    }
    router.push(`/packages/checkout?package=${pkg.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      {/* TOP ROUTE CONTEXT BAR */}
      <div className="bg-white border-b border-slate-200/90 shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-16 sm:top-18 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/packages"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-scarlet border border-slate-200 flex items-center justify-center transition-all shadow-sm"
              title="Back to Catalog"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-extrabold text-brand-scarlet uppercase tracking-widest">{pkg.category}</span>
                <span className="text-xs text-slate-400">• {pkg.duration}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Customize Your Package: {pkg.title}
              </h1>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">tune</span>
            <span>Live Custom Pricing Applied</span>
          </div>
        </div>
      </div>

      {/* MAIN CUSTOMIZATION ARENA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CUSTOMIZATION OPTIONS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PACKAGE HERO SUMMARY CARD */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col sm:flex-row">
            <div className="sm:w-2/5 h-48 sm:h-auto relative">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-xs font-bold">
                {pkg.duration}
              </span>
            </div>
            <div className="p-6 sm:w-3/5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-brand-scarlet uppercase tracking-wider">{pkg.category}</span>
                <h2 className="text-xl font-serif font-bold text-slate-900 mt-1">{pkg.title}</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">{pkg.subtitle}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Starting Base Rate</span>
                <span className="text-lg font-extrabold text-slate-900">₹{pkg.basePrice} <span className="text-xs font-normal text-slate-400">/ person</span></span>
              </div>
            </div>
          </div>

          {/* 1. HOTEL ACCOMMODATION TIER SELECTOR */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">hotel</span>
              <span>1. Choose Hotel Stay Class</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '3star', title: '3★ Standard Hotels', subtitle: 'Sanitised rooms near temple gates', price: 'Included', cost: 0 },
                { id: '4star', title: '4★ Deluxe Resort', subtitle: 'Mountain balcony view & breakfast', price: '+₹4,500', cost: 4500 },
                { id: '5star', title: '5★ Luxury Heritage', subtitle: 'VIP Suites with butler service', price: '+₹9,500', cost: 9500 },
              ].map(tier => (
                <div
                  key={tier.id}
                  onClick={() => setHotelTier(tier.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    hotelTier === tier.id
                      ? 'bg-red-50/40 border-brand-scarlet shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900">{tier.title}</h4>
                      {hotelTier === tier.id && <span className="text-brand-scarlet font-bold text-xs">✓ Selected</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tier.subtitle}</p>
                  </div>
                  <div className="text-xs font-bold text-brand-scarlet pt-2 border-t border-slate-200/60">
                    {tier.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. TRANSPORT & VEHICLE PREFERENCE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">directions_bus</span>
              <span>2. Choose Transit Vehicle Preference</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'coach', title: 'BharatBenz AC Coach', desc: 'Shared luxury coach (2+2 reclining)', price: 'Included' },
                { id: 'private-sedan', title: 'Private AC Sedan', desc: 'Dedicated Dzire/Etios for your group', price: '+₹5,000 Total' },
                { id: 'private-suv', title: 'Private Innova Crysta', desc: 'Luxury 7-seater SUV for family', price: '+₹8,000 Total' },
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setTransportMode(t.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    transportMode === t.id
                      ? 'bg-red-50/40 border-brand-scarlet shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900">{t.title}</h4>
                      {transportMode === t.id && <span className="text-brand-scarlet font-bold text-xs">✓ Selected</span>}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="text-xs font-bold text-brand-scarlet pt-2 border-t border-slate-200/60">
                    {t.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. MEAL PLAN SPECIFICATION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">restaurant</span>
              <span>3. Choose Dining &amp; Meal Preference</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setMealPlan('satvik')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  mealPlan === 'satvik'
                    ? 'bg-amber-50/50 border-amber-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[24px] text-amber-600">temple_hindu</span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">100% Pure Satvik Dining</h4>
                  <p className="text-[11px] text-slate-500">No onion &amp; no garlic fresh meals served daily (Included)</p>
                </div>
              </div>

              <div
                onClick={() => setMealPlan('standard')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  mealPlan === 'standard'
                    ? 'bg-amber-50/50 border-amber-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[24px] text-amber-600">dinner_dining</span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Regional Gourmet Buffet</h4>
                  <p className="text-[11px] text-slate-500">Chef-special North/South Indian veg menu (Included)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DAY-BY-DAY OPTIONAL ACTIVITY ADD-ONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">extension</span>
              <span>4. Optional Activity &amp; VIP Pass Add-ons</span>
            </h3>

            <div className="space-y-3">
              {activeAddons.map(addon => (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    addon.selected
                      ? 'bg-red-50/40 border-brand-scarlet shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(addon.selected)}
                      onChange={() => toggleAddon(addon.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-slate-900">{addon.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-brand-scarlet">+₹{Number(addon.price || 0).toLocaleString('en-IN')} / person</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: LIVE PRICE CALCULATION & DIRECT BOOKING DOCK */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 sticky top-36">
            <h3 className="text-base font-serif font-bold text-slate-900 pb-3 border-b border-slate-100">
              Customization Summary
            </h3>

            {/* Traveler Count Picker */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-700">Total Travelers</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm font-extrabold text-slate-900">{travelerCount}</span>
                <button
                  type="button"
                  onClick={() => setTravelerCount(travelerCount + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2">
              <div className="flex justify-between">
                <span>Base Package Rate ({travelerCount}x)</span>
                <span className="font-bold text-slate-900">₹{pkg.basePrice * travelerCount}</span>
              </div>

              {getHotelCost() > 0 && (
                <div className="flex justify-between">
                  <span>Hotel Stay Upgrade ({travelerCount}x)</span>
                  <span className="font-bold text-slate-900">₹{getHotelCost() * travelerCount}</span>
                </div>
              )}

              {getTransportCost() > 0 && (
                <div className="flex justify-between">
                  <span>Private Transport Upgrade</span>
                  <span className="font-bold text-slate-900">₹{getTransportCost()}</span>
                </div>
              )}

              {calculateAddonsTotal() > 0 && (
                <div className="flex justify-between">
                  <span>Activity Add-ons ({travelerCount}x)</span>
                  <span className="font-bold text-slate-900">₹{calculateAddonsTotal() * travelerCount}</span>
                </div>
              )}

              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Platform Markup</span>
                <span>₹0 (FREE)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-xl font-extrabold text-slate-900">
                <span>Grand Total</span>
                <span className="text-brand-scarlet">₹{grandTotal}</span>
              </div>
            </div>

            {/* CONFIRM & PROCEED TO CHECKOUT */}
            <button
              type="button"
              onClick={handleConfirmAndBook}
              className="w-full py-4 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>CONFIRM &amp; BOOK CUSTOMIZED TRIP</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 Lock your custom hotel &amp; VIP passes with zero booking fees.
            </p>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total</div>
          <div className="text-lg font-black text-brand-scarlet">₹{grandTotal}</div>
        </div>
        <button
          type="button"
          onClick={handleConfirmAndBook}
          className="py-2.5 px-5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>CONFIRM &amp; BOOK ➔</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
