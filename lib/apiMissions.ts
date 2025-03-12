import {BACKEND_URL} from "@/lib/api";

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