import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { USER_TYPES } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction utilitaire qui retourne true si le type d'utilisateur correspond à "entreprise"
export const isEntreprise = (userType: string): boolean => {
  return userType === USER_TYPES.ENTREPRISE;
};
