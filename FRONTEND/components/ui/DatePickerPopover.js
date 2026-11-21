'use client';

import React, { useState, useEffect, useRef } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePickerPopover({
  isOpen,
  onClose,
  onSelectDate,
  selectedDate,
  themeColor = 'red',
  position = 'auto',
  defaultPosition = 'top',
  align = 'center'
}) {
  // Get today in IST (UTC+5:30) regardless of server/browser timezone
  const getTodayIST = () => {
    const now = new Date();
    // IST offset is +5:30 = 330 minutes
    const istOffset = 330;
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const istDate = new Date(utcMs + istOffset * 60000);
    return new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate(), 0, 0, 0, 0);
  };

  const [viewDate, setViewDate] = useState(() => getTodayIST());
  const [activeDate, setActiveDate] = useState(() => getTodayIST());
  const [computedPosition, setComputedPosition] = useState(
    position === 'auto' ? defaultPosition : position
  );
  const popoverRef = useRef(null);

  // Dynamic auto positioning based on available viewport space
  useEffect(() => {
    if (!isOpen) return;

    if (position !== 'auto') {
      setComputedPosition(position);
      return;
    }

    const calculatePosition = () => {
      if (!popoverRef.current || !popoverRef.current.parentElement) {
        setComputedPosition(defaultPosition);
        return;
      }
      const parentRect = popoverRef.current.parentElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceAbove = parentRect.top;
      const spaceBelow = viewportHeight - parentRect.bottom;

      // Popover height required for full calendar (~360px)
      const requiredHeight = 360;

      if (spaceBelow < requiredHeight && spaceAbove > spaceBelow) {
        setComputedPosition('top');
      } else if (spaceAbove < requiredHeight && spaceBelow > spaceAbove) {
        setComputedPosition('bottom');
      } else {
        setComputedPosition(defaultPosition);
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, { passive: true });
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isOpen, position, defaultPosition]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const today = getTodayIST();

  const formatDateOutput = (d) => {
    const isToday = d.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();

    const dayName = SHORT_DAYS[d.getDay()];
    const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' });

    let labelPrefix = '';
    if (isToday) labelPrefix = 'Today, ';
    else if (isTomorrow) labelPrefix = 'Tomorrow, ';

    return {
      mainText: `${labelPrefix}${dayNum} ${monthShort}`,
      subText: fullDayName,
      rawDate: d
    };
  };

  const handleDayClick = (e, dayNumber) => {
    e.stopPropagation();
    const clickedDate = new Date(currentYear, currentMonth, dayNumber);
    if (clickedDate < today) return;

    setActiveDate(clickedDate);
    const result = formatDateOutput(clickedDate);
    onSelectDate(result);
    onClose();
  };

  const handleShortcutClick = (e, offsetDays) => {
    e.stopPropagation();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offsetDays);
    setActiveDate(targetDate);
    setViewDate(targetDate);
    const result = formatDateOutput(targetDate);
    onSelectDate(result);
    onClose();
  };

  const themeStyles = {
    red: {
      accentBg: 'bg-brand-scarlet',
      accentText: 'text-brand-scarlet',
      borderFocus: 'border-brand-scarlet',
      badgeBg: 'bg-red-50 text-brand-scarlet border-red-200'
    },
    amber: {
      accentBg: 'bg-amber-600',
      accentText: 'text-amber-500',
      borderFocus: 'border-amber-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    teal: {
      accentBg: 'bg-teal-600',
      accentText: 'text-teal-600',
      borderFocus: 'border-teal-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  };

  const currentTheme = themeStyles[themeColor] || themeStyles.red;

  const positionClasses = computedPosition === 'top'
    ? 'bottom-full mb-3.5'
    : 'top-full mt-3.5';

  const alignClasses = align === 'left'
    ? 'left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
    : align === 'right'
    ? 'left-1/2 -translate-x-1/2 sm:right-0 sm:left-auto sm:translate-x-0'
    : 'left-1/2 -translate-x-1/2';

  const arrowClasses = computedPosition === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.08)]'
    : 'bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-white drop-shadow-[0_-2px_3px_rgba(0,0,0,0.08)]';

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      aria-label="Date Picker Bubble"
      className={`absolute ${positionClasses} ${alignClasses} z-[99999] w-80 sm:w-88 max-w-[calc(100vw-1.5rem)] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.35)] border border-slate-200/90 p-3 sm:p-4 text-slate-800 animate-in fade-in zoom-in-95 duration-200`}
    >
      {/* Speech Bubble Arrow Indicator */}
      <div className={`absolute ${arrowClasses}`} />

      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-[18px] ${currentTheme.accentText}`}>
            calendar_month
          </span>
          <span className="font-serif text-sm font-bold text-slate-900">Select Date</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>

      {/* Quick Choice Chips */}
      <div className="flex flex-wrap gap-1.5 my-3">
        <button
          type="button"
          onClick={(e) => handleShortcutClick(e, 0)}
          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={(e) => handleShortcutClick(e, 1)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${currentTheme.badgeBg}`}
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={(e) => {
            const day = today.getDay();
            const diff = (6 - day + 7) % 7 || 7;
            handleShortcutClick(e, diff);
          }}
          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Saturday
        </button>
        <button
          type="button"
          onClick={(e) => handleShortcutClick(e, 7)}
          className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Next Week
        </button>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between my-1 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="w-7 h-7 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
        <div className="font-extrabold text-xs text-slate-900">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="w-7 h-7 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase my-1">
        {SHORT_DAYS.map((day) => (
          <div key={day} className="py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`blank-${idx}`} className="p-1" />
        ))}

        {Array.from({ length: totalDays }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateObj = new Date(currentYear, currentMonth, dayNum);
          const isPast = dateObj < today;
          const isToday = dateObj.toDateString() === today.toDateString();
          const isSelected = activeDate && dateObj.toDateString() === activeDate.toDateString();

          return (
            <button
              key={dayNum}
              type="button"
              disabled={isPast}
              onClick={(e) => handleDayClick(e, dayNum)}
              className={`h-7 w-7 sm:h-8 sm:w-8 mx-auto rounded-full flex items-center justify-center text-[11px] sm:text-xs transition-all ${
                isPast
                  ? 'text-slate-300 cursor-not-allowed'
                  : isSelected
                  ? `${currentTheme.accentBg} text-white font-extrabold shadow-md scale-105`
                  : isToday
                  ? `border-2 ${currentTheme.borderFocus} text-slate-900 font-bold hover:bg-slate-100`
                  : 'text-slate-800 hover:bg-slate-100 font-medium'
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
