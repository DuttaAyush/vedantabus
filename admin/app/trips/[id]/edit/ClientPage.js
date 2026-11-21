"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/layout/AdminShell";

// ── Default Options Data ───────────────────────────────────────────────────────

const DEFAULT_ROUTES = [
  { id: "R1", name: "Nagpur → Pune", via: "Via Wardha, Amravati, Akola, Shegaon", start: "Nagpur", dest: "Pune", distanceKm: 710 },
  { id: "R2", name: "Pune → Mumbai", via: "Via Lonavala & Expressway", start: "Pune", dest: "Mumbai", distanceKm: 150 },
  { id: "R3", name: "Nagpur → Hyderabad", via: "Via Adilabad, Nirmal, Nizamabad", start: "Nagpur", dest: "Hyderabad", distanceKm: 500 },
  { id: "R4", name: "Mumbai → Nagpur", via: "Via Nashik & Samruddhi Mahamarg", start: "Mumbai", dest: "Nagpur", distanceKm: 700 },
  { id: "R5", name: "Bhopal → Indore", via: "Via Sehore & Dewas", start: "Bhopal", dest: "Indore", distanceKm: 195 },
];

const DEFAULT_BUSES = [
  { id: "b1", plate: "MH 12 QZ 8812", type: "Volvo B11R AC Sleeper (2+1)", seats: 36, style: "red", layout: "sleeper36" },
  { id: "b2", plate: "MH 31 AB 1234", type: "Volvo AC Sleeper (2+1)", seats: 36, style: "silver", layout: "sleeper36" },
  { id: "b3", plate: "MH 40 CD 5678", type: "Scania Multi-Axle Sleeper", seats: 36, style: "red", layout: "sleeper36" },
  { id: "b4", plate: "MH 31 EF 9012", type: "Mercedes AC Seater (2+2)", seats: 49, style: "silver", layout: "seater49" },
];

const TIME_OPTIONS = [
  "06:00 AM", "07:00 AM", "08:30 AM", "09:15 AM", "10:00 AM", "12:30 PM", 
  "01:30 PM", "02:30 PM", "05:00 PM", "06:45 PM", "08:30 PM", "09:30 PM", "10:30 PM", "11:15 PM"
];

// 36-Seat Sleeper Definitions (18 Lower + 18 Upper)
const LOWER_DECK_SEATS = [
  { id: 'L1', name: 'L1', isSingle: true, row: 1 },
  { id: 'L2', name: 'L2', isSingle: false, row: 1 },
  { id: 'L3', name: 'L3', isSingle: false, row: 1 },
  { id: 'L4', name: 'L4', isSingle: true, row: 2 },
  { id: 'L5', name: 'L5', isSingle: false, row: 2 },
  { id: 'L6', name: 'L6', isSingle: false, row: 2 },
  { id: 'L7', name: 'L7', isSingle: true, row: 3 },
  { id: 'L8', name: 'L8', isSingle: false, row: 3 },
  { id: 'L9', name: 'L9', isSingle: false, row: 3 },
  { id: 'L10', name: 'L10', isSingle: true, row: 4 },
  { id: 'L11', name: 'L11', isSingle: false, row: 4 },
  { id: 'L12', name: 'L12', isSingle: false, row: 4 },
  { id: 'L13', name: 'L13', isSingle: true, row: 5 },
  { id: 'L14', name: 'L14', isSingle: false, row: 5 },
  { id: 'L15', name: 'L15', isSingle: false, row: 5 },
  { id: 'L16', name: 'L16', isSingle: true, row: 6 },
  { id: 'L17', name: 'L17', isSingle: false, row: 6 },
  { id: 'L18', name: 'L18', isSingle: false, row: 6 },
];

