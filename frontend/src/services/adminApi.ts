import { ApiError } from './api';

let csrfToken = '';

export function setCsrfToken(token: string) {
  csrfToken = token;
}

function fieldMessages(details: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (details && typeof details === 'object') {
    for (const [field, value] of Object.entries(details as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === 'string') result[field] = value[0];
    }
  }
  return result;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function adminRequest<T>(method: Method, path: string, body?: unknown, form?: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined && !form) headers['Content-Type'] = 'application/json';
  if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

  let response: Response;
  try {
    response = await fetch(`/api/admin${path}`, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
      credentials: 'same-origin',
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'NETWORK', 'We could not reach the server. Please check your connection and try again.');
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = (data as { error?: { code?: string; message?: string; details?: unknown } } | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? 'ERROR',
      error?.message ?? 'Something went wrong. Please try again.',
      fieldMessages(error?.details),
    );
  }

  return data as T;
}

export const adminGet = <T>(path: string) => adminRequest<T>('GET', path);
export const adminPost = <T>(path: string, body?: unknown) => adminRequest<T>('POST', path, body ?? {});
export const adminPatch = <T>(path: string, body: unknown) => adminRequest<T>('PATCH', path, body);
export const adminDelete = <T>(path: string) => adminRequest<T>('DELETE', path);
export const adminUpload = <T>(path: string, form: FormData) => adminRequest<T>('POST', path, undefined, form);