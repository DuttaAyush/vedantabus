"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import DateRangePicker from "@/components/ui/DateRangePicker";
import { adminFetch } from "@/lib/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const BOOKINGS = [
  { id: "BK100523", user: "Rahul Sharma",    phone: "+91-8208024895", initials: "RS", color: "#2563EB", from: "Nagpur",  to: "Pune",      via: "Wardha, Amravati", date: "15 Sep 2026", day: "Mon", seats: ["L3", "L4"],       amount: "₹ 2,400", status: "Confirmed" },
  { id: "BK100522", user: "Sneha Patil",     phone: "+91 87654 32109", initials: "SP", color: "#D97706", from: "Pune",    to: "Mumbai",    via: "Lonavala",         date: "15 Sep 2026", day: "Mon", seats: ["U1"],             amount: "₹ 1,200", status: "Pending"   },
  { id: "BK100521", user: "Amit Verma",      phone: "+91 98980 12345", initials: "AV", color: "#059669", from: "Nagpur",  to: "Hyderabad", via: "Adilabad",         date: "16 Sep 2026", day: "Tue", seats: ["L5", "L6", "L7"], amount: "₹ 3,600", status: "Confirmed" },
  { id: "BK100520", user: "Priya Deshmukh",  phone: "+91 76543 21098", initials: "PD", color: "#DC2626", from: "Mumbai",  to: "Nagpur",    via: "Nashik",           date: "16 Sep 2026", day: "Tue", seats: ["U3"],             amount: "₹ 1,800", status: "Cancelled" },
  { id: "BK100519", user: "Karan Mehta",     phone: "+91 99887 76654", initials: "KM", color: "#0284C7", from: "Bhopal",  to: "Indore",    via: "Sehore",           date: "17 Sep 2026", day: "Wed", seats: ["L1", "L2"],       amount: "₹ 1,600", status: "Confirmed" },
  { id: "BK100518", user: "Neha Singh",      phone: "+91 91234 56789", initials: "NS", color: "#7C3AED", from: "Pune",    to: "Bangalore", via: "Hubli, Dharwad",   date: "17 Sep 2026", day: "Wed", seats: ["U7", "U8"],       amount: "₹ 2,200", status: "Refunded"  },
  { id: "BK100517", user: "Vikram Joshi",    phone: "+91 90123 45678", initials: "VJ", color: "#16A34A", from: "Delhi",   to: "Nagpur",    via: "Jhansi",           date: "18 Sep 2026", day: "Thu", seats: ["L9"],             amount: "₹ 1,100", status: "Confirmed" },
  { id: "BK100516", user: "Ananya Rao",      phone: "+91 93456 78901", initials: "AR", color: "#EA580C", from: "Nagpur",  to: "Goa",       via: "Hyderabad",        date: "18 Sep 2026", day: "Thu", seats: ["U4", "U5"],       amount: "₹ 2,800", status: "Pending"   },
  { id: "BK100515", user: "Siddharth Kumar", phone: "+91 98712 34567", initials: "SK", color: "#0D9488", from: "Mumbai",  to: "Pune",      via: "Lonavala",         date: "19 Sep 2026", day: "Fri", seats: ["L10"],            amount: "₹ 900",   status: "Confirmed" },
  { id: "BK100514", user: "Pooja Nair",      phone: "+91 87621 99876", initials: "PN", color: "#E11D48", from: "Indore",  to: "Nagpur",    via: "Betul",            date: "19 Sep 2026", day: "Fri", seats: ["U1", "U2", "U3"], amount: "₹ 3,000", status: "Cancelled" },
  { id: "BK100513", user: "Gaurav Malhotra", phone: "+91 97654 32187", initials: "GM", color: "#2563EB", from: "Pune",    to: "Goa",       via: "Satara, Kolhapur", date: "20 Sep 2026", day: "Sat", seats: ["L11", "L12"],     amount: "₹ 2,600", status: "Confirmed" },
  { id: "BK100512", user: "Ritu Saxena",     phone: "+91 98123 45678", initials: "RS", color: "#D97706", from: "Nagpur",  to: "Mumbai",    via: "Amravati",         date: "20 Sep 2026", day: "Sat", seats: ["U6"],             amount: "₹ 1,750", status: "Pending"   },
  { id: "BK100511", user: "Manish Tiwari",   phone: "+91 99234 56789", initials: "MT", color: "#059669", from: "Delhi",   to: "Haridwar",  via: "Meerut",           date: "21 Sep 2026", day: "Sun", seats: ["L2", "L3"],       amount: "₹ 1,400", status: "Confirmed" },
  { id: "BK100510", user: "Kavita Reddy",    phone: "+91 98450 11223", initials: "KR", color: "#DC2626", from: "Hyderabad", to: "Bangalore", via: "Kurnool",       date: "21 Sep 2026", day: "Sun", seats: ["U9", "U10"],     amount: "₹ 2,900", status: "Confirmed" },
  { id: "BK100509", user: "Deepak Chawla",   phone: "+91 97112 33445", initials: "DC", color: "#7C3AED", from: "Indore",  to: "Ahmedabad", via: "Ujjain",           date: "22 Sep 2026", day: "Mon", seats: ["L8"],             amount: "₹ 1,150", status: "Refunded"  },
  { id: "BK100508", user: "Swati Kulkarni",  phone: "+91 98220 55667", initials: "SK", color: "#0284C7", from: "Nagpur",  to: "Pune",      via: "Wardha",           date: "22 Sep 2026", day: "Mon", seats: ["L1", "L2"],       amount: "₹ 2,400", status: "Confirmed" },
  { id: "BK100507", user: "Aditya Roy",      phone: "+91 99334 77889", initials: "AR", color: "#16A34A", from: "Mumbai",  to: "Surat",     via: "Vapi",             date: "23 Sep 2026", day: "Tue", seats: ["U3", "U4"],       amount: "₹ 1,500", status: "Confirmed" },
  { id: "BK100506", user: "Tanvi Bhatt",     phone: "+91 98661 22334", initials: "TB", color: "#EA580C", from: "Bhopal",  to: "Nagpur",    via: "Hoshangabad",      date: "23 Sep 2026", day: "Tue", seats: ["L6"],             amount: "₹ 950",   status: "Cancelled" },
  { id: "BK100505", user: "Nitin Pandey",    phone: "+91 91778 44556", initials: "NP", color: "#0D9488", from: "Pune",    to: "Nashik",    via: "Narayangaon",      date: "24 Sep 2026", day: "Wed", seats: ["L4"],             amount: "₹ 750",   status: "Confirmed" },
  { id: "BK100504", user: "Meera Sen",       phone: "+91 98330 66778", initials: "MS", color: "#E11D48", from: "Nagpur",  to: "Hyderabad", via: "Adilabad",         date: "24 Sep 2026", day: "Wed", seats: ["U5", "U6"],       amount: "₹ 2,800", status: "Pending"   },
];

