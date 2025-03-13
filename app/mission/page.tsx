"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  MapPin,
  Calendar,
  Euro,
  Building,
  Plus,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";

import { trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

import {
  fetchAllMissions,
  fetchMyMissions,
  fetchMyApplications,
  createMission,
  fetchApplicationsForMission,
  updateApplicationStatus,
} from "@/lib/apiMissions";
import { truncate } from "@/lib/utils/truncate";
import UserImage from "@/components/MissionUserImage";

// Typage (à adapter selon votre schéma Prisma)
interface Mission {
  id: number;
  title: string;
  description: string;
  trade: string;
  location: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: "hourly" | "fixed";
  startDate?: string;
  endDate?: string;
  durationType?: "short" | "long";
  status: "ouvert" | "en attente" | "terminée";
  createdAt: string;
  applications?: any[];
  postedByUser: {
    id: number;
    userType: string;
    avatar?: string | null;
    companyLogo?: string | null;
    companyName?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface Application {
  id: number;
  createdAt: string;
  status: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  mission: Mission;
}

export default function MissionsPage() {
  const { toast } = useToast();
  const { token, user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("browse");
  const [showNewMissionDialog, setShowNewMissionDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtres (onglet "Rechercher")
  const [filters, setFilters] = useState({
    trade: "all",
    location: "",
    duration: "all",
    budget: "all",
  });

  // Liste des missions (onglet Rechercher)
  const [missions, setMissions] = useState<Mission[]>([]);
  // Mes missions
  const [myMissions, setMyMissions] = useState<Mission[]>([]);

  // Candidatures de l'user (pour savoir si "Vous avez déjà postulé")
  const [myApplications, setMyApplications] = useState<Application[]>([]);

  // Candidatures (Dialog "Voir les candidats" dans Mes missions)
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  // Formulaire de création de mission
  const [title, setTitle] = useState("");
  const [missionTrade, setMissionTrade] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetType, setBudgetType] = useState<"" | "fixed" | "hourly">("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [durationType, setDurationType] = useState<"" | "short" | "long">("");

  // =========================
  // Chargement des données
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllMissions();
        setMissions(all.missions || []);
      } catch (error: any) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const mine = await fetchMyMissions(token);
          setMyMissions(mine.missions || []);
        } catch (error: any) {
          console.error(error);
        }
      })();

      (async () => {
        try {
          const apps = await fetchMyApplications(token);
          setMyApplications(apps.applications || []);
        } catch (error: any) {
          console.error(error);
        }
      })();
    }
  }, [token]);

  // =========================
  // Fonctions secondaires
  // =========================

  // Rediriger vers la page de détail
  function handleOpenMissionDetails(id: number) {
    router.push(`/mission/${id}`);
  }

  // Ouvrir le Dialog "Voir les candidats" (Mes missions)
  const handleShowApplications = async (missionId: number) => {
    if (!token) return;
    try {
      const result = await fetchApplicationsForMission(token, missionId);
      setApplications(result.applications || []);
      setApplicationsDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidats",
      });
    }
  };

  // Accepter/Rejeter un candidat (dans le Dialog)
  const handleUpdateApplicationStatus = async (
    applicationId: number,
    newStatus: "accepted" | "rejected",
  ) => {
    if (!token) return;
    try {
      await updateApplicationStatus(token, applicationId, newStatus);
      // Mettre à jour localement
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature",
      });
    }
  };

  // Publier une mission
  const handlePublishMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier une mission.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        trade: missionTrade,
        location,
        budgetMin: budgetType ? budget : null,
        budgetMax: budgetType ? budget : null,
        budgetType,
        startDate,
        endDate,
        durationType,
      };
      const result = await createMission(payload, token);
      if (result?.mission) {
        toast({
          title: "Mission publiée",
          description: "Votre mission a été publiée avec succès.",
        });
        // Ajouter au state local
        setMyMissions((prev) => [...prev, result.mission]);
        // Reset form
        setShowNewMissionDialog(false);
        setTitle("");
        setDescription("");
        setMissionTrade("");
        setBudget("");
        setBudgetType("");
        setLocation("");
        setStartDate("");
        setEndDate("");
        setDurationType("");
      } else {
        toast({
          title: "Erreur",
          description:
            result?.message ||
            "Une erreur est survenue lors de la publication.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de publier la mission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Rendu
  // =========================
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Missions disponibles
            </h1>
            <p className="text-gray-600">
              Trouvez des missions adaptées à vos compétences
            </p>
          </div>

          <div className="mt-4 md:mt-0 space-x-4">
            <Button variant="outline" onClick={() => setActiveTab("browse")}>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setShowNewMissionDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Publier une mission
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Rechercher
            </TabsTrigger>
            <TabsTrigger
              value="my-missions"
              className="flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Mes missions
            </TabsTrigger>
          </TabsList>

          {/* =========================
              Onglet : Rechercher
          ========================= */}
          <TabsContent value="browse">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Métier</Label>
                    <Select
                      value={filters.trade}
                      onValueChange={(value) =>
                        setFilters({ ...filters, trade: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les métiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les métiers</SelectItem>
                        {trades.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Localisation</Label>
                    <Input
                      placeholder="Ville ou région"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Durée</Label>
                    <Select
                      value={filters.duration}
                      onValueChange={(value) =>
                        setFilters({ ...filters, duration: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les durées" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les durées</SelectItem>
                        <SelectItem value="short">Missions courtes</SelectItem>
                        <SelectItem value="long">Missions longues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Budget</Label>
                    <Select
                      value={filters.budget}
                      onValueChange={(value) =>
                        setFilters({ ...filters, budget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les budgets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les budgets</SelectItem>
                        <SelectItem value="low">Moins de 1000€</SelectItem>
                        <SelectItem value="medium">1000€ - 5000€</SelectItem>
                        <SelectItem value="high">Plus de 5000€</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des missions */}
            <div className="grid grid-cols-1 gap-6">
              {missions.map((mission) => {
                // Nombre total de candidats
                const nbCandidates = mission.applications?.length || 0;

                // Vérifier si l'utilisateur a déjà postulé
                const alreadyApplied = !!myApplications.find(
                  (app) => app.mission.id === mission.id,
                );

                return (
                  <Card
                    key={mission.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-start">
                            {/* Nom de l'entreprise ou du professionnel (icône Building) */}
                            <UserImage
                              user={{
                                ...mission.postedByUser,
                                companyLogo:
                                  mission.postedByUser?.companyLogo ??
                                  undefined,
                                avatar:
                                  mission.postedByUser?.avatar ?? undefined,
                              }}
                              size={48}
                            />

                            <div>
                              <h3 className="text-xl font-semibold mb-2">
                                {mission.title}
                              </h3>

                              {/* Ligne : Nom Entreprise/Pro (icône Building) */}
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Building className="w-4 h-4 mr-1" />
                                {/* Afficher le nom de l'entreprise si userType = Entreprise, sinon (Pro) firstName + lastName */}
                                {mission.postedByUser?.userType === "entreprise"
                                  ? mission.postedByUser?.companyName ||
                                    "Entreprise inconnue"
                                  : `${mission.postedByUser?.firstName || "???"} ${mission.postedByUser?.lastName || "???"}`}
                              </div>

                              {/* Deuxième ligne : Ville, Date début-fin, Budget */}
                              <div className="flex items-center text-sm text-gray-600 mb-2 gap-4">
                                {/* Ville */}
                                <div className="flex items-center text-gray-700">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>
                                    {mission.location || "Ville inconnue"}
                                  </span>
                                </div>

                                {/* Date de début-fin */}
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>
                                    {mission.startDate
                                      ? new Date(
                                          mission.startDate,
                                        ).toLocaleDateString()
                                      : "Début n/c"}{" "}
                                    -{" "}
                                    {mission.endDate
                                      ? new Date(
                                          mission.endDate,
                                        ).toLocaleDateString()
                                      : "Fin n/c"}
                                  </span>
                                </div>

                                {/* Budget */}
                                <div className="flex items-center text-gray-700">
                                  <Euro className="w-4 h-4 mr-1" />
                                  <span>
                                    {mission.budgetType === "fixed"
                                      ? `${mission.budgetMin}€ - ${mission.budgetMax}€`
                                      : mission.budgetType === "hourly"
                                        ? `${mission.budgetMin}€/h - ${mission.budgetMax}€/h`
                                        : "Budget n/c"}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 mb-2">
                                {truncate(mission.description, 150)}
                              </p>

                              {/* Tag mission courte/longue SOUS la description */}
                              <div className="flex mb-4">
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-100 text-orange-500 mr-2"
                                >
                                  <Briefcase className="w-4 h-4 mr-1" />
                                  <span>
                                    {mission.trade || "Métier inconnu"}
                                  </span>
                                </Badge>
                                {mission.durationType === "short" ? (
                                  <Badge variant="outline" className="text-sm">
                                    Mission courte
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-sm">
                                    Mission longue
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Colonne droite : NbCandidats + date de création + bouton */}
                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                          <div className="flex text-sm text-gray-500 mb-4">
                            <div className="text-sm text-gray-600 mr-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-gray-500"
                              >
                                {nbCandidates} Candidats
                              </Badge>
                            </div>
                            Publiée le{" "}
                            {new Date(mission.createdAt).toLocaleDateString()}
                          </div>

                          {/* Soit "Vous avez déjà postulé" ou le bouton "Visualiser". */}
                          {alreadyApplied ? (
                            <div className="text-sm text-orange-600 font-semibold">
                              Vous avez déjà postulé
                            </div>
                          ) : (
                            <Button
                              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                              onClick={() =>
                                handleOpenMissionDetails(mission.id)
                              }
                            >
                              Visualiser
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* =========================
              Onglet : Mes missions
          ========================= */}
          <TabsContent value="my-missions">
            <Card>
              <CardHeader>
                <CardTitle>Mes missions</CardTitle>
                <CardDescription>
                  Gérez vos candidatures et suivez vos missions en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!token ? (
                  <p className="text-gray-500">
                    Veuillez vous connecter pour voir vos missions.
                  </p>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Missions publiées</h3>
                    {myMissions.length === 0 ? (
                      <div>Aucune mission trouvée.</div>
                    ) : (
                      myMissions.map((m) => {
                        // Nombre total de candidats
                        const nbCandidates = m.applications?.length || 0;

                        return (
                          <Card
                            key={m.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <div className="flex items-start">
                                    {/* Nom de l'entreprise ou du professionnel (icône Building) */}
                                    <UserImage
                                      user={{
                                        ...m.postedByUser,
                                        companyLogo:
                                          m.postedByUser?.companyLogo ??
                                          undefined,
                                        avatar:
                                          m.postedByUser?.avatar ?? undefined,
                                      }}
                                      size={48}
                                    />

                                    <div>
                                      <h3 className="text-xl font-semibold mb-2">
                                        {m.title}
                                      </h3>

                                      <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Building className="w-4 h-4 mr-1" />
                                        {/* Afficher le nom de l'entreprise si userType = Entreprise, sinon (Pro) firstName + lastName */}
                                        {m.postedByUser?.userType ===
                                        "entreprise"
                                          ? m.postedByUser?.companyName ||
                                            "Entreprise inconnue"
                                          : `${m.postedByUser?.firstName || "???"} ${m.postedByUser?.lastName || "???"}`}
                                      </div>

                                      {/* Deuxième ligne : Ville, Date début-fin, Budget */}
                                      <div className="flex items-center text-sm text-gray-600 mb-2 gap-4">
                                        {/* Ville */}
                                        <div className="flex items-center text-gray-700">
                                          <MapPin className="w-4 h-4 mr-1" />
                                          <span>
                                            {m.location || "Ville inconnue"}
                                          </span>
                                        </div>

                                        {/* Date de début-fin */}
                                        <div className="flex items-center text-gray-700">
                                          <Calendar className="w-4 h-4 mr-1" />
                                          <span>
                                            {m.startDate
                                              ? new Date(
                                                  m.startDate,
                                                ).toLocaleDateString()
                                              : "Début n/c"}{" "}
                                            -{" "}
                                            {m.endDate
                                              ? new Date(
                                                  m.endDate,
                                                ).toLocaleDateString()
                                              : "Fin n/c"}
                                          </span>
                                        </div>

                                        {/* Budget */}
                                        <div className="flex items-center text-gray-700">
                                          <Euro className="w-4 h-4 mr-1" />
                                          <span>
                                            {m.budgetType === "fixed"
                                              ? `${m.budgetMin}€ - ${m.budgetMax}€`
                                              : m.budgetType === "hourly"
                                                ? `${m.budgetMin}€/h - ${m.budgetMax}€/h`
                                                : "Budget n/c"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <p className="text-gray-600 mb-2">
                                        {truncate(m.description, 150)}
                                      </p>

                                      {/* Tag mission courte/longue SOUS la description */}
                                      <div className="flex mb-4">
                                        <Badge
                                          variant="secondary"
                                          className="bg-orange-100 text-orange-500 mr-2"
                                        >
                                          <Briefcase className="w-4 h-4 mr-1" />
                                          <span>
                                            {m.trade || "Métier inconnu"}
                                          </span>
                                        </Badge>
                                        {m.durationType === "short" ? (
                                          <Badge
                                            variant="outline"
                                            className="text-sm"
                                          >
                                            Mission courte
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="text-sm"
                                          >
                                            Mission longue
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Colonne droite : NbCandidats + date de création + bouton */}
                                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                                  <div className="flex text-sm text-gray-500 mb-4">
                                    <div className="text-sm text-gray-600 mr-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-gray-500"
                                      >
                                        {nbCandidates} Candidats
                                      </Badge>
                                    </div>
                                    Publiée le{" "}
                                    {new Date(m.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex">
                                    {/* Bouton "Voir les candidats" */}
                                    {m.status === "ouvert" && (
                                      <Button
                                        variant="outline"
                                        className="mt-2 mr-2 w-full md:w-auto"
                                        onClick={() =>
                                          handleShowApplications(m.id)
                                        }
                                      >
                                        Voir les candidats
                                      </Button>
                                    )}
                                    {/* Bouton "Visualiser" → page détail */}
                                    <Button
                                      className="mt-2 w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                                      onClick={() =>
                                        handleOpenMissionDetails(m.id)
                                      }
                                    >
                                      Visualiser
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}

                    {/* Candidatures en cours (uniquement si user pro) */}
                    {user?.userType
                      ?.toLowerCase()
                      .includes("professionnel") && (
                      <>
                        <div className="flex items-center justify-between mt-8">
                          <h3 className="text-lg font-semibold">
                            Candidatures en cours
                          </h3>
                          <Badge variant="outline" className="bg-gray-100">
                            {myApplications.length} candidature
                            {myApplications.length > 1 ? "s" : ""}
                          </Badge>
                        </div>

                        {myApplications.length === 0 && (
                          <div className="text-gray-600">
                            Aucune candidature en cours.
                          </div>
                        )}

                        {myApplications.map((app) => (
                          <Card key={app.id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    {app.mission.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {"Entreprise / Particulier (à adapter)"}
                                  </p>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Candidature envoyée le{" "}
                                    {new Date(
                                      app.createdAt,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge variant="secondary">
                                  {app.status || "pending"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog : Voir les candidats */}
        <Dialog
          open={applicationsDialogOpen}
          onOpenChange={setApplicationsDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Candidatures</DialogTitle>
              <DialogDescription>
                Gérez les candidatures reçues pour cette mission
              </DialogDescription>
            </DialogHeader>

            {applications.length === 0 ? (
              <p className="text-gray-600">
                Aucune candidature pour cette mission.
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {app.user.firstName} {app.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {app.status}
                      </p>
                    </div>
                    {app.status === "pending" && (
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateApplicationStatus(app.id, "accepted")
                          }
                        >
                          Accepter
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleUpdateApplicationStatus(app.id, "rejected")
                          }
                        >
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setApplicationsDialogOpen(false)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog : Publier une nouvelle mission */}
        <Dialog
          open={showNewMissionDialog}
          onOpenChange={setShowNewMissionDialog}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Publier une nouvelle mission</DialogTitle>
              <DialogDescription>
                Décrivez votre besoin pour trouver le professionnel idéal
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePublishMission}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Titre de la mission</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Rénovation complète d'un appartement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Métier recherché</Label>
                  <Select
                    value={missionTrade}
                    onValueChange={(val) => setMissionTrade(val)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un métier" />
                    </SelectTrigger>
                    <SelectContent>
                      {trades.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description détaillée</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez les tâches à réaliser, les compétences requises..."
                    className="min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Type de budget</Label>
                    <Select
                      value={budgetType}
                      onValueChange={(val) =>
                        setBudgetType(val as "fixed" | "hourly")
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Forfaitaire</SelectItem>
                        <SelectItem value="hourly">Taux horaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      type="number"
                      id="budget"
                      placeholder="Montant en €"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    placeholder="Ville ou région"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Type de mission</Label>
                  <Select
                    value={durationType}
                    onValueChange={(val) =>
                      setDurationType(val as "short" | "long")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Courte ou longue ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Mission courte</SelectItem>
                      <SelectItem value="long">Mission longue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewMissionDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publication..." : "Publier la mission"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
