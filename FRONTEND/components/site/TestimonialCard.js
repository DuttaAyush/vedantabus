'use client';

import React from 'react';

export default function TestimonialCard({
  avatar,
  name,
  route,
  quote,
  rating = 5,
  destImage,
  destLabel,
  className = ''
}) {
  return (
    <div
      className={`bg-white rounded-lg p-2.5 sm:p-3 shadow-md shadow-slate-900/5 border border-slate-200/80 flex items-center justify-between gap-2.5 sm:gap-3 max-w-[250px] sm:max-w-[280px] w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300 group cursor-pointer ${className}`}
    >
      {/* Left side info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5">
          <img
            src={avatar}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
          />
          <div className="flex items-center text-amber-400">
            {Array.from({ length: rating }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[13px] sm:text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-800 leading-tight line-clamp-2">
          &ldquo;{quote}&rdquo;
        </p>

        <div>
          <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-none">{name}</h4>
          <p className="text-[8px] sm:text-[9.5px] font-semibold text-slate-400 tracking-tight mt-0.5">
            {route}
          </p>
        </div>
      </div>

      {/* Right side 3:4 ratio portrait destination preview image */}
      {destImage && (
        <div className="relative w-14 h-[72px] sm:w-16 sm:h-[84px] aspect-[3/4] rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-100 group-hover:scale-[1.03] transition-transform duration-300">
          <img
            src={destImage}
            alt={destLabel || name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {destLabel && (
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-lg bg-white/95 text-[8px] sm:text-[8.5px] font-extrabold text-slate-800 border border-white/60 shadow-sm">
              {destLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
