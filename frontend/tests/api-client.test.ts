import { describe, expect, it, vi } from 'vitest';
import { apiRequest } from '@/lib/api/client';
import { ApiError } from '@/lib/types/api';

describe('apiRequest', () => {
  it('ApiResponse.result를 언래핑한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          resultCode: 0,
          resultMsg: 'OK',
          result: {
            username: 'admin',
          },
        }),
      }),
    );

    const result = await apiRequest<{ username: string }>('/users/me');
    expect(result.username).toBe('admin');
  });

  it('실패 응답을 ApiError로 변환한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Unauthorized',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          status: 401,
          divisionCode: 'AUTH-401',
          resultMsg: '인증 실패',
        }),
      }),
    );

    await expect(apiRequest('/users/me')).rejects.toBeInstanceOf(ApiError);
  });
});
