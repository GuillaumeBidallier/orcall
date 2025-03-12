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

export async function fetchAllMissions(): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des missions");
  return await res.json();
}

export async function fetchMyMissions(token: string): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération de vos missions");
  return await res.json();
}

export async function createMission(data: any, token: string): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function applyToMission(missionId: number, token: string): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions/${missionId}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}