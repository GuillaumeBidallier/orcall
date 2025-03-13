"use client";

// Importe les fonctions "useParams" et "useRouter" depuis Next.js pour la navigation
import { useParams, useRouter } from "next/navigation";

// Importe React et ses Hooks "useEffect" et "useState" pour gérer l'état
import React, { useEffect, useState } from "react";

// Importe le composant "Image" depuis Next.js pour afficher des images
import Image from "next/image";

// Importe les composants UI (bouton, badge, etc.)
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

// Importe certaines icônes depuis "lucide-react"
import { MapPin, Calendar, Euro, ArrowRight } from "lucide-react";

// Importe le contexte d'authentification personnalisé
import { useAuth } from "@/context/auth-context";

// Importe un hook pour les notifications "toast"
import { useToast } from "@/hooks/use-toast";

// Importe les fonctions pour communiquer avec l'API (fetchOneMission, applyToMission, updateMission)
import {
  fetchOneMission,
  applyToMission,
  updateMission,
} from "@/lib/apiMissions";

// Importe le composant d'image utilisateur (si vous souhaitez encore vous en servir,
// sinon vous pouvez supprimer cette ligne)
// import UserImage from "@/components/MissionUserImage";

// Définit une interface pour décrire les informations d'un utilisateur lié à la mission
interface UserInfo {
  id: number;
  userType?: string;
  firstName: string;
  lastName: string;
  companyLogo?: string;
  avatar?: string;
}

// Définit une interface pour décrire la structure d'une "Mission"
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

