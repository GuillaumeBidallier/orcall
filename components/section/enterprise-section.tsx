"use client";

import { CheckCircle, Clock, Briefcase, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnterpriseSectionProps {
  title: string;
  description: string;
  benefits: string[];
  buttonText: string;
  onButtonClick?: () => void;
}

export function EnterpriseSection({
  title,
  description,
  benefits,
  buttonText,
  onButtonClick,
}: EnterpriseSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>
              <p className="text-lg text-gray-600 mb-6">{description}</p>
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="px-6 py-5 bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-300 text-white"
                onClick={onButtonClick}
              >
                <Building className="w-5 h-5 mr-2" />
                {buttonText}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-lg z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-lg z-0"></div>
              <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold mb-1">
                      Missions courtes
                    </h3>
                    <p className="text-xs text-gray-600">
                      Interventions ponctuelles et dépannages
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-sm font-semibold mb-1">
                      Missions longues
                    </h3>
                    <p className="text-xs text-gray-600">
                      Projets et chantiers de longue durée
                    </p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg text-center text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      Trouvez le bon talent
                    </h3>
                    <p className="text-sm mb-3">
                      Plus de 500 professionnels disponibles
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full bg-white text-blue-600 hover:bg-gray-100 border-none"
                    >
                      Rechercher maintenant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
