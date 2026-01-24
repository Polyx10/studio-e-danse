import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Actualités | Studio e - École de danse à Brest",
  description: "Suivez toute l'actualité de Studio e : événements, spectacles, concours, stages et informations importantes.",
};

const news = [
  {
    id: 1,
    title: "Stage Jazz - 6 & 7 Décembre",
    date: "2025-12-01",
    category: "Stage",
    excerpt: "Rejoignez-nous pour un week-end intensif de danse jazz avec Audrey. Tous niveaux bienvenus !",
    image: null,
    highlight: true,
  },
  {
    id: 2,
    title: "Rentrée 2025-2026",
    date: "2025-09-01",
    category: "Info",
    excerpt: "Les inscriptions pour la saison 2025-2026 sont ouvertes ! Découvrez notre nouveau planning et nos tarifs.",
    image: null,
    highlight: false,
  },
  {
    id: 3,
    title: "Label Qualité FFDanse renouvelé",
    date: "2024-05-05",
    category: "Distinction",
    excerpt: "Studio e s'est vu décerner le Label Qualité FFDanse pour la période 2023-2026. Une reconnaissance de notre engagement qualité.",
    image: null,
    highlight: false,
  },
  {
    id: 4,
    title: "Spectacle de fin d'année 2024",
    date: "2024-06-15",
    category: "Spectacle",
    excerpt: "Retour en images sur notre magnifique spectacle de fin d'année. Merci à tous les élèves et leurs familles !",
    image: null,
    highlight: false,
  },
  {
    id: 5,
    title: "Résultats Concours FFDanse",
    date: "2024-04-20",
    category: "Concours",
    excerpt: "Félicitations à nos élèves qui ont brillamment représenté l'école lors du concours régional FFDanse.",
    image: null,
    highlight: false,
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Stage":
      return "bg-purple-100 text-purple-900";
    case "Info":
      return "bg-blue-100 text-blue-900";
    case "Distinction":
      return "bg-amber-100 text-[#2D3436]";
    case "Spectacle":
      return "bg-amber-100 text-[#2D3436]";
    case "Concours":
      return "bg-green-100 text-green-900";
    default:
      return "bg-gray-100 text-gray-900";
  }
};

export default function ActualitesPage() {
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

      {/* News Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card 
                key={item.id} 
                className={`border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
                  item.highlight ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                {item.highlight && (
                  <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium">
                    À la une
                  </div>
                )}
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
