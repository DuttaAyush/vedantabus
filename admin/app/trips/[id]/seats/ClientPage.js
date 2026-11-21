"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── 36-Seat Sleeper Bus Layout Definition for Admin Seat Editor ──────────────
// Lower Deck: 18 Seats (L1 to L18)
// Upper Deck: 18 Seats (U1 to U18)
// Total: 36 Berths with custom price & status overrides per seat

const INITIAL_LOWER_36 = [
  { id: "L1", number: "L1", row: 1, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L2", number: "L2", row: 1, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L3", number: "L3", row: 2, col: "left-single", type: "single", isWindow: true, deck: "lower", price: 750, status: "available" },
  { id: "L4", number: "L4", row: 2, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L5", number: "L5", row: 2, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L6", number: "L6", row: 3, col: "left-single", type: "single", isWindow: true, deck: "lower", price: 750, status: "available" },
  { id: "L7", number: "L7", row: 3, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L8", number: "L8", row: 3, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L9", number: "L9", row: 4, col: "left-single", type: "single", isWindow: true, deck: "lower", price: 750, status: "available" },
  { id: "L10", number: "L10", row: 4, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L11", number: "L11", row: 4, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L12", number: "L12", row: 5, col: "left-single", type: "single", isWindow: true, deck: "lower", price: 750, status: "available" },
  { id: "L13", number: "L13", row: 5, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L14", number: "L14", row: 5, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L15", number: "L15", row: 6, col: "left-single", type: "single", isWindow: true, deck: "lower", price: 750, status: "available" },
  { id: "L16", number: "L16", row: 6, col: "right-aisle", type: "double", isWindow: false, deck: "lower", price: 700, status: "available" },
  { id: "L17", number: "L17", row: 6, col: "right-window", type: "double", isWindow: true, deck: "lower", price: 700, status: "available" },
  { id: "L18", number: "L18", row: 6, col: "rear-center", type: "single", isWindow: false, deck: "lower", price: 650, status: "available" },
];

