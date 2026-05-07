import { useAuthStore } from '@/app/store/auth';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refresh = useAuthStore((state) => state.refresh);

  return {
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refresh,
  };
}
