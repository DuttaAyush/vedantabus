"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";

// ── Mock data (would be fetched by id from API) ───────────────────────────────

const USER = {
  id: "U10023",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@gmail.com",
  phone: "+91-8208024895",
  joined: "12 Jan 2025",
  status: "Active",
  dob: "14 Mar 1992",
  gender: "Male",
  location: "Nagpur, Maharashtra",
  totalBookings: 14,
  totalSpent: "₹28,450",
  color: "#4F46E5",
  busBookings: 10,
  packageBookings: 4,
  lastBooking: "9 months ago",
};

const BOOKINGS = [
  { id: "VB250915001", type: "Bus",     route: "Nagpur → Pune",              travel: "16 Sep 2026", booked: "12 Sep 2026", amount: "₹1,200",  status: "Confirmed" },
  { id: "VB250912334", type: "Package", route: "Kashmir Holiday (5D/4N)",    travel: "22 Sep 2026", booked: "10 Sep 2026", amount: "₹24,999", status: "Confirmed" },
  { id: "VB250901112", type: "Bus",     route: "Mumbai → Ahmedabad",         travel: "05 Sep 2026", booked: "01 Sep 2026", amount: "₹1,050",  status: "Completed" },
  { id: "VB250825578", type: "Package", route: "Bali Getaway (6D/5N)",       travel: "18 Aug 2026", booked: "20 Aug 2026", amount: "₹89,999", status: "Cancelled" },
  { id: "VB250801445", type: "Bus",     route: "Delhi → Haridwar",           travel: "10 Aug 2026", booked: "28 Jul 2026", amount: "₹850",    status: "Completed" },
  { id: "VB250720998", type: "Package", route: "Singapore Explorer (4D/3N)", travel: "05 Aug 2026", booked: "15 Jul 2026", amount: "₹74,500", status: "Confirmed" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#94A3B8", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: "0.875rem", color: "#475569" }}>{text}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Confirmed: { bg: "#DCFCE7", color: "#166534" },
    Completed: { bg: "#CFFAFE", color: "#0E7490" },
    Cancelled: { bg: "#FEE2E2", color: "#991B1B" },
  };
  const s = map[status] || { bg: "#F1F5F9", color: "#475569" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.25rem 0.625rem", borderRadius: 5,
      backgroundColor: s.bg, color: s.color,
      fontSize: "0.75rem", fontWeight: 600,
    }}>{status}</span>
  );
}

