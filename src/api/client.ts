const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ─── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildUrl(
  path: string,
  params?: Record<string, string | undefined>,
): string {
  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}

// ─── Core fetchers ───────────────────────────────────────────────────────────

/**
 * GET or POST a resource. Throws ApiError on any non-2xx response.
 */
export async function fetcher<T>(
  path: string,
  options: {
    params?: Record<string, string | undefined>;
    method?: "GET" | "POST";
    body?: unknown;
  } = {},
): Promise<T> {
  const { params, method = "GET", body } = options;

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * GET a single resource. Returns null on 404 instead of throwing.
 */
export async function fetcherOrNull<T>(path: string): Promise<T | null> {
  const response = await fetch(buildUrl(path), {
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}