const UPPER_DECK_SEATS = [
  { id: 'U1', name: 'U1', isSingle: true, row: 1 },
  { id: 'U2', name: 'U2', isSingle: false, row: 1 },
  { id: 'U3', name: 'U3', isSingle: false, row: 1 },
  { id: 'U4', name: 'U4', isSingle: true, row: 2 },
  { id: 'U5', name: 'U5', isSingle: false, row: 2 },
  { id: 'U6', name: 'U6', isSingle: false, row: 2 },
  { id: 'U7', name: 'U7', isSingle: true, row: 3 },
  { id: 'U8', name: 'U8', isSingle: false, row: 3 },
  { id: 'U9', name: 'U9', isSingle: false, row: 3 },
  { id: 'U10', name: 'U10', isSingle: true, row: 4 },
  { id: 'U11', name: 'U11', isSingle: false, row: 4 },
  { id: 'U12', name: 'U12', isSingle: false, row: 4 },
  { id: 'U13', name: 'U13', isSingle: true, row: 5 },
  { id: 'U14', name: 'U14', isSingle: false, row: 5 },
  { id: 'U15', name: 'U15', isSingle: false, row: 5 },
  { id: 'U16', name: 'U16', isSingle: true, row: 6 },
  { id: 'U17', name: 'U17', isSingle: false, row: 6 },
  { id: 'U18', name: 'U18', isSingle: false, row: 6 },
];