// Exporte par défaut le composant principal de la page MissionDetailPage
export default function MissionDetailPage() {
  // Récupère l'ID de la mission depuis l'URL via useParams()
  const { id } = useParams();

  // Permet de naviguer / revenir à la page précédente, etc.
  const router = useRouter();

  // Récupère l'authentification (token, user) depuis le contexte global
  const { token, user } = useAuth();

  // Récupère la fonction toast pour afficher des notifications
  const { toast } = useToast();

  // Stocke la mission courante dans un state local (ou null si non chargée)
  const [mission, setMission] = useState<Mission | null>(null);

  // Indique si la page est en cours de chargement
  const [loading, setLoading] = useState(true);

  // Stocke les valeurs du formulaire d'édition (titre, description)
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);

  // useEffect pour charger la mission dès que la page se monte / que l'id ou le token changent
  useEffect(() => {
    (async () => {
      try {
        // Récupère la mission via l'API
        const res = await fetchOneMission(Number(id), token);

        // Met à jour le state avec la mission
        setMission(res.mission);

        // Prépare l'état d'édition avec les données reçues
        setEditTitle(res.mission.title);
        setEditDescription(res.mission.description);
      } catch (error) {
        console.error(error);
        // Affiche un toast d'erreur si la requête échoue
        toast({
          title: "Erreur",
          description: "Impossible de charger la mission.",
        });
      } finally {
        // Fin du chargement
        setLoading(false);
      }
    })();
  }, [id, token, toast]);

  // Affiche un message pendant le chargement
  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  // Si la mission n'existe pas (null), on affiche un message d'erreur
  if (!mission) {
    return <div className="p-4 text-red-600">Mission introuvable.</div>;
  }

  // À partir d'ici, TypeScript sait que "mission" n'est plus null

  // Calcule le nombre de candidatures sur la mission
  const nbCandidats = mission.applications?.length || 0;

  // Vérifie si l'utilisateur connecté est le propriétaire de la mission
  const isOwner = mission.postedBy === user?.id;

  // =============================
  // Choix du logo (entreprise vs avatar) + utilisation concrète
  // =============================
  // On détermine "creatorLogo" si l'utilisateur est une entreprise et qu'il a un logo,
  // sinon on prend l'avatar s'il existe, etc.
  let creatorLogo = "";
  if (
    mission.postedByUser?.userType === "Entreprise" &&
    mission.postedByUser.companyLogo
  ) {
    creatorLogo = mission.postedByUser.companyLogo;
  } else if (mission.postedByUser?.avatar) {
    creatorLogo = mission.postedByUser.avatar;
  }

  // =============================
  // Fonctions
  // =============================

  // Ouvre le modal d'édition et initialise les champs avec le titre/description actuels
  function openEditDialog() {
    setShowEditDialog(true);
    setEditTitle(mission!.title);
    setEditDescription(mission!.description);
  }

  // Fonction pour gérer la mise à jour de la mission
  async function handleUpdateMission() {
    // Si pas de token, on ne fait rien
    if (!token) return;

    try {
      // Prépare les nouvelles valeurs
      const payload = {
        title: editTitle,
        description: editDescription,
      };

      // Met à jour la mission via l'API
      const updated = await updateMission(token, mission!.id, payload);

      // Met à jour le state local avec la mission modifiée
      setMission((prev) => (prev ? { ...prev, ...updated.mission } : null));

      // Notifie l'utilisateur
      toast({ title: "Mission mise à jour" });

      // Ferme les pop-up d'édition
      setShowEditDialog(false);
    } catch (error) {
      console.error(error);
      // Avertit l'utilisateur en cas d'échec
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la mission.",
      });
    }
  }

  // Fonction pour changer le statut de la mission (en attente, terminée, etc.)
  async function handleChangeStatus(newStatus: string) {
    // Vérifie la présence du token
    if (!token) return;

    try {
      // Met à jour la mission via l'API
      await updateMission(token, mission!.id, {
        status: newStatus,
      });

      // Met à jour le state local
      setMission((prev) => (prev ? { ...prev, status: newStatus } : null));

      // Avertit l'utilisateur
      toast({ title: "Statut modifié" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut.",
      });
    }
  }

  // Fonction pour postuler à la mission
  async function handlePostuler() {
    // Vérifie l'authentification
    if (!token) {
      toast({ title: "Erreur", description: "Vous devez être connecté." });
      return;
    }

    try {
      // Appelle l'API pour postuler
      const res = await applyToMission(mission!.id, token);

      // Si l'API renvoie une candidature, c'est un succès
      if (res?.application) {
        toast({ title: "Candidature envoyée" });
      } else {
        // Sinon, on affiche le message d'erreur renvoyé
        toast({ title: "Erreur", description: res.message });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de postuler." });
    }
  }

  // =============================
  // Rendu JSX
  // =============================
  return (
    <div className="container mx-auto py-6">
      {/* Barre du haut : bouton "Retour" + actions */}
      <div className="flex items-center justify-between mb-4">
        {/* Bouton pour revenir à la page précédente */}
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>

        {/* Section des boutons d'action : Éditer, changer statut, postuler */}
        <div className="flex items-center gap-3">
          {/* Si c'est le propriétaire de la mission, on affiche les boutons d'édition/statut */}
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
            // Si ce n'est pas le propriétaire ET que la mission est ouverte, on propose de postuler
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

      {/* Contenu principal de la mission */}
      <div className="bg-white shadow rounded p-6">
        {/* Première ligne : Logo/Avatar + Titre à gauche, nombre de candidats/statut à droite */}
        <div className="flex items-start justify-between">
          {/* Bloc : Logo/Avatar + Titre */}
          <div className="flex items-center">
            {/*
              Au lieu de <UserImage user={mission.postedByUser} size={48} />,
              on utilise "creatorLogo" pour afficher l'image si dispo, sinon un fallback.
            */}
            {creatorLogo ? (
              // Si "creatorLogo" est non vide, on affiche l'image avec <Image />
              <Image
                src={creatorLogo}
                alt={
                  mission.postedByUser
                    ? `${mission.postedByUser.firstName} ${mission.postedByUser.lastName}`
                    : "Avatar inconnu"
                }
                // Largeur et hauteur à 48 pour conserver un format carré
                width={48}
                height={48}
                // Pour le style, on peut utiliser className ou style directement.
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />
            ) : (
              // Sinon, on affiche un bloc vide ou un placeholder
              <div
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#eee",
                  borderRadius: 8,
                  marginRight: 8,
                }}
              />
            )}

            {/* Titre de la mission */}
            <h1 className="text-2xl font-bold">{mission.title}</h1>
          </div>

          {/* Nombre de candidats + Statut de la mission */}
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

        {/* Information sur l'auteur de la mission (Entreprise ou Utilisateur) */}
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

        {/* Ligne d'infos : localisation, dates, tarif */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mt-2">
          {/* Localisation */}
          {mission.location && (
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {mission.location}
            </span>
          )}

          {/* Dates (début - fin) */}
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

          {/* Tarif (budget) */}
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

        {/* Description de la mission */}
        <p className="text-gray-600 whitespace-pre-wrap mt-4">
          {mission.description}
        </p>

        {/* Affiche un badge indiquant si la mission est courte ou longue */}
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

      {/* Fenêtre (modal) pour éditer la mission */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            {/* Titre du modal */}
            <DialogTitle>Éditer la mission</DialogTitle>
            {/* Description brève du modal */}
            <DialogDescription>
              Modifiez les informations de votre annonce.
            </DialogDescription>
          </DialogHeader>

          {/* Contenu du formulaire d'édition */}
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
            {/* Bouton pour fermer la fenêtre sans enregistrer */}
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>

            {/* Bouton pour valider la mise à jour */}
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
