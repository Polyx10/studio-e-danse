'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface Fiche {
  id: number;
  titre: string;
  texte: string;
  photos: string[];
  categorie: string;
  highlight: boolean;
  show_date: boolean;
  created_at: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Stage": return "bg-purple-100 text-purple-900";
    case "Master Class": return "bg-indigo-100 text-indigo-900";
    case "Info": return "bg-blue-100 text-blue-900";
    case "Spectacle": return "bg-amber-100 text-[#2D3436]";
    case "Événement": return "bg-rose-100 text-rose-900";
    default: return "bg-gray-100 text-gray-900";
  }
};

function PhotoGallery({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className={`grid ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-3`}>
        {photos.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setLightbox(i)}
          />
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          {lightbox > 0 && (
            <button
              className="absolute left-4 text-white text-4xl font-light hover:text-gray-300"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              ‹
            </button>
          )}
          {lightbox < photos.length - 1 && (
            <button
              className="absolute right-4 text-white text-4xl font-light hover:text-gray-300"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              ›
            </button>
          )}
          <img
            src={photos[lightbox]}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white text-sm">
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}

export function StagesClient({ fiches }: { fiches: Fiche[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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

      {/* Fiches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {fiches.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Aucun stage programmé pour le moment</p>
              <p className="text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              {fiches.map((fiche, index) => (
                <Card
                  key={fiche.id}
                  className={`border-0 shadow-lg overflow-hidden ${
                    fiche.highlight ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  {fiche.highlight && (
                    <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
                      À venir prochainement !
                    </div>
                  )}
                  <CardContent className="p-0">
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {fiche.categorie && (
                          <Badge className={getCategoryColor(fiche.categorie)}>
                            {fiche.categorie}
                          </Badge>
                        )}
                        {fiche.show_date !== false && (
                          <span className="text-xs text-gray-500">
                            {formatDate(fiche.created_at)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{fiche.titre}</h2>
                      {fiche.texte && (
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                          {fiche.texte}
                        </div>
                      )}
                      {fiche.photos && fiche.photos.length > 0 && (
                        <PhotoGallery photos={fiche.photos} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
