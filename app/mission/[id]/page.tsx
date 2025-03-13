"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { MapPin, Calendar, Euro, ArrowRight } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  fetchOneMission,
  applyToMission,
  updateMission,
} from "@/lib/apiMissions";
import UserImage from "@/components/MissionUserImage";

interface UserInfo {
  id: number;
  userType?: string;
  firstName: string;
  lastName: string;
  companyLogo?: string;
  avatar?: string;
}

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
  status: string; // "ouvert", "en attente", "terminée", etc.
  postedBy: number;
  postedByUser?: UserInfo;
  applications?: any[];
}

export default function MissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const { toast } = useToast();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  // État pour l'édition (modal)
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Charger la mission
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchOneMission(Number(id), token);
        setMission(res.mission);
        setEditTitle(res.mission.title);
        setEditDescription(res.mission.description);
      } catch (error) {
        console.error(error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la mission.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token, toast]);

  // Si en cours de chargement, on affiche un loader
  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  // IMPORTANT : on vérifie mission === null AVANT d'accéder aux propriétés
  if (!mission) {
    return <div className="p-4 text-red-600">Mission introuvable.</div>;
  }

  // Ici, TypeScript sait que `mission` n'est plus `null`.
  const nbCandidats = mission.applications?.length || 0;
  const isOwner = mission.postedBy === user?.id;

  // Choix du logo (entreprise vs avatar)
  let creatorLogo = "";
  if (
      mission.postedByUser?.userType === "Entreprise" &&
      mission.postedByUser.companyLogo
  ) {
    creatorLogo = mission.postedByUser.companyLogo;
  } else if (mission.postedByUser?.avatar) {
    creatorLogo = mission.postedByUser.avatar;
  }

  // =========================
  // Méthodes
  // =========================
  function openEditDialog() {
    setShowEditDialog(true);
    setEditTitle(mission!.title);
    setEditDescription(mission!.description);
  }

  async function handleUpdateMission() {
    if (!token) return;
    try {
      const payload = {
        title: editTitle,
        description: editDescription,
      };
      const updated = await updateMission(token, mission!.id, payload);
      setMission((prev) => (prev ? { ...prev, ...updated.mission } : null));
      toast({ title: "Mission mise à jour" });
      setShowEditDialog(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la mission.",
      });
    }
  }

  async function handleChangeStatus(newStatus: string) {
    if (!token) return;
    try {
      await updateMission(token, mission!.id, {
        status: newStatus,
      });
      setMission((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast({ title: "Statut modifié" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut.",
      });
    }
  }

  async function handlePostuler() {
    if (!token) {
      toast({ title: "Erreur", description: "Vous devez être connecté." });
      return;
    }
    try {
      const res = await applyToMission(mission!.id, token);
      if (res?.application) {
        toast({ title: "Candidature envoyée" });
      } else {
        toast({ title: "Erreur", description: res.message });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de postuler." });
    }
  }

  // =========================
  // Rendu
  // =========================
  return (
      <div className="container mx-auto py-6">
        {/* Barre du haut : Retour à gauche, autres boutons à droite */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>

          <div className="flex items-center gap-3">
            {/* Si c'est le propriétaire : Éditer + Changer statut */}
            {isOwner ? (
                <>
                  <Button
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={openEditDialog}
                  >
                    Éditer la mission
                  </Button>
                  <Button
                      variant="outline"
                      className="border-orange-400 text-orange-700 hover:bg-orange-100"
                      onClick={() => handleChangeStatus("en attente")}
                  >
                    Passer en attente
                  </Button>
                  <Button
                      variant="outline"
                      className="border-orange-400 text-orange-700 hover:bg-orange-100"
                      onClick={() => handleChangeStatus("terminée")}
                  >
                    Clore la mission
                  </Button>
                </>
            ) : (
                !isOwner &&
                mission.status === "ouvert" && (
                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={handlePostuler}
                    >
                      Postuler
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded p-6">
          {/* LIGNE 1 : Logo + Titre à gauche, "X candidats - Statut" à droite */}
          <div className="flex items-start justify-between">
            {/* Logo + Titre */}
            <div className="flex items-center">
              <UserImage user={mission.postedByUser } size={48} />
              <h1 className="text-2xl font-bold">{mission.title}</h1>
            </div>

            {/* "X candidats - Statut : ..." */}
            <div className="text-sm text-gray-600">
              <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
              >
                {nbCandidats} candidat{nbCandidats > 1 ? "s" : ""}
              </Badge>{" "}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {mission.status}
              </Badge>
            </div>
          </div>

          {/* Ligne 1 : Publié par */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            {mission.postedByUser?.userType === "Entreprise" ? (
                <span>
              Publié par Entreprise : {mission.postedByUser.firstName}
            </span>
            ) : (
                <span>
              Publié par :{" "}
                  {mission.postedByUser
                      ? `${mission.postedByUser.firstName} ${mission.postedByUser.lastName}`
                      : "Utilisateur inconnu"}
            </span>
            )}
          </div>

          {/* Ligne Ville + Dates + Tarif */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mt-2">
            {/* Ville */}
            {mission.location && (
                <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
                  {mission.location}
            </span>
            )}

            {/* Dates */}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
              {mission.startDate
                  ? new Date(mission.startDate).toLocaleDateString()
                  : "Début n/c"}{" "}
                -{" "}
                {mission.endDate
                    ? new Date(mission.endDate).toLocaleDateString()
                    : "Fin n/c"}
            </span>
            </div>

            {/* Tarif */}
            {(mission.budgetMin || mission.budgetMax) && (
                <div className="flex items-center">
                  <Euro className="w-4 h-4 mr-1" />
                  <span>
                {mission.budgetType === "fixed"
                    ? `${mission.budgetMin}€ - ${mission.budgetMax}€ (forfait)`
                    : mission.budgetType === "hourly"
                        ? `${mission.budgetMin}€/h - ${mission.budgetMax}€/h`
                        : "Budget n/c"}
              </span>
                </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 whitespace-pre-wrap mt-4">
            {mission.description}
          </p>

          {/* Tag mission courte ou longue */}
          <div className="mt-4">
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

        {/* Modal d'édition */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Éditer la mission</DialogTitle>
              <DialogDescription>
                Modifiez les informations de votre annonce.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2 py-4">
              <label className="font-medium text-sm">Titre</label>
              <input
                  type="text"
                  className="border px-2 py-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
              />

              <label className="font-medium text-sm mt-2">Description</label>
              <textarea
                  className="border px-2 py-1"
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleUpdateMission}
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}
