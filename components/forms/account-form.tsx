"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Settings,
  FileImage,
  Star,
  Calendar,
  Upload,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { departments, trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import AvatarUpload from "@/components/avatar-upload";
import ConfirmDialog from "@/components/confirm-delete-dialog";
import {
  companyRoleSchema,
  enterpriseFormSchema,
  passwordFormSchema,
  profileFormSchema,
  socialFormSchema,
} from "@/schema/account.schemas";

const AccountForm: React.FC = () => {
  const { token, user, refreshUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profil");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyRoles, setCompanyRoles] = useState<
    { id: number; name: string }[]
  >([]);

  // Formulaire dédié au rôle en entreprise (déjà déclaré avant utilisation)
  const companyRoleForm = useForm<{ enterpriseRoleId: string }>({
    resolver: zodResolver(companyRoleSchema),
    defaultValues: { enterpriseRoleId: "" },
  });

  // Récupération dynamique des rôles depuis RoleCompany
  useEffect(() => {
    const fetchCompanyRoles = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/company-role`);
        const data = await res.json();
        setCompanyRoles(data.roles);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des rôles d'entreprise",
          error,
        );
      }
    };
    if (user.userType === "entreprise") {
      fetchCompanyRoles().then((r) => r);
    }
  }, [user.userType]);

  // Met à jour le formulaire dédié pour afficher le rôle actuel du compte
  useEffect(() => {
    if (user.companyRole && companyRoles.length > 0) {
      const currentRole = companyRoles.find(
        (role) => role.name === user.companyRole,
      );
      if (currentRole) {
        companyRoleForm.reset({ enterpriseRoleId: String(currentRole.id) });
      }
    }
  }, [user.companyRole, companyRoles, companyRoleForm]);

  // Formulaire de profil utilisateur
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      department: user.department,
      trade: user.trade,
      description: user.description || "",
      companyName: user.companyName || "",
      companyAddress: user.companyAddress || "",
      available: user.available,
      mobile: user.mobile,
      shortMissions: user.shortMissions,
      longMissions: user.longMissions,
      recruitment: user.recruitment,
      enterpriseRoleId: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const enterpriseForm = useForm<z.infer<typeof enterpriseFormSchema>>({
    resolver: zodResolver(enterpriseFormSchema),
    defaultValues: {
      companyName: user.companyName || "",
      companyAddress: user.companyAddress || "",
      siret: user.siret || "",
    },
  });

  const socialForm = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      facebookUrl: user.facebookUrl || "",
      instagramUrl: user.instagramUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      websiteUrl: user.websiteUrl || "",
    },
  });

  // Soumission du formulaire de profil
  const onProfileSubmit: SubmitHandler<
    z.infer<typeof profileFormSchema>
  > = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok)
        new Error(json.message || "Erreur lors de la mise à jour du profil");
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission du formulaire de changement de mot de passe
  const onPasswordSubmit: SubmitHandler<
    z.infer<typeof passwordFormSchema>
  > = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok)
        new Error(
          json.message || "Erreur lors de la mise à jour du mot de passe",
        );
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission du formulaire de réseaux sociaux
  const onSocialSubmit: SubmitHandler<
    z.infer<typeof socialFormSchema>
  > = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok)
        new Error(
          json.message || "Erreur lors de la mise à jour des réseaux sociaux",
        );
      toast({
        title: "Réseaux sociaux mis à jour",
        description:
          "Vos liens vers les réseaux sociaux ont été mis à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour des réseaux sociaux",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission du formulaire des informations d'entreprise
  const onEnterpriseSubmit: SubmitHandler<
    z.infer<typeof enterpriseFormSchema>
  > = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: data.companyName,
          companyAddress: data.companyAddress,
          siret: data.siret,
        }),
      });
      const json = await res.json();
      if (!res.ok)
        new Error(
          json.message || "Erreur lors de la mise à jour de l'entreprise",
        );
      toast({
        title: "Informations d'entreprise mises à jour",
        description:
          "Vos informations d'entreprise ont été mises à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour de l'entreprise",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission du formulaire dédié à la mise à jour du rôle en entreprise
  const onCompanyRoleSubmit: SubmitHandler<{
    enterpriseRoleId: string;
  }> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/users/${user.id}/company-role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ roleId: data.enterpriseRoleId }),
        },
      );
      const json = await res.json();
      if (!res.ok)
        new Error(json.message || "Erreur lors de la mise à jour du rôle");
      toast({
        title: "Rôle mis à jour",
        description: "Votre rôle en entreprise a été mis à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du rôle",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("banner", file);

      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/banner`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        new Error(json.message || "Erreur lors de l'upload de la bannière");
      }

      toast({
        title: "Bannière mise à jour",
        description: "Votre bannière a été mise à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload de la bannière",
        variant: "destructive",
      });
    }
  };

  // Ajout d'une fonction pour gérer l'upload du logo d'entreprise
  const handleCompanyLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch(
        `${BACKEND_URL}/api/users/${user.id}/company-logo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok) {
        new Error(json.message || "Erreur lors de l'upload du logo");
      }

      toast({
        title: "Logo mis à jour",
        description:
          "Le logo de votre entreprise a été mis à jour avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload du logo",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const formData = new FormData();
      formData.append("image", files[0]);
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok)
        new Error(json.message || "Erreur lors du téléchargement de l'image");
      toast({
        title: "Image téléchargée",
        description: "Votre image a été téléchargée avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors du téléchargement de l'image",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      )
    ) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/${user.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok)
          new Error(json.message || "Erreur lors de la suppression du compte");
        toast({
          title: "Compte supprimé",
          description: "Votre compte a été supprimé avec succès.",
        });
        logout();
      } catch (error: any) {
        toast({
          title: "Erreur",
          description:
            error instanceof Error
              ? error.message
              : "Erreur lors de la suppression du compte",
          variant: "destructive",
        });
      }
    }
  };

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const openConfirmDelete = (photoId: string) => {
    setPhotoToDelete(photoId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/users/${user.id}/images/${photoToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();
      if (!res.ok)
        new Error(json.message || "Erreur lors de la suppression de la photo");
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès.",
      });
      refreshUser();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression de la photo",
        variant: "destructive",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setPhotoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setPhotoToDelete(null);
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
          Mon Compte
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage
                        src={
                          user.avatar || (user.images && user.images[0]?.url)
                        }
                      />
                      <AvatarFallback className="text-xl bg-orange-100 text-orange-800">
                        {user.firstName?.charAt(0) || "U"}
                        {user.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    {/* Bouton pour changer l'avatar */}
                    <AvatarUpload />
                  </div>
                  <h2 className="text-xl font-semibold text-center">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 text-center">
                    {user.userType.charAt(0).toUpperCase() +
                      user.userType.slice(1)}
                  </p>
                  <Badge className="mt-2 bg-orange-500">
                    {trades.find((t) => t.id === user.trade)?.name ||
                      user.trade}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "profil" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === "profil" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setActiveTab("profil")}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Profil
                  </Button>
                  <Button
                    variant={activeTab === "reseaux" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === "reseaux" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setActiveTab("reseaux")}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Réseaux
                  </Button>
                  <Button
                    variant={activeTab === "photos" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === "photos" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setActiveTab("photos")}
                  >
                    <FileImage className="w-5 h-5 mr-2" />
                    Photos
                  </Button>
                  <Button
                    variant={
                      activeTab === "disponibilite" ? "default" : "ghost"
                    }
                    className={`w-full justify-start ${activeTab === "disponibilite" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setActiveTab("disponibilite")}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {user.userType === "entreprise"
                      ? "Recrutement"
                      : "Disponibilité"}
                  </Button>
                  <Button
                    variant={activeTab === "securite" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === "securite" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => setActiveTab("securite")}
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Sécurité
                  </Button>
                </nav>
                <Separator className="my-4" />
                <div className="pt-2">
                  <Button
                    variant={
                      activeTab === "entreprise" ? "default" : "speciality"
                    }
                    className="w-full justify-start"
                    onClick={() => setActiveTab("entreprise")}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Mon entreprise
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Note moyenne</span>
                  </div>
                  <span className="font-bold">{user.rating || 0}/5</span>
                </div>
                <div className="text-sm text-gray-500">
                  Basée sur {user.ratingCount || 0} avis
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto mt-2 text-orange-500"
                  onClick={() => setActiveTab("avis")}
                >
                  Voir tous les avis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Onglet Profil */}
            {activeTab === "profil" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Modifiez vos informations personnelles et professionnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
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
                          control={profileForm.control}
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
                          control={profileForm.control}
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
                          control={profileForm.control}
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
                          control={profileForm.control}
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
                        <FormField
                          control={profileForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Décrivez votre activité, vos compétences et votre expérience..."
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Cette description sera visible sur votre profil
                                public.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input placeholder="Adresse" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
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
                          control={profileForm.control}
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
                        <FormField
                          control={profileForm.control}
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
                                  {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                      {dept}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Enregistrement..."
                          : "Enregistrer les modifications"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Onglet Réseaux sociaux */}
            {activeTab === "reseaux" && (
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux sociaux</CardTitle>
                  <CardDescription>
                    Visualisez et modifiez vos liens vers vos réseaux sociaux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...socialForm}>
                    <form
                      onSubmit={socialForm.handleSubmit(onSocialSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={socialForm.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.facebook.com/votreprofil"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={socialForm.control}
                        name="instagramUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.instagram.com/votreprofil"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={socialForm.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.linkedin.com/in/votreprofil"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={socialForm.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Site web</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.votresite.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Mise à jour..."
                          : "Mettre à jour les réseaux"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Onglet Photos */}
            {activeTab === "photos" && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>
                    Ajoutez des photos de vos réalisations et une bannière pour
                    votre profil.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Gestion de la bannière */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Bannière de profil
                    </h3>
                    {user.banner ? (
                      <div className="relative w-full h-48">
                        <img
                          src={user.banner}
                          alt="Bannière de profil"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-2">
                        Vous n'avez pas encore de bannière.
                      </p>
                    )}

                    <div className="mt-4">
                      <label
                        htmlFor="banner-upload"
                        className="inline-flex items-center space-x-2 cursor-pointer text-sm font-medium text-orange-600 hover:underline"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Uploader une nouvelle bannière</span>
                      </label>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerUpload}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Gestion des autres images */}
                  <h3 className="text-lg font-medium mb-4">
                    Galerie de photos
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {user.images?.map((image: any, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Réalisation ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mr-2"
                            onClick={() => openConfirmDelete(image.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-48 bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Ajouter une photo
                      </p>
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          asChild
                        >
                          <span>Parcourir</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Onglet Disponibilité / Recrutement */}
            {activeTab === "disponibilite" && (
              <Card>
                <CardHeader>
                  {user.userType === "entreprise" ? (
                    <>
                      <CardTitle>Recrutement</CardTitle>
                      <CardDescription>
                        Gérez le statut de recrutement de votre profil
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle>Disponibilité</CardTitle>
                      <CardDescription>
                        Gérez votre disponibilité et vos préférences de missions
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="recruitment"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  {user.userType === "entreprise"
                                    ? "Statut recrutement"
                                    : "Disponible"}
                                </FormLabel>
                                <FormDescription>
                                  {user.userType === "entreprise"
                                    ? "Indiquez si votre recrutement est ouvert"
                                    : "Indiquez si vous êtes actuellement disponible pour de nouvelles missions"}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {user.userType !== "entreprise" && (
                          <>
                            <FormField
                              control={profileForm.control}
                              name="mobile"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Mobile
                                    </FormLabel>
                                    <FormDescription>
                                      Indiquez si vous êtes prêt à vous déplacer
                                      en dehors de votre zone géographique
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="shortMissions"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Missions courtes
                                    </FormLabel>
                                    <FormDescription>
                                      Indiquez si vous acceptez des missions de
                                      courte durée (moins d'une semaine)
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="longMissions"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      Missions longues
                                    </FormLabel>
                                    <FormDescription>
                                      Indiquez si vous acceptez des missions de
                                      longue durée (plus d'une semaine)
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? user.userType === "entreprise"
                            ? "Mise à jour..."
                            : "Enregistrement..."
                          : user.userType === "entreprise"
                            ? "Mettre à jour le recrutement"
                            : "Enregistrer les modifications"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Onglet Sécurité */}
            {activeTab === "securite" && (
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité et votre mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Confirmer le nouveau mot de passe
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Modification..."
                          : "Modifier le mot de passe"}
                      </Button>
                    </form>
                  </Form>
                  <Separator className="my-8" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Suppression du compte
                    </h3>
                    <p className="text-sm text-gray-500">
                      La suppression de votre compte est définitive et
                      entraînera la perte de toutes vos données.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDeleteAccount}
                    >
                      Supprimer mon compte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Onglet "Mon entreprise" */}
            {activeTab === "entreprise" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations sur mon entreprise</CardTitle>
                  <CardDescription>
                    Modifiez les informations concernant votre entreprise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Formulaire principal "enterpriseForm" */}
                  <Form {...enterpriseForm}>
                    <form
                      onSubmit={enterpriseForm.handleSubmit(onEnterpriseSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={enterpriseForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de l'entreprise</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nom de l'entreprise"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={enterpriseForm.control}
                        name="companyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse de l'entreprise</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Adresse de l'entreprise"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={enterpriseForm.control}
                        name="siret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SIRET</FormLabel>
                            <FormControl>
                              <Input placeholder="Numéro SIRET" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={enterpriseForm.control}
                        name="companyCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville de l&#39;entreprise</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={enterpriseForm.control}
                        name="companyZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Code postal de l&#39;entreprise
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="75000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={enterpriseForm.control}
                        name="companyPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone de l&#39;entreprise</FormLabel>
                            <FormControl>
                              <Input placeholder="01 23 45 67 89" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Enregistrement..."
                          : "Enregistrer les modifications"}
                      </Button>
                    </form>
                  </Form>

                  {/* Upload du logo d'entreprise */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-2">
                      Logo de l'entreprise
                    </h3>
                    {user.companyLogo ? (
                      <div className="relative w-40 h-40">
                        <img
                          src={user.companyLogo}
                          alt="Logo entreprise"
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-2">
                        Vous n'avez pas encore de logo
                      </p>
                    )}

                    <div className="mt-4">
                      <label
                        htmlFor="company-logo-upload"
                        className="inline-flex items-center space-x-2 cursor-pointer text-sm font-medium text-orange-600 hover:underline"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Uploader un nouveau logo</span>
                      </label>
                      <input
                        id="company-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCompanyLogoUpload}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Supprimer la photo"
        description="Êtes-vous sûr de vouloir supprimer cette photo ?"
      />
    </div>
  );
};

export default AccountForm;
