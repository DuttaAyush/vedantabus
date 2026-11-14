'use client';

export default function DevsthanRoutes() {
  return (
    <section className="w-full py-16 bg-[#FDFBF7]" id="sacredRoutes">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <span className="material-symbols-outlined text-[16px] text-brand-scarlet">route</span>
              DIRECT SACRED CORRIDORS
            </div>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-spiritual font-normal not-italic">Popular Devsthan Express Routes</h2>
            <p className="text-sm text-slate-600 mt-1">Guaranteed seats with assigned vehicle registration numbers, synchronized with temple Kakad Aarti & Abhishek timings.</p>
          </div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Aarti Schedule Feeds Connected
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Route 1: Pune to Shirdi */}
          <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border-2 border-amber-300/80 hover:border-brand-scarlet transition-all flex flex-col justify-between relative group">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-scarlet text-white font-bold text-[11px] rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Most Popular Devsthan
            </div>
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl md:text-2xl font-extrabold text-slate-900">Pune ⇄ Shirdi Sai & Shani Shingnapur</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">4 Daily</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    BharatBenz AC Sleeper (2+1) • Bus Reg: <span className="font-mono font-bold text-slate-800">MH-14-BT-3321</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Seat Only Starts from ₹550</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-brand-scarlet">₹2,899</span>
                  <span className="text-[10px] text-slate-500 block">All-Inclusive Yatra</span>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center py-4 px-4 bg-amber-50/50 rounded-2xl mb-4 border border-amber-200/70 text-center">
                <div className="text-left">
                  <div className="text-lg md:text-xl font-extrabold text-slate-900">22:00</div>
                  <div className="text-xs text-slate-600 font-semibold truncate">Swargate / Wakad</div>
                  <span className="text-[10px] text-slate-400">Night Boarding</span>
                </div>
                <div className="px-2">
                  <span className="text-[11px] font-bold text-slate-500 block">5h 30m</span>
                  <div className="w-full h-0.5 bg-amber-300 my-1.5 relative">
                    <span className="material-symbols-outlined text-brand-scarlet text-[16px] absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-50 px-1">directions_bus</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Synced with 4:30 AM Kakad Aarti</span>
                </div>
                <div className="text-right">
                  <div className="text-lg md:text-xl font-extrabold text-slate-900">03:30</div>
                  <div className="text-xs text-slate-600 font-semibold truncate">Shirdi Gate 2</div>
                  <span className="text-[10px] text-slate-400">Direct Drop</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Includes: VIP Aarti Pass • 3★ Stay • Satvik Breakfast</span>
              <a
                href="/select-seats?busId=shirdi-special&operator=Vedanta%20Spiritual%20Express&from=Pune&to=Shirdi&price=550&busPlate=MH-14-BT-3321&busType=BharatBenz%20AC%20Sleeper%20(2%2B1)&depTime=22:00&arrTime=03:30&depLocation=Pune%20Swargate&arrLocation=Shirdi%20Gate%202"
                className="px-5 py-2.5 rounded-xl bg-brand-scarlet text-white hover:bg-brand-hover font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>SELECT SEATS / BUS</span>
                <span className="material-symbols-outlined text-[15px]">event_seat</span>
              </a>
            </div>
          </div>

          {/* Route 2: Nagpur to Trimbakeshwar */}
          <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border-2 border-amber-300/80 hover:border-brand-scarlet transition-all flex flex-col justify-between relative group">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-600 text-white font-bold text-[11px] rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">stars</span> Jyotirlinga Direct
            </div>
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl md:text-2xl font-extrabold text-slate-900">Nagpur ⇄ Trimbakeshwar & Grishneshwar</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">Daily Circuit</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Multi-Axle Volvo B11R AC Sleeper • Bus Reg: <span className="font-mono font-bold text-slate-800">MH-31-AP-4921</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Seat Only Starts from ₹950</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-brand-scarlet">₹4,499</span>
                  <span className="text-[10px] text-slate-500 block">All-Inclusive /person</span>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center py-4 px-4 bg-amber-50/50 rounded-2xl mb-4 border border-amber-200/70 text-center">
                <div className="text-left">
                  <div className="text-lg md:text-xl font-extrabold text-slate-900">19:30</div>
                  <div className="text-xs text-slate-600 font-semibold truncate">Dharampeth, Nagpur</div>
                  <span className="text-[10px] text-slate-400">Via Samruddhi Corridor</span>
                </div>
                <div className="px-2">
                  <span className="text-[11px] font-bold text-slate-500 block">9h 15m</span>
                  <div className="w-full h-0.5 bg-amber-300 my-1.5 relative">
                    <span className="material-symbols-outlined text-brand-scarlet text-[16px] absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-50 px-1">directions_bus</span>
                  </div>
                  <span className="text-[10px] text-amber-900 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">Abhishek Timing Priority Access</span>
                </div>
                <div className="text-right">
                  <div className="text-lg md:text-xl font-extrabold text-slate-900">05:45</div>
                  <div className="text-xs text-slate-600 font-semibold truncate">Nashik / Trimbak</div>
                  <span className="text-[10px] text-slate-400">Hotel Check-in</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">Includes: Rudrabhishek Priest • 3★ Stay • Pure Satvik Meals</span>
              <a
                href="/select-seats?busId=trimbak-special&operator=Vedanta%20Jyotirlinga%20Express&from=Nagpur&to=Trimbakeshwar&price=950&busPlate=MH-31-AP-4921&busType=Volvo%20B11R%20AC%20Sleeper&depTime=19:30&arrTime=05:45&depLocation=Dharampeth%2C%20Nagpur&arrLocation=Nashik%20%2F%20Trimbak"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-brand-scarlet font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>SELECT SEATS / BUS</span>
                <span className="material-symbols-outlined text-[15px]">event_seat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
