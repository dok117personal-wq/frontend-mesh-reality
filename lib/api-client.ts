/**
 * Client for the MeshReality backend API.
 * Backend returns success as { data: T } and errors as { error: { code, message } }.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export type BackendError = { code: string; message: string };

export type BackendResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: BackendError };

/** When backend is behind ngrok, send this so ngrok forwards to the app instead of the interstitial (which returns * CORS). */
export function backendFetchHeaders(): Record<string, string> {
  return typeof API_URL === "string" && API_URL.includes("ngrok")
    ? { "ngrok-skip-browser-warning": "1" }
    : {};
}

/**
 * Fetches from the backend and returns the unwrapped data, or throws on error.
 */
export async function backendFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const headers: HeadersInit = {
    ...backendFetchHeaders(),
    ...(fetchOptions.headers as Record<string, string>),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body: BackendResponse<T> = await response.json().catch(() => ({}));

  if ("error" in body && body.error) {
    throw new Error(body.error.message || "Request failed");
  }

  if (!response.ok) {
    const msg =
      (body as { error?: BackendError }).error?.message ||
      response.statusText ||
      `Request failed: ${response.status}`;
    throw new Error(msg);
  }

  return (body as { data: T }).data;
}

export { API_URL };
