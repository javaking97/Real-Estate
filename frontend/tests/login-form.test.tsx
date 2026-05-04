import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/components/auth/LoginForm';
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

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('필수 입력값을 검증한다', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(
      await screen.findByText('아이디와 비밀번호를 입력해주세요.'),
    ).toBeInTheDocument();
  });
});
