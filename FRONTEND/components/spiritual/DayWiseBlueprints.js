'use client';

export default function DayWiseBlueprints() {
  return (
    <section className="w-full py-16 bg-[#FDFBF7]" id="sacredBlueprints">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-brand-scarlet uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Precision Transit & Ritual Timings
          </span>
          <h2 className="text-2xl md:text-3xl text-slate-900 tracking-tight mt-3 font-spiritual font-normal not-italic">Detailed Day-Wise Yatra Blueprints</h2>
          <p className="text-sm text-slate-600 mt-2">See how our tour team seamlessly synchronizes coach transit, temple VIP queue schedules, hotel check-ins, and Satvik meals so families never rush or wait.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blueprint 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">Signature Circuit</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Maharashtra 5 Jyotirlinga Tour</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">7 Days / 6 Nights</span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">1</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Day 1 • Pune / Mumbai Departure to Bhimashankar</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">AC Coach Boarding & Forest Sanctum Darshan</div>
                  <p className="text-xs text-slate-600 mt-1">06:00 AM Departure from Swargate / Dadar in AC BharatBenz Coach. 11:30 AM arrival at Bhimashankar. Pre-coordinated VIP darshan through verified purohit escort. Satvik lunch in the Sahyadri foothills, transit towards Nashik. Night halt at Trimbak.</p>
                  <div className="mt-2 text-[10px] text-amber-800 font-mono bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">Bus MH-14-BT-3321 • Check-in: Hotel Panchavati Trimbak</div>
                </div>

                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">2</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Day 2 • Trimbakeshwar to Shirdi Sai & Grishneshwar</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Kushavarta Snan, Trimbak Darshan & Ellora Caves Sanctum</div>
                  <p className="text-xs text-slate-600 mt-1">05:30 AM holy snan at Kushavarta Kund followed by Trimbakeshwar Jyotirlinga Jalabhishek. 11:00 AM scenic transit to Ellora for Grishneshwar Jyotirlinga (12th shrine). Evening transit to Shirdi for Samadhi temple Dhoop Aarti.</p>
                  <div className="mt-2 text-[10px] text-amber-800 font-mono bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">Aarti Timing Sync: 18:30 PM • Check-in: Hotel Sai Leela Shirdi</div>
                </div>

                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">3</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Days 3 – 7 • Marathwada Shrines & Holy Return</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Aundha Nagnath, Parli Vaijnath & Shani Shingnapur</div>
                  <p className="text-xs text-slate-600 mt-1">Covering ancient Hemadpanthi temple of Aundha Nagnath, sacred medicinal healing water at Parli Vaijnath, followed by Shani Shingnapur Darshan. Direct return transit to Pune/Nagpur with comfortable sleeper coach accommodations.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-amber-100 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">All-Inclusive Package Price</span>
                <span className="text-2xl font-extrabold text-slate-900">₹64,999</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Save or Print Itinerary"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Save / Print PDF Itinerary</span>
              </button>
            </div>
          </div>

          {/* Blueprint 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase">Divine Uttar Pradesh</span>
                  <h3 className="text-xl font-extrabold text-slate-900">Ayodhya Ram Mandir & Kashi Corridor</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">4 Days / 3 Nights</span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">1</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Day 1 • Varanasi Arrival & Kashi Vishwanath Corridor</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Ganga Jalabhishek & Grand Evening Dashashwamedh Aarti</div>
                  <p className="text-xs text-slate-600 mt-1">Guaranteed 07:00 AM hotel check-in. Walk through the newly built Kashi Vishwanath Dham corridor. Special entry darshan of Baba Vishwanath and Annapurna Mandir. 06:00 PM private electric boat for Dashashwamedh Ghat Maha Aarti.</p>
                  <div className="mt-2 text-[10px] text-amber-800 font-mono bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">Ghat Proximity Hotel • Includes: Ganga Jal Patra for Abhishek</div>
                </div>

                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">2</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Day 2 • Triveni Sangam Prayagraj Snan & Transit</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Sangam Boat Ride, Bade Hanuman & Ayodhya Transit</div>
                  <p className="text-xs text-slate-600 mt-1">Morning AC coach journey to Prayagraj (2.5 hrs). Holy dip at Triveni Sangam (Ganga, Yamuna, Saraswati) with Purohit puja assist. Darshan of sleeping Hanuman Ji and Alopi Devi Shaktipeeth. Afternoon AC highway transit to Ayodhya Dham.</p>
                  <div className="mt-2 text-[10px] text-amber-800 font-mono bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">Transit: NH-330 Fast Highway • Check-in: Ramayana Divine Stay</div>
                </div>

                <div className="relative pl-8">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center absolute left-0 top-0 ring-4 ring-amber-100">3</span>
                  <div className="text-xs font-extrabold text-brand-scarlet uppercase">Days 3 - 4 • Ayodhya Ramlalla Darshan & Saryu Aarti</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Shri Ram Janmabhoomi Teerth Kshetra & Kanak Bhavan</div>
                  <p className="text-xs text-slate-600 mt-1">Morning dedicated pass for Ram Lalla Balak Roop Darshan. Visit to Hanuman Garhi and Kanak Bhavan. Evening tranquil Aarti at Ram Ki Paidi on the banks of holy Saryu River. Return departure coordinated directly with bus sleeper timing.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-amber-100 mt-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">All-Inclusive Package Price</span>
                <span className="text-2xl font-extrabold text-slate-900">₹54,999</span>
                <span className="text-xs text-slate-500"> / person</span>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-scarlet text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Save or Print Itinerary"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Save / Print PDF Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
