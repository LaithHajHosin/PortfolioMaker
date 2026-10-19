import { ApiResponse, AuthResponseData, Portfolio, PublicPortfolioData } from '../types/portfolio.ts';

const TOKEN_KEY = 'flareport_auth_token';

export const TokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = TokenStorage.get();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  let isJson = false;
  let data: any;
  try {
    data = await response.json();
    isJson = true;
  } catch {
    isJson = false;
    let friendlyMessage = 'Backend communication error.';
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      friendlyMessage = 'Server is initializing. Please wait a moment and try again.';
    } else if (response.status === 404) {
      friendlyMessage = 'The requested API endpoint was not found.';
    } else if (response.status === 401) {
      friendlyMessage = 'Your session has expired. Please sign in again.';
    } else if (!response.ok) {
      friendlyMessage = `Server error (${response.status}). Please try again.`;
    } else {
      friendlyMessage = 'Received an invalid response format from server.';
    }
    data = { success: false, message: friendlyMessage };
  }

  if (!response.ok || !isJson || !data.success) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  auth: {
    register: (body: { username: string; email: string; password: string }) =>
      request<AuthResponseData>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    login: (body: { login: string; password: string }) =>
      request<AuthResponseData>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    me: () =>
      request<{ user: any; portfolio: Portfolio }>('/api/auth/me', {
        method: 'GET',
      }),

    updateProfile: (body: { email?: string; username?: string }) =>
      request<{ user: any; token: string }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  portfolio: {
    getPublic: (username: string) =>
      request<PublicPortfolioData>(`/api/portfolio/${encodeURIComponent(username)}`, {
        method: 'GET',
      }),

    update: (data: Partial<Portfolio>) =>
      request<Portfolio>('/api/portfolio', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  upload: {
    single: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return request<{ url: string; filename: string; size: number }>('/api/upload', {
        method: 'POST',
        body: formData,
      });
    },
  },
};