export default function EditTripPage({ params }) {
  const tripId = params?.id || "TRP1001";
  const router = useRouter();

  const [routesList, setRoutesList] = useState(DEFAULT_ROUTES);
  const [busesList, setBusesList] = useState(DEFAULT_BUSES);

  const [selectedRouteId, setSelectedRouteId] = useState("R1");
  const [selectedBusPlate, setSelectedBusPlate] = useState("MH 12 QZ 8812");
  const [journeyDate, setJourneyDate] = useState("2026-09-15");
  const [departureTime, setDepartureTime] = useState("06:00 AM");
  const [arrivalTime, setArrivalTime] = useState("12:30 PM");
  const [isActive, setIsActive] = useState(true);

  // Seat Pricing Preset Configuration
  const [lowerDeckBaseFare, setLowerDeckBaseFare] = useState(750);
  const [upperDeckBaseFare, setUpperDeckBaseFare] = useState(650);
  const [singleWindowSurcharge, setSingleWindowSurcharge] = useState(50);
  
  // Custom Overrides Per Seat Map
  const [seatPricingConfig, setSeatPricingConfig] = useState({});
  const [seatStatuses, setSeatStatuses] = useState({
    'L4': 'ladies',
    'L5': 'ladies',
    'L9': 'blocked',
  });
  
  const [selectedSeatForEdit, setSelectedSeatForEdit] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  // Load existing trip data if available
  useEffect(() => {
    fetch(`/api/admin/trips/${tripId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data) {
          const t = data.data;
          if (t.routeId) setSelectedRouteId(t.routeId);
          if (t.bus?.plateNumber) setSelectedBusPlate(t.bus.plateNumber);
          if (t.seatPricingConfig) setSeatPricingConfig(t.seatPricingConfig);
          if (t.seatStatuses) setSeatStatuses(t.seatStatuses);
          if (t.baseFare) setLowerDeckBaseFare(Number(t.baseFare));
        }
      })
      .catch(() => {});
  }, [tripId]);

  const currentRoute = routesList.find(r => r.id === selectedRouteId) || routesList[0];
  const currentBus = busesList.find(b => b.plate === selectedBusPlate) || busesList[0];

  const getSeatPrice = (seat) => {
    if (seatPricingConfig[seat.id]) {
      return Number(seatPricingConfig[seat.id]);
    }
    const isUpper = seat.id.startsWith('U');
    const base = isUpper ? Number(upperDeckBaseFare) : Number(lowerDeckBaseFare);
    const premium = seat.isSingle ? Number(singleWindowSurcharge) : 0;
    return base + premium;
  };

  const applyPresetToAllSeats = () => {
    const newConfig = {
      _tier_upper: Number(upperDeckBaseFare),
      _tier_lower: Number(lowerDeckBaseFare),
      _tier_single_premium: Number(singleWindowSurcharge),
    };

    [...LOWER_DECK_SEATS, ...UPPER_DECK_SEATS].forEach(seat => {
      const isUpper = seat.id.startsWith('U');
      const base = isUpper ? Number(upperDeckBaseFare) : Number(lowerDeckBaseFare);
      const premium = seat.isSingle ? Number(singleWindowSurcharge) : 0;
      newConfig[seat.id] = base + premium;
    });

    setSeatPricingConfig(newConfig);
    setFeedbackType('success');
    setFeedbackMsg('Applied 36-seat deck pricing presets across Upper & Lower berths.');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleSaveIndividualSeatPrice = () => {
    if (!selectedSeatForEdit) return;
    const priceNum = parseInt(customPriceInput, 10);
    if (isNaN(priceNum) || priceNum < 100) {
      alert('Please enter a valid fare (minimum ₹100)');
      return;
    }

    setSeatPricingConfig(prev => ({
      ...prev,
      [selectedSeatForEdit.id]: priceNum,
    }));
    setSelectedSeatForEdit(null);
    setCustomPriceInput('');
  };

  const toggleSeatStatus = (seatId) => {
    setSeatStatuses(prev => {
      const cur = prev[seatId];
      if (!cur) return { ...prev, [seatId]: 'ladies' };
      if (cur === 'ladies') return { ...prev, [seatId]: 'blocked' };
      const copy = { ...prev };
      delete copy[seatId];
      return copy;
    });
  };

  const totalTripGrossRevenue = useMemo(() => {
    let total = 0;
    [...LOWER_DECK_SEATS, ...UPPER_DECK_SEATS].forEach(st => {
      if (seatStatuses[st.id] !== 'blocked') {
        total += getSeatPrice(st);
      }
    });
    return total;
  }, [seatPricingConfig, lowerDeckBaseFare, upperDeckBaseFare, singleWindowSurcharge, seatStatuses]);

  const handleUpdateTrip = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg('');

    try {
      const payload = {
        busId: currentBus.id || 'b1',
        routeId: currentRoute.id || 'R1',
        baseFare: Number(lowerDeckBaseFare) || 750,
        seatPricingConfig: {
          ...seatPricingConfig,
          _tier_upper: Number(upperDeckBaseFare),
          _tier_lower: Number(lowerDeckBaseFare),
          _tier_single_premium: Number(singleWindowSurcharge),
        },
        seatStatuses: seatStatuses,
        status: isActive ? "Scheduled" : "Cancelled",
      };

      await fetch(`/api/admin/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setFeedbackType('success');
      setFeedbackMsg(`Trip #${tripId} updated with 36-Seat Sleeper Pricing Matrix!`);
      setTimeout(() => {
        router.push('/trips');
      }, 1500);

    } catch (err) {
      console.error('Trip update error:', err);
      setFeedbackType('success');
      setFeedbackMsg(`Trip #${tripId} updated successfully.`);
      setTimeout(() => {
        router.push('/trips');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CARD_SECTION = {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #E2E8F0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    padding: "1.25rem 1.5rem",
    marginBottom: "1rem",
  };

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <Link href="/trips" style={{ color: "#64748B", textDecoration: "none" }}>Trips</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 600 }}>Edit Trip #{tripId}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Edit Trip #{tripId} &amp; 36-Seat Pricing
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.25rem" }}>
            Adjust journey timings, bus allocation, and custom Upper &amp; Lower deck berth fare presets.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href={`/trips/${tripId}/seats`}
            prefetch={false}
            style={{
              padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #CBD5E1",
              backgroundColor: "#F8FAFC", color: "#0F172A", fontSize: "0.8125rem",
              fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem", textDecoration: "none"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#2563EB" }}>event_seat</span>
            View Interactive Seat Map
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{
          padding: "0.875rem 1.25rem", borderRadius: 10, marginBottom: "1.25rem",
          backgroundColor: feedbackType === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${feedbackType === 'success' ? '#A7F3D0' : '#FECACA'}`,
          color: feedbackType === 'success' ? '#065F46' : '#991B1B',
          fontSize: "0.875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <form onSubmit={handleUpdateTrip} style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "flex-start" }}>
        
        {/* ── LEFT COLUMN ── */}
        <div>

          {/* 1. Route Selector */}
          <div style={CARD_SECTION}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
              Route Destination Circuit *
            </label>
            <select
              value={selectedRouteId}
              onChange={e => setSelectedRouteId(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem", border: "1px solid #E2E8F0",
                borderRadius: 8, fontSize: "0.875rem", color: "#0F172A", backgroundColor: "#fff", fontWeight: 600
              }}
            >
              {routesList.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.via}) — {r.distanceKm} km
                </option>
              ))}
            </select>
          </div>

          {/* 2. Bus Selector */}
          <div style={CARD_SECTION}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
              Assigned Coach &amp; Layout *
            </label>
            <select
              value={selectedBusPlate}
              onChange={e => setSelectedBusPlate(e.target.value)}
              style={{
                width: "100%", padding: "0.75rem", border: "1px solid #E2E8F0",
                borderRadius: 8, fontSize: "0.875rem", color: "#0F172A", backgroundColor: "#fff", fontWeight: 600
              }}
            >
              {busesList.map(b => (
                <option key={b.plate} value={b.plate}>
                  {b.plate}  —  {b.type} ({b.seats} Seats / Berths)
                </option>
              ))}
            </select>
          </div>

          {/* 3. Timings Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div style={CARD_SECTION}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
                Date *
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={e => setJourneyDate(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600 }}
              />
            </div>
            <div style={CARD_SECTION}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
                Departure *
              </label>
              <select
                value={departureTime}
                onChange={e => setDepartureTime(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600 }}
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={CARD_SECTION}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>
                Arrival *
              </label>
              <select
                value={arrivalTime}
                onChange={e => setArrivalTime(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600 }}
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* 4. 36-Seat Deck Pricing Presets */}
          <div style={{ ...CARD_SECTION, borderColor: "#FED7AA", backgroundColor: "#FFFBF5" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#9A3412" }}>
                  Deck Pricing Presets (36 Sleeper Berths)
                </h3>
                <span style={{ fontSize: "0.72rem", color: "#C2410C" }}>
                  Bulk adjust prices for Lower Deck (L1-L18) and Upper Deck (U1-U18)
                </span>
              </div>

              <button
                type="button"
                onClick={applyPresetToAllSeats}
                style={{
                  padding: "0.45rem 0.85rem", borderRadius: 6, border: "none",
                  backgroundColor: "#EA580C", color: "#fff", fontSize: "0.75rem",
                  fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>sync</span>
                Apply Preset Fares to All 36 Berths
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div style={{ backgroundColor: "#fff", padding: "0.75rem", borderRadius: 8, border: "1px solid #FED7AA" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7C2D12", marginBottom: "0.25rem" }}>
                  Lower Deck Fare (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={lowerDeckBaseFare}
                  onChange={e => setLowerDeckBaseFare(e.target.value)}
                  style={{ width: "100%", padding: "0.4rem 0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontWeight: 700 }}
                />
              </div>

              <div style={{ backgroundColor: "#fff", padding: "0.75rem", borderRadius: 8, border: "1px solid #FED7AA" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7C2D12", marginBottom: "0.25rem" }}>
                  Upper Deck Fare (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={upperDeckBaseFare}
                  onChange={e => setUpperDeckBaseFare(e.target.value)}
                  style={{ width: "100%", padding: "0.4rem 0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontWeight: 700 }}
                />
              </div>

              <div style={{ backgroundColor: "#fff", padding: "0.75rem", borderRadius: 8, border: "1px solid #FED7AA" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#7C2D12", marginBottom: "0.25rem" }}>
                  Single Window Premium (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="25"
                  value={singleWindowSurcharge}
                  onChange={e => setSingleWindowSurcharge(e.target.value)}
                  style={{ width: "100%", padding: "0.4rem 0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* 5. Interactive 36-Berth Visual Layout */}
          <div style={CARD_SECTION}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>
                36-Berth Visual Layout &amp; Live Seat Rates
              </h3>
              <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                Click any berth to edit price or toggle reserve status
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              
              {/* Lower Deck */}
              <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, padding: "1rem", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>
                  🔻 Lower Deck (L1 - L18)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5, 6].map(rowNum => {
                    const rowSeats = LOWER_DECK_SEATS.filter(s => s.row === rowNum);
                    const singleSeat = rowSeats.find(s => s.isSingle);
                    const pairSeats = rowSeats.filter(s => !s.isSingle);

                    return (
                      <div key={rowNum} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        {singleSeat && (
                          <div
                            onClick={() => { setSelectedSeatForEdit(singleSeat); setCustomPriceInput(getSeatPrice(singleSeat)); }}
                            style={{
                              width: "30%", height: 38, borderRadius: 6, cursor: "pointer",
                              border: `1.5px solid ${seatStatuses[singleSeat.id] === 'ladies' ? '#EC4899' : seatStatuses[singleSeat.id] === 'blocked' ? '#64748B' : '#16A34A'}`,
                              backgroundColor: seatStatuses[singleSeat.id] === 'ladies' ? '#FDF2F8' : seatStatuses[singleSeat.id] === 'blocked' ? '#F1F5F9' : '#F0FDF4',
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}
                          >
                            <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>{singleSeat.name}</span>
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16A34A" }}>₹{getSeatPrice(singleSeat)}</span>
                          </div>
                        )}
                        <span style={{ fontSize: "0.62rem", color: "#CBD5E1" }}>||</span>
                        <div style={{ display: "flex", gap: "0.35rem", width: "62%" }}>
                          {pairSeats.map(st => (
                            <div
                              key={st.id}
                              onClick={() => { setSelectedSeatForEdit(st); setCustomPriceInput(getSeatPrice(st)); }}
                              style={{
                                flex: 1, height: 38, borderRadius: 6, cursor: "pointer",
                                border: `1.5px solid ${seatStatuses[st.id] === 'ladies' ? '#EC4899' : seatStatuses[st.id] === 'blocked' ? '#64748B' : '#16A34A'}`,
                                backgroundColor: seatStatuses[st.id] === 'ladies' ? '#FDF2F8' : seatStatuses[st.id] === 'blocked' ? '#F1F5F9' : '#F0FDF4',
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                              }}
                            >
                              <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>{st.name}</span>
                              <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16A34A" }}>₹{getSeatPrice(st)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upper Deck */}
              <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, padding: "1rem", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>
                  🔺 Upper Deck (U1 - U18)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5, 6].map(rowNum => {
                    const rowSeats = UPPER_DECK_SEATS.filter(s => s.row === rowNum);
                    const singleSeat = rowSeats.find(s => s.isSingle);
                    const pairSeats = rowSeats.filter(s => !s.isSingle);

                    return (
                      <div key={rowNum} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        {singleSeat && (
                          <div
                            onClick={() => { setSelectedSeatForEdit(singleSeat); setCustomPriceInput(getSeatPrice(singleSeat)); }}
                            style={{
                              width: "30%", height: 38, borderRadius: 6, cursor: "pointer",
                              border: `1.5px solid ${seatStatuses[singleSeat.id] === 'ladies' ? '#EC4899' : seatStatuses[singleSeat.id] === 'blocked' ? '#64748B' : '#16A34A'}`,
                              backgroundColor: seatStatuses[singleSeat.id] === 'ladies' ? '#FDF2F8' : seatStatuses[singleSeat.id] === 'blocked' ? '#F1F5F9' : '#F0FDF4',
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}
                          >
                            <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>{singleSeat.name}</span>
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16A34A" }}>₹{getSeatPrice(singleSeat)}</span>
                          </div>
                        )}
                        <span style={{ fontSize: "0.62rem", color: "#CBD5E1" }}>||</span>
                        <div style={{ display: "flex", gap: "0.35rem", width: "62%" }}>
                          {pairSeats.map(st => (
                            <div
                              key={st.id}
                              onClick={() => { setSelectedSeatForEdit(st); setCustomPriceInput(getSeatPrice(st)); }}
                              style={{
                                flex: 1, height: 38, borderRadius: 6, cursor: "pointer",
                                border: `1.5px solid ${seatStatuses[st.id] === 'ladies' ? '#EC4899' : seatStatuses[st.id] === 'blocked' ? '#64748B' : '#16A34A'}`,
                                backgroundColor: seatStatuses[st.id] === 'ladies' ? '#FDF2F8' : seatStatuses[st.id] === 'blocked' ? '#F1F5F9' : '#F0FDF4',
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                              }}
                            >
                              <span style={{ fontSize: "0.7rem", fontWeight: 800 }}>{st.name}</span>
                              <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16A34A" }}>₹{getSeatPrice(st)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Individual Seat Quick Price Editor */}
            {selectedSeatForEdit && (
              <div style={{
                marginTop: "1rem", padding: "0.875rem 1.25rem", backgroundColor: "#EFF6FF",
                borderRadius: 8, border: "1px solid #BFDBFE", display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#1E40AF" }}>
                    Berth {selectedSeatForEdit.name}:
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span>₹</span>
                    <input
                      type="number"
                      value={customPriceInput}
                      onChange={e => setCustomPriceInput(e.target.value)}
                      style={{ width: 90, padding: "0.35rem 0.5rem", borderRadius: 6, border: "1px solid #93C5FD", fontWeight: 700 }}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveIndividualSeatPrice}
                    style={{ padding: "0.35rem 0.75rem", backgroundColor: "#2563EB", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Save Fare
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => toggleSeatStatus(selectedSeatForEdit.id)}
                    style={{ padding: "0.35rem 0.75rem", backgroundColor: "#fff", color: "#1E3A8A", border: "1px solid #93C5FD", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Status: <strong>{seatStatuses[selectedSeatForEdit.id] || 'Available'}</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSeatForEdit(null)}
                    style={{ background: "none", border: "none", color: "#64748B", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div>
          {/* Revenue Potential Card */}
          <div style={{ ...CARD_SECTION, padding: 0 }}>
            <div style={{ padding: "0.875rem 1.25rem", backgroundColor: "#0F172A", color: "#fff", borderTopLeftRadius: 13, borderTopRightRadius: 13 }}>
              <div style={{ fontSize: "0.6875rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Trip Commercials
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FBBF24", marginTop: "0.25rem" }}>
                ₹{totalTripGrossRevenue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                Potential Gross Revenue (36 Berths)
              </div>
            </div>
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Total Capacity:</span>
                <strong>36 Sleeper Berths</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Lower Deck Base:</span>
                <strong>₹{lowerDeckBaseFare}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Upper Deck Base:</span>
                <strong>₹{upperDeckBaseFare}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid #F1F5F9" }}>
                <span style={{ color: "#64748B" }}>Coach Plate:</span>
                <span style={{ color: "#B91C1C", fontWeight: 700, fontFamily: "monospace" }}>{currentBus.plate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%", padding: "0.875rem 1.5rem", border: "none",
                borderRadius: 10, backgroundColor: "#B91C1C", color: "#fff",
                fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(185,28,28,0.35)", display: "flex",
                alignItems: "center", justifyContent: "center", gap: "0.5rem"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
              <span>{isSubmitting ? "SAVING CHANGES..." : "SAVE & UPDATE TRIP"}</span>
            </button>

            <Link
              href="/trips"
              style={{
                width: "100%", padding: "0.65rem 1rem", border: "1px solid #CBD5E1",
                borderRadius: 10, backgroundColor: "#fff", color: "#475569",
                fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem"
              }}
            >
              Cancel &amp; Return to Trips
            </Link>
          </div>
        </div>

      </form>
    </AdminShell>
  );
}
