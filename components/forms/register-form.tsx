"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Building,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { registerUser } from "@/lib/api";
import { departments } from "@/lib/data";

// Schéma pour les entreprises
const entrepriseFormSchema = z
  .object({
    userType: z.literal("entreprise"),
    trade: z.string().min(1, "Veuillez sélectionner un métier"),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    zipCode: z
      .string()
      .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
    department: z.string().min(1, "Veuillez sélectionner un département"),
    country: z
      .string()
      .min(2, "Le pays doit contenir au moins 2 caractères")
      .default("France"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    phone: z
      .string()
      .regex(
        /^0[1-9]\d{8}$/,
        "Le numéro de téléphone doit être au format français (10 chiffres)",
      ),
    companyName: z
      .string()
      .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
    companyAddress: z
      .string()
      .min(5, "L'adresse de l'entreprise doit contenir au moins 5 caractères"),
    siret: z
      .string()
      .regex(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schéma pour les professionnels indépendants
const professionnelFormSchema = z
  .object({
    userType: z.literal("professionnel"),
    trade: z.string().min(1, "Veuillez sélectionner un métier"),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    zipCode: z
      .string()
      .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
    department: z.string().min(1, "Veuillez sélectionner un département"),
    country: z
      .string()
      .min(2, "Le pays doit contenir au moins 2 caractères")
      .default("France"),
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    phone: z
      .string()
      .regex(
        /^0[1-9]\d{8}$/,
        "Le numéro de téléphone doit être au format français (10 chiffres)",
      ),
    siret: z
      .string()
      .regex(/^\d{14}$/, "Le numéro SIRET doit contenir 14 chiffres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Types dérivés
type EntrepriseFormInputs = z.infer<typeof entrepriseFormSchema>;
type ProfessionnelFormInputs = z.infer<typeof professionnelFormSchema>;

// Définition des étapes pour chaque type
const steps = {
  entreprise: [
    { id: "metier", title: "Métier" },
    { id: "personnel", title: "Informations personnelles" },
    { id: "adresse", title: "Adresse" },
    { id: "entreprise", title: "Entreprise" },
    { id: "compte", title: "Compte" },
  ],
  professionnel: [
    { id: "metier", title: "Métier" },
    { id: "personnel", title: "Informations personnelles" },
    { id: "adresse", title: "Adresse" },
    { id: "compte", title: "Compte" },
  ],
};

export default function InscriptionPage() {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "professionnel"
      ? "professionnel"
      : "entreprise";
  const [activeTab, setActiveTab] = useState<"entreprise" | "professionnel">(
    initialTab,
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  // Calcul du progrès
  const currentSteps =
    activeTab === "entreprise" ? steps.entreprise : steps.professionnel;
  const progress = ((currentStep + 1) / currentSteps.length) * 100;

  // Détection d'appareil mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialisation des formulaires
  const entrepriseForm = useForm<EntrepriseFormInputs>({
    resolver: zodResolver(entrepriseFormSchema),
    defaultValues: {
      userType: "entreprise",
      trade: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      department: "",
      country: "France",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      companyAddress: "",
      siret: "",
    },
  });

  const professionnelForm = useForm<ProfessionnelFormInputs>({
    resolver: zodResolver(professionnelFormSchema),
    defaultValues: {
      userType: "professionnel",
      trade: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zipCode: "",
      department: "",
      country: "France",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      siret: "",
    },
  });

  const onEntrepriseSubmit: SubmitHandler<EntrepriseFormInputs> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      if (!response.ok) {
        const errorData = await response.json();
        new Error(errorData.message || "Erreur lors de l'inscription");
      }
      setIsSuccess(true);
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'inscription :", error);
      toast({
        title: "Erreur d'inscription",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onProfessionnelSubmit: SubmitHandler<ProfessionnelFormInputs> = async (
    data,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await registerUser(data);
      if (!response.ok) {
        const errorData = await response.json();
        new Error(errorData.message || "Erreur lors de l'inscription");
      }
      setIsSuccess(true);
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'inscription :", error);
      toast({
        title: "Erreur d'inscription",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation entre étapes
  const nextStep = async () => {
    const form =
      activeTab === "entreprise" ? entrepriseForm : professionnelForm;
    const currentStepId = currentSteps[currentStep].id;
    let valid = true;
    if (currentStepId === "metier") {
      valid = await form.trigger("trade");
    } else if (currentStepId === "personnel") {
      valid = await form.trigger(["firstName", "lastName", "phone"]);
    } else if (currentStepId === "adresse") {
      valid = await form.trigger([
        "address",
        "city",
        "zipCode",
        "department",
        "country",
      ]);
    } else if (currentStepId === "entreprise") {
      valid = await form.trigger(["companyName", "companyAddress", "siret"]);
    } else if (currentStepId === "compte") {
      valid = await form.trigger(["email", "password", "confirmPassword"]);
    }
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, currentSteps.length - 1));
      if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLastStep = currentStep === currentSteps.length - 1;

  const handleTabChange = (value: string) => {
    setActiveTab(value as "entreprise" | "professionnel");
    setCurrentStep(0);
  };

  // Rendu des étapes pour le formulaire Entreprise
  const renderEntrepriseStep = () => {
    const currentStepId = steps.entreprise[currentStep].id;
    switch (currentStepId) {
      case "metier":
        return (
          <div className="space-y-6">
            <FormField
              control={entrepriseForm.control}
              name="trade"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Métier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre métier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trades.map((trade) => (
                        <SelectItem key={trade.id} value={trade.id}>
                          {trade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "personnel":
        return (
          <div className="space-y-6">
            <FormField
              control={entrepriseForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="0612345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "adresse":
        return (
          <div className="space-y-6">
            <FormField
              control={entrepriseForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={entrepriseForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={entrepriseForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={entrepriseForm.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "entreprise":
        return (
          <div className="space-y-6">
            <FormField
              control={entrepriseForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l&#39;entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de l&#39;entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse de l'entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro SIRET</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678901234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "compte":
        return (
          <div className="space-y-6">
            <FormField
              control={entrepriseForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={entrepriseForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Rendu des étapes pour Professionnel Indépendant
  const renderProfessionnelStep = () => {
    const currentStepId = steps.professionnel[currentStep].id;
    switch (currentStepId) {
      case "metier":
        return (
          <div className="space-y-6">
            <FormField
              control={professionnelForm.control}
              name="trade"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Métier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre métier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trades.map((trade) => (
                        <SelectItem key={trade.id} value={trade.id}>
                          {trade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "personnel":
        return (
          <div className="space-y-6">
            <FormField
              control={professionnelForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="0612345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="siret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro SIRET</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678901234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "adresse":
        return (
          <div className="space-y-6">
            <FormField
              control={professionnelForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={professionnelForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionnelForm.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={professionnelForm.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "compte":
        return (
          <div className="space-y-6">
            <FormField
              control={professionnelForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={professionnelForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 py-8 md:py-16 mx-auto">
      <div className="max-w-3xl mx-auto mb-6 md:mb-10 text-center">
        <h1 className="mb-2 md:mb-4 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Créer votre compte
        </h1>
        <p className="text-base md:text-xl text-gray-600">
          Rejoignez Orcall et connectez-vous avec des professionnels du bâtiment
          ou trouvez de nouveaux clients.
        </p>
      </div>

      {isSuccess ? (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Inscription réussie !
            </CardTitle>
            <CardDescription className="text-gray-600 mb-6">
              Votre compte a été créé avec succès. Vous pouvez maintenant vous
              connecter.
            </CardDescription>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs
          defaultValue="entreprise"
          value={activeTab}
          onValueChange={(value) => handleTabChange(value)}
          className="max-w-3xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
            <TabsTrigger
              value="entreprise"
              className="flex items-center gap-2 py-3"
            >
              <Building className="w-5 h-5" />
              <span>Entreprise</span>
            </TabsTrigger>
            <TabsTrigger
              value="professionnel"
              className="flex items-center gap-2 py-3"
            >
              <User className="w-5 h-5" />
              <span>Professionnel Indépendant</span>
            </TabsTrigger>
          </TabsList>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {isMobile ? (
                <div className="w-full text-center">
                  <span className="text-sm font-medium text-orange-500">
                    Étape {currentStep + 1} sur {currentSteps.length}:{" "}
                    {currentSteps[currentStep].title}
                  </span>
                </div>
              ) : (
                currentSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`text-xs font-medium ${index <= currentStep ? "text-orange-500" : "text-gray-400"}`}
                  >
                    {step.title}
                  </div>
                ))
              )}
            </div>
            <Progress
              value={progress}
              className="h-2 bg-gray-200"
              indicatorClassName="bg-orange-500"
            />
          </div>

          {/* Formulaire Entreprise */}
          <TabsContent value="entreprise">
            <Card>
              <CardHeader>
                <CardTitle>Inscription Entreprise</CardTitle>
                <CardDescription>
                  Créez votre compte Entreprise pour accéder à notre réseau de
                  professionnels qualifiés.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...entrepriseForm}>
                  <form
                    onSubmit={entrepriseForm.handleSubmit(onEntrepriseSubmit)}
                    className="space-y-6"
                  >
                    {renderEntrepriseStep()}
                    <div className="flex justify-between mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Précédent</span>
                        <span className="sm:hidden">Préc.</span>
                      </Button>
                      {isLastStep ? (
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Inscription..." : "S'inscrire"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-orange-500 hover:bg-orange-600 flex items-center"
                        >
                          <span className="hidden sm:inline">Suivant</span>
                          <span className="sm:hidden">Suiv.</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulaire Professionnel */}
          <TabsContent value="professionnel">
            <Card>
              <CardHeader>
                <CardTitle>Inscription Professionnel Indépendant</CardTitle>
                <CardDescription>
                  Créez votre compte Professionnel Indépendant pour trouver des
                  missions et développer votre activité.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...professionnelForm}>
                  <form
                    onSubmit={professionnelForm.handleSubmit(
                      onProfessionnelSubmit,
                    )}
                    className="space-y-6"
                  >
                    {renderProfessionnelStep()}
                    <div className="flex justify-between mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Précédent</span>
                        <span className="sm:hidden">Préc.</span>
                      </Button>
                      {isLastStep ? (
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Inscription..." : "S'inscrire"}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-orange-500 hover:bg-orange-600 flex items-center"
                        >
                          <span className="hidden sm:inline">Suivant</span>
                          <span className="sm:hidden">Suiv.</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
