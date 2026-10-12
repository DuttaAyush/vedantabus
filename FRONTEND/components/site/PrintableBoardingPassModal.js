'use client';

import React, { useRef } from 'react';

export default function PrintableBoardingPassModal({ isOpen, onClose, ticketData }) {
  const printRef = useRef(null);

  if (!isOpen || !ticketData) return null;

  const {
    id = 'YB-994821',
    bookingId = id,
    operator = 'Luxury Gold Express',
    busType = 'Volvo 9600 Multi-Axle 2+1 AC Sleeper',
    busPlate = 'MH-12-QZ-8812',
    from = 'Nagpur',
    fromStation = 'Central Hub, Dharampeth',
    to = 'Pune',
    toStation = 'Swargate Lounge, Pune',
    depTime = '20:30',
    depDate = 'Scheduled Journey',
    arrTime = '07:00',
    arrDate = 'Next Morning',
    duration = '10h 30m',
    seats = ['L1'],
    passengers = [],
    totalFare = 850,
    driverName = 'Sunil Sharma (Verified Captain)',
    driverPhone = '+91-8208024895',
    reportingTime = '20:00 (30 mins before departure)',
    isPackage = false,
    packageTitle = '',
    hotelTier = '',
  } = ticketData;

  const displayPassengers = passengers && passengers.length > 0 
    ? passengers 
    : (Array.isArray(seats) ? seats : [seats]).map((st, idx) => ({
        seat: st,
        name: idx === 0 ? 'Primary Passenger' : `Co-Passenger ${idx + 1}`,
        age: idx === 0 ? '34' : '28',
        gender: idx === 0 ? 'Male' : 'Female'
      }));

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    const text = `🎟️ Confirmed Ticket #${bookingId}\n🚌 ${operator} (${busPlate})\n🛣️ ${from} ➔ ${to}\n🕒 ${depDate} at ${depTime}\n💺 Seats: ${Array.isArray(seats) ? seats.join(', ') : seats}\n💰 Amount: ₹${totalFare}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `E-Ticket #${bookingId}`,
        text: text,
        url: typeof window !== 'undefined' ? `${window.location.origin}/track-bus/${bookingId}` : '',
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:overflow-visible">
      {/* PRINT-SPECIFIC CSS RULES */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-boarding-pass,
          #printable-boarding-pass * {
            visibility: visible !important;
          }
          #printable-boarding-pass {
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
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* MODAL WRAPPER */}
      <div className="relative w-full max-w-3xl my-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none">
        
        {/* TOP MODAL ACTION BAR (Hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">confirmation_number</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">Verified Boarding Pass</span>
              <span className="text-sm font-bold text-white">Ticket #{bookingId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Share Ticket"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
              title="Close modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE PASS BODY */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 print:overflow-visible print:p-0">
          
          {/* THE PRINTABLE BOARDING PASS CARD */}
          <div
            id="printable-boarding-pass"
            ref={printRef}
            className="bg-white rounded-2xl border-2 border-slate-800 text-slate-900 relative shadow-sm overflow-hidden"
          >
            {/* TICKET TOP HEADER */}
            <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-scarlet text-white flex items-center justify-center font-serif font-black text-2xl shadow-md shrink-0">
                  YB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-serif font-bold text-white tracking-wide">YATRA<span className="text-amber-400">BUS</span></span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">CONFIRMED</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{operator}</p>
                </div>
              </div>

              {/* TICKET NUMBER & BUS REGISTRATION */}
              <div className="flex sm:flex-col sm:items-end justify-between items-center text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PNR / TICKET ID</div>
                <div className="text-lg font-mono font-black text-amber-300 tracking-wider">#{bookingId}</div>
                <div className="text-[11px] font-mono text-slate-300">Bus Plate: <strong className="text-white">{busPlate}</strong></div>
              </div>
            </div>

            {/* ROUTE HERO BAND */}
            <div className="bg-slate-50 p-5 border-b border-dashed border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Origin */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">BOARDING FROM</span>
                <span className="text-2xl font-black text-slate-900 block">{from}</span>
                <span className="text-xs text-slate-600 font-medium block truncate max-w-xs">{fromStation}</span>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-100 text-brand-scarlet font-bold text-xs">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>{depDate} • {depTime}</span>
                </div>
              </div>

              {/* Journey Duration Divider */}
              <div className="flex flex-col items-center justify-center px-4 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{duration}</span>
                <div className="flex items-center gap-2 my-1 text-slate-400">
                  <span className="w-8 border-t-2 border-slate-300 border-dashed" />
                  <span className="material-symbols-outlined text-brand-scarlet text-[20px]">directions_bus</span>
                  <span className="w-8 border-t-2 border-slate-300 border-dashed" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-500">{busType}</span>
              </div>

              {/* Destination */}
              <div className="flex-1 text-center md:text-right">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">DROPPING AT</span>
                <span className="text-2xl font-black text-slate-900 block">{to}</span>
                <span className="text-xs text-slate-600 font-medium block truncate max-w-xs md:ml-auto">{toStation}</span>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold text-xs">
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  <span>{arrDate} • {arrTime}</span>
                </div>
              </div>
            </div>

            {/* PASSENGERS & SEAT DETAILS TABLE */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-brand-scarlet">group</span>
                  <span>Passenger &amp; Berth Allocation</span>
                </h4>
                <span className="text-xs font-bold text-brand-scarlet bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  {displayPassengers.length} Reserved Berth(s)
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Passenger Name</th>
                      <th className="py-2.5 px-3">Age / Gender</th>
                      <th className="py-2.5 px-3 text-center">Allocated Berth</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {displayPassengers.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{p.name || `Passenger ${idx + 1}`}</td>
                        <td className="py-2.5 px-3 text-slate-600">{p.age || '30'} Yrs / {p.gender || 'Male'}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-3 py-1 rounded-lg bg-red-50 text-brand-scarlet font-black font-mono border border-red-200 text-xs">
                            {p.seat || (Array.isArray(seats) ? seats[idx] : seats) || `Seat ${idx + 1}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOARDING INSTRUCTIONS & QR CODE ROW */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50/50">
              
              {/* QR Code & Digital Stamp */}
              <div className="md:col-span-4 flex flex-col items-center text-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                {/* SVG QR Code Simulation */}
                <div className="w-28 h-28 bg-white p-1.5 rounded-lg border border-slate-300 flex items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
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
                  {/* Small Center Logo */}
                  <div className="absolute inset-0 m-auto w-6 h-6 rounded bg-brand-scarlet text-white flex items-center justify-center text-[8px] font-bold shadow-xs">
                    YB
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-600 mt-2">SCAN TO BOARD COACH</span>
                <span className="text-[9px] text-slate-400">RTO &amp; Gov ID Encrypted</span>
              </div>

              {/* Instructions & Driver Contact */}
              <div className="md:col-span-8 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0 mt-0.5">info</span>
                  <div>
                    <strong className="text-slate-900 block">Reporting Guidelines:</strong>
                    <span>Please report at <strong>{fromStation}</strong> by <strong>{reportingTime}</strong>. Keep an active government photo ID handy.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">call</span>
                  <div>
                    <strong className="text-slate-900 block">Captain &amp; Support Contact:</strong>
                    <span>Driver: <strong>{driverName}</strong> ({driverPhone}) • 24x7 Helpline: <strong>+91-8208024895</strong></span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">verified</span>
                  <div>
                    <strong className="text-slate-900 block">Luggage &amp; Comfort Policy:</strong>
                    <span>Up to 20kg check-in baggage allowed per sleeper berth. Clean blanket, pillow &amp; 500ml packaged water provided.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* FARE SUMMARY STRIP */}
            <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t-2 border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified_user</span>
                <span className="text-slate-300">Fare Payment: <strong className="text-emerald-400 font-bold">PAID IN FULL (₹{Number(totalFare).toLocaleString('en-IN')})</strong></span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Valid for journey on date specified. Subject to official terms &amp; conditions.
              </div>
            </div>

          </div>

          {/* EXTRA ACTIONS AT BOTTOM */}
          <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[16px]">lock</span>
              <span>256-Bit SSL Official Boarding Document</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Pass
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download / Print Ticket</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
