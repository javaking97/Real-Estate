import { apiRequest } from '@/lib/api/client';
import type { CurrentUser } from '@/lib/types/user';

export function getCurrentUser() {
  return apiRequest<CurrentUser>('/api/v1/users/me', {
    method: 'GET',
  });
}
