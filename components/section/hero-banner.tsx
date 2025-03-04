"use client";

import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  searchForm?: React.ReactNode;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
}

export function HeroBanner({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryButtonText,
  secondaryButtonText,
  searchForm,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}: HeroBannerProps) {
  return (
    <div className="relative flex items-center justify-start min-h-[100vh] py-16">
      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Overlay pour une meilleure lisibilité */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col items-start">
          <div className="w-full lg:max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">{title}</span>
              <span className="block mt-2 text-orange-400">{subtitle}</span>
            </h1>
            <p className="max-w-xl mt-6 text-lg sm:text-xl leading-relaxed text-gray-200">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-5 text-base sm:text-lg font-semibold bg-orange-500 hover:bg-orange-600 shadow-lg transition-all duration-300 hover:translate-y-[-2px] text-white"
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </Button>

              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-5 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:translate-y-[-2px] text-white"
                onClick={onSecondaryButtonClick}
              >
                <Building className="mr-2 h-5 w-5" />
                {secondaryButtonText}
              </Button>
            </div>
          </div>

          {/* Formulaire de recherche en desktop - juste en dessous des boutons */}
          {searchForm && (
            <div className="hidden lg:block w-full mt-12">{searchForm}</div>
          )}

          {/* Formulaire de recherche pour mobile (en dessous du contenu) */}
          {searchForm && (
            <div className="mt-10 lg:hidden w-full">{searchForm}</div>
          )}
        </div>
      </div>
    </div>
  );
}
