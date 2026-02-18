"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, Users, Calendar } from "lucide-react";
import { planningCours, professeursColors, CoursPlanning, grilleNiveaux } from "@/lib/planning-data";
import { useRef, useEffect, useState } from "react";

// Metadata moved to layout or removed for client component

const COURSE_COLORS = [
  "from-pink-400 to-pink-500",
  "from-purple-400 to-purple-500",
  "from-rose-400 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-cyan-500",
  "from-green-400 to-emerald-500",
  "from-indigo-400 to-indigo-500",
  "from-yellow-400 to-amber-500",
];

function parseCourseText(texte: string) {
  const parts = texte.split(/---(?:DETAILS|OBJECTIFS|CONDITIONS)---/);
  const description = (parts[0] || '').trim();

  const detailsMatch = texte.match(/---DETAILS---\n([\s\S]*?)(?=---(?:OBJECTIFS|CONDITIONS)---|$)/);
  const objectifsMatch = texte.match(/---OBJECTIFS---\n([\s\S]*?)(?=---CONDITIONS---|$)/);
  const conditionsMatch = texte.match(/---CONDITIONS---\n([\s\S]*)$/);

  const details = detailsMatch ? detailsMatch[1].trim().split('\n').filter(Boolean) : [];
  const objectives = objectifsMatch ? objectifsMatch[1].trim().split('\n').filter(Boolean) : [];
  const requirements = conditionsMatch ? conditionsMatch[1].trim() : undefined;

  return { description, details, objectives, requirements };
}

interface CourseFiche {
  id: number;
  titre: string;
  texte: string;
  photos: string[];
  categorie: string;
}

