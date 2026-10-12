'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';
import AuthGuard from '@/components/auth/AuthGuard';
import { getStoredUser } from '@/lib/auth';
import PrintableBoardingPassModal from '@/components/site/PrintableBoardingPassModal';

import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [hasValidBooking, setHasValidBooking] = useState(false);
  const [passengers, setPassengers] = useState([]);

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappSync, setWhatsappSync] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeCabPickup, setIncludeCabPickup] = useState(false);
  const [includeSatvikMeal, setIncludeSatvikMeal] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState('YB-994821');
  const [shareToast, setShareToast] = useState('');
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = getStoredUser();
        if (u) {
          if (u.email) setContactEmail(u.email);
          if (u.phone) setContactPhone(u.phone);
        }

        // Direct URL access check:
        // Must have active checkout flag in sessionStorage initiated from /select-seats
        const activeFlow = sessionStorage.getItem('active_checkout_flow');
        const saved = sessionStorage.getItem('pending_booking') || localStorage.getItem('pending_booking');

        if (!activeFlow || !saved) {
          setHasValidBooking(false);
          setIsValidating(false);
          return;
        }

        const parsed = JSON.parse(saved);
        if (!parsed || !parsed.busId || !parsed.selectedSeats || !Array.isArray(parsed.selectedSeats) || parsed.selectedSeats.length === 0) {
          setHasValidBooking(false);
          setIsValidating(false);
          return;
        }

        setBookingData(parsed);
        setPassengers(
          parsed.selectedSeats.map((s, idx) => ({
            seat: s.name || s.id,
            name: idx === 0 ? (u?.name || 'Primary Passenger') : '',
            age: idx === 0 ? '34' : '28',
            gender: idx === 0 ? 'male' : 'female',
          }))
        );

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

        setHasValidBooking(true);
      } catch (err) {
        console.error('Failed to load pending booking:', err);
        setHasValidBooking(false);
      } finally {
        setIsValidating(false);
      }
    }
  }, [router]);

  const [savedPassengersList, setSavedPassengersList] = useState([]);

  // Coupon / Promo Code State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const baseFare = bookingData?.baseFare || 0;
  const insuranceCost = includeInsurance ? 15 * passengers.length : 0;
  const cabCost = includeCabPickup ? 199 : 0;
  const mealCost = includeSatvikMeal ? 149 * passengers.length : 0;
  const subtotal = baseFare + insuranceCost + cabCost + mealCost;
  
  // Calculate coupon discount
  const discountAmount = appliedCoupon 
    ? Math.min(Math.round((subtotal * appliedCoupon.discountPercentage) / 100), appliedCoupon.maxDiscountAmount || 99999) 
    : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxes = Math.round(discountedSubtotal * 0.05);
  const grandTotal = discountedSubtotal + taxes;

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await apiFetch('/api/offers/validate', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const pct = data.data.discountPercentage || 0;
        const maxCap = data.data.maxDiscountAmount || 99999;
        const saved = Math.min(Math.round((subtotal * pct) / 100), maxCap);
        setAppliedCoupon({ ...data.data, discountAmount: saved });
        setCouponSuccess(`🎉 Coupon "${data.data.code}" applied! You saved ₹${saved}.`);
        setCouponError('');
        setCouponCode(data.data.code);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || 'Invalid or expired offer code.');
        setCouponSuccess('');
      }
    } catch {
      setAppliedCoupon(null);
      setCouponError('Failed to validate coupon code. Please try again.');
      setCouponSuccess('');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    let finalTicketId = `YB-${Math.floor(100000 + Math.random() * 900000)}`;

    // Call our Express backend API
    try {
      const storedUser = getStoredUser();
      const response = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          tripId: bookingData?.tripId || null,
          busId: bookingData?.busId || bookingData?.bus?.id || null,
          date: bookingData?.date || new Date().toISOString(),
          selectedSeats: passengers.map(p => ({ id: p.seat, name: p.seat })),
          totalAmount: grandTotal,
          lockHolderId: bookingData?.lockHolderId,
          userId: storedUser?.id || null,
          couponCode: appliedCoupon?.code || null,
          discountAmount: discountAmount || 0,
        })
      });
      const data = await response.json();
      
      if (data.success) {
        finalTicketId = data.booking?.id || data.data?.booking?.id || finalTicketId;
      }
    } catch (err) {
      console.error("Failed to call backend:", err);
    }

    setCreatedTicketId(finalTicketId);

    if (typeof window !== 'undefined') {
      const newTrip = {
        id: finalTicketId,
        operator: bookingData?.operator || 'VRL Travels Express',
        busType: bookingData?.busType || 'Volvo B11R AC Sleeper',
        busPlate: bookingData?.busPlate || 'MH-12-QZ-8812',
        from: bookingData?.from || 'Nagpur',
        fromStation: bookingData?.boardingPoint?.location || 'Dharampeth Central Terminal',
        depTime: bookingData?.depTime || '20:30',
        depDate: bookingData?.date || 'Tomorrow, 24 Oct',
        to: bookingData?.to || 'Pune',
        toStation: bookingData?.droppingPoint?.location || 'Swargate Express Terminal',
        arrTime: bookingData?.arrTime || '07:00',
        arrDate: 'Next Day',
        seats: passengers.map(p => p.seat),
        passengerCount: passengers.length,
        passengers: passengers,
        totalFare: grandTotal,
        discountAmount: discountAmount || 0,
        couponCode: appliedCoupon?.code || null,
        driverName: 'Sunil Sharma',
        driverPhone: '+91-8208024895',
        currentLocation: 'Terminal Bay (Scheduled)',
        speed: '0 km/h',
        nextStop: 'Departure Scheduled',
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
      };

      try {
        const u = getStoredUser();
        const userTripsKey = u?.id ? `user_trips_${u.id}` : (u?.phone ? `user_trips_${u.phone}` : 'user_trips');
        const existingRaw = localStorage.getItem(userTripsKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(userTripsKey, JSON.stringify([newTrip, ...(Array.isArray(existing) ? existing : [])]));
        localStorage.removeItem('pending_booking');
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('pending_booking');
          sessionStorage.removeItem('active_checkout_flow');
        }
      } catch (err) {
        console.error('Failed to save trip to localStorage:', err);
      }
    }

    setIsProcessing(false);
    setIsSuccessModalOpen(true);
  };

  const handleShareTicket = async () => {
    const routeTitle = `${bookingData?.from || 'Nagpur'} ➔ ${bookingData?.to || 'Pune'}`;
    const seatList = passengers.map(p => p.seat).join(', ');
    const shareText = `🎟️ Boarding Pass #${createdTicketId}\nRoute: ${routeTitle}\nDate: ${bookingData?.date || 'Tomorrow, 24 Oct'}\nSeats: ${seatList}\nBus: ${bookingData?.busPlate || 'MH-12-QZ-8812'} (${bookingData?.operator || 'Luxury Gold Express'})\nTotal Paid: ₹${grandTotal}`;
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/track-bus/${createdTicketId}` : '';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Boarding Pass #${createdTicketId}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\nTrack: ${shareUrl}`);
        setShareToast('Ticket details copied to clipboard!');
        setTimeout(() => setShareToast(''), 3000);
      } catch (err) {
        setShareToast('Ticket generated successfully!');
      }
    } else {
      setShareToast('Ticket generated successfully!');
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-4">
          <div className="w-10 h-10 border-4 border-brand-scarlet border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-base font-bold text-slate-800 font-serif">Validating Booking Flow...</h2>
          <p className="text-xs text-slate-500">Checking seat reservation status...</p>
        </div>
      </div>
    );
  }

  if (!hasValidBooking || !bookingData || passengers.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <span className="material-symbols-outlined text-[32px]">block</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 font-serif">Direct Access Blocked</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct URL access to /checkout is not allowed. Please search for bus routes, choose a bus, and select your seats to initiate checkout.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-scarlet text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-brand-hover transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Go to Bus Search</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AuthGuard
      title="Login to Complete Booking"
      subtitle="Please log in or create an account to proceed with seat reservation and instant ticket confirmation."
      redirectTo="/search"
    >
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
        <Header />

      {/* TOP STEPPER HEADER */}
      <div className="bg-white border-b border-slate-200/90 shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-16 sm:top-18 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/select-seats"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-scarlet border border-slate-200 flex items-center justify-center transition-all shadow-sm"
              title="Back to Seat Picker"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg font-serif font-bold text-slate-900">Checkout &amp; Booking Confirmation</h1>
              <p className="text-xs text-slate-500">
                {bookingData?.from} ➔ {bookingData?.to} • {bookingData?.busType} ({bookingData?.busPlate})
              </p>
            </div>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              ✓ Seats Selected ({passengers.map(p => p.seat).join(', ')})
            </span>
            <span className="text-slate-300">➔</span>
            <span className="px-3 py-1 rounded-full bg-brand-scarlet text-white shadow-sm">
              Passenger &amp; Payment
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CHECKOUT ARENA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PASSENGER FORM, ADDONS, PAYMENT */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* JOURNEY SNAPSHOT BANNER */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-extrabold text-brand-scarlet uppercase tracking-wider">
                  {bookingData?.operator || 'Verified Fleet'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                  {bookingData?.busPlate}
                </span>
              </div>
              <div className="text-base font-serif font-bold text-slate-900">
                {bookingData?.from} ({bookingData?.depTime || 'Scheduled'}{bookingData?.boardingPoint?.location ? `, ${bookingData.boardingPoint.location}` : ''}) ➔ {bookingData?.to} ({bookingData?.arrTime || 'Scheduled'}{bookingData?.droppingPoint?.location ? `, ${bookingData.droppingPoint.location}` : ''})
              </div>
              
              {/* HORIZONTAL SEATS SUMMARY BADGES */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-bold text-slate-500">Reserved Seats:</span>
                {passengers.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-extrabold text-xs shadow-xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span>Seat {p.seat}</span>
                  </span>
                ))}
                <span className="text-xs text-slate-400">• {bookingData?.date}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
              <span>0% Aggregator Markup Guarantee</span>
            </div>
          </div>

          {/* HORIZONTALLY VISIBLE SELECTED SEATS CARD WITH MINI-CHASSIS BLUEPRINT */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">airline_seat_recline_extra</span>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Your Reserved Seats ({passengers.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Bus Coach: {bookingData?.busPlate || 'MH-12-QZ-8812'}
              </span>
            </div>

            {/* Horizontal Seat Chips (Side-by-Side) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/40 rounded-2xl border-2 border-emerald-200 min-w-[210px] shrink-0 shadow-xs hover:shadow-sm transition-all"
                >
                  {/* Seat Graphic Cushion Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex flex-col items-center justify-center font-bold shadow-md shadow-emerald-500/20 shrink-0">
                    <span className="text-[9px] uppercase font-mono tracking-tighter opacity-80 leading-none">SEAT</span>
                    <span className="text-base font-extrabold leading-none mt-0.5">{p.seat}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">Seat {p.seat}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {idx === 0 ? 'Primary' : `Co-Pax ${idx}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold truncate mt-0.5">
                      {p.name || `Traveler ${idx + 1}`}
                    </p>
                    <span className="text-[11px] font-extrabold text-emerald-700">
                      ₹{Math.round(baseFare / (passengers.length || 1))} / seat
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal Bus Cabin Visualizer */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">directions_bus</span>
                  <span>Bus Cabin Layout (Horizontal Seat Map)</span>
                </span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>Green = Your Selected Seats</span>
                </span>
              </div>

              {/* Mobile Swipe Hint */}
              <div className="text-[10px] text-slate-500 font-medium mb-1.5 flex items-center gap-1 sm:hidden">
                <span>⇄ Swipe to view coach layout</span>
              </div>

              {/* Compact Horizontal Bus Frame */}
              <div className="w-full overflow-x-auto pb-1 custom-scrollbar">
                <div className="min-w-[660px] bg-slate-100/90 rounded-2xl border-2 border-slate-300 p-2.5 flex items-center gap-3">
                  
                  {/* Front / Driver Area */}
                  <div className="w-14 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-300 pr-2">
                    <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center bg-white shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">FRONT</span>
                  </div>

                  {/* 2 Horizontal Rows of Seats matching blueprint */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    {/* Top Row: 1 to 10 */}
                    <div className="flex justify-between items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                        const seatStr = String(num);
                        const isSelected = passengers.some(p => String(p.seat).toUpperCase() === seatStr || String(p.seat).toUpperCase() === `L${seatStr}`);
                        return (
                          <div
                            key={num}
                            className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-extrabold transition-all border ${
                              isSelected
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300 scale-105 z-10'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                            title={`Seat ${num} ${isSelected ? '(Your Selected Seat)' : ''}`}
                          >
                            {isSelected ? `✓ ${num}` : num}
                          </div>
                        );
                      })}
                    </div>

                    {/* Aisle */}
                    <div className="text-center text-[8px] font-extrabold text-slate-400 tracking-[0.4em] uppercase py-0.5">
                      AISLE
                    </div>

                    {/* Bottom Row: 11 to 20 */}
                    <div className="flex justify-between items-center gap-1">
                      {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => {
                        const seatStr = String(num);
                        const isSelected = passengers.some(p => String(p.seat).toUpperCase() === seatStr || String(p.seat).toUpperCase() === `L${seatStr}`);
                        return (
                          <div
                            key={num}
                            className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-extrabold transition-all border ${
                              isSelected
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300 scale-105 z-10'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                            title={`Seat ${num} ${isSelected ? '(Your Selected Seat)' : ''}`}
                          >
                            {isSelected ? `✓ ${num}` : num}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rear Exit */}
                  <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center border-l border-slate-300 pl-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">door_open</span>
                    <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">EXIT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">contact_mail</span>
              <span>Contact Information (For Ticket &amp; WhatsApp Sync)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-200 text-xs font-bold focus:border-brand-scarlet outline-none"
                  placeholder="your.name@gmail.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Mobile Number (WhatsApp)</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-200 text-xs font-bold focus:border-brand-scarlet outline-none"
                  placeholder="+91-8208024895"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappSync}
                onChange={(e) => setWhatsappSync(e.target.checked)}
                className="w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet"
              />
              <span>Send instant WhatsApp PDF ticket &amp; .ics calendar invite to this mobile number</span>
            </label>
          </div>

          {/* PASSENGER DETAILS FORM (Horizontal Multi-Column Grid) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-brand-scarlet">group</span>
                <span>Passenger Details</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  const autofilled = passengers.map((p, i) => {
                    if (i === 0) return { ...p, name: 'Rajesh Patel', age: '34', gender: 'male' };
                    if (i === 1) return { ...p, name: 'Sneha Patel', age: '31', gender: 'female' };
                    return { ...p, name: `Traveler ${i + 1}`, age: '28', gender: 'male' };
                  });
                  setPassengers(autofilled);
                }}
                className="text-[11px] font-bold text-brand-scarlet hover:underline cursor-pointer"
              >
                Autofill Saved Profile
              </button>
            </div>

            {/* HORIZONTAL GRID FOR PASSENGER FORMS */}
            <div className={`grid gap-4 ${passengers.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {passengers.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-brand-scarlet bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      Passenger {idx + 1} — Seat {p.seat}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {idx === 0 ? 'Primary Traveler' : 'Co-Traveler'}
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
                            const updated = [...passengers];
                            updated[idx].name = selectedProfile.name;
                            updated[idx].age = String(selectedProfile.age);
                            updated[idx].gender = selectedProfile.gender?.toLowerCase() || 'male';
                            setPassengers(updated);
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

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold outline-none focus:border-brand-scarlet"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Age</label>
                      <input
                        type="number"
                        value={p.age}
                        onChange={(e) => updatePassenger(idx, 'age', e.target.value)}
                        placeholder="35"
                        className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold outline-none focus:border-brand-scarlet"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gender</label>
                      <select
                        value={p.gender}
                        onChange={(e) => updatePassenger(idx, 'gender', e.target.value)}
                        className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold outline-none focus:border-brand-scarlet"
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
          </div>

          {/* ADD-ON SERVICES SELECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">extension</span>
              <span>Enhance Your Journey (Add-ons)</span>
            </h3>

            <div className="space-y-3">
              {/* Insurance */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-scarlet transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">🛡️ Travel Insurance Protection</span>
                    <span className="text-xs font-bold text-brand-scarlet">+₹15 / person</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Covers accidental medical expenses up to ₹5,00,000 &amp; lost baggage assistance during journey.
                  </p>
                </div>
              </label>

              {/* Satvik Meal Box */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-scarlet transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSatvikMeal}
                  onChange={(e) => setIncludeSatvikMeal(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">🍱 Hot Pure Satvik Dinner Box</span>
                    <span className="text-xs font-bold text-brand-scarlet">+₹149 / meal</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Fresh 100% Satvik veg dinner (paneer sabzi, roti, rice, sweet) delivered at bus boarding gate.
                  </p>
                </div>
              </label>

              {/* Hotel Pickup Cab */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-scarlet transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCabPickup}
                  onChange={(e) => setIncludeCabPickup(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-scarlet focus:ring-brand-scarlet"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">🚕 Doorstep Cab Pickup (Nagpur)</span>
                    <span className="text-xs font-bold text-brand-scarlet">+₹199 total</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    Private AC Sedan pick-up from your doorstep in Nagpur directly to Dharampeth boarding terminal.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* PAYMENT METHOD MATRIX */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-brand-scarlet">payments</span>
              <span>Select Payment Method</span>
            </h3>

            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'bg-brand-scarlet text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>⚡ Instant UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'bg-brand-scarlet text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>💳 Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'bg-brand-scarlet text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏦 NetBanking</span>
              </button>
            </div>

            {/* UPI Simulated Scanner */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-24 h-24 rounded-2xl bg-white p-2 border border-slate-300 shadow-sm shrink-0 flex items-center justify-center">
                  {/* Mock QR graphic */}
                  <div className="w-full h-full bg-slate-900 rounded-lg p-1 text-white font-mono text-[8px] flex items-center justify-center text-center">
                    [ GPay / PhonePe / Paytm QR ]
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Scan &amp; Pay via Any UPI App</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Google Pay, PhonePe, Paytm, or BHIM. Zero processing fee charged.
                  </p>
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                    UPI ID: payment@icici
                  </div>
                </div>
              </div>
            )}

            {/* Credit Card Simulated Inputs */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8892"
                    className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold font-mono outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08 / 28"
                      className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold font-mono outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CVV</label>
                    <input
                      type="password"
                      defaultValue="782"
                      className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Bank Selection */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((bank, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:border-brand-scarlet text-center transition-all"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: FINAL FARE BREAKDOWN & PAY BUTTON */}
        <div className="lg:col-span-4 space-y-6">

          {/* COUPON / PROMO CODE CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-600">sell</span>
                <span>Apply Coupon / Offer</span>
              </h3>
              {appliedCoupon && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                  APPLIED
                </span>
              )}
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-900">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      {appliedCoupon.discountPercentage}% OFF (Saved ₹{discountAmount})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      if (couponError) setCouponError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="ENTER COUPON CODE"
                    className="flex-1 bg-slate-50 text-slate-900 uppercase font-mono font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-scarlet outline-none"
                  />
                  <button
                    type="button"
                    disabled={couponLoading || !couponCode.trim()}
                    onClick={() => handleApplyCoupon()}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                      couponCode.trim()
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {couponLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>

                {/* Warning message below input when coupon is invalid */}
                {couponError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0">error</span>
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Suggested active coupons */}
                <div className="pt-1.5 text-[11px] text-slate-500 flex items-center flex-wrap gap-1.5">
                  <span>Suggested:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('YATRA10');
                      handleApplyCoupon('YATRA10');
                    }}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold hover:bg-amber-100 transition-all cursor-pointer"
                  >
                    YATRA10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('YATRA2026');
                      handleApplyCoupon('YATRA2026');
                    }}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold hover:bg-amber-100 transition-all cursor-pointer"
                  >
                    YATRA2026 (15% OFF)
                  </button>
                </div>
              </div>
            )}

            {couponSuccess && !couponError && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">verified</span>
                <span>{couponSuccess}</span>
              </div>
            )}
          </div>

          {/* FARE BREAKDOWN CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 sticky top-36">
            <h3 className="text-base font-serif font-bold text-slate-900 pb-3 border-b border-slate-100">
              Fare Breakdown
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Seats Fare ({passengers.length} {passengers.length === 1 ? 'Seat' : 'Seats'})</span>
                <span className="font-bold text-slate-900">₹{baseFare}</span>
              </div>

              {includeInsurance && (
                <div className="flex justify-between">
                  <span>Travel Insurance ({passengers.length}x ₹15)</span>
                  <span className="font-bold text-slate-900">₹{insuranceCost}</span>
                </div>
              )}

              {includeSatvikMeal && (
                <div className="flex justify-between">
                  <span>Pure Satvik Dinner Box ({passengers.length}x ₹149)</span>
                  <span className="font-bold text-slate-900">₹{mealCost}</span>
                </div>
              )}

              {includeCabPickup && (
                <div className="flex justify-between">
                  <span>Doorstep Cab Pickup</span>
                  <span className="font-bold text-slate-900">₹{cabCost}</span>
                </div>
              )}

              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <span>🏷️ Coupon Discount ({appliedCoupon.code})</span>
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-900">₹{taxes}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Aggregator Markup</span>
                <span>₹0 (FREE)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-xl font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-brand-scarlet">₹{grandTotal}</span>
              </div>
            </div>

            {/* CONFIRMATION PAY BUTTON */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>{isProcessing ? 'PROCESSING...' : `PAY ₹${grandTotal} & CONFIRM TICKET`}</span>
            </button>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              🔒 256-bit SSL Encrypted Transaction. Instant WhatsApp PDF ticket dispatch.
            </div>
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
          onClick={handlePayNow}
          disabled={isProcessing}
          className={`py-2.5 px-5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>{isProcessing ? 'PROCESSING...' : 'PAY NOW'}</span>
        </button>
      </div>

      {/* SIMULATED SUCCESS TICKET CONFIRMATION MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border border-slate-200 shadow-2xl space-y-4">
            
            {/* SUCCESS CHECKMARK ANIMATION */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">Booking Confirmed!</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">Ticket #{createdTicketId} Locked</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your luxury berths <strong>{passengers.map(p => p.seat).join(', ')}</strong> on {bookingData?.busType || 'Volvo B11R AC'} (<strong className="text-slate-800">{bookingData?.busPlate || 'MH-12-QZ-8812'}</strong>) have been reserved.
              </p>
            </div>

            {/* DETAILS BAND */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Bus Operator:</span>
                <span className="text-slate-900 font-bold">{bookingData?.operator || 'VRL Travels Express'}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Plate:</span>
                <span className="font-mono text-brand-scarlet font-bold">{bookingData?.busPlate || 'MH-12-QZ-8812'}</span>
              </div>
              <div className="flex justify-between">
                <span>Boarding Time:</span>
                <span className="text-slate-900 font-bold">
                  {bookingData?.date || 'Tomorrow'}, {bookingData?.depTime || '20:30'} ({bookingData?.boardingPoint?.location || 'Dharampeth'})
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-₹{discountAmount} ({appliedCoupon.code})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="text-emerald-700 font-extrabold">₹{grandTotal}</span>
              </div>
            </div>

            {shareToast && (
              <div className="py-1 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
                {shareToast}
              </div>
            )}

            {/* DISPATCH & NAVIGATION ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBoardingPassOpen(true)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-amber-400/30"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400">print</span>
                <span>DOWNLOAD / PRINT BOARDING PASS (PDF)</span>
              </button>

              <Link
                href="/profile"
                className="w-full py-3 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                <span>VIEW MY JOURNEYS &amp; TICKETS</span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer border border-slate-200"
                >
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Go to Home Page</span>
                </Link>

                <Link
                  href={`/track-bus/${createdTicketId}`}
                  className="py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">my_location</span>
                  <span>Track Bus Live</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-500 font-semibold">
                <button
                  type="button"
                  onClick={handleShareTicket}
                  className="hover:text-brand-scarlet text-slate-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                  title="Share ticket details"
                >
                  <span className="material-symbols-outlined text-[16px] text-brand-scarlet">share</span>
                  <span>Share Ticket</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setShareToast('Calendar event (.ics) synced to your device calendar!');
                    setTimeout(() => setShareToast(''), 3000);
                  }}
                  className="hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">calendar_add_on</span>
                  <span>Sync Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE BOARDING PASS MODAL */}
      <PrintableBoardingPassModal
        isOpen={isBoardingPassOpen}
        onClose={() => setIsBoardingPassOpen(false)}
        ticketData={{
          id: createdTicketId,
          bookingId: createdTicketId,
          operator: bookingData?.operator || 'Luxury Gold Express',
          busType: bookingData?.busType || 'Volvo 9600 Multi-Axle 2+1 AC Sleeper',
          busPlate: bookingData?.busPlate || 'MH-12-QZ-8812',
          from: bookingData?.from || 'Nagpur',
          fromStation: bookingData?.boardingPoint?.location || 'Central Hub, Dharampeth',
          to: bookingData?.to || 'Pune',
          toStation: bookingData?.droppingPoint?.location || 'Swargate Lounge, Pune',
          depTime: bookingData?.depTime || '20:30',
          depDate: bookingData?.date || 'Scheduled Journey',
          arrTime: bookingData?.arrTime || '07:00',
          arrDate: 'Next Morning',
          duration: bookingData?.duration || '10h 30m',
          seats: passengers.map(p => p.seat),
          passengers: passengers,
          totalFare: grandTotal,
          driverName: 'Sunil Sharma (Verified Captain)',
          driverPhone: '+91-8208024895',
          reportingTime: '20:00 (30 mins before departure)',
        }}
      />

        <Footer />
      </div>
    </AuthGuard>
  );
}
