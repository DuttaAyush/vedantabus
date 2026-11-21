"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Mock Data for Leads & Tickets ─────────────────────────────────────────────

const INITIAL_LEADS = [
  {
    id: "LD-801",
    name: "Dr. Rajesh Sharma",
    phone: "+91 98220 12345",
    email: "rajesh.sharma@healthclinic.org",
    packageInterest: "Kedarnath Yatra",
    travellers: 6,
    budget: "₹ 1,75,000",
    source: "Website Package Form",
    created: "24 Sep 2026, 11:20 AM",
    status: "New", // New | Contacted | Converted | Dropped
    notes: "Requires senior citizen friendly vehicle & VIP Darshan passes for 2 elders.",
  },
  {
    id: "LD-802",
    name: "Pooja Malhotra",
    phone: "+91 97110 54321",
    email: "pooja.m@deloitte.com",
    packageInterest: "Dubai & Abu Dhabi Luxury Escape",
    travellers: 2,
    budget: "₹ 1,00,000",
    source: "Custom Itinerary Inquiry",
    created: "23 Sep 2026, 04:45 PM",
    status: "Contacted",
    notes: "Honeymoon booking for November 1st week. Wants 5-star hotel options.",
  },
  {
    id: "LD-803",
    name: "Sandeep Agarwal",
    phone: "+91 98450 99887",
    email: "sandeep@agarwalsteel.in",
    packageInterest: "Goa Beach Getaway",
    travellers: 14,
    budget: "₹ 2,50,000",
    source: "Group Travel Quote",
    created: "22 Sep 2026, 02:15 PM",
    status: "In Discussion",
    notes: "Corporate team outing in October. Requested full private bus arrangement.",
  },
  {
    id: "LD-804",
    name: "Meera Kulkarni",
    phone: "+91 99230 45678",
    email: "meera.kulkarni@gmail.com",
    packageInterest: "Char Dham Yatra",
    travellers: 4,
    budget: "₹ 1,50,000",
    source: "Website Package Form",
    created: "21 Sep 2026, 09:30 AM",
    status: "Converted",
    notes: "Booking confirmed! Deposited token advance of ₹ 30,000. Booking ID: PKG10039.",
  },
  {
    id: "LD-805",
    name: "Vikram Singhania",
    phone: "+91 90040 11223",
    email: "vikram.singh@gmail.com",
    packageInterest: "Himachal Highlights",
    travellers: 2,
    budget: "₹ 45,000",
    source: "Callback Request",
    created: "20 Sep 2026, 06:10 PM",
    status: "Dropped",
    notes: "Postponed vacation plans to next summer.",
  },
];

const INITIAL_TICKETS = [
  {
    id: "TCK-401",
    user: "Abhishek Sharma",
    bookingRef: "#VB-20261015-0042",
    subject: "Request seat change from L5 to U1 for elder passenger",
    category: "Seat Change",
    priority: "High", // High | Medium | Low
    status: "Open", // Open | In Progress | Resolved
    created: "24 Sep 2026, 10:15 AM",
    lastUpdate: "10 mins ago",
    assignedTo: "Support Team A",
    message: "I booked lower sleeper L5 for my mother, but her sister is traveling on upper deck U1. Can we switch seats so they are together?",
  },
  {
    id: "TCK-402",
    user: "Sneha Patil",
    bookingRef: "#VB-20261015-0022",
    subject: "UPI payment debited twice during checkout",
    category: "Payment & Refund",
    priority: "High",
    status: "In Progress",
    created: "24 Sep 2026, 08:30 AM",
    lastUpdate: "1 hour ago",
    assignedTo: "Finance Desk",
    message: "Rs 1,200 was deducted twice from my GPay account. Transaction IDs: UPI90123 & UPI90124. Please refund the extra amount.",
  },
  {
    id: "TCK-403",
    user: "Amit Verma",
    bookingRef: "#VB-20261016-0035",
    subject: "Boarding point clarification at Nagpur Zero Mile",
    category: "Trip Info",
    priority: "Medium",
    status: "Open",
    created: "23 Sep 2026, 05:40 PM",
    lastUpdate: "3 hours ago",
    assignedTo: "Operations Desk",
    message: "Is the pickup point near the metro station or the main highway flyover? Need driver contact number.",
  },
  {
    id: "TCK-404",
    user: "Karan Mehta",
    bookingRef: "#VB-20261017-0019",
    subject: "GST Invoice copy needed for corporate claim",
    category: "Billing",
    priority: "Low",
    status: "Resolved",
    created: "22 Sep 2026, 01:00 PM",
    lastUpdate: "Yesterday",
    assignedTo: "Accounts",
    message: "Sent updated GSTIN invoice via email.",
  },
];

