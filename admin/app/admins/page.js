"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

const AVATAR_COLORS = [
  "#2563EB", "#D97706", "#059669", "#DC2626",
  "#0284C7", "#7C3AED", "#EA580C", "#0D9488",
  "#E11D48", "#16A34A"
];

function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AD"
  );
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });

  const [editAdmin, setEditAdmin] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "ADMIN",
    password: "",
  });

  // Current logged in admin info
  const [currentAdminId, setCurrentAdminId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = JSON.parse(localStorage.getItem("admin_user") || "{}");
        if (u.id) setCurrentAdminId(u.id);
      } catch {}
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await adminFetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(data.data || []);
      } else {
        setErrorMsg(data.message || "Failed to fetch admins list.");
      }
    } catch {
      setErrorMsg("Unable to reach backend server. Please verify the service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Flash messages helper
  const notifySuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const notifyError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (admin) => {
    if (admin.role === "SUPER_ADMIN") {
      notifyError("Super Admin accounts cannot be disabled.");
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/admins/${admin.id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins((prev) =>
          prev.map((a) =>
            a.id === admin.id ? { ...a, isActive: !a.isActive } : a
          )
        );
        notifySuccess(data.message || "Admin status updated.");
      } else {
        notifyError(data.message || "Failed to toggle admin status.");
      }
    } catch {
      notifyError("Network error while updating status.");
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (admin) => {
    if (admin.role === "SUPER_ADMIN") {
      notifyError("Super Admin accounts cannot be deleted.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete the admin account for "${admin.name}" (${admin.email})?`
      )
    ) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/admins/${admin.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        notifySuccess("Admin deleted successfully.");
      } else {
        notifyError(data.message || "Failed to delete admin.");
      }
    } catch {
      notifyError("Network error while deleting admin.");
    }
  };

  // Create admin submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.phone || !newAdmin.password) {
      notifyError("Please fill in all required fields.");
      return;
    }
    if (newAdmin.password.length < 6) {
      notifyError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminFetch("/api/admin/admins", {
        method: "POST",
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess("Admin account created successfully!");
        setIsCreateOpen(false);
        setNewAdmin({ name: "", email: "", phone: "", password: "", role: "ADMIN" });
        fetchAdmins();
      } else {
        notifyError(data.message || "Failed to create admin.");
      }
    } catch {
      notifyError("Network error while creating admin.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit admin click & submit
  const handleOpenEdit = (admin) => {
    setEditAdmin({
      id: admin.id,
      name: admin.name || "",
      email: admin.email || "",
      phone: admin.phone || "",
      role: admin.role || "ADMIN",
      password: "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: editAdmin.name,
        email: editAdmin.email,
        phone: editAdmin.phone,
        role: editAdmin.role,
      };
      if (editAdmin.password && editAdmin.password.trim().length >= 6) {
        payload.password = editAdmin.password.trim();
      }

      const res = await adminFetch(`/api/admin/admins/${editAdmin.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifySuccess("Admin updated successfully!");
        setIsEditOpen(false);
        fetchAdmins();
      } else {
        notifyError(data.message || "Failed to update admin.");
      }
    } catch {
      notifyError("Network error while updating admin.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered list
  const filteredAdmins = admins.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.phone && a.phone.toLowerCase().includes(q));

    const matchRole = roleFilter === "All" || a.role === roleFilter;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" ? a.isActive : !a.isActive);

    return matchSearch && matchRole && matchStatus;
  });

  // KPI stats
  const totalCount = admins.length;
  const superCount = admins.filter((a) => a.role === "SUPER_ADMIN").length;
  const standardCount = admins.filter((a) => a.role === "ADMIN").length;
  const activeCount = admins.filter((a) => a.isActive).length;

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
  };

  return (
    <AdminShell noScroll>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem", fontSize: "0.8125rem" }}>
          <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
          <span style={{ color: "#0F172A", fontWeight: 500 }}>Admins Management</span>
        </div>

        {/* Page Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)", fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
                Admins Management
              </h1>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                padding: "2px 8px", borderRadius: 6,
                backgroundColor: "#FEF3C7", color: "#B45309",
                fontSize: "0.6875rem", fontWeight: 700,
                border: "1px solid #FDE68A"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield_person</span>
                Super Admin Only
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "0.25rem", marginBottom: 0 }}>
              Manage administrator accounts, roles, access permissions and security credentials.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={fetchAdmins}
              title="Refresh list"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.5rem 0.75rem", backgroundColor: "#FFFFFF",
                border: "1px solid #CBD5E1", borderRadius: 8,
                fontSize: "0.8125rem", fontWeight: 600, color: "#334155",
                cursor: "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
              Refresh
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                padding: "0.5rem 1rem", backgroundColor: "#B91C1C", color: "#FFFFFF",
                border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 600,
                cursor: "pointer", boxShadow: "0 1px 3px rgba(185, 28, 28, 0.25)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>person_add</span>
              Add New Admin
            </button>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div style={{
            flexShrink: 0,
            backgroundColor: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B",
            padding: "0.625rem 1rem", borderRadius: 8, fontSize: "0.8125rem",
            marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#DC2626" }}>error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            flexShrink: 0,
            backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46",
            padding: "0.625rem 1rem", borderRadius: 8, fontSize: "0.8125rem",
            marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#059669" }}>check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* 4 Metric Summary KPI Cards */}
        <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {[
            { label: "Total Admins", value: totalCount, icon: "manage_accounts", bg: "#EFF6FF", color: "#2563EB" },
            { label: "Super Admins", value: superCount, icon: "military_tech", bg: "#FFFBEB", color: "#D97706" },
            { label: "Operations Staff", value: standardCount, icon: "admin_panel_settings", bg: "#F0FDF4", color: "#059669" },
            { label: "Active Status", value: `${activeCount} / ${totalCount}`, icon: "verified_user", bg: "#FAF5FF", color: "#7C3AED" },
          ].map((c) => (
            <div key={c.label} style={{
              background: "#FFFFFF", borderRadius: 10, padding: "0.75rem 1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                backgroundColor: c.bg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: c.color }}>{c.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 500, marginBottom: "0.1rem" }}>{c.label}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Data Table Card */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
          background: "#FFFFFF", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #F1F5F9", overflow: "hidden"
        }}>
          {/* Top Filter Bar */}
          <div style={{
            flexShrink: 0, padding: "0.75rem 1.25rem 0.625rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
            flexWrap: "wrap", borderBottom: "1px solid #F1F5F9"
          }}>
            {/* Search Input */}
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <span className="material-symbols-outlined" style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                fontSize: 17, color: "#94A3B8", pointerEvents: "none"
              }}>
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search admins by name, email or phone..."
                style={{
                  width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                  border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "0.8125rem",
                  color: "#0F172A", backgroundColor: "#F8FAFC", outline: "none"
                }}
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "0.45rem 0.75rem", border: "1px solid #CBD5E1",
                borderRadius: 8, fontSize: "0.8125rem", color: "#334155",
                backgroundColor: "#FFFFFF", cursor: "pointer", outline: "none"
              }}
            >
              <option value="All">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.45rem 0.75rem", border: "1px solid #CBD5E1",
                borderRadius: 8, fontSize: "0.8125rem", color: "#334155",
                backgroundColor: "#FFFFFF", cursor: "pointer", outline: "none"
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>

            {/* Clear Filters */}
            {(search || roleFilter !== "All" || statusFilter !== "All") && (
              <button
                onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.45rem 0.75rem", border: "1px solid #E2E8F0",
                  borderRadius: 8, backgroundColor: "#FFFFFF", color: "#64748B",
                  fontSize: "0.8125rem", cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                Clear
              </button>
            )}
          </div>

          {/* Table Container */}
          <div style={{ flex: 1, minHeight: 0, overflowX: "auto", overflowY: "auto", position: "relative" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr>
                  <th style={TH}>Admin</th>
                  <th style={TH}>Email Address</th>
                  <th style={TH}>Role</th>
                  <th style={TH}>Account Status</th>
                  <th style={TH}>Created Date</th>
                  <th style={{ ...TH, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "3rem 1rem", textAlign: "center", color: "#94A3B8" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 32, display: "block", marginBottom: "0.5rem" }}>hourglass_top</span>
                      Loading administrators list...
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "3rem 1rem", textAlign: "center", color: "#64748B" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#CBD5E1", display: "block", marginBottom: "0.5rem" }}>shield_person</span>
                      No administrators found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, idx) => {
                    const avatarBg = getAvatarColor(admin.id || admin.email);
                    const isSuper = admin.role === "SUPER_ADMIN";
                    const isSelf = currentAdminId && currentAdminId === admin.id;

                    return (
                      <tr
                        key={admin.id}
                        style={{ borderBottom: idx < filteredAdmins.length - 1 ? "1px solid #F1F5F9" : "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {/* Admin Name & Phone */}
                        <td style={{ padding: "0.875rem 0.875rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              backgroundColor: `${avatarBg}15`, border: `1.5px solid ${avatarBg}30`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "0.75rem", fontWeight: 700, color: avatarBg, flexShrink: 0
                            }}>
                              {getInitials(admin.name)}
                            </div>
                            <div>
                              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0F172A", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                {admin.name}
                                {isSelf && (
                                  <span style={{ fontSize: "0.625rem", padding: "1px 5px", borderRadius: 4, backgroundColor: "#E2E8F0", color: "#475569" }}>
                                    You
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                                {admin.phone || "No phone registered"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.8125rem", color: "#334155" }}>
                          {admin.email}
                        </td>

                        {/* Role Badge */}
                        <td style={{ padding: "0.875rem 0.875rem" }}>
                          {isSuper ? (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "0.3rem",
                              padding: "0.25rem 0.625rem", borderRadius: 6,
                              backgroundColor: "#FEF3C7", color: "#B45309",
                              fontSize: "0.72rem", fontWeight: 700,
                              border: "1px solid #FDE68A",
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>military_tech</span>
                              Super Admin
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "0.3rem",
                              padding: "0.25rem 0.625rem", borderRadius: 6,
                              backgroundColor: "#EFF6FF", color: "#1D4ED8",
                              fontSize: "0.72rem", fontWeight: 600,
                              border: "1px solid #DBEAFE",
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>badge</span>
                              Admin
                            </span>
                          )}
                        </td>

                        {/* Status & Toggle Switch */}
                        <td style={{ padding: "0.875rem 0.875rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {/* Toggle button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(admin)}
                              disabled={isSuper}
                              title={isSuper ? "Super Admin status cannot be toggled" : (admin.isActive ? "Click to disable account" : "Click to activate account")}
                              style={{
                                width: 38,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: isSuper ? "#CBD5E1" : (admin.isActive ? "#16A34A" : "#CBD5E1"),
                                border: "none",
                                cursor: isSuper ? "not-allowed" : "pointer",
                                position: "relative",
                                padding: 2,
                                transition: "background-color 200ms ease",
                                opacity: isSuper ? 0.7 : 1,
                              }}
                            >
                              <div style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: "#FFFFFF",
                                position: "absolute",
                                top: 2,
                                left: admin.isActive && !isSuper ? 20 : (isSuper ? 20 : 2),
                                transition: "left 200ms ease",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                              }} />
                            </button>

                            <span style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: admin.isActive ? "#16A34A" : "#DC2626",
                            }}>
                              {admin.isActive ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td style={{ padding: "0.875rem 0.875rem", fontSize: "0.8125rem", color: "#64748B" }}>
                          {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Action Buttons: Edit, Delete */}
                        <td style={{ padding: "0.875rem 0.875rem" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(admin)}
                              title="Edit Admin details"
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                padding: "0.3rem 0.6rem", borderRadius: 6,
                                border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF",
                                color: "#334155", fontSize: "0.75rem", fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#2563EB" }}>edit</span>
                              Edit
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
                              disabled={isSuper}
                              title={isSuper ? "Super Admin accounts cannot be deleted" : "Delete Admin account"}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                padding: "0.3rem 0.6rem", borderRadius: 6,
                                border: isSuper ? "1px solid #E2E8F0" : "1px solid #FCA5A5",
                                backgroundColor: isSuper ? "#F8FAFC" : "#FEF2F2",
                                color: isSuper ? "#94A3B8" : "#DC2626",
                                fontSize: "0.75rem", fontWeight: 600,
                                cursor: isSuper ? "not-allowed" : "pointer",
                                opacity: isSuper ? 0.6 : 1,
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          <div style={{
            flexShrink: 0, padding: "0.75rem 1.25rem",
            backgroundColor: "#FFFFFF", borderTop: "1px solid #F1F5F9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: "0.8125rem", color: "#64748B"
          }}>
            <span>Showing {filteredAdmins.length} of {admins.length} administrator accounts</span>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Enterprise Auth &bull; Admin Table</span>
          </div>
        </div>
      </div>

      {/* ── CREATE ADMIN MODAL ────────────────────────────────────── */}
      {isCreateOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            width: "100%", maxWidth: 460, backgroundColor: "#FFFFFF",
            borderRadius: 14, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1rem 1.25rem", borderBottom: "1px solid #E2E8F0",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#B91C1C" }}>person_add</span>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Add New Administrator</h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@VedantaBus.in"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91-8208024895"
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Password * (Min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Role Assignment *
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", backgroundColor: "#FFFFFF",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="ADMIN">Admin (Standard Dashboard & Operations)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access + Admins Panel)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{
                    padding: "0.5rem 1rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, backgroundColor: "#FFFFFF", color: "#475569",
                    fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "0.5rem 1.25rem", border: "none",
                    borderRadius: 8, backgroundColor: "#B91C1C", color: "#FFFFFF",
                    fontSize: "0.8125rem", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "0.35rem"
                  }}
                >
                  {submitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT ADMIN MODAL ──────────────────────────────────────── */}
      {isEditOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            width: "100%", maxWidth: 460, backgroundColor: "#FFFFFF",
            borderRadius: 14, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            overflow: "hidden"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1rem 1.25rem", borderBottom: "1px solid #E2E8F0",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#2563EB" }}>edit</span>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>Edit Administrator</h2>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editAdmin.name}
                  onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editAdmin.email}
                  onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editAdmin.phone}
                  onChange={(e) => setEditAdmin({ ...editAdmin, phone: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Role Assignment
                </label>
                <select
                  value={editAdmin.role}
                  onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", backgroundColor: "#FFFFFF",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="ADMIN">Admin (Standard Dashboard & Operations)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access + Admins Panel)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Reset Password (Leave blank to keep existing)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editAdmin.password}
                  onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
                  style={{
                    width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  style={{
                    padding: "0.5rem 1rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, backgroundColor: "#FFFFFF", color: "#475569",
                    fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "0.5rem 1.25rem", border: "none",
                    borderRadius: 8, backgroundColor: "#2563EB", color: "#FFFFFF",
                    fontSize: "0.8125rem", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "0.35rem"
                  }}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
