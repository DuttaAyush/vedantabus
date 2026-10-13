"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_NAV_ITEMS = [
  { href: "/dashboard",        icon: "home",                label: "Dashboard" },
  { href: "/users",            icon: "person",              label: "Users" },
  { href: "/routes",           icon: "route",               label: "Routes" },
  { href: "/buses",            icon: "directions_bus",      label: "Buses" },
  { href: "/trips",            icon: "calendar_today",      label: "Trips" },
  { href: "/bookings",         icon: "confirmation_number", label: "Bookings" },
  { href: "/package-bookings", icon: "luggage",              label: "Package Bookings" },
  { href: "/packages",         icon: "travel_explore",      label: "Packages" },
  { href: "/support",          icon: "headset_mic",         label: "Support & Leads" },
  { href: "/offers",           icon: "local_offer",         label: "Offers" },
  { href: "/analytics",        icon: "bar_chart",           label: "Analytics" },
  { href: "/settings",         icon: "settings",            label: "Settings" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = JSON.parse(localStorage.getItem("admin_user") || "{}");
        if (u.role === "SUPER_ADMIN") {
          setIsSuperAdmin(true);
        }
      } catch {}
    }
  }, []);

  const navItems = isSuperAdmin
    ? [
        BASE_NAV_ITEMS[0], // Dashboard
        BASE_NAV_ITEMS[1], // Users
        { href: "/admins", icon: "shield_person", label: "Admins", badge: "Super" },
        ...BASE_NAV_ITEMS.slice(2),
      ]
    : BASE_NAV_ITEMS;

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 49, transition: "opacity 200ms"
          }}
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? "open" : ""}`}
        style={{
          width: 220,
          minHeight: "100vh",
          backgroundColor: "#0F172A",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
        }}
      >
        {/* Logo & Mobile Close */}
        <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/dashboard"
            onClick={() => { if (onClose) onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}
          >
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              padding: "0.25rem 0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}>
              <img
                src="/logo.png"
                alt="VedantaBus Logo"
                style={{
                  height: 32,
                  width: "auto",
                  maxWidth: 105,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                Admin
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>
                Portal
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: "none", border: "none", color: "#94A3B8", cursor: "pointer",
              display: "flex", padding: 4
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: "0.5rem", overflowY: "auto" }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (onClose) onClose(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 1rem",
                color: active ? "#FFFFFF" : "#94A3B8",
                backgroundColor: active ? "#B91C1C" : "transparent",
                fontSize: "0.8125rem",
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                transition: "all 150ms ease",
                borderRadius: 0,
                margin: "1px 0",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#1E293B"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 19, flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "1px 6px",
                  borderRadius: 4,
                  backgroundColor: active ? "rgba(255,255,255,0.25)" : "rgba(245, 158, 11, 0.2)",
                  color: active ? "#FFFFFF" : "#FBBF24",
                  border: active ? "none" : "1px solid rgba(245, 158, 11, 0.4)",
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom promo banner */}
      <div style={{
        margin: "0.75rem",
        borderRadius: 10,
        overflow: "hidden",
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 60%, #1a0a0a 100%)",
        padding: "1rem",
        border: "1px solid #1E293B",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 70, height: "100%",
          background: "linear-gradient(to left, rgba(185,28,28,0.15), transparent)",
        }} />
        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#B91C1C", marginBottom: "0.375rem", display: "block" }}>directions_bus</span>
        <div style={{ fontSize: "0.75rem", color: "#94A3B8", lineHeight: 1.3 }}>Better Journeys</div>
        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3, marginTop: 2 }}>A Brighter Bharat</div>
      </div>
    </aside>
    </>
  );
}
