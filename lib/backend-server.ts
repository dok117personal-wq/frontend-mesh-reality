/**
 * Server-side only: talk to the backend with the incoming request's cookie
 * so the backend sees the same authenticated user.
 */
import { fetch as undiciFetch, Agent } from 'undici';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

// Long-timeout agent for backend calls that may wait on Swift (generate can take minutes)
const BACKEND_FETCH_AGENT = new Agent({
  headersTimeout: 15 * 60 * 1000, // 15 min to receive headers
  bodyTimeout: 15 * 60 * 1000,    // 15 min for body
});

type BackendResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };

export interface BackendUser {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

/**
 * Verify the user's session with the backend using the request's cookie.
 * Returns the user if authenticated, null otherwise.
 */
export async function getBackendSession(cookieHeader: string | null): Promise<BackendUser | null> {
  if (!cookieHeader?.trim()) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body: BackendResponse<BackendUser> = await res.json().catch(() => ({}));
    if ("error" in body && body.error) return null;
    return (body as { data: BackendUser }).data ?? null;
  } catch {
    return null;
  }
}

/**
 * Call the backend from the server with the user's cookie (e.g. in API routes).
 * @param timeoutMs - Optional timeout in ms (e.g. 15*60*1000 for long-running generate). Omit for default.
 */
export async function serverBackendFetch<T>(
  path: string,
  options: RequestInit & { body?: unknown } = {},
  cookieHeader: string | null,
  timeoutMs?: number
): Promise<T> {
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    ...(rest.headers as Record<string, string>),
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  };
  if (body !== undefined && typeof body !== "string") {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }
  const signal =
    timeoutMs != null
      ? AbortSignal.timeout(timeoutMs)
      : rest.signal;
  const res = await undiciFetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    cache: "no-store",
    signal,
    dispatcher: BACKEND_FETCH_AGENT,
  });
  if (res.status === 204) return undefined as T;
  const json: BackendResponse<T> = await res.json().catch(() => ({}));
  const message = ("error" in json && json.error?.message) || (json as { error?: { message?: string } }).error?.message || res.statusText || "Request failed";
  if ("error" in json && json.error) {
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(message) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return (json as { data: T }).data;
}
