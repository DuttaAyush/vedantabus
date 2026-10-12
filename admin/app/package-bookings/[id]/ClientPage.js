"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import AdminBoardingPassModal from "@/components/ui/AdminBoardingPassModal";

export default function PackageBookingDetailPage({ params }) {
  const [status, setStatus] = useState("Confirmed");
  const [copied, setCopied] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const copyBookingId = () => {
    navigator.clipboard?.writeText("#PKG-20261110-0018");
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

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <Link href="/package-bookings" style={{ color: "#64748B", textDecoration: "none" }}>Package Bookings</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>#PKG-20261110-0018</span>
      </div>

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
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>#PKG-20261110-0018</span>
                    <button onClick={copyBookingId} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: copied ? "#16A34A" : "#94A3B8", display: "flex" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copied ? "check" : "content_copy"}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Created At</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>25 Oct 2026, 04:22 PM</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Booking Source</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>Web Portal</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Status</div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.2rem 0.6rem", borderRadius: 4,
                    backgroundColor: "#DCFCE7", color: "#166534",
                    fontSize: "0.75rem", fontWeight: 600
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#16A34A" }} />
                    Confirmed
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
                    RS
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>Rahul Sharma</span>
                      <span style={{
                        fontSize: "0.6875rem", fontWeight: 600, color: "#2563EB",
                        backgroundColor: "#EFF6FF", padding: "0.15rem 0.45rem", borderRadius: 4
                      }}>
                        Regular User
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>mail</span>
                      rahul.sharma23@gmail.com
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem", fontSize: "0.78rem", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>call</span>
                      +91-8208024895
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem", fontSize: "0.78rem", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>location_on</span>
                      Nagpur, Maharashtra
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Link href="/users/U10023" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#2563EB", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    View User Profile <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Package Information Card with Hero Thumbnail */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("luggage", "Package Information")}
            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                
                {/* Hero Thumbnail banner */}
                <div style={{
                  width: 220, height: 120, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", color: "#fff", position: "relative", overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute", inset: 0, opacity: 0.15,
                    backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "8px 8px"
                  }} />
                  <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#FCD34D", marginBottom: "0.25rem" }}>location_city</span>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em" }}>DUBAI & ABU DHABI</div>
                </div>

                {/* Package Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>
                      Dubai & Abu Dhabi Luxury Escape
                    </h2>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.15rem 0.5rem", borderRadius: 4,
                      backgroundColor: "#E0E7FF", color: "#4338CA",
                      fontSize: "0.72rem", fontWeight: 600
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>public</span>
                      International
                    </span>
                  </div>
                  <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                    Experience the best of Dubai and Abu Dhabi with premium stays, city tours, desert safari, and more.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>calendar_today</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Duration</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>7 Days 6 Nights</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>flight_takeoff</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Departure Date</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>10 Nov 2026</div>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>(Tue)</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#94A3B8" }}>location_on</span>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Destinations</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0F172A" }}>Dubai → Abu Dhabi</div>
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>UAE</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Travellers Details Table */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("group", "Travellers (2)")}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    {["#", "Name", "Age", "Gender", "Meal Preference", "Passport No."].map((h) => (
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
                  {[
                    { num: 1, name: "Rahul Sharma (Lead Traveller)", age: 28, gender: "Male",   meal: "Vegetarian",     passport: "L4523689" },
                    { num: 2, name: "Sneha Sharma",                  age: 26, gender: "Female", meal: "Non-Vegetarian", passport: "L9876543" },
                  ].map((p, idx, arr) => (
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
              Honeymoon package. Please arrange a room with good view if possible.
            </div>
          </div>

          {/* Booking Timeline */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("schedule", "Booking Timeline")}
            <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {[
                { title: "Booking Created",   date: "25 Oct 2026, 04:22 PM", done: true },
                { title: "Payment Received",  date: "25 Oct 2026, 04:25 PM", done: true },
                { title: "Confirmed",         date: "25 Oct 2026, 04:26 PM", done: true },
                { title: "Trip Departure",    date: "10 Nov 2026",           done: false },
              ].map((step, i, arr) => (
                <div key={step.title} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      backgroundColor: step.done ? "#16A34A" : "#fff",
                      border: step.done ? "none" : "2px solid #CBD5E1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", flexShrink: 0
                    }}>
                      {step.done ? (
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                      ) : (
                        <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#CBD5E1" }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: step.done ? "#0F172A" : "#64748B" }}>{step.title}</div>
                      <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{step.date}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ flex: 1, height: 2, backgroundColor: "#E2E8F0", margin: "0 0.875rem" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div>

          {/* Status Banner */}
          <div style={{
            background: "#ECFDF5", borderRadius: 12, padding: "1rem 1.25rem",
            border: "1px solid #A7F3D0", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#16A34A", flexShrink: 0 }}>check_circle</span>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#166534" }}>Confirmed</div>
              <div style={{ fontSize: "0.72rem", color: "#065F46", marginTop: "0.15rem" }}>This package booking is confirmed and all payments are received.</div>
            </div>
          </div>

          {/* Room Configuration Card */}
          <div style={CARD_STYLE}>
            {CARD_HEADER("hotel", "Room Configuration")}
            <div style={{ padding: "1.125rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#64748B" }}>Room Type</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>Deluxe Room (Twin Sharing)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#64748B" }}>No. of Rooms</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>1 Room</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#64748B" }}>Travellers per Room</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>2 Adults</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#64748B" }}>Meal Plan</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>Breakfast & Dinner</span>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "0.625rem", marginTop: "0.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: "0.45rem" }}>Inclusions</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", fontSize: "0.72rem", color: "#0F172A", fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>check</span>
                    Hotel Stay
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>check</span>
                    Airport Transfers
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>check</span>
                    City Tours
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>check</span>
                    Desert Safari
                  </div>
                </div>
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
                    <div style={{ color: "#0F172A", fontWeight: 600 }}>Price per Person</div>
                    <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>₹ 45,000 × 2 travellers</div>
                  </div>
                  <span style={{ fontWeight: 700, color: "#0F172A" }}>₹ 90,000</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span style={{ color: "#64748B" }}>GST (5%)</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>₹ 4,500</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                  <span style={{ color: "#64748B" }}>Processing Fee</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>₹ 500</span>
                </div>
              </div>

              {/* Total Amount */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.875rem 0 0", borderTop: "1px solid #F1F5F9"
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>Total Amount</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>₹ 95,000</span>
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

              {/* Dropdown with green dot */}
              <div style={{ position: "relative", marginBottom: "0.75rem" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 8, height: 8, borderRadius: "50%", backgroundColor: "#16A34A",
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
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                  <option>Refunded</option>
                </select>
              </div>

              {/* Apply Changes Button */}
              <button style={{
                width: "100%", padding: "0.5625rem", border: "none", borderRadius: 8,
                backgroundColor: "#B91C1C", color: "#fff", fontSize: "0.8125rem",
                fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.35rem", marginBottom: "0.75rem"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                Apply Changes
              </button>

              {/* Action buttons row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button style={{
                  padding: "0.45rem", border: "1px solid #FCA5A5", borderRadius: 6,
                  backgroundColor: "#FFF5F5", color: "#DC2626", fontSize: "0.72rem",
                  fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.25rem"
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>cancel</span>
                  Cancel Booking
                </button>
                <button style={{
                  padding: "0.45rem", border: "1px solid #DDD6FE", borderRadius: 6,
                  backgroundColor: "#F5F3FF", color: "#7C3AED", fontSize: "0.72rem",
                  fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "0.25rem"
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>restart_alt</span>
                  Process Refund
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
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
          id: "PKG-20261110-0018",
          bookingId: "PKG-20261110-0018",
          customerName: "Sanjay Mehta",
          customerPhone: "+91 98234 56789",
          customerEmail: "sanjay.mehta@gmail.com",
          operator: "Spiritual Yatra & Holiday Circuit",
          busType: "BharatBenz Luxury AC Coach (2+2)",
          busPlate: "MH-14-AP-2200",
          from: "Nagpur Hub",
          fromStation: "Nagpur Central Terminal Lounge",
          to: "Shirdi - Jyotirlinga Circuit",
          toStation: "Hotel Sun-n-Sand, Shirdi",
          depTime: "06:00 AM",
          depDate: "10 Nov 2026",
          arrTime: "08:00 PM",
          arrDate: "15 Nov 2026",
          duration: "5 Days / 4 Nights",
          seats: ["S1", "S2", "S3"],
          passengers: [
            { name: "Sanjay Mehta", age: 48, gender: "Male", seat: "S1", relation: "Self" },
            { name: "Sunita Mehta", age: 45, gender: "Female", seat: "S2", relation: "Spouse" },
            { name: "Rohit Mehta", age: 19, gender: "Male", seat: "S3", relation: "Child" },
          ],
          totalAmount: "₹ 54,999",
          driverName: "Kailash Patil (Dedicated Guide & Captain)",
          driverPhone: "+91 98221 44556",
          status: status,
          isPackage: true,
          packageTitle: "Shirdi & Trimbakeshwar Spiritual Yatra",
        }}
      />
    </AdminShell>
  );
}
