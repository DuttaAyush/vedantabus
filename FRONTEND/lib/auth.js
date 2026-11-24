// Authentication Helpers

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('auth_user');
    if (!u || u === 'null' || u === 'undefined') return null;
    const parsed = JSON.parse(u);
    return parsed && typeof parsed === 'object' && (parsed.id || parsed.email || parsed.phone) ? parsed : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const token =
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined' || token.trim() === '') return null;
  return token;
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  const user = getStoredUser();
  const token = getStoredToken();
  return Boolean(user && token);
}

export function openAuthModal(mode = 'login') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
  }
}

export async function logoutUser(redirectTo = '/') {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }
}

export function getUserAvatar(user) {
  if (user?.avatar && typeof user.avatar === 'string' && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) && !user.avatar.includes('pravatar')) {
    return user.avatar;
  }
  return '/images/avatar.png';
}
