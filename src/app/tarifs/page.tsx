"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, Euro, Users, CheckCircle2 } from "lucide-react";
import { tarifGrille, tarifsSpeciaux, fraisFixes, grilleNiveaux } from "@/lib/planning-data";

export default function TarifsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tarifs</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Studio e propose un système de tarification à la durée : 
              plus vous dansez, plus le tarif horaire est avantageux !
            </p>
          </div>
        </div>
      </section>

      {/* Principe de tarification */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Clock className="h-8 w-8 text-[#F9CA24]" />
                Tarification à la durée
              </h2>
              <p className="text-gray-600 text-lg">
                Choisissez vos cours selon vos envies et votre emploi du temps. 
                Nous calculons votre tarif en fonction du nombre total d&apos;heures de cours par semaine.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-[#F9CA24]">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-8 w-8 text-[#F9CA24]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Liberté de choix</h3>
                  <p className="text-gray-600 text-sm">
                    Combinez les cours qui vous intéressent parmi notre planning
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F9CA24]">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-[#F9CA24]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Tarif dégressif</h3>
                  <p className="text-gray-600 text-sm">
                    Plus vous dansez, moins le tarif horaire est élevé
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F9CA24]">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-[#F9CA24]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Tarif famille</h3>
                  <p className="text-gray-600 text-sm">
                    Tarif réduit pour les familles avec plusieurs adhésions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Grille tarifaire et Options spéciales */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">TARIFS</h2>
          
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-gray-700 text-center mb-2">
              Une famille avec 1 seule adhésion utilise la grille tarifaire "Tarif Plein"
            </p>
            <p className="text-gray-700 text-center">
              Une famille avec 2, 3, ... adhésions utilise la grille tarifaire "Tarif Plein" pour le membre de la famille qui a le plus de cours, puis la grille "Tarif Réduit" pour les autres.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-24 max-w-7xl mx-auto items-start justify-center">
            {/* Tableau des tarifs - largeur fixe compacte */}
            <div className="w-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-auto">
                  <thead className="bg-[#F9CA24] text-[#2D3436]">
                    <tr>
                      <th className="px-4 py-2 text-center text-sm font-semibold">Horaire</th>
                      <th className="px-4 py-2 text-center text-sm font-semibold">Tarif Plein</th>
                      <th className="px-4 py-2 text-center text-sm font-semibold">Tarif Réduit</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Object.entries(tarifGrille)
                      .map(([minutes, tarifs], idx) => {
                        const totalMinutes = parseInt(minutes);
                        const heures = Math.floor(totalMinutes / 60);
                        const mins = totalMinutes % 60;
                        const displayTime = heures > 0 
                          ? (mins > 0 ? `${heures}h${mins}` : `${heures}h00`)
                          : `${mins}'`;
                        
                        return (
                          <tr key={minutes} className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-4 py-1.5 text-center font-medium">{displayTime}</td>
                            <td className="px-4 py-1.5 text-center font-semibold">{tarifs.plein} €</td>
                            <td className="px-4 py-1.5 text-center font-semibold">{tarifs.reduit} €</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Options spéciales - colonne de droite */}
            <div className="space-y-6">
              {/* Danse Études */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">DANSE ÉTUDES</h3>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-[#F9CA24] text-[#2D3436]">
                        <td className="px-6 py-3 font-semibold">JAZZ 1 Cours</td>
                        <td className="px-6 py-3 text-right font-bold">{tarifsSpeciaux.danseEtudes1} €</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="px-6 py-3 font-semibold">JAZZ 2 Cours</td>
                        <td className="px-6 py-3 text-right font-bold">{tarifsSpeciaux.danseEtudes2} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Concours */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">CONCOURS</h3>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-[#F9CA24] text-[#2D3436]">
                        <td className="px-6 py-3 font-semibold">ON STAGE</td>
                        <td className="px-6 py-3 text-right font-bold">{tarifsSpeciaux.onStage} €</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="px-6 py-3 font-semibold">CLASSES CONCOURS</td>
                        <td className="px-6 py-3 text-right font-bold">{tarifsSpeciaux.classesConcours} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frais fixes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frais fixes annuels</h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-center">Adhésion</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-[#F9CA24] mb-2">{fraisFixes.adhesion} €</p>
                  <p className="text-sm text-gray-600">Pour tous</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-center">Licence FFD</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-[#F9CA24] mb-2">{fraisFixes.licenceFFD} €</p>
                  <p className="text-sm text-gray-600">Obligatoire à partir de 4 ans</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-amber-50 border-l-4 border-[#F9CA24] p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>ℹ️ Important :</strong> Ces frais s&apos;ajoutent au tarif des cours et sont obligatoires pour tous les adhérents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2D3436] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Calculez votre tarif personnalisé</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Utilisez notre formulaire d&apos;inscription en ligne pour sélectionner vos cours 
            et obtenir automatiquement le calcul de votre tarif.
          </p>
          <Button asChild size="lg" className="bg-[#F9CA24] text-[#2D3436] hover:bg-amber-400">
            <Link href="/inscription">
              Calculer mon tarif
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
