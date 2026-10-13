"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/api";

// Only this exact email (or a backend-returned role===SUPER_ADMIN) gets super admin access.
// All other admin accounts get the ADMIN role.
const SUPER_ADMIN_EMAIL = "superadmin@vedantabus.co.in";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          const userObj = data.data?.user || data.user;

          // Only the designated superadmin email or an explicit SUPER_ADMIN role gets super access
          const isSuper =
            userObj.role === "SUPER_ADMIN" ||
            email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;

          const finalUser = {
            ...userObj,
            role: isSuper ? "SUPER_ADMIN" : "ADMIN",
            name: userObj.name || (isSuper ? "Super Admin" : "Operations Admin"),
          };

          const tokenVal = data.data?.accessToken || data.accessToken;
          localStorage.setItem("admin_token", tokenVal);
          localStorage.setItem("admin_user", JSON.stringify(finalUser));
        }
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Please check your email and password.");
      }
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B1120",
        backgroundImage: "radial-gradient(ellipse at top, #1E293B, #0B1120)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#FFFFFF",
          borderRadius: 16,
          boxShadow:
            "0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
          padding: "2.25rem 2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#FEF2F2",
              color: "#B91C1C",
              marginBottom: "0.875rem",
              boxShadow: "0 4px 10px rgba(185, 28, 28, 0.15)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>
              shield_person
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
              fontSize: "1.625rem",
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            VedantaBus Admin
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.875rem", marginTop: 6, lineHeight: 1.4 }}>
            Sign in to access management controls &amp; platform settings
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#991B1B",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              fontSize: "0.8125rem",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: "#DC2626" }}
            >
              error
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Admin Email
            </label>
            <div style={{ position: "relative" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 18,
                  color: "#94A3B8",
                  pointerEvents: "none",
                }}
              >
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                required
                style={{
                  width: "100%",
                  paddingLeft: 38,
                  paddingRight: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  border: "1px solid #CBD5E1",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 150ms",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B91C1C")}
                onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 18,
                  color: "#94A3B8",
                  pointerEvents: "none",
                }}
              >
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  paddingLeft: 38,
                  paddingRight: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  border: "1px solid #CBD5E1",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 150ms",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B91C1C")}
                onBlur={(e) => (e.target.style.borderColor = "#CBD5E1")}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#B91C1C",
              color: "#FFFFFF",
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 2px 6px rgba(185, 28, 28, 0.25)",
              marginTop: "0.25rem",
              transition: "background-color 150ms",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#991B1B";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#B91C1C";
            }}
          >
            {loading ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: 18 }}
                >
                  progress_activity
                </span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
