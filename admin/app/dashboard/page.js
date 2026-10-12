"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const KPI_DATA = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "₹24,52,320",
    change: "+12.5%",
    comparison: "vs last month",
    up: true,
    icon: "payments",
    iconBg: "#FFF7ED",
    iconColor: "#EA580C",
    sparkColor: "#B91C1C",
    sparkData: [40, 48, 44, 58, 65, 60, 72, 80, 75, 92, 85, 105, 115],
  },
  {
    id: "bookings",
    label: "Total Bookings",
    value: "1,846",
    change: "+8.3%",
    comparison: "vs last month",
    up: true,
    icon: "confirmation_number",
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    sparkColor: "#0D9488",
    sparkData: [110, 125, 118, 140, 152, 145, 165, 178, 170, 190, 185, 200, 215],
  },
  {
    id: "trips",
    label: "Active Trips Today",
    value: "42",
    change: "+16.7%",
    comparison: "vs yesterday",
    up: true,
    icon: "directions_bus",
    iconBg: "#F0FDF4",
    iconColor: "#15803D",
    sparkColor: "#22C55E",
    sparkData: [25, 30, 28, 34, 37, 32, 40, 43, 38, 45, 42, 48, 50],
  },
  {
    id: "users",
    label: "Registered Users",
    value: "12,580",
    change: "+11.2%",
    comparison: "vs last month",
    up: true,
    icon: "group",
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    sparkColor: "#8B5CF6",
    sparkData: [750, 820, 800, 880, 930, 910, 980, 1060, 1030, 1110, 1090, 1140, 1180],
  },
];

const REVENUE_DATA = [
  { label: "16 Aug", value: 85000 },
  { label: "20 Aug", value: 128000 },
  { label: "24 Aug", value: 158000 },
  { label: "28 Aug", value: 198000 },
  { label: "1 Sep",  value: 242000 },
  { label: "5 Sep",  value: 284320 },
  { label: "9 Sep",  value: 258000 },
  { label: "13 Sep", value: 318000 },
];

const BOOKING_VOLUME_DATA = [
  { label: "16 Aug", bus: 42,  pkg: 10 },
  { label: "20 Aug", bus: 68,  pkg: 18 },
  { label: "24 Aug", bus: 55,  pkg: 20 },
  { label: "28 Aug", bus: 82,  pkg: 28 },
  { label: "1 Sep",  bus: 98,  pkg: 35 },
  { label: "5 Sep",  bus: 125, pkg: 48 },
  { label: "9 Sep",  bus: 108, pkg: 40 },
  { label: "13 Sep", bus: 145, pkg: 55 },
  { label: "17 Sep", bus: 162, pkg: 60 },
  { label: "21 Sep", bus: 178, pkg: 65 },
  { label: "25 Sep", bus: 155, pkg: 58 },
];

const RECENT_BOOKINGS = [
  { id: "VB250915001", type: "Bus",     customer: "Rahul Sharma",   email: "rahul.s@email.com",  route: "Nagpur → Pune",           date: "16 Sep 2026", amount: "₹1,200",  status: "Confirmed" },
  { id: "VB250915002", type: "Package", customer: "Priya Deshmukh", email: "priya.p@email.com",  route: "Kashmir Holiday (5D/4N)", date: "22 Sep 2026", amount: "₹24,999", status: "Pending" },
  { id: "VB250914998", type: "Bus",     customer: "Amit Patel",     email: "amit.p@email.com",   route: "Mumbai → Ahmedabad",      date: "15 Sep 2026", amount: "₹1,050",  status: "Confirmed" },
  { id: "VB250914997", type: "Package", customer: "Sneha Iyer",     email: "sneha.i@email.com",  route: "Bali Getaway (6D/5N)",    date: "10 Oct 2026", amount: "₹89,999", status: "Confirmed" },
  { id: "VB250914996", type: "Bus",     customer: "Vikram Singh",   email: "vikram.s@email.com", route: "Delhi → Haridwar",        date: "18 Sep 2026", amount: "₹850",    status: "Cancelled" },
];

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ data, color, id }) {
  const W = 110, H = 38;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - 2 - ((v - min) / range) * (H - 4);
    return [x.toFixed(1), y.toFixed(1)];
  });
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaD = `${lineD} L${W},${H} L0,${H} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${id})`} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────────────────

function RevenueChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(5); // default peak 5 Sep

  const VW = 560, VH = 220;
  const pl = 50, pr = 16, pt = 42, pb = 36;
  const cw = VW - pl - pr, ch = VH - pt - pb;
  const MAX = 400000;

  const x = (i) => pl + (i / (data.length - 1)) * cw;
  const y = (v) => pt + ch - (v / MAX) * ch;

  const lineD = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const areaD = `${lineD} L${x(data.length - 1).toFixed(1)},${(pt + ch).toFixed(1)} L${x(0).toFixed(1)},${(pt + ch).toFixed(1)} Z`;

  const yTicks = [0, 100000, 200000, 300000, 400000];
  const activeItem = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Gridlines + Y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pl} y1={y(v).toFixed(1)} x2={VW - pr} y2={y(v).toFixed(1)} stroke="#F1F5F9" strokeWidth="1.5" />
            <text x={pl - 6} y={y(v).toFixed(1)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#94A3B8">
              {v === 0 ? "₹0" : `₹${v / 100000}L`}
            </text>
          </g>
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={x(i).toFixed(1)} y={VH - 8} textAnchor="middle" fontSize="9.5" fill="#94A3B8">{d.label}</text>
        ))}

        {/* Area */}
        <path d={areaD} fill="url(#rev-area)" />

        {/* Line */}
        <path d={lineD} fill="none" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots & Hover Columns */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={x(i).toFixed(1)}
              cy={y(d.value).toFixed(1)}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill="#B91C1C"
              stroke="#fff"
              strokeWidth={hoverIndex === i ? 2 : 1.5}
            />
            <rect
              x={x(i) - (cw / data.length) / 2}
              y={pt}
              width={cw / data.length}
              height={ch}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoverIndex(i)}
            />
          </g>
        ))}

        {/* Hover dashed vertical line */}
        {hoverIndex !== null && (
          <line
            x1={x(hoverIndex).toFixed(1)} y1={pt}
            x2={x(hoverIndex).toFixed(1)} y2={pt + ch}
            stroke="#94A3B8" strokeWidth="1" strokeDasharray="4,3"
          />
        )}

        {/* Hover Tooltip Box on SVG */}
        {hoverIndex !== null && activeItem && (
          <g>
            <rect
              x={(x(hoverIndex) - 45).toFixed(1)}
              y={(Math.max(pt - 25, y(activeItem.value) - 44)).toFixed(1)}
              width="90"
              height="36"
              rx="6"
              fill="#0F172A"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            <text
              x={x(hoverIndex).toFixed(1)}
              y={(Math.max(pt - 25, y(activeItem.value) - 44) + 16).toFixed(1)}
              textAnchor="middle"
              fontSize="11"
              fill="#FFFFFF"
              fontWeight="700"
            >
              ₹{activeItem.value.toLocaleString('en-IN')}
            </text>
            <text
              x={x(hoverIndex).toFixed(1)}
              y={(Math.max(pt - 25, y(activeItem.value) - 44) + 29).toFixed(1)}
              textAnchor="middle"
              fontSize="9"
              fill="#94A3B8"
            >
              {activeItem.label} 2026
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Booking Volume Chart ───────────────────────────────────────────────────────

function BookingVolumeChart({ data }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const VW = 500, VH = 210;
  const pl = 34, pr = 10, pt = 16, pb = 34;
  const cw = VW - pl - pr, ch = VH - pt - pb;
  const MAX = 250;
  const n = data.length;
  const groupW = cw / n;
  const barW = groupW * 0.3;

  const yS = (v) => pt + ch - (v / MAX) * ch;
  const yTicks = [0, 50, 100, 150, 200, 250];

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg width="100%" viewBox={`0 0 ${VW} ${VH}`}>
        {/* Gridlines + Y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={pl} y1={yS(v).toFixed(1)} x2={VW - pr} y2={yS(v).toFixed(1)} stroke="#F1F5F9" strokeWidth="1.5" />
            <text x={pl - 4} y={yS(v).toFixed(1)} textAnchor="end" dominantBaseline="middle" fontSize="9.5" fill="#94A3B8">{v}</text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const cx = pl + i * groupW + groupW / 2;
          const bx = cx - barW - 1;
          const px = cx + 1;
          const busH = (d.bus / MAX) * ch;
          const pkgH = (d.pkg / MAX) * ch;
          const isHovered = hoverIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={bx.toFixed(1)}
                y={yS(d.bus).toFixed(1)}
                width={barW.toFixed(1)}
                height={busH.toFixed(1)}
                fill={isHovered ? "#DC2626" : "#B91C1C"}
                rx="2"
                opacity={isHovered ? 1 : 0.9}
              />
              <rect
                x={px.toFixed(1)}
                y={yS(d.pkg).toFixed(1)}
                width={barW.toFixed(1)}
                height={pkgH.toFixed(1)}
                fill={isHovered ? "#0F766E" : "#0D9488"}
                rx="2"
                opacity={isHovered ? 1 : 0.9}
              />
              <text x={cx.toFixed(1)} y={VH - 6} textAnchor="middle" fontSize="8.5" fill="#94A3B8">{d.label}</text>

              {/* Hover catcher */}
              <rect
                x={cx - groupW / 2}
                y={pt}
                width={groupW}
                height={ch}
                fill="transparent"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {hoverIdx !== null && (
        <div style={{
          position: "absolute",
          top: -10,
          left: `${((hoverIdx * groupW + pl + groupW / 2) / VW) * 100}%`,
          transform: "translateX(-50%)",
          backgroundColor: "#0F172A",
          color: "#fff",
          borderRadius: 6,
          padding: "0.3rem 0.55rem",
          fontSize: "0.6875rem",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 10,
          boxShadow: "0 4px 6px rgba(0,0,0,0.15)"
        }}>
          <div><strong>{data[hoverIdx].label} 2026</strong></div>
          <div style={{ color: "#FCA5A5" }}>Bus: {data[hoverIdx].bus}</div>
          <div style={{ color: "#5EEAD4" }}>Packages: {data[hoverIdx].pkg}</div>
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const styles = {
    Confirmed: { bg: "#DCFCE7", color: "#166534" },
    Pending:   { bg: "#FEF9C3", color: "#854D0E" },
    Cancelled: { bg: "#FEE2E2", color: "#991B1B" },
    Refunded:  { bg: "#EDE9FE", color: "#5B21B6" },
  };
  const s = styles[status] || { bg: "#F1F5F9", color: "#475569" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.2rem 0.625rem",
      borderRadius: 4,
      backgroundColor: s.bg, color: s.color,
      fontSize: "0.75rem", fontWeight: 600,
    }}>{status}</span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const now = new Date();
  const h = now.getHours();
  const greeting = h < 12 ? "Good Morning," : h < 17 ? "Good Afternoon," : "Good Evening,";
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  const [kpis, setKpis] = useState(KPI_DATA);
  const [recentBookings, setRecentBookings] = useState(RECENT_BOOKINGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminFetch('/api/admin/dashboard/stats');
      const data = await res.json();
      const stats = data.data?.stats || data.stats;
      if (stats) {
        setKpis(prev => prev.map(k => {
          if (k.id === 'revenue') return { ...k, value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}` };
          if (k.id === 'bookings') return { ...k, value: (stats.totalBookings || 0).toLocaleString('en-IN') };
          if (k.id === 'trips') return { ...k, value: String(stats.activeTrips || 0) };
          if (k.id === 'users') return { ...k, value: (stats.totalUsers || 0).toLocaleString('en-IN') };
          return k;
        }));
      }
      const rec = data.data?.recentBookings || data.recentBookings;
      if (Array.isArray(rec) && rec.length > 0) {
        setRecentBookings(rec.map(b => ({
          id: b.id,
          type: b.type || (b.package ? "Package" : "Bus"),
          customer: b.customer || b.user?.name || "Passenger",
          email: b.email || b.user?.email || "customer@VedantaBus.in",
          route: b.route || (b.trip?.route ? `${b.trip.route.originCity} → ${b.trip.route.destinationCity}` : (b.package?.title || "Intercity Route")),
          date: b.date ? new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Today"),
          amount: typeof b.amount === 'string' && b.amount.startsWith('₹') ? b.amount : `₹${Number(b.amount || b.totalAmount || 0).toLocaleString('en-IN')}`,
          status: b.status,
        })));
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <AdminShell>
      {/* ── Greeting row ── */}
      <div className="dashboard-header-row" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", gap: "0.75rem" }}>
        <div className="dashboard-greeting-text">
          <p className="dashboard-greeting-sub" style={{ fontSize: "0.875rem", color: "#64748B", marginBottom: 2 }}>{greeting}</p>
          <h1 className="dashboard-title" style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.15, margin: "0 0 0.25rem" }}>
            Welcome back, Admin!
          </h1>
          <p className="dashboard-subtitle" style={{ fontSize: "0.875rem", color: "#94A3B8" }}>Here&apos;s what&apos;s happening with your operations today.</p>
        </div>
        <div className="dashboard-date-badge">
          <span className="material-symbols-outlined dashboard-date-icon">calendar_today</span>
          <div className="dashboard-date-content">
            <div className="dashboard-date-text">{dateStr}</div>
            <div className="dashboard-date-sub">Have a productive day!</div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="dashboard-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {kpis.map((k) => (
          <div key={k.id} className="dashboard-kpi-card" style={{
            background: "#fff", borderRadius: 12,
            padding: "1.125rem 1.25rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            border: "1px solid #F1F5F9",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.35rem" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Icon */}
                <div className="kpi-icon-wrap" style={{
                  width: 38, height: 38, borderRadius: "50%",
                  backgroundColor: k.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "0.625rem",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: k.iconColor }}>{k.icon}</span>
                </div>
                <div className="kpi-label" style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 500, marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.label}</div>
                <div className="kpi-value" style={{ fontSize: "1.4375rem", fontWeight: 700, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}>{k.value}</div>
              </div>
              {/* Sparkline */}
              <div className="kpi-sparkline" style={{ paddingTop: "0.125rem", flexShrink: 0 }}>
                <Sparkline data={k.sparkData} color={k.sparkColor} id={k.id} />
              </div>
            </div>
            {/* Trend */}
            <div className="kpi-trend" style={{ marginTop: "0.625rem", display: "flex", alignItems: "center", gap: "0.2rem", flexWrap: "wrap" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: k.up ? "#16A34A" : "#DC2626" }}>
                {k.up ? "trending_up" : "trending_down"}
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: k.up ? "#16A34A" : "#DC2626" }}>{k.change}</span>
              <span className="kpi-comparison" style={{ fontSize: "0.75rem", color: "#94A3B8", marginLeft: 2 }}>{k.comparison}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="dashboard-charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        {/* Revenue Overview */}
        <div className="dashboard-chart-card" style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.25rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#B91C1C" }}>show_chart</span>
                <span className="chart-title" style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Revenue Overview</span>
              </div>
              <p className="chart-sub" style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: 2 }}>Total revenue from bus bookings and package bookings</p>
            </div>
            <select className="chart-select" style={{
              fontSize: "0.75rem", color: "#475569",
              border: "1px solid #E2E8F0", borderRadius: 6,
              padding: "0.25rem 0.5rem", background: "#fff", cursor: "pointer",
              outline: "none",
            }}>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <RevenueChart data={REVENUE_DATA} />
        </div>

        {/* Booking Volume */}
        <div className="dashboard-chart-card" style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.25rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#B91C1C" }}>bar_chart</span>
                <span className="chart-title" style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Booking Volume</span>
              </div>
              <p className="chart-sub" style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: 2 }}>Bus vs Package bookings</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.375rem" }}>
              <select className="chart-select" style={{
                fontSize: "0.75rem", color: "#475569",
                border: "1px solid #E2E8F0", borderRadius: 6,
                padding: "0.25rem 0.5rem", background: "#fff", cursor: "pointer",
                outline: "none",
              }}>
                <option>Last 30 Days</option>
              </select>
              <div className="chart-legend" style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#B91C1C", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Bus</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0D9488", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.7rem", color: "#64748B" }}>Package</span>
                </div>
              </div>
            </div>
          </div>
          <BookingVolumeChart data={BOOKING_VOLUME_DATA} />
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#B91C1C" }}>receipt_long</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0F172A" }}>Recent Bookings</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Latest bus and package bookings across all channels</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={loadDashboardData}
              disabled={isRefreshing}
              style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                padding: "0.35rem 0.65rem", borderRadius: 6,
                border: "1px solid #E2E8F0", background: "#fff",
                color: "#475569", fontSize: "0.75rem", fontWeight: 600,
                cursor: "pointer", transition: "all 150ms"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F8FAFC"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15, animation: isRefreshing ? "spin 1s linear infinite" : "none" }}>refresh</span>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <Link href="/bookings" style={{
              display: "flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.8125rem", fontWeight: 600, color: "#B91C1C",
              textDecoration: "none",
            }}>
              View All Bookings
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {["BOOKING ID", "TYPE", "CUSTOMER", "ROUTE / PACKAGE", "TRAVEL DATE", "AMOUNT", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} style={{
                    padding: "0.625rem 1rem", textAlign: "left",
                    fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.06em",
                    color: "#94A3B8", textTransform: "uppercase",
                    borderBottom: "1px solid #F1F5F9",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, idx) => (
                <tr key={`${b.id}-${idx}`} style={{ borderBottom: idx < recentBookings.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <Link href={b.type === "Package" ? "/package-bookings" : `/bookings`} style={{ color: "#B91C1C", fontWeight: 600, fontSize: "0.8125rem", textDecoration: "none" }}>
                      {b.id}
                    </Link>
                  </td>
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
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "#0F172A" }}>{b.customer}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{b.email}</div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{b.route}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#64748B" }}>{b.date}</td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" }}>{b.amount}</td>
                  <td style={{ padding: "0.875rem 1rem" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8", borderRadius: 6, display: "flex" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8", borderRadius: 6, display: "flex" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_horiz</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
