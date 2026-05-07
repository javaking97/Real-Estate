import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/app/store/auth';

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn().mockResolvedValue({
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
  }),
  logout: vi.fn().mockResolvedValue(undefined),
  refresh: vi.fn().mockResolvedValue({
    accessToken: 'next-access-token',
    refreshToken: 'next-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
  }),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('login 성공 시 인증 상태를 저장한다', async () => {
    await useAuthStore
      .getState()
      .login({ username: 'admin', password: 'Admin1234!' });

    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(true);
    expect(authState.accessToken).toBe('access-token');
    expect(localStorage.getItem('auth.refreshToken')).toBe('refresh-token');
  });
});
