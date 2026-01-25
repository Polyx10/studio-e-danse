import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Download, Info, Calculator } from "lucide-react";
import { tarifGrille, tarifsSpeciaux, fraisFixes } from "@studio-e-danse/planning-shared";

export const metadata = {
  title: "Tarifs | Studio e - École de danse à Brest",
  description: "Consultez nos tarifs 2025-2026. Cours de danse pour enfants, ados et adultes à Brest.",
};

const pricing = {
  fullRate: [
    { courses: "1 cours/semaine", price: "320 €" },
    { courses: "2 cours/semaine", price: "480 €" },
    { courses: "3 cours/semaine", price: "600 €" },
    { courses: "4 cours/semaine", price: "700 €" },
    { courses: "5 cours/semaine et +", price: "780 €" },
  ],
  reducedRate: [
    { courses: "1 cours/semaine", price: "290 €" },
    { courses: "2 cours/semaine", price: "430 €" },
    { courses: "3 cours/semaine", price: "540 €" },
    { courses: "4 cours/semaine", price: "630 €" },
    { courses: "5 cours/semaine et +", price: "700 €" },
  ],
  special: [
    { name: "Danse Études", price: "Sur devis" },
    { name: "Préparation Concours", price: "Sur devis" },
    { name: "Adhésion annuelle", price: "30 €" },
  ],
};

export default function TarifsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center gap-4">
              <Calculator className="h-12 w-12 text-[#F9CA24]" />
              Tarifs 2025-2026
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Découvrez nos formules tarifaires adaptées à vos besoins. 
              Les tarifs sont calculés selon le nombre d&apos;heures de cours par semaine.
            </p>
          </div>
        </div>
      </section>

      {/* Lien vers le planning */}
      <section className="py-6 bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-800">
            Consultez le <Link href="/cours" className="font-semibold underline hover:text-amber-900">planning des cours</Link> pour voir tous les horaires disponibles.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tarifs 2025-2026</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos tarifs sont annuels et payables en une ou plusieurs fois.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Full Rate */}
            <Card className="border-2 border-amber-200">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-xl text-[#2D3436]">Tarif Plein</CardTitle>
                <p className="text-sm text-gray-600">
                  Pour une famille avec 1 seule adhésion
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {pricing.fullRate.map((item, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{item.courses}</span>
                      <span className="font-bold text-[#2D3436]">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reduced Rate */}
            <Card className="border-2 border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl text-green-900">Tarif Réduit</CardTitle>
                <p className="text-sm text-gray-600">
                  Pour les membres supplémentaires d&apos;une même famille
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {pricing.reducedRate.map((item, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700">{item.courses}</span>
                      <span className="font-bold text-green-900">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#2D3436] mb-2">Comment ça marche ?</h4>
                    <ul className="text-[#2D3436] text-sm space-y-1">
                      <li>• Une famille avec 1 seule adhésion utilise la grille &quot;Tarif Plein&quot;</li>
                      <li>• Une famille avec 2, 3... adhésions utilise &quot;Tarif Plein&quot; pour le membre avec le plus de cours</li>
                      <li>• Les autres membres de la famille bénéficient du &quot;Tarif Réduit&quot;</li>
                      <li>• L&apos;adhésion annuelle de 30€ est obligatoire pour chaque membre</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Pricing */}
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Tarifs spéciaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {pricing.special.map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-[#2D3436] font-bold">{item.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Documents utiles</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Formulaire d&apos;inscription (PDF)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Règlement intérieur (PDF)
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Tenues recommandées (PDF)
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#2D3436] to-[#3d4446] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à vous inscrire ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Remplissez le formulaire d&apos;inscription en ligne et venez finaliser 
            votre inscription à l&apos;école.
          </p>
          <Button asChild size="lg" className="bg-white text-[#2D3436] hover:bg-amber-100">
            <Link href="/inscription">
              S&apos;inscrire en ligne
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
