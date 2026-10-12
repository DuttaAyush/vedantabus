"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/layout/AdminShell";
import { adminFetch } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "admins"
  const [currentUser, setCurrentUser] = useState(null);

  // Profile Form state
  const [displayName, setDisplayName] = useState("Super Admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  // Add Admin Modal / Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPhone, setNewAdminPhone] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("ADMIN");
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("admin_user");
        if (stored) {
          const u = JSON.parse(stored);
          setCurrentUser(u);
          if (u.name) setDisplayName(u.name);
        }
      } catch {}
    }
  }, []);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    setAdminError("");
    try {
      const res = await adminFetch("/api/admin/admins");
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(data.data || []);
      } else {
        setAdminError(data.message || "Failed to load admin team list.");
      }
    } catch {
      setAdminError("Could not connect to admin service.");
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") {
      loadAdmins();
    }
  }, [activeTab]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setProfileMsg("New passwords do not match.");
      return;
    }
    if (currentUser) {
      const updated = { ...currentUser, name: displayName };
      localStorage.setItem("admin_user", JSON.stringify(updated));
      setCurrentUser(updated);
    }
    setSaved(true);
    setProfileMsg("Settings saved successfully!");
    setTimeout(() => {
      setSaved(false);
      setProfileMsg("");
    }, 3000);
  };

  const handleToggleAdminStatus = async (adminId) => {
    try {
      const res = await adminFetch(`/api/admin/admins/${adminId}/toggle`, {
        method: "PATCH"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(prev =>
          prev.map(a => (a.id === adminId ? { ...a, isActive: !a.isActive } : a))
        );
        setAdminSuccess(data.message || "Status updated successfully.");
        setTimeout(() => setAdminSuccess(""), 3000);
      } else {
        setAdminError(data.message || "Failed to update admin status.");
        setTimeout(() => setAdminError(""), 4000);
      }
    } catch {
      setAdminError("Network error while updating admin status.");
      setTimeout(() => setAdminError(""), 4000);
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to permanently delete admin account "${adminName}"?`)) {
      return;
    }
    try {
      const res = await adminFetch(`/api/admin/admins/${adminId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(prev => prev.filter(a => a.id !== adminId));
        setAdminSuccess(`Admin account "${adminName}" removed.`);
        setTimeout(() => setAdminSuccess(""), 3000);
      } else {
        setAdminError(data.message || "Failed to delete admin account.");
        setTimeout(() => setAdminError(""), 4000);
      }
    } catch {
      setAdminError("Network error while deleting admin.");
      setTimeout(() => setAdminError(""), 4000);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    setAdminError("");

    try {
      const res = await adminFetch("/api/admin/admins", {
        method: "POST",
        body: JSON.stringify({
          name: newAdminName.trim(),
          email: newAdminEmail.trim().toLowerCase(),
          phone: newAdminPhone.trim(),
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAdminSuccess("New administrator created successfully!");
        setShowAddModal(false);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPhone("");
        setNewAdminPassword("");
        setNewAdminRole("ADMIN");
        loadAdmins();
        setTimeout(() => setAdminSuccess(""), 3500);
      } else {
        setAdminError(data.message || "Failed to create admin account.");
      }
    } catch {
      setAdminError("Network error while creating admin.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return (
    <AdminShell>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem", fontSize: "0.8125rem" }}>
        <Link href="/dashboard" style={{ color: "#64748B", textDecoration: "none" }}>Dashboard</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#94A3B8" }}>chevron_right</span>
        <span style={{ color: "#0F172A", fontWeight: 500 }}>Settings</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <h1 style={{ fontFamily: "var(--font-playfair, 'Playfair Display')", fontSize: "1.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2, margin: 0 }}>
              Account & System Settings
            </h1>
            {isSuperAdmin && (
              <span style={{
                backgroundColor: "#FEF3C7",
                color: "#92400E",
                border: "1px solid #FCD34D",
                padding: "0.2rem 0.6rem",
                borderRadius: 9999,
                fontSize: "0.6875rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 4
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#D97706" }}>verified_user</span>
                Super Admin Access
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.875rem", color: "#64748B", marginTop: "0.375rem" }}>
            Manage your personal profile, credentials, and administrator role privileges.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          backgroundColor: "#F1F5F9",
          padding: 4,
          borderRadius: 10,
          border: "1px solid #E2E8F0"
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "0.45rem 1rem",
              borderRadius: 7,
              border: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "profile" ? "#FFFFFF" : "transparent",
              color: activeTab === "profile" ? "#0F172A" : "#64748B",
              boxShadow: activeTab === "profile" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all 150ms",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>manage_accounts</span>
            Profile & Security
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admins")}
            style={{
              padding: "0.45rem 1rem",
              borderRadius: 7,
              border: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: activeTab === "admins" ? "#FFFFFF" : "transparent",
              color: activeTab === "admins" ? "#B91C1C" : "#64748B",
              boxShadow: activeTab === "admins" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all 150ms",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17, color: activeTab === "admins" ? "#B91C1C" : "inherit" }}>
              admin_panel_settings
            </span>
            Admin Team & Roles
            {isSuperAdmin && (
              <span style={{
                backgroundColor: "#FDE68A",
                color: "#78350F",
                fontSize: "0.625rem",
                fontWeight: 800,
                padding: "1px 5px",
                borderRadius: 4,
                marginLeft: 2,
              }}>
                SUPER
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {adminSuccess && (
        <div style={{
          backgroundColor: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#166534",
          padding: "0.75rem 1rem",
          borderRadius: 8,
          fontSize: "0.8125rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#16A34A" }}>check_circle</span>
          <span>{adminSuccess}</span>
        </div>
      )}

      {adminError && (
        <div style={{
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#991B1B",
          padding: "0.75rem 1rem",
          borderRadius: 8,
          fontSize: "0.8125rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#DC2626" }}>error</span>
          <span>{adminError}</span>
        </div>
      )}

      {/* TAB 1: PROFILE & SECURITY */}
      {activeTab === "profile" && (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            padding: "2rem",
          }}>
            <form onSubmit={handleSaveProfile}>
              {/* Profile Section */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    backgroundColor: isSuperAdmin ? "#FEF3C7" : "#FEF2F2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: isSuperAdmin ? "#D97706" : "#B91C1C" }}>
                      {isSuperAdmin ? "shield_person" : "person"}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                      Admin Profile & Privileges
                    </h3>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      Current Role: <strong>{isSuperAdmin ? "Super Administrator (Full Privileges)" : "Staff Administrator"}</strong>
                    </div>
                  </div>
                </div>

                {/* Display Name Input */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                    Display Name <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#94A3B8", pointerEvents: "none"
                    }}>
                      badge
                    </span>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      required
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
                        border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "0.875rem",
                        color: "#0F172A", outline: "none", boxSizing: "border-box",
                        transition: "border-color 150ms"
                      }}
                      onFocus={e => e.target.style.borderColor = "#B91C1C"}
                      onBlur={e => e.target.style.borderColor = "#CBD5E1"}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#94A3B8", pointerEvents: "none"
                    }}>
                      mail_outline
                    </span>
                    <input
                      type="email"
                      value={currentUser?.email || "admin@VedantaBus.in"}
                      disabled
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.875rem",
                        color: "#64748B", backgroundColor: "#F8FAFC", cursor: "not-allowed",
                        outline: "none", boxSizing: "border-box"
                      }}
                    />
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#64748B", pointerEvents: "none"
                    }}>
                      lock_outline
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "0.35rem" }}>
                    Primary authentication email for this account.
                  </div>
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: "#F1F5F9", margin: "2rem 0" }} />

              {/* Change Password Section */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    backgroundColor: "#FEF2F2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#B91C1C" }}>lock</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Change Password</h3>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Update your password to keep your account secure.</div>
                  </div>
                </div>

                {/* Current Password */}
                <div style={{ marginBottom: "1.125rem" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                    Current Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#94A3B8", pointerEvents: "none"
                    }}>
                      lock_outline
                    </span>
                    <input
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "0.875rem",
                        color: "#0F172A", outline: "none", boxSizing: "border-box"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94A3B8",
                        display: "flex", padding: 4
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {showCurrent ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div style={{ marginBottom: "1.125rem" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#94A3B8", pointerEvents: "none"
                    }}>
                      lock_outline
                    </span>
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password (min. 6 characters)"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "0.875rem",
                        color: "#0F172A", outline: "none", boxSizing: "border-box"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94A3B8",
                        display: "flex", padding: 4
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {showNew ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span className="material-symbols-outlined" style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      fontSize: 18, color: "#94A3B8", pointerEvents: "none"
                    }}>
                      lock_outline
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        width: "100%", paddingLeft: 38, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                        border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "0.875rem",
                        color: "#0F172A", outline: "none", boxSizing: "border-box"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{
                        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94A3B8",
                        display: "flex", padding: 4
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {showConfirm ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {profileMsg && (
                <div style={{
                  marginBottom: "1rem",
                  fontSize: "0.8125rem",
                  color: saved ? "#166534" : "#991B1B",
                  fontWeight: 600,
                  textAlign: "center"
                }}>
                  {profileMsg}
                </div>
              )}

              {/* Save Changes Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "none",
                  borderRadius: 8,
                  backgroundColor: saved ? "#16A34A" : "#B91C1C",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 2px 4px rgba(185, 28, 28, 0.2)",
                  transition: "background-color 200ms ease"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  {saved ? "check" : "save"}
                </span>
                {saved ? "Settings Saved!" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN TEAM & ROLES (SUPER ADMIN) */}
      {activeTab === "admins" && (
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Banner for Super Admin */}
          <div style={{
            backgroundColor: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                backgroundColor: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#D97706",
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shield</span>
              </div>
              <div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#92400E" }}>
                  Super Admin Management Panel
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#B45309", marginTop: 2 }}>
                  Create, configure, enable, or disable administrator accounts across the system.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: "#B91C1C",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "0.55rem 1rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 2px 4px rgba(185, 28, 28, 0.2)",
                transition: "background-color 150ms"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#991B1B"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#B91C1C"}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
              <span>Add New Admin</span>
            </button>
          </div>

          {/* Admin Table Card */}
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>
                  System Administrators ({admins.length})
                </h3>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
                  Accounts with administrative access to management APIs and dashboard.
                </div>
              </div>

              <button
                type="button"
                onClick={loadAdmins}
                title="Refresh Admin List"
                style={{
                  background: "none",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  padding: "0.35rem 0.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.75rem",
                  color: "#475569"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                <span>Refresh</span>
              </button>
            </div>

            {loadingAdmins ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: "#B91C1C", marginBottom: 8, display: "block" }}>
                  progress_activity
                </span>
                <span style={{ fontSize: "0.875rem" }}>Loading admin accounts...</span>
              </div>
            ) : admins.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#94A3B8", marginBottom: 8, display: "block" }}>
                  group_off
                </span>
                <p style={{ margin: 0, fontSize: "0.875rem" }}>No administrator accounts found.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "0.75rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Administrator</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Phone</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Role</th>
                      <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Status</th>
                      <th style={{ padding: "0.75rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((adm) => {
                      const isSuper = adm.role === "SUPER_ADMIN";
                      return (
                        <tr key={adm.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          {/* Admin Details */}
                          <td style={{ padding: "0.875rem 1.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                backgroundColor: isSuper ? "#FEF3C7" : "#EFF6FF",
                                border: `1.5px solid ${isSuper ? "#FCD34D" : "#BFDBFE"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: isSuper ? "#D97706" : "#2563EB" }}>
                                  {isSuper ? "shield_person" : "person"}
                                </span>
                              </div>
                              <div>
                                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                                  {adm.name}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: 2 }}>
                                  {adm.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td style={{ padding: "0.875rem 1rem", fontSize: "0.8125rem", color: "#475569" }}>
                            {adm.phone || "—"}
                          </td>

                          {/* Role Badge */}
                          <td style={{ padding: "0.875rem 1rem" }}>
                            {isSuper ? (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 3,
                                backgroundColor: "#FEF3C7", color: "#92400E",
                                padding: "0.2rem 0.55rem", borderRadius: 6,
                                fontSize: "0.7rem", fontWeight: 700, border: "1px solid #FCD34D"
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#D97706" }}>star</span>
                                SUPER ADMIN
                              </span>
                            ) : (
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 3,
                                backgroundColor: "#EFF6FF", color: "#1E40AF",
                                padding: "0.2rem 0.55rem", borderRadius: 6,
                                fontSize: "0.7rem", fontWeight: 700, border: "1px solid #BFDBFE"
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>shield</span>
                                ADMIN
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td style={{ padding: "0.875rem 1rem" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              backgroundColor: adm.isActive ? "#DCFCE7" : "#FEE2E2",
                              color: adm.isActive ? "#166534" : "#991B1B",
                              padding: "0.2rem 0.55rem", borderRadius: 6,
                              fontSize: "0.75rem", fontWeight: 600
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                                {adm.isActive ? "check_circle" : "cancel"}
                              </span>
                              {adm.isActive ? "Active" : "Disabled"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "0.875rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                              {/* Toggle Active Switch */}
                              {!isSuper && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAdminStatus(adm.id)}
                                  title={adm.isActive ? "Disable this admin account" : "Enable this admin account"}
                                  style={{
                                    backgroundColor: adm.isActive ? "#FEE2E2" : "#DCFCE7",
                                    color: adm.isActive ? "#991B1B" : "#166534",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "0.3rem 0.6rem",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                    {adm.isActive ? "block" : "check"}
                                  </span>
                                  <span>{adm.isActive ? "Disable" : "Enable"}</span>
                                </button>
                              )}

                              {/* Delete Button (Super Admins cannot be deleted) */}
                              {!isSuper ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                                  title="Delete Admin Account"
                                  style={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #FECACA",
                                    color: "#DC2626",
                                    borderRadius: 6,
                                    padding: "0.3rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                </button>
                              ) : (
                                <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontStyle: "italic", padding: "0 0.5rem" }}>
                                  Root Super Admin
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ADMIN */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(2px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1rem",
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#B91C1C" }}>person_add</span>
                <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#0F172A" }}>
                  Create Administrator Account
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Full Name <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newAdminName}
                    onChange={e => setNewAdminName(e.target.value)}
                    style={{
                      width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #CBD5E1",
                      borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Email Address <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@VedantaBus.in"
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #CBD5E1",
                      borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Phone Number <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91-8208024895"
                    value={newAdminPhone}
                    onChange={e => setNewAdminPhone(e.target.value)}
                    style={{
                      width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #CBD5E1",
                      borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Temporary Password <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
                    style={{
                      width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #CBD5E1",
                      borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Account Role <span style={{ color: "#B91C1C" }}>*</span>
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={e => setNewAdminRole(e.target.value)}
                    style={{
                      width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #CBD5E1",
                      borderRadius: 8, fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
                      backgroundColor: "#fff"
                    }}
                  >
                    <option value="ADMIN">Staff Admin (Fleet, Bookings, Support)</option>
                    <option value="SUPER_ADMIN">Super Admin (All Privileges + Admin Management)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "0.6rem 1rem", border: "1px solid #CBD5E1",
                    borderRadius: 8, backgroundColor: "#fff", color: "#475569",
                    fontSize: "0.875rem", fontWeight: 600, cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingAdmin}
                  style={{
                    padding: "0.6rem 1.25rem", border: "none",
                    borderRadius: 8, backgroundColor: "#B91C1C", color: "#fff",
                    fontSize: "0.875rem", fontWeight: 700, cursor: addingAdmin ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}
                >
                  {addingAdmin ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
