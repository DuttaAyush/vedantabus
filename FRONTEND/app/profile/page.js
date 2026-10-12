'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';
import AuthGuard from '@/components/auth/AuthGuard';
import { getStoredUser, getUserAvatar } from '@/lib/auth';
import PrintableBoardingPassModal from '@/components/site/PrintableBoardingPassModal';

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past' | 'wallet' | 'passengers'
  const [selectedTrackBus, setSelectedTrackBus] = useState(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [shareToast, setShareToast] = useState('');
  const [isBoardingPassModalOpen, setIsBoardingPassModalOpen] = useState(false);
  const [selectedBoardingPassTrip, setSelectedBoardingPassTrip] = useState(null);

  // Cancellation Modal State
  const [cancelModalTrip, setCancelModalTrip] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');

  const openCancelModal = (trip) => {
    setCancelModalTrip(trip);
    setCancelReason('Change of travel plans');
    setIsCancelModalOpen(true);
  };

  const openBoardingPassModal = (trip) => {
    setSelectedBoardingPassTrip({
      id: trip.bookingId || trip.id,
      bookingId: trip.bookingId || trip.id,
      operator: trip.operator || (trip.isPackage ? 'Spiritual Tour Fleet' : 'Luxury Gold Express'),
      busType: trip.busType || (trip.isPackage ? (trip.transportMode === 'private-suv' ? 'Innova Crysta SUV' : 'BharatBenz Luxury Coach') : 'Volvo 9600 AC Sleeper'),
      busPlate: trip.busPlate || 'MH-12-QZ-8812',
      from: trip.from || (trip.isPackage ? (trip.route?.split('➔')[0]?.trim() || 'Nagpur') : 'Nagpur'),
      fromStation: trip.fromStation || `${trip.from || 'Nagpur'} Central Terminal`,
      to: trip.to || (trip.isPackage ? (trip.route?.split('➔')[1]?.trim() || trip.title) : 'Pune'),
      toStation: trip.toStation || `${trip.to || 'Pune'} Terminal Lounge`,
      depTime: trip.depTime || '20:30',
      depDate: trip.depDate || trip.date || trip.departureDate || 'Scheduled Journey',
      arrTime: trip.arrTime || '07:00',
      arrDate: trip.arrDate || 'Next Morning',
      duration: trip.duration || '10h 30m',
      seats: Array.isArray(trip.seats) ? trip.seats : (trip.seatNumbers ? trip.seatNumbers : [trip.seats || 'L1']),
      passengers: trip.passengers || trip.travelers || [],
      totalFare: trip.totalFare || trip.totalAmount || trip.paidAmount || 850,
      driverName: trip.driverName || 'Sunil Sharma (Verified Captain)',
      driverPhone: trip.driverPhone || '+91-8208024895',
      reportingTime: '30 mins before scheduled departure',
      isPackage: !!trip.isPackage,
      packageTitle: trip.title || '',
      hotelTier: trip.hotelTier || '',
    });
    setIsBoardingPassModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancelModalTrip) return;
    setIsCancelling(true);
    try {
      if (!cancelModalTrip.isPackage) {
        await apiFetch(`/api/bookings/${cancelModalTrip.id}`, { method: 'DELETE' });
      } else {
        await apiFetch(`/api/admin/package-bookings/${cancelModalTrip.id || cancelModalTrip.bookingId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'Cancelled' })
        });
      }
      setUpcomingTrips((prev) =>
        prev.map((t) => (t.id === cancelModalTrip.id ? { ...t, status: 'Cancelled' } : t))
      );

      if (typeof window !== 'undefined') {
        const localUser = getStoredUser();
        const userTripsKey = localUser?.id ? `user_trips_${localUser.id}` : (localUser?.phone ? `user_trips_${localUser.phone}` : 'user_trips');
        const stored = localStorage.getItem(userTripsKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const updated = parsed.map((t) => (t.id === cancelModalTrip.id ? { ...t, status: 'Cancelled' } : t));
            localStorage.setItem(userTripsKey, JSON.stringify(updated));
          } catch {}
        }
      }
      setIsCancelModalOpen(false);
      setCancelModalTrip(null);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setUpcomingTrips((prev) =>
        prev.map((t) => (t.id === cancelModalTrip.id ? { ...t, status: 'Cancelled' } : t))
      );
      setIsCancelModalOpen(false);
      setCancelModalTrip(null);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    const localUser = getStoredUser();
    if (localUser) {
      setUserProfile(localUser);
    }

    const userTripsKey = localUser?.id ? `user_trips_${localUser.id}` : (localUser?.phone ? `user_trips_${localUser.phone}` : 'user_trips');
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(userTripsKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setUpcomingTrips(parsed);
          }
        } else {
          setUpcomingTrips([]);
        }
      } catch (err) {
        console.error('Failed to load trips from localStorage:', err);
      }
    } else {
      setUpcomingTrips([]);
    }

    // Load user saved passengers
    const passengersKey = localUser?.id ? `saved_passengers_${localUser.id}` : (localUser?.phone ? `saved_passengers_${localUser.phone}` : 'saved_passengers');
    if (typeof window !== 'undefined') {
      try {
        const storedP = localStorage.getItem(passengersKey) || localStorage.getItem('saved_passengers');
        if (storedP) {
          const parsedP = JSON.parse(storedP);
          if (Array.isArray(parsedP) && parsedP.length > 0) {
            setSavedPassengers(parsedP);
          } else {
            const defaults = [
              { id: 'sp1', name: localUser?.name || 'Rajesh Patel', age: 34, gender: 'Male', relation: 'Self' },
              { id: 'sp2', name: 'Sneha Patel', age: 31, gender: 'Female', relation: 'Spouse' },
              { id: 'sp3', name: 'Aarav Patel', age: 8, gender: 'Male', relation: 'Child' },
              { id: 'sp4', name: 'Suresh Patel', age: 62, gender: 'Male', relation: 'Father' },
            ];
            setSavedPassengers(defaults);
            localStorage.setItem(passengersKey, JSON.stringify(defaults));
          }
        } else {
          const defaults = [
            { id: 'sp1', name: localUser?.name || 'Rajesh Patel', age: 34, gender: 'Male', relation: 'Self' },
            { id: 'sp2', name: 'Sneha Patel', age: 31, gender: 'Female', relation: 'Spouse' },
            { id: 'sp3', name: 'Aarav Patel', age: 8, gender: 'Male', relation: 'Child' },
            { id: 'sp4', name: 'Suresh Patel', age: 62, gender: 'Male', relation: 'Father' },
          ];
          setSavedPassengers(defaults);
          localStorage.setItem(passengersKey, JSON.stringify(defaults));
        }
      } catch {}
    }

    // Fetch user profile from DB
    apiFetch('/api/users/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data.data || data.name)) {
          setUserProfile(data.data || data);
        }
      })
      .catch(() => {});

    // Fetch user bookings from DB
    apiFetch('/api/users/my-bookings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return; // API failed — keep whatever is in localStorage

        const busBookings = data?.data?.busBookings || data?.busBookings || [];
        const packageBookings = data?.data?.packageBookings || data?.packageBookings || [];
        
        const mappedBus = busBookings.map(b => ({
          id: b.id,
          operator: b.trip?.bus?.busStyle === 'sleeper' ? 'Luxury Gold Express' : 'Express Fleet',
          busType: b.trip?.bus?.type || 'Volvo Multi-Axle AC Sleeper',
          busPlate: b.trip?.bus?.plateNumber || 'MH-12-QZ-8812',
          from: b.trip?.route?.originCity || 'Nagpur',
          fromStation: `${b.trip?.route?.originCity || 'Nagpur'} Terminal`,
          depTime: b.trip?.departureDatetime ? new Date(b.trip.departureDatetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '20:30',
          depDate: b.trip?.departureDatetime ? new Date(b.trip.departureDatetime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Scheduled',
          to: b.trip?.route?.destinationCity || 'Pune',
          toStation: `${b.trip?.route?.destinationCity || 'Pune'} Terminal`,
          arrTime: b.trip?.arrivalDatetime ? new Date(b.trip.arrivalDatetime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : '07:00',
          arrDate: 'Scheduled',
          seats: b.seatNumbers || ['L1'],
          passengerCount: b.seatNumbers?.length || 1,
          totalFare: Number(b.totalAmount || 850),
          status: b.status || 'Confirmed',
          driverName: 'Assigned Driver',
          driverPhone: '+91-8208024895',
          currentLocation: 'Terminal Bay (Scheduled)',
          speed: '0 km/h',
          nextStop: 'Departure Scheduled',
        }));

        const mappedPkg = packageBookings.map(pb => ({
          id: pb.id,
          bookingId: pb.id,
          isPackage: true,
          pkgId: pb.packageId,
          title: pb.package?.title || 'Tour Package',
          subtitle: pb.package?.category || 'Holiday',
          category: pb.package?.category || 'Spiritual',
          duration: `${pb.package?.durationDays || 5} Days`,
          image: pb.package?.itinerary?.image || '/images/yatra_all_india_spiritual_darshan_bus_tickets_holiday_packages_9.jpg',
          date: new Date(pb.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          travelerCount: pb.travelersCount,
          totalAmount: Number(pb.totalAmount),
          status: pb.status,
        }));

        const dbMapped = [...mappedBus, ...mappedPkg];

        // Merge: DB records take priority over localStorage records (by id)
        // but keep any localStorage records that aren't in the DB yet (just booked, not yet synced)
        setUpcomingTrips(prev => {
          const dbIds = new Set(dbMapped.map(t => t.id));
          const localOnlyTrips = prev.filter(t => !dbIds.has(t.id));
          const merged = [...dbMapped, ...localOnlyTrips];
          // Persist merged list back to localStorage
          if (userTripsKey && typeof window !== 'undefined') {
            localStorage.setItem(userTripsKey, JSON.stringify(merged));
          }
          return merged;
        });
      })
      .catch(() => {}); // Network error — silently keep localStorage data
  }, []);

  const [pastTrips, setPastTrips] = useState([]);

  const [savedPassengers, setSavedPassengers] = useState([]);

  const [selectedPassengerIds, setSelectedPassengerIds] = useState([]);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [passengerFormData, setPassengerFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    relation: 'Family',
  });

  // Manage Account Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');

  const openManageAccountModal = () => {
    const localUser = getStoredUser();
    setAccountFormData({
      name: userProfile?.name || localUser?.name || '',
      email: userProfile?.email || localUser?.email || '',
      phone: userProfile?.phone || localUser?.phone || '',
      password: '',
    });
    setAccountError('');
    setAccountSuccess('');
    setShowAccountPassword(false);
    setIsEditingPassword(false);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    try {
      const payload = {
        name: accountFormData.name.trim(),
        email: accountFormData.email.trim(),
        phone: accountFormData.phone.trim(),
      };
      if (accountFormData.password && accountFormData.password.trim()) {
        payload.password = accountFormData.password.trim();
      }

      const res = await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const updated = data.data;
        setUserProfile(prev => ({ ...prev, ...updated }));
        
        if (typeof window !== 'undefined') {
          const storedUser = getStoredUser() || {};
          const merged = { ...storedUser, ...updated };
          localStorage.setItem('auth_user', JSON.stringify(merged));
          localStorage.setItem('user', JSON.stringify(merged));
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('storage'));
        }

        setAccountSuccess('Account updated successfully!');
        setTimeout(() => {
          setIsAccountModalOpen(false);
          setAccountSuccess('');
        }, 1200);
      } else {
        setAccountError(data.message || 'Failed to update account. Please try again.');
      }
    } catch {
      setAccountError('Network error. Could not connect to server.');
    } finally {
      setAccountLoading(false);
    }
  };

  const toggleSelectPassenger = (id) => {
    if (selectedPassengerIds.includes(id)) {
      setSelectedPassengerIds(selectedPassengerIds.filter((pId) => pId !== id));
    } else {
      setSelectedPassengerIds([...selectedPassengerIds, id]);
    }
  };

  const handleSelectAllPassengers = () => {
    if (selectedPassengerIds.length === savedPassengers.length && savedPassengers.length > 0) {
      setSelectedPassengerIds([]);
    } else {
      setSelectedPassengerIds(savedPassengers.map((p) => p.id));
    }
  };

  const openAddPassengerModal = () => {
    setEditingPassenger(null);
    setPassengerFormData({ name: '', age: '', gender: 'Male', relation: 'Family' });
    setIsPassengerModalOpen(true);
  };

  const openEditPassengerModal = (passenger) => {
    setEditingPassenger(passenger);
    setPassengerFormData({
      name: passenger.name,
      age: passenger.age.toString(),
      gender: passenger.gender,
      relation: passenger.relation,
    });
    setIsPassengerModalOpen(true);
  };

  const openEditSelectedPassengerModal = () => {
    const selectedId = selectedPassengerIds[0];
    const passenger = savedPassengers.find((p) => p.id === selectedId) || savedPassengers[0];
    if (passenger) {
      openEditPassengerModal(passenger);
    }
  };

  const handleDeleteSelectedPassenger = () => {
    if (selectedPassengerIds.length === 0) return;
    const updated = savedPassengers.filter((p) => !selectedPassengerIds.includes(p.id));
    setSavedPassengers(updated);
    setSelectedPassengerIds([]);
    const localUser = getStoredUser();
    const passengersKey = localUser?.id ? `saved_passengers_${localUser.id}` : (localUser?.phone ? `saved_passengers_${localUser.phone}` : 'saved_passengers');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(passengersKey, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleDeletePassenger = (id) => {
    const updated = savedPassengers.filter((p) => p.id !== id);
    setSavedPassengers(updated);
    setSelectedPassengerIds(selectedPassengerIds.filter((pId) => pId !== id));
    const localUser = getStoredUser();
    const passengersKey = localUser?.id ? `saved_passengers_${localUser.id}` : (localUser?.phone ? `saved_passengers_${localUser.phone}` : 'saved_passengers');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(passengersKey, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSavePassenger = (e) => {
    e.preventDefault();
    if (!passengerFormData.name.trim() || !passengerFormData.age) return;

    let updated = [];
    if (editingPassenger) {
      updated = savedPassengers.map((p) =>
        p.id === editingPassenger.id
          ? {
              ...p,
              name: passengerFormData.name.trim(),
              age: parseInt(passengerFormData.age, 10),
              gender: passengerFormData.gender,
              relation: passengerFormData.relation.trim(),
            }
          : p
      );
      setSavedPassengers(updated);
    } else {
      const newId = Date.now();
      const newPassenger = {
        id: newId,
        name: passengerFormData.name.trim(),
        age: parseInt(passengerFormData.age, 10),
        gender: passengerFormData.gender,
        relation: passengerFormData.relation.trim() || 'Traveler',
      };
      updated = [...savedPassengers, newPassenger];
      setSavedPassengers(updated);
      setSelectedPassengerIds([...selectedPassengerIds, newId]);
    }
    const localUser = getStoredUser();
    const passengersKey = localUser?.id ? `saved_passengers_${localUser.id}` : (localUser?.phone ? `saved_passengers_${localUser.phone}` : 'saved_passengers');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(passengersKey, JSON.stringify(updated));
      } catch {}
    }
    setIsPassengerModalOpen(false);
  };

  const openGpsTracker = (trip) => {
    setSelectedTrackBus(trip);
    setIsGpsModalOpen(true);
  };

  return (
    <AuthGuard
      title="Login to View Profile & Bookings"
      subtitle="Please log in or create an account to view your confirmed tickets, bus plates, and saved passenger details."
    >
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
        <Header />

        {/* USER PROFILE HEADER BANNER WITH COMPACT CROPPED PROFILE BG */}
        <div className="relative bg-slate-900 text-slate-900 overflow-hidden shadow-sm">
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/profile_bg.webp"
              alt="Profile Background"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/45 to-transparent pointer-events-none" />
          </div>

          {/* MAIN BANNER CONTAINER - REDUCED HEIGHT & PADDING */}
          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-5 sm:py-6 lg:py-7 relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            {/* LEFT COLUMN: AVATAR & USER DETAILS */}
            <div className="flex items-center gap-3.5 sm:gap-5 pl-2 sm:pl-4 lg:pl-6">
              <div className="relative shrink-0">
                <img
                  src={getUserAvatar(userProfile)}
                  alt="Profile Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-slate-950 tracking-tight">
                    {userProfile?.name || 'Traveller'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 font-extrabold text-[11px] border border-amber-300 shadow-sm flex items-center gap-1 whitespace-nowrap">
                    ⭐ VIP Club Member
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700">
                  {userProfile?.email || 'traveller@VedantaBus.in'} <span className="mx-1 font-normal text-slate-400">|</span> {userProfile?.phone || '+91-8208024895'}
                </p>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 fill-1">verified</span>
                  <span>Verified Account (Assigned Plate Priority)</span>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={openManageAccountModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-sm border border-slate-200 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px] text-slate-600">manage_accounts</span>
                    <span>Manage Account</span>
                  </button>
                </div>
              </div>
            </div>

          {/* CENTER COLUMN: SMALLER SLOGAN WITH RED UNDERLINE */}
          <div className="hidden xl:flex flex-col items-center justify-center text-center px-2">
            <span className="font-serif italic text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-snug drop-shadow-sm transform -rotate-1">
              New Destinations<br />Same You<br />
              <span className="relative inline-block text-slate-900 font-extrabold">
                Just Happier
                <svg className="absolute -bottom-1 left-0 w-full h-1.5 text-red-600" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 50 20 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </div>

          {/* RIGHT COLUMN: 2 COMPACT FROSTED STATS CARDS */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Card 1: Upcoming Trips */}
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md hover:shadow-lg transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">confirmation_number</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  UPCOMING TRIPS
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                  {upcomingTrips.length} Bookings
                </span>
              </div>
              <span className="material-symbols-outlined text-red-500 text-sm group-hover:translate-x-0.5 transition-transform ml-0.5">
                chevron_right
              </span>
            </button>

            {/* Card 2: Wallet */}
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md hover:shadow-lg transition-all cursor-pointer text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">account_balance_wallet</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  MY WALLET
                </span>
                <span className="text-xs sm:text-sm font-black text-red-600 block leading-tight">
                  ₹0
                </span>
              </div>
              <span className="material-symbols-outlined text-red-500 text-sm group-hover:translate-x-0.5 transition-transform ml-0.5">
                chevron_right
              </span>
            </button>
          </div>

        </div>

        {/* BOTTOM OVERLAPPING TAB SWITCHER CAPSULE SHEET */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-16 relative z-20 pb-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full p-1.5 border border-slate-200/80 shadow-lg flex items-center justify-start sm:justify-between overflow-x-auto no-scrollbar touch-pan-x overscroll-x-contain gap-1 sm:gap-2">
            {[
              { label: `Upcoming Trips (${upcomingTrips.length})`, key: 'upcoming', icon: 'confirmation_number' },
              { label: 'Past Journeys & Reviews', key: 'past', icon: 'history' },
              { label: 'Wallet & Points', key: 'wallet', icon: 'account_balance_wallet' },
              { label: `Saved Passengers (${savedPassengers.length})`, key: 'passengers', icon: 'group' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 sm:flex-1 min-w-max sm:min-w-0 py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl sm:rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-brand-scarlet text-white shadow-md shadow-red-600/30'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-8">
        
        {/* TAB 1: UPCOMING TRIPS WITH ASSIGNED BUS PLATE & LIVE GPS TRACKING */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-slate-900">Your Upcoming Confirmed Bookings</h2>
              <span className="text-xs text-slate-500 font-medium">Assigned Bus Plates Locked</span>
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-scarlet flex items-center justify-center border border-red-200">
                  <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-lg font-serif font-bold text-slate-900">No Upcoming Trips Booked</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    You don&apos;t have any active bus or package bookings right now. Search your preferred route or explore our spiritual packages to begin your yatra.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-scarlet text-white font-bold text-xs shadow-md shadow-red-600/20 hover:bg-brand-hover transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                    <span>Search Bus Routes</span>
                  </Link>
                  <Link
                    href="/spiritual"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">temple_hindu</span>
                    <span>Explore Devsthan Yatras</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
              {upcomingTrips.map((trip) => {
                if (trip.isPackage) {
                  const isSpiritual = trip.category?.toLowerCase().includes('spiritual') || trip.category?.toLowerCase().includes('pilgrimage');
                  return (
                    <div
                      key={trip.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                      {/* TOP HEADER BAND */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                              isSpiritual
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-teal-100 text-teal-800 border-teal-300'
                            }`}>
                              {isSpiritual ? '🛕 DEVSTHAN PILGRIMAGE CIRCUIT' : '🏖️ CURATED HOLIDAY PACKAGE'}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500">#{trip.bookingId || trip.id}</span>
                          </div>
                          <h3 className="text-lg font-serif font-bold text-slate-900">{trip.title}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{trip.subtitle || trip.category}</p>
                        </div>

                        {/* CATEGORY DURATION PILL */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow-md shrink-0">
                          <span className="material-symbols-outlined text-[24px] text-amber-400">
                            {isSpiritual ? 'temple_hindu' : 'luggage'}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                              TOUR DURATION
                            </span>
                            <span className="text-sm font-extrabold text-amber-300">
                              {trip.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PACKAGE DETAILS & CUSTOMIZATION SNAPSHOT */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-2">
                        {/* Package Thumbnail & Dates */}
                        <div className="md:col-span-4 flex items-center gap-3">
                          {trip.image && (
                            <img
                              src={trip.image}
                              alt={trip.title}
                              className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-200 shrink-0"
                            />
                          )}
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Departure Date</span>
                            <div className="text-sm font-bold text-slate-900">{trip.date || trip.departureDate || 'Scheduled in 7 Days'}</div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Voucher Active
                            </span>
                          </div>
                        </div>

                        {/* Custom Inclusions / Upgrades */}
                        <div className="md:col-span-5 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-brand-scarlet">hotel</span>
                            <span>Stay: <strong>{trip.hotelTier === '5star' ? '5★ Luxury Resort' : trip.hotelTier === '4star' ? '4★ Deluxe Resort' : '3★ Standard Hotel'}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-brand-scarlet">directions_bus</span>
                            <span>Vehicle: <strong>{trip.transportMode === 'private-suv' ? 'Private Innova Crysta SUV' : trip.transportMode === 'private-sedan' ? 'Private AC Sedan' : 'BharatBenz AC Pushback Coach'}</strong></span>
                          </div>
                          {trip.selectedAddons && trip.selectedAddons.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-amber-600">tune</span>
                              <span>Add-ons: <strong>{trip.selectedAddons.map(a => a.label).join(', ')}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Price & Travelers */}
                        <div className="md:col-span-3 text-left md:text-right space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            {trip.travelerCount || (trip.travelers && trip.travelers.length) || 1} Traveler(s)
                          </span>
                          <div className="text-xl font-black text-slate-900">
                            ₹{(trip.totalAmount || trip.paidAmount || 0).toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Fully Paid
                          </span>
                        </div>
                      </div>

                      {/* BOTTOM ACTION BUTTONS */}
                      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
                          <span>Instant Confirmation • All-Inclusive Guide &amp; Permits</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {trip.status === 'Cancelled' ? (
                            <span className="px-3.5 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">cancel</span>
                              <span>Package Cancelled</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCancelModal(trip)}
                              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold text-xs border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">cancel</span>
                              <span>Cancel Package</span>
                            </button>
                          )}

                          <Link
                            href={`/customize-package/${trip.pkgId || 'chardham'}`}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">tune</span>
                            <span>View / Re-Customize</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => openBoardingPassModal(trip)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-brand-scarlet">print</span>
                            <span>Tour Voucher &amp; Pass</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const shareText = `🎉 Confirmed Package #${trip.bookingId || trip.id}\nPackage: ${trip.title}\nDuration: ${trip.duration}\nHotel: ${trip.hotelTier === '5star' ? '5★ Luxury' : trip.hotelTier === '4star' ? '4★ Deluxe' : '3★ Standard'}\nAmount: ₹${(trip.totalAmount || trip.paidAmount || 0).toLocaleString('en-IN')}`;
                              if (typeof navigator !== 'undefined' && navigator.share) {
                                navigator.share({
                                  title: `Confirmed Package #${trip.bookingId || trip.id}`,
                                  text: shareText,
                                  url: typeof window !== 'undefined' ? window.location.origin + '/packages' : '',
                                }).catch(() => {});
                              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(shareText);
                                setShareToast('Tour package details copied to clipboard!');
                                setTimeout(() => setShareToast(''), 3000);
                              } else {
                                setShareToast('Tour package details copied to clipboard!');
                                setTimeout(() => setShareToast(''), 3000);
                              }
                            }}
                            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-brand-scarlet hover:text-white border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                            title="Share Tour Package"
                          >
                            <span className="material-symbols-outlined text-[18px]">share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* TOP ROW: BADGE, OPERATOR, AMENITIES, BUS REGISTRATION */}
                    <div className="p-5 sm:px-7 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Badge + Operator Title + Bus Specs */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                              trip.status === 'Cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[14px] ${
                                trip.status === 'Cancelled' ? 'text-red-500' : 'text-emerald-600'
                              }`}
                            >
                              {trip.status === 'Cancelled' ? 'cancel' : 'check_circle'}
                            </span>
                            <span>{trip.status === 'Cancelled' ? 'CANCELLED TICKET' : 'CONFIRMED TICKET'}</span>
                          </span>
                          <span className="text-slate-300 font-normal">|</span>
                          <span className="text-xs font-mono font-semibold text-slate-500">#{trip.id}</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight pt-0.5">
                          {trip.operator}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {trip.busType}
                        </p>
                      </div>

                      {/* Middle: Horizontal Amenities */}
                      <div className="hidden xl:flex items-center gap-6 text-slate-700">
                        {/* AC */}
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">ac_unit</span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                              {trip.category === 'sleeper' ? 'AC Sleeper' : 'AC Seater'}
                            </span>
                            <span className="text-[10px] text-slate-400 leading-tight">
                              {trip.category === 'sleeper' ? '2+1 Layout' : '2+2 Layout'}
                            </span>
                          </div>
                        </div>

                        {/* Free WiFi */}
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">wifi</span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block leading-tight">Free WiFi</span>
                            <span className="text-[10px] text-slate-400 leading-tight">On Board</span>
                          </div>
                        </div>

                        {/* Charging */}
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">power</span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block leading-tight">Charging</span>
                            <span className="text-[10px] text-slate-400 leading-tight">USB Ports</span>
                          </div>
                        </div>

                        {/* Reclining Seats */}
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] text-slate-400">
                            {trip.category === 'sleeper' ? 'hotel' : 'airline_seat_recline_extra'}
                          </span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                              {trip.category === 'sleeper' ? 'Comfort Berth' : 'Reclining Seats'}
                            </span>
                            <span className="text-[10px] text-slate-400 leading-tight">
                              {trip.category === 'sleeper' ? 'Clean Linen' : 'Extra Legroom'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Assigned Bus Registration Badge */}
                      <div className="bg-[#0B1527] rounded-2xl px-4 py-2.5 flex items-center gap-3 text-white shrink-0 shadow-sm self-start lg:self-auto">
                        <span className="material-symbols-outlined text-[24px] text-amber-400">directions_bus</span>
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
                            ASSIGNED BUS REGISTRATION
                          </span>
                          <span className="text-base font-mono font-bold text-amber-300">
                            {trip.busPlate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE ROW: BOARDING, TIMELINE WITH SEATS, DROPPING */}
                    <div className="px-5 sm:px-7 py-3 sm:py-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Boarding Info */}
                      <div className="md:col-span-4 flex items-start gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                            BOARDING
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                            {trip.depTime}
                          </div>
                        </div>
                        <div className="space-y-0.5 pt-0.5">
                          <div className="text-sm font-bold text-slate-900">{trip.from}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]" title={trip.fromStation}>
                            {trip.fromStation}
                          </div>
                          <div className="text-xs font-semibold text-brand-scarlet">
                            {trip.depDate}
                          </div>
                        </div>
                      </div>

                      {/* Center Timeline */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                          ASSIGNED SEATS
                        </span>
                        <div className="inline-block px-3.5 py-0.5 rounded-full bg-red-50 text-brand-scarlet border border-red-200/90 font-bold text-xs">
                          Seats {trip.seats.join(', ')}
                        </div>

                        <div className="w-full flex items-center justify-center gap-2 text-slate-300 my-1.5 px-2">
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 select-none">&gt;&gt;&gt;</span>
                          <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                          <span className="material-symbols-outlined text-[18px] text-brand-scarlet bg-white px-1">
                            directions_bus
                          </span>
                          <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
                          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 select-none">&lt;&lt;&lt;</span>
                        </div>

                        <span className="text-[11px] text-slate-500 font-semibold">
                          {trip.distanceKm ? `${trip.distanceKm} km` : '394 km'} • {trip.duration || '9h 45m'}
                        </span>
                      </div>

                      {/* Dropping Info */}
                      <div className="md:col-span-4 flex items-start justify-start md:justify-end gap-4 text-left">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                            DROPPING
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                            {trip.arrTime}
                          </div>
                        </div>
                        <div className="space-y-0.5 pt-0.5">
                          <div className="text-sm font-bold text-slate-900">{trip.to}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]" title={trip.toStation}>
                            {trip.toStation}
                          </div>
                          <div className="text-xs font-semibold text-slate-600">
                            {trip.arrDate || 'Next Day'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM ROW: DRIVER + ACTION BUTTONS */}
                    <div className="bg-slate-50/70 border-t border-slate-100 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3">
                      {/* Driver Info */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          Driver: <strong className="text-slate-900">{trip.driverName || 'Sunil Sharma'}</strong>
                          <span className="text-slate-300 mx-1.5">|</span>
                          <span className="text-slate-600">{trip.driverPhone || '+91-8208024895'}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {trip.status === 'Cancelled' ? (
                          <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px]">cancel</span>
                            <span>Ticket Cancelled</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openCancelModal(trip)}
                            className="px-4 py-2 rounded-full border border-red-300 text-red-600 bg-white hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px] text-red-500">cancel</span>
                            <span>Cancel Ticket</span>
                          </button>
                        )}

                        <Link
                          href={`/track-bus/${trip.id}`}
                          className="px-4 py-2 rounded-full bg-[#0B1527] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px] text-emerald-400">my_location</span>
                          <span>Live GPS Bus Tracking</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => openBoardingPassModal(trip)}
                          className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px] text-brand-scarlet">print</span>
                          <span>Boarding Pass / PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const shareText = `🎟️ Confirmed Ticket #${trip.id}\nRoute: ${trip.from} ➔ ${trip.to}\nDate: ${trip.depDate}\nSeats: ${trip.seats.join(', ')}\nBus Plate: ${trip.busPlate}`;
                            const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/track-bus/${trip.id}` : '';
                            if (typeof navigator !== 'undefined' && navigator.share) {
                              navigator.share({
                                title: `Confirmed Ticket #${trip.id}`,
                                text: shareText,
                                url: shareUrl,
                              }).catch(() => {});
                            } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(`${shareText}\nTrack: ${shareUrl}`);
                              setShareToast('Ticket details copied to clipboard!');
                              setTimeout(() => setShareToast(''), 3000);
                            } else {
                              setShareToast('Ticket details copied to clipboard!');
                              setTimeout(() => setShareToast(''), 3000);
                            }
                          }}
                          className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px] text-slate-600">share</span>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST JOURNEYS */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-slate-900">Past Completed Journeys &amp; Reviews</h2>
              <span className="text-xs text-slate-500 font-medium">Verified Travel History</span>
            </div>
            {pastTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/90 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <span className="material-symbols-outlined text-[32px]">history_edu</span>
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-lg font-serif font-bold text-slate-900">No Past Journeys or Reviews Yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once you complete your bus journeys or Devsthan pilgrimage tours, your travel history, ticket archives, and ratings will appear here.
                  </p>
                </div>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-scarlet text-white font-bold text-xs shadow-md shadow-red-600/20 hover:bg-brand-hover transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>Explore &amp; Book Routes</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pastTrips.map(trip => (
                  <div key={trip.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket #{trip.id} • {trip.date}</span>
                      <h3 className="text-base font-serif font-bold text-slate-900 mt-0.5">{trip.from} ➔ {trip.to}</h3>
                      <p className="text-xs text-slate-500">{trip.operator} • Seats {trip.seats}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">{trip.fare}</span>
                      <button
                        onClick={() => {
                          setShareToast(`Directing to re-book ${trip.from} to ${trip.to}...`);
                          setTimeout(() => setShareToast(''), 3000);
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-scarlet text-white font-bold text-xs shadow-sm hover:bg-brand-hover transition-all"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex justify-between items-center shadow-lg">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Available Wallet Balance</span>
                <span className="text-3xl font-extrabold text-amber-400">₹{userProfile?.walletBalance || 0}</span>
                <p className="text-xs text-slate-300 mt-1">Use 100% wallet balance on any bus ticket or Devsthan package booking.</p>
              </div>
              <button
                onClick={() => {
                  setShareToast('Add Money functionality coming soon!');
                  setTimeout(() => setShareToast(''), 3000);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                + Add Money
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SAVED PASSENGERS */}
        {activeTab === 'passengers' && (
          <div className="space-y-4 w-full">
            {/* Top Action Header Bar (Full Width matching section above) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/80 w-full">
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900">Saved Passenger Profiles</h2>
                <p className="text-xs text-slate-500">Select a traveler to edit or delete details, or add new passenger profiles.</p>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllPassengers}
                  disabled={savedPassengers.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedPassengerIds.length === savedPassengers.length && savedPassengers.length > 0 ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span>{selectedPassengerIds.length === savedPassengers.length && savedPassengers.length > 0 ? 'Deselect All' : 'Select All'}</span>
                </button>

                <button
                  type="button"
                  onClick={openAddPassengerModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>+ Add New Passenger</span>
                </button>

                <button
                  type="button"
                  onClick={openEditSelectedPassengerModal}
                  disabled={savedPassengers.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span>Edit Passenger</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSelectedPassenger}
                  disabled={savedPassengers.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>Delete Passenger</span>
                </button>
              </div>
            </div>

            {/* Adjusted Width Passenger Cards List (Max Width 1090px - ~75% of Edit Passenger button) */}
            <div className="flex flex-col space-y-3 pt-2 max-w-6xl ml-3 sm:ml-4">
              {savedPassengers.length === 0 ? (
                <div className="w-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
                  No saved passengers found. Click <strong>+ Add New Passenger</strong> to save details.
                </div>
              ) : (
                savedPassengers.map((p) => {
                  const isSelected = selectedPassengerIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelectPassenger(p.id)}
                      className={`w-full bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-brand-scarlet ring-2 ring-brand-scarlet/20 shadow-md bg-red-50/10'
                          : 'border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-brand-scarlet bg-brand-scarlet text-white' : 'border-slate-300 bg-slate-50'
                          }`}
                        >
                          {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </div>

                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                          <span className="material-symbols-outlined text-[22px]">
                            {p.gender === 'Female' ? 'woman' : 'man'}
                          </span>
                        </div>

                        {/* Passenger Info */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-brand-scarlet text-[10px] font-bold uppercase tracking-wider border border-red-100">
                              {p.relation}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            {p.gender} • {p.age} Years Old • ID Verified
                          </p>
                        </div>
                      </div>

                      {/* Right Side Actions: Edit & Delete buttons first, Rightmost "Click to Select" / "Selected" Badge */}
                      <div className="flex items-center gap-2.5 sm:self-center self-end pl-11 sm:pl-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPassengerModal(p);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Edit Passenger"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePassenger(p.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-bold text-xs transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Delete Passenger"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                          <span>Delete</span>
                        </button>

                        <span
                          className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-brand-scarlet text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Click to Select'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* SIMULATED LIVE GPS BUS TRACKING MODAL */}
      {isGpsModalOpen && selectedTrackBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 text-white border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  🟢 LIVE GPS BUS FEED
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                  {selectedTrackBus.operator} ({selectedTrackBus.busPlate})
                </h3>
              </div>
              <button
                onClick={() => setIsGpsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* SIMULATED GPS RADAR MAP CONTAINER */}
            <div className="relative h-64 w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Grid Background Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Highway Path Animation */}
              <div className="w-3/4 h-1 bg-slate-800 relative rounded-full">
                <div className="w-1/2 h-full bg-emerald-500 rounded-full"></div>
                
                {/* Animated Bus Icon Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse">
                  <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                </div>
              </div>

              {/* Status Overlay Box */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT LOCATION</span>
                  <span className="font-bold text-white">{selectedTrackBus.currentLocation}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">CURRENT SPEED</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedTrackBus.speed}</span>
                </div>
              </div>
            </div>

            {/* DRIVER CONTACT & NEXT STOP */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">DRIVER ON DUTY</span>
                <span className="font-bold text-white text-sm">{selectedTrackBus.driverName}</span>
                <span className="text-slate-400 block text-[11px]">{selectedTrackBus.driverPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedTrackBus.driverPhone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Driver</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PASSENGER MODAL */}
      {isPassengerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                {editingPassenger ? 'Edit Passenger Details' : 'Add New Passenger'}
              </h3>
              <button
                onClick={() => setIsPassengerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePassenger} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={passengerFormData.name}
                  onChange={(e) => setPassengerFormData({ ...passengerFormData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 text-sm font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={passengerFormData.age}
                    onChange={(e) => setPassengerFormData({ ...passengerFormData, age: e.target.value })}
                    placeholder="e.g. 35"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 text-sm font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Gender *
                  </label>
                  <select
                    value={passengerFormData.gender}
                    onChange={(e) => setPassengerFormData({ ...passengerFormData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 text-sm font-semibold outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Relation / Tag *
                </label>
                <input
                  type="text"
                  required
                  value={passengerFormData.relation}
                  onChange={(e) => setPassengerFormData({ ...passengerFormData, relation: e.target.value })}
                  placeholder="e.g. Self, Spouse, Father, Friend"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-scarlet focus:ring-2 focus:ring-brand-scarlet/20 text-sm font-semibold outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPassengerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-red-600/20"
                >
                  {editingPassenger ? 'Save Changes' : 'Add Passenger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE USER ACCOUNT MODAL */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl space-y-5 border border-slate-100 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-brand-scarlet flex items-center justify-center border border-red-200 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight">
                    Manage User Account
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Edit credentials &amp; personal information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Error & Success Feedback Alerts */}
            {accountError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0">error</span>
                <span>{accountError}</span>
              </div>
            )}

            {accountSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">check_circle</span>
                <span>{accountSuccess}</span>
              </div>
            )}

            {/* Account Edit Form */}
            <form onSubmit={handleSaveAccount} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-300 focus-within:border-brand-scarlet focus-within:ring-2 focus-within:ring-brand-scarlet/20 bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-700 shrink-0 select-none">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={accountFormData.name}
                    onChange={(e) => setAccountFormData({ ...accountFormData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full bg-transparent outline-none border-none text-xs font-bold text-slate-800 placeholder:text-slate-400 p-0"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-300 focus-within:border-brand-scarlet focus-within:ring-2 focus-within:ring-brand-scarlet/20 bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-700 shrink-0 select-none">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={accountFormData.email}
                    onChange={(e) => setAccountFormData({ ...accountFormData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full bg-transparent outline-none border-none text-xs font-bold text-slate-800 placeholder:text-slate-400 p-0"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-300 focus-within:border-brand-scarlet focus-within:ring-2 focus-within:ring-brand-scarlet/20 bg-white transition-all">
                  <span className="material-symbols-outlined text-[18px] text-slate-700 shrink-0 select-none">
                    call
                  </span>
                  <input
                    type="text"
                    required
                    value={accountFormData.phone}
                    onChange={(e) => setAccountFormData({ ...accountFormData, phone: e.target.value })}
                    placeholder="+91-8208024895"
                    className="w-full bg-transparent outline-none border-none text-xs font-bold text-slate-800 placeholder:text-slate-400 p-0"
                  />
                </div>
              </div>

              {/* Password */}
              {!isEditingPassword ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-700 shrink-0 select-none">
                        lock
                      </span>
                      <span className="text-base font-black tracking-widest text-slate-700 select-none">
                        ••••••••
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(true);
                        setAccountFormData((prev) => ({ ...prev, password: '' }));
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-brand-scarlet bg-brand-scarlet/10 hover:bg-brand-scarlet hover:text-white transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Edit Password</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setAccountFormData((prev) => ({ ...prev, password: '' }));
                      }}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Keep Current Password
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-300 focus-within:border-brand-scarlet focus-within:ring-2 focus-within:ring-brand-scarlet/20 bg-white transition-all">
                    <span className="material-symbols-outlined text-[18px] text-slate-700 shrink-0 select-none">
                      lock_reset
                    </span>
                    <input
                      type={showAccountPassword ? 'text' : 'password'}
                      value={accountFormData.password}
                      onChange={(e) => setAccountFormData({ ...accountFormData, password: e.target.value })}
                      placeholder="Enter new password (min. 6 chars)"
                      className="w-full bg-transparent outline-none border-none text-xs font-bold text-slate-800 placeholder:text-slate-400 p-0"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountPassword(!showAccountPassword)}
                      className="text-slate-600 hover:text-slate-900 cursor-pointer shrink-0 ml-1 p-0.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showAccountPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave empty or click &quot;Keep Current Password&quot; to retain current password.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={accountLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {accountLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL TICKET CONFIRMATION MODAL */}
      {isCancelModalOpen && cancelModalTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  Cancel {cancelModalTrip.isPackage ? 'Package Booking' : 'Bus Ticket'}?
                </h3>
                <p className="text-xs text-slate-500 font-mono">ID: #{cancelModalTrip.bookingId || cancelModalTrip.id}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-2 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">account_balance_wallet</span>
                <span>100% Instant Wallet Refund Guaranteed</span>
              </div>
              <p className="text-amber-800">
                Amount of <strong>₹{(cancelModalTrip.totalFare || cancelModalTrip.totalAmount || 850).toLocaleString('en-IN')}</strong> will be credited directly to your Wallet with 0 cancellation penalty.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-scarlet text-xs font-semibold outline-none bg-white"
              >
                <option value="Change of travel plans">Change of travel plans</option>
                <option value="Found alternative transport">Found alternative transport</option>
                <option value="Personal / Medical emergency">Personal / Medical emergency</option>
                <option value="Booking date mistake">Booking date mistake</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancelBooking}
                disabled={isCancelling}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md shadow-red-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-xs font-bold">{shareToast}</span>
        </div>
      )}

      {/* PRINTABLE BOARDING PASS MODAL */}
      <PrintableBoardingPassModal
        isOpen={isBoardingPassModalOpen}
        onClose={() => {
          setIsBoardingPassModalOpen(false);
          setSelectedBoardingPassTrip(null);
        }}
        ticketData={selectedBoardingPassTrip}
      />

      <Footer />
    </div>
  </AuthGuard>
);
}
