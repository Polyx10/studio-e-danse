import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Stages & Master Classes | Studio e - École de danse à Brest",
  description: "Découvrez nos stages et master classes de danse à Brest. Des intervenants de qualité pour progresser et découvrir de nouveaux styles.",
};

const upcomingStages = [
  {
    id: 1,
    title: "Stage Jazz",
    date: "6 & 7 Décembre 2025",
    time: "10h00 - 17h00",
    teacher: "Audrey",
    level: "Tous niveaux",
    description: "Un week-end intensif pour travailler la technique jazz et apprendre une chorégraphie originale.",
    price: "80€ les 2 jours",
    spots: "Places limitées",
    highlight: true,
  },
  {
    id: 2,
    title: "Master Class Classique",
    date: "Janvier 2026",
    time: "À définir",
    teacher: "Intervenant invité",
    level: "Intermédiaire/Avancé",
    description: "Une master class exceptionnelle avec un danseur professionnel de renom.",
    price: "À définir",
    spots: "Sur inscription",
    highlight: false,
  },
  {
    id: 3,
    title: "Stage Contemporain",
    date: "Février 2026",
    time: "À définir",
    teacher: "Jeanette Moreno Silva",
    level: "Ados/Adultes",
    description: "Exploration du mouvement contemporain et travail d'improvisation.",
    price: "À définir",
    spots: "Sur inscription",
    highlight: false,
  },
];

const pastStages = [
  {
    title: "Stage Jazz - Rentrée 2024",
    teacher: "Audrey",
    participants: "25 participants",
  },
  {
    title: "Master Class avec Thierry Verger",
    teacher: "Thierry Verger",
    participants: "30 participants",
  },
  {
    title: "Stage Classique été 2024",
    teacher: "Aymeric",
    participants: "20 participants",
  },
];

export default function StagesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Stages & Master Classes</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Tout au long de l&apos;année, Studio e organise des stages et master classes 
              avec des intervenants de qualité pour vous permettre de progresser et 
              découvrir de nouveaux styles.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Stages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prochains stages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Inscrivez-vous dès maintenant pour réserver votre place !
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingStages.map((stage) => (
              <Card 
                key={stage.id} 
                className={`border-0 shadow-lg overflow-hidden ${
                  stage.highlight ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                {stage.highlight && (
                  <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
                    À venir prochainement !
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{stage.title}</CardTitle>
                    <Badge variant={stage.highlight ? "default" : "secondary"} className={stage.highlight ? "bg-[#2D3436]" : ""}>
                      {stage.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{stage.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      
                      <span>{stage.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      
                      <span>{stage.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-[#F9CA24]" />
                      <span>Avec {stage.teacher}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2D3436]">{stage.price}</p>
                      <p className="text-xs text-gray-500">{stage.spots}</p>
                    </div>
                    <Button size="sm" className="bg-[#2D3436] hover:bg-[#3d4446]">
                      S&apos;inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Comment participer ?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-[#2D3436]">
                  1
                </div>
                <h3 className="font-semibold mb-2">Choisissez</h3>
                <p className="text-sm text-gray-600">
                  Sélectionnez le stage qui vous intéresse
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-[#2D3436]">
                  2
                </div>
                <h3 className="font-semibold mb-2">Inscrivez-vous</h3>
                <p className="text-sm text-gray-600">
                  Contactez-nous ou inscrivez-vous au secrétariat
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-[#2D3436]">
                  3
                </div>
                <h3 className="font-semibold mb-2">Dansez !</h3>
                <p className="text-sm text-gray-600">
                  Venez profiter du stage avec votre tenue de danse
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Stages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stages passés</h2>
            <p className="text-gray-600">
              Quelques-uns de nos stages précédents
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {pastStages.map((stage, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{stage.title}</h3>
                  <p className="text-sm text-gray-600">{stage.teacher}</p>
                  <p className="text-xs text-gray-500 mt-2">{stage.participants}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2D3436] to-[#3d4446] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous souhaitez être informé ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour être tenu au courant des prochains stages et master classes.
          </p>
          <Button asChild size="lg" className="bg-white text-[#2D3436] hover:bg-amber-100">
            <Link href="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
