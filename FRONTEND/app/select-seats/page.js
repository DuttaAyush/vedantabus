'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';
import AuthGuard from '@/components/auth/AuthGuard';

// ── 36-Seat RedBus-Style Sleeper Layout Definition ──────────────────────────
// Lower Deck: 18 Seats (L1 to L18) - 1+2 Sleeper Configuration
// Upper Deck: 18 Seats (U1 to U18) - 1+2 Sleeper Configuration
// Total: 36 Luxury Sleeper Berths

const lowerDeck36 = [
  // Row 1: Left empty (Driver Front / Steering Wheel), Right Double (L1, L2)
  { id: 'L1', name: 'L1', row: 1, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'available', adjacentId: 'L2' },
  { id: 'L2', name: 'L2', row: 1, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'available', adjacentId: 'L1' },

  // Row 2: Left Single (L3), Right Double (L4, L5)
  { id: 'L3', name: 'L3', row: 2, col: 'left-single', type: 'single', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male' },
  { id: 'L4', name: 'L4', row: 2, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L5' },
  { id: 'L5', name: 'L5', row: 2, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_female', adjacentId: 'L4' },

  // Row 3: Left Single (L6), Right Double (L7, L8)
  { id: 'L6', name: 'L6', row: 3, col: 'left-single', type: 'single', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male' },
  { id: 'L7', name: 'L7', row: 3, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L8' },
  { id: 'L8', name: 'L8', row: 3, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L7' },

  // Row 4: Left Single (L9), Right Double (L10, L11)
  { id: 'L9', name: 'L9', row: 4, col: 'left-single', type: 'single', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male' },
  { id: 'L10', name: 'L10', row: 4, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L11' },
  { id: 'L11', name: 'L11', row: 4, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L10' },

  // Row 5: Left Single (L12), Right Double (L13, L14)
  { id: 'L12', name: 'L12', row: 5, col: 'left-single', type: 'single', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'sold_male' },
  { id: 'L13', name: 'L13', row: 5, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'sold_male', adjacentId: 'L14' },
  { id: 'L14', name: 'L14', row: 5, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'available', adjacentId: 'L13' },

  // Row 6: Left Single (L15), Right Double (L16, L17, L18)
  { id: 'L15', name: 'L15', row: 6, col: 'left-single', type: 'single', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'available' },
  { id: 'L16', name: 'L16', row: 6, col: 'right-aisle', type: 'double', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'available', adjacentId: 'L17' },
  { id: 'L17', name: 'L17', row: 6, col: 'right-window', type: 'double', isWindow: true, deck: 'lower', price: 700, defaultStatus: 'available', adjacentId: 'L16' },
  { id: 'L18', name: 'L18', row: 6, col: 'rear-center', type: 'single', isWindow: false, deck: 'lower', price: 700, defaultStatus: 'available' },
];

const upperDeck36 = [
  // Row 1: Left Single (U1), Right Double (U2, U3)
  { id: 'U1', name: 'U1', row: 1, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available' },
  { id: 'U2', name: 'U2', row: 1, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U3' },
  { id: 'U3', name: 'U3', row: 1, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U2' },

  // Row 2: Left Single (U4), Right Double (U5, U6)
  { id: 'U4', name: 'U4', row: 2, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'sold_female' },
  { id: 'U5', name: 'U5', row: 2, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U6' },
  { id: 'U6', name: 'U6', row: 2, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U5' },

  // Row 3: Left Single (U7), Right Double (U8, U9)
  { id: 'U7', name: 'U7', row: 3, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'sold_male' },
  { id: 'U8', name: 'U8', row: 3, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U9' },
  { id: 'U9', name: 'U9', row: 3, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U8' },

  // Row 4: Left Single (U10), Right Double (U11, U12)
  { id: 'U10', name: 'U10', row: 4, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'sold_male' },
  { id: 'U11', name: 'U11', row: 4, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U12' },
  { id: 'U12', name: 'U12', row: 4, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U11' },

  // Row 5: Left Single (U13), Right Double (U14, U15)
  { id: 'U13', name: 'U13', row: 5, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'sold_male' },
  { id: 'U14', name: 'U14', row: 5, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U15' },
  { id: 'U15', name: 'U15', row: 5, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U14' },

  // Row 6: Left Single (U16), Right Double (U17, U18)
  { id: 'U16', name: 'U16', row: 6, col: 'left-single', type: 'single', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available' },
  { id: 'U17', name: 'U17', row: 6, col: 'right-aisle', type: 'double', isWindow: false, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U18' },
  { id: 'U18', name: 'U18', row: 6, col: 'right-window', type: 'double', isWindow: true, deck: 'upper', price: 700, defaultStatus: 'available', adjacentId: 'U17' },
];

const all36Seats = [...lowerDeck36, ...upperDeck36];

function CinemaSeatBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const busIdParam = searchParams.get('busId');

  // Fallback gracefully to default coach if direct link or route without busIdParam
  // (Prevents jarring unexpected redirects back to search)

  // Target passengers from search flow (default: 2)
  const targetPassengers = parseInt(searchParams.get('passengers')) || 2;

  const busInfo = {
    id: busIdParam || '1',
    operator: searchParams.get('operator') || 'Luxury Gold Express',
    busPlate: searchParams.get('busPlate') || 'MH-12-QZ-8812',
    busType: searchParams.get('busType') || 'BharatBenz AC Sleeper (2+1)',
    category: searchParams.get('category') || 'sleeper',
    price: parseInt(searchParams.get('price')) || 700,
    from: searchParams.get('from') || 'Nagpur',
    to: searchParams.get('to') || 'Pune',
    date: searchParams.get('date') || 'Tomorrow, 24 Oct',
    depTime: searchParams.get('depTime') || '20:30',
    arrTime: searchParams.get('arrTime') || '07:00',
    depLocation: searchParams.get('depLocation') || 'Nagpur',
    arrLocation: searchParams.get('arrLocation') || 'Pune',
  };

  const [activeDeckTab, setActiveDeckTab] = useState('both'); // 'both' | 'lower' | 'upper'
  const [mobileActiveDeck, setMobileActiveDeck] = useState('lower'); // 'lower' | 'upper' for mobile deck tab switcher
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [holdAlertMessage, setHoldAlertMessage] = useState('');
  
  // Gender safety modal & warnings
  const [genderSafetyModal, setGenderSafetyModal] = useState({
    isOpen: false,
    seat: null,
    adjacentSeat: null,
    message: '',
  });

  // Mismatch passenger count modal
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);

  // User booking gender preference for solo travelers ('any' | 'male' | 'female')
  const [travelerGenderPreference, setTravelerGenderPreference] = useState('male');

  // Fetch real-time booked seats from API for this bus and trip
  useEffect(() => {
    if (!busIdParam) return;
    apiFetch(`/api/bookings/seats?busId=${busInfo.id}&date=${encodeURIComponent(busInfo.date)}`)
      .then(res => res.json())
      .then(data => {
        const seats = data.bookedSeats || data.data?.bookedSeats;
        if (Array.isArray(seats)) {
          setBookedSeatIds(seats);
        }
      })
      .catch(() => {});
  }, [busInfo.id, busInfo.date]);

  const [boardingPoint, setBoardingPoint] = useState({
    id: 'b1',
    location: `${busInfo.depLocation} - Main Terminal`,
    time: busInfo.depTime,
  });
  const [droppingPoint, setDroppingPoint] = useState({
    id: 'd1',
    location: `${busInfo.arrLocation} - Central Bay`,
    time: busInfo.arrTime,
  });

  // Helper to get status of a seat
  const getSeatStatus = (seat) => {
    if (bookedSeatIds.includes(seat.id) || bookedSeatIds.includes(`BK_${seat.id}`)) {
      return 'booked';
    }
    return seat.defaultStatus;
  };

  // Find partner in double sharing pair
  const getAdjacentSeat = (seat) => {
    if (!seat.adjacentId) return null;
    return all36Seats.find(s => s.id === seat.adjacentId);
  };

  // RedBus Gender Adjacent Safety Check
  const validateRedBusGenderRule = (seat) => {
    const adjacent = getAdjacentSeat(seat);
    if (!adjacent) return { allowed: true };

    const adjacentStatus = getSeatStatus(adjacent);
    const isAdjacentAlreadySelectedByMe = selectedSeats.some(s => s.id === adjacent.id);

    // If 1 single customer is booking BOTH adjacent seats together in the same booking, it is ALLOWED!
    if (isAdjacentAlreadySelectedByMe) {
      return { allowed: true };
    }

    // If adjacent seat is sold to a female passenger:
    if (adjacentStatus === 'sold_female') {
      // If user has chosen Female gender preference or booking 2+ seats where one will be female:
      if (travelerGenderPreference === 'female') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `Seat ${seat.name} is adjacent to a Female passenger (Seat ${adjacent.name}). Under RedBus safety policy, two unrelated male and female passengers cannot share an adjacent double berth. This seat is reserved for female travelers only.`,
        adjacentSeat: adjacent,
      };
    }

    return { allowed: true };
  };

  const isSeatSelected = (seatId) => selectedSeats.some(s => s.id === seatId);

  // Toggle seat selection with FIFO sliding window replacement
  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);
    if (status === 'sold_male' || status === 'sold_female' || status === 'booked' || status === 'blocked') {
      return;
    }

    // If already selected, unselect it
    if (isSeatSelected(seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      return;
    }

    // Gender check for sharing seats
    const genderCheck = validateRedBusGenderRule(seat);
    if (!genderCheck.allowed) {
      setGenderSafetyModal({
        isOpen: true,
        seat: seat,
        adjacentSeat: genderCheck.adjacentSeat,
        message: genderCheck.reason,
      });
      return;
    }

    const newSeatObj = {
      id: seat.id,
      name: seat.name,
      price: seat.price || busInfo.price,
      isWindow: seat.isWindow,
      deck: seat.deck,
      type: seat.type,
      adjacentId: seat.adjacentId || null,
    };

    // FIFO Quota Replacement Logic
    if (selectedSeats.length >= targetPassengers) {
      if (targetPassengers === 1) {
        setSelectedSeats([newSeatObj]);
      } else {
        // Drop oldest seat (index 0) and add new seat
        setSelectedSeats([...selectedSeats.slice(1), newSeatObj]);
      }
    } else {
      setSelectedSeats([...selectedSeats, newSeatObj]);
    }
  };

  const calculateSubtotal = () => selectedSeats.reduce((acc, s) => acc + (s?.price || busInfo.price), 0);
  const taxes = selectedSeats.length > 0 ? Math.round(calculateSubtotal() * 0.05) : 0;
  const totalAmount = calculateSubtotal() + taxes;

  const proceedWithPayload = async (customSeats = selectedSeats) => {
    if (customSeats.length === 0) return;

    let lockHolderId = 'holder_guest';
    if (typeof window !== 'undefined') {
      lockHolderId = localStorage.getItem('lock_holder_id') || `holder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('lock_holder_id', lockHolderId);
    }

    try {
      const holdRes = await apiFetch('/api/bookings/hold', {
        method: 'POST',
        body: JSON.stringify({
          tripId: busInfo.id,
          selectedSeats: customSeats.map(s => s.id),
          lockHolderId,
        })
      });
      if (holdRes.status === 409) {
        const holdData = await holdRes.json();
        setHoldAlertMessage(holdData.message || 'One or more selected seats were recently reserved. Please choose other seats.');
        return;
      }
    } catch (err) {
      console.warn('Seat hold network notice:', err);
    }

    const bookingPayload = {
      busId: busInfo.id,
      lockHolderId,
      operator: busInfo.operator,
      busPlate: busInfo.busPlate,
      busType: busInfo.busType,
      category: busInfo.category,
      from: busInfo.from,
      to: busInfo.to,
      date: busInfo.date,
      depTime: busInfo.depTime,
      arrTime: busInfo.arrTime,
      depLocation: busInfo.depLocation,
      arrLocation: busInfo.arrLocation,
      boardingPoint: boardingPoint,
      droppingPoint: droppingPoint,
      selectedSeats: customSeats.map(s => ({ id: s.id, name: s.name, price: s.price, isWindow: s.isWindow, deck: s.deck })),
      baseFare: customSeats.reduce((acc, s) => acc + (s?.price || busInfo.price), 0),
      taxes: Math.round(customSeats.reduce((acc, s) => acc + (s?.price || busInfo.price), 0) * 0.05),
      totalAmount: Math.round(customSeats.reduce((acc, s) => acc + (s?.price || busInfo.price), 0) * 1.05),
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('active_checkout_flow', 'true');
      sessionStorage.setItem('pending_booking', JSON.stringify(bookingPayload));
      localStorage.setItem('pending_booking', JSON.stringify(bookingPayload));
    }
    router.push('/checkout');
  };

  const handleProceedClick = () => {
    if (selectedSeats.length === 0) {
      setHoldAlertMessage('Please select at least 1 seat to proceed.');
      setTimeout(() => setHoldAlertMessage(''), 3500);
      return;
    }

    // Check if user selected fewer seats than searched
    if (selectedSeats.length < targetPassengers) {
      setIsMismatchModalOpen(true);
      return;
    }

    proceedWithPayload();
  };

  // Helper to render an individual sleeper berth capsule exactly matching uploaded reference
  const renderSleeperCapsule = (seat) => {
    if (!seat) {
      return <div className="w-[48px] sm:w-[54px] h-[96px] sm:h-[106px] opacity-0 pointer-events-none" />;
    }

    const status = getSeatStatus(seat);
    const selected = isSeatSelected(seat.id);
    const adjacent = getAdjacentSeat(seat);
    const adjacentIsSoldFemale = adjacent && getSeatStatus(adjacent) === 'sold_female';

    // 1. Selected State (Royal Blue Border & Person Icon)
    if (selected) {
      return (
        <button
          key={seat.id}
          type="button"
          onClick={() => handleSeatClick(seat)}
          className="group flex flex-col items-center cursor-pointer transition-transform active:scale-95 select-none"
          title={`Seat ${seat.name} (Selected - Click to unselect)`}
        >
          <div className="w-[48px] sm:w-[54px] h-[96px] sm:h-[106px] rounded-2xl bg-white border-2 border-blue-600 shadow-md shadow-blue-500/20 flex flex-col items-center justify-between py-2 px-1 relative transition-all ring-2 ring-blue-300">
            {/* Person Icon in Blue */}
            <span className="material-symbols-outlined text-[20px] text-blue-600 mt-1 font-bold">person</span>
            
            {/* Pillow Bar Indicator at bottom */}
            <div className="w-[28px] h-[6px] rounded-full bg-blue-200"></div>
          </div>
          <span className="text-[11px] font-black text-blue-700 mt-1">₹{seat.price}</span>
        </button>
      );
    }

    // 2. Sold Male (Slate Capsule + Blue Person Icon + "Sold")
    if (status === 'sold_male' || status === 'booked') {
      return (
        <div
          key={seat.id}
          className="flex flex-col items-center opacity-90 cursor-not-allowed select-none"
          title={`Seat ${seat.name} (Booked - Male Passenger)`}
        >
          <div className="w-[48px] sm:w-[54px] h-[96px] sm:h-[106px] rounded-2xl bg-[#E2E8F0] border border-[#CBD5E1] flex flex-col items-center justify-center py-2 px-1 relative">
            <span className="material-symbols-outlined text-[20px] text-[#3B82F6]/70">person</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1">Sold</span>
        </div>
      );
    }

    // 3. Sold Female (Light Pink Capsule + Pink Person Icon + "Sold")
    if (status === 'sold_female') {
      return (
        <div
          key={seat.id}
          className="flex flex-col items-center opacity-90 cursor-not-allowed select-none"
          title={`Seat ${seat.name} (Booked - Female Passenger)`}
        >
          <div className="w-[48px] sm:w-[54px] h-[96px] sm:h-[106px] rounded-2xl bg-[#FCE7F3] border border-[#F472B6] flex flex-col items-center justify-center py-2 px-1 relative">
            <span className="material-symbols-outlined text-[20px] text-[#EC4899]">person</span>
          </div>
          <span className="text-[11px] font-bold text-pink-600 mt-1">Sold</span>
        </div>
      );
    }

    // 4. Available Seat (Crisp Green Border + Light Green Pillow Headrest + Fare below)
    return (
      <button
        key={seat.id}
        type="button"
        onClick={() => handleSeatClick(seat)}
        className="group flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95 select-none"
        title={`Seat ${seat.name} - ₹${seat.price} ${adjacentIsSoldFemale ? '(Adjacent to Female)' : '(Available)'}`}
      >
        <div className={`w-[48px] sm:w-[54px] h-[96px] sm:h-[106px] rounded-2xl bg-white border-2 ${
          adjacentIsSoldFemale ? 'border-pink-400 hover:border-pink-500' : 'border-[#16A34A] hover:border-[#15803D]'
        } flex flex-col items-center justify-between py-2 px-1 relative shadow-xs group-hover:shadow-md transition-all`}>
          
          {/* Top empty space or Ladies Badge */}
          {adjacentIsSoldFemale ? (
            <span className="text-[9px] font-black text-pink-600 px-1 py-0.5 bg-pink-50 rounded">♀ Only</span>
          ) : (
            <div className="h-4" />
          )}

          {/* Pillow Bar Indicator */}
          <div className={`w-[30px] h-[6px] rounded-full ${adjacentIsSoldFemale ? 'bg-pink-200' : 'bg-[#BBF7D0]'}`}></div>
        </div>
        <span className="text-[11px] font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors">
          ₹{seat.price}
        </span>
      </button>
    );
  };

  // Helper to render deck grid rows
  const renderDeckGrid = (deckName, seatsArray, isLower = false) => {
    // Group seats by rows 1 to 6
    const rows = [1, 2, 3, 4, 5, 6];

    return (
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col w-full max-w-[340px]">
        {/* Deck Header with Steering Wheel Icon for Lower Deck */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900 font-serif capitalize">{deckName}</span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">18 Seats</span>
          </div>

          {/* Steering Wheel Icon for Lower Deck */}
          {isLower && (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs" title="Driver Cabin">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="9" />
                <line x1="12" y1="15" x2="12" y2="22" />
                <line x1="4.93" y1="19.07" x2="9.88" y2="14.12" />
                <line x1="14.12" y1="9.88" x2="19.07" y2="4.93" />
              </svg>
            </div>
          )}
        </div>

        {/* Bus Cabin Sleeper Berth Grid (1+2 Columns) */}
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {rows.map((rowNum) => {
            const rowSeats = seatsArray.filter(s => s.row === rowNum);
            const singleSeat = rowSeats.find(s => s.col === 'left-single');
            const aisleSeat = rowSeats.find(s => s.col === 'right-aisle');
            const windowSeat = rowSeats.find(s => s.col === 'right-window');

            return (
              <div key={rowNum} className="flex items-center justify-between gap-2 sm:gap-3">
                {/* Left Column: Single Sleeper Berth */}
                <div className="w-[48px] sm:w-[54px] flex justify-center">
                  {singleSeat ? renderSleeperCapsule(singleSeat) : <div className="w-[48px] sm:w-[54px] h-[96px] sm:h-[106px]" />}
                </div>

                {/* Center Aisle Indicator */}
                <div className="flex-1 flex justify-center items-center">
                  <div className="w-px h-14 sm:h-16 border-r border-dashed border-slate-200"></div>
                </div>

                {/* Right Columns: Double 2-Sharing Sleeper Berths */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-[48px] sm:w-[54px] flex justify-center">
                    {renderSleeperCapsule(aisleSeat)}
                  </div>
                  <div className="w-[48px] sm:w-[54px] flex justify-center">
                    {renderSleeperCapsule(windowSeat)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      <Header />

      {/* TOP ROUTE DETAILS STRIP & QUOTA BANNER */}
      <div className="bg-white border-b border-slate-200 shadow-xs py-3 sm:py-4 px-4 sm:px-6 lg:px-8 sticky top-16 sm:top-18 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={`/search?from=${encodeURIComponent(busInfo.from)}&to=${encodeURIComponent(busInfo.to)}&date=${encodeURIComponent(busInfo.date)}&passengers=${targetPassengers}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-scarlet border border-slate-200 flex items-center justify-center transition-all shadow-sm shrink-0"
              title="Back to Bus Search"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_back</span>
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                <span className="text-xs font-extrabold text-brand-scarlet uppercase tracking-widest">{busInfo.from} ➔ {busInfo.to}</span>
                <span className="text-xs text-slate-400">• {busInfo.date}</span>
                <span className="text-xs font-bold text-slate-500">• Dep: {busInfo.depTime}</span>
              </div>
              <h1 className="text-base sm:text-2xl font-serif font-bold text-slate-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>{busInfo.operator}</span>
                <span className="text-[11px] sm:text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-800 flex items-center gap-1">
                  <span>🚍</span>
                  <span>{busInfo.busPlate}</span>
                </span>
                <span className="text-[11px] sm:text-xs font-sans font-normal text-slate-500">
                  (36-Berth AC Sleeper 2+1)
                </span>
              </h1>
            </div>
          </div>

          {/* PASSENGER QUOTA INDICATOR & GALLERY LINK */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="bg-blue-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-900 flex items-center gap-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-blue-600">group</span>
              <span>Seats: {selectedSeats.length} of {targetPassengers}</span>
            </div>

            <Link
              href="/gallery"
              target="_blank"
              className="bg-purple-50 hover:bg-purple-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-purple-600">photo_library</span>
              <span>Bus Photos</span>
            </Link>

            <div className="bg-emerald-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>RTO Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOLD NOTICE NOTIFICATION BANNER */}
      {holdAlertMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[18px]">info</span>
              <span>{holdAlertMessage}</span>
            </div>
            <button onClick={() => setHoldAlertMessage('')} className="text-amber-800 hover:text-amber-950 font-extrabold text-sm">✕</button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER: BUS CABIN WITH LOWER & UPPER DECK SIDE-BY-SIDE */}
        <div className="lg:col-span-8 space-y-6 flex flex-col items-center">
          
          {/* GENDER POLICY HELPER & DECK CONTROLS */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                RedBus Adjacent Seat Safety Rule
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                In 2-sharing berths, 2 unrelated males &amp; females cannot book together. Families &amp; couples booking together in 1 transaction are permitted.
              </p>
            </div>

            {/* Solo Traveler Gender Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs font-bold text-slate-500">I am:</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTravelerGenderPreference('male')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                    travelerGenderPreference === 'male' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>♂ Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTravelerGenderPreference('female')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                    travelerGenderPreference === 'female' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>♀ Female</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEAT MAP LEGEND */}
          <div className="w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 shadow-xs">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-around gap-2.5 sm:gap-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-6 rounded-md bg-white border-2 border-[#16A34A] shrink-0" />
                <span className="truncate">Available (₹{busInfo.price})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-6 rounded-md bg-white border-2 border-blue-600 ring-1 ring-blue-300 shrink-0" />
                <span className="font-bold text-blue-700 truncate">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-6 rounded-md bg-[#E2E8F0] border border-slate-300 flex items-center justify-center text-[10px] text-blue-600 shrink-0">♂</div>
                <span className="truncate">Sold (Male)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-6 rounded-md bg-[#FCE7F3] border border-pink-300 flex items-center justify-center text-[10px] text-pink-600 shrink-0">♀</div>
                <span className="truncate">Sold (Female)</span>
              </div>
            </div>
          </div>

          {/* MOBILE DECK SWITCHER TABS (<md) */}
          <div className="w-full md:hidden bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobileActiveDeck('lower')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveDeck === 'lower'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🚌 Lower Deck (18 Seats)</span>
              {selectedSeats.filter(s => s.deck === 'lower').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {selectedSeats.filter(s => s.deck === 'lower').length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveDeck('upper')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileActiveDeck === 'upper'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🛌 Upper Deck (18 Seats)</span>
              {selectedSeats.filter(s => s.deck === 'upper').length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {selectedSeats.filter(s => s.deck === 'upper').length}
                </span>
              )}
            </button>
          </div>

          {/* SIDE-BY-SIDE LOWER & UPPER DECKS (Total 36 Seats) - Tabbed on <md, Side-by-side on md+ */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
            {/* 1. LOWER DECK */}
            <div className={`w-full max-w-[340px] justify-center ${mobileActiveDeck === 'lower' ? 'flex' : 'hidden md:flex'}`}>
              {renderDeckGrid('Lower deck', lowerDeck36, true)}
            </div>

            {/* 2. UPPER DECK */}
            <div className={`w-full max-w-[340px] justify-center ${mobileActiveDeck === 'upper' ? 'flex' : 'hidden md:flex'}`}>
              {renderDeckGrid('Upper deck', upperDeck36, false)}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: FARE SUMMARY & BOARDING SELECTION */}
        <div className="lg:col-span-4 space-y-6 sticky top-36">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-serif font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Booking Summary</span>
              <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {selectedSeats.length} / {targetPassengers} Seats
              </span>
            </h2>

            {/* SELECTED SEATS CHIPS */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Selected Seats</span>
              {selectedSeats.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-semibold">
                  Click on available green berths to select up to {targetPassengers} seat(s).
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs shadow-xs">
                      <span>Seat {s.name} ({s.deck.toUpperCase()})</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSeats(selectedSeats.filter(item => item.id !== s.id))}
                        className="hover:text-red-600 font-extrabold text-sm ml-1"
                        title="Remove seat"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOARDING & DROPPING POINTS */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Boarding Point</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{boardingPoint.location}</span>
                  <span className="text-brand-scarlet">{boardingPoint.time}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Dropping Point</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{droppingPoint.location}</span>
                  <span className="text-brand-scarlet">{droppingPoint.time}</span>
                </div>
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-semibold">
              <div className="flex items-center justify-between text-slate-600">
                <span>Base Fare ({selectedSeats.length} Seats)</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>GST / Taxes (5%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Payable</span>
                <span className="text-brand-scarlet">₹{totalAmount}</span>
              </div>
            </div>

            {/* PROCEED TO CHECKOUT BUTTON */}
            <button
              type="button"
              onClick={handleProceedClick}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                selectedSeats.length > 0
                  ? 'bg-brand-scarlet hover:bg-brand-hover text-white cursor-pointer shadow-red-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>PROCEED TO BOOK ({selectedSeats.length})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* STICKY BOTTOM CHECKOUT ACTION BAR FOR MOBILE (<lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0 pl-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 truncate">
            <span>{selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-brand-scarlet text-sm">₹{selectedSeats.reduce((sum, s) => sum + (s.price || busInfo.price), 0)}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 truncate">
            {selectedSeats.length === 0 ? `Select up to ${targetPassengers} seat(s)` : `${targetPassengers} passenger(s) target`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleProceedClick}
          disabled={selectedSeats.length === 0}
          className={`px-4 sm:px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0 ${
            selectedSeats.length > 0
              ? 'bg-brand-scarlet hover:bg-brand-hover text-white cursor-pointer shadow-red-600/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>PROCEED TO CHECKOUT</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* REDBUS GENDER SAFETY MODAL */}
      {genderSafetyModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">shield_person</span>
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">Female Traveler Safety Policy</h3>
                <p className="text-xs text-pink-600 font-semibold">Adjacent Berth Protection</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-100 text-xs text-slate-700 space-y-2 leading-relaxed">
              <p>{genderSafetyModal.message}</p>
              <p className="text-[11px] text-slate-500 font-semibold">
                Tip: If you are traveling as a couple or family booking both adjacent berths, please select both seats or change your gender profile to Female.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setGenderSafetyModal({ isOpen: false, seat: null, adjacentSeat: null, message: '' })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Select Another Seat
              </button>
              <button
                type="button"
                onClick={() => {
                  setTravelerGenderPreference('female');
                  const seatToSelect = genderSafetyModal.seat;
                  setGenderSafetyModal({ isOpen: false, seat: null, adjacentSeat: null, message: '' });
                  if (seatToSelect) {
                    handleSeatClick(seatToSelect);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-pink-600/20 transition-all"
              >
                I am Female • Book Seat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MISMATCH PASSENGERS COUNT MODAL */}
      {isMismatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[26px]">help</span>
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">Seat Selection Alert</h3>
                <p className="text-xs text-amber-800 font-semibold">Searched for {targetPassengers} passenger(s)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You searched for <strong className="text-slate-900">{targetPassengers} passengers</strong>, but have selected <strong className="text-brand-scarlet">{selectedSeats.length} seat(s)</strong>. Would you like to select the remaining {targetPassengers - selectedSeats.length} seat(s), or proceed to checkout with {selectedSeats.length} seat(s)?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsMismatchModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Select {targetPassengers - selectedSeats.length} More Seat(s)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMismatchModalOpen(false);
                  proceedWithPayload(selectedSeats);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/20 transition-all"
              >
                Continue with {selectedSeats.length} Seat(s)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CinemaSeatBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-scarlet border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthGuard
        title="Login to Select Seats"
        subtitle="Please log in or sign up to view live seat availability and reserve your seats."
        redirectTo="/search"
      >
        <CinemaSeatBookingContent />
      </AuthGuard>
    </Suspense>
  );
}
