import { env } from '@/lib/config/env';
import { ApiError, type ApiResponseEnvelope, type SpringErrorResponse } from '@/lib/types/api';
import { getAccessToken } from '@/lib/utils/storage';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

function isErrorPayload(payload: unknown): payload is SpringErrorResponse {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  const candidate = payload as Record<string, unknown>;
  return (
    typeof candidate.status === 'number' &&
    typeof candidate.divisionCode === 'string' &&
    typeof candidate.resultMsg === 'string'
  );
}

async function toPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return undefined;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await toPayload(response);

  if (!response.ok) {
    if (isErrorPayload(payload)) {
      throw new ApiError(payload);
    }
    throw new Error(response.statusText || '요청 처리에 실패했습니다.');
  }

  const envelope = payload as ApiResponseEnvelope<T>;
  return envelope.result;
}
