"use client";

// Importe React et les hooks nécessaires
import React, { useEffect, useState } from "react";
// Importe les hooks de navigation Next.js
import { useRouter, useSearchParams } from "next/navigation";
// Importe les composants Next.js et les composants UI
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  Filter,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Star,
  UserPlus,
  X,
} from "lucide-react";
import { departments, trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/lib/api";
import Pagination from "@/components/pagination";
import { useAuth } from "@/context/auth-context";
import RatingDialog from "@/components/RatingDialog";
import { formatBlurredPhone } from "@/lib/utils/formatBlurredPhone";

// Importe la fonction utilitaire pour vérifier si l'utilisateur est de type "entreprise"
import { isEntreprise } from "@/lib/utils";

// Définition de l'interface Prestataire
interface Prestataire {
  id: string;
  userType: string;
  companyName?: string;
  companyAddress?: string;
  companyZipCode?: string;
  companyCity?: string;
  companyLogo?: string;
  recruitment?: boolean;
  firstName: string;
  lastName: string;
  city: string;
  department: string;
  trade: string;
  available: boolean;
  mobile: boolean;
  shortMissions: boolean;
  longMissions: boolean;
  rating: number;
  ratingCount: number;
  avatar: string;
  images: { url: string }[];
  phone: string;
  banner: string;
}

// Interface pour les filtres actifs
interface ActiveFilters {
  trade: string;
  department: string;
  city: string;
  availability: boolean;
  mobility: boolean;
  shortMissions: boolean;
  longMissions: boolean;
  minRating: number;
}

// Interface pour les critères de notation
export interface RatingCriteria {
  id: string;
  name: string;
  value: number;
}

export default function RecherchePage() {
  // Récupère les paramètres de recherche et initialise-les hooks
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { token, user: authUser } = useAuth();
  const router = useRouter();

  // États locaux
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [filteredPrestataires, setFilteredPrestataires] = useState<
    Prestataire[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {},
  );
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedPrestataire, setSelectedPrestataire] =
    useState<Prestataire | null>(null);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);

  const [ratingCriteria, setRatingCriteria] = useState<RatingCriteria[]>([
    { id: "professionalism", name: "Professionnalisme", value: 0 },
    { id: "speed", name: "Rapidité", value: 0 },
    { id: "efficiency", name: "Efficacité", value: 0 },
    { id: "communication", name: "Communication", value: 0 },
    { id: "quality", name: "Qualité du travail", value: 0 },
  ]);
  const [comment, setComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Initialisation des filtres actifs
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    trade: searchParams.get("trade") || "",
    department: searchParams.get("department") || "",
    city: searchParams.get("city") || "",
    availability: searchParams.get("available") === "true",
    mobility: searchParams.get("mobile") === "true",
    shortMissions: searchParams.get("shortMissions") === "true",
    longMissions: searchParams.get("longMissions") === "true",
    minRating: parseInt(searchParams.get("minRating") || "0"),
  });
  const [tempFilters, setTempFilters] = useState<ActiveFilters>({
    ...activeFilters,
  });

  // Redirige vers la page d'inscription
  const handleRegisterClick = () => {
    router.push("/register");
  };

  // Permet de basculer la visibilité du numéro de téléphone
  const togglePhoneVisibility = (id: string) => {
    setVisiblePhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Récupère les prestataires depuis le backend
  useEffect(() => {
    const fetchPrestataires = async () => {
      setIsLoading(true);
      try {
        let url = `${BACKEND_URL}/api/users?`;
        const params = new URLSearchParams();

        if (activeFilters.trade && activeFilters.trade !== "all") {
          params.append("trade", activeFilters.trade);
        }
        if (activeFilters.department && activeFilters.department !== "all") {
          params.append("department", activeFilters.department);
        }
        if (activeFilters.city) {
          params.append("city", activeFilters.city);
        }
        if (activeFilters.availability) {
          params.append("available", "true");
        }
        if (activeFilters.mobility) {
          params.append("mobile", "true");
        }
        if (activeFilters.shortMissions) {
          params.append("shortMissions", "true");
        }
        if (activeFilters.longMissions) {
          params.append("longMissions", "true");
        }
        if (activeFilters.minRating > 0) {
          params.append("minRating", activeFilters.minRating.toString());
        }

        const loggedUserType = authUser?.userType;
        let targetType = "";
        if (authUser) {
          if (loggedUserType === "entreprise") {
            targetType = "professionnel";
          } else if (loggedUserType === "professionnel") {
            targetType = "entreprise";
          }
        } else {
          targetType = "professionnel";
        }
        if (targetType) {
          params.append("userType", targetType);
        }
        url += params.toString();

        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
          new Error("Erreur lors de la récupération des prestataires");
        }
        const data = await response.json();
        const users = data.users || data;

        setPrestataires(users);
        setFilteredPrestataires(users);
        countActiveFilters(activeFilters);
        setCurrentPage(1);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des prestataires:",
          error,
        );
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la récupération des prestataires.",
          variant: "destructive",
        });
        setPrestataires([]);
        setFilteredPrestataires([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestataires().then((r) => r);
  }, [activeFilters, toast, token, authUser]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters({ ...activeFilters });
    }
  }, [isFilterOpen, activeFilters]);

  // Compte le nombre de filtres actifs
  const countActiveFilters = (filters: ActiveFilters) => {
    let count = 0;
    if (filters.trade) count++;
    if (filters.department) count++;
    if (filters.city) count++;
    if (filters.availability) count++;
    if (filters.mobility) count++;
    if (filters.shortMissions) count++;
    if (filters.longMissions) count++;
    if (filters.minRating > 0) count++;
    setActiveFiltersCount(count);
  };

  // Met à jour un filtre temporaire
  const updateTempFilter = (key: keyof ActiveFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Applique les filtres temporaires
  const applyTempFilters = () => {
    setActiveFilters(tempFilters);
    countActiveFilters(tempFilters);
    applyFilters(prestataires, tempFilters);
    setIsFilterOpen(false);
  };

  // Applique les filtres aux prestataires
  const applyFilters = (
    data: Prestataire[] = prestataires,
    filters: ActiveFilters = activeFilters,
  ) => {
    const filtered = data.filter((p) => {
      return (
        (!filters.trade || p.trade === filters.trade) &&
        (!filters.department || p.department.includes(filters.department)) &&
        (!filters.city ||
          p.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.availability || p.available) &&
        (!filters.mobility || p.mobile) &&
        (!filters.shortMissions || p.shortMissions) &&
        (!filters.longMissions || p.longMissions) &&
        (filters.minRating === 0 || p.rating >= filters.minRating)
      );
    });
    setFilteredPrestataires(filtered);
  };

  // Réinitialise les filtres temporaires
  const resetTempFilters = () => {
    const empty: ActiveFilters = {
      trade: "",
      department: "",
      city: "",
      availability: false,
      mobility: false,
      shortMissions: false,
      longMissions: false,
      minRating: 0,
    };
    setTempFilters(empty);
  };

  // Réinitialise tous les filtres actifs
  const resetFilters = () => {
    const empty: ActiveFilters = {
      trade: "",
      department: "",
      city: "",
      availability: false,
      mobility: false,
      shortMissions: false,
      longMissions: false,
      minRating: 0,
    };
    setActiveFilters(empty);
    countActiveFilters(empty);
    setFilteredPrestataires(prestataires);
  };

  // Récupère le nom du métier à partir de son id
  const getTradeName = (id: string) => {
    const t = trades.find((x) => x.id === id);
    return t ? t.name : id;
  };

  // Détermine la couleur associée à un métier
  const getTradeColor = (t: string) => {
    switch (t) {
      case "peintre":
        return "bg-orange-500";
      case "plombier":
        return "bg-blue-500";
      case "macon":
        return "bg-amber-600";
      case "electricien":
        return "bg-yellow-500";
      case "menuisier":
        return "bg-amber-800";
      case "carreleur":
        return "bg-teal-500";
      default:
        return "bg-gray-500";
    }
  };

  // Supprime un filtre actif
  const removeFilter = (key: keyof ActiveFilters) => {
    const newFilters: ActiveFilters = { ...activeFilters };

    switch (key) {
      case "availability":
      case "mobility":
      case "shortMissions":
      case "longMissions":
        newFilters[key] = false;
        break;
      case "minRating":
        newFilters[key] = 0;
        break;
      case "trade":
      case "department":
      case "city":
        newFilters[key] = "";
        break;
      default:
        throw new Error(`Unhandled filter key: ${key}`);
    }

    setActiveFilters(newFilters);
    countActiveFilters(newFilters);
    applyFilters(prestataires, newFilters);
  };

  // Pagination : calcule le nombre total de pages
  const totalPages = Math.ceil(filteredPrestataires.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredPrestataires.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Met à jour la note pour un critère donné
  const updateCriteriaRating = (criteriaId: string, value: number) => {
    setRatingCriteria((prev) =>
      prev.map((c) => (c.id === criteriaId ? { ...c, value } : c)),
    );
  };

  // Calcule la note moyenne à partir des critères
  const calculateAverageRating = () => {
    const total = ratingCriteria.reduce((acc, c) => acc + c.value, 0);
    return total / ratingCriteria.length;
  };

  // Soumet la notation pour un prestataire
  const submitRating = async () => {
    if (!selectedPrestataire) return;
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
      const avg = calculateAverageRating();
      const ratingData = {
        userId: selectedPrestataire.id,
        authorId: authUser?.id,
        rating: avg,
        comment,
        criteria: ratingCriteria.reduce(
          (obj, c) => ({ ...obj, [c.id]: c.value }),
          {},
        ),
      };
      const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });
      if (!res.ok) {
        new Error("Erreur lors de la soumission de l'évaluation");
      }
      const updated = prestataires.map((p) => {
        if (p.id === selectedPrestataire.id) {
          const newCount = p.ratingCount + 1;
          const newRating = (p.rating * p.ratingCount + avg) / newCount;
          return {
            ...p,
            rating: parseFloat(newRating.toFixed(1)),
            ratingCount: newCount,
          };
        }
        return p;
      });
      setPrestataires(updated);
      applyFilters(updated, activeFilters);
      toast({
        title: "Évaluation envoyée",
        description: "Votre évaluation a été enregistrée avec succès.",
      });
      setIsRatingDialogOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
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

  // Ouvre la boîte de dialogue pour noter un prestataire
  const openRatingDialog = async (p: Prestataire) => {
    if (!authUser) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/reviews/hasRated?userId=${p.id}&authorId=${authUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) {
        const data = await res.json();
        if (data.hasRated) {
          toast({
            title: "Déjà noté",
            description: "Vous avez déjà noté cet utilisateur.",
            variant: "destructive",
          });
          return;
        }
      }
    } catch (err) {
      console.error("Erreur check note:", err);
    }
    setSelectedPrestataire(p);
    setRatingCriteria(ratingCriteria.map((c) => ({ ...c, value: 0 })));
    setComment("");
    setIsRatingDialogOpen(true);
  };

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Résultats de recherche
            </h1>
            <p className="text-gray-600">
              {filteredPrestataires.length} prestataires trouvés
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 flex items-center"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrer les résultats
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filtres actifs (badges) */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilters.trade && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Métier: {getTradeName(activeFilters.trade)}
                <button
                  onClick={() => removeFilter("trade")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.department && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Département: {activeFilters.department}
                <button
                  onClick={() => removeFilter("department")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.city && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Ville: {activeFilters.city}
                <button
                  onClick={() => removeFilter("city")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.availability && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Disponible
                <button
                  onClick={() => removeFilter("availability")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.mobility && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Mobile
                <button
                  onClick={() => removeFilter("mobility")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.shortMissions && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Missions courtes
                <button
                  onClick={() => removeFilter("shortMissions")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.longMissions && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Missions longues
                <button
                  onClick={() => removeFilter("longMissions")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFilters.minRating > 0 && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                Note min: {activeFilters.minRating}★
                <button
                  onClick={() => removeFilter("minRating")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {activeFiltersCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-red-500"
                onClick={resetFilters}
              >
                Effacer tous les filtres
              </Button>
            )}
          </div>
        )}

        {/* Sheet (volet) pour les filtres */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle className="text-xl">Filtrer les résultats</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              {/* Métier */}
              <div>
                <Label
                  htmlFor="trade"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Métier
                </Label>
                <Select
                  value={tempFilters.trade}
                  onValueChange={(val) => updateTempFilter("trade", val)}
                >
                  <SelectTrigger id="trade">
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
              {/* Département */}
              <div>
                <Label
                  htmlFor="department"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Département
                </Label>
                <Select
                  value={tempFilters.department}
                  onValueChange={(val) => updateTempFilter("department", val)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departments.map((dep) => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Ville */}
              <div>
                <Label
                  htmlFor="city"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Ville
                </Label>
                <Input
                  id="city"
                  placeholder="Entrez une ville"
                  value={tempFilters.city}
                  onChange={(e) => updateTempFilter("city", e.target.value)}
                />
              </div>
              {/* Note minimale */}
              <div>
                <Label
                  htmlFor="rating"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Note minimale
                </Label>
                <Select
                  value={tempFilters.minRating.toString()}
                  onValueChange={(val) =>
                    updateTempFilter("minRating", parseInt(val))
                  }
                >
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Toutes les notes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Toutes les notes</SelectItem>
                    <SelectItem value="3">3★ et plus</SelectItem>
                    <SelectItem value="4">4★ et plus</SelectItem>
                    <SelectItem value="4.5">4.5★ et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              {/* Disponibilité */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Disponibilité</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availability"
                    checked={tempFilters.availability}
                    onCheckedChange={(checked) =>
                      updateTempFilter("availability", !!checked)
                    }
                  />
                  <Label htmlFor="availability" className="cursor-pointer">
                    Disponible actuellement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobility"
                    checked={tempFilters.mobility}
                    onCheckedChange={(checked) =>
                      updateTempFilter("mobility", !!checked)
                    }
                  />
                  <Label htmlFor="mobility" className="cursor-pointer">
                    Mobile (se déplace)
                  </Label>
                </div>
              </div>
              <Separator />
              {/* Types de missions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Type de missions</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shortMissions"
                    checked={tempFilters.shortMissions}
                    onCheckedChange={(checked) =>
                      updateTempFilter("shortMissions", !!checked)
                    }
                  />
                  <Label htmlFor="shortMissions" className="cursor-pointer">
                    Missions courtes (moins d&#39;une semaine)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="longMissions"
                    checked={tempFilters.longMissions}
                    onCheckedChange={(checked) =>
                      updateTempFilter("longMissions", !!checked)
                    }
                  />
                  <Label htmlFor="longMissions" className="cursor-pointer">
                    Missions longues (plus d&#39;une semaine)
                  </Label>
                </div>
              </div>
            </div>
            <SheetFooter className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={resetTempFilters}
              >
                Réinitialiser
              </Button>
              <Button
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                onClick={applyTempFilters}
              >
                Appliquer les filtres
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredPrestataires.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Aucun résultat trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche.
            </p>
            <Button
              onClick={resetFilters}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((p, i) => {
                const isEnt = isEntreprise(p.userType);
                const shouldBlur = !authUser && i >= 0;

                return (
                  <div key={p.id} className="relative">
                    <Card
                      className={`rounded-lg overflow-hidden transition-shadow duration-300 ${shouldBlur ? "blur-card" : "hover:shadow-lg"}`}
                    >
                      <div className="relative h-48">
                        {p.banner ? (
                          <Image
                            src={p.banner}
                            alt={
                              isEnt
                                ? p.companyName || "Bannière Entreprise"
                                : `${p.firstName} ${p.lastName} - Bannière`
                            }
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <span className="text-3xl font-bold">
                              {isEnt
                                ? p.companyName?.charAt(0) || "E"
                                : p.firstName.charAt(0) + p.lastName.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`${getTradeColor(p.trade)} text-white`}
                          >
                            {getTradeName(p.trade)}
                          </Badge>
                        </div>
                        <div
                          className="absolute bottom-4 left-4 flex items-center bg-white bg-opacity-90 px-2 py-1 rounded-md cursor-pointer group"
                          onClick={() => openRatingDialog(p)}
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1 font-medium">
                            {p.rating || "0"}
                          </span>
                          <span className="ml-1 text-xs text-gray-600">
                            ({p.ratingCount || "Aucun avis"})
                          </span>
                          <span className="ml-1 text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Évaluer
                          </span>
                        </div>
                        {shouldBlur && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
                            <Lock className="w-8 h-8 text-white mb-2" />
                            <p className="text-white font-medium mb-2">
                              Contenu réservé aux membres
                            </p>
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600"
                              onClick={() => setIsSignupDialogOpen(true)}
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              S&#39;inscrire gratuitement
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardContent
                        className={`p-6 ${shouldBlur ? "blur-sm" : ""}`}
                      >
                        {isEnt ? (
                          <>
                            {/* Bloc pour l'utilisateur de type "entreprise" */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <Avatar className="w-12 h-12 mr-4">
                                  <AvatarImage
                                    src={p.companyLogo}
                                    alt={p.companyName || "Entreprise"}
                                  />
                                  <AvatarFallback className="bg-orange-100 text-orange-800">
                                    {p.companyName?.charAt(0) || "E"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {p.companyName || "Entreprise"}
                                  </h3>
                                  <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {p.companyZipCode}, {p.companyCity}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center">
                                {p.recruitment ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">
                                  {p.recruitment
                                    ? "Recrutement ouvert"
                                    : "Recrutement fermé"}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">
                                  12 missions déjà réalisées
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Bloc pour l'utilisateur de type "professionnel" */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <Avatar className="w-12 h-12 mr-4">
                                  <AvatarImage
                                    src={p.avatar}
                                    alt={`${p.firstName} ${p.lastName}`}
                                  />
                                  <AvatarFallback className="bg-orange-100 text-orange-800">
                                    {p.firstName.charAt(0)}
                                    {p.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {p.firstName} {p.lastName}
                                  </h3>
                                  <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {p.city}, {p.department}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`w-3 h-3 rounded-full ${p.available ? "bg-green-500" : "bg-red-500"}`}
                              />
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div className="flex items-center">
                                {p.mobile ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">Mobile</span>
                              </div>
                              <div className="flex items-center">
                                {p.shortMissions ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">
                                  Missions courtes
                                </span>
                              </div>
                              <div className="flex items-center">
                                {p.longMissions ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500 mr-2" />
                                )}
                                <span className="text-sm">
                                  Missions longues
                                </span>
                              </div>
                              <div className="flex items-center relative">
                                <Phone className="w-4 h-4 text-gray-500 mr-2" />
                                <div className="relative">
                                  <span className="text-sm font-mono whitespace-nowrap">
                                    {visiblePhones[p.id]
                                      ? p.phone
                                      : formatBlurredPhone(p.phone)}
                                  </span>
                                  {!visiblePhones[p.id] && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 text-xs p-0 h-auto"
                                      onClick={() =>
                                        togglePhoneVisibility(p.id)
                                      }
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Voir
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Boutons communs */}
                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            className="text-orange-500 border-orange-500 hover:bg-orange-50"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                          <Link href={`/profil/${p.id}`}>
                            <Button
                              variant="ghost"
                              className="text-gray-600 hover:text-orange-500"
                            >
                              Voir le profil
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {filteredPrestataires.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Dialog d'inscription */}
        <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Accès réservé aux membres
              </DialogTitle>
              <DialogDescription>
                Inscrivez-vous gratuitement pour accéder à tous les profils des
                prestataires.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">
                Avantages de l&#39;inscription :
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Coordonnées complètes des professionnels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Possibilité de laisser des avis et évaluations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Messagerie directe avec les artisans</span>
                </li>
              </ul>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setIsSignupDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Plus tard
              </Button>
              <Button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                S&#39;inscrire gratuitement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog de notation */}
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
          firstName: selectedPrestataire?.firstName ?? "",
          lastName: selectedPrestataire?.lastName ?? "",
        }}
      />
    </div>
  );
}
