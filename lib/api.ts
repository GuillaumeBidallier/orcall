export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export interface ApiResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: any;
  [key: string]: any;
}

export async function registerUser(data: any): Promise<ApiResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function loginUser(data: any): Promise<ApiResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}
