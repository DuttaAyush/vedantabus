"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "PKG-001",
    title: "Kedarnath Yatra",
    location: "Uttarakhand, India",
    duration: "6 Days 5 Nights",
    exCity: "Ex: Delhi",
    price: "28,500",
    category: "Spiritual",
    catIcon: "temple_hindu",
    status: "Active",
    gradient: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
    icon: "temple_hindu",
    iconColor: "#F59E0B"
  },
  {
    id: "PKG-002",
    title: "Goa Beach Getaway",
    location: "Goa, India",
    duration: "4 Days 3 Nights",
    exCity: "Ex: Mumbai",
    price: "18,000",
    category: "Domestic",
    catIcon: "landscape",
    status: "Active",
    gradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    icon: "beach_access",
    iconColor: "#38BDF8"
  },
  {
    id: "PKG-003",
    title: "Dubai & Abu Dhabi Luxury Escape",
    location: "UAE",
    duration: "7 Days 6 Nights",
    exCity: "Ex: Mumbai",
    price: "45,000",
    category: "International",
    catIcon: "public",
    status: "Active",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
    icon: "location_city",
    iconColor: "#FBBF24"
  },
  {
    id: "PKG-004",
    title: "Kerala Backwaters",
    location: "Kerala, India",
    duration: "5 Days 4 Nights",
    exCity: "Ex: Kochi",
    price: "32,000",
    category: "Domestic",
    catIcon: "landscape",
    status: "Draft",
    gradient: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
    icon: "houseboat",
    iconColor: "#34D399"
  },
  {
    id: "PKG-005",
    title: "Char Dham Yatra",
    location: "Uttarakhand, India",
    duration: "8 Days 7 Nights",
    exCity: "Ex: Haridwar",
    price: "36,500",
    category: "Spiritual",
    catIcon: "temple_hindu",
    status: "Active",
    gradient: "linear-gradient(135deg, #78350F 0%, #92400E 100%)",
    icon: "temple_hindu",
    iconColor: "#FCD34D"
  },
  {
    id: "PKG-006",
    title: "Europe Essentials",
    location: "France, Switzerland, Italy",
    duration: "10 Days 9 Nights",
    exCity: "Ex: Delhi",
    price: "1,25,000",
    category: "International",
    catIcon: "public",
    status: "Active",
    gradient: "linear-gradient(135deg, #3730A3 0%, #4338CA 100%)",
    icon: "tour",
    iconColor: "#A5B4FC"
  },
  {
    id: "PKG-007",
    title: "Himachal Highlights",
    location: "Himachal Pradesh, India",
    duration: "6 Days 5 Nights",
    exCity: "Ex: Chandigarh",
    price: "24,000",
    category: "Domestic",
    catIcon: "landscape",
    status: "Active",
    gradient: "linear-gradient(135deg, #164E63 0%, #0891B2 100%)",
    icon: "downhill_skiing",
    iconColor: "#67E8F9"
  },
  {
    id: "PKG-008",
    title: "Varanasi Spiritual Tour",
    location: "Uttar Pradesh, India",
    duration: "4 Days 3 Nights",
    exCity: "Ex: Varanasi",
    price: "16,500",
    category: "Spiritual",
    catIcon: "temple_hindu",
    status: "Archived",
    gradient: "linear-gradient(135deg, #991B1B 0%, #B91C1C 100%)",
    icon: "self_improvement",
    iconColor: "#FCA5A5"
  },
  {
    id: "PKG-009",
    title: "Rajasthan Heritage",
    location: "Rajasthan, India",
    duration: "6 Days 5 Nights",
    exCity: "Ex: Jaipur",
    price: "26,000",
    category: "Domestic",
    catIcon: "landscape",
    status: "Active",
    gradient: "linear-gradient(135deg, #854D0E 0%, #CA8A04 100%)",
    icon: "fort",
    iconColor: "#FDE047"
  },
  {
    id: "PKG-010",
    title: "Singapore Delight",
    location: "Singapore",
    duration: "5 Days 4 Nights",
    exCity: "Ex: Mumbai",
    price: "52,000",
    category: "International",
    catIcon: "public",
    status: "Active",
    gradient: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    icon: "attractions",
    iconColor: "#38BDF8"
  },
  {
    id: "PKG-011",
    title: "Andaman Island Escape",
    location: "Andaman & Nicobar",
    duration: "5 Days 4 Nights",
    exCity: "Ex: Chennai",
    price: "34,500",
    category: "Domestic",
    catIcon: "landscape",
    status: "Active",
    gradient: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
    icon: "scuba_diving",
    iconColor: "#5EEAD4"
  },
  {
    id: "PKG-012",
    title: "Rameswaram Pilgrimage",
    location: "Tamil Nadu, India",
    duration: "4 Days 3 Nights",
    exCity: "Ex: Madurai",
    price: "15,000",
    category: "Spiritual",
    catIcon: "temple_hindu",
    status: "Active",
    gradient: "linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)",
    icon: "temple_buddhist",
    iconColor: "#FDBA74"
  },
];

