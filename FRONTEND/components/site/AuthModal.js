'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiFetch } from '@/lib/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' or 'email'

  // Mobile / OTP state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Email / Password login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [gender, setGender] = useState('Male');
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [referralCode, setReferralCode] = useState('');

  // UI / Validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrors({});
      setSuccessMessage('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  if (!isOpen || !mounted) return null;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: '' }));
    }
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const validateMobile = (num) => {
    const clean = (num || '').replace(/\D/g, '');
    if (!clean) return 'Mobile number is required.';
    if (clean.length !== 10) return 'Mobile number should be 10 digits.';
    if (!/^[6-9]\d{9}$/.test(clean)) return 'Please enter a valid Indian mobile number starting with 6-9.';
    return '';
  };

  const validateEmail = (val) => {
    const trimmed = (val || '').trim();
    if (!trimmed) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@example.com).';
    return '';
  };

  const validatePassword = (pwd) => {
    if (!pwd) return 'Password is required.';
    if (pwd.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const mobileErr = validateMobile(mobileNumber);
    if (mobileErr) {
      setErrors((prev) => ({ ...prev, mobile: mobileErr }));
      return;
    }
    setErrors({});
    setIsOtpSent(true);
    setSuccessMessage(`OTP sent to +91 ${mobileNumber}. (Use code 123456 or any 6 digits for testing)`);
  };

  const handleMobileLogin = async (e) => {
    e.preventDefault();
    const mobileErr = validateMobile(mobileNumber);
    if (mobileErr) {
      setErrors((prev) => ({ ...prev, mobile: mobileErr }));
      return;
    }
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter the complete 6-digit OTP code.' }));
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          phone: mobileNumber,
          password: enteredOtp,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.data?.accessToken || data.accessToken || 'token_' + Date.now();
        const user = data.data?.user || data.user || {
          id: 'usr_' + Date.now(),
          name: `User ${mobileNumber.slice(-4)}`,
          phone: mobileNumber,
          email: `${mobileNumber}@VedantaBus.in`,
          role: 'USER',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('storage'));
        }
        setSuccessMessage(`Welcome back, ${user.name || 'Traveller'}! Logging in...`);
        setTimeout(() => onClose(), 600);
      } else {
        setErrors({ general: data.message || 'Verification failed. Please verify your OTP.' });
      }
    } catch {
      setErrors({ general: 'Unable to connect to the server. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(loginEmail);
    const passwordErr = validatePassword(loginPassword);

    if (emailErr || passwordErr) {
      setErrors({
        email: emailErr,
        password: passwordErr,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.data?.accessToken || data.accessToken || 'token_' + Date.now();
        const user = data.data?.user || data.user || {
          id: 'usr_' + Date.now(),
          name: loginEmail.split('@')[0],
          email: loginEmail.trim(),
          role: 'USER',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('storage'));
        }
        setSuccessMessage(`Welcome back, ${user.name}! Logging in...`);
        setTimeout(() => onClose(), 600);
      } else {
        setErrors({ general: data.message || 'Invalid email or password. Please verify your credentials.' });
      }
    } catch {
      setErrors({ general: 'Unable to connect to the server. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    const emailErr = validateEmail(signupEmail);
    if (emailErr) newErrors.signupEmail = emailErr;
    const mobileErr = validateMobile(signupMobile);
    if (mobileErr) newErrors.signupMobile = mobileErr;
    const pwdErr = validatePassword(signupPassword);
    if (pwdErr) newErrors.signupPassword = pwdErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: fullName.trim(),
          email: signupEmail.trim(),
          phone: signupMobile.trim(),
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const token = data.data?.accessToken || data.accessToken || 'token_' + Date.now();
        const user = data.data?.user || data.user || {
          id: 'usr_' + Date.now(),
          name: fullName.trim(),
          email: signupEmail.trim(),
          phone: signupMobile.trim(),
          role: 'USER',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
          window.dispatchEvent(new Event('auth-change'));
          window.dispatchEvent(new Event('storage'));
        }
        setSuccessMessage(`Account created successfully for ${fullName}! Welcome aboard.`);
        setTimeout(() => onClose(), 600);
      } else {
        setErrors({ general: data.message || 'Registration failed. Please check your details.' });
      }
    } catch {
      setErrors({ general: 'Unable to connect to the server. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xl animate-fadeIn overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      {/* FLOATING GLASS CONTAINER (CENTERED & CONSTRAINED) */}
      <div
        className="bg-white/95 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] overflow-hidden max-w-4xl lg:max-w-5xl w-full border border-white/60 shadow-2xl grid grid-cols-1 md:grid-cols-12 relative animate-scaleUp my-auto max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Close Dialog"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
        </button>

        {/* LEFT COLUMN: FORM SECTION */}
        <div className="md:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-white/90 space-y-4 sm:space-y-6 overflow-y-auto max-h-[92dvh] sm:max-h-[90vh] overscroll-contain no-scrollbar">
          {/* Header & Logo */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="VedantaBus Logo" className="h-7 sm:h-8 w-auto object-contain" />
              </div>

              {/* Mode Toggle Switcher: Log In / Sign Up */}
              <div className="p-1 bg-slate-100 rounded-full border border-slate-200/80 flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                    setSuccessMessage('');
                  }}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-bold text-[11px] sm:text-xs transition-all ${
                    mode === 'login' ? 'bg-brand-scarlet text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                    setSuccessMessage('');
                  }}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-bold text-[11px] sm:text-xs transition-all ${
                    mode === 'signup' ? 'bg-brand-scarlet text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {mode === 'login' ? (
              <>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900">Login to your account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {loginMethod === 'mobile'
                    ? 'Enter your mobile number to receive a secure login OTP'
                    : 'Enter your registered email and password to continue'}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900">Create your Account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Join thousands of travellers exploring India with comfort &amp; safety.
                </p>
              </>
            )}
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              {successMessage}
            </div>
          )}

          {/* GENERAL ERROR MESSAGE */}
          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {errors.general}
            </div>
          )}

          {/* FORM BODY */}
          {mode === 'login' ? (
            <div className="space-y-4">
              {/* LOGIN METHOD SUB-TOGGLE: Mobile OTP vs Email & Password */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('mobile');
                    setErrors({});
                  }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">smartphone</span>
                  <span>Mobile &amp; OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrors({});
                  }}
                  className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Email &amp; Password</span>
                </button>
              </div>

              {loginMethod === 'mobile' ? (
                /* ── METHOD A: MOBILE & OTP ── */
                <form onSubmit={isOtpSent ? handleMobileLogin : handleSendOtp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
                    <div
                      className={`flex items-center bg-slate-50 border rounded-2xl p-1.5 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                        errors.mobile ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border-r border-slate-200 text-xs font-bold text-slate-800">
                        <span className="text-base">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setMobileNumber(val);
                          if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                        }}
                        onBlur={() => {
                          if (mobileNumber && mobileNumber.length < 10) {
                            setErrors((prev) => ({ ...prev, mobile: 'Mobile number should be 10 digits.' }));
                          }
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full bg-transparent px-3 py-1.5 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                    {/* Error just below mobile input */}
                    {errors.mobile && <p className="text-red-500 text-xs font-medium mt-1">{errors.mobile}</p>}
                  </div>

                  {isOtpSent && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-slate-700">Verify with OTP</label>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="font-bold text-brand-scarlet hover:underline"
                        >
                          Resend OTP
                        </button>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-full h-10 sm:h-11 text-center font-black text-slate-900 text-base sm:text-lg bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-scarlet focus:bg-white outline-none transition-all"
                          />
                        ))}
                      </div>
                      {/* Error just below OTP input */}
                      {errors.otp && <p className="text-red-500 text-xs font-medium mt-1">{errors.otp}</p>}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Please wait...' : isOtpSent ? 'Verify & Continue' : 'Send Login OTP'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('email');
                        setErrors({});
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-brand-scarlet transition-colors"
                    >
                      Prefer email? <span className="text-brand-scarlet underline">Login with Email &amp; Password</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* ── METHOD B: EMAIL & PASSWORD ── */
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Email Address</label>
                    <div
                      className={`flex items-center bg-slate-50 border rounded-2xl px-3.5 py-2.5 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2.5">mail</span>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="e.g. rahul.sharma@example.com"
                        className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                    {/* Error just below email input */}
                    {errors.email && <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your registered email.')}
                        className="text-slate-500 hover:text-brand-scarlet font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div
                      className={`flex items-center bg-slate-50 border rounded-2xl px-3.5 py-2.5 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                        errors.password ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2.5">lock</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        placeholder="Enter your account password"
                        className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 ml-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {/* Error just below password input */}
                    {errors.password && <p className="text-red-500 text-xs font-medium mt-1">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[46px] rounded-2xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Logging in...' : 'Log In with Email'}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('mobile');
                        setErrors({});
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-brand-scarlet transition-colors"
                    >
                      Prefer mobile? <span className="text-brand-scarlet underline">Login with Phone &amp; OTP</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Mode Switcher Link */}
              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-brand-scarlet transition-colors"
                >
                  Don&apos;t have an account? <span className="text-brand-scarlet underline">Create Account ➔</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── SIGN UP FORM ── */
            <form onSubmit={handleSubmitSignup} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <div
                  className={`flex items-center bg-slate-50 border rounded-xl px-3 py-2 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">person</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs font-medium mt-1">{errors.fullName}</p>}
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                  <div
                    className={`flex items-center bg-slate-50 border rounded-xl px-3 py-2 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                      errors.signupEmail ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">mail</span>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (errors.signupEmail) setErrors((prev) => ({ ...prev, signupEmail: '' }));
                      }}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.signupEmail && <p className="text-red-500 text-xs font-medium mt-1">{errors.signupEmail}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Mobile Number *</label>
                  <div
                    className={`flex items-center bg-slate-50 border rounded-xl p-1 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                      errors.signupMobile ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1 px-2 py-1 border-r border-slate-200 text-xs font-bold text-slate-800">
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={signupMobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setSignupMobile(val);
                        if (errors.signupMobile) setErrors((prev) => ({ ...prev, signupMobile: '' }));
                      }}
                      onBlur={() => {
                        if (signupMobile && signupMobile.length < 10) {
                          setErrors((prev) => ({ ...prev, signupMobile: 'Mobile number should be 10 digits.' }));
                        }
                      }}
                      placeholder="10-digit number"
                      className="w-full bg-transparent px-2 py-1 text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.signupMobile && <p className="text-red-500 text-xs font-medium mt-1">{errors.signupMobile}</p>}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Password *</label>
                <div
                  className={`flex items-center bg-slate-50 border rounded-xl px-3 py-2 focus-within:border-brand-scarlet focus-within:bg-white transition-all ${
                    errors.signupPassword ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">lock</span>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (errors.signupPassword) setErrors((prev) => ({ ...prev, signupPassword: '' }));
                    }}
                    placeholder="Create a strong password (min 6 characters)"
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="text-slate-400 hover:text-slate-600 ml-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showSignupPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.signupPassword && (
                  <p className="text-red-500 text-xs font-medium mt-1">{errors.signupPassword}</p>
                )}
              </div>

              {/* Gender & Age Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Gender</label>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                          gender === g
                            ? 'bg-red-50 text-brand-scarlet border border-red-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Age Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-brand-scarlet"
                  >
                    <option value="18-24">18-24 Years</option>
                    <option value="25-34">25-34 Years</option>
                    <option value="35-44">35-44 Years</option>
                    <option value="45+">45+ Years</option>
                  </select>
                </div>
              </div>

              {/* Primary Signup Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded-xl bg-brand-scarlet hover:bg-brand-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </button>

              {/* Switcher Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-brand-scarlet transition-colors"
                >
                  Already have an account? <span className="text-brand-scarlet underline">Log In ➔</span>
                </button>
              </div>
            </form>
          )}

          {/* BOTTOM TRUST BADGES */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
              <span className="text-[10px] font-bold text-slate-700 mt-0.5">Safe &amp; Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">local_offer</span>
              <span className="text-[10px] font-bold text-slate-700 mt-0.5">0% Markup</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-cyan-600 text-[18px]">headset_mic</span>
              <span className="text-[10px] font-bold text-slate-700 mt-0.5">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO BACKGROUND IMAGE & FEATURE BADGES */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden bg-slate-950 max-h-[92dvh] sm:max-h-[90vh]">
          <img
            src="/images/domestic-hero.jpg"
            alt="Luxury Coach on Expressway"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />

          {/* Top Pill Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-amber-400 text-[15px]">stars</span>
              <span>PREMIUM BUS TRAVEL ACROSS INDIA</span>
            </div>
          </div>

          {/* Middle Headline */}
          <div className="relative z-10 space-y-2.5">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white leading-tight">
              {mode === 'login' ? 'Comfortable Journeys for a Brighter Bharat' : 'Explore India in Greater Comfort'}
            </h3>
            <div className="w-12 h-1 bg-brand-scarlet rounded-full" />
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              Daily direct luxury BharatBenz &amp; Volvo sleeper coaches with assigned bus numbers and zero hidden aggregator fees.
            </p>
          </div>

          {/* Bottom Feature Badges */}
          <div className="relative z-10 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">directions_bus</span>
              <span>Luxury Sleeper Coaches</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">map</span>
              <span>Pan India Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">verified</span>
              <span>Assigned Bus Plate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-400 text-[18px]">money_off</span>
              <span>0% Convenience Markup</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