export default function CoursPage() {
  const [coursDynamiques, setCoursDynamiques] = useState<CoursPlanning[] | null>(null);
  const [coursesFiches, setCoursesFiches] = useState<CourseFiche[]>([]);

  useEffect(() => {
    fetch('/api/planning')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setCoursDynamiques(data); })
      .catch(() => {});
    fetch('/api/pages-content?page=cours')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setCoursesFiches(data); })
      .catch(() => {});
  }, []);

  // Utiliser les cours dynamiques (BDD) si disponibles, sinon fallback sur le fichier statique
  const coursAffiches = coursDynamiques || planningCours;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D3436] to-[#3d4446] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Cours de Danse</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Studio e propose une gamme complète de cours pour tous les âges et tous les niveaux. 
              Nos professeurs diplômés vous accompagnent dans votre progression avec passion et bienveillance.
            </p>
          </div>
        </div>
      </section>

      {/* Grille Horaire Temporelle */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Calendar className="h-8 w-8 text-[#F9CA24]" />
              Planning de la semaine
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Les cours sont positionnés selon leurs horaires reels</p>
          </div>
          
          {/* Legende des professeurs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(professeursColors).map(([prof, colorClass]) => (
              <div key={prof} className={"px-4 py-2 rounded-lg text-sm font-medium border-2 " + colorClass}>
                {prof}
              </div>
            ))}
          </div>

          {/* Grille horaire compacte - vue d'ensemble sans scroll */}
          <div className="w-full">
            <div className="border rounded-lg overflow-hidden shadow-md">
              {/* En-têtes */}
              <div className="flex bg-gray-100">
                <div className="w-20 bg-gray-200 text-center py-2 font-semibold text-xs border-r">Heures</div>
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((jour) => {
                  const coursJour = coursAffiches.filter((c: CoursPlanning) => c.jour === jour);
                  const sallesAvecCours = ["AC", "LDN", "TV"].filter(salle => 
                    coursJour.some(c => c.salle === salle)
                  );
                  const nbSalles = sallesAvecCours.length;
                  
                  return (
                    <div key={jour} className="border-r last:border-r-0" style={{ flex: nbSalles }}>
                      <div className="bg-[#2D3436] text-white text-center py-1.5 font-semibold text-xs">
                        {jour}
                      </div>
                      <div className="flex bg-gray-300 text-[9px]">
                        {sallesAvecCours.map((salle, idx) => (
                          <div 
                            key={salle} 
                            className={`flex-1 text-center py-0.5 ${idx < sallesAvecCours.length - 1 ? 'border-r border-gray-400' : ''}`}
                          >
                            {salle}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Grille avec heures et cours */}
              <div className="flex">
                {/* Colonne des heures */}
                <div className="w-20 bg-gray-100 relative border-r" style={{ height: "910px" }}>
                  {Array.from({ length: 14 }, (_, i) => 9 + i).map((heure) => (
                    <div 
                      key={heure} 
                      className="absolute w-full text-xs text-gray-500 text-right pr-2 border-t border-gray-300"
                      style={{ top: `${(heure - 9) * 65}px` }}
                    >
                      {heure}h
                    </div>
                  ))}
                </div>
                
                {/* Colonnes des jours - salles avec cours uniquement */}
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((jour) => {
                  const coursJour = coursAffiches.filter((c: CoursPlanning) => c.jour === jour);
                  const sallesAvecCours = ["AC", "LDN", "TV"].filter(salle => 
                    coursJour.some(c => c.salle === salle)
                  );
                  const nbSalles = sallesAvecCours.length;
                  
                  return (
                    <div key={jour} className="flex border-r last:border-r-0" style={{ flex: nbSalles, height: "910px" }}>
                      {sallesAvecCours.map((salle) => {
                        const coursSalle = coursJour.filter((c) => c.salle === salle);
                        
                        return (
                          <div key={salle} className="bg-gray-50 relative flex-1 border-r border-gray-200 last:border-r-0">
                            {/* Lignes horizontales des heures */}
                            {Array.from({ length: 14 }, (_, i) => 9 + i).map((heure) => (
                              <div 
                                key={heure} 
                                className="absolute w-full border-t border-gray-200"
                                style={{ top: `${(heure - 9) * 65}px` }}
                              />
                            ))}
                            
                            {/* Cours positionnés */}
                            {coursSalle.map((c) => {
                              const scale = 65 / 60; // 65px par heure
                              const top = (c.heureDebut - 9 * 60) * scale;
                              const height = (c.heureFin - c.heureDebut) * scale;
                              const colorClass = professeursColors[c.professeur] || "bg-gray-100 border-gray-100 text-gray-700";
                              
                              // Séparer le nom en discipline et niveau
                              const nomParts = c.nom.split(' ');
                              const discipline = nomParts[0]; // Ex: "Classique", "Jazz", "BAS"
                              const niveau = nomParts.slice(1).join(' '); // Ex: "Adulte Inter", "KID"
                              
                              return (
                                <div 
                                  key={c.id} 
                                  className={"absolute px-2 py-1.5 rounded border overflow-hidden " + colorClass}
                                  style={{ 
                                    top: `${top}px`, 
                                    height: `${Math.max(height - 2, 50)}px`,
                                    left: "2px",
                                    right: "2px",
                                    zIndex: 1
                                  }}
                                >
                                  <p className="font-semibold leading-tight text-[10px]">{discipline}</p>
                                  <p className="font-medium leading-tight text-[9px] mt-0.5">{niveau}</p>
                                  <p className="opacity-80 text-[9px] mt-0.5">{c.horaire}</p>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/planning">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      {coursesFiches.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {coursesFiches.map((fiche, index) => {
                const { description, details, objectives, requirements } = parseCourseText(fiche.texte);
                const color = COURSE_COLORS[index % COURSE_COLORS.length];
                const catParts = (fiche.categorie || '').split('•').map(s => s.trim());
                const age = catParts[0] || '';
                const duration = catParts[1] || '';

                return (
                  <Card key={fiche.id} className="overflow-hidden border-0 shadow-lg">
                    <div className={`h-2 bg-gradient-to-r ${color}`} />
                    <CardHeader className="pb-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl md:text-3xl">{fiche.titre}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {age && <Badge variant="secondary">{age}</Badge>}
                            {duration && <Badge variant="outline">{duration}</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {description}
                      </p>
                      
                      {(details.length > 0 || objectives.length > 0) && (
                        <div className="grid md:grid-cols-2 gap-6">
                          {details.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Contenu du cours</h4>
                              <ul className="space-y-2">
                                {details.map((detail, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-600">
                                    <span className="text-[#F9CA24] mt-1">•</span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {objectives.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Objectifs</h4>
                              <ul className="space-y-2">
                                {objectives.map((objective, i) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-600">
                                    <span className="text-green-500 mt-1">✓</span>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {requirements && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-[#2D3436] text-sm">
                            <strong>Conditions d&apos;admission :</strong> {requirements}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Grille des niveaux */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Grille des niveaux par âge</h2>
              <p className="text-gray-600 text-lg">
                Trouvez rapidement le niveau adapté à votre âge
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2D3436] text-white">
                      <th className="px-6 py-4 text-left font-semibold">Niveau</th>
                      <th className="px-6 py-4 text-center font-semibold">Âge</th>
                      <th className="px-6 py-4 text-center font-semibold">Classes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grilleNiveaux
                      .filter(n => !n.surSelection)
                      .sort((a, b) => {
                        const minA = a.ageMin ?? 0;
                        const minB = b.ageMin ?? 0;
                        return minA - minB;
                      })
                      .map((niveau, idx) => {
                        const ageDisplay = niveau.ageMin === null && niveau.ageMax === null
                          ? "Tous âges"
                          : niveau.ageMin === null
                          ? `Jusqu'à ${niveau.ageMax! - 1} ans`
                          : niveau.ageMax === null
                          ? `${niveau.ageMin}+ ans`
                          : `${niveau.ageMin}-${niveau.ageMax - 1} ans`;

                        // Correspondances classes scolaires selon grille officielle 2025/2026
                        const getClasses = (nom: string) => {
                          if (nom.includes('Baby')) return 'PS (3-4 ans)';
                          if (nom.includes('Éveils')) return 'MS - GS';
                          if (nom.includes('Initiation') && nom.includes('Classique')) return 'CP';
                          if (nom.includes('Enfant 1') && !nom.includes('&')) return 'CE1';
                          if (nom.includes('Enfant 2')) return 'CE2';
                          if (nom.includes('Enfant 1 & 2')) return 'CE1 - CE2';
                          if (nom.includes('Ado 1') && nom.includes('Classique')) return 'CM1 - 6ème';
                          if (nom.includes('Ado 2') && nom.includes('Classique')) return '5ème - Terminale';
                          if (nom.includes('Classique Adulte')) return 'Lycée et +';
                          if (nom.includes('Initiation') && nom.includes('Jazz')) return 'CP - CE1';
                          if (nom.includes('Jazz KID')) return 'CE2 - CM1 - CM2';
                          if (nom.includes('Jazz ADO')) return '6ème - 4ème';
                          if (nom.includes('Jazz Jeune Adulte Inter')) return '3ème et lycée';
                          if (nom.includes('Jazz Jeune Adulte Avancé')) return 'Lycée et +';
                          if (nom.includes('Jazz Adulte')) return 'Adultes (26+)';
                          if (nom.includes('Contemporain ADO')) return '6ème - 2nde';
                          if (nom.includes('Contemporain Adulte')) return 'Lycée et +';
                          if (nom.includes('BAS')) return '6ème et +';
                          if (nom.includes('Technique')) return 'CE2 - 4ème';
                          return '-';
                        };

                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-3 font-medium text-gray-900">{niveau.niveau}</td>
                            <td className="px-6 py-3 text-center">
                              <Badge variant="secondary" className="text-sm">
                                {ageDisplay}
                              </Badge>
                            </td>
                            <td className="px-6 py-3 text-center text-sm text-gray-700">
                              {getClasses(niveau.niveau)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>ℹ️ Information :</strong> Les cours Danse Études et Concours sont sur sélection. 
                Contactez-nous pour plus d&apos;informations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Consultez notre planning pour trouver le cours qui vous convient 
            et inscrivez-vous en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#2D3436] hover:bg-[#3d4446]">
              <Link href="/inscription">
                S&apos;inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/planning">
                Voir le planning
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
