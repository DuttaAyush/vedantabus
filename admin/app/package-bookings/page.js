"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_STYLES = {
  "Spiritual":     { bg: "#FEF3C7", color: "#B45309", icon: "temple_hindu" },
  "Domestic":      { bg: "#CCFBF1", color: "#0F766E", icon: "landscape" },
  "International": { bg: "#E0E7FF", color: "#4338CA", icon: "public" },
};

const STATUS_MAP = {
  "Confirmed": { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  "Pending":   { bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  "Cancelled": { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
  "Refunded":  { bg: "#EDE9FE", color: "#5B21B6", dot: "#7C3AED" },
};

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

const AVATAR_COLORS = ["#2563EB","#D97706","#059669","#DC2626","#0284C7","#7C3AED","#EA580C","#0D9488","#E11D48","#16A34A"];
function avatarColor(id = "") {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PackageBookingsPage() {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [activeTab, setActiveTab]     = useState("All");
  const [search, setSearch]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [updatingId, setUpdatingId]   = useState(null);
  const pageSize = 20;

  // Stats computed from current page data — full counts come from pagination total
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0, refunded: 0 });

  const fetchBookings = useCallback(async (page = 1, tab = "All", q = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (tab !== "All") params.set("category", tab);
      // Note: search is client-side filtered since the backend doesn't support text search yet
      const res = await adminFetch(`/api/admin/package-bookings?${params}`);
      const data = await res.json();
      if (data.success) {
        const all = data.data?.bookings || [];
        setBookings(all);
        setTotalPages(data.data?.pagination?.totalPages || 1);
        setTotalRecords(data.data?.pagination?.total || all.length);
        // Compute stats from ALL bookings on this category filter (not just current page)
        // We fetch all for stats by making a count-only request
        setStats(prev => ({
          ...prev,
          // These will be refined by the all-bookings fetch below
        }));
      } else {
        setError(data.message || "Failed to load bookings.");
      }
    } catch {
      setError("Network error. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Also fetch full stats (all statuses, no page limit)
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminFetch(`/api/admin/package-bookings?limit=50&page=1`);
      const data = await res.json();
      if (data.success) {
        const total = data.data?.pagination?.total || 0;
        // Fetch confirmed/pending/cancelled counts via separate filtered requests
        const [c, p, x, r] = await Promise.all([
          adminFetch(`/api/admin/package-bookings?limit=1&status=Confirmed`).then(r => r.json()),
          adminFetch(`/api/admin/package-bookings?limit=1&status=Pending`).then(r => r.json()),
          adminFetch(`/api/admin/package-bookings?limit=1&status=Cancelled`).then(r => r.json()),
          adminFetch(`/api/admin/package-bookings?limit=1&status=Refunded`).then(r => r.json()),
        ]);
        setStats({
          total,
          confirmed:  c.data?.pagination?.total || 0,
          pending:    p.data?.pagination?.total || 0,
          cancelled:  x.data?.pagination?.total || 0,
          refunded:   r.data?.pagination?.total || 0,
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchBookings(1, "All", "");
    fetchStats();
  }, [fetchBookings, fetchStats]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    fetchBookings(1, tab, search);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePageChange = (p) => {
    setCurrentPage(p);
    fetchBookings(p, activeTab, search);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await adminFetch(`/api/admin/package-bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        fetchStats();
      }
    } catch {}
    setUpdatingId(null);
  };

  // Client-side search filter (on current page data)
  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    const userName = b.user?.name || "";
    const pkgName  = b.package?.title || "";
    return b.id.toLowerCase().includes(q) || userName.toLowerCase().includes(q) || pkgName.toLowerCase().includes(q);
  });

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const TH = {
    padding: "0.625rem 0.875rem",
    textAlign: "left",
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    color: "#94A3B8",
    textTransform: "uppercase",
    backgroundColor: "#F8FAFC",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };

  const packageStats = [
    { label: "Total Bookings", value: stats.total,     icon: "luggage",      bg: "#EFF6FF", color: "#B91C1C" },
    { label: "Confirmed",      value: stats.confirmed,  icon: "check_circle", bg: "#ECFDF5", color: "#059669" },
    { label: "Pending",        value: stats.pending,    icon: "schedule",     bg: "#FFFBEB", color: "#D97706" },
    { label: "Cancelled",      value: stats.cancelled,  icon: "cancel",       bg: "#FEF2F2", color: "#DC2626" },
    { label: "Refunded",       value: stats.refunded,   icon: "restart_alt",  bg: "#F5F3FF", color: "#7C3AED" },
  ];

  return (
    <AdminShell noScroll>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
          <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
          <span style={{ color: "#0F172A", fontWeight: 500 }}>Package Bookings</span>
        </div>

        {/* Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
              Package Bookings
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "0.25rem", marginBottom: 0 }}>
              View and manage all holiday package bookings. Search, filter and take action as needed.
            </p>
          </div>
          <button
            onClick={() => { fetchBookings(currentPage, activeTab, search); fetchStats(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#B91C1C", color: "#fff",
              border: "none", borderRadius: 8,
              fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 1px 2px rgba(185,28,28,0.2)"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>refresh</span>
            Refresh
          </button>
        </div>

        {/* 5 Metric Summary Cards */}
        <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {packageStats.map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 10, padding: "0.75rem 1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                backgroundColor: s.bg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 500, marginBottom: "0.1rem" }}>{s.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                  {loading ? "—" : s.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>

          {/* Filters Top Bar */}
          <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem 0.5rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#94A3B8", pointerEvents: "none" }}>search</span>
              <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search by booking ID, user name or package..."
                style={{
                  width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem",
                  color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none"
                }}
              />
            </div>
            <button
              onClick={() => { setSearch(""); setActiveTab("All"); setCurrentPage(1); fetchBookings(1, "All", ""); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0",
                borderRadius: 8, backgroundColor: "#fff", color: "#475569",
                fontSize: "0.8125rem", cursor: "pointer"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>refresh</span>
              Clear Filters
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ flexShrink: 0, padding: "0 1.25rem 0.875rem", display: "flex", gap: "0.5rem", borderBottom: "1px solid #F1F5F9" }}>
            {[
              { label: "All",           key: "All",           icon: null },
              { label: "Spiritual",     key: "Spiritual",     icon: "temple_hindu", color: "#B45309" },
              { label: "Domestic",      key: "Domestic",      icon: "landscape",    color: "#0F766E" },
              { label: "International", key: "International", icon: "public",       color: "#4338CA" },
            ].map(tab => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.375rem 0.75rem", borderRadius: 20,
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                    border: isSelected && tab.key === "All" ? "none" : isSelected ? `1.5px solid ${tab.color}` : "1px solid #E2E8F0",
                    backgroundColor: isSelected && tab.key === "All" ? "#B91C1C" : isSelected ? "#F8FAFC" : "#fff",
                    color: isSelected && tab.key === "All" ? "#fff" : isSelected ? "#0F172A" : "#64748B",
                    transition: "all 150ms",
                  }}
                >
                  {tab.icon && <span className="material-symbols-outlined" style={{ fontSize: 14, color: tab.color }}>{tab.icon}</span>}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ margin: "0.75rem 1.25rem", padding: "0.625rem 1rem", backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, color: "#991B1B", fontSize: "0.8125rem" }}>
              {error}
            </div>
          )}

          {/* Scrollable Data Table */}
          <div style={{ flex: 1, minHeight: 0, overflowX: "auto", overflowY: "auto", position: "relative" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <th style={TH}>Booking ID</th>
                  <th style={TH}>User</th>
                  <th style={TH}>Package Name</th>
                  <th style={TH}>Category</th>
                  <th style={TH}>Travel Date</th>
                  <th style={TH}>Travellers</th>
                  <th style={TH}>Total Amount</th>
                  <th style={TH}>Status</th>
                  <th style={{ ...TH, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "3rem 1rem", textAlign: "center", color: "#94A3B8" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, display: "block", marginBottom: "0.5rem" }}>hourglass_top</span>
                      Loading package bookings…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "3rem 1rem", textAlign: "center", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#CBD5E1", display: "block", marginBottom: "0.5rem" }}>luggage</span>
                      No package bookings found{search ? ` matching "${search}"` : ""}.
                    </td>
                  </tr>
                ) : filtered.map((b, idx) => {
                  const s   = STATUS_MAP[b.status]   || { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" };
                  const cat = CATEGORY_STYLES[b.package?.category] || { bg: "#F1F5F9", color: "#64748B", icon: "folder" };
                  const userColor = avatarColor(b.id);
                  const userName  = b.user?.name || "Unknown";
                  const travelDate = b.travelDate ? new Date(b.travelDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                  const amount = b.totalAmount != null ? `₹ ${Number(b.totalAmount).toLocaleString("en-IN")}` : "—";

                  return (
                    <tr
                      key={b.id}
                      style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #F8FAFC" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {/* Booking ID */}
                      <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                        {b.id.length > 12 ? b.id.slice(0, 8) + "…" : b.id}
                        <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontFamily: "sans-serif", fontWeight: 400 }} title={b.id}>{b.id.slice(-8)}</div>
                      </td>

                      {/* User */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            backgroundColor: `${userColor}15`, border: `1.5px solid ${userColor}30`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.72rem", fontWeight: 700, color: userColor, flexShrink: 0
                          }}>
                            {initials(userName)}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>{userName}</div>
                            <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{b.user?.phone || b.user?.email || "—"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Package Name */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <div style={{
                            width: 38, height: 34, borderRadius: 6,
                            backgroundColor: "#F1F5F9", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            border: "1px solid #E2E8F0", flexShrink: 0
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: cat.color }}>{cat.icon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{b.package?.title || "—"}</div>
                            <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                              {b.package?.durationDays ? `${b.package.durationDays}D` : "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.22rem 0.55rem", borderRadius: 4,
                          backgroundColor: cat.bg, color: cat.color,
                          fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap"
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{cat.icon}</span>
                          {b.package?.category || "—"}
                        </span>
                      </td>

                      {/* Travel Date */}
                      <td style={{ padding: "0.875rem 0.875rem", whiteSpace: "nowrap" }}>
                        <div style={{ fontSize: "0.8125rem", color: "#475569" }}>{travelDate}</div>
                      </td>

                      {/* Travellers */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: "#475569", fontWeight: 600 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#94A3B8" }}>group</span>
                          {b.travelersCount || 1}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>
                        {amount}
                      </td>

                      {/* Status — inline dropdown to change status */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={e => handleStatusChange(b.id, e.target.value)}
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: 5, border: `1px solid ${s.dot}40`,
                            backgroundColor: s.bg, color: s.color,
                            fontSize: "0.72rem", fontWeight: 600,
                            cursor: "pointer", outline: "none",
                            opacity: updatingId === b.id ? 0.6 : 1,
                          }}
                        >
                          {["Pending","Confirmed","Cancelled","Refunded"].map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "0.875rem 0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                          <Link
                            href={`/package-bookings/${b.id}`}
                            prefetch={false}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              padding: "0.3rem 0.625rem", borderRadius: 6,
                              border: "1px solid #E2E8F0", backgroundColor: "#fff",
                              color: "#475569", fontSize: "0.75rem", fontWeight: 500,
                              textDecoration: "none"
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div style={{
            flexShrink: 0,
            backgroundColor: "#fff",
            padding: "0.875rem 1.25rem", display: "flex", alignItems: "center",
            justifyContent: "space-between", borderTop: "1px solid #F1F5F9",
            flexWrap: "wrap", gap: "0.75rem"
          }}>
            <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
              {loading ? "Loading…" : `Showing ${filtered.length} of ${totalRecords} package bookings`}
            </span>
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  style={{
                    width: 30, height: 30, borderRadius: 6, border: "1px solid #E2E8F0",
                    background: currentPage === 1 ? "#F8FAFC" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: currentPage === 1 ? "#CBD5E1" : "#64748B",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
                </button>

                {getPageNumbers().map((n, idx) => n === "..." ? (
                  <span key={`e-${idx}`} style={{ color: "#94A3B8", fontSize: "0.875rem", padding: "0 0.25rem" }}>...</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    style={{
                      width: 30, height: 30, borderRadius: 6,
                      border: currentPage === n ? "none" : "1px solid #E2E8F0",
                      backgroundColor: currentPage === n ? "#B91C1C" : "#fff",
                      color: currentPage === n ? "#fff" : "#475569",
                      fontSize: "0.8125rem", fontWeight: currentPage === n ? 700 : 400,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    width: 30, height: 30, borderRadius: 6, border: "1px solid #E2E8F0",
                    background: currentPage === totalPages ? "#F8FAFC" : "#fff",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: currentPage === totalPages ? "#CBD5E1" : "#64748B",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
