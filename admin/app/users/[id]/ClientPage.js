"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

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
    Refunded:  { bg: "#F3E8FF", color: "#6B21A8" },
    Pending:   { bg: "#FEF3C7", color: "#92400E" },
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

export default function UserDetailPage({ params, id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("All Bookings");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [userId, setUserId] = useState(() => {
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
          if (last && !["users", "view", "default"].includes(last)) {
            resolved = decodeURIComponent(last);
          }
        }
      }
    }
    if (resolved && resolved !== "default") {
      setUserId(resolved);
    }
  }, [id, params]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminFetch(`/api/admin/users/${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        const u = data.data || data;
        if (u && (u.id || u.email)) {
          setUser(u);
          setIsBlocked(u.isActive === false);
        }
      })
      .catch(err => console.error("Error loading user details:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleToggleBlock = async () => {
    if (!userId || userId === "default") {
      setIsBlocked(prev => !prev);
      showToast(isBlocked ? "User unblocked" : "User blocked from booking");
      return;
    }
    setIsUpdating(true);
    const action = isBlocked ? "unblock" : "block";
    try {
      const res = await adminFetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setIsBlocked(!isBlocked);
        showToast(action === "block" ? "User blocked successfully" : "User unblocked successfully");
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to update user status");
      }
    } catch {
      showToast("Network error while updating user status");
    } finally {
      setIsUpdating(false);
    }
  };

  const displayName = user?.name || "Customer";
  const displayEmail = user?.email || "customer@example.com";
  const displayPhone = user?.phone || "+91-9800000000";
  const initials = displayName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "CU";
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently";
  
  const totalBusBookings = user?._count?.busBookings || (user?.busBookings ? user.busBookings.length : 0);
  const totalPackageBookings = user?._count?.packageBookings || (user?.packageBookings ? user.packageBookings.length : 0);
  const totalSpendFormatted = `₹${Number(user?.totalSpend || 0).toLocaleString('en-IN')}`;

  // Normalize combined bookings
  const busList = Array.isArray(user?.busBookings) ? user.busBookings.map(b => ({
    id: b.id,
    type: "Bus",
    route: b.trip?.route ? `${b.trip.route.originCity} → ${b.trip.route.destinationCity}` : "Bus Trip",
    travel: b.trip?.departureDatetime ? new Date(b.trip.departureDatetime).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
    booked: b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
    amount: `₹${Number(b.totalAmount || 0).toLocaleString('en-IN')}`,
    status: b.status || "Confirmed",
    link: `/bookings/${b.id}`,
  })) : [];

  const pkgList = Array.isArray(user?.packageBookings) ? user.packageBookings.map(p => ({
    id: p.id,
    type: "Package",
    route: p.package?.title || "Holiday Tour",
    travel: p.travelDate ? new Date(p.travelDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
    booked: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
    amount: `₹${Number(p.totalAmount || 0).toLocaleString('en-IN')}`,
    status: p.status || "Confirmed",
    link: `/package-bookings/${p.id}`,
  })) : [];

  const combinedBookings = [...busList, ...pkgList];

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/users" style={{ color: "#64748B", textDecoration: "none" }}>Users</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>{displayName}</span>
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

      {/* Page title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            User Details
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            View user profile, live booking history, and manage customer access.
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
                backgroundColor: "#4F46E518",
                border: `3px solid #4F46E535`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="user-avatar-initials" style={{ fontSize: "2.25rem", fontWeight: 700, color: "#4F46E5" }}>{initials}</span>
              </div>
              <div style={{
                position: "absolute", bottom: 6, right: 6,
                width: 18, height: 18, borderRadius: "50%",
                backgroundColor: isBlocked ? "#EF4444" : "#22C55E",
                border: "3px solid #fff",
              }} />
            </div>

            {/* Info */}
            <div style={{ paddingTop: "0.25rem", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.3125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>{displayName}</h2>
                <span style={{
                  padding: "0.1875rem 0.5rem", borderRadius: 5,
                  backgroundColor: "#F1F5F9", color: "#64748B",
                  fontSize: "0.75rem", fontWeight: 600,
                }}>#{userId || "U10001"}</span>
              </div>

              {/* Contact rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                <InfoRow icon="mail"          text={displayEmail} />
                <InfoRow icon="phone"         text={displayPhone} />
                <InfoRow icon="calendar_today" text={`Joined on ${joinedDate}`} />
              </div>

              {/* Status */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                padding: "0.3rem 0.875rem", borderRadius: 20,
                backgroundColor: isBlocked ? "#FEE2E2" : "#DCFCE7",
                color: isBlocked ? "#991B1B" : "#166534",
                fontSize: "0.8125rem", fontWeight: 600,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {isBlocked ? "block" : "check_circle"}
                </span>
                {isBlocked ? "Blocked" : "Active Customer"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="user-profile-divider" style={{ width: 1, alignSelf: "stretch", backgroundColor: "#F1F5F9", flexShrink: 0 }} />

          {/* Right: Actions and quick info */}
          <div className="user-profile-right" style={{ width: 340, flexShrink: 0 }}>
            {/* Buttons row */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.625rem", marginBottom: "1rem" }}>
              <button
                type="button"
                onClick={handleToggleBlock}
                disabled={isUpdating}
                style={{
                  display: "flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.4375rem 0.875rem",
                  border: isBlocked ? "1.5px solid #16A34A" : "1.5px solid #B91C1C",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  color: isBlocked ? "#16A34A" : "#B91C1C",
                  fontSize: "0.8125rem", fontWeight: 600, cursor: isUpdating ? "not-allowed" : "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {isBlocked ? "check" : "block"}
                </span>
                {isUpdating ? "Updating..." : isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>

            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#64748B", marginBottom: "0.75rem" }}>
              Account Summary
            </div>

            {/* Info pairs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, borderRadius: 8, border: "1px solid #F1F5F9", overflow: "hidden" }}>
              {[
                { label: "Account Role",     value: user?.role || "USER" },
                { label: "Bus Bookings",     value: String(totalBusBookings) },
                { label: "Package Bookings", value: String(totalPackageBookings) },
                { label: "Lifetime Spend",   value: totalSpendFormatted },
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
          { icon: "directions_bus", iconBg: "#FEF2F2", iconColor: "#B91C1C", value: totalBusBookings, label: "Bus Bookings" },
          { icon: "luggage",        iconBg: "#ECFDF5", iconColor: "#059669", value: totalPackageBookings, label: "Package Bookings" },
          { icon: "currency_rupee", iconBg: "#F5F3FF", iconColor: "#7C3AED", value: totalSpendFormatted, label: "Total Spent" },
          { icon: "verified",       iconBg: "#EFF6FF", iconColor: "#2563EB", value: isBlocked ? "Suspended" : "Good Standing", label: "Account Status" },
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

      {/* Primary Passenger Profile (Clean Option B) */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", overflow: "hidden", marginBottom: "1.25rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#B91C1C" }}>person</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Customer Profile</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Primary traveller details for checkout pre-fill</div>
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534", backgroundColor: "#DCFCE7", padding: "0.2rem 0.6rem", borderRadius: 999 }}>
            Primary Profile
          </span>
        </div>

        <div style={{ padding: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <div style={{
            padding: "1rem", borderRadius: 10, border: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC", display: "flex", alignItems: "flex-start", gap: "0.75rem"
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, backgroundColor: "#fff",
              border: "1px solid #CBD5E1", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#475569", flexShrink: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                account_circle
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>{displayName}</span>
                <span style={{
                  fontSize: "0.625rem", fontWeight: 700, textTransform: "uppercase",
                  padding: "0.1rem 0.4rem", borderRadius: 4, backgroundColor: "#DCFCE7", color: "#166534"
                }}>
                  Self
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
                {displayEmail} • {displayPhone}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#166534", fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#16A34A" }}>verified</span>
                Verified User Account
              </div>
            </div>
          </div>
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
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>All live bus and package bookings made by this user.</div>
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
              {combinedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#94A3B8", fontSize: "0.875rem" }}>
                    No bookings found for this customer yet.
                  </td>
                </tr>
              ) : (
                combinedBookings.filter((b) =>
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
                      <Link
                        href={b.link}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          background: "none", border: "1px solid #E2E8F0",
                          borderRadius: 6, padding: "0.3rem 0.625rem",
                          color: "#64748B", fontSize: "0.8125rem", cursor: "pointer",
                          fontWeight: 500, textDecoration: "none"
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>visibility</span>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
