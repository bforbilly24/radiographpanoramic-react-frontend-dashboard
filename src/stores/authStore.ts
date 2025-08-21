// src/stores/authStore.ts
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    accessToken: string;
    setUser: (user: AuthUser | null) => void;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = Cookies.get('accessToken') || '';
  const initialUser = (() => {
    try {
      const stored = localStorage.getItem('auth-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();
  
  return {
    auth: {
      user: initialUser,
      accessToken: initialToken,
      setUser: (user) => {
        if (user) {
          localStorage.setItem('auth-user', JSON.stringify(user));
        } else {
          localStorage.removeItem('auth-user');
        }
        return set((state) => ({ auth: { ...state.auth, user } }));
      },
      setAccessToken: (accessToken) => {
        Cookies.set('accessToken', accessToken, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
          path: '/', // Ensure cookie is available site-wide
        });
        return set((state) => ({ auth: { ...state.auth, accessToken } }));
      },
      resetAccessToken: () => {
        Cookies.remove('accessToken', { path: '/' });
        return set((state) => ({ auth: { ...state.auth, accessToken: '' } }));
      },
      reset: () => {
        Cookies.remove('accessToken', { path: '/' });
        localStorage.removeItem('auth-user');
        return set((state) => ({
          auth: { ...state.auth, user: null, accessToken: '' },
        }));
      },
    },
  };
});