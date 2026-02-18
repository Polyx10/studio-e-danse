'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Fiche {
  id: number;
  titre: string;
  texte: string;
  photos: string[];
  categorie: string;
  highlight: boolean;
  ordre: number;
  created_at: string;
}

const COLORS = [
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-indigo-400 to-purple-500",
  "from-teal-400 to-cyan-500",
  "from-emerald-400 to-green-500",
  "from-sky-400 to-blue-500",
];

const sponsors = [
  {
    name: "Thierry Verger",
    role: "Chorégraphe",
    description: "Chorégraphe reconnu, fondateur de sa compagnie",
  },
  {
    name: "Luciano Dinatale",
    role: "Danseur & Chorégraphe",
    description: "Artiste international de renom",
  },
  {
    name: "Arthur Cadre",
    role: "Danseur",
    description: "Danseur professionnel et artiste",
  },
];

export function EquipeClient({ fiches }: { fiches: Fiche[] }) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Équipe</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Des professeurs diplômés et passionnés, avec une expérience nationale et internationale,
              qui partagent leur amour de la danse avec bienveillance et exigence.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          {fiches.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Contenu en cours de mise à jour</p>
              <p className="text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <div className="space-y-16">
              {fiches.map((fiche, index) => {
                const color = COLORS[index % COLORS.length];
                const photoLeft = index % 2 === 0;

                const photoBlock = fiche.photos && fiche.photos.length > 0 ? (
                  <div className="absolute inset-0 bg-white flex items-center justify-center">
                    <img
                      src={fiche.photos[0]}
                      alt={fiche.titre}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <div className="w-36 h-36 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {fiche.titre.charAt(0)}
                      </span>
                    </div>
                  </div>
                );

                const textBlock = (
                  <div className="p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {fiche.titre}
                    </h2>
                    {fiche.categorie && (
                      <Badge className="bg-amber-100 text-[#2D3436] hover:bg-amber-200 text-sm w-fit mb-4">
                        {fiche.categorie}
                      </Badge>
                    )}
                    {fiche.texte && (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                        {fiche.texte}
                      </div>
                    )}
                  </div>
                );

                return (
                  <div key={fiche.id}>
                    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
                      {photoLeft ? (
                        <>
                          <div className="relative overflow-hidden md:w-[55%] min-h-[300px]">{photoBlock}</div>
                          <div className="md:w-[45%]">{textBlock}</div>
                        </>
                      ) : (
                        <>
                          <div className="md:w-[45%]">{textBlock}</div>
                          <div className="relative overflow-hidden md:w-[55%] min-h-[300px]">{photoBlock}</div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-[#2D3436]">
              Parrains de l&apos;école
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Parrains</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des artistes reconnus qui soutiennent et accompagnent notre école dans sa mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.name} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#2D3436]">
                      {sponsor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{sponsor.name}</h3>
                  <p className="text-[#F9CA24] font-medium text-sm mb-2">{sponsor.role}</p>
                  <p className="text-gray-600 text-sm">{sponsor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Label Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-[#2D3436] text-white">
              Certification
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Label Qualité FFDanse 2023-2026
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Studio e - école de danse, structure affiliée à la Fédération Française de Danse,
              s&apos;est vu décerner le 5 mai 2024 le Label Qualité FFDanse.
            </p>
            <p className="text-gray-600">
              Studio e s&apos;attache à accueillir tous les publics, partage ses valeurs,
              ses pratiques sportives et culturelles avec l&apos;ensemble de ses membres.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Rejoignez-nous !
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Venez découvrir nos cours et rencontrer notre équipe passionnée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#2D3436] hover:bg-[#3d4446]">
              <Link href="/inscription">
                S&apos;inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