const LEAD_STATUS_BADGES = {
  "New":           { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  "Contacted":     { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  "In Discussion": { bg: "#EDE9FE", color: "#5B21B6", dot: "#7C3AED" },
  "Converted":     { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
  "Dropped":       { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" },
};

const TICKET_STATUS_BADGES = {
  "Open":        { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
  "In Progress": { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  "Resolved":    { bg: "#DCFCE7", color: "#166534", dot: "#16A34A" },
};

const PRIORITY_BADGES = {
  "High":   { bg: "#FEE2E2", color: "#991B1B" },
  "Medium": { bg: "#FEF3C7", color: "#92400E" },
  "Low":    { bg: "#F1F5F9", color: "#475569" },
};

export default function SupportAndLeadsPage() {
  const [activeTab, setActiveTab] = useState("leads"); // 'leads' | 'tickets'
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // for detail slide-over modal

  useEffect(() => {
    adminFetch('/api/admin/support')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data?.tickets || data.tickets;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((t) => ({
            id: `TCK-${t.id.slice(0, 6).toUpperCase()}`,
            realId: t.id,
            user: t.user?.name || "Customer",
            bookingRef: `#VB-${t.id.slice(0, 6).toUpperCase()}`,
            subject: t.subject || "Customer Inquiry",
            category: "General Inquiry",
            priority: "Medium",
            status: t.status === "In_Progress" ? "In Progress" : (t.status || "Open"),
            created: new Date(t.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
            lastUpdate: "Recently",
            assignedTo: "Support Desk",
            message: t.message,
          }));
          setTickets(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.packageInterest.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTickets = tickets.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>Support & Leads</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
            Support & Inquiries
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            Track customer package inquiries, high-value leads and operational support tickets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 3 }}>
          <button
            type="button"
            onClick={() => { setActiveTab("leads"); setSelectedItem(null); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.5rem 1.125rem", borderRadius: 6, border: "none",
              backgroundColor: activeTab === "leads" ? "#B91C1C" : "transparent",
              color: activeTab === "leads" ? "#fff" : "#475569",
              fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", transition: "all 150ms"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>campaign</span>
            Package Leads ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("tickets"); setSelectedItem(null); }}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.5rem 1.125rem", borderRadius: 6, border: "none",
              backgroundColor: activeTab === "tickets" ? "#B91C1C" : "transparent",
              color: activeTab === "tickets" ? "#fff" : "#475569",
              fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", transition: "all 150ms"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>confirmation_number</span>
            Support Tickets ({tickets.length})
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {activeTab === "leads" ? (
          <>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>New Inquiries</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1D4ED8", margin: "0.2rem 0" }}>
                {leads.filter(l => l.status === "New").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#059669", fontWeight: 600 }}>Needs immediate callback</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>In Discussion</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#92400E", margin: "0.2rem 0" }}>
                {leads.filter(l => l.status === "In Discussion" || l.status === "Contacted").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>Follow-up scheduled</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Converted Bookings</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#166534", margin: "0.2rem 0" }}>
                {leads.filter(l => l.status === "Converted").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#16A34A", fontWeight: 600 }}>Total Value: ₹ 1,50,000</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Total Lead Pipeline</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: "0.2rem 0" }}>
                ₹ 7,20,000
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>Across 5 requests</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Open Issues</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#DC2626", margin: "0.2rem 0" }}>
                {tickets.filter(t => t.status === "Open").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#DC2626", fontWeight: 600 }}>Unassigned or pending reply</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>In Progress</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706", margin: "0.2rem 0" }}>
                {tickets.filter(t => t.status === "In Progress").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#64748B" }}>Action taken with customer</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Resolved Tickets</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16A34A", margin: "0.2rem 0" }}>
                {tickets.filter(t => t.status === "Resolved").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#16A34A", fontWeight: 600 }}>Avg resolution: 4.2 hrs</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Urgent / High Priority</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#B91C1C", margin: "0.2rem 0" }}>
                {tickets.filter(t => t.priority === "High" && t.status !== "Resolved").length}
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#DC2626" }}>Requires supervisor attention</div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Table & Detail View */}
      <div style={{ display: "grid", gridTemplateColumns: selectedItem ? "1fr 380px" : "1fr", gap: "1.25rem", alignItems: "flex-start" }}>
        
        {/* Table Box */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #F1F5F9", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          
          {/* Search bar */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#94A3B8" }}>
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={activeTab === "leads" ? "Search by customer name, phone, or package..." : "Search by ticket ID, user or subject..."}
                style={{
                  width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.8125rem",
                  color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none"
                }}
              />
            </div>
          </div>

          {/* Table Data */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", fontSize: "0.6875rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>
                  {activeTab === "leads" ? (
                    <>
                      <th style={{ padding: "0.75rem 1rem" }}>Lead ID & Client</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Package Interest</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Travellers</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Est. Budget</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Actions</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: "0.75rem 1rem" }}>Ticket ID & User</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Subject</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Priority</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Assigned To</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === "leads" ? (
                  filteredLeads.map((l, idx) => {
                    const st = LEAD_STATUS_BADGES[l.status] || LEAD_STATUS_BADGES["New"];
                    return (
                      <tr
                        key={l.id}
                        style={{ borderBottom: idx < filteredLeads.length - 1 ? "1px solid #F8FAFC" : "none" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A" }}>{l.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "#64748B" }}>{l.phone} • #{l.id}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A" }}>{l.packageInterest}</div>
                          <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>via {l.source}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#0F172A", fontWeight: 600 }}>
                          {l.travellers} Adults
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#0F172A", fontWeight: 800 }}>
                          {l.budget}
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.22rem 0.55rem", borderRadius: 4,
                            backgroundColor: st.bg, color: st.color,
                            fontSize: "0.72rem", fontWeight: 600
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: st.dot }} />
                            {l.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedItem({ type: "lead", data: l })}
                            style={{
                              padding: "0.35rem 0.75rem", borderRadius: 6, border: "1px solid #E2E8F0",
                              backgroundColor: "#fff", color: "#475569", fontSize: "0.75rem", fontWeight: 600,
                              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem"
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  filteredTickets.map((t, idx) => {
                    const st = TICKET_STATUS_BADGES[t.status];
                    const pr = PRIORITY_BADGES[t.priority];
                    return (
                      <tr
                        key={t.id}
                        style={{ borderBottom: idx < filteredTickets.length - 1 ? "1px solid #F8FAFC" : "none" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A" }}>{t.user}</div>
                          <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{t.id} • {t.bookingRef}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", maxWidth: 260 }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {t.subject}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#64748B" }}>{t.category}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{
                            padding: "0.2rem 0.5rem", borderRadius: 4,
                            backgroundColor: pr.bg, color: pr.color, fontSize: "0.6875rem", fontWeight: 700
                          }}>
                            {t.priority}
                          </span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>
                          {t.assignedTo}
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.22rem 0.55rem", borderRadius: 4,
                            backgroundColor: st.bg, color: st.color,
                            fontSize: "0.72rem", fontWeight: 600
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: st.dot }} />
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedItem({ type: "ticket", data: t })}
                            style={{
                              padding: "0.35rem 0.75rem", borderRadius: 6, border: "1px solid #E2E8F0",
                              backgroundColor: "#fff", color: "#475569", fontSize: "0.75rem", fontWeight: 600,
                              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem"
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>support_agent</span>
                            Respond
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ── Slide-over Side Panel ── */}
        {selectedItem && (
          <div style={{
            background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "1.25rem",
            position: "sticky", top: 80
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                {selectedItem.type === "lead" ? "Lead Details" : "Ticket Investigation"}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            {selectedItem.type === "lead" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>CLIENT NAME</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>{selectedItem.data.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "#475569", marginTop: 2 }}>{selectedItem.data.phone} • {selectedItem.data.email}</div>
                </div>

                <div style={{ padding: "0.75rem", backgroundColor: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>PACKAGE INTEREST</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#B91C1C", marginTop: 2 }}>{selectedItem.data.packageInterest}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 4 }}>
                    {selectedItem.data.travellers} Travellers &nbsp;|&nbsp; Budget: <strong>{selectedItem.data.budget}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginBottom: "0.25rem" }}>CLIENT NOTES</div>
                  <div style={{ fontSize: "0.78rem", color: "#334155", lineHeight: 1.4, backgroundColor: "#FFFBEB", padding: "0.625rem", borderRadius: 6, border: "1px solid #FEF3C7" }}>
                    {selectedItem.data.notes}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.35rem" }}>UPDATE STATUS</label>
                  <select
                    defaultValue={selectedItem.data.status}
                    style={{
                      width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6,
                      fontSize: "0.8125rem", color: "#0F172A", backgroundColor: "#fff"
                    }}
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>In Discussion</option>
                    <option>Converted</option>
                    <option>Dropped</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <a
                    href={`tel:${selectedItem.data.phone}`}
                    style={{
                      flex: 1, padding: "0.5625rem", backgroundColor: "#059669", color: "#fff",
                      borderRadius: 6, textDecoration: "none", fontSize: "0.78rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>call</span>
                    Call Client
                  </a>
                  <a
                    href={`https://wa.me/${selectedItem.data.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1, padding: "0.5625rem", backgroundColor: "#25D366", color: "#fff",
                      borderRadius: 6, textDecoration: "none", fontSize: "0.78rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chat</span>
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>PASSENGER & BOOKING</div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0F172A" }}>{selectedItem.data.user}</div>
                  <div style={{ fontSize: "0.78rem", color: "#2563EB", fontWeight: 600, marginTop: 2 }}>{selectedItem.data.bookingRef}</div>
                </div>

                <div style={{ padding: "0.75rem", backgroundColor: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>ISSUE DESCRIPTION</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{selectedItem.data.subject}</div>
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "#475569", lineHeight: 1.4 }}>
                    {selectedItem.data.message}
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.35rem" }}>REPLY TO CUSTOMER</label>
                  <textarea
                    rows={3}
                    placeholder="Type official response or internal resolution notes..."
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "0.78rem", resize: "none" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    style={{
                      flex: 1, padding: "0.5625rem", backgroundColor: "#B91C1C", color: "#fff",
                      borderRadius: 6, border: "none", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
                    Send Resolution
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "0.5625rem 0.75rem", backgroundColor: "#F1F5F9", color: "#475569",
                      borderRadius: 6, border: "none", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminShell>
  );
}
