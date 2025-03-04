import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Building, User, ArrowRight } from "lucide-react";

export default function TarifsPage() {
  return (
    <div className="container px-4 py-16 mx-auto">
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Nos Tarifs
        </h1>
        <p className="text-xl text-gray-600">
          Chez Orcall, nous avons conçu des plans tarifaires flexibles, pensés
          pour répondre aux besoins spécifiques des entreprises et des
          professionnels indépendants dans la peinture en bâtiment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Plan Entreprise */}
        <Card className="flex flex-col border-blue-500 shadow-lg relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-40 text-center px-3 py-1 text-xs font-semibold text-white bg-blue-500"
            style={{
              transform: "rotate(45deg) translateX(30px) translateY(-10px)",
            }}
          >
            Populaire
          </div>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50">
              <Building className="w-8 h-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">Pour les Entreprises</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">29€</span>
              <span className="text-sm text-gray-500"> /mois</span>
            </div>
            <CardDescription className="mt-2 text-base">
              Économisez jusqu'à 300€/mois en évitant les frais d'intérim !
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Accès à un réseau de peintres professionnels indépendants
                  qualifiés
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Recherche simplifiée des peintres disponibles en un clin d'œil
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Économies substantielles en remplaçant l'intérim par de la
                  sous-traitance directe
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Bannière publicitaire de votre entreprise sur notre plateforme
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Mise en relation instantanée avec des peintres en fonction de
                  vos besoins
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-white">
              <Building className="w-5 h-5 mr-2" />
              S'inscrire en tant qu'Entreprise
            </Button>
          </CardFooter>
        </Card>

        {/* Plan Professionnnel Indépendant */}
        <Card className="flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-orange-50">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">
              Pour les Auto-Entrepreneurs
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">0€</span>
            </div>
            <CardDescription className="mt-2 text-base">
              Créez votre profil gratuitement et commencez à trouver des
              missions !
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Création d'un portfolio personnalisé</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Visibilité immédiate auprès des entreprises de peinture
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Accès à des missions régulières, directement sans passer par
                  des agences
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Indicateur de disponibilité pour être contacté en temps réel
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Aucune commission sur vos missions : vous gardez 100% de vos
                  revenus
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-white">
              <User className="w-5 h-5 mr-2" />
              S'inscrire gratuitement
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Nos Engagements */}
      <div className="mt-20 bg-gray-50 rounded-xl p-8 md:p-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Nos Engagements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-50">
              <Check className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune commission</h3>
            <p className="text-gray-600">
              Nous croyons que votre travail mérite d'être rémunéré
              équitablement. Vous gardez 100% de vos revenus.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-50">
              <Check className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pas de frais cachés</h3>
            <p className="text-gray-600">
              Tout est clair, tout est inclus dans l'abonnement ou l'inscription
              gratuite. Aucune surprise.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-50">
              <Check className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Simplicité</h3>
            <p className="text-gray-600">
              Un abonnement facile à gérer pour les entreprises et une
              plateforme 100% dédiée à la peinture en bâtiment.
            </p>
          </div>
        </div>
      </div>

      {/* Pourquoi Choisir Orcall */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Pourquoi Choisir Orcall ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-3">
              Économisez de l'argent et gagnez du temps
            </h3>
            <p className="text-gray-600">
              Évitez les agences d'intérim et choisissez des partenariats
              directement avec des professionnels de la peinture.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-3">Soyez plus flexible</h3>
            <p className="text-gray-600">
              Trouvez des renforts rapidement sans les contraintes de l'intérim
              traditionnel.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-3">Réseau spécialisé</h3>
            <p className="text-gray-600">
              Uniquement des entreprises et des professionnels indépendants dans
              le bâtiment, garantissant une expertise et une qualité
              supérieures.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-10 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à Rejoindre Orcall ?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Que vous soyez une entreprise à la recherche de talents ou
          professionnel indépendant cherchant des missions, Orcall est la
          plateforme qu'il vous faut.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8"
          >
            <Building className="w-5 h-5 mr-2" />
            S'inscrire en tant qu'Entreprise
          </Button>
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-orange-600 py-6 px-8"
          >
            <User className="w-5 h-5 mr-2" />
            Créer un compte Professionnel Indépendant
          </Button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">
              Comment fonctionne l'abonnement pour les entreprises ?
            </h3>
            <p className="text-gray-600">
              L'abonnement est mensuel, sans engagement. Vous pouvez l'annuler à
              tout moment. Il vous donne accès à toutes les fonctionnalités de
              la plateforme pour trouver des professionnels indépendants
              qualifiés.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">
              Est-ce vraiment gratuit pour les professionnels indépendants ?
            </h3>
            <p className="text-gray-600">
              Oui, l'inscription est totalement gratuite pour les professionnels
              indépendants. Nous ne prenons aucune commission sur vos missions,
              vous gardez 100% de vos revenus.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">
              Comment sont vérifiés les professionnels sur la plateforme ?
            </h3>
            <p className="text-gray-600">
              Nous vérifions l'identité, les qualifications et les assurances
              professionnelles de chaque professionnel indépendant avant de
              valider leur profil sur notre plateforme.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Voir toutes les questions fréquentes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
