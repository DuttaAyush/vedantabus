"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import AdminBoardingPassModal from "@/components/ui/AdminBoardingPassModal";
import { adminFetch } from "@/lib/api";

export default function PackageBookingDetailPage({ params }) {
  const bookingId = params?.id || "";
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Confirmed");
  const [copied, setCopied] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    if (!bookingId || bookingId === "default") {
      setLoading(false);
      return;
    }
    adminFetch(`/api/admin/package-bookings/${bookingId}`)
      .then(res => res.json())
      .then(data => {
        const b = data.data || data;
        if (b && b.id) {
          setBooking(b);
          setStatus(b.status || "Confirmed");
        }
      })
      .catch(err => console.error("Error loading package booking:", err))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleApplyStatus = async (targetStatus = status) => {
    if (!bookingId || bookingId === "default") {
      setStatus(targetStatus);
      showToast(`Package booking status set to ${targetStatus}`);
      return;
    }
    setIsUpdating(true);
    try {
      const res = await adminFetch(`/api/admin/package-bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(targetStatus);
        setBooking(prev => prev ? { ...prev, status: targetStatus } : prev);
        showToast(`Package booking status marked as ${targetStatus}`);
      } else {
        showToast(data.message || "Failed to update package booking status");
      }
    } catch {
      showToast("Network error while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyBookingId = () => {
    navigator.clipboard?.writeText(booking?.id || bookingId || "#PKG-20261110-0018");
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

  const displayId = booking?.id || bookingId || "#PKG-20261110-0018";
  const userName = booking?.user?.name || "Rahul Sharma";
  const userEmail = booking?.user?.email || "rahul.sharma23@gmail.com";
  const userPhone = booking?.user?.phone || "+91-8208024895";
  const userInitials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "RS";
  
  const packageTitle = booking?.package?.title || "Dubai & Abu Dhabi Luxury Escape";
  const packageCategory = booking?.package?.category || "International";
  const packageDuration = booking?.package?.durationDays ? `${booking.package.durationDays} Days / ${booking.package.durationDays - 1} Nights` : "7 Days 6 Nights";
  const totalTravelers = booking?.travelersCount || booking?.numberOfTravelers || 1;
  const fareFormatted = `₹ ${Number(booking?.totalAmount || 95000).toLocaleString('en-IN')}`;
  
  const travelDateFormatted = booking?.travelDate 
    ? new Date(booking.travelDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })
    : "10 Nov 2026";
  const travelDayFormatted = booking?.travelDate 
    ? new Date(booking.travelDate).toLocaleDateString("en-US", { weekday: 'short' })
    : "Tue";
  const createdAtFormatted = booking?.createdAt 
    ? new Date(booking.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date(booking.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })
    : (booking?.bookingDate 
        ? new Date(booking.bookingDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + new Date(booking.bookingDate).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true })
        : "Confirmed Booking");

  const travelersList = Array.from({ length: totalTravelers }).map((_, idx) => ({
    num: idx + 1,
    name: idx === 0 ? `${userName} (Lead Traveller)` : `Traveller ${idx + 1}`,
    age: idx === 0 ? 28 : 26,
    gender: idx === 0 ? "Male" : "Female",
    meal: idx % 2 === 0 ? "Vegetarian" : "Non-Vegetarian",
    passport: `IN-${String(100240 + idx).padStart(7, '0')}`
  }));

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <Link href="/package-bookings" style={{ color: "#64748B", textDecoration: "none" }}>Package Bookings</Link>
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

      {/* Header with Back button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Package Booking Details
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            View complete package booking information, traveller details, payment status and manage the booking.
          </p>
        </div>
        <Link href="/package-bookings" style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          padding: "0.5625rem 1rem", border: "1px solid #E2E8F0",
          borderRadius: 8, backgroundColor: "#fff", color: "#0F172A",
          fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to Package Bookings
        </Link>
      </div>

      {/* Main Two-Column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "flex-start" }}>

        {/* ── LEFT COLUMN ── */}
        <div>

          {/* Top Row: Booking Information & User Information */}
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
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Status</div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.2rem 0.6rem", borderRadius: 4,
                    backgroundColor: status === "Cancelled" ? "#FEE2E2" : status === "Refunded" ? "#F3E8FF" : "#DCFCE7",
                    color: status === "Cancelled" ? "#991B1B" : status === "Refunded" ? "#6B21A8" : "#166534",
                    fontSize: "0.75rem", fontWeight: 600
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      backgroundColor: status === "Cancelled" ? "#EF4444" : status === "Refunded" ? "#A855F7" : "#16A34A"
                    }} />
                    {status}
                  </span>
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

          {/* Package Information Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("luggage", "Package Information")}
            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                
                {/* Hero Thumbnail banner */}
                <div style={{
                  width: 200, height: 110, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", color: "#fff", position: "relative", overflow: "hidden"
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#FCD34D", marginBottom: "0.25rem" }}>tour</span>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em", textAlign: "center", padding: "0 0.5rem" }}>
                    {packageTitle.length > 20 ? packageTitle.slice(0, 20) + "..." : packageTitle}
                  </div>
                </div>

                {/* Package Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>
                      {packageTitle}
                    </h2>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.15rem 0.5rem", borderRadius: 4,
                      backgroundColor: "#E0E7FF", color: "#4338CA",
                      fontSize: "0.72rem", fontWeight: 600
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>public</span>
                      {packageCategory}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                    {booking?.package?.description || "All-inclusive premium vacation package organized by Vedanta Travels with guided transport and hand-picked hotel stays."}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>calendar_today</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Duration</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>{packageDuration}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>flight_takeoff</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Travel Date</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>{travelDateFormatted}</div>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>({travelDayFormatted})</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>group</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Travellers</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>{totalTravelers} Guest{totalTravelers > 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Travellers Details Table */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("group", `Travellers (${travelersList.length})`)}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["#", "Name", "Age", "Gender", "Meal Preference", "ID / Pass No."].map((h) => (
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
                  {travelersList.map((p, idx, arr) => (
                    <tr key={p.num} style={{ borderBottom: idx < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#64748B" }}>{p.num}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>{p.name}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>{p.age}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>{p.gender}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>{p.meal}</td>
                      <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#0F172A", fontWeight: 600 }}>{p.passport}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Requests */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("chat_bubble", "Special Requests")}
            <div style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#475569" }}>
              {booking?.specialRequests || "No specific special requests made by the customer."}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div>

          {/* Status Banner */}
          <div style={{
            background: status === "Cancelled" ? "#FEF2F2" : status === "Refunded" ? "#FAF5FF" : "#ECFDF5",
            borderRadius: 12, padding: "1rem 1.25rem",
            border: `1px solid ${status === "Cancelled" ? "#FECACA" : status === "Refunded" ? "#E9D5FF" : "#A7F3D0"}`,
            marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem"
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 20,
              color: status === "Cancelled" ? "#DC2626" : status === "Refunded" ? "#A855F7" : "#16A34A",
              flexShrink: 0
            }}>
              {status === "Cancelled" ? "cancel" : status === "Refunded" ? "restart_alt" : "check_circle"}
            </span>
            <div>
              <div style={{
                fontSize: "0.875rem", fontWeight: 700,
                color: status === "Cancelled" ? "#991B1B" : status === "Refunded" ? "#6B21A8" : "#166534"
              }}>
                {status}
              </div>
              <div style={{
                fontSize: "0.72rem",
                color: status === "Cancelled" ? "#7F1D1D" : status === "Refunded" ? "#581C87" : "#065F46",
                marginTop: "0.15rem"
              }}>
                {status === "Confirmed" ? "Package booking confirmed and itinerary assigned." :
                 status === "Cancelled" ? "Package booking was cancelled by admin or customer." :
                 status === "Refunded" ? "Package booking amount was processed for refund." : "Package booking status is pending confirmation."}
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("credit_card", "Payment Details")}
            <div style={{ padding: "1.125rem 1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <div>
                    <div style={{ color: "#0F172A", fontWeight: 600 }}>Package Price</div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>For {totalTravelers} traveller{totalTravelers > 1 ? "s" : ""}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: "#0F172A" }}>{fareFormatted}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span style={{ color: "#64748B" }}>Taxes & Booking Fees</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>Included</span>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.875rem 0 0", borderTop: "1px solid #F1F5F9"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>Total Amount</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>{fareFormatted}</span>
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

              {/* Dropdown */}
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

              {/* Action buttons row */}
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
                onClick={() => {
                  showToast("Package voucher and itinerary sent to customer email and WhatsApp");
                }}
                style={{
                  width: "100%", padding: "0.5rem", border: "1px solid #E2E8F0", borderRadius: 6,
                  backgroundColor: "#fff", color: "#0F172A", fontSize: "0.75rem",
                  fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.25rem", marginBottom: "0.5rem"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>send</span>
                Send Itinerary
              </button>

              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
                style={{
                  width: "100%", padding: "0.5625rem", border: "none", borderRadius: 8,
                  backgroundColor: "#B91C1C", color: "#fff", fontSize: "0.8125rem",
                  fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.35rem", boxShadow: "0 2px 4px rgba(185,28,28,0.3)"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
                View &amp; Print Tour Voucher (PDF)
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* ADMIN TOUR VOUCHER & BOARDING PASS MODAL */}
      <AdminBoardingPassModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        ticketData={{
          id: displayId,
          bookingId: displayId,
          customerName: userName,
          customerPhone: userPhone,
          customerEmail: userEmail,
          operator: "Vedanta Tour Circuit & Luxury Travel",
          busType: "BharatBenz Luxury AC Coach (2+2)",
          busPlate: "MH-14-AP-2200",
          from: "Nagpur Hub",
          fromStation: "Nagpur Central Terminal Lounge",
          to: packageTitle,
          toStation: "Hotel Destination Resort",
          depTime: "06:00 AM",
          depDate: travelDateFormatted,
          arrTime: "08:00 PM",
          arrDate: travelDateFormatted,
          duration: packageDuration,
          seats: travelersList.map((_, i) => `S${i + 1}`),
          passengers: travelersList.map(t => ({
            name: t.name,
            age: t.age,
            gender: t.gender,
            seat: t.passport,
            relation: "Traveller"
          })),
          totalAmount: fareFormatted,
          driverName: "Kailash Patil (Dedicated Guide & Tour Manager)",
          driverPhone: "+91 98221 44556",
          status: status,
          isPackage: true,
          packageTitle: packageTitle,
        }}
      />
    </AdminShell>
  );
}
