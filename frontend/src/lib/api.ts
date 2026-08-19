// Base URL of our NestJS backend, read from the environment variable
// we just set up. Falls back to localhost:3000 if somehow missing.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Custom error class so calling code can distinguish "the API
// responded but rejected the request" (e.g. 401, 403, 400)
// from other kinds of failures (e.g. network errors).
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// The core function every API call goes through.
// Generic <T> lets each caller specify what shape of data
// they expect back, so TypeScript can type-check the result.
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // CRITICAL: tells the browser to include cookies on
    // cross-origin requests. Without this, our httpOnly JWT
    // cookie would never actually be sent to the backend,
    // and every request would look unauthenticated.
    credentials: 'include',
  });

  // Handle "no content" responses (e.g. some DELETE requests)
  // that have no JSON body to parse.
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || 'Something went wrong';
    throw new ApiError(res.status, Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}

// Small convenience wrappers so calling code reads naturally:
// api.get('/tasks') instead of apiFetch('/tasks', { method: 'GET' })
export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};