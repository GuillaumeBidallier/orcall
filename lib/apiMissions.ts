import { BACKEND_URL } from "@/lib/api";

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
  if (!res.ok)
    throw new Error("Erreur lors de la récupération de vos missions");
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

export async function applyToMission(
  missionId: number,
  token: string,
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions/${missionId}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}

export async function fetchMyApplications(token: string): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/missions/applications/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      new Error("Erreur lors de la récupération des candidatures");
    }

    return await res.json();
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Erreur inconnue");
  }
}

// Récupérer les candidatures d'une mission
export async function fetchApplicationsForMission(
  token: string,
  missionId: number,
): Promise<any> {
  const res = await fetch(
    `${BACKEND_URL}/api/missions/${missionId}/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération des candidatures");
  }
  return await res.json(); // { message, applications }
}

// Mettre à jour le statut d'une candidature (accepter / rejeter)
export async function updateApplicationStatus(
  token: string,
  applicationId: number,
  status: "accepted" | "rejected",
): Promise<any> {
  const res = await fetch(
    `${BACKEND_URL}/api/missions/applications/${applicationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de la candidature");
  }
  return await res.json(); // { message, application: {...} }
}

// Récupérer une mission (détails) par ID

export async function fetchOneMission(
    missionId: number,
    token?: string | null,
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions/${missionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la récupération de la mission");
  }
  return await res.json();
}

// Mettre à jour une mission
export async function updateMission(
  token: string,
  missionId: number,
  data: any,
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/missions/${missionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la mise à jour de la mission");
  }
  return await res.json();
}
