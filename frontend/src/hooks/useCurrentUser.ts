import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/user';
import { useAuth } from '@/hooks/useAuth';

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  });
}
