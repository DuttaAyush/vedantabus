'use client';

export default function UpcomingBatches() {
  return (
    <section className="w-full py-16 bg-[#FFFDF9] border-t border-amber-200/70" id="upcomingDepartures">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <span className="material-symbols-outlined text-[16px] text-brand-scarlet">event_available</span>
              CALENDAR DEPARTURES & GROUP BATCHES
            </div>
            <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight font-spiritual font-normal not-italic">Upcoming Fixed Departure Batches &amp; Escorted Yatras</h2>
            <p className="text-sm text-slate-600 mt-1">Book pre-scheduled departure dates with guaranteed coach plates, escort Purohit assistance, and confirmed priority sanctum slots.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">verified_user</span>
            <span>Zero Waitlist • Instant Seat Assignment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batch 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border-2 border-amber-300/80 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-brand-scarlet text-white font-bold text-[10px] rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>Filling Fast
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <span className="material-symbols-outlined text-[16px] text-brand-scarlet">calendar_month</span>
                <span>Tuesday, 26 November 2025</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">Shirdi Kakad Aarti & Shani Shingnapur Express</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Pune Swargate (21:30 PM) ➔ Shirdi Gate 2 Direct</p>
              <div className="space-y-2.5 py-3.5 px-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 mb-4 text-xs">
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Assigned Bus Fleet:</span><span className="font-mono font-bold text-slate-900">MH-14-BT-3321</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Escort Purohit:</span><span className="font-bold text-slate-800">Pandit Anand Joshi (Nashik)</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Ritual Highlight:</span><span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">4:30 AM Kakad Aarti Pass</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Seat Availability:</span><span className="text-xs font-extrabold text-brand-scarlet bg-amber-100/80 px-2 py-0.5 rounded-full">Only 6 Berths Left</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-amber-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">All-Inclusive Fare</span>
                <span className="text-2xl font-extrabold text-slate-900">₹49,999</span>
                <span className="text-[10px] text-slate-500"> /devotee</span>
              </div>
              <a
                href="/select-seats?busId=shirdi-batch-26nov&operator=Vedanta%20Kakad%20Aarti%20Express&from=Pune%20Swargate&to=Shirdi%20Gate%202&price=2899&busPlate=MH-14-BT-3321&busType=BharatBenz%20AC%20Sleeper&depTime=21:30&arrTime=04:00&date=Tuesday,%2026%20November"
                className="px-4 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Reserve Seat</span>
                <span className="material-symbols-outlined text-[15px]">event_seat</span>
              </a>
            </div>
          </div>

          {/* Batch 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border-2 border-amber-400 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-amber-600 text-white font-bold text-[10px] rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">stars</span>Flagship Circuit
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <span className="material-symbols-outlined text-[16px] text-brand-scarlet">calendar_month</span>
                <span>Monday, 02 December 2025</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">Maharashtra 5 Jyotirlinga Darshan Tour</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Mumbai Dadar (05:45 AM) & Pune Boarding ➔ 7 Days</p>
              <div className="space-y-2.5 py-3.5 px-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 mb-4 text-xs">
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Assigned Bus Fleet:</span><span className="font-mono font-bold text-slate-900">MH-12-RN-9908</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Escort Purohit:</span><span className="font-bold text-slate-800">Shastri Vivek Kulkarni</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Ritual Highlight:</span><span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">Trimbak Rudrabhishek Included</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Seat Availability:</span><span className="text-xs font-extrabold text-brand-scarlet bg-amber-100/80 px-2 py-0.5 rounded-full">Only 4 Berths Left</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-amber-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">All-Inclusive Fare</span>
                <span className="text-2xl font-extrabold text-slate-900">₹64,999</span>
                <span className="text-[10px] text-slate-500"> /devotee</span>
              </div>
              <a
                href="/select-seats?busId=jyotirlinga-batch-2dec&operator=Vedanta%205%20Jyotirlinga%20Flagship&from=Mumbai%20Dadar&to=Trimbak%20Circuit&price=11499&busPlate=MH-12-RN-9908&busType=Volvo%20Multi-Axle%20Sleeper&depTime=05:45&arrTime=18:00&date=Monday,%2002%20December"
                className="px-4 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Reserve Seat</span>
                <span className="material-symbols-outlined text-[15px]">event_seat</span>
              </a>
            </div>
          </div>

          {/* Batch 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border-2 border-amber-300/80 flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 px-3.5 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-amber-400">workspace_premium</span>VIP Darshan Pass
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <span className="material-symbols-outlined text-[16px] text-brand-scarlet">calendar_month</span>
                <span>Wednesday, 10 December 2025</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">Kashi Vishwanath & Ayodhya Ram Mandir</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">Varanasi Cantt (07:00 AM) ➔ 4 Days Corridor Special</p>
              <div className="space-y-2.5 py-3.5 px-4 bg-amber-50/50 rounded-2xl border border-amber-200/70 mb-4 text-xs">
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Assigned Bus Fleet:</span><span className="font-mono font-bold text-slate-900">UP-65-AX-7714</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Escort Purohit:</span><span className="font-bold text-slate-800">Acharya Ramakant Tiwari</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Ritual Highlight:</span><span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">Ganga Boat & Ram Lalla Darshan</span></div>
                <div className="flex items-center justify-between"><span className="text-slate-500 font-semibold">Seat Availability:</span><span className="text-xs font-extrabold text-brand-scarlet bg-amber-100/80 px-2 py-0.5 rounded-full">8 Berths Left</span></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-amber-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">All-Inclusive Fare</span>
                <span className="text-2xl font-extrabold text-slate-900">₹54,999</span>
                <span className="text-[10px] text-slate-500"> /devotee</span>
              </div>
              <a
                href="/select-seats?busId=kashi-batch-10dec&operator=Vedanta%20Ram%20Mandir%20Corridor&from=Varanasi%20Cantt&to=Ayodhya%20Dham&price=6499&busPlate=UP-65-AX-7714&busType=BharatBenz%20AC%20Coach&depTime=07:00&arrTime=17:00&date=Wednesday,%2010%20December"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-scarlet text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Reserve Seat</span>
                <span className="material-symbols-outlined text-[15px]">event_seat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
