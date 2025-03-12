"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
    Briefcase, MapPin, Calendar, Clock, Euro, Building, User,
    Plus, Search, Filter, ArrowRight
} from "lucide-react";

import { trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

import {
    fetchAllMissions,
    fetchMyMissions,
    createMission,
    applyToMission,
    fetchMyApplications,
} from "@/lib/apiMissions";

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
    status: "open" | "in_progress" | "completed";
    createdAt: string;
}

interface Application {
    id: number;
    createdAt: string;
    mission: Mission;
    status?: string;
}

export default function MissionsPage() {
    const { toast } = useToast();
    const { token, user } = useAuth();

    const [activeTab, setActiveTab] = useState("browse");
    const [showNewMissionDialog, setShowNewMissionDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtres
    const [filters, setFilters] = useState({
        trade: "all",
        location: "",
        duration: "all",
        budget: "all",
    });

    // États pour stocker les missions
    const [missions, setMissions] = useState<Mission[]>([]);
    const [myMissions, setMyMissions] = useState<Mission[]>([]);

    // États pour stocker les candidatures (en cours)
    const [myApplications, setMyApplications] = useState<Application[]>([]);

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

    // Charger toutes les missions (pour l'onglet "browse")
    useEffect(() => {
        (async () => {
            try {
                const all = await fetchAllMissions();  // A adapter
                setMissions(all.missions || []);
            } catch (error: any) {
                console.error(error);
            }
        })();
    }, []);

    // Charger "mes missions" et "mes candidatures" si l'utilisateur est connecté
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

    // Postuler à une mission
    const handleApply = async (missionId: number) => {
        if (!token) {
            toast({ title: "Erreur", description: "Vous devez être connecté pour postuler." });
            return;
        }
        if (!user || !user.userType?.toLowerCase().includes("professionnel")) {
            toast({ title: "Interdit", description: "Seuls les professionnels peuvent postuler." });
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await applyToMission(missionId, token);
            if (result?.application) {
                toast({
                    title: "Candidature envoyée",
                    description: "Votre candidature a été envoyée avec succès.",
                });
                // Option : recharger la liste des candidatures
                const apps = await fetchMyApplications(token);
                setMyApplications(apps.applications || []);
            } else {
                toast({ title: "Erreur", description: result?.message || "Une erreur est survenue." });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de postuler pour le moment." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Publier une mission
    const handlePublishMission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast({ title: "Erreur", description: "Vous devez être connecté pour publier une mission." });
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
                // Ajouter la mission dans "myMissions"
                setMyMissions((prev) => [...prev, result.mission]);
                // Réinitialiser le formulaire
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
                    description: result?.message || "Une erreur est survenue lors de la publication.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erreur", description: "Impossible de publier la mission." });
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="browse" className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Rechercher
                        </TabsTrigger>
                        <TabsTrigger value="my-missions" className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Mes missions
                        </TabsTrigger>
                    </TabsList>

                    {/* ========================= Onglet : Toutes les missions ========================= */}
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
                                    {/* Filtre : Métier */}
                                    <div>
                                        <Label>Métier</Label>
                                        <Select
                                            value={filters.trade}
                                            onValueChange={(value) => setFilters({ ...filters, trade: value })}
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

                                    {/* Filtre : Localisation */}
                                    <div>
                                        <Label>Localisation</Label>
                                        <Input
                                            placeholder="Ville ou région"
                                            value={filters.location}
                                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        />
                                    </div>

                                    {/* Filtre : Durée */}
                                    <div>
                                        <Label>Durée</Label>
                                        <Select
                                            value={filters.duration}
                                            onValueChange={(value) => setFilters({ ...filters, duration: value })}
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

                                    {/* Filtre : Budget */}
                                    <div>
                                        <Label>Budget</Label>
                                        <Select
                                            value={filters.budget}
                                            onValueChange={(value) => setFilters({ ...filters, budget: value })}
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

                        {/* Liste des missions (depuis l'API) */}
                        <div className="grid grid-cols-1 gap-6">
                            {missions.map((mission) => (
                                <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                                                        <Building className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
                                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                                            <Building className="w-4 h-4 mr-1" />
                                                            {/* Optionnel : Nom du posteur si vous l'avez */}
                                                            {mission.location || "Localisation inconnue"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-4">{mission.description}</p>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">{mission.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">
                              {mission.startDate
                                  ? new Date(mission.startDate).toLocaleDateString()
                                  : "Début n/c"}{" "}
                                                            -{" "}
                                                            {mission.endDate
                                                                ? new Date(mission.endDate).toLocaleDateString()
                                                                : "Fin n/c"}
                            </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">
                              {mission.durationType === "short"
                                  ? "Mission courte"
                                  : mission.durationType === "long"
                                      ? "Mission longue"
                                      : "Durée inconnue"}
                            </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Euro className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">
                              {mission.budgetType === "fixed"
                                  ? `${mission.budgetMin}€ - ${mission.budgetMax}€`
                                  : mission.budgetType === "hourly"
                                      ? `${mission.budgetMin}€/h - ${mission.budgetMax}€/h`
                                      : "Budget non renseigné"}
                            </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                        {trades.find((t) => t.id === mission.trade)?.name || mission.trade}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                                                <div className="text-sm text-gray-500 mb-4">
                                                    Publiée le {new Date(mission.createdAt).toLocaleDateString()}
                                                </div>
                                                {/* Bouton "Postuler" si userType = pro et mission ouverte */}
                                                {user?.userType?.toLowerCase().includes("professionnel") &&
                                                    mission.status === "open" && (
                                                        <Button
                                                            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                                                            onClick={() => handleApply(mission.id)}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? "Envoi..." : "Postuler"}
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* ========================= Onglet : Mes missions ========================= */}
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
                                    <p className="text-gray-500">Veuillez vous connecter pour voir vos missions.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {/* ---------------------------
                        Mes missions publiées
                    --------------------------- */}
                                        <h3 className="text-lg font-semibold">Missions publiées</h3>
                                        {myMissions.length === 0 ? (
                                            <div>Aucune mission trouvée.</div>
                                        ) : (
                                            myMissions.map((m) => (
                                                <Card key={m.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-start">
                                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                                                                        <User className="w-6 h-6 text-gray-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
                                                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                                                            <Building className="w-4 h-4 mr-1" />
                                                                            {m.location}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <p className="text-gray-600 mb-4">{m.description}</p>

                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                                    <div className="flex items-center">
                                                                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                                                        <span className="text-sm">{m.location}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                                                        <span className="text-sm">
                                      {m.startDate
                                          ? new Date(m.startDate).toLocaleDateString()
                                          : ""}{" "}
                                                                            -{" "}
                                                                            {m.endDate
                                                                                ? new Date(m.endDate).toLocaleDateString()
                                                                                : ""}
                                    </span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                                                        <span className="text-sm">
                                      {m.durationType === "short"
                                          ? "Mission courte"
                                          : m.durationType === "long"
                                              ? "Mission longue"
                                              : ""}
                                    </span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Euro className="w-4 h-4 text-gray-500 mr-2" />
                                                                        <span className="text-sm">
                                      {m.budgetType === "fixed"
                                          ? `${m.budgetMin}€ - ${m.budgetMax}€`
                                          : m.budgetType === "hourly"
                                              ? `${m.budgetMin}€/h - ${m.budgetMax}€/h`
                                              : ""}
                                    </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                                                                <div className="text-sm text-gray-500 mb-4">
                                                                    Publiée le {new Date(m.createdAt).toLocaleDateString()}
                                                                </div>
                                                                {m.status === "open" && (
                                                                    <Button variant="outline" className="w-full md:w-auto">
                                                                        Voir les candidats
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}

                                        {/* ---------------------------
                        Candidatures en cours
                    --------------------------- */}
                                        <div className="flex items-center justify-between mt-8">
                                            <h3 className="text-lg font-semibold">Candidatures en cours</h3>
                                            <Badge variant="outline" className="bg-gray-100">
                                                {myApplications.length} candidature
                                                {myApplications.length > 1 ? "s" : ""}
                                            </Badge>
                                        </div>

                                        {myApplications.length === 0 && (
                                            <div className="text-gray-600">Aucune candidature en cours.</div>
                                        )}

                                        {myApplications.map((app) => (
                                            <Card key={app.id}>
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">{app.mission.title}</h4>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {/* Ex.: Nom de l'entreprise ou particulier */}
                                                                {/* Vous pouvez ajouter plus d'infos si vous avez `app.mission.postedByUser` */}
                                                                {"Particulier ou Entreprise (à adapter)"}
                                                            </p>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                Candidature envoyée le{" "}
                                                                {new Date(app.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary">
                                                            {/* Selon votre logique de DB : "En attente", "En cours", etc. */}
                                                            {app.status || "En attente"}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* ========================= Popup de création de mission ========================= */}
                <Dialog open={showNewMissionDialog} onOpenChange={setShowNewMissionDialog}>
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
                                            onValueChange={(val) => setBudgetType(val as "fixed" | "hourly")}
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
                                        onValueChange={(val) => setDurationType(val as "short" | "long")}
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
