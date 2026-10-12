"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const USERS = [
  { id: "U10023", name: "Rahul Sharma",    email: "rahul.sharma@gmail.com",  phone: "+91-8208024895", registered: "12 Jan 2025", bookings: 14, status: "Active",  color: "#4F46E5" },
  { id: "U10024", name: "Sneha Patel",     email: "sneha.patel@gmail.com",   phone: "+91 87654 32109", registered: "08 Jan 2025", bookings: 8,  status: "Active",  color: "#D97706" },
  { id: "U10025", name: "Amit Verma",      email: "amit.verma@outlook.com",  phone: "+91 76543 21098", registered: "05 Jan 2025", bookings: 3,  status: "Blocked", color: "#059669" },
  { id: "U10026", name: "Priya Deshmukh",  email: "priya.d@email.com",       phone: "+91 99887 77665", registered: "03 Jan 2025", bookings: 12, status: "Active",  color: "#7C3AED" },
  { id: "U10027", name: "Vikram Singh",    email: "vikram.singh@gmail.com",  phone: "+91 91234 56789", registered: "28 Dec 2024", bookings: 6,  status: "Active",  color: "#B91C1C" },
  { id: "U10028", name: "Neha Gupta",      email: "neha.gupta@icloud.com",   phone: "+91 88776 65544", registered: "22 Dec 2024", bookings: 9,  status: "Blocked", color: "#0D9488" },
  { id: "U10029", name: "Arjun Mehta",     email: "arjun.mehta@gmail.com",   phone: "+91 77665 44332", registered: "18 Dec 2024", bookings: 2,  status: "Active",  color: "#EA580C" },
  { id: "U10030", name: "Kavya Nair",      email: "kavya.nair@email.com",    phone: "+91 99876 55443", registered: "12 Dec 2024", bookings: 5,  status: "Active",  color: "#DB2777" },
  { id: "U10031", name: "Rohit Kulkarni",  email: "rohit.k@outlook.com",     phone: "+91 96655 44321", registered: "07 Dec 2024", bookings: 11, status: "Active",  color: "#2563EB" },
  { id: "U10032", name: "Ananya Reddy",    email: "ananya.reddy@gmail.com",  phone: "+91 95544 33321", registered: "01 Dec 2024", bookings: 4,  status: "Blocked", color: "#9333EA" },
  { id: "U10033", name: "Suresh Joshi",    email: "suresh.joshi@gmail.com",  phone: "+91 94433 22110", registered: "28 Nov 2024", bookings: 7,  status: "Active",  color: "#4F46E5" },
  { id: "U10034", name: "Pooja Hegde",     email: "pooja.hegde@yahoo.com",   phone: "+91 93322 11009", registered: "24 Nov 2024", bookings: 15, status: "Active",  color: "#D97706" },
  { id: "U10035", name: "Manoj Tiwari",    email: "manoj.tiwari@gmail.com",  phone: "+91 92211 00998", registered: "19 Nov 2024", bookings: 1,  status: "Blocked", color: "#059669" },
  { id: "U10036", name: "Deepika Padukone",email: "deepika.p@gmail.com",     phone: "+91 91100 99887", registered: "14 Nov 2024", bookings: 19, status: "Active",  color: "#7C3AED" },
  { id: "U10037", name: "Kunal Kapoor",    email: "kunal.kapoor@gmail.com",  phone: "+91 90099 88776", registered: "09 Nov 2024", bookings: 5,  status: "Active",  color: "#B91C1C" },
  { id: "U10038", name: "Ritu Saxena",     email: "ritu.saxena@outlook.com", phone: "+91 89988 77665", registered: "04 Nov 2024", bookings: 8,  status: "Active",  color: "#0D9488" },
  { id: "U10039", name: "Aditya Roy",      email: "aditya.roy@gmail.com",    phone: "+91 88877 66554", registered: "30 Oct 2024", bookings: 2,  status: "Blocked", color: "#EA580C" },
  { id: "U10040", name: "Shruti Haasan",   email: "shruti.h@gmail.com",      phone: "+91 87766 55443", registered: "25 Oct 2024", bookings: 10, status: "Active",  color: "#DB2777" },
  { id: "U10041", name: "Devendra Fadnavis", email: "devendra.f@gov.in",     phone: "+91 86655 44332", registered: "20 Oct 2024", bookings: 16, status: "Active",  color: "#2563EB" },
  { id: "U10042", name: "Tanvi Shah",      email: "tanvi.shah@gmail.com",    phone: "+91 85544 33221", registered: "15 Oct 2024", bookings: 3,  status: "Active",  color: "#9333EA" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ name, color }) {
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
      backgroundColor: color + "18",
      border: `1.5px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color }}>{initials}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      padding: "0.25rem 0.625rem", borderRadius: 5,
      backgroundColor: active ? "#DCFCE7" : "#FEE2E2",
      color: active ? "#166534" : "#991B1B",
      fontSize: "0.75rem", fontWeight: 600,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
        {active ? "check_circle" : "block"}
      </span>
      {status}
    </span>
  );
}

function IconBtn({ icon, title, onClick, hoverColor = "#F1F5F9" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "none", border: "1px solid #E2E8F0",
        borderRadius: 6, cursor: "pointer", padding: "0.3rem",
        color: "#94A3B8", display: "flex", alignItems: "center",
        transition: "all 150ms",
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = hoverColor; e.currentTarget.style.color = "#475569"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94A3B8"; }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{icon}</span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState(USERS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    const action = user.status === "Active" ? "block" : "unblock";
    try {
      await adminFetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
    } catch {}
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) return;
    try {
      await adminFetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
    } catch {}
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  useEffect(() => {
    adminFetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data?.users || data.users;
        if (Array.isArray(list) && list.length > 0) {
          const colors = ["#4F46E5", "#D97706", "#059669", "#7C3AED", "#B91C1C", "#0D9488", "#EA580C", "#DB2777"];
          const mapped = list.map((u, i) => ({
            id: u.id,
            displayId: u.id.length > 8 ? u.id.slice(0, 8).toUpperCase() : u.id,
            name: u.name || "Customer",
            email: u.email,
            phone: u.phone || "+91-8208024895",
            registered: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
            bookings: u._count?.bookings || (Array.isArray(u.bookings) ? u.bookings.length : 0),
            status: u.status === "ACTIVE" ? "Active" : u.status === "BLOCKED" ? "Blocked" : (u.status || "Active"),
            color: colors[i % colors.length]
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleFilterChange = (key) => {
    setFilter(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const filtered = users.filter((u) => {
    const matchFilter = filter === "All" || u.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paginatedUsers = filtered.slice(startIndex, endIndex);

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

  const toggleAll = () => {
    if (selected.length === paginatedUsers.length && paginatedUsers.length > 0) setSelected([]);
    else setSelected(paginatedUsers.map((u) => u.id));
  };
  const toggleOne = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const activeCount = users.filter(u => u.status === "Active").length;
  const blockedCount = users.filter(u => u.status === "Blocked").length;
  const userStats = [
    { label: "Total Users",            value: users.length.toLocaleString(), icon: "group",      bg: "#EEF2FF", color: "#4F46E5" },
    { label: "Active Users",           value: activeCount.toLocaleString(),  icon: "person",     bg: "#ECFDF5", color: "#059669", change: "+5.2%",  comp: "vs last month" },
    { label: "Blocked Users",          value: blockedCount.toLocaleString(), icon: "person_off", bg: "#FEF2F2", color: "#DC2626" },
    { label: "New Users (This Month)", value: Math.max(1, Math.round(users.length * 0.2)).toLocaleString(), icon: "person_add", bg: "#F5F3FF", color: "#7C3AED", change: "+12.6%", comp: "vs last month" },
  ];

  const FILTERS = [
    { label: `All (${users.length})`,       key: "All" },
    { label: `Active (${activeCount})`,    key: "Active" },
    { label: `Blocked (${blockedCount})`,  key: "Blocked" },
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

  return (
    <AdminShell noScroll>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
          <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
          <span style={{ color: "#0F172A", fontWeight: 500 }}>Users</span>
        </div>

        {/* Header row */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
              User Management
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "0.25rem", marginBotom: 0 }}>
              Manage registered users, view details, and control access.
            </p>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#B91C1C", color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>add</span>
            Add User
          </button>
        </div>

        {/* Stats Row — Static KPI Header */}
        <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {userStats.map((s) => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 10,
              padding: "0.875rem 1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              border: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                backgroundColor: s.bg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "1.375rem", fontWeight: 700, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "0.2rem" }}>{s.label}</div>
                {s.change && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", marginTop: "0.2rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 11, color: "#16A34A" }}>arrow_upward</span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16A34A" }}>{s.change}</span>
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
          <div style={{ flexShrink: 0, padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #F1F5F9", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: 240, maxWidth: 380 }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "#94A3B8", pointerEvents: "none" }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, email or phone..."
              style={{
                width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: "1px solid #E2E8F0", borderRadius: 8,
                fontSize: "0.8125rem", color: "#0F172A",
                backgroundColor: "#F8FAFC", outline: "none",
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                style={{
                  padding: "0.4375rem 1rem",
                  borderRadius: 20,
                  border: filter === f.key ? "none" : "1px solid #E2E8F0",
                  backgroundColor: filter === f.key ? "#B91C1C" : "#fff",
                  color: filter === f.key ? "#fff" : "#475569",
                  fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                  transition: "all 150ms",
                  whiteSpace: "nowrap",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: "auto" }}>
            <select style={{
              padding: "0.4375rem 0.75rem",
              border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: "0.8125rem", color: "#475569",
              backgroundColor: "#fff", cursor: "pointer", outline: "none",
            }}>
              <option>Sort by: Latest</option>
              <option>Sort by: Oldest</option>
              <option>Sort by: Name A-Z</option>
              <option>Sort by: Most Bookings</option>
            </select>
          </div>
        </div>

        {/* Scrollable Data Table Container — ONLY this component scrolls */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "auto",
          position: "relative",
          WebkitOverflowScrolling: "touch",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ ...TH, width: 44, paddingRight: 0 }}>
                  <input
                    type="checkbox"
                    checked={selected.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: "#B91C1C", width: 15, height: 15 }}
                  />
                </th>
                <th style={TH}>User</th>
                <th style={TH}>Email</th>
                <th style={TH}>Phone</th>
                <th style={TH}>Registered On</th>
                <th style={TH}>Total Bookings</th>
                <th style={TH}>Status</th>
                <th style={{ ...TH, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "3rem 1rem", textAlign: "center", color: "#94A3B8" }}>
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => {
                  const isSelected = selected.includes(u.id);
                  return (
                    <tr
                      key={`${u.id}-${idx}`}
                      style={{
                        borderBottom: idx < paginatedUsers.length - 1 ? "1px solid #F8FAFC" : "none",
                        backgroundColor: isSelected ? "#FEF2F2" : "transparent",
                        transition: "background-color 100ms",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "#FAFAFA"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "0.875rem 0.5rem 0.875rem 1rem", width: 44 }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(u.id)}
                          style={{ cursor: "pointer", accentColor: "#B91C1C", width: 15, height: 15 }}
                        />
                      </td>

                      {/* User */}
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Link href={`/users/${u.id}`} style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
                          <Avatar name={u.name} color={u.color} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0F172A", transition: "color 150ms" }}
                              onMouseEnter={e => e.currentTarget.style.color = "#B91C1C"}
                              onMouseLeave={e => e.currentTarget.style.color = "#0F172A"}
                            >
                              {u.name}
                            </div>
                            {/* <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: 1 }}>#{u.id}</div> */}
                          </div>
                        </Link>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>
                        <Link href={`/users/${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          {u.email}
                        </Link>
                      </td>

                      {/* Phone */}
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "#475569", whiteSpace: "nowrap" }}>
                        <Link href={`/users/${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          {u.phone}
                        </Link>
                      </td>

                      {/* Registered */}
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "#64748B", whiteSpace: "nowrap" }}>{u.registered}</td>

                      {/* Bookings */}
                      <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 600, color: "#0F172A", textAlign: "center" }}>{u.bookings}</td>

                      {/* Status */}
                      <td style={{ padding: "0.75rem 1rem" }}><StatusBadge status={u.status} /></td>

                      {/* Actions */}
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                          <Link href={`/users/${u.id}`} style={{ textDecoration: "none" }}>
                            <IconBtn icon="visibility" title="View user details" />
                          </Link>
                          <IconBtn
                            icon={u.status === "Active" ? "block" : "check_circle"}
                            title={u.status === "Active" ? "Block user" : "Unblock user"}
                            onClick={() => handleToggleUserStatus(u)}
                            hoverColor="#FEF2F2"
                          />
                          <IconBtn
                            icon="delete"
                            title="Delete user"
                            onClick={() => handleDeleteUser(u)}
                            hoverColor="#FEF2F2"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          flexShrink: 0,
          padding: "0.75rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid #F1F5F9",
          flexWrap: "wrap", gap: "0.75rem",
          backgroundColor: "#fff",
        }}>
          <span style={{ fontSize: "0.8125rem", color: "#64748B" }}>
            Showing {filtered.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filtered.length} users
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {/* Prev */}
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

            {/* Next */}
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
