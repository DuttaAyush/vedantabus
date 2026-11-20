const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function resolveApiBaseUrl() {
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    rawApiUrl.startsWith('http://') &&
    !rawApiUrl.includes('localhost') &&
    !rawApiUrl.includes('127.0.0.1')
  ) {
    return rawApiUrl.replace(/^http:\/\//i, 'https://');
  }
  return rawApiUrl;
}

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * apiFetch — authenticated fetch for the customer frontend.
 *
 * Auth strategy (in priority order):
 * 1. httpOnly cookie sent automatically by the browser (credentials: 'include')
 * 2. Fallback: Bearer token from localStorage (for dev/compat)
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Try reading token from localStorage as fallback (dev mode or if cookie is not set)
  const token =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('auth_token') || localStorage.getItem('token'))) ||
    null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    return await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // sends httpOnly auth cookie automatically
    });
  } catch (err) {
    console.warn(`[apiFetch] Network error for ${url}:`, err?.message || err);
    return {
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({ success: false, message: 'Backend service temporarily unavailable', data: null }),
      text: async () => JSON.stringify({ success: false, message: 'Backend service temporarily unavailable' }),
    };
  }
}
