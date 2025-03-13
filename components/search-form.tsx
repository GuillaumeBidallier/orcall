"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { trades, departments } from "@/lib/data";

export interface SearchCriteria {
  trade: string;
  department: string;
  city: string;
  availability: boolean;
  mobility: boolean;
  shortMissions: boolean;
  longMissions: boolean;
}

export function SearchForm() {
  const router = useRouter();
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState(false);
  const [mobility, setMobility] = useState(false);
  const [shortMissions, setShortMissions] = useState(false);
  const [longMissions, setLongMissions] = useState(false);

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (selectedTrade && selectedTrade !== "all")
      query.append("trade", selectedTrade);
    if (selectedDepartment && selectedDepartment !== "all")
      query.append("department", selectedDepartment);
    if (city) query.append("city", city);
    if (availability) query.append("available", "true");
    if (mobility) query.append("mobile", "true");
    if (shortMissions) query.append("shortMissions", "true");
    if (longMissions) query.append("longMissions", "true");

    // Redirige vers la page RecherchePage avec les filtres dans l'URL
    router.push("/search?" + query.toString());
  };

  return (
    <div className="p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full lg:w-[800px] border border-gray-100">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Rechercher un prestataire
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="trade" className="text-sm font-medium mb-1.5 block">
            Métier
          </Label>
          <Select value={selectedTrade} onValueChange={setSelectedTrade}>
            <SelectTrigger
              id="trade"
              className="border-gray-300 focus:ring-orange-500"
            >
              <SelectValue placeholder="Sélectionnez un métier" />
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
          <Label
            htmlFor="department"
            className="text-sm font-medium mb-1.5 block"
          >
            Département
          </Label>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger
              id="department"
              className="border-gray-300 focus:ring-orange-500"
            >
              <SelectValue placeholder="Sélectionnez un département" />
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

        <div>
          <Label htmlFor="city" className="text-sm font-medium mb-1.5 block">
            Ville
          </Label>
          <Input
            id="city"
            placeholder="Entrez une ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border-gray-300 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-5">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="availability"
            checked={availability}
            onCheckedChange={(checked) => setAvailability(checked as boolean)}
            className="text-orange-500 focus:ring-orange-500"
          />
          <Label
            htmlFor="availability"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Disponible maintenant
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mobility"
            checked={mobility}
            onCheckedChange={(checked) => setMobility(checked as boolean)}
            className="text-orange-500 focus:ring-orange-500"
          />
          <Label
            htmlFor="mobility"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Mobile
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="shortMissions"
            checked={shortMissions}
            onCheckedChange={(checked) => setShortMissions(checked as boolean)}
            className="text-orange-500 focus:ring-orange-500"
          />
          <Label
            htmlFor="shortMissions"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Missions courtes
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="longMissions"
            checked={longMissions}
            onCheckedChange={(checked) => setLongMissions(checked as boolean)}
            className="text-orange-500 focus:ring-orange-500"
          />
          <Label
            htmlFor="longMissions"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Missions longues
          </Label>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full mt-7 py-6 bg-orange-500 hover:bg-orange-600 shadow-md transition-all duration-300 text-white"
      >
        <Search className="w-5 h-5 mr-2" />
        Rechercher
      </Button>
    </div>
  );
}
