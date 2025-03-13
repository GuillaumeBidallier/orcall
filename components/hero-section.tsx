"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, MapPin, Calendar } from "lucide-react";
import { SearchForm, SearchCriteria } from "@/components/search-form";
import { HeroBanner } from "@/components/section/hero-banner";
import { FeaturesSection } from "@/components/section/features-section";
import { EnterpriseSection } from "@/components/section/enterprise-section";
import { CTASection } from "@/components/section/cta-section";
import { SearchResults } from "@/components/section/search-results";
import { trades, regions, professionals } from "@/lib/data";
import { getTradeColor, getTradeTextColor } from "@/lib/utils/trade-utils";
import { Professional } from "@/components/ui/professional-card";

const HeroSection = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Professional[] | null>(
    null,
  );
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const handleSearch = (criteria: SearchCriteria) => {
    const results = professionals.filter((pro) => {
      return (
        (!criteria.trade ||
          pro.trade.toLowerCase() === criteria.trade.toLowerCase()) &&
        (!criteria.region || pro.region === criteria.region) &&
        (!criteria.city ||
          pro.city.toLowerCase().includes(criteria.city.toLowerCase())) &&
        (!criteria.availability || pro.available) &&
        (!criteria.mobility || pro.mobile) &&
        (!criteria.shortMissions || pro.shortMissions) &&
        (!criteria.longMissions || pro.longMissions)
      );
    });
    setSearchResults(results);
    setIsSearched(true);
  };

  useEffect(() => {
    if (isSearched) {
      const resultsElement = document.getElementById("search-results");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isSearched]);

  // Redirections pour les boutons du HeroBanner
  const handleProfessionnelClick = () => {
    router.push("/register?tab=professionnel");
  };

  const handleEntrepriseClick = () => {
    router.push("/register?tab=entreprise");
  };

  const features = [
    {
      icon: CheckCircle,
      title: "Professionnels vérifiés",
      description:
        "Toutes nos entreprises sont qualifiées et leurs compétences sont vérifiées pour garantir un travail de qualité.",
    },
    {
      icon: MapPin,
      title: "Proximité locale",
      description:
        "Trouvez des entreprises proches de chez vous pour plus de réactivité et un service personnalisé.",
    },
    {
      icon: Calendar,
      title: "Disponibilité en temps réel",
      description:
        "Consultez la disponibilité des professionnels et planifiez vos travaux selon votre calendrier.",
    },
  ];

  const enterpriseBenefits = [
    "Accès à un large réseau d'entreprises qualifiées et disponibles",
    "Flexibilité des missions : courtes ou longues selon vos besoins",
    "Réduction des délais de recrutement et des coûts administratifs",
    "Gestion simplifiée des contrats et de la facturation",
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Banner avec le formulaire de recherche intégré */}
      <div className="relative">
        <HeroBanner
          title="Trouvez le bon professionnel"
          subtitle="pour tous vos projets"
          description="Orcall connecte les particuliers et les entreprises avec des auto-entrepreneurs qualifiés pour des missions courtes ou longues."
          backgroundImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          primaryButtonText="Professionnel ? Créez votre profil"
          secondaryButtonText="Entreprise ? Trouvez des talents"
          onPrimaryButtonClick={handleProfessionnelClick}
          onSecondaryButtonClick={handleEntrepriseClick}
          searchForm={
            <SearchForm
              trades={trades}
              regions={regions}
              onSearch={handleSearch}
            />
          }
        />
      </div>

      <FeaturesSection
        title="Pourquoi choisir Orcall ?"
        description="Une plateforme simple et efficace pour connecter particuliers, entreprises et professionnels du bâtiment"
        features={features}
        tags={trades}
        buttonText="Trouver un professionnel"
      />

      <EnterpriseSection
        title="Solutions pour les entreprises"
        description="Trouvez rapidement des professionnels qualifiés pour vos chantiers et projets, que ce soit pour des missions ponctuelles ou des collaborations de longue durée."
        benefits={enterpriseBenefits}
        buttonText="Découvrir nos offres entreprises"
      />

      <CTASection
        title="Vous êtes un professionnel du bâtiment ?"
        description="Rejoignez notre réseau et développez votre activité en trouvant de nouveaux clients et des missions adaptées à vos compétences."
        buttonText="Créer votre profil professionnel"
      />

      {isSearched && (
        <div id="search-results">
          <SearchResults
            professionals={searchResults}
            getTradeColor={getTradeColor}
            getTradeTextColor={getTradeTextColor}
          />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