const STATS = [
  { label: "Total Bookings", value: "1,248", icon: "confirmation_number", bg: "#EFF6FF", color: "#2563EB", change: "+ 12%", comp: "vs last month", up: true },
  { label: "Confirmed",      value: "892",   icon: "check_circle",          bg: "#ECFDF5", color: "#059669", change: "+ 8%",  comp: "vs last month", up: true },
  { label: "Pending",        value: "124",   icon: "schedule",              bg: "#FFFBEB", color: "#D97706", change: "+ 5%",  comp: "",              up: true },
  { label: "Cancelled",      value: "142",   icon: "cancel",                bg: "#FEF2F2", color: "#DC2626", change: "- 3%",  comp: "",              up: false },
  { label: "Refunded",       value: "90",    icon: "restart_alt",           bg: "#F5F3FF", color: "#7C3AED", change: "+ 2%",  comp: "",              up: true },
];

const STATUS_MAP = {
  "Confirmed": { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  "Pending":   { bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  "Cancelled": { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
  "Refunded":  { bg: "#EDE9FE", color: "#5B21B6", dot: "#7C3AED" },
};

// ── Page Component ────────────────────────────────────────────────────────────

export default function BusBookingsPage() {
  const [bookings, setBookings] = useState(BOOKINGS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("All Routes");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageSize = 10;

  const loadBookings = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminFetch('/api/admin/bookings?limit=50');
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data?.bookings || data.bookings;
      if (Array.isArray(list) && list.length > 0) {
        const colors = ["#2563EB", "#D97706", "#059669", "#DC2626", "#0284C7", "#7C3AED", "#16A34A", "#EA580C"];
        const mapped = list.map((b, i) => {
          const userName = b.user?.name || "Passenger";
          const initials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "P";
          const seatArr = Array.isArray(b.seatNumbers) && b.seatNumbers.length > 0 
            ? b.seatNumbers 
            : (Array.isArray(b.seats) ? b.seats.map(s => s.seatNumber || s) : ["L1"]);
          const waypoints = b.trip?.route?.waypoints;
          const via = Array.isArray(waypoints) && waypoints.length > 0 ? waypoints.join(", ") : "Direct Express";

          return {
            id: b.id,
            displayId: b.id.startsWith("YB-") || b.id.startsWith("BK") || b.id.startsWith("PB-") || b.id.length <= 12 ? b.id : b.id.slice(0, 8).toUpperCase(),
            user: userName,
            phone: b.user?.phone || "+91-8208024895",
            initials,
            color: colors[i % colors.length],
            from: b.trip?.route?.originCity || "Origin",
            to: b.trip?.route?.destinationCity || "Destination",
            via,
            date: b.trip?.departureDatetime 
              ? new Date(b.trip.departureDatetime).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) 
              : (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Today"),
            day: b.trip?.departureDatetime 
              ? new Date(b.trip.departureDatetime).toLocaleDateString("en-US", { weekday: 'short' }) 
              : (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-US", { weekday: 'short' }) : "Mon"),
            seats: seatArr,
            amount: `₹ ${Number(b.totalAmount || 0).toLocaleString('en-IN')}`,
            status: b.status === "CONFIRMED" ? "Confirmed" : b.status === "PENDING" ? "Pending" : b.status === "CANCELLED" ? "Cancelled" : (b.status || "Confirmed")
          };
        });
        setBookings(mapped);
      }
    } catch (err) {
      console.error('[Bookings] Error loading bookings:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleRouteFilterChange = (val) => {
    setRouteFilter(val);
    setCurrentPage(1);
  };

  const filtered = bookings.filter(b => {
    const matchTab = activeTab === "All" || b.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || b.id.toLowerCase().includes(q) || b.user.toLowerCase().includes(q) || b.phone.includes(q);
    const matchRoute = routeFilter === "All Routes" || `${b.from} → ${b.to}`.includes(routeFilter);
    return matchTab && matchSearch && matchRoute;
  });

  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedBookings = filtered.slice(startIndex, endIndex);

  // Dynamic pagination numbers calculation
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (safeCurrentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages];
  };
  const pageNumbers = getPageNumbers();

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

  const bookingStats = [
    { label: "Total Bookings", value: bookings.length.toLocaleString(), icon: "confirmation_number", bg: "#EFF6FF", color: "#2563EB", change: "+ 12%", comp: "vs last month", up: true },
    { label: "Confirmed",      value: bookings.filter(b => b.status === "Confirmed").length.toLocaleString(), icon: "check_circle", bg: "#ECFDF5", color: "#059669", change: "+ 8%", comp: "vs last month", up: true },
    { label: "Pending",        value: bookings.filter(b => b.status === "Pending").length.toLocaleString(), icon: "schedule", bg: "#FFFBEB", color: "#D97706", change: "+ 5%", comp: "", up: true },
    { label: "Cancelled",      value: bookings.filter(b => b.status === "Cancelled").length.toLocaleString(), icon: "cancel", bg: "#FEF2F2", color: "#DC2626", change: "- 3%", comp: "", up: false },
    { label: "Refunded",       value: bookings.filter(b => b.status === "Refunded").length.toLocaleString(), icon: "restart_alt", bg: "#F5F3FF", color: "#7C3AED", change: "+ 2%", comp: "", up: true },
  ];

  return (
    <AdminShell noScroll>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
          <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
          <span style={{ color: "#0F172A", fontWeight: 500 }}>Bookings</span>
        </div>

        {/* Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
              Bus Bookings
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "0.25rem", marginBottom: 0 }}>
              View and manage all bus ticket bookings. Search, filter and take action as needed.
            </p>
          </div>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: "0.375rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#fff", color: "#0F172A",
            border: "1px solid #E2E8F0", borderRadius: 8,
            fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>download</span>
            Export
          </button>
        </div>

        {/* 5 Stats Cards Row — Static KPI Header */}
        <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {bookingStats.map(s => (
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
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.value}</div>
                {s.change && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.2rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 11, color: s.up ? "#16A34A" : "#DC2626" }}>
                      {s.up ? "arrow_upward" : "arrow_downward"}
                    </span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.up ? "#16A34A" : "#DC2626" }}>{s.change}</span>
                    {s.comp && <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{s.comp}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
          
          {/* Filters Top Bar */}
          <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem 0.5rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Search Box */}
          <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#94A3B8", pointerEvents: "none" }}>search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by booking ID, name or phone number..."
              style={{
                width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem",
                color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none"
              }}
            />
          </div>

          {/* Interactive Date Range Picker */}
          <DateRangePicker initialStart="15 Sep 2026" initialEnd="30 Sep 2026" />

          {/* Dynamic Route Dropdown */}
          <select
            value={routeFilter}
            onChange={e => handleRouteFilterChange(e.target.value)}
            style={{
              padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0",
              borderRadius: 8, fontSize: "0.8125rem", color: "#475569",
              backgroundColor: "#fff", cursor: "pointer", outline: "none"
            }}
          >
            <option>All Routes</option>
            {Array.from(new Set(bookings.map(b => `${b.from} → ${b.to}`))).filter(Boolean).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Refresh Bookings Button */}
          <button
            onClick={loadBookings}
            disabled={isRefreshing}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0",
              borderRadius: 8, backgroundColor: "#fff", color: "#475569",
              fontSize: "0.8125rem", cursor: "pointer"
            }}
            title="Reload recent bookings from database"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15, animation: isRefreshing ? "spin 1s linear infinite" : "none" }}>sync</span>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>

          {/* Clear Filters */}
          <button
            onClick={() => { setSearch(""); setRouteFilter("All Routes"); handleTabChange("All"); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0",
              borderRadius: 8, backgroundColor: "#fff", color: "#475569",
              fontSize: "0.8125rem", cursor: "pointer"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>restart_alt</span>
            Reset
          </button>
        </div>

        {/* Tab Badges */}
        <div style={{ flexShrink: 0, padding: "0 1.25rem 0.875rem", display: "flex", gap: "0.5rem", borderBottom: "1px solid #F1F5F9" }}>
          {[
            { label: "All",         key: "All",       color: "#B91C1C", bg: "#B91C1C" },
            { label: "Confirmed",   key: "Confirmed", dot: "#16A34A" },
            { label: "Pending",     key: "Pending",   dot: "#D97706" },
            { label: "Cancelled",   key: "Cancelled", dot: "#DC2626" },
            { label: "Refunded",    key: "Refunded",  dot: "#7C3AED" },
          ].map(tab => {
            const isSelected = activeTab === tab.key;
            const count = tab.key === "All" ? bookings.length : bookings.filter(b => b.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.375rem 0.75rem", borderRadius: 20,
                  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                  border: isSelected && tab.key === "All" ? "none" : isSelected ? `1.5px solid ${tab.dot}` : "1px solid #E2E8F0",
                  backgroundColor: isSelected && tab.key === "All" ? "#B91C1C" : isSelected ? "#F8FAFC" : "#fff",
                  color: isSelected && tab.key === "All" ? "#fff" : isSelected ? "#0F172A" : "#64748B",
                  transition: "all 150ms",
                }}
              >
                {tab.dot && (
                  <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: tab.dot, display: "inline-block" }} />
                )}
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Data Table Container — keeps page static while table scrolls */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowX: "auto",
          overflowY: "auto",
          position: "relative",
          WebkitOverflowScrolling: "touch",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <th style={TH}>Booking ID</th>
                <th style={TH}>User Details</th>
                <th style={TH}>Route</th>
                <th style={TH}>Travel Date</th>
                <th style={TH}>Seats</th>
                <th style={TH}>Total Amount</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748B" }}>
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              ) : paginatedBookings.map((b, idx) => {
                const s = STATUS_MAP[b.status] || { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" };
                return (
                  <tr
                    key={`${b.id}-${idx}`}
                    style={{ borderBottom: idx < paginatedBookings.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {/* Booking ID */}
                    <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                      {b.displayId || b.id}
                    </td>

                    {/* User Details */}
                    <td style={{ padding: "0.875rem 0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          backgroundColor: `${b.color}15`, border: `1.5px solid ${b.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.72rem", fontWeight: 700, color: b.color, flexShrink: 0
                        }}>
                          {b.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>{b.user}</div>
                          <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{b.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td style={{ padding: "0.875rem 0.875rem" }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>
                        {b.from} <span style={{ color: "#B91C1C" }}>→</span> {b.to}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Via {b.via}</div>
                    </td>

                    {/* Travel Date */}
                    <td style={{ padding: "0.875rem 0.875rem", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: "0.8125rem", color: "#475569" }}>{b.date}</div>
                      <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{b.day}</div>
                    </td>

                    {/* Seats */}
                    <td style={{ padding: "0.875rem 0.875rem" }}>
                      <span style={{
                        display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 4,
                        backgroundColor: "#F1F5F9", color: "#475569", fontSize: "0.75rem", fontWeight: 600
                      }}>
                        {b.seats.join(", ")}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>
                      {b.amount}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "0.875rem 0.875rem" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.25rem 0.625rem", borderRadius: 5,
                        backgroundColor: s.bg, color: s.color,
                        fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap"
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.dot, display: "inline-block" }} />
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0.875rem 0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                        <Link
                          href={`/bookings/${b.id}`}
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
                        <button style={{
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #E2E8F0", backgroundColor: "#fff",
                          color: "#94A3B8", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <div style={{
          flexShrink: 0,
          backgroundColor: "#fff",
          padding: "0.875rem 1.25rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderTop: "1px solid #F1F5F9",
          flexWrap: "wrap", gap: "0.75rem"
        }}>
          <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
            Showing {totalRecords === 0 ? 0 : startIndex + 1} to {endIndex} of {totalRecords} bookings
          </span>
          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              title="Previous Page"
              style={{
                width: 30, height: 30, borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: safeCurrentPage === 1 ? "#F8FAFC" : "#fff",
                cursor: safeCurrentPage === 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: safeCurrentPage === 1 ? "#CBD5E1" : "#64748B",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
            </button>

            {pageNumbers.map((n, idx) => {
              if (n === "...") {
                return (
                  <span key={`ellipsis-${idx}`} style={{ color: "#94A3B8", fontSize: "0.875rem", padding: "0 0.25rem" }}>
                    ...
                  </span>
                );
              }
              const isSelected = safeCurrentPage === n;
              return (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  style={{
                    width: 30, height: 30, borderRadius: 6,
                    border: isSelected ? "none" : "1px solid #E2E8F0",
                    backgroundColor: isSelected ? "#B91C1C" : "#fff",
                    color: isSelected ? "#fff" : "#475569",
                    fontSize: "0.8125rem", fontWeight: isSelected ? 700 : 400,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 150ms ease",
                  }}
                >
                  {n}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              title="Next Page"
              style={{
                width: 30, height: 30, borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: safeCurrentPage === totalPages ? "#F8FAFC" : "#fff",
                cursor: safeCurrentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: safeCurrentPage === totalPages ? "#CBD5E1" : "#64748B",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </AdminShell>
  );
}
