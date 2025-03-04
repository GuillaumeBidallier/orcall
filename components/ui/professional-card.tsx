"use client";

import {
  Star,
  MapPin,
  Calendar,
  Truck,
  Clock,
  Briefcase,
  Building,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Professional {
  id: number;
  name: string;
  trade: string;
  region: string;
  city: string;
  available: boolean;
  mobile: boolean;
  shortMissions: boolean;
  longMissions: boolean;
  rating: number;
  reviews: number;
  image: string;
  banner: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  getTradeColor: (trade: string) => string;
  getTradeTextColor: (trade: string) => string;
}

export function ProfessionalCard({
  professional: pro,
  getTradeColor,
  getTradeTextColor,
}: ProfessionalCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${pro.banner})` }}
      >
        <div
          className={`w-full h-full ${getTradeColor(pro.trade)} opacity-50`}
        ></div>
      </div>

      <CardHeader className="relative pb-2">
        <div className="absolute -top-12 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md">
          <img
            src={pro.image}
            alt={pro.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="ml-24">
          <CardTitle>{pro.name}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <Badge
              className={`${getTradeColor(pro.trade)} ${getTradeTextColor(pro.trade)} hover:opacity-90 transition-opacity duration-300`}
            >
              {pro.trade}
            </Badge>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>
            {pro.city}, {pro.region}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(pro.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {pro.rating} ({pro.reviews} avis)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {pro.available && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-green-600 border-green-200 bg-green-50"
            >
              <Calendar className="w-3 h-3" />
              Disponible
            </Badge>
          )}

          {pro.mobile && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-blue-600 border-blue-200 bg-blue-50"
            >
              <Truck className="w-3 h-3" />
              Mobile
            </Badge>
          )}

          {pro.shortMissions && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-purple-600 border-purple-200 bg-purple-50"
            >
              <Clock className="w-3 h-3" />
              Missions courtes
            </Badge>
          )}

          {pro.longMissions && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-indigo-600 border-indigo-200 bg-indigo-50"
            >
              <Briefcase className="w-3 h-3" />
              Missions longues
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 group text-white">
          <span>Contacter</span>
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>

        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Voir profil
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <Building className="w-3 h-3 mr-1" />
            Proposer mission
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
