import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Paintbrush,
  Wrench,
  Hammer,
  Lightbulb,
  Ruler,
  Grid,
  ArrowRight,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Paintbrush className="w-10 h-10 text-orange-500" />,
      title: "Peinture",
      description:
        "Travaux de peinture intérieure et extérieure, revêtements muraux, décoration.",
      color: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      icon: <Wrench className="w-10 h-10 text-blue-500" />,
      title: "Plomberie",
      description:
        "Installation et réparation de systèmes de plomberie, sanitaires, chauffage.",
      color: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Hammer className="w-10 h-10 text-amber-600" />,
      title: "Maçonnerie",
      description:
        "Construction, rénovation, travaux de gros œuvre et de second œuvre.",
      color: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
      title: "Électricité",
      description:
        "Installation électrique, mise aux normes, dépannage, domotique.",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      icon: <Ruler className="w-10 h-10 text-gray-700" />,
      title: "Menuiserie",
      description:
        "Fabrication et pose de menuiseries, agencement, ébénisterie.",
      color: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      icon: <Grid className="w-10 h-10 text-teal-500" />,
      title: "Carrelage",
      description: "Pose de carrelage, faïence, revêtements de sols et murs.",
      color: "bg-teal-50",
      borderColor: "border-teal-200",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 py-20">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Nos Services
            </h1>
            <p className="mb-10 text-xl text-gray-300">
              Orcall vous met en relation avec des professionnels qualifiés dans
              tous les corps de métier du bâtiment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white py-6 px-8"
              >
                Trouver un professionnel
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 py-6 px-8"
              >
                Comment ça marche ?
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container px-4 py-20 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Des professionnels pour tous vos projets
          </h2>
          <p className="text-xl text-gray-600">
            Que vous soyez un particulier ou une entreprise, trouvez la bonne
            entreprise pour vos travaux.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`transition-all hover:shadow-lg border ${service.borderColor}`}
            >
              <CardHeader className={`${service.color} rounded-t-lg`}>
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-sm">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl text-center">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-center text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full group">
                  Trouver un {service.title.toLowerCase()}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="bg-gray-50 py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trouver un professionnel n&#39;a jamais été aussi simple
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="pt-16 text-center px-6">
                <h3 className="text-xl font-bold mb-3">
                  Décrivez votre projet
                </h3>
                <p className="text-gray-600">
                  Précisez vos besoins, le type de travaux et votre localisation
                  pour trouver les professionnels adaptés.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="pt-16 text-center px-6">
                <h3 className="text-xl font-bold mb-3">Comparez les profils</h3>
                <p className="text-gray-600">
                  Consultez les profils des entreprises, leurs réalisations,
                  avis et disponibilités pour faire votre choix.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="pt-16 text-center px-6">
                <h3 className="text-xl font-bold mb-3">
                  Contactez et réalisez
                </h3>
                <p className="text-gray-600">
                  Entrez en contact avec le professionnel choisi et concrétisez
                  votre projet en toute sérénité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl p-8 mx-auto mt-16 text-center bg-orange-50 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Vous êtes un professionnel du bâtiment ?
        </h2>
        <p className="mb-6 text-gray-600">
          Rejoignez notre plateforme pour développer votre activité et trouver
          de nouveaux clients.
        </p>
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
          Créer votre profil professionnel
        </Button>
      </div>
    </div>
  );
}
