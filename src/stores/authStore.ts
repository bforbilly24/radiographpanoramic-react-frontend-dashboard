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
//   console.log('Initial accessToken from cookies:', initialToken); // Debug log
  return {
    auth: {
      user: null,
      accessToken: initialToken,
      setUser: (user) => set((state) => ({ auth: { ...state.auth, user } })),
      setAccessToken: (accessToken) => {
        Cookies.set('accessToken', accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        return set((state) => ({ auth: { ...state.auth, accessToken } }));
      },
      resetAccessToken: () => {
        Cookies.remove('accessToken');
        return set((state) => ({ auth: { ...state.auth, accessToken: '' } }));
      },
      reset: () => {
        Cookies.remove('accessToken');
        return set((state) => ({
          auth: { ...state.auth, user: null, accessToken: '' },
        }));
      },
    },
  };
});