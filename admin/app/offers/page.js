"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

const INITIAL_OFFERS = [
  {
    id: "OFF-101",
    code: "YATRA100",
    title: "Flat ₹100 Off on First Bus Booking",
    type: "Flat Discount",
    discount: "₹ 100",
    minBooking: "₹ 800",
    validTill: "31 Oct 2026",
    usageCount: 412,
    maxUsage: 1000,
    category: "Bus Tickets",
    status: "Active",
  },
  {
    id: "OFF-102",
    code: "SPIRITUAL15",
    title: "15% Off on Char Dham & Kedarnath Yatra",
    type: "Percentage",
    discount: "15%",
    minBooking: "₹ 25,000",
    validTill: "15 Nov 2026",
    usageCount: 88,
    maxUsage: 250,
    category: "Holiday Packages",
    status: "Active",
  },
  {
    id: "OFF-103",
    code: "EARLYBIRD",
    title: "Diwali Special Early Bird Booking",
    type: "Flat Discount",
    discount: "₹ 250",
    minBooking: "₹ 1,500",
    validTill: "20 Oct 2026",
    usageCount: 154,
    maxUsage: 500,
    category: "Bus Tickets",
    status: "Active",
  },
  {
    id: "OFF-104",
    code: "DUBAI2026",
    title: "Flat ₹5,000 Off on International Tours",
    type: "Flat Discount",
    discount: "₹ 5,000",
    minBooking: "₹ 70,000",
    validTill: "31 Dec 2026",
    usageCount: 32,
    maxUsage: 100,
    category: "Holiday Packages",
    status: "Active",
  },
  {
    id: "OFF-105",
    code: "MONSOON50",
    title: "End of Monsoon Flash Sale",
    type: "Flat Discount",
    discount: "₹ 50",
    minBooking: "₹ 500",
    validTill: "15 Sep 2026",
    usageCount: 500,
    maxUsage: 500,
    category: "Bus Tickets",
    status: "Expired",
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newMin, setNewMin] = useState("");
  const [newCategory, setNewCategory] = useState("Bus Tickets");

  const loadOffers = () => {
    adminFetch('/api/admin/offers')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data?.offers || data.offers || (Array.isArray(data.data) ? data.data : []);
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((o) => ({
            id: o.id,
            displayId: o.id.length > 8 ? o.id.slice(0, 8).toUpperCase() : o.id,
            code: o.code,
            title: `Special Offer: ${o.discountPercentage}% Off (Up to ₹${o.maxDiscountAmount})`,
            type: "Percentage",
            discount: `${o.discountPercentage}%`,
            minBooking: `Max ₹${o.maxDiscountAmount}`,
            validTill: o.validUntil ? new Date(o.validUntil).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "31 Dec 2026",
            usageCount: 0,
            maxUsage: 500,
            category: "All Bookings",
            status: o.isActive !== false ? "Active" : "Expired",
          }));
          setOffers(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleToggleOfferStatus = async (id) => {
    const target = offers.find(o => o.id === id);
    if (!target) return;
    const nextActive = target.status !== "Active";
    try {
      await adminFetch(`/api/admin/offers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextActive }),
      });
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status: nextActive ? "Active" : "Expired" } : o));
    } catch {
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status: nextActive ? "Active" : "Expired" } : o));
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!newCode) return;
    const cleanCode = newCode.trim().toUpperCase();
    const discountNum = parseInt(newDiscount.replace(/[^0-9]/g, '')) || 10;
    const maxDiscountNum = parseInt(newMin.replace(/[^0-9]/g, '')) || 500;
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);

    try {
      const res = await adminFetch('/api/admin/offers', {
        method: 'POST',
        body: JSON.stringify({
          code: cleanCode,
          discountPercentage: discountNum,
          maxDiscountAmount: maxDiscountNum,
          validUntil: futureDate.toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        loadOffers();
        setShowModal(false);
        setNewCode("");
        setNewTitle("");
        setNewDiscount("");
        setNewMin("");
      } else {
        alert(data.message || 'Failed to create offer.');
      }
    } catch {
      alert('Network error creating offer.');
    }
  };

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>Offers & Promotions</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Offers & Coupons
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            Create promotional discount codes and manage seasonal campaign vouchers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.375rem",
            padding: "0.5625rem 1.125rem", backgroundColor: "#B91C1C", color: "#fff",
            border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600,
            cursor: "pointer", boxShadow: "0 1px 2px rgba(185,28,28,0.2)"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Create New Coupon
        </button>
      </div>

      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Active Promo Codes</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: "0.2rem 0" }}>
            {offers.filter(o => o.status === "Active").length}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#16A34A", fontWeight: 600 }}>Currently redeemable</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Total Redemptions</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: "0.2rem 0" }}>
            1,186
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>Across all campaigns</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Discount Given</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#B91C1C", margin: "0.2rem 0" }}>
            ₹ 2,42,800
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>Customer savings generated</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Top Performing Code</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#2563EB", margin: "0.2rem 0" }}>
            YATRA100
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>412 redemptions</div>
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
        {offers.map(o => {
          const isActive = o.status === "Active";
          const usagePercent = Math.min(100, Math.round((o.usageCount / o.maxUsage) * 100));

          return (
            <div
              key={o.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                opacity: isActive ? 1 : 0.7,
                transition: "opacity 200ms ease, box-shadow 200ms ease",
              }}
            >
              {/* Card Top Banner with Dashed Coupon Border */}
              <div style={{
                padding: "1rem 1.25rem",
                backgroundColor: isActive ? "#FFF5F5" : "#F8FAFC",
                borderBottom: "1.5px dashed #CBD5E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{
                  padding: "0.3rem 0.65rem",
                  borderRadius: 6,
                  border: isActive ? "1.5px dashed #DC2626" : "1px dashed #94A3B8",
                  backgroundColor: "#fff",
                  fontFamily: "monospace",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: isActive ? "#B91C1C" : "#64748B",
                  letterSpacing: "0.08em"
                }}>
                  {o.code}
                </div>

                {/* Active / Inactive Toggle Switch */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    padding: "0.2rem 0.5rem", borderRadius: 4,
                    backgroundColor: isActive ? "#DCFCE7" : "#F1F5F9",
                    color: isActive ? "#166534" : "#64748B",
                    fontSize: "0.6875rem", fontWeight: 700
                  }}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleOfferStatus(o.id)}
                    title={isActive ? "Click to set Inactive" : "Click to set Active"}
                    aria-label={`Toggle offer ${o.code} active status`}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: isActive ? "#16A34A" : "#CBD5E1",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      padding: 0,
                      transition: "background-color 200ms ease",
                      outline: "none",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: isActive ? 18 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 200ms ease",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>
                  {o.title}
                </h3>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: "1rem" }}>
                  Applicable on: <strong>{o.category}</strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem", fontSize: "0.75rem" }}>
                  <div>
                    <span style={{ color: "#94A3B8" }}>Discount:</span>
                    <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "0.875rem" }}>{o.discount}</div>
                  </div>
                  <div>
                    <span style={{ color: "#94A3B8" }}>Min Booking:</span>
                    <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.875rem" }}>{o.minBooking}</div>
                  </div>
                </div>

                {/* Usage meter */}
                <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B", marginBottom: "0.35rem" }}>
                    <span>Redeemed: <strong>{o.usageCount}</strong> / {o.maxUsage}</span>
                    <span>Valid till {o.validTill}</span>
                  </div>
                  <div style={{ width: "100%", height: 6, backgroundColor: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${usagePercent}%`, height: "100%", backgroundColor: !isActive ? "#94A3B8" : "#B91C1C", borderRadius: 3 }} />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Coupon Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: 12, width: 440,
            padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>Create Promo Coupon</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOffer}>
              <div style={{ marginBottom: "0.875rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE200"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.8125rem", textTransform: "uppercase" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "0.875rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  Offer Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat ₹200 off on festive rides"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.8125rem" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                    Discount (₹ or %)
                  </label>
                  <input
                    type="text"
                    placeholder="₹ 150"
                    value={newDiscount}
                    onChange={e => setNewDiscount(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.8125rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                    Min Booking (₹)
                  </label>
                  <input
                    type="text"
                    placeholder="₹ 1,000"
                    value={newMin}
                    onChange={e => setNewMin(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.8125rem" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  Applies To
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.8125rem", backgroundColor: "#fff" }}
                >
                  <option>Bus Tickets</option>
                  <option>Holiday Packages</option>
                  <option>All Services</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "0.5rem 1rem", border: "1px solid #E2E8F0", borderRadius: 6, backgroundColor: "#fff", cursor: "pointer", fontSize: "0.8125rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.5rem 1.25rem", border: "none", borderRadius: 6, backgroundColor: "#B91C1C", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.8125rem" }}
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
