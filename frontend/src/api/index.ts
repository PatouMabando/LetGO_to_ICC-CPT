/**
 * @file frontend/src/api/index.ts
 * @description Shared API helpers:
 * - BASE: backend base URL
 * - asJson: parses JSON responses and throws consistent errors for UI
 *
 * WHY:
 * - Backend often returns { error: "..." } on 4xx/5xx.
 * - UI sometimes reads err.error OR err.message.
 * - Throwing a plain Error loses structured fields (status, error).
 *
 * WHAT IT DOES:
 * - If response is ok -> returns parsed JSON
 * - If response is NOT ok -> throws:
 *   { status: number, error?: string, message?: string, data?: any }
 */

export const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ApiError = {
  status: number;
  error?: string;
  message?: string;
  data?: any;
};

export async function asJson<T>(res: Response): Promise<T> {
  // Try to parse body (JSON or text)
  const contentType = res.headers.get("content-type") || "";
  let data: any = null;

  try {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      // sometimes servers return plain text
      const text = await res.text();
      data = text ? { message: text } : null;
    }
  } catch {
    // ignore parsing errors
    data = null;
  }

  if (!res.ok) {
    const apiErr: ApiError = {
      status: res.status,
      data,
      error:
        (data && typeof data.error === "string" && data.error) ||
        undefined,
      message:
        (data && typeof data.message === "string" && data.message) ||
        undefined,
    };

    // fallback if server returned nothing useful
    if (!apiErr.error && !apiErr.message) {
      apiErr.message = `HTTP ${res.status}`;
    }

    // Throw a consistent object (UI can read err.error OR err.message)
    throw apiErr;
  }

  return data as T;
}