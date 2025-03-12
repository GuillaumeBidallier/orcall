"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Briefcase, MapPin, Calendar, Clock, Euro, Building, User,
    Plus, Search, Filter, ArrowRight, CheckCircle, AlertCircle
} from "lucide-react";
import { trades } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface Mission {
    id: string;
    title: string;
    description: string;
    company: {
        name: string;
        logo?: string;
    };
    trade: string;
    location: string;
    budget: {
        min: number;
        max: number;
        type: "hourly" | "fixed";
    };
    duration: {
        start: string;
        end: string;
        type: "short" | "long";
    };
    status: "open" | "in_progress" | "completed";
    applicants: number;
    createdAt: string;
    requirements: string[];
}

export default function MissionsPage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("browse");
    const [showNewMissionDialog, setShowNewMissionDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [filters, setFilters] = useState({
        trade: "",
        location: "",
        duration: "",
        budget: "",
    });

    const missions: Mission[] = [
        {
            id: "1",
            title: "Rénovation complète d'un appartement",
            description: "Recherche peintre qualifié pour la rénovation complète d'un appartement de 80m². Travaux incluant la préparation des surfaces, peinture des murs et plafonds, et finitions.",
            company: {
                name: "Rénovation Plus",
                logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3",
            },
            trade: "peintre",
            location: "Paris 11e",
            budget: {
                min: 2500,
                max: 3500,
                type: "fixed",
            },
            duration: {
                start: "2024-04-01",
                end: "2024-04-15",
                type: "short",
            },
            status: "open",
            applicants: 3,
            createdAt: "2024-03-15",
            requirements: [
                "5 ans d'expérience minimum",
                "Spécialisation en peinture décorative",
                "Disponible immédiatement",
            ],
        },
        {
            id: "2",
            title: "Chantier de construction neuve",
            description: "Recherche maçon expérimenté pour un chantier de construction d'une maison individuelle. Travaux de fondation, élévation des murs, et finitions.",
            company: {
                name: "Constructions Modernes",
                logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3",
            },
            trade: "macon",
            location: "Lyon",
            budget: {
                min: 45,
                max: 55,
                type: "hourly",
            },
            duration: {
                start: "2024-04-15",
                end: "2024-07-15",
                type: "long",
            },
            status: "open",
            applicants: 5,
            createdAt: "2024-03-14",
            requirements: [
                "10 ans d'expérience",
                "Permis de conduire obligatoire",
                "Habilitations à jour",
            ],
        },
    ];

    const myMissions: Mission[] = [
        {
            id: "3",
            title: "Rénovation salle de bain",
            description: "Rénovation complète d'une salle de bain incluant peinture, carrelage et petite plomberie.",
            company: {
                name: "Particulier - M. Dubois",
            },
            trade: "peintre",
            location: "Paris 15e",
            budget: {
                min: 2000,
                max: 2500,
                type: "fixed",
            },
            duration: {
                start: "2024-04-10",
                end: "2024-04-20",
                type: "short",
            },
            status: "in_progress",
            applicants: 4,
            createdAt: "2024-03-10",
            requirements: [
                "Expérience en rénovation",
                "Disponible en semaine",
            ],
        }
    ];

    const handleApply = (missionId: string) => {
        setIsSubmitting(true);

        setTimeout(() => {
            toast({
                title: "Candidature envoyée",
                description: "Votre candidature a été envoyée avec succès.",
            });
            setIsSubmitting(false);
        }, 1000);
    };

    const handlePublishMission = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            toast({
                title: "Mission publiée",
                description: "Votre mission a été publiée avec succès.",
            });
            setIsSubmitting(false);
            setShowNewMissionDialog(false);
        }, 1000);
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
                                            onValueChange={(value) => setFilters({ ...filters, trade: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les métiers" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous les métiers</SelectItem>
                                                {trades.map((trade) => (
                                                    <SelectItem key={trade.id} value={trade.id}>
                                                        {trade.name}
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
                                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        />
                                    </div>

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

                        <div className="grid grid-cols-1 gap-6">
                            {missions.map((mission) => (
                                <Card key={mission.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start">
                                                    {mission.company.logo && (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                                                            <img
                                                                src={mission.company.logo}
                                                                alt={mission.company.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
                                                        <div className="flex items-center text-gray-600 text-sm mb-2">
                                                            <Building className="w-4 h-4 mr-1" />
                                                            {mission.company.name}
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
                              {new Date(mission.duration.start).toLocaleDateString()} - {new Date(mission.duration.end).toLocaleDateString()}
                            </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">
                              {mission.duration.type === "short" ? "Mission courte" : "Mission longue"}
                            </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Euro className="w-4 h-4 text-gray-500 mr-2" />
                                                        <span className="text-sm">
                              {mission.budget.type === "fixed"
                                  ? `${mission.budget.min}€ - ${mission.budget.max}€`
                                  : `${mission.budget.min}€/h - ${mission.budget.max}€/h`
                              }
                            </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                        {trades.find(t => t.id === mission.trade)?.name || mission.trade}
                                                    </Badge>
                                                    {mission.requirements.map((req, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {req}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                                                <div className="text-sm text-gray-500 mb-4">
                                                    Publiée le {new Date(mission.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="text-sm text-gray-600">
                                                        {mission.applicants} candidat{mission.applicants > 1 ? 's' : ''}
                                                    </div>
                                                    <Button
                                                        className="w-full md:w-auto bg-orange-500 hover:bg-orange-600"
                                                        onClick={() => handleApply(mission.id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? "Envoi..." : "Postuler"}
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="my-missions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mes missions</CardTitle>
                                <CardDescription>
                                    Gérez vos candidatures et suivez vos missions en cours
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Mission en cours</h3>
                                        <Badge className="bg-blue-500">En cours</Badge>
                                    </div>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-start">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                                                            <User className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-2">{myMissions[0].title}</h3>
                                                            <div className="flex items-center text-gray-600 text-sm mb-2">
                                                                <Building className="w-4 h-4 mr-1" />
                                                                {myMissions[0].company.name}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 mb-4">{myMissions[0].description}</p>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div className="flex items-center">
                                                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                                            <span className="text-sm">{myMissions[0].location}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                                            <span className="text-sm">
                                {new Date(myMissions[0].duration.start).toLocaleDateString()} - {new Date(myMissions[0].duration.end).toLocaleDateString()}
                              </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                                            <span className="text-sm">
                                {myMissions[0].duration.type === "short" ? "Mission courte" : "Mission longue"}
                              </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Euro className="w-4 h-4 text-gray-500 mr-2" />
                                                            <span className="text-sm">
                                {myMissions[0].budget.type === "fixed"
                                    ? `${myMissions[0].budget.min}€ - ${myMissions[0].budget.max}€`
                                    : `${myMissions[0].budget.min}€/h - ${myMissions[0].budget.max}€/h`
                                }
                              </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                            {trades.find(t => t.id === myMissions[0].trade)?.name || myMissions[0].trade}
                                                        </Badge>
                                                        {myMissions[0].requirements.map((req, index) => (
                                                            <Badge key={index} variant="outline">
                                                                {req}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="mt-6 space-y-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                            Mission acceptée le {new Date().toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <AlertCircle className="w-4 h-4 text-blue-500 mr-2" />
                                                            Début des travaux dans {Math.ceil((new Date(myMissions[0].duration.start).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                                                    <div className="text-sm text-gray-500 mb-4">
                                                        Mission obtenue le {new Date(myMissions[0].createdAt).toLocaleDateString()}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full md:w-auto"
                                                    >
                                                        Contacter le client
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex items-center justify-between mt-8">
                                        <h3 className="text-lg font-semibold">Candidatures en cours</h3>
                                        <Badge variant="outline" className="bg-gray-100">
                                            2 candidatures
                                        </Badge>
                                    </div>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold mb-2">Rénovation cuisine</h4>
                                                    <p className="text-sm text-gray-600 mb-2">Particulier - Mme Martin</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        Candidature envoyée le {new Date().toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">En attente</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

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
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="trade">Métier recherché</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un métier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {trades.map((trade) => (
                                                <SelectItem key={trade.id} value={trade.id}>
                                                    {trade.name}
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
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start-date">Date de début</Label>
                                        <Input type="date" id="start-date" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end-date">Date de fin</Label>
                                        <Input type="date" id="end-date" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="budget-type">Type de budget</Label>
                                        <Select required>
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
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Localisation</Label>
                                    <Input
                                        id="location"
                                        placeholder="Ville ou région"
                                        required
                                    />
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