const TH = {
  padding: "0.625rem 1rem",
  textAlign: "left",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: "#94A3B8",
  textTransform: "uppercase",
  backgroundColor: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
  whiteSpace: "nowrap",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UserDetailPage({ params }) {
  const [bookingFilter, setBookingFilter] = useState("All Bookings");

  const initials = USER.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/users" style={{ color: "#64748B", textDecoration: "none" }}>Users</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>{USER.name}</span>
      </div>

      {/* Page title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            User Details
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            View user information, booking history, and manage account access.
          </p>
        </div>
        <Link href="/users" style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          padding: "0.5rem 1rem",
          border: "1px solid #E2E8F0", borderRadius: 8,
          backgroundColor: "#fff", color: "#475569",
          fontSize: "0.875rem", fontWeight: 500, textDecoration: "none",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to Users
        </Link>
      </div>

      {/* Profile card */}
      <div className="user-profile-card" style={{
        background: "#fff", borderRadius: 12,
        padding: "1.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        border: "1px solid #F1F5F9",
        marginBottom: "1.25rem",
      }}>
        <div className="user-profile-inner" style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

          {/* Left: Avatar + contact */}
          <div className="user-profile-left" style={{ display: "flex", gap: "1.5rem", flex: 1, alignItems: "flex-start" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="user-avatar-circle" style={{
                width: 120, height: 120, borderRadius: "50%",
                backgroundColor: USER.color + "18",
                border: `3px solid ${USER.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="user-avatar-initials" style={{ fontSize: "2.25rem", fontWeight: 700, color: USER.color }}>{initials}</span>
              </div>
              {/* Online dot */}
              <div style={{
                position: "absolute", bottom: 6, right: 6,
                width: 18, height: 18, borderRadius: "50%",
                backgroundColor: "#22C55E",
                border: "3px solid #fff",
              }} />
            </div>

            {/* Info */}
            <div style={{ paddingTop: "0.25rem", flex: 1, minWidth: 0 }}>
              {/* Name + ID */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.3125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>{USER.name}</h2>
                <span style={{
                  padding: "0.1875rem 0.5rem", borderRadius: 5,
                  backgroundColor: "#F1F5F9", color: "#64748B",
                  fontSize: "0.75rem", fontWeight: 600,
                }}>#{USER.id}</span>
              </div>

              {/* Contact rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                <InfoRow icon="mail"          text={USER.email} />
                <InfoRow icon="phone"         text={USER.phone} />
                <InfoRow icon="calendar_today" text={`Joined on ${USER.joined}`} />
              </div>

              {/* Status */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                padding: "0.3rem 0.875rem", borderRadius: 20,
                backgroundColor: "#DCFCE7", color: "#166534",
                fontSize: "0.8125rem", fontWeight: 600,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                Active
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="user-profile-divider" style={{ width: 1, alignSelf: "stretch", backgroundColor: "#F1F5F9", flexShrink: 0 }} />

          {/* Right: Additional info */}
          <div className="user-profile-right" style={{ width: 340, flexShrink: 0 }}>
            {/* Buttons row */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.625rem", marginBottom: "1rem" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.4375rem 0.875rem",
                border: "1.5px solid #B91C1C", borderRadius: 8,
                backgroundColor: "#fff", color: "#B91C1C",
                fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>block</span>
                Block User
              </button>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.4375rem 0.875rem",
                border: "none", borderRadius: 8,
                backgroundColor: "#B91C1C", color: "#fff",
                fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                Delete User
              </button>
            </div>

            {/* Additional info label */}
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#64748B", marginBottom: "0.75rem" }}>
              Additional Information
            </div>

            {/* Info pairs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 8, border: "1px solid #F1F5F9", overflow: "hidden" }}>
              {[
                { label: "Date of Birth",    value: USER.dob },
                { label: "Gender",           value: USER.gender },
                { label: "Location",         value: USER.location },
                { label: "Total Bookings",   value: String(USER.totalBookings) },
                { label: "Total Spent",      value: USER.totalSpent },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.5625rem 0.875rem",
                  backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#fff",
                  borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
                }}>
                  <span style={{ fontSize: "0.8125rem", color: "#94A3B8" }}>{label}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#0F172A", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mini stats row */}
      <div className="user-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {[
          { icon: "directions_bus", iconBg: "#FEF2F2", iconColor: "#B91C1C", value: USER.busBookings,      label: "Bus Bookings" },
          { icon: "luggage",        iconBg: "#ECFDF5", iconColor: "#059669", value: USER.packageBookings,  label: "Package Bookings" },
          { icon: "currency_rupee", iconBg: "#F5F3FF", iconColor: "#7C3AED", value: USER.totalSpent,       label: "Total Spent" },
          { icon: "calendar_today", iconBg: "#FFF7ED", iconColor: "#EA580C", value: USER.lastBooking,      label: "Last Booking" },
        ].map((s) => (
          <div key={s.label} className="user-stat-card" style={{
            background: "#fff", borderRadius: 12,
            padding: "1rem 1.25rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            border: "1px solid #F1F5F9",
            display: "flex", alignItems: "center", gap: "0.875rem",
          }}>
            <div className="user-stat-icon-wrap" style={{
              width: 44, height: 44, borderRadius: "50%",
              backgroundColor: s.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: s.iconColor }}>{s.icon}</span>
            </div>
            <div>
              <div className="user-stat-value" style={{ fontSize: "1.3125rem", fontWeight: 700, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div className="user-stat-label" style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.2rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Passenger Profiles (Feature 4 Admin View) */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", overflow: "hidden", marginBottom: "1.25rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#B91C1C" }}>group</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Saved Passenger Profiles</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Registered co-travelers and family members for quick checkout</div>
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534", backgroundColor: "#DCFCE7", padding: "0.2rem 0.6rem", borderRadius: 999 }}>
            4 Active Profiles
          </span>
        </div>

        <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {[
            { name: "Rajesh Kumar", age: 34, gender: "Male", relation: "Self", idTag: "Aadhaar Verified" },
            { name: "Sneha Patel", age: 31, gender: "Female", relation: "Spouse", idTag: "Govt ID on File" },
            { name: "Aarav Patel", age: 8, gender: "Male", relation: "Child", idTag: "Minor Passenger" },
            { name: "Suresh Patel", age: 62, gender: "Male", relation: "Father", idTag: "Senior Citizen" },
          ].map((p, idx) => (
            <div key={idx} style={{
              padding: "1rem", borderRadius: 10, border: "1px solid #E2E8F0",
              backgroundColor: "#F8FAFC", display: "flex", alignItems: "flex-start", gap: "0.75rem"
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, backgroundColor: "#fff",
                border: "1px solid #CBD5E1", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#475569", flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {p.gender === "Female" ? "woman" : "man"}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>{p.name}</span>
                  <span style={{
                    fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase",
                    padding: "0.1rem 0.4rem", borderRadius: 4, backgroundColor: "#FEE2E2", color: "#B91C1C"
                  }}>
                    {p.relation}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
                  {p.gender} • {p.age} Years Old
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#166534", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>verified</span>
                  {p.idTag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking History */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#B91C1C" }}>receipt_long</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Booking History</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>All bus and package bookings made by this user.</div>
            </div>
          </div>
          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            style={{
              padding: "0.375rem 0.75rem",
              border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: "0.8125rem", color: "#475569",
              backgroundColor: "#fff", cursor: "pointer", outline: "none",
            }}
          >
            <option>All Bookings</option>
            <option>Bus Bookings</option>
            <option>Package Bookings</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["BOOKING ID", "TYPE", "ROUTE / PACKAGE", "TRAVEL DATE", "BOOKED ON", "AMOUNT", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.filter((b) =>
                bookingFilter === "All Bookings" ||
                (bookingFilter === "Bus Bookings" && b.type === "Bus") ||
                (bookingFilter === "Package Bookings" && b.type === "Package")
              ).map((b, idx, arr) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: idx < arr.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", fontWeight: 600, color: "#475569" }}>{b.id}</td>

                  <td style={{ padding: "0.875rem 1rem" }}>
                    {b.type === "Bus" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: 4, backgroundColor: "#FEE2E2", color: "#991B1B", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>directions_bus</span>Bus
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: 4, backgroundColor: "#CCFBF1", color: "#134E4A", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>luggage</span>Package
                      </span>
                    )}
                  </td>

                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{b.route}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#64748B", whiteSpace: "nowrap" }}>{b.travel}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#64748B", whiteSpace: "nowrap" }}>{b.booked}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>{b.amount}</td>
                  <td style={{ padding: "0.875rem 1rem" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <button style={{
                      display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      background: "none", border: "1px solid #E2E8F0",
                      borderRadius: 6, padding: "0.3rem 0.625rem",
                      color: "#64748B", fontSize: "0.8125rem", cursor: "pointer",
                      fontWeight: 500,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>visibility</span>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: "0.875rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid #F1F5F9", flexWrap: "wrap", gap: "0.75rem",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>Showing 1 to 6 of 14 bookings</span>
          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
            {["chevron_left", 1, 2, 3, "chevron_right"].map((item, i) => (
              typeof item === "string" ? (
                <button key={i} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{item}</span>
                </button>
              ) : (
                <button key={i} style={{ width: 30, height: 30, borderRadius: 6, border: item === 1 ? "none" : "1px solid #E2E8F0", backgroundColor: item === 1 ? "#B91C1C" : "#fff", color: item === 1 ? "#fff" : "#475569", fontSize: "0.8125rem", fontWeight: item === 1 ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
