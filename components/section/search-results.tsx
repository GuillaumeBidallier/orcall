"use client";

import {
    Professional,
    ProfessionalCard,
} from "@/components/ui/professional-card";
import { getTradeColor, getTradeTextColor } from "@/lib/utils/trade-utils";

interface SearchResultsProps {
    professionals: Professional[] | null;
    getTradeColor: (trade: string) => "bg-orange-500" | "bg-blue-500" | "bg-amber-600" | "bg-yellow-500" | "bg-brown-500" | "bg-teal-500";
    getTradeTextColor: (trade: string) => "text-white" | "text-gray-800";
}

export function SearchResults({ professionals }: SearchResultsProps) {
    if (!professionals) return null;

    return (
        <div className="container px-4 py-16 mx-auto">
            <h2 className="mb-10 text-3xl font-bold text-center text-gray-900">
                {professionals.length > 0
                    ? `${professionals.length} prestataires trouvés`
                    : "Aucun prestataire trouvé"}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {professionals.map((pro) => (
                    <ProfessionalCard
                        key={pro.id}
                        professional={pro}
                        getTradeColor={getTradeColor}
                        getTradeTextColor={getTradeTextColor}
                    />
                ))}
            </div>
        </div>
    );
}
