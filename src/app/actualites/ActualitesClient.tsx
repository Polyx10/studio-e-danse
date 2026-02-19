'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { parseSimpleMarkdown } from "@/lib/markdown";

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
    case "Info": return "bg-blue-100 text-blue-900";
    case "Distinction": return "bg-amber-100 text-[#2D3436]";
    case "Spectacle": return "bg-amber-100 text-[#2D3436]";
    case "Concours": return "bg-green-100 text-green-900";
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

export function ActualitesClient({ fiches }: { fiches: Fiche[] }) {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Actualités</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Restez informé de toute l&apos;actualité de Studio e : événements,
              spectacles, concours, stages et informations importantes.
            </p>
          </div>
        </div>
      </section>

      {/* Fiches */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {fiches.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Aucune actualité pour le moment</p>
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
                      À la une
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
                        <div 
                          className="text-gray-700 leading-relaxed whitespace-pre-line text-justify"
                          dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(fiche.texte) }}
                        />
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

      {/* Social Media CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Suivez-nous sur les réseaux sociaux
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Pour ne rien manquer de notre actualité, suivez-nous sur Facebook et Instagram !
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2D3436] to-[#3d4446] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Envie de nous rejoindre ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous dès maintenant pour la saison 2025-2026 !
          </p>
          <Button asChild size="lg" className="bg-white text-[#2D3436] hover:bg-amber-100">
            <Link href="/inscription">
              S&apos;inscrire
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
