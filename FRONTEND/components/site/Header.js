'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import { getStoredUser, logoutUser, getUserAvatar } from '@/lib/auth';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState('login');

  useEffect(() => {
    setMounted(true);
    const loadUser = () => {
      setCurrentUser(getStoredUser());
    };
    loadUser();

    const handleOpenAuth = (e) => {
      if (e?.detail?.mode) {
        setAuthModalInitialMode(e.detail.mode);
      }
      setIsAuthModalOpen(true);
    };

    window.addEventListener('auth-change', loadUser);
    window.addEventListener('storage', loadUser);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => {
      window.removeEventListener('auth-change', loadUser);
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logoutUser('/');
  };


  const isBusTicketsActive = pathname === '/';
  const isSpiritualActive = pathname === '/spiritual';
  const isInternationalActive = pathname === '/international';
  const isDomesticActive = pathname === '/domestic';
  const isCategoryPage =
    isBusTicketsActive ||
    isSpiritualActive ||
    isInternationalActive ||
    isDomesticActive;

  const profileRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Desktop hover for profile dropdown
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsProfileOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 180);
  };

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menus on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Reset scroll to hero section if requested
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('resetHero')) {
        sessionStorage.removeItem('resetHero');
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch (err) {}
  }, [pathname]);

  // Handle click on Navbar Logo or Bus Tickets: smooth scroll to hero & quick reload
  const handleLogoOrBusClick = (e) => {
    setIsMobileMenuOpen(false);
    try {
      sessionStorage.setItem('resetHero', 'true');
    } catch (err) {}

    if (pathname === '/') {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
          }
          window.location.reload();
        }, 120);
      }
    }
  };

  const getHashHref = (hash) => {
    return pathname === '/' ? hash : `/${hash}`;
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-slate-950/75 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-8 xl:px-10 h-16 sm:h-18 lg:h-20 min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5rem] flex items-center justify-between gap-2 sm:gap-4 relative">
        
        {/* Left Side: Logo & Category Capsule */}
        <div className="flex items-center gap-3 xl:gap-5 shrink-0">
          <Link
            className="flex items-center gap-2 group transition-transform active:scale-95 shrink-0"
            href="/"
            onClick={handleLogoOrBusClick}
          >
            <div className="px-2 sm:px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-md flex items-center justify-center">
              <img
                alt="VedantaBus Logo"
                className="h-6 sm:h-7 w-auto object-contain"
                src="/images/logo.png"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </Link>

          {/* Apple Frosted Glass Category Switcher Capsule (Visible >=1024px) */}
          <div className="hidden lg:flex items-center p-1 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 shadow-lg shrink-0">
            {/* Bus Tickets */}
            <Link
              className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3.5 py-1 xl:py-1.5 rounded-full font-semibold text-[11px] xl:text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                isBusTicketsActive
                  ? 'bg-gradient-to-r from-red-600/90 to-brand-scarlet/90 text-white shadow-md border border-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              href="/"
              onClick={handleLogoOrBusClick}
            >
              <span
                className={`material-symbols-outlined text-[14px] xl:text-[15px] transition-colors duration-200 ${
                  isBusTicketsActive
                    ? 'text-white'
                    : !isCategoryPage
                    ? 'text-brand-scarlet'
                    : 'text-white/70'
                }`}
              >
                directions_bus
              </span>
              <span>Bus Tickets</span>
            </Link>

            {/* Spiritual Yatras */}
            <Link
              className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full font-semibold text-[11px] xl:text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                isSpiritualActive
                  ? 'bg-gradient-to-r from-amber-600/90 to-amber-500/90 text-white shadow-md border border-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              href="/spiritual"
            >
              <span
                className={`material-symbols-outlined text-[14px] xl:text-[15px] transition-colors duration-200 ${
                  isSpiritualActive
                    ? 'text-white'
                    : !isCategoryPage
                    ? 'text-amber-400'
                    : 'text-white/70'
                }`}
              >
                temple_hindu
              </span>
              <span>Spiritual Yatras</span>
            </Link>

            {/* International */}
            <Link
              className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full font-semibold text-[11px] xl:text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                isInternationalActive
                  ? 'bg-gradient-to-r from-teal-600/90 to-teal-500/90 text-white shadow-md border border-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              href="/international"
            >
              <span
                className={`material-symbols-outlined text-[14px] xl:text-[15px] transition-colors duration-200 ${
                  isInternationalActive
                    ? 'text-white'
                    : !isCategoryPage
                    ? 'text-emerald-400'
                    : 'text-white/70'
                }`}
              >
                flight_takeoff
              </span>
              <span>International</span>
            </Link>

            {/* Domestic */}
            <Link
              className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3 py-1 xl:py-1.5 rounded-full font-semibold text-[11px] xl:text-xs tracking-wide whitespace-nowrap transition-all duration-200 ${
                isDomesticActive
                  ? 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white shadow-md border border-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              href="/domestic"
            >
              <span
                className={`material-symbols-outlined text-[14px] xl:text-[15px] transition-colors duration-200 ${
                  isDomesticActive
                    ? 'text-white'
                    : !isCategoryPage
                    ? 'text-sky-400'
                    : 'text-white/70'
                }`}
              >
                landscape
              </span>
              <span>Domestic</span>
            </Link>
          </div>
        </div>

        {/* Center: Adaptive Navbar Text Links */}
        <Navbar />

        {/* Right Side: Profile Action Pill & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Profile Action Pill or Login Button */}
          {currentUser ? (
            <div
              ref={profileRef}
              className="hidden lg:block relative shrink-0 py-1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/profile"
                onClick={() => setIsProfileOpen(false)}
                aria-expanded={isProfileOpen}
                aria-label="User profile and account menu"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/30 bg-white/15 hover:bg-white/25 text-white backdrop-blur-xl font-bold text-[11px] sm:text-xs transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <img
                  alt="Profile Avatar"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/40 shrink-0"
                  src={getUserAvatar(currentUser)}
                />
                <span className="hidden sm:inline">{currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}</span>
                <span className={`material-symbols-outlined text-[14px] text-white/70 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </Link>

              {/* PROFILE DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 sm:w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  {/* Profile User Badge Header */}
                  <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-3">
                    <img
                      alt="Profile Avatar"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-scarlet/50 shrink-0"
                      src={getUserAvatar(currentUser)}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name || 'Traveler'}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email || currentUser.phone || '+91-8208024895'}</p>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-400">directions_bus</span>
                    <span>Upcoming Trips</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] text-teal-400">confirmation_number</span>
                    <span>View Tickets &amp; Bookings</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] text-cyan-400">group</span>
                    <span>Saved Passengers</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] text-purple-400">manage_accounts</span>
                    <span>Edit Profile &amp; Settings</span>
                  </Link>

                  <div className="border-t border-white/10 my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/15 hover:bg-brand-scarlet text-white backdrop-blur-xl font-bold text-xs transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Sign In</span>
            </button>
          )}


          {/* Mobile & Tablet Hamburger Button (<1024px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE / TABLET SLIDE-IN NAVIGATION SIDEBAR (<1024px) */}
      {mounted && isMobileMenuOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[99999] flex justify-end">
          {/* Backdrop: Clicking the empty space beside the sidebar closes it */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close sidebar by clicking outside"
          />

          {/* Sidebar Panel: Sticks to the right edge with clean layout */}
          <aside
            className="relative z-10 w-[86vw] max-w-sm sm:max-w-md h-[100dvh] max-h-[100dvh] bg-slate-950/98 backdrop-blur-2xl border-l border-white/15 shadow-2xl flex flex-col overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation sidebar"
          >
            {/* 1. Sidebar Header (Logo + Cross/Close Button) */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-white/95 rounded-lg border border-white/30 shadow-sm flex items-center justify-center">
                  <img
                    alt="VedantaBus Logo"
                    className="h-5 sm:h-6 w-auto object-contain"
                    src="/images/logo.png"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation sidebar"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 overscroll-contain">
              {/* User Profile Card Link */}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt="Profile Avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-scarlet/50 shrink-0"
                    src={getUserAvatar(currentUser)}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Traveler'}</p>
                    <p className="text-[10px] text-slate-300 truncate">{currentUser?.email || currentUser?.phone || 'View Profile'}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
              </Link>

              {/* 1. Travel Categories 2x2 Grid */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Travel Categories
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/"
                    onClick={handleLogoOrBusClick}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      isBusTicketsActive
                        ? 'bg-red-950/60 border-brand-scarlet text-white shadow-lg shadow-red-950/50'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                      </span>
                      {isBusTicketsActive && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-scarlet text-white text-[9px] font-bold">Active</span>
                      )}
                    </div>
                    <span className="text-xs font-bold">Bus Tickets</span>
                    <span className="text-[10px] text-slate-400">Intercity AC Sleepers</span>
                  </Link>

                  <Link
                    href="/spiritual"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      pathname === '/spiritual'
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">temple_hindu</span>
                      </span>
                      {pathname === '/spiritual' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold">Active</span>
                      )}
                    </div>
                    <span className="text-xs font-bold">Spiritual Yatras</span>
                    <span className="text-[10px] text-slate-400">Sacred Darshan &amp; Puja</span>
                  </Link>

                  <Link
                    href="/international"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      pathname === '/international'
                        ? 'bg-teal-950/60 border-teal-500 text-white shadow-lg shadow-teal-950/50'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                      </span>
                      {pathname === '/international' && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[9px] font-bold">Active</span>
                      )}
                    </div>
                    <span className="text-xs font-bold">International</span>
                    <span className="text-[10px] text-slate-400">Global Holidays</span>
                  </Link>

                  <Link
                    href="/domestic"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col p-3 rounded-2xl border transition-all ${
                      pathname === '/domestic'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">landscape</span>
                      </span>
                      {pathname === '/domestic' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">Active</span>
                      )}
                    </div>
                    <span className="text-xs font-bold">Domestic</span>
                    <span className="text-[10px] text-slate-400">Weekend Escapes</span>
                  </Link>
                </div>
              </div>

              {/* 2. Explore Navigation Links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Explore Routes
                </p>
                <div className="space-y-1">
                  <Link
                    href={getHashHref('#popularRoutesSection')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-red-400">alt_route</span>
                      <span>Popular Routes</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>

                  <Link
                    href="/packages"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-amber-400">grid_view</span>
                      <span>Curated Packages</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>

                  <Link
                    href="/gallery"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-purple-400">photo_library</span>
                      <span>Fleet Gallery (Photos)</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-blue-400">info</span>
                      <span>About Us</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>

                  <Link
                    href={getHashHref('#faqSection')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-cyan-400">help_center</span>
                      <span>FAQs</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-brand-scarlet">mail</span>
                      <span>Contact Us</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>
                  </Link>
                </div>
              </div>

              {/* 3. Quick Utilities & Support */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-white">
                  <span className="font-semibold text-slate-300">24/7 Helpline:</span>
                  <a href="tel:8208024895" className="font-bold text-brand-scarlet hover:underline">
                    +91-8208024895
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs text-white">
                  <span className="font-semibold text-slate-300">Fleet Direct:</span>
                  <span className="text-emerald-400 font-bold">0% Booking Markup</span>
                </div>
              </div>
            </div>
          </aside>
        </div>,
        document.body
      )}

      {/* Login & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (typeof window !== 'undefined') {
            try {
              const u = localStorage.getItem('auth_user');
              if (u) setCurrentUser(JSON.parse(u));
            } catch {}
          }
        }}
      />
    </header>
  );
}


