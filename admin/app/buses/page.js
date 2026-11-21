"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

// Buses will be fetched from API
// const BUSES = [...] removed

const STATS = [
  { label: "Total Buses",    value: "48", icon: "directions_bus", bg: "#EFF6FF", color: "#2563EB", change: "+12%", comp: "vs last month", up: true  },
  { label: "Active Buses",   value: "40", icon: "directions_bus", bg: "#ECFDF5", color: "#059669", change: "+8%",  comp: "vs last month", up: true  },
  { label: "In Maintenance", value: "5",  icon: "build",          bg: "#FFFBEB", color: "#D97706", change: "-17%", comp: "vs last month", up: false },
  { label: "Retired Buses",  value: "3",  icon: "directions_bus", bg: "#FEF2F2", color: "#B91C1C", change: "−0%",  comp: "vs last month", up: null  },
];

const STATUS_MAP = {
  "Active":         { bg: "#F0FDF4", color: "#166534", dot: "#22C55E" },
  "In Maintenance": { bg: "#FFFBEB", color: "#92400E", dot: "#F59E0B" },
  "Retired":        { bg: "#FFF1F2", color: "#991B1B", dot: "#F87171" },
};

const AMENITY_ICONS = [
  { key: "wifi",     icon: "wifi",      color: "#B91C1C" },
  { key: "charging", icon: "bolt",      color: "#B91C1C" },
  { key: "blanket",  icon: "king_bed",  color: "#B91C1C" },
  { key: "gps",      icon: "gps_fixed", color: "#22C55E" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function BusThumbnail({ style, image }) {
  const isRed = style === "red";
  if (image) {
    return (
      <div style={{
        width: 52, height: 36, borderRadius: 6, flexShrink: 0,
        overflow: "hidden", border: "1px solid #E2E8F0",
        backgroundColor: "#F8FAFC",
      }}>
        <img
          src={image}
          alt="Bus photo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    );
  }
  return (
    <div style={{
      width: 52, height: 36, borderRadius: 6, flexShrink: 0,
      backgroundColor: isRed ? "#FEF2F2" : "#F8FAFC",
      border: `1px solid ${isRed ? "#FEE2E2" : "#E2E8F0"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 23, color: isRed ? "#B91C1C" : "#94A3B8" }}>directions_bus</span>
    </div>
  );
}

function AmenityIcons({ amenities }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {AMENITY_ICONS.map(({ key, icon, color }) =>
        amenities[key] ? (
          <span key={key} className="material-symbols-outlined" style={{ fontSize: 17, color }}>{icon}</span>
        ) : (
          <span key={key} style={{ fontSize: "0.875rem", color: "#CBD5E1", width: 17, textAlign: "center", display: "inline-block" }}>—</span>
        )
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      padding: "0.25rem 0.625rem", borderRadius: 5,
      backgroundColor: s.bg, color: s.color,
      fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: s.dot, flexShrink: 0, display: "inline-block" }} />
      {status}
    </span>
  );
}

const MOCK_BUSES = [
  { id: "b1", plate: "MH 31 AB 1234", type: "Volvo AC Sleeper (2+1)", seats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "12 Aug 2026", busStyle: "silver" },
  { id: "b2", plate: "MH 40 CD 5678", type: "Scania Multi-Axle AC (2+2)", seats: 49, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "Active", serviced: "05 Sep 2026", busStyle: "red" },
  { id: "b3", plate: "MH 31 EF 9012", type: "Mercedes Benz AC Seater (2+2)", seats: 45, amenities: { wifi: false, charging: true, blanket: false, gps: true }, status: "Active", serviced: "20 Jul 2026", busStyle: "silver" },
  { id: "b4", plate: "MH 49 GH 3456", type: "Tata Ultra AC (2+1)", seats: 36, amenities: { wifi: false, charging: false, blanket: true, gps: true }, status: "In Maintenance", serviced: "01 Sep 2026", busStyle: "red" },
  { id: "b5", plate: "MH 12 IJ 7890", type: "BharatBenz AC Sleeper", seats: 38, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "15 Aug 2026", busStyle: "silver" },
  { id: "b6", plate: "MH 31 KL 4321", type: "Ashok Leyland Non-AC Seater", seats: 52, amenities: { wifi: false, charging: false, blanket: false, gps: true }, status: "Active", serviced: "10 Jun 2026", busStyle: "red" },
  { id: "b7", plate: "MH 14 MN 6789", type: "Volvo 9600 Multi-Axle Sleeper", seats: 42, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "28 Aug 2026", busStyle: "silver" },
  { id: "b8", plate: "MH 31 OP 2468", type: "Eicher Intercity AC (2+2)", seats: 44, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "In Maintenance", serviced: "02 Sep 2026", busStyle: "red" },
  { id: "b9", plate: "MH 40 QR 1357", type: "Volvo B11R Luxury Sleeper", seats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "18 Aug 2026", busStyle: "silver" },
  { id: "b10", plate: "MH 12 ST 9753", type: "Tata Starbus Ultra (2+2)", seats: 48, amenities: { wifi: false, charging: true, blanket: false, gps: true }, status: "Retired", serviced: "10 Jan 2026", busStyle: "red" },
  { id: "b11", plate: "MH 31 UV 8642", type: "Volvo AC Sleeper (2+1)", seats: 40, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "22 Aug 2026", busStyle: "silver" },
  { id: "b12", plate: "MH 40 WX 7531", type: "Scania AC Seater (2+2)", seats: 50, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "Active", serviced: "30 Aug 2026", busStyle: "red" },
  { id: "b13", plate: "MH 12 YZ 6420", type: "Mercedes Benz Sleeper", seats: 36, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "In Maintenance", serviced: "04 Sep 2026", busStyle: "silver" },
  { id: "b14", plate: "MH 14 AA 1122", type: "BharatBenz Luxury AC", seats: 44, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "12 Sep 2026", busStyle: "red" },
  { id: "b15", plate: "MH 31 BB 3344", type: "Tata LPO AC Seater", seats: 55, amenities: { wifi: false, charging: false, blanket: false, gps: true }, status: "Active", serviced: "01 Aug 2026", busStyle: "silver" },
  { id: "b16", plate: "MH 49 CC 5566", type: "Ashok Leyland AC Sleeper", seats: 38, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "08 Sep 2026", busStyle: "red" },
  { id: "b17", plate: "MH 12 DD 7788", type: "Volvo B8R Semi-Sleeper", seats: 46, amenities: { wifi: true, charging: true, blanket: false, gps: true }, status: "Retired", serviced: "05 Feb 2026", busStyle: "silver" },
  { id: "b18", plate: "MH 40 EE 9900", type: "Scania Metrolink AC", seats: 48, amenities: { wifi: true, charging: true, blanket: true, gps: true }, status: "Active", serviced: "14 Sep 2026", busStyle: "red" },
];

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
  position: "sticky",
  top: 0,
  zIndex: 10,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BusesPage() {
  const [buses, setBuses] = useState(MOCK_BUSES);
  const [isLoading, setIsLoading] = useState(false);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageSize,     setPageSize]     = useState(10);

  const loadBuses = () => {
    setIsLoading(true);
    adminFetch("/api/admin/fleet")
      .then(res => res.json())
      .then(data => {
        const busList = Array.isArray(data) ? data : data.data || [];
        if (busList.length > 0) {
          const mappedBuses = busList.map(b => {
            const imgs = Array.isArray(b.images) ? b.images : [];
            const primaryImg = imgs.find(i => typeof i === 'object' && i.isPrimary) || imgs[0];
            const primaryUrl = typeof primaryImg === 'string' ? primaryImg : primaryImg?.url;
            return {
              id: b.id,
              plate: b.plateNumber,
              type: b.type,
              seats: b.totalSeats,
              amenities: b.amenities || {},
              status: b.status === "In_Maintenance" ? "In Maintenance" : b.status,
              serviced: b.lastServiced ? new Date(b.lastServiced).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
              busStyle: b.busStyle || "silver",
              images: imgs,
              primaryImage: primaryUrl || null,
            };
          });
          setBuses(mappedBuses);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch fleet:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleTypeFilterChange = (val) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleDeleteBus = async (bus) => {
    if (!window.confirm(`Are you sure you want to remove bus "${bus.plate}" from the fleet? Associated trips will also be removed.`)) {
      return;
    }
    try {
      const res = await adminFetch(`/api/admin/fleet/${bus.id}?force=true`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBuses(prev => prev.filter(b => b.id !== bus.id));
      } else {
        alert(data.message || "Failed to delete bus");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const filtered = buses.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.plate.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
    const matchType   = typeFilter === "All Types"   || b.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchStatus = statusFilter === "All Status" || b.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paginatedBuses = filtered.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safeCurrentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (safeCurrentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages];
  };
  const pageNumbers = getPageNumbers();

  const STATS = [
    { label: "Total Buses",    value: String(buses.length), icon: "directions_bus", bg: "#EFF6FF", color: "#2563EB", change: "+12%", comp: "in fleet", up: true  },
    { label: "Active Buses",   value: String(buses.filter(b => b.status === "Active").length), icon: "directions_bus", bg: "#ECFDF5", color: "#059669", change: "+8%",  comp: "operational", up: true  },
    { label: "In Maintenance", value: String(buses.filter(b => b.status === "In Maintenance").length),  icon: "build",          bg: "#FFFBEB", color: "#D97706", change: "0%", comp: "service bay", up: false },
    { label: "Retired Buses",  value: String(buses.filter(b => b.status === "Retired").length),  icon: "directions_bus", bg: "#FEF2F2", color: "#B91C1C", change: "0%",  comp: "retired", up: null  },
  ];

  return (
    <AdminShell noScroll>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
          <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
          <span style={{ color: "#0F172A", fontWeight: 500 }}>Buses</span>
        </div>

        {/* Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
              Bus Fleet
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "0.25rem", marginBottom: 0 }}>
              Manage your bus fleet, view details, and keep track of availability.
            </p>
          </div>
          <Link href="/buses/new" style={{
            display: "inline-flex", alignItems: "center", gap: "0.375rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#B91C1C", color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>add</span>
            Add New Bus
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 10,
              padding: "0.75rem 1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              border: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: s.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 500, marginBottom: "0.1rem" }}>{s.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{s.value}</div>
                {s.change && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.2rem" }}>
                    {s.up !== null && (
                      <span className="material-symbols-outlined" style={{ fontSize: 11, color: s.up ? "#16A34A" : "#DC2626" }}>
                        {s.up ? "arrow_upward" : "arrow_downward"}
                      </span>
                    )}
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.up === true ? "#16A34A" : s.up === false ? "#DC2626" : "#94A3B8" }}>{s.change}</span>
                    <span style={{ fontSize: "0.65rem", color: "#94A3B8" }}>{s.comp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
          {/* Toolbar */}
          <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #F1F5F9" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#94A3B8", pointerEvents: "none" }}>search</span>
            <input
              type="text"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search by registration number, bus type..."
              style={{ width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none" }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* All Types */}
          <select value={typeFilter} onChange={e => handleTypeFilterChange(e.target.value)} style={{ padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", color: "#475569", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}>
            <option>All Types</option>
            <option>Sleeper</option>
            <option>Seater</option>
            <option>AC</option>
          </select>

          {/* All Status */}
          <select value={statusFilter} onChange={e => handleStatusFilterChange(e.target.value)} style={{ padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", color: "#475569", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}>
            <option>All Status</option>
            <option>Active</option>
            <option>In Maintenance</option>
            <option>Retired</option>
          </select>

          {/* Sort */}
          <select style={{ padding: "0.4375rem 0.75rem", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem", color: "#475569", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}>
            <option>Sort by: Latest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Seats ↑</option>
            <option>Sort by: Seats ↓</option>
          </select>
        </div>

        {/* Scrollable Data Table Container */}
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
                <th style={TH}>Registration Plate #</th>
                <th style={TH}>Bus Type</th>
                <th style={TH}>Seat Count</th>
                <th style={TH}>Amenities</th>
                <th style={TH}>Status</th>
                <th style={TH}>Last Serviced</th>
                <th style={{ ...TH, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#64748B" }}>Loading buses from API...</td></tr>
              ) : paginatedBuses.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#64748B" }}>No buses found.</td></tr>
              ) : paginatedBuses.map((b, idx) => (
                <tr
                  key={b.plate}
                  style={{ borderBottom: idx < paginatedBuses.length - 1 ? "1px solid #F8FAFC" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {/* Registration */}
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Link
                      href={`/buses/${b.id || b.plate}/edit`}
                      prefetch={false}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
                    >
                      <BusThumbnail style={b.busStyle} image={b.primaryImage} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A", transition: "color 150ms" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#B91C1C"}
                            onMouseLeave={e => e.currentTarget.style.color = "#0F172A"}
                          >
                            {b.plate}
                          </span>
                          {b.images && b.images.length > 0 && (
                            <span style={{ fontSize: "0.6875rem", backgroundColor: "#EFF6FF", color: "#1D4ED8", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                              📷 {b.images.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Bus Type */}
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#475569" }}>
                    <Link href={`/buses/${b.id || b.plate}/edit`} prefetch={false} style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>
                      {b.type}
                    </Link>
                  </td>

                  {/* Seat Count */}
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#64748B" }}>{b.seats}</td>

                  {/* Amenities */}
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <AmenityIcons amenities={b.amenities} />
                  </td>

                  {/* Status */}
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <StatusBadge status={b.status} />
                  </td>

                  {/* Last Serviced */}
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#64748B", whiteSpace: "nowrap" }}>{b.serviced}</td>

                  {/* Actions */}
                  <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                      <Link
                        href={`/buses/${b.plate}/edit`}
                        prefetch={false}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          padding: "0.3rem 0.75rem",
                          border: "1px solid #E2E8F0", borderRadius: 6,
                          backgroundColor: "#fff", color: "#475569",
                          fontSize: "0.8125rem", fontWeight: 500, textDecoration: "none",
                          transition: "all 150ms",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#475569"; }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBus(b)}
                        title="Remove bus from fleet"
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 28, height: 28, borderRadius: 6,
                          border: "1px solid #FEE2E2", backgroundColor: "#FFF5F5",
                          color: "#B91C1C", cursor: "pointer",
                          transition: "all 150ms",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEE2E2"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#FFF5F5"; }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ flexShrink: 0, backgroundColor: "#fff", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", flexWrap: "wrap", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
            Showing {filtered.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filtered.length} buses
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
                  <span key={`dots-${idx}`} style={{ fontSize: "0.875rem", color: "#94A3B8", padding: "0 0.25rem" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: "0.25rem 0.5rem", border: "1px solid #E2E8F0",
                borderRadius: 6, fontSize: "0.8125rem", color: "#475569",
                backgroundColor: "#fff", cursor: "pointer", outline: "none",
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
  );
}
