"use client";

import React, {useState, useEffect, useCallback} from "react";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  MessageCircle,
  FileImage,
  User,
  Globe,
  Flag,
  Eye,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import { trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import RatingDialog from "@/components/RatingDialog";
import { formatBlurredPhone } from "@/lib/utils/formatBlurredPhone";
import { isEntreprise } from "@/lib/utils";

// ----- Interfaces -----
interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface UserProfile {
  id: number;
  userType: string;
  trade: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  department: string;
  country: string;
  email: string;
  phone: string;
  companyName?: string;
  companyAddress?: string;
  companyLogo: string;
  companyCity?: string;
  companyZipCode?: string;
  companyCountry?: string;
  companyStatus?: string;
  siret: string;
  createdAt: string;
  banner?: string;
  avatar?: string;
  images?: { id: string; url: string }[];
  rating?: number;
  ratingCount?: number;
  description?: string;
  available: boolean;
  mobile: boolean;
  shortMissions: boolean;
  longMissions: boolean;
  recruitment: boolean;
  reviews?: Review[];
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

interface RatingCriteria {
  id: string;
  name: string;
  value: number;
}

// ----- Composant Principal -----
const ProfilPage: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { token: authToken, user: authUser } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("presentation");

  // États pour la notation multi-critères dans la boîte de dialogue
  const [ratingCriteria, setRatingCriteria] = useState<RatingCriteria[]>([
    { id: "professionalism", name: "Professionnalisme", value: 0 },
    { id: "speed", name: "Rapidité", value: 0 },
    { id: "efficiency", name: "Efficacité", value: 0 },
    { id: "communication", name: "Communication", value: 0 },
    { id: "quality", name: "Qualité du travail", value: 0 },
  ]);
  const [comment, setComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {},
  );
  const [visibleEmail, setVisibleEmail] = useState(false);

  // Fonction pour flouter un email (affiche les 3 premiers caractères et le domaine)
  const formatBlurredEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) return "*@" + domain;
    return `${localPart.slice(0, 3)}***@${domain}`;
  };

  const togglePhoneVisibility = (id: string) => {
    setVisiblePhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ----- Récupération du profil utilisateur (avec reviews) -----
  const fetchUser =useCallback (async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        new Error(
          data.message || "Erreur lors de la récupération de l'utilisateur",
        );
      }
      setUser(data.user);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de la récupération de l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);
  //           ^^^
  // On inclut ici toutes les dépendances dont "fetchUser" a besoin.
  // (Si vous utilisez authToken à l’intérieur, ajoutez-le aussi.)

  // 2) On appelle "fetchUser" dans un useEffect dont la dépendance est "fetchUser"
  useEffect(() => {
    fetchUser().then(r => r);
  }, [fetchUser]);

  // Vérification si l'utilisateur a déjà noté ce profil
  useEffect(() => {
    if (!user || !authUser) return;

    (async () => {
      try {
        const res = await fetch(
            `${BACKEND_URL}/api/reviews/hasRated?userId=${user.id}&authorId=${authUser.id}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setHasRated(data.hasRated);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'avis :", error);
      }
    })();
  }, [user, authUser, authToken]);


  // ----- Fonctions de notation multi-critères -----
  const updateCriteriaRating = (criteriaId: string, value: number) => {
    setRatingCriteria((prev) =>
      prev.map((c) => (c.id === criteriaId ? { ...c, value } : c)),
    );
  };

  const calculateAverageRating = () => {
    const totalRating = ratingCriteria.reduce(
      (sum, criteria) => sum + criteria.value,
      0,
    );
    return totalRating / ratingCriteria.length;
  };

  const submitRating = async () => {
    if (!user) return;
    const hasAllRatings = ratingCriteria.every((c) => c.value > 0);
    if (!hasAllRatings) {
      toast({
        title: "Évaluation incomplète",
        description: "Veuillez noter tous les critères.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmittingRating(true);
    try {
      const averageRating = calculateAverageRating();
      const criteria = ratingCriteria.reduce(
        (obj, c) => ({ ...obj, [c.id]: c.value }),
        {},
      );
      const ratingData = {
        userId: user.id,
        authorId: authUser.id,
        rating: averageRating,
        comment: comment,
        criteria,
      };
      const response = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(ratingData),
      });
      if (!response.ok) {
        new Error("Erreur lors de la soumission de l'évaluation");
      }
      toast({
        title: "Évaluation envoyée",
        description: "Votre évaluation a été enregistrée avec succès.",
      });
      setRatingCriteria(ratingCriteria.map((c) => ({ ...c, value: 0 })));
      setComment("");
      setIsRatingDialogOpen(false);
      fetchUser().then( r => r);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'évaluation:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la soumission de l'évaluation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Si le chargement est en cours ou si l'utilisateur n'est pas trouvé
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Chargement...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Utilisateur non trouvé.
      </div>
    );
  }

  // Utilisation d'isEntreprise pour déterminer si le profil est une entreprise
  const isEnt = isEntreprise(user.userType);
  const tradeName = trades.find((t) => t.id === user.trade)?.name || user.trade;

  return (
    <div className="container px-4 py-12 mx-auto">
      {/* Bannière */}
      <div className="relative mb-8">
        <div className="h-64 w-full rounded-xl overflow-hidden">
          <Image
              src={
                user.banner
                    ? user.banner
                    : "https://via.placeholder.com/1200x400?text=Bannière"
              }
              alt="Bannière"
              fill
              className="object-cover"
          />
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="w-32 h-32 border-4 border-white">
            <AvatarImage
              src={isEnt ? user.companyLogo : user.avatar}
              alt={
                isEnt ? user.companyName : `${user.firstName} ${user.lastName}`
              }
            />
            <AvatarFallback className="text-4xl bg-orange-100 text-orange-800">
              {isEnt
                ? (user.companyName && user.companyName.charAt(0)) || "E"
                : user.firstName.charAt(0) + user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Section principale */}
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                {isEnt
                  ? user.companyName
                  : `${user.firstName} ${user.lastName}`}
              </h1>
              <div className="flex items-center mt-2">
                {!isEnt ? (
                  <Badge className="mr-2 bg-orange-500">{tradeName}</Badge>
                ) : (
                  <Badge className="mr-2 bg-orange-500">
                    {user.userType.charAt(0).toUpperCase() +
                      user.userType.slice(1)}
                  </Badge>
                )}
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-gray-700">
                    {user.rating || "0"}
                  </span>
                  <span className="ml-1 text-gray-500">
                    ({user.ratingCount || 0} avis)
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() =>
                  toast({
                    title: "Contact",
                    description: "Demande de contact envoyée",
                  })
                }
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            </div>
          </div>

          {/* Détails du profil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {isEnt ? (
              <>
                {/* Infos de l'entreprise */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span>
                    {user.companyCity} - {user.companyZipCode},{" "}
                    {user.companyCountry}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-500">SIRET</span>
                  <span className="ml-2 font-medium">{user.siret}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">
                    {user.companyStatus}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileImage className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">
                    12 missions réalisées
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Pour un profil individuel */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span>
                    {user.city}, {user.department}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <div className="relative">
                    <span className="text-sm font-mono whitespace-nowrap">
                      {visiblePhones[user.id.toString()]
                        ? user.phone
                        : formatBlurredPhone(user.phone)}
                    </span>
                    {!visiblePhones[user.id.toString()] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 text-xs p-0 h-auto"
                        onClick={() =>
                          togglePhoneVisibility(user.id.toString())
                        }
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <div className="relative">
                    <span className="text-sm font-mono whitespace-nowrap">
                      {visibleEmail
                        ? user.email
                        : formatBlurredEmail(user.email)}
                    </span>
                    {!visibleEmail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 text-xs p-0 h-auto"
                        onClick={() => setVisibleEmail(true)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span>
                    Membre depuis{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Onglets de contenu */}
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="mt-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="presentation"
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Présentation</span>
              </TabsTrigger>
              <TabsTrigger
                value="realisations"
                className="flex items-center gap-2"
              >
                <FileImage className="w-4 h-4" />
                <span>Réalisations</span>
              </TabsTrigger>
              <TabsTrigger value="avis" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Avis</span>
              </TabsTrigger>
            </TabsList>

            {/* Onglet Présentation */}
            <TabsContent value="presentation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>À propos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {user.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Réalisations */}
            <TabsContent value="realisations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                  <CardDescription>
                    Découvrez les travaux réalisés par{" "}
                    {isEnt ? user.companyName : user.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                            src={image.url}
                            alt={`Réalisation ${index + 1}`}
                            width={400}
                            height={192}
                            className="object-cover rounded-lg w-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Avis */}
            <TabsContent value="avis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Avis clients</CardTitle>
                  <CardDescription>
                    {user.ratingCount || 0} avis, note moyenne de{" "}
                    {user.rating || 0}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {user.reviews && user.reviews.length > 0 ? (
                      user.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-6 last:border-0"
                        >
                          <div className="flex items-start">
                            <Avatar className="w-10 h-10 mr-4">
                              <AvatarImage
                                src={
                                  review.author?.avatar || review.authorImage
                                }
                              />
                              <AvatarFallback className="bg-orange-100 text-orange-800">
                                {review.author
                                  ? review.author.firstName.charAt(0)
                                  : review.authorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold">
                                  {review.author
                                    ? `${review.author.firstName} ${review.author.lastName}`
                                    : review.authorName}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex text-yellow-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(review.rating)
                                          ? "fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() =>
                                      console.log("report", review.id)
                                    }
                                    className="p-1 hover:text-red-500"
                                  >
                                    <Flag className="w-4 h-4" />
                                  </button>
                                  <span className="ml-1 text-xs text-gray-500">
                                    report
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 mt-2">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">
                        Aucun avis disponible pour l&#39;instant.
                      </p>
                    )}
                  </div>
                  <Separator className="my-6" />
                  {hasRated ? (
                    <p className="text-sm text-gray-500">
                      Vous avez déjà noté cet utilisateur.
                    </p>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsRatingDialogOpen(true)}
                    >
                      Laisser un avis
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar complémentaire */}
        <div className="md:col-span-1">
          {isEnt ? (
            // Pour un profil d'entreprise, on affiche les informations personnelles de l'utilisateur
            <Card className="mb-6 relative">
              <CardHeader className="relative">
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="font-medium">Entreprise</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">
                    {user.city}, {user.department}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Pour un profil individuel, on garde l'encart existant
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{user.userType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">{user.companyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SIRET</p>
                    <p className="font-medium">{user.siret}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(user.facebookUrl ||
            user.instagramUrl ||
            user.linkedinUrl ||
            user.websiteUrl) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {user.facebookUrl && (
                    <a
                      href={user.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebookF className="w-6 h-6 text-blue-600" />
                    </a>
                  )}
                  {user.instagramUrl && (
                    <a
                      href={user.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className="w-6 h-6 text-pink-500" />
                    </a>
                  )}
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedinIn className="w-6 h-6 text-blue-700" />
                    </a>
                  )}
                  {user.websiteUrl && (
                    <a
                      href={user.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-6 h-6 text-gray-700" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            {user.userType === "entreprise" ? (
              <>
                <CardHeader>
                  <CardTitle>Recrutement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Statut recrutement</span>
                      </div>
                      <Badge
                        className={
                          user.recruitment ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {user.recruitment ? "Ouvert" : "Fermé"}
                      </Badge>
                    </div>
                    {user.recruitment && (
                      <Button
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => {}}
                      >
                        Proposer mon profil
                      </Button>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Disponibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Statut</span>
                      </div>
                      <Badge
                        className={
                          user.available ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {user.available ? "Disponible" : "Non disponible"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Missions courtes</span>
                      </div>
                      <Badge
                        className={
                          user.shortMissions ? "bg-blue-500" : "bg-gray-300"
                        }
                      >
                        {user.shortMissions ? "Accepte" : "N'accepte pas"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                        <span>Missions longues</span>
                      </div>
                      <Badge
                        className={
                          user.longMissions ? "bg-blue-500" : "bg-gray-300"
                        }
                      >
                        {user.longMissions ? "Accepte" : "N'accepte pas"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {user.mobile ? (
                          <Star className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <FaXTwitter className="w-6 h-6 text-red-500 mr-2" />
                        )}
                        <span>Mobilité</span>
                      </div>
                      <Badge
                        className={user.mobile ? "bg-green-500" : "bg-red-500"}
                      >
                        {user.mobile ? "Mobile" : "Non mobile"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      <RatingDialog
        open={isRatingDialogOpen}
        onClose={() => setIsRatingDialogOpen(false)}
        onSubmit={submitRating}
        ratingCriteria={ratingCriteria}
        updateCriteriaRating={updateCriteriaRating}
        comment={comment}
        setComment={setComment}
        calculateAverageRating={calculateAverageRating}
        isSubmitting={isSubmittingRating}
        targetUser={{
          firstName: isEnt ? user.companyName || "" : user.firstName,
          lastName: isEnt ? "" : user.lastName,
        }}
      />
    </div>
  );
};

export default ProfilPage;
