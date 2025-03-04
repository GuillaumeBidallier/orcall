"use client";

import {
  Professional,
  ProfessionalCard,
} from "@/components/ui/professional-card";

interface SearchResultsProps {
  professionals: Professional[] | null;
  getTradeColor: (trade: string) => string;
  getTradeTextColor: (trade: string) => string;
}

export function SearchResults({
  professionals,
  getTradeColor,
  getTradeTextColor,
}: SearchResultsProps) {
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
