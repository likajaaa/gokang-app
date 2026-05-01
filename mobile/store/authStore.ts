import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';
import { DEV_CONFIG } from '../constants/dev';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;

  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  hydrate: () => Promise<void>;
}

// Dev mode: initialize dengan mock user supaya (tabs) screens langsung
// punya user data tanpa perlu login real.
const initialState = DEV_CONFIG.SKIP_AUTH
  ? {
      user: DEV_CONFIG.MOCK_USER as User,
      token: DEV_CONFIG.MOCK_TOKEN,
      isLoggedIn: true,
      isHydrated: true,
    }
  : {
      user: null,
      token: null,
      isLoggedIn: false,
      isHydrated: false,
    };

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  login: async (token, user) => {
    await SecureStore.setItemAsync('auth_token', token);
    set({ user, token, isLoggedIn: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ user: null, token: null, isLoggedIn: false });
  },

  setUser: (user) => set({ user }),

  // Call once on app start to restore session from secure storage.
  // Dev mode: already initialized, skip — tapi tetap mark isHydrated.
  hydrate: async () => {
    if (DEV_CONFIG.SKIP_AUTH) {
      set({ isHydrated: true });
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        set({ token, isLoggedIn: true, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));
