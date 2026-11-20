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

export async function adminFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    // Auto-clean stale or expired tokens from localStorage on 401/403
    if (typeof window !== 'undefined' && (res.status === 401 || res.status === 403)) {
      try {
        const cloned = res.clone();
        const data = await cloned.json();
        if (data?.message && (data.message.includes('expired') || data.message.includes('Invalid access token') || data.message.includes('malformed'))) {
          localStorage.removeItem('admin_token');
        }
      } catch {}
    }
    return res;
  } catch (err) {
    console.warn(`[adminFetch] Network error for ${url}:`, err?.message || err);
    return {
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({ success: false, message: 'Backend service temporarily unavailable', data: [] }),
      text: async () => JSON.stringify({ success: false, message: 'Backend service temporarily unavailable' }),
    };
  }
}
