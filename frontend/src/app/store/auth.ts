import { create } from 'zustand';
import {
  login as loginApi,
  logout as logoutApi,
  refresh as refreshApi,
} from '@/lib/api/auth';
import type { LoginRequest } from '@/lib/types/auth';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/utils/storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const initialAccessToken = getAccessToken();
const initialRefreshToken = getRefreshToken();

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialAccessToken && initialRefreshToken),
  isLoading: false,

  login: async (request) => {
    set({ isLoading: true });
    try {
      const tokens = await loginApi(request);
      setTokens(tokens.accessToken, tokens.refreshToken);
      set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    const { refreshToken } = get();
    set({ isLoading: true });
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } finally {
      clearTokens();
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const tokens = await refreshApi(refreshToken);
    setTokens(tokens.accessToken, tokens.refreshToken);
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    });
  },
}));
