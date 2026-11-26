export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, code: string, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

// The backend sends { field: ["message", ...] }. Keep the first message per field.
function firstMessages(details: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (details && typeof details === 'object') {
    for (const [field, value] of Object.entries(details as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === 'string') result[field] = value[0];
    }
  }
  return result;
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { ...init, credentials: 'same-origin' });
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
      firstMessages(error?.details),
    );
  }

  return data as T;
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function postForm<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, { method: 'POST', body: form });
}