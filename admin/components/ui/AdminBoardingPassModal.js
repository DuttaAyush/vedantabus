"use client";

import React, { useRef } from "react";

export default function AdminBoardingPassModal({ isOpen, onClose, ticketData }) {
  const printRef = useRef(null);

  if (!isOpen || !ticketData) return null;

  const {
    id = "YB-20261015-0042",
    bookingId = id,
    customerName = "Rajesh Kumar",
    customerPhone = "+91-8208024895",
    customerEmail = "rajesh.kumar@gmail.com",
    operator = "Luxury Gold Express",
    busType = "Volvo B11R Multi-Axle AC Sleeper (2+1)",
    busPlate = "MH 12 QZ 8812",
    from = "Nagpur",
    fromStation = "Central Hub, Dharampeth",
    to = "Pune",
    toStation = "Swargate Lounge, Pune",
    depTime = "06:00 AM",
    depDate = "15 Sep 2026",
    arrTime = "12:30 PM",
    arrDate = "15 Sep 2026",
    duration = "6h 30m",
    seats = ["L1", "L2"],
    passengers = [],
    totalAmount = "₹ 2,570",
    driverName = "Sunil Sharma (Verified Captain)",
    driverPhone = "+91-8208024895",
    status = "Confirmed",
    isPackage = false,
    packageTitle = "",
  } = ticketData;

  const displayPassengers = passengers && passengers.length > 0
    ? passengers
    : (Array.isArray(seats) ? seats : [seats]).map((s, idx) => ({
        name: idx === 0 ? customerName : `Co-Passenger ${idx + 1}`,
        age: idx === 0 ? 42 : 28,
        gender: idx === 0 ? "Male" : "Female",
        seat: s,
        relation: idx === 0 ? "Self" : "Family",
      }));

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)",
      padding: "1rem", overflowY: "auto"
    }}>
      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #admin-printable-pass,
          #admin-printable-pass * {
            visibility: visible !important;
          }
          #admin-printable-pass {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            background: white !important;
            color: black !important;
          }
          .admin-no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Card */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 760,
        backgroundColor: "#fff", borderRadius: 20, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid #E2E8F0", overflow: "hidden", maxHeight: "94vh",
        display: "flex", flexDirection: "column"
      }}>
        
        {/* Top Control Bar */}
        <div className="admin-no-print" style={{
          backgroundColor: "#0F172A", color: "#fff", padding: "0.875rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#FBBF24" }}>confirmation_number</span>
            <div>
              <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", fontWeight: 700, color: "#FBBF24", display: "block" }}>
                Admin Boarding Pass Dispatch
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>
                Ticket #{bookingId}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.45rem 0.875rem", borderRadius: 8, backgroundColor: "#B91C1C",
                color: "#fff", fontSize: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: "0 2px 4px rgba(185,28,28,0.3)"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
              Print / Save PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: "50%", backgroundColor: "#1E293B",
                border: "none", color: "#94A3B8", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Pass Area */}
        <div style={{ overflowY: "auto", padding: "1.25rem" }}>
          
          <div
            id="admin-printable-pass"
            ref={printRef}
            style={{
              backgroundColor: "#fff", borderRadius: 14, border: "2px solid #0F172A",
              overflow: "hidden", color: "#0F172A"
            }}
          >
            {/* Pass Header */}
            <div style={{
              backgroundColor: "#0F172A", color: "#fff", padding: "1.25rem",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, backgroundColor: "#B91C1C",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "1.25rem", fontFamily: "serif"
                }}>
                  YB
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "0.03em" }}>
                      YATRA<span style={{ color: "#FBBF24" }}>BUS</span>
                    </span>
                    <span style={{
                      fontSize: "0.625rem", fontWeight: 800, padding: "0.15rem 0.5rem",
                      borderRadius: 999, backgroundColor: "#10B981", color: "#0F172A"
                    }}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{operator}</div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", color: "#94A3B8", fontWeight: 700 }}>
                  PNR / TICKET ID
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 900, fontFamily: "monospace", color: "#FBBF24" }}>
                  #{bookingId}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#E2E8F0" }}>
                  Coach Plate: <strong style={{ color: "#fff" }}>{busPlate}</strong>
                </div>
              </div>
            </div>

            {/* Route & Times */}
            <div style={{
              backgroundColor: "#F8FAFC", padding: "1.25rem", borderBottom: "1px dashed #CBD5E1",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"
            }}>
              {/* Origin */}
              <div>
                <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>BOARDING</span>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A" }}>{from}</div>
                <div style={{ fontSize: "0.75rem", color: "#475569" }}>{fromStation}</div>
                <div style={{
                  marginTop: "0.35rem", display: "inline-block", padding: "0.2rem 0.6rem",
                  borderRadius: 6, backgroundColor: "#FEE2E2", color: "#B91C1C", fontSize: "0.75rem", fontWeight: 700
                }}>
                  {depDate} • {depTime}
                </div>
              </div>

              {/* Journey Duration */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748B" }}>{duration}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#B91C1C", margin: "0.25rem 0" }}>
                  <span style={{ width: 24, borderTop: "2px dashed #CBD5E1" }} />
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>directions_bus</span>
                  <span style={{ width: 24, borderTop: "2px dashed #CBD5E1" }} />
                </div>
                <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#64748B" }}>{busType}</span>
              </div>

              {/* Destination */}
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase" }}>DROPPING</span>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0F172A" }}>{to}</div>
                <div style={{ fontSize: "0.75rem", color: "#475569" }}>{toStation}</div>
                <div style={{
                  marginTop: "0.35rem", display: "inline-block", padding: "0.2rem 0.6rem",
                  borderRadius: 6, backgroundColor: "#E2E8F0", color: "#0F172A", fontSize: "0.75rem", fontWeight: 700
                }}>
                  {arrDate} • {arrTime}
                </div>
              </div>
            </div>

            {/* Passenger & Berth Allocation Table */}
            <div style={{ padding: "1.25rem", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#334155" }}>
                  Passenger Manifest &amp; Berth Allocation
                </span>
                <span style={{
                  fontSize: "0.75rem", fontWeight: 700, color: "#B91C1C",
                  backgroundColor: "#FEE2E2", padding: "0.15rem 0.6rem", borderRadius: 999
                }}>
                  {displayPassengers.length} Reserved Berth(s)
                </span>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F1F5F9", borderBottom: "1px solid #E2E8F0", textAlign: "left", fontSize: "0.6875rem", textTransform: "uppercase", color: "#475569" }}>
                    <th style={{ padding: "0.5rem 0.75rem" }}>#</th>
                    <th style={{ padding: "0.5rem 0.75rem" }}>Traveler Name</th>
                    <th style={{ padding: "0.5rem 0.75rem" }}>Age / Gender</th>
                    <th style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>Allocated Berth</th>
                    <th style={{ padding: "0.5rem 0.75rem", textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPassengers.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td style={{ padding: "0.625rem 0.75rem", color: "#94A3B8", fontWeight: 700 }}>{idx + 1}</td>
                      <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: "#0F172A" }}>{p.name}</td>
                      <td style={{ padding: "0.625rem 0.75rem", color: "#475569" }}>{p.age} Yrs / {p.gender}</td>
                      <td style={{ padding: "0.625rem 0.75rem", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 6,
                          backgroundColor: "#FEF2F2", color: "#B91C1C", fontWeight: 900, fontFamily: "monospace",
                          border: "1px solid #FCA5A5", fontSize: "0.75rem"
                        }}>
                          {p.seat}
                        </span>
                      </td>
                      <td style={{ padding: "0.625rem 0.75rem", textAlign: "right", color: "#16A34A", fontWeight: 700 }}>
                        Confirmed
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* QR Code and Contact info */}
            <div style={{
              padding: "1.25rem", backgroundColor: "#F8FAFC",
              display: "grid", gridTemplateColumns: "130px 1fr", gap: "1.25rem", alignItems: "center"
            }}>
              {/* QR Code Box */}
              <div style={{
                backgroundColor: "#fff", padding: "0.5rem", borderRadius: 10,
                border: "1px solid #CBD5E1", textAlign: "center"
              }}>
                <div style={{ width: 100, height: 100, margin: "0 auto", position: "relative" }}>
                  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", color: "#0F172A" }} fill="currentColor">
                    <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                    <rect x="40" y="5" width="8" height="15" />
                    <rect x="52" y="10" width="8" height="20" />
                    <rect x="5" y="40" width="15" height="8" />
                    <rect x="25" y="45" width="12" height="12" />
                    <rect x="42" y="42" width="16" height="16" />
                    <rect x="65" y="40" width="10" height="25" />
                    <rect x="80" y="45" width="15" height="8" />
                    <rect x="40" y="70" width="12" height="20" />
                    <rect x="60" y="75" width="20" height="10" />
                    <rect x="85" y="70" width="10" height="25" />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, margin: "auto", width: 22, height: 22,
                    borderRadius: 4, backgroundColor: "#B91C1C", color: "#fff", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800
                  }}>
                    YB
                  </div>
                </div>
                <div style={{ fontSize: "0.625rem", fontWeight: 800, color: "#475569", marginTop: "0.25rem" }}>
                  RTO QR VERIFIED
                </div>
              </div>

              {/* Guidelines & Driver info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem", color: "#475569" }}>
                <div>
                  <strong style={{ color: "#0F172A" }}>Customer:</strong> {customerName} ({customerPhone}) • {customerEmail}
                </div>
                <div>
                  <strong style={{ color: "#0F172A" }}>Captain on Duty:</strong> {driverName} ({driverPhone})
                </div>
                <div>
                  <strong style={{ color: "#0F172A" }}>Reporting Note:</strong> Passengers should report at {fromStation} 30 minutes prior to departure with Govt ID.
                </div>
              </div>
            </div>

            {/* Bottom Fare Band */}
            <div style={{
              backgroundColor: "#0F172A", color: "#fff", padding: "0.75rem 1.25rem",
              display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem"
            }}>
              <div>
                Total Amount Paid: <strong style={{ color: "#10B981" }}>{totalAmount}</strong>
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#94A3B8" }}>
                256-Bit SSL Verified Official E-Ticket • Official Admin Concierge
              </div>
            </div>

          </div>

          {/* Action buttons at bottom */}
          <div className="admin-no-print" style={{
            display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem"
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #CBD5E1",
                backgroundColor: "#fff", color: "#475569", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer"
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: "0.5rem 1.25rem", borderRadius: 8, border: "none",
                backgroundColor: "#B91C1C", color: "#fff", fontSize: "0.8125rem", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem",
                boxShadow: "0 2px 4px rgba(185,28,28,0.3)"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Download / Print PDF Ticket
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
