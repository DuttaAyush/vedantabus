'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { apiFetch } from '@/lib/api';

const sampleTrackerData = {
  'YB-994821': {
    ticketId: 'YB-994821',
    operator: 'VRL Travels Express',
    busPlate: 'MH-12-QZ-8812',
    busType: 'Volvo B11R Multi-Axle AC Sleeper (2+1)',
    route: 'Nagpur ➔ Pune',
    seats: ['3A', '3B'],
    driverName: 'Sunil Sharma',
    driverPhone: '+91-8208024895',
    speed: '78 km/h',
    progressPercent: 65,
    onTimeStatus: 'On Time (Samruddhi Mahamarg)',
    milestones: [
      { location: 'Nagpur (Dharampeth Terminal)', time: '20:30', status: 'completed', label: 'Departed' },
      { location: 'Karanja Lad Interchange', time: '22:00', status: 'completed', label: 'Passed' },
      { location: 'Jalna Food & Fuel Rest Stop', time: '23:45', status: 'current', label: 'Arriving in 15 mins' },
      { location: 'Aurangabad Bypass Interchange', time: '02:15', status: 'upcoming', label: 'Scheduled' },
      { location: 'Ahmednagar Bypass', time: '04:30', status: 'upcoming', label: 'Scheduled' },
      { location: 'Pune (Swargate Terminal)', time: '07:00', status: 'upcoming', label: 'Destination' },
    ]
  }
};

export default function TrackBusClient({ params }) {
  const ticketId = params?.id || 'YB-994821';
  const [userTrip, setUserTrip] = useState(null);
  const [liveTracking, setLiveTracking] = useState(null);

  useEffect(() => {
    apiFetch(`/api/tracking/${ticketId}`)
      .then(res => res.json())
      .then(data => {
        const t = data.data || data;
        if (t && t.progressPercentage !== undefined) {
          setLiveTracking(t);
        }
      })
      .catch(() => {});
  }, [ticketId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user_trips');
        if (stored) {
          const trips = JSON.parse(stored);
          const found = trips.find(t => t.id === ticketId);
          if (found) setUserTrip(found);
        }
      } catch (err) {
        console.error('Failed to load tracking trip:', err);
      }
    }
  }, [ticketId]);

  const defaultTrack = sampleTrackerData[ticketId] || sampleTrackerData['YB-994821'];
  const track = userTrip ? {
    ticketId: userTrip.id,
    operator: userTrip.operator,
    busPlate: liveTracking?.busPlate || userTrip.busPlate,
    busType: userTrip.busType,
    route: `${userTrip.from} ➔ ${userTrip.to}`,
    seats: userTrip.seats,
    driverName: userTrip.driverName || 'Sunil Sharma',
    driverPhone: userTrip.driverPhone || '+91-8208024895',
    speed: liveTracking ? '78 km/h' : '76 km/h',
    progressPercent: liveTracking ? liveTracking.progressPercentage : 45,
    onTimeStatus: liveTracking ? `${liveTracking.status} (Live GPS Tracking)` : 'On Time (Highway Express Route)',
    milestones: [
      { location: `${userTrip.from} (${userTrip.fromStation || 'Depot Terminal'})`, time: userTrip.depTime, status: 'completed', label: 'Departed' },
      { location: 'Highway Expressway Toll (Km 65)', time: '21:30', status: 'completed', label: 'Passed' },
      { location: 'Expressway Food Plaza Rest Stop', time: '23:45', status: 'current', label: 'Arriving in 15 mins' },
      { location: 'Regional Interchange Bypass', time: '03:15', status: 'upcoming', label: 'Scheduled' },
      { location: `${userTrip.to} (${userTrip.toStation || 'Arrival Point'})`, time: userTrip.arrTime, status: 'upcoming', label: 'Destination' },
    ]
  } : defaultTrack;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Header />

      {/* CONTEXT TOP HEADER */}
      <div className="bg-white border-b border-slate-200/90 shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-16 sm:top-18 lg:top-20 z-30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-scarlet border border-slate-200 flex items-center justify-center transition-all shadow-sm"
              title="Back to Bookings"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE V1 TRACKING
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">#{track.ticketId}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {track.operator} — {track.route}
              </h1>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 shadow-md shrink-0">
            <span className="material-symbols-outlined text-[22px] text-amber-400">directions_bus</span>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">ASSIGNED BUS PLATE</span>
              <span className="text-sm font-mono font-extrabold text-amber-300">{track.busPlate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN PROGRESS BAR TRACKING CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* QUICK STATUS METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Current Speed</span>
              <span className="text-lg font-extrabold text-slate-900">{track.speed}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Schedule Status</span>
              <span className="text-xs font-bold text-emerald-700">{track.onTimeStatus}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Driver Details</span>
              <span className="text-xs font-bold text-slate-900">{track.driverName}</span>
            </div>
            <a
              href={`tel:${track.driverPhone}`}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* V1 LINEAR JOURNEY PROGRESS BAR CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900">Journey Milestone Progress</h2>
              <p className="text-xs text-slate-500">Real-time checkpoint tracking from departure to arrival</p>
            </div>
            <span className="text-sm font-extrabold text-brand-scarlet bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {track.progressPercent}% Completed
            </span>
          </div>

          {/* MAIN LINEAR PROGRESS BAR TRACK */}
          <div className="space-y-2">
            <div className="w-full h-3 rounded-full bg-slate-100 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-brand-scarlet rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${track.progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>0% Departed</span>
              <span className="text-emerald-700">{track.progressPercent}% Current Position</span>
              <span>100% Destination</span>
            </div>
          </div>

          {/* VERTICAL / STEP MILESTONE LIST */}
          <div className="space-y-6 pt-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {track.milestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-4 relative z-10">
                
                {/* STEP INDICATOR ICON */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                    m.status === 'completed'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : m.status === 'current'
                      ? 'bg-brand-scarlet text-white ring-4 ring-red-100 shadow-md animate-pulse'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {m.status === 'completed' ? '✓' : m.status === 'current' ? '☸' : idx + 1}
                </div>

                {/* MILESTONE DETAILS */}
                <div
                  className={`flex-1 p-4 rounded-2xl border transition-all ${
                    m.status === 'current'
                      ? 'bg-red-50/50 border-brand-scarlet shadow-sm'
                      : m.status === 'completed'
                      ? 'bg-slate-50/70 border-slate-200/80'
                      : 'bg-white border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{m.location}</h3>
                    <span className="text-xs font-mono font-extrabold text-slate-700">{m.time}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        m.status === 'current'
                          ? 'text-brand-scarlet font-extrabold'
                          : m.status === 'completed'
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.label}
                    </span>

                    {m.status === 'current' && (
                      <span className="text-[10px] bg-red-100 text-brand-scarlet font-extrabold px-2 py-0.5 rounded-full">
                        LIVE BUS HERE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
