'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';
import { allPackagesData } from '@/lib/data/packagesData';
import AuthGuard from '@/components/auth/AuthGuard';
import { getStoredUser } from '@/lib/auth';

function PackageCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('package');

  useEffect(() => {
    if (!packageId) {
      router.replace('/packages');
    }
  }, [packageId, router]);

  const [customPackageData, setCustomPackageData] = useState(null);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [shareToast, setShareToast] = useState('');

  const [travelerCount, setTravelerCount] = useState(2);
  const [hotelUpgrade, setHotelUpgrade] = useState('4star'); // '3star' | '4star' | '5star'
  const [includeTravelInsurance, setIncludeTravelInsurance] = useState(true);
  const [includeAirportTransfer, setIncludeAirportTransfer] = useState(true);

  const [contactEmail, setContactEmail] = useState('rajesh.patel@gmail.com');
  const [contactPhone, setContactPhone] = useState('+91-8208024895');
  const [whatsappSync, setWhatsappSync] = useState(true);

  const [travelers, setTravelers] = useState([
    { name: 'Rajesh Patel', age: '34', gender: 'male', idType: 'Aadhaar / Passport' },
    { name: 'Sneha Patel', age: '31', gender: 'female', idType: 'Aadhaar / Passport' },
  ]);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = getStoredUser();
        if (u) {
          if (u.email) setContactEmail(u.email);
          if (u.phone) setContactPhone(u.phone);
        }

        const stored = localStorage.getItem('pending_package');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.pkgId === packageId || !packageId || packageId === 'dubai-marina')) {
            setCustomPackageData(parsed);
            if (parsed.hotelTier) setHotelUpgrade(parsed.hotelTier);
            if (parsed.travelerCount) {
              setTravelerCount(parsed.travelerCount);
              const newTravelers = [];
              const defaultNames = ['Rajesh Patel', 'Sneha Patel', 'Aarav Patel', 'Pooja Patel', 'Vikram Patel', 'Kavita Patel'];
              setTravelers(newTravelers);
            }
          }
        }

        // Load saved passengers
        const passengersKey = u?.id ? `saved_passengers_${u.id}` : (u?.phone ? `saved_passengers_${u.phone}` : 'saved_passengers');
        const storedP = localStorage.getItem(passengersKey);
        if (storedP) {
          try {
            const parsedP = JSON.parse(storedP);
            if (Array.isArray(parsedP) && parsedP.length > 0) {
              setSavedPassengersList(parsedP);
            } else {
              setSavedPassengersList([
                { id: 'sp1', name: u?.name || 'Rajesh Patel', age: '34', gender: 'Male', relation: 'Self' },
                { id: 'sp2', name: 'Sneha Patel', age: '31', gender: 'Female', relation: 'Spouse' },
                { id: 'sp3', name: 'Aarav Patel', age: '8', gender: 'Male', relation: 'Child' },
                { id: 'sp4', name: 'Suresh Patel', age: '62', gender: 'Male', relation: 'Father' },
              ]);
            }
          } catch {
            setSavedPassengersList([
              { id: 'sp1', name: u?.name || 'Rajesh Patel', age: '34', gender: 'Male', relation: 'Self' },
              { id: 'sp2', name: 'Sneha Patel', age: '31', gender: 'Female', relation: 'Spouse' },
            ]);
          }
        } else {
          setSavedPassengersList([
            { id: 'sp1', name: u?.name || 'Rajesh Patel', age: '34', gender: 'Male', relation: 'Self' },
            { id: 'sp2', name: 'Sneha Patel', age: '31', gender: 'Female', relation: 'Spouse' },
            { id: 'sp3', name: 'Aarav Patel', age: '8', gender: 'Male', relation: 'Child' },
            { id: 'sp4', name: 'Suresh Patel', age: '62', gender: 'Male', relation: 'Father' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load pending package from localStorage:', err);
      }
    }
  }, [packageId]);

  const [savedPassengersList, setSavedPassengersList] = useState([]);

  const basePkg = allPackagesData[packageId] || allPackagesData['dubai-marina'];
  const pkg = {
    ...basePkg,
    ...(customPackageData ? {
      title: customPackageData.title || basePkg.title,
      subtitle: customPackageData.subtitle || basePkg.subtitle,
      destinations: customPackageData.subtitle || basePkg.subtitle,
      duration: customPackageData.duration || basePkg.duration,
      category: customPackageData.category || basePkg.category,
      image: customPackageData.image || basePkg.image,
      badge: customPackageData.badge || basePkg.badge,
      badgeColor: customPackageData.badgeColor || basePkg.badgeColor,
      inclusions: (customPackageData.inclusions && customPackageData.inclusions.length > 0) ? customPackageData.inclusions : basePkg.inclusions || [],
      price: customPackageData.basePrice || basePkg.basePrice || 24499,
    } : {
      destinations: basePkg.subtitle,
      price: basePkg.basePrice || 24499,
      inclusions: basePkg.inclusions || []
    })
  };

  // Price calculations
  const getHotelUpgradeCost = () => {
    if (hotelUpgrade === '5star') return 9500;
    if (hotelUpgrade === '4star') return 4500;
    return 0; // 3star base
  };

  const selectedAddons = customPackageData?.selectedAddons || [];
  const addonsTotalPerPerson = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
  const transportMode = customPackageData?.transportMode || 'coach';
  const transportTotal = transportMode === 'private-suv' ? 8000 : transportMode === 'private-sedan' ? 5000 : 0;

  const hotelUpgradeCost = getHotelUpgradeCost();
  const pricePerPerson = pkg.price + hotelUpgradeCost + addonsTotalPerPerson;
  const packageBaseTotal = (pricePerPerson * travelerCount) + transportTotal;
  const insuranceTotal = includeTravelInsurance ? 299 * travelerCount : 0;
  const transferTotal = includeAirportTransfer ? 999 : 0;

  const subtotal = packageBaseTotal + insuranceTotal + transferTotal;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + taxes;

  const updateTravelerCount = (count) => {
    const newCount = Math.max(1, Math.min(10, count));
    setTravelerCount(newCount);
    const newTravelers = [...travelers];
    if (newCount > travelers.length) {
      for (let i = travelers.length; i < newCount; i++) {
        newTravelers.push({ name: '', age: '', gender: 'male', idType: 'Aadhaar / Passport' });
      }
    } else {
      newTravelers.length = newCount;
    }
    setTravelers(newTravelers);
  };

  const updateTraveler = (index, field, value) => {
    const updated = [...travelers];
    updated[index][field] = value;
    setTravelers(updated);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    let newBookingId = `PKG-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await apiFetch('/api/packages/book', {
        method: 'POST',
        body: JSON.stringify({
          packageId: pkg.id || packageId,
          travelersCount: travelerCount,
          travelDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          totalAmount: grandTotal,
        })
      });
      const data = await res.json();
      if (data.booking?.id || data.data?.booking?.id) {
        newBookingId = data.booking?.id || data.data?.booking?.id;
      }
    } catch (err) {
      console.error('Failed to post package booking to API:', err);
    }

    setCreatedBookingId(newBookingId);

    const newTrip = {
      id: newBookingId,
      bookingId: newBookingId,
      isPackage: true,
      pkgId: pkg.id || packageId,
      title: pkg.title,
      subtitle: pkg.subtitle || pkg.destinations || '',
      category: pkg.category,
      duration: pkg.duration,
      image: pkg.image,
      date: new Date(Date.now() + 86400000 * 7).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      departureDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      travelers: travelers,
      travelerCount: travelerCount,
      hotelTier: hotelUpgrade,
      transportMode: transportMode,
      mealPlan: customPackageData?.mealPlan || 'satvik',
      selectedAddons: selectedAddons,
      totalAmount: grandTotal,
      paidAmount: grandTotal,
      status: 'CONFIRMED',
      statusColor: 'emerald',
      contactEmail,
      contactPhone,
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const u = getStoredUser();
        const userTripsKey = u?.id ? `user_trips_${u.id}` : (u?.phone ? `user_trips_${u.phone}` : 'user_trips');
        const existingRaw = localStorage.getItem(userTripsKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = [newTrip, ...(Array.isArray(existing) ? existing : [])];
        localStorage.setItem(userTripsKey, JSON.stringify(updated));
        localStorage.removeItem('pending_package');
      } catch (err) {
        console.error('Failed to save package booking to localStorage:', err);
      }
    }

    setIsSuccessModalOpen(true);
  };

  const handleSharePackage = () => {
    const shareText = `🎉 Tour Booking Confirmed #${createdBookingId}!\nPackage: ${pkg.title}\nDuration: ${pkg.duration}\nTravelers: ${travelerCount} Person(s)\nHotel: ${hotelUpgrade === '5star' ? '5★ Luxury' : hotelUpgrade === '4star' ? '4★ Deluxe' : '3★ Standard'}\nAmount Paid: ₹${grandTotal.toLocaleString('en-IN')}`;
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile` : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Tour Booking #${createdBookingId}`,
        text: shareText,
        url: shareUrl,
      }).then(() => {
        setShareToast('Booking shared successfully!');
        setTimeout(() => setShareToast(''), 3000);
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\nView at: ${shareUrl}`);
      setShareToast('Booking summary copied to clipboard!');
      setTimeout(() => setShareToast(''), 3000);
    } else {
      setShareToast('Booking summary generated!');
      setTimeout(() => setShareToast(''), 3000);
    }
  };

  if (!packageId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-4">
          <div className="w-10 h-10 border-4 border-brand-scarlet border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-base font-bold text-slate-800 font-serif">Redirecting to Packages...</h2>
          <p className="text-xs text-slate-500">Please choose a package from the catalog before proceeding to checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard
      title="Login to Complete Package Booking"
      subtitle="Please log in or create an account to customize and confirm your holiday package booking."
      redirectTo="/packages"
    >
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
        <Header />

      {/* TOP ROUTE CONTEXT BAR */}
      <div className="bg-white border-b border-slate-200/90 shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-16 sm:top-18 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/packages"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-scarlet border border-slate-200 flex items-center justify-center transition-all shadow-sm"
              title="Back to Packages"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg font-serif font-bold text-slate-900">Tour Package Checkout</h1>
              <p className="text-xs text-slate-500">{pkg.title} • {pkg.duration}</p>
            </div>
          </div>

          {/* Stepper Badge */}
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1">
              ✓ Package Selected ({travelerCount} Travelers)
            </span>
            <span className="text-slate-300">➔</span>
            <span className="px-3 py-1 rounded-full bg-brand-scarlet text-white shadow-sm">
              Confirm &amp; Pay
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CHECKOUT ARENA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PACKAGE SUMMARY, TRAVELER DETAILS, OPTIONS, PAYMENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PACKAGE SUMMARY CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full md:w-44 h-36 object-cover rounded-2xl shadow-md border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-scarlet/10 text-brand-scarlet text-[11px] font-bold">
                  {pkg.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {pkg.duration}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${pkg.badgeColor}`}>
                  {pkg.badge}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 leading-snug">
                {pkg.title}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                📍 {pkg.destinations}
              </p>
              
              {/* Key Inclusions Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(pkg.inclusions || []).map((inc, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TRAVELER COUNT & HOTEL SELECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-scarlet text-[20px]">group</span>
              Traveler Count &amp; Accommodation Options
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Travelers */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Travelers</label>
                  <p className="text-sm font-bold text-slate-900">{travelerCount} Person(s)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateTravelerCount(travelerCount - 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm w-6 text-center">{travelerCount}</span>
                  <button
                    type="button"
                    onClick={() => updateTravelerCount(travelerCount + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hotel Tier */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Hotel Category</label>
                  <p className="text-sm font-bold text-slate-900">
                    {hotelUpgrade === '5star' ? '5★ Luxury Resort' : hotelUpgrade === '4star' ? '4★ Deluxe Resort' : '3★ Standard Hotel'}
                  </p>
                </div>
                <select
                  value={hotelUpgrade}
                  onChange={(e) => setHotelUpgrade(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none cursor-pointer shadow-sm"
                >
                  <option value="3star">3★ Stays (Base Included)</option>
                  <option value="4star">4★ Stays (+₹4,500/person)</option>
                  <option value="5star">5★ Stays (+₹9,500/person)</option>
                </select>
              </div>
            </div>
          </div>

          {/* CUSTOMIZED CONFIGURATION CARD */}
          {customPackageData && (
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[20px]">tune</span>
                  Customized Add-ons &amp; Travel Preferences
                </h3>
                <Link
                  href={`/customize-package/${pkg.id || packageId}`}
                  className="text-xs font-bold text-brand-scarlet hover:underline flex items-center gap-1"
                >
                  <span>Edit Customization</span>
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">directions_bus</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Transit Vehicle</span>
                    <span className="font-bold text-slate-900">
                      {transportMode === 'private-suv'
                        ? 'Private Innova Crysta SUV (+₹8,000)'
                        : transportMode === 'private-sedan'
                        ? 'Private AC Sedan (+₹5,000)'
                        : 'BharatBenz AC Pushback Coach (Included)'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">restaurant</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Meal Plan</span>
                    <span className="font-bold text-slate-900">
                      {customPackageData.mealPlan === 'standard'
                        ? 'Regional Gourmet Buffet'
                        : '100% Pure Satvik Dining (No Onion/Garlic)'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAddons.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Selected Experiences &amp; Passes ({selectedAddons.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedAddons.map(addon => (
                      <div
                        key={addon.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                          <span className="font-semibold text-slate-800">{addon.label}</span>
                        </div>
                        <span className="font-extrabold text-brand-scarlet shrink-0">+₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTACT DETAILS FORM */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-scarlet text-[20px]">contact_mail</span>
              Primary Contact Information (For Voucher &amp; WhatsApp Sync)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-scarlet outline-none transition-all"
                  placeholder="your.email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-scarlet outline-none transition-all"
                  placeholder="+91-8208024895"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={whatsappSync}
                onChange={(e) => setWhatsappSync(e.target.checked)}
                className="w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet accent-brand-scarlet"
              />
              <span>Send instant WhatsApp PDF tour voucher &amp; itinerary details to this mobile number</span>
            </label>
          </div>

          {/* TRAVELER DETAILS FORM */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-scarlet text-[20px]">badge</span>
              Traveler Information ({travelerCount} Person(s))
            </h3>

            {travelers.map((traveler, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Traveler {index + 1} {index === 0 ? '• Primary Contact' : ''}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Passenger
                  </span>
                </div>

                {/* QUICK SELECT FROM SAVED PASSENGERS DROPDOWN */}
                {savedPassengersList.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Select from Saved Profile</span>
                      <span className="text-brand-scarlet text-[9px] font-bold">1-Click Autofill</span>
                    </label>
                    <select
                      onChange={(e) => {
                        const selectedProfile = savedPassengersList.find(sp => sp.id === e.target.value);
                        if (selectedProfile) {
                          const updated = [...travelers];
                          updated[index].name = selectedProfile.name;
                          updated[index].age = String(selectedProfile.age);
                          updated[index].gender = selectedProfile.gender?.toLowerCase() || 'male';
                          setTravelers(updated);
                        }
                      }}
                      defaultValue=""
                      className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-300 text-xs font-bold outline-none hover:border-brand-scarlet transition-colors shadow-2xs"
                    >
                      <option value="" disabled>-- Choose Saved Co-Passenger --</option>
                      {savedPassengersList.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.gender}, Age {sp.age}) — {sp.relation || 'Saved'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name (As per Govt ID)</label>
                    <input
                      type="text"
                      value={traveler.name}
                      onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-brand-scarlet outline-none"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Age</label>
                    <input
                      type="number"
                      value={traveler.age}
                      onChange={(e) => updateTraveler(index, 'age', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-brand-scarlet outline-none"
                      placeholder="Age"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Gender</label>
                    <select
                      value={traveler.gender}
                      onChange={(e) => updateTraveler(index, 'gender', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:border-brand-scarlet outline-none cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD-ONS & TRAVEL PROTECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-scarlet text-[20px]">verified_user</span>
              Optional Add-ons &amp; Insurance Protection
            </h3>

            <div className="space-y-3">
              <label className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-all">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={includeTravelInsurance}
                    onChange={(e) => setIncludeTravelInsurance(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-scarlet focus:ring-brand-scarlet accent-brand-scarlet mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Complete Comprehensive Travel Insurance</span>
                    <span className="text-[11px] text-slate-500">Covers medical emergencies, baggage loss, trip cancellation up to ₹5,00,000</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 shrink-0">₹299 / person</span>
              </label>

              <label className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-all">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={includeAirportTransfer}
                    onChange={(e) => setIncludeAirportTransfer(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-scarlet focus:ring-brand-scarlet accent-brand-scarlet mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Private Airport / Railway Station Cab Transfer</span>
                    <span className="text-[11px] text-slate-500">Doorstep AC sedan pickup &amp; drop to airport or bus terminal</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 shrink-0">₹999 total</span>
              </label>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-scarlet text-[20px]">payments</span>
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-red-50/50 border-brand-scarlet text-slate-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase">Instant UPI</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">qr_code_2</span>
                </div>
                <span className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</span>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-red-50/50 border-brand-scarlet text-slate-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase">Credit / Debit Card</span>
                  <span className="material-symbols-outlined text-[18px] text-blue-600">credit_card</span>
                </div>
                <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay, Amex</span>
              </label>

              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-red-50/50 border-brand-scarlet text-slate-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase">Netbanking / EMI</span>
                  <span className="material-symbols-outlined text-[18px] text-purple-600">account_balance</span>
                </div>
                <span className="text-[10px] text-slate-500">All Major Indian Banks &amp; No-Cost EMI</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FARE BREAKDOWN & CONFIRMATION */}
        <div className="lg:col-span-4 sticky top-36 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-6">
            <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
              Package Fare Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Base Package Price ({travelerCount}x ₹{pkg.price.toLocaleString('en-IN')})</span>
                <span className="font-bold text-slate-900">₹{(pkg.price * travelerCount).toLocaleString('en-IN')}</span>
              </div>

              {hotelUpgradeCost !== 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Hotel Stay Upgrade ({travelerCount}x ₹{hotelUpgradeCost.toLocaleString('en-IN')})</span>
                  <span className="font-bold text-slate-900">
                    +₹{(hotelUpgradeCost * travelerCount).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {transportTotal > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Private Transport Upgrade</span>
                  <span className="font-bold text-slate-900">+₹{transportTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {addonsTotalPerPerson > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Activity &amp; Pass Add-ons ({travelerCount}x ₹{addonsTotalPerPerson.toLocaleString('en-IN')})</span>
                  <span className="font-bold text-slate-900">+₹{(addonsTotalPerPerson * travelerCount).toLocaleString('en-IN')}</span>
                </div>
              )}

              {includeTravelInsurance && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Comprehensive Travel Protection ({travelerCount}x ₹299)</span>
                  <span className="font-bold text-slate-900">₹{insuranceTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {includeAirportTransfer && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Doorstep Airport/Terminal Cab Transfer</span>
                  <span className="font-bold text-slate-900">₹{transferTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600">
                <span>GST (5% Statutory Tax)</span>
                <span className="font-bold text-slate-900">₹{taxes.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-700 font-bold pt-1 border-t border-slate-100">
                <span>Platform Booking Fee</span>
                <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">₹0 (FREE)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Amount payable</span>
                <span className="text-2xl font-black text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                All Inclusive
              </span>
            </div>

            <button
              type="button"
              onClick={handlePayNow}
              className="w-full py-4 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>PAY ₹{grandTotal.toLocaleString('en-IN')} &amp; CONFIRM TOUR</span>
            </button>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">verified_user</span>
              <span>256-Bit SSL Encrypted. Guaranteed Instant Voucher</span>
            </div>
          </div>
        </div>
      </main>

      {/* CONFIRMATION SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Tour Booking Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking ID: <strong className="text-slate-900 font-mono">{createdBookingId}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Package:</span>
                <span className="font-bold text-slate-900">{pkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-900">{pkg.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Travelers:</span>
                <span className="font-bold text-slate-900">{travelerCount} Person(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hotel Accommodation:</span>
                <span className="font-bold text-slate-900">
                  {hotelUpgrade === '5star' ? '5★ Luxury Resort' : hotelUpgrade === '4star' ? '4★ Deluxe Resort' : '3★ Standard Hotel'}
                </span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Configured Add-ons:</span>
                  <span className="font-bold text-slate-900">{selectedAddons.length} Selected</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Total Paid:</span>
                <span className="text-emerald-700 font-extrabold text-sm">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your instant WhatsApp PDF tour voucher &amp; daily itinerary have been dispatched to <strong>{contactPhone}</strong> and <strong>{contactEmail}</strong>.
            </p>

            {shareToast && (
              <div className="py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
                {shareToast}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-1">
              <Link
                href="/profile"
                className="w-full py-3 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">card_travel</span>
                <span>VIEW MY JOURNEYS &amp; PACKAGES</span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Back to Home</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSharePackage}
                  className="py-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-300 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-700">share</span>
                  <span>Share Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <Footer />
      </div>
    </AuthGuard>
  );
}

export default function PackageCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-scarlet border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PackageCheckoutContent />
    </Suspense>
  );
}