const INITIAL_UPPER_36 = [
  { id: "U1", number: "U1", row: 1, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U2", number: "U2", row: 1, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U3", number: "U3", row: 1, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
  { id: "U4", number: "U4", row: 2, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U5", number: "U5", row: 2, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U6", number: "U6", row: 2, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
  { id: "U7", number: "U7", row: 3, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U8", number: "U8", row: 3, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U9", number: "U9", row: 3, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
  { id: "U10", number: "U10", row: 4, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U11", number: "U11", row: 4, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U12", number: "U12", row: 4, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
  { id: "U13", number: "U13", row: 5, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U14", number: "U14", row: 5, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U15", number: "U15", row: 5, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
  { id: "U16", number: "U16", row: 6, col: "left-single", type: "single", isWindow: true, deck: "upper", price: 700, status: "available" },
  { id: "U17", number: "U17", row: 6, col: "right-aisle", type: "double", isWindow: false, deck: "upper", price: 650, status: "available" },
  { id: "U18", number: "U18", row: 6, col: "right-window", type: "double", isWindow: true, deck: "upper", price: 650, status: "available" },
];

export default function TripSeatMapPage({ params }) {
  const tripId = params?.id || "";
  const [activeDeck, setActiveDeck] = useState("lower"); // 'lower' | 'upper'
  const [lowerSeats, setLowerSeats] = useState(INITIAL_LOWER_36);
  const [upperSeats, setUpperSeats] = useState(INITIAL_UPPER_36);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [tripInfo, setTripInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId || tripId === "default") {
      setLoading(false);
      return;
    }
    adminFetch(`/api/admin/trips/${tripId}/seats`)
      .then(res => res.json())
      .then(data => {
        const payload = data.data || data;
        setTripInfo(payload);
        const booked = Array.isArray(payload.bookedSeats) ? payload.bookedSeats : [];
        if (booked.length > 0) {
          setLowerSeats(prev => prev.map(s => {
            const isBooked = booked.includes(s.id) || booked.includes(s.number);
            return {
              ...s,
              status: isBooked ? "booked" : (s.status === "booked" ? "available" : s.status),
              passenger: isBooked ? "Booked / Sold Seat" : undefined,
            };
          }));
          setUpperSeats(prev => prev.map(s => {
            const isBooked = booked.includes(s.id) || booked.includes(s.number);
            return {
              ...s,
              status: isBooked ? "booked" : (s.status === "booked" ? "available" : s.status),
              passenger: isBooked ? "Booked / Sold Seat" : undefined,
            };
          }));
        }
        if (payload.seatPricingConfig && typeof payload.seatPricingConfig === 'object') {
          setLowerSeats(prev => prev.map(s => ({
            ...s,
            price: payload.seatPricingConfig[s.id] || s.price,
          })));
          setUpperSeats(prev => prev.map(s => ({
            ...s,
            price: payload.seatPricingConfig[s.id] || s.price,
          })));
        }
        if (payload.seatStatuses && typeof payload.seatStatuses === 'object') {
          setLowerSeats(prev => prev.map(s => ({
            ...s,
            status: payload.seatStatuses[s.id] || s.status,
          })));
          setUpperSeats(prev => prev.map(s => ({
            ...s,
            status: payload.seatStatuses[s.id] || s.status,
          })));
        }
      })
      .catch(err => console.error("[Admin Seats] Error loading seats:", err))
      .finally(() => setLoading(false));
  }, [tripId]);

  // Bulk Tier Pricing Inputs
  const [bulkLowerPrice, setBulkLowerPrice] = useState(750);
  const [bulkUpperPrice, setBulkUpperPrice] = useState(650);
  const [isSaving, setIsSaving] = useState(false);

  const currentSeats = activeDeck === "lower" ? lowerSeats : upperSeats;
  const setCurrentSeats = activeDeck === "lower" ? setLowerSeats : setUpperSeats;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleUpdateSeatPriceAndStatus = (seatId, newPrice, newStatus) => {
    const updateFn = (prev) => prev.map(s => {
      if (s.id === seatId) {
        return {
          ...s,
          price: Number(newPrice) || s.price,
          status: newStatus || s.status,
        };
      }
      return s;
    });

    if (activeDeck === "lower") {
      setLowerSeats(updateFn);
    } else {
      setUpperSeats(updateFn);
    }

    if (selectedSeat && selectedSeat.id === seatId) {
      setSelectedSeat({
        ...selectedSeat,
        price: Number(newPrice) || selectedSeat.price,
        status: newStatus || selectedSeat.status,
      });
    }

    showToast(`Updated Seat ${seatId}: Price ₹${newPrice}, Status: ${newStatus}`);
  };

  const applyBulkLowerPricing = () => {
    setLowerSeats(prev => prev.map(s => ({ ...s, price: Number(bulkLowerPrice) })));
    showToast(`All Lower Deck seats updated to ₹${bulkLowerPrice}`);
  };

  const applyBulkUpperPricing = () => {
    setUpperSeats(prev => prev.map(s => ({ ...s, price: Number(bulkUpperPrice) })));
    showToast(`All Upper Deck seats updated to ₹${bulkUpperPrice}`);
  };

  const handleSaveAll = async () => {
    if (!tripId || tripId === "default") {
      showToast("Trip Seat Pricing & Status configurations saved (Preview mode)");
      return;
    }
    setIsSaving(true);
    try {
      const seatPricingConfig = {};
      const seatStatuses = {};
      [...lowerSeats, ...upperSeats].forEach(s => {
        if (s.price) seatPricingConfig[s.id] = Number(s.price);
        if (s.status && s.status !== 'booked') seatStatuses[s.id] = s.status;
      });

      const res = await adminFetch(`/api/admin/trips/${tripId}`, {
        method: 'PATCH',
        body: JSON.stringify({ seatPricingConfig, seatStatuses }),
      });
      if (res.ok) {
        showToast("Trip Seat Pricing & Quotas successfully saved to Database!");
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to save trip seat configuration.");
      }
    } catch {
      showToast("Network error while saving seat configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  const rows = [1, 2, 3, 4, 5, 6];

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem" }}>
        
        {/* Breadcrumb & Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#64748B", marginBottom: "0.25rem" }}>
              <Link href="/trips" style={{ color: "#B91C1C", textDecoration: "none", fontWeight: 600 }}>Trips</Link>
              <span>/</span>
              <span style={{ fontWeight: 600 }}>Trip #{tripInfo?.busPlate ? `${tripId} (${tripInfo.busPlate})` : (tripId || 'Seat Map')}</span>
              <span>/</span>
              <span>Seat Pricing &amp; Map Editor</span>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Trip 36-Seat Pricing &amp; Quota Manager {tripInfo && <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#059669", marginLeft: "0.5rem" }}>({tripInfo.seatsLeft ?? 36} seats available, {tripInfo.bookedSeats?.length || 0} sold)</span>}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link
              href="/trips"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.6rem 1rem", border: "1px solid #E2E8F0",
                borderRadius: 10, backgroundColor: "#fff", color: "#475569",
                fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Back to Trips
            </Link>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.6rem 1.25rem", border: "none",
                borderRadius: 10, backgroundColor: isSaving ? "#94A3B8" : "#B91C1C", color: "#fff",
                fontSize: "0.8125rem", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(185,28,28,0.2)"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46",
            padding: "0.75rem 1rem", borderRadius: 10, fontSize: "0.8125rem", fontWeight: 700,
            marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#059669" }}>check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Quick Bulk Tier Pricing Toolbar */}
        <div style={{
          backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
          padding: "1rem 1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem"
        }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Bulk Tier Pricing
            </span>
            <div style={{ fontSize: "0.8125rem", color: "#0F172A", fontWeight: 600 }}>
              Apply standard fare across all seats in Lower or Upper decks with 1 click
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
            {/* Lower Deck Bulk */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Lower Deck: ₹</span>
              <input
                type="number"
                value={bulkLowerPrice}
                onChange={(e) => setBulkLowerPrice(e.target.value)}
                style={{ width: 75, padding: "0.4rem 0.5rem", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.8125rem", fontWeight: 700 }}
              />
              <button
                type="button"
                onClick={applyBulkLowerPricing}
                style={{ padding: "0.4rem 0.75rem", backgroundColor: "#0F172A", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
              >
                Apply
              </button>
            </div>

            {/* Upper Deck Bulk */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>Upper Deck: ₹</span>
              <input
                type="number"
                value={bulkUpperPrice}
                onChange={(e) => setBulkUpperPrice(e.target.value)}
                style={{ width: 75, padding: "0.4rem 0.5rem", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.8125rem", fontWeight: 700 }}
              />
              <button
                type="button"
                onClick={applyBulkUpperPricing}
                style={{ padding: "0.4rem 0.75rem", backgroundColor: "#0F172A", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Grid (Deck Selector + Visual Seat Map + Seat Edit Inspector) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
          
          {/* LEFT: VISUAL 36-SEAT SLEEPER BUS ARENA */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            
            {/* Deck Switch Tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveDeck("lower")}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
                    backgroundColor: activeDeck === "lower" ? "#0F172A" : "#F1F5F9",
                    color: activeDeck === "lower" ? "#fff" : "#475569",
                    fontSize: "0.8125rem", fontWeight: 700
                  }}
                >
                  Lower Deck (L1 – L18)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck("upper")}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
                    backgroundColor: activeDeck === "upper" ? "#0F172A" : "#F1F5F9",
                    color: activeDeck === "upper" ? "#fff" : "#475569",
                    fontSize: "0.8125rem", fontWeight: 700
                  }}
                >
                  Upper Deck (U1 – U18)
                </button>
              </div>

              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748B" }}>
                Click any seat to edit price or status
              </div>
            </div>

            {/* RedBus-Style Sleeper Berths (1+2 Grid) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 360, margin: "0 auto", padding: "1rem 0" }}>
              {rows.map(rowNum => {
                const rowSeats = currentSeats.filter(s => s.row === rowNum);
                const single = rowSeats.find(s => s.col === "left-single");
                const aisle = rowSeats.find(s => s.col === "right-aisle");
                const window = rowSeats.find(s => s.col === "right-window");

                const renderBerthBtn = (seat) => {
                  if (!seat) return <div style={{ width: 64, height: 96 }} />;

                  const isSelected = selectedSeat && selectedSeat.id === seat.id;
                  let bg = "#fff";
                  let border = "#16A34A";
                  let tagColor = "#16A34A";

                  if (seat.status === "booked") {
                    bg = "#E2E8F0";
                    border = "#94A3B8";
                    tagColor = "#475569";
                  } else if (seat.status === "ladies") {
                    bg = "#FCE7F3";
                    border = "#F472B6";
                    tagColor = "#BE185D";
                  } else if (seat.status === "blocked") {
                    bg = "#FEE2E2";
                    border = "#EF4444";
                    tagColor = "#B91C1C";
                  }

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      style={{
                        width: 64, height: 96, borderRadius: 14,
                        backgroundColor: bg,
                        border: isSelected ? "3px solid #2563EB" : `2px solid ${border}`,
                        boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
                        cursor: "pointer", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "space-between",
                        padding: "6px 4px", transition: "all 0.15s ease"
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0F172A" }}>{seat.number}</span>
                      <span style={{ fontSize: "0.625rem", fontWeight: 700, color: tagColor, textTransform: "capitalize" }}>
                        {seat.status}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0F172A", backgroundColor: "rgba(0,0,0,0.05)", padding: "1px 4px", borderRadius: 4 }}>
                        ₹{seat.price}
                      </span>
                    </button>
                  );
                };

                return (
                  <div key={rowNum} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    {/* Left Single */}
                    <div>{renderBerthBtn(single)}</div>

                    {/* Aisle */}
                    <div style={{ flex: 1, borderRight: "1px dashed #CBD5E1", height: 60 }} />

                    {/* Right Double */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {renderBerthBtn(aisle)}
                      {renderBerthBtn(window)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SEAT INSPECTOR & PRICE EDIT MODAL */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0F172A", margin: "0 0 1rem 0", paddingBottom: "0.75rem", borderBottom: "1px solid #F1F5F9" }}>
              Seat Inspector
            </h3>

            {selectedSeat ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#0F172A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
                      {selectedSeat.number}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0F172A" }}>
                        Seat {selectedSeat.number} ({selectedSeat.deck.toUpperCase()} Deck)
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "capitalize" }}>
                        {selectedSeat.type} Sleeper • {selectedSeat.isWindow ? "Window Side" : "Aisle Side"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Price */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.375rem" }}>
                    Seat Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    value={selectedSeat.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateSeatPriceAndStatus(selectedSeat.id, val, selectedSeat.status);
                    }}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.9375rem", fontWeight: 700, boxSizing: "border-box" }}
                  />
                </div>

                {/* Edit Status */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: "0.375rem" }}>
                    Seat Allocation Status
                  </label>
                  <select
                    value={selectedSeat.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdateSeatPriceAndStatus(selectedSeat.id, selectedSeat.price, val);
                    }}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: "0.875rem", fontWeight: 700, backgroundColor: "#fff", boxSizing: "border-box" }}
                  >
                    <option value="available">Available (Public Booking)</option>
                    <option value="ladies">Ladies Reserved (Pink Quota)</option>
                    <option value="blocked">Blocked / Maintenance</option>
                    <option value="booked">Booked (Locked)</option>
                  </select>
                </div>

                {selectedSeat.passenger && (
                  <div style={{ padding: "0.75rem", borderRadius: 10, backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Booked Passenger</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginTop: "0.25rem" }}>{selectedSeat.passenger}</div>
                  </div>
                )}

                <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.5, backgroundColor: "#F8FAFC", padding: "0.75rem", borderRadius: 10 }}>
                  💡 Changes take effect immediately in trip search &amp; checkout calculation.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#94A3B8" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#CBD5E1", display: "block", marginBottom: "0.5rem" }}>touch_app</span>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Select a seat from the bus diagram to edit its price or allocation status.</div>
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminShell>
  );
}
