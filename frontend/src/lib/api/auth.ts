import type { AuthTokens, LoginRequest } from '@/lib/types/auth';
import { apiRequest } from '@/lib/api/client';

export function login(request: LoginRequest) {
  return apiRequest<AuthTokens>('/v1/auth/login', {
    method: 'POST',
    body: request,
  });
}

export function logout(refreshToken: string) {
  return apiRequest<void>('/v1/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function refresh(refreshToken: string) {
  return apiRequest<AuthTokens>('/v1/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}
