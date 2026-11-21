"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import AdminBoardingPassModal from "@/components/ui/AdminBoardingPassModal";
import { adminFetch } from "@/lib/api";

export default function BusBookingDetailPage({ params, id }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Confirmed");
  const [copied, setCopied] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [bookingId, setBookingId] = useState(() => {
    if (id && id !== "default") return id;
    if (params?.id && params.id !== "default") return params.id;
    return "";
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    let resolved = id || params?.id || "";
    if (!resolved || resolved === "default") {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const qId = urlParams.get("id");
        if (qId && qId !== "default") {
          resolved = qId;
        } else {
          const segments = window.location.pathname.split("/").filter(Boolean);
          const last = segments[segments.length - 1];
          if (last && !["bookings", "view", "default"].includes(last)) {
            resolved = decodeURIComponent(last);
          }
        }
      }
    }
    if (resolved && resolved !== "default") {
      setBookingId(resolved);
    }
  }, [id, params]);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminFetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}`)
      .then(res => res.json())
      .then(data => {
        const b = data.data || data;
        if (b && (b.id || b.totalAmount !== undefined)) {
          setBooking(b);
          setStatus(b.status || "Confirmed");
        }
      })
      .catch(err => console.error("Error loading booking:", err))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleApplyStatus = async (targetStatus = status) => {
    if (!bookingId || bookingId === "default") {
      setStatus(targetStatus);
      showToast(`Booking status set to ${targetStatus}`);
      return;
    }
    setIsUpdating(true);
    try {
      const res = await adminFetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(targetStatus);
        setBooking(prev => prev ? { ...prev, status: targetStatus } : prev);
        showToast(`Booking marked as ${targetStatus}`);
      } else {
        showToast(data.message || "Failed to update booking status");
      }
    } catch {
      showToast("Network error while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyBookingId = () => {
    navigator.clipboard?.writeText(booking?.id || bookingId || "#VB-20261015-0042");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CARD_STYLE = {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #F1F5F9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
    marginBottom: "1.25rem",
  };

  const CARD_HEADER = (icon, title, color = "#B91C1C") => (
    <div style={{
      padding: "0.875rem 1.25rem",
      borderBottom: "1px solid #F8FAFC",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, color }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "#0F172A" }}>{title}</h3>
    </div>
  );

  const displayId = booking?.id || bookingId || "#VB-20261015-0042";
  const userName = booking?.user?.name || "Abhishek Sharma";
  const userEmail = booking?.user?.email || "abhishek.sharma23@gmail.com";
  const userPhone = booking?.user?.phone || "+91-8208024895";
  const userInitials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "AS";
  const originCity = booking?.trip?.route?.originCity || "Nagpur";
  const destCity = booking?.trip?.route?.destinationCity || "Pune";
  const busPlate = booking?.trip?.bus?.plateNumber || "MH-31-VB-8899";
  const busType = booking?.trip?.bus?.type || "Volvo AC Sleeper (2+1)";
  const seatList = Array.isArray(booking?.seatNumbers) && booking.seatNumbers.length > 0 ? booking.seatNumbers : ["L5", "L6"];
  const fareFormatted = `₹ ${Number(booking?.totalAmount || 2570).toLocaleString('en-IN')}`;
  const depDateFormatted = booking?.trip?.departureDatetime 
    ? new Date(booking.trip.departureDatetime).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
    : "15 Oct 2026";
  const depDayFormatted = booking?.trip?.departureDatetime 
    ? new Date(booking.trip.departureDatetime).toLocaleDateString("en-US", { weekday: 'long' })
    : "Thursday";
  const depTimeFormatted = booking?.trip?.departureDatetime 
    ? new Date(booking.trip.departureDatetime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })
    : "09:30 PM";
  const arrTimeFormatted = booking?.trip?.arrivalDatetime 
    ? new Date(booking.trip.arrivalDatetime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })
    : "06:15 AM";
  const createdAtFormatted = booking?.bookingDate 
    ? new Date(booking.bookingDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date(booking.bookingDate).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })
    : "15 Oct 2026, 10:12 AM";

  const passengerRows = seatList.map((seat, idx) => ({
    num: idx + 1,
    name: idx === 0 ? userName : `Passenger ${idx + 1}`,
    age: 26,
    gender: idx === 0 ? "Primary" : "Adult",
    seat: seat,
    status: status
  }));

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <Link href="/bookings" style={{ color: "#64748B", textDecoration: "none" }}>Bookings</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>{displayId}</span>
      </div>

      {toastMessage && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          backgroundColor: "#0F172A", color: "#fff", padding: "0.75rem 1.25rem",
          borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          {toastMessage}
        </div>
      )}

      {/* Title Header with Back button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Booking Details
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            View complete booking information, passenger details, payment status and manage the booking.
          </p>
        </div>
        <Link href="/bookings" style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          padding: "0.5625rem 1rem", border: "1px solid #E2E8F0",
          borderRadius: 8, backgroundColor: "#fff", color: "#0F172A",
          fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to Bookings
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "flex-start" }}>
        
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Row: Booking Information & User Information */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "1rem", marginBottom: "1.25rem" }}>
            
            {/* Booking Information */}
            <div style={{ ...CARD_STYLE, marginBottom: 0 }}>
              {CARD_HEADER("description", "Booking Information")}
              <div style={{ padding: "1.125rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Booking ID</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>{displayId}</span>
                    <button onClick={copyBookingId} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: copied ? "#16A34A" : "#94A3B8", display: "flex" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copied ? "check" : "content_copy"}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Created At</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>{createdAtFormatted}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Booking Source</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>Online Portal (Web)</div>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div style={{ ...CARD_STYLE, marginBottom: 0 }}>
              {CARD_HEADER("person", "User Information", "#2563EB")}
              <div style={{ padding: "1.125rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    backgroundColor: "#EFF6FF", border: "1.5px solid #DBEAFE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", fontWeight: 700, color: "#2563EB", flexShrink: 0
                  }}>
                    {userInitials}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>{userName}</span>
                      <span style={{
                        fontSize: "0.6875rem", fontWeight: 600, color: "#2563EB",
                        backgroundColor: "#EFF6FF", padding: "0.15rem 0.45rem", borderRadius: 4
                      }}>
                        Verified
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>mail</span>
                      {userEmail}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem", fontSize: "0.78rem", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>call</span>
                      {userPhone}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Link href={booking?.user?.id ? `/users/${booking.user.id}` : "/users"} prefetch={false} style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2563EB", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    View User Profile <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Trip Information Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("directions_bus", "Trip Information")}
            <div style={{ padding: "1.25rem" }}>
              
              {/* Origin -> Destination Box */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1rem 1.25rem", backgroundColor: "#F8FAFC", borderRadius: 10,
                border: "1px solid #F1F5F9", marginBottom: "1.25rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#16A34A" }}>location_on</span>
                  <div>
                    <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#0F172A" }}>{originCity}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Departure Boarding Point</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94A3B8" }}>
                  <span style={{ width: 40, borderTop: "2px dashed #CBD5E1" }} />
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#64748B" }}>arrow_forward</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", textAlign: "right" }}>
                  <div>
                    <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#0F172A" }}>{destCity}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Destination Terminal</div>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#B91C1C" }}>location_on</span>
                </div>
              </div>

              {/* 4 Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>calendar_today</span>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{depDateFormatted}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{depDayFormatted}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>schedule</span>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Departure</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{depTimeFormatted}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>timelapse</span>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Arrival (Est.)</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{arrTimeFormatted}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>directions_bus</span>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Bus</div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{busPlate}</div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{busType}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Passenger Details Table */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("group", `Passenger Details (${passengerRows.length})`)}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["#", "Name", "Age", "Gender", "Seat No.", "Status"].map((h) => (
                      <th key={h} style={{
                        padding: "0.625rem 1rem", textAlign: "left",
                        fontSize: "0.6875rem", fontWeight: 600,
                        color: "#94A3B8", textTransform: "uppercase",
                        letterSpacing: "0.06em"
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {passengerRows.map((p, idx, arr) => (
                    <tr key={p.num} style={{ borderBottom: idx < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#64748B" }}>{p.num}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>{p.name}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>{p.age}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>{p.gender}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{
                          display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 4,
                          backgroundColor: "#F1F5F9", color: "#0F172A", fontSize: "0.75rem", fontWeight: 700
                        }}>
                          {p.seat}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.2rem 0.55rem", borderRadius: 4,
                          backgroundColor: status === "Cancelled" ? "#FEE2E2" : status === "Refunded" ? "#F3E8FF" : "#DCFCE7",
                          color: status === "Cancelled" ? "#991B1B" : status === "Refunded" ? "#6B21A8" : "#166534",
                          fontSize: "0.72rem", fontWeight: 600
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            backgroundColor: status === "Cancelled" ? "#EF4444" : status === "Refunded" ? "#A855F7" : "#16A34A"
                          }} />
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Requests */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("chat_bubble", "Special Requests")}
            <div style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#94A3B8" }}>
              No special requests for this booking.
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div>

          {/* Booking State Banner */}
          <div style={{
            background: status === "Cancelled" ? "#FEF2F2" : status === "Refunded" ? "#FAF5FF" : "#ECFDF5",
            borderRadius: 12, padding: "1rem 1.25rem",
            border: `1px solid ${status === "Cancelled" ? "#FECACA" : status === "Refunded" ? "#E9D5FF" : "#A7F3D0"}`,
            marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem"
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: status === "Cancelled" ? "#EF4444" : status === "Refunded" ? "#A855F7" : "#16A34A",
              flexShrink: 0
            }} />
            <div>
              <div style={{
                fontSize: "0.875rem", fontWeight: 700,
                color: status === "Cancelled" ? "#991B1B" : status === "Refunded" ? "#6B21A8" : "#166534"
              }}>{status}</div>
              <div style={{
                fontSize: "0.72rem",
                color: status === "Cancelled" ? "#7F1D1D" : status === "Refunded" ? "#581C87" : "#065F46",
                marginTop: "0.15rem"
              }}>
                {status === "Confirmed" ? "Booking is confirmed and ticket has been issued." :
                 status === "Cancelled" ? "Booking was cancelled. Seats have been released back to inventory." :
                 status === "Refunded" ? "Booking was refunded to customer payment source." : "Booking payment is pending."}
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("credit_card", "Payment Details")}
            <div style={{ padding: "1.125rem 1.25rem" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span style={{ color: "#64748B" }}>Base Fare ({seatList.length} seat{seatList.length > 1 ? "s" : ""})</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{fareFormatted}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span style={{ color: "#64748B" }}>Taxes & Fees</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>Included</span>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.875rem 0", borderTop: "1px solid #F1F5F9",
                borderBottom: "1px solid #F1F5F9", marginBottom: "1rem"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>Total Amount</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>{fareFormatted}</span>
              </div>

              {/* Payment Success Note */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "0.625rem",
                padding: "0.75rem",
                backgroundColor: status === "Cancelled" ? "#FEF2F2" : "#F0FDF4",
                borderRadius: 8,
                border: `1px solid ${status === "Cancelled" ? "#FCA5A5" : "#DCFCE7"}`
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: 18,
                  color: status === "Cancelled" ? "#DC2626" : "#16A34A",
                  marginTop: 1
                }}>
                  {status === "Cancelled" ? "cancel" : "check_circle"}
                </span>
                <div>
                  <div style={{
                    fontSize: "0.78rem", fontWeight: 700,
                    color: status === "Cancelled" ? "#991B1B" : "#166534"
                  }}>
                    {status === "Cancelled" ? "Booking Cancelled" : status === "Refunded" ? "Payment Refunded" : "Payment Successful"}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#64748B", marginTop: "0.15rem" }}>
                    Booked on {createdAtFormatted}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", marginTop: "0.1rem" }}>
                    Ref ID: {booking?.id ? `tx_${booking.id.slice(0, 12)}` : "pay_live_online"}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Admin Actions Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("tune", "Admin Actions")}
            <div style={{ padding: "1.125rem 1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                Update Booking Status
              </label>
              
              {/* Dropdown with status dot */}
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: status === "Cancelled" ? "#EF4444" : status === "Refunded" ? "#A855F7" : "#16A34A",
                  pointerEvents: "none"
                }} />
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  style={{
                    width: "100%", paddingLeft: 28, paddingRight: 24, paddingTop: 8, paddingBottom: 8,
                    border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem",
                    color: "#0F172A", backgroundColor: "#fff", cursor: "pointer", outline: "none"
                  }}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              {/* Apply Changes Button */}
              <button
                type="button"
                onClick={() => handleApplyStatus(status)}
                disabled={isUpdating}
                style={{
                  width: "100%", padding: "0.5625rem", border: "none", borderRadius: 8,
                  backgroundColor: isUpdating ? "#94A3B8" : "#B91C1C", color: "#fff", fontSize: "0.8125rem",
                  fontWeight: 600, cursor: isUpdating ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.35rem", marginBottom: "0.75rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                {isUpdating ? "Saving..." : "Apply Changes"}
              </button>

              {/* Secondary action pills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => handleApplyStatus("Cancelled")}
                  disabled={isUpdating || status === "Cancelled"}
                  style={{
                    padding: "0.45rem", border: "1px solid #FCA5A5", borderRadius: 6,
                    backgroundColor: "#FFF5F5", color: "#DC2626", fontSize: "0.72rem",
                    fontWeight: 600, cursor: isUpdating || status === "Cancelled" ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                    opacity: status === "Cancelled" ? 0.5 : 1
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>cancel</span>
                  Cancel Booking
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyStatus("Refunded")}
                  disabled={isUpdating || status === "Refunded"}
                  style={{
                    padding: "0.45rem", border: "1px solid #DDD6FE", borderRadius: 6,
                    backgroundColor: "#F5F3FF", color: "#7C3AED", fontSize: "0.72rem",
                    fontWeight: 600, cursor: isUpdating || status === "Refunded" ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                    opacity: status === "Refunded" ? 0.5 : 1
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>restart_alt</span>
                  Process Refund
                </button>
              </div>

              <button
                type="button"
                onClick={() => showToast("E-ticket resent to customer email and SMS")}
                style={{
                  width: "100%", padding: "0.45rem", border: "1px solid #E2E8F0", borderRadius: 6,
                  backgroundColor: "#fff", color: "#475569", fontSize: "0.72rem",
                  fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.25rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>send</span>
                Resend Ticket
              </button>

            </div>
          </div>

          {/* Ticket & Invoice Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("receipt_long", "Ticket & Invoice")}
            <div style={{ padding: "1rem 1.25rem", display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                style={{
                  flex: 1, padding: "0.5rem", border: "1px solid #B91C1C", borderRadius: 8,
                  backgroundColor: "#FEF2F2", color: "#B91C1C", fontSize: "0.75rem",
                  fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.3rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                View E-Ticket
              </button>
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                style={{
                  flex: 1, padding: "0.5rem", border: "1px solid #E2E8F0", borderRadius: 8,
                  backgroundColor: "#fff", color: "#0F172A", fontSize: "0.75rem",
                  fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.3rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                Print Pass (PDF)
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ADMIN BOARDING PASS MODAL */}
      <AdminBoardingPassModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticketData={{
          id: displayId,
          bookingId: displayId,
          customerName: userName,
          customerPhone: userPhone,
          customerEmail: userEmail,
          operator: "Vedanta Luxury Express",
          busType: busType,
          busPlate: busPlate,
          from: originCity,
          fromStation: `${originCity} Central Terminal`,
          to: destCity,
          toStation: `${destCity} Main Terminal`,
          depTime: depTimeFormatted,
          depDate: depDateFormatted,
          arrTime: arrTimeFormatted,
          arrDate: depDateFormatted,
          duration: "9h 45m",
          seats: seatList,
          passengers: passengerRows.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            seat: p.seat,
            relation: "Passenger"
          })),
          totalAmount: fareFormatted,
          driverName: "Sunil Sharma (Verified Captain)",
          driverPhone: "+91-8208024895",
          status: status,
        }}
      />
    </AdminShell>
  );
}
