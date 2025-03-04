import * as z from "zod";

// Schéma pour le formulaire dédié au rôle en entreprise
export const companyRoleSchema = z.object({
  enterpriseRoleId: z.string().min(1, "Veuillez sélectionner un rôle"),
});

// Schéma pour le profil utilisateur
export const profileFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z
    .string()
    .regex(
      /^0[1-9]\d{8}$/,
      "Le numéro de téléphone doit être au format français (10 chiffres)",
    ),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
  department: z.string().min(1, "Veuillez sélectionner un département"),
  trade: z.string().min(1, "Veuillez sélectionner un métier"),
  description: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  available: z.boolean().default(true),
  mobile: z.boolean().default(false),
  shortMissions: z.boolean().default(false),
  longMissions: z.boolean().default(false),
  recruitment: z.boolean().default(false),
  enterpriseRoleId: z.string().optional(),
});

// Schéma pour le changement de mot de passe
export const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma pour les informations d'entreprise
export const enterpriseFormSchema = z.object({
  companyName: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  companyAddress: z
    .string()
    .min(5, "L'adresse de l'entreprise doit contenir au moins 5 caractères"),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres"),
});

// Schéma pour les réseaux sociaux
export const socialFormSchema = z.object({
  facebookUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .or(z.literal("")),
});