const CATEGORY_STYLES = {
  "Spiritual":     { bg: "rgba(254, 243, 199, 0.95)", color: "#B45309", icon: "temple_hindu" },
  "Domestic":      { bg: "rgba(204, 251, 241, 0.95)", color: "#0F766E", icon: "landscape" },
  "International": { bg: "rgba(224, 231, 255, 0.95)", color: "#4338CA", icon: "public" },
};

const STATUS_MAP = {
  "Active":   { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  "Draft":    { bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  "Archived": { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PackagesPage() {
  const [packagesList, setPackagesList] = useState(PACKAGES);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest First");

  useEffect(() => {
    adminFetch('/api/admin/packages')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data?.packages || data.packages;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((p, i) => ({
            id: p.id.length > 8 ? p.id.slice(0, 8).toUpperCase() : p.id,
            title: p.title,
            location: p.destination || p.location || "India",
            duration: p.duration || "5 Days 4 Nights",
            exCity: p.startingCity ? `Ex: ${p.startingCity}` : "Ex: Delhi",
            price: Number(p.basePrice || p.price || 25000).toLocaleString('en-IN'),
            category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase() : "Spiritual",
            catIcon: p.category === 'SPIRITUAL' ? 'temple_hindu' : p.category === 'INTERNATIONAL' ? 'public' : 'landscape',
            status: p.isActive !== false ? "Active" : "Draft",
            gradient: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
            icon: p.category === 'SPIRITUAL' ? 'temple_hindu' : p.category === 'INTERNATIONAL' ? 'flight' : 'landscape',
            iconColor: "#F59E0B"
          }));
          setPackagesList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = packagesList.filter(p => {
    const matchTab = activeTab === "All" || p.category.toLowerCase() === activeTab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>Packages</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Packages
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            Create, manage and showcase amazing holiday packages for your travellers.
          </p>
        </div>
        <Link href="/packages/new" style={{
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          padding: "0.5625rem 1.125rem",
          backgroundColor: "#B91C1C", color: "#fff",
          border: "none", borderRadius: 8,
          fontSize: "0.875rem", fontWeight: 600, textDecoration: "none",
          boxShadow: "0 1px 2px rgba(185,28,28,0.2)"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>add</span>
          Add New Package
        </Link>
      </div>

      {/* Filter Tabs & Toolbar Row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap"
      }}>
        {/* Category Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { label: `All (${packagesList.length})`,           key: "All",           icon: null },
            { label: `Spiritual (${packagesList.filter(p => p.category.toLowerCase() === "spiritual").length})`,      key: "Spiritual",     icon: "temple_hindu", color: "#B45309" },
            { label: `Domestic (${packagesList.filter(p => p.category.toLowerCase() === "domestic").length})`,       key: "Domestic",      icon: "landscape",    color: "#0F766E" },
            { label: `International (${packagesList.filter(p => p.category.toLowerCase() === "international").length})`,  key: "International", icon: "public",       color: "#4338CA" },
          ].map(tab => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  padding: "0.4rem 0.875rem", borderRadius: 20,
                  fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                  border: isSelected && tab.key === "All" ? "none" : isSelected ? `1.5px solid ${tab.color}` : "1px solid #E2E8F0",
                  backgroundColor: isSelected && tab.key === "All" ? "#B91C1C" : isSelected ? "#F8FAFC" : "#fff",
                  color: isSelected && tab.key === "All" ? "#fff" : isSelected ? "#0F172A" : "#64748B",
                  transition: "all 150ms",
                }}
              >
                {tab.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: tab.color }}>{tab.icon}</span>
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Search box */}
          <div style={{ position: "relative", width: 220 }}>
            <span className="material-symbols-outlined" style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#94A3B8", pointerEvents: "none"
            }}>search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search packages..."
              style={{
                width: "100%", paddingLeft: 32, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem",
                color: "#0F172A", backgroundColor: "#fff", outline: "none"
              }}
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ position: "relative" }}>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding: "0.4375rem 1.75rem 0.4375rem 0.75rem",
                border: "1px solid #E2E8F0", borderRadius: 8,
                fontSize: "0.8125rem", color: "#475569",
                backgroundColor: "#fff", cursor: "pointer", outline: "none",
                appearance: "none"
              }}
            >
              <option>Latest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Duration</option>
            </select>
            <span className="material-symbols-outlined" style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#94A3B8", pointerEvents: "none"
            }}>expand_more</span>
          </div>
        </div>
      </div>

      {/* 4-Column Package Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {filtered.map(pkg => {
          const cat = CATEGORY_STYLES[pkg.category];
          const st = STATUS_MAP[pkg.status];
          return (
            <div
              key={pkg.id}
              style={{
                background: "#fff", borderRadius: 12,
                border: "1px solid #F1F5F9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                overflow: "hidden", display: "flex", flexDirection: "column",
                transition: "transform 150ms ease, box-shadow 150ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
              }}
            >
              {/* Image / Gradient Banner with Floating Pills */}
              <div style={{
                height: 140, background: pkg.gradient,
                position: "relative", display: "flex",
                alignItems: "center", justifyContent: "center",
                overflow: "hidden"
              }}>
                {/* Background Pattern */}
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.15,
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "10px 10px"
                }} />

                {/* Big Center Icon */}
                <span className="material-symbols-outlined" style={{
                  fontSize: 54, color: pkg.iconColor, opacity: 0.9, position: "relative", zIndex: 1
                }}>
                  {pkg.icon}
                </span>

                {/* Category Badge top-left */}
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.2rem 0.55rem", borderRadius: 20,
                  backgroundColor: cat.bg, color: cat.color,
                  fontSize: "0.6875rem", fontWeight: 700,
                  backdropFilter: "blur(4px)", zIndex: 2
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{cat.icon}</span>
                  {pkg.category}
                </span>

                {/* Favorite Heart top-right */}
                <button style={{
                  position: "absolute", top: 10, right: 10,
                  width: 28, height: 28, borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.25)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#fff", zIndex: 2
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>favorite_border</span>
                </button>
              </div>

              {/* Package Content Info */}
              <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{
                  margin: "0 0 0.35rem", fontSize: "0.9375rem", fontWeight: 700,
                  color: "#0F172A", lineHeight: 1.3
                }}>
                  {pkg.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "#64748B", marginBottom: "0.625rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>location_on</span>
                  {pkg.location}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B", marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>calendar_today</span>
                    {pkg.duration}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>flight_takeoff</span>
                    {pkg.exCity}
                  </div>
                </div>

                {/* Price & Status Row */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid #F1F5F9"
                }}>
                  <div>
                    <div style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#0F172A" }}>
                      ₹ {pkg.price}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8" }}>per person</div>
                  </div>

                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.2rem 0.55rem", borderRadius: 4,
                    backgroundColor: st.bg, color: st.color,
                    fontSize: "0.7rem", fontWeight: 600
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: st.dot }} />
                    {pkg.status}
                  </span>
                </div>

                {/* 3 Action Buttons Footer */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.375rem", marginTop: "0.875rem" }}>
                  <Link
                    href={`/packages/${pkg.id}/edit`}
                    prefetch={false}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem",
                      padding: "0.35rem 0", borderRadius: 6,
                      border: "1px solid #E2E8F0", backgroundColor: "#fff",
                      color: "#475569", fontSize: "0.72rem", fontWeight: 500,
                      textDecoration: "none"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>edit</span>
                    Edit
                  </Link>

                  <button style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem",
                    padding: "0.35rem 0", borderRadius: 6,
                    border: "1px solid #E2E8F0", backgroundColor: "#fff",
                    color: "#475569", fontSize: "0.72rem", fontWeight: 500,
                    cursor: "pointer"
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>archive</span>
                    Archive
                  </button>

                  <button style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem",
                    padding: "0.35rem 0", borderRadius: 6,
                    border: "1px solid #FEE2E2", backgroundColor: "#FFF5F5",
                    color: "#DC2626", fontSize: "0.72rem", fontWeight: 500,
                    cursor: "pointer"
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>delete</span>
                    Delete
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
