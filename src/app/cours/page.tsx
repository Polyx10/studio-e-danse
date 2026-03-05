"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, Users, Calendar, Search, Download } from "lucide-react";
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
  const [filtreProf, setFiltreProf] = useState<string | null>(null);

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
  const coursBase = coursDynamiques || planningCours;
  const coursAffiches = filtreProf ? coursBase.filter(c => c.professeur === filtreProf) : coursBase;

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
          
          {/* === MOTEUR DE RECHERCHE PAR ÂGE === */}
          <RechercheParAge coursAffiches={coursAffiches} professeursColors={professeursColors} />

          {/* Séparateur entre moteur de recherche et planning */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 border-t border-gray-200" />
            <h3 className="text-lg font-bold text-gray-700 whitespace-nowrap flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#F9CA24]" />
              Horaires de la semaine
            </h3>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Legende des professeurs — filtre cliquable */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {Object.entries(professeursColors).map(([prof, colorClass]) => (
              <button
                key={prof}
                onClick={() => setFiltreProf(filtreProf === prof ? null : prof)}
                className={[
                  "px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all",
                  colorClass,
                  filtreProf === prof
                    ? "ring-2 ring-offset-2 ring-[#2D3436] scale-105 shadow-md"
                    : filtreProf !== null
                    ? "opacity-40"
                    : ""
                ].join(" ")}
              >
                {prof}
              </button>
            ))}
          </div>
          {filtreProf && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <p className="text-sm text-gray-600">
                Cours de <strong>{filtreProf}</strong> — {coursAffiches.length} cours affichés
              </p>
              <button
                onClick={() => setFiltreProf(null)}
                className="text-xs text-gray-500 underline hover:text-gray-700"
              >
                Tout afficher
              </button>
            </div>
          )}
          {!filtreProf && <div className="mb-6 text-center text-xs text-gray-400">Cliquez sur un professeur pour filtrer ses cours</div>}

          {/* === VUE MOBILE : onglets par jour === */}
          <MobilePlanningView coursAffiches={coursAffiches} professeursColors={professeursColors} />

          {/* === VUE DESKTOP : grille horaire temporelle === */}
          <div className="hidden md:block w-full">
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
                      <div className="bg-[#2D3436] text-white text-center py-1.5 font-semibold text-xs">{jour}</div>
                      <div className="flex bg-gray-300 text-[9px]">
                        {sallesAvecCours.map((salle, idx) => (
                          <div key={salle} className={`flex-1 text-center py-0.5 ${idx < sallesAvecCours.length - 1 ? 'border-r border-gray-400' : ''}`}>
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
                <div className="w-20 bg-gray-100 relative border-r" style={{ height: "910px" }}>
                  {Array.from({ length: 14 }, (_, i) => 9 + i).map((heure) => (
                    <div key={heure} className="absolute w-full text-xs text-gray-500 text-right pr-2 border-t border-gray-300" style={{ top: `${(heure - 9) * 65}px` }}>
                      {heure}h
                    </div>
                  ))}
                </div>
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((jour) => {
                  const coursJour = coursAffiches.filter((c: CoursPlanning) => c.jour === jour);
                  const sallesAvecCours = ["AC", "LDN", "TV"].filter(salle => coursJour.some(c => c.salle === salle));
                  const nbSalles = sallesAvecCours.length;
                  return (
                    <div key={jour} className="flex border-r last:border-r-0" style={{ flex: nbSalles, height: "910px" }}>
                      {sallesAvecCours.map((salle) => {
                        const coursSalle = coursJour.filter((c) => c.salle === salle);
                        return (
                          <div key={salle} className="bg-gray-50 relative flex-1 border-r border-gray-200 last:border-r-0">
                            {Array.from({ length: 14 }, (_, i) => 9 + i).map((heure) => (
                              <div key={heure} className="absolute w-full border-t border-gray-200" style={{ top: `${(heure - 9) * 65}px` }} />
                            ))}
                            {coursSalle.map((c) => {
                              const scale = 65 / 60;
                              const top = (c.heureDebut - 9 * 60) * scale;
                              const height = (c.heureFin - c.heureDebut) * scale;
                              const colorClass = professeursColors[c.professeur] || "bg-gray-100 border-gray-100 text-gray-700";
                              const nomParts = c.nom.split(' ');
                              const discipline = nomParts[0];
                              const niveau = nomParts.slice(1).join(' ');
                              return (
                                <div key={c.id} className={"absolute px-2 py-1.5 rounded border overflow-hidden " + colorClass} style={{ top: `${top}px`, height: `${Math.max(height - 2, 50)}px`, left: "2px", right: "2px", zIndex: 1 }}>
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

        </div>
      </section>

      {/* Tenues recommandées */}
      <section className="py-8 bg-amber-50 border-y border-amber-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900">Tenues recommandées</h3>
              <p className="text-sm text-gray-600">Consultez nos recommandations de tenues pour chaque discipline</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/documents/tenues-decathlon.pdf" download className="inline-block">
                <Button variant="outline" className="gap-2 border-amber-400 hover:bg-amber-100 w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  Vêtements Décathlon (PDF)
                </Button>
              </a>
              <a href="/documents/tenues-mademoiselle-danse.pdf" download className="inline-block">
                <Button variant="outline" className="gap-2 border-amber-400 hover:bg-amber-100 w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  Procédure Mademoiselle Danse (PDF)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

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
                          : niveau.ageMax - niveau.ageMin === 1
                          ? `${niveau.ageMin} ans`
                          : `${niveau.ageMin}-${niveau.ageMax - 1} ans`;

                        const getClasses = (nom: string) => {
                          if (nom.includes('Baby')) return 'PS';
                          if (nom.includes('Éveils')) return 'MS - GS';
                          if (nom.includes('Initiation') && nom.includes('Classique')) return 'CP';
                          if (nom.includes('Enfant 1') && !nom.includes('&')) return 'CE1';
                          if (nom.includes('Enfant 2')) return 'CE2';
                          if (nom.includes('Enfant 1 & 2')) return 'CE1 - CE2';
                          if (nom.includes('Ado 1') && nom.includes('Classique')) return 'CM1 - 6ème';
                          if (nom.includes('Ado 2') && nom.includes('Classique')) return 'A partir de la 5ème';
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
              <Link href="/tarifs">
                Voir les tarifs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const CLASSES_SCOLAIRES = [
  { label: 'Petite Section (PS)', age: 3 },
  { label: 'Moyenne Section (MS)', age: 4 },
  { label: 'Grande Section (GS)', age: 5 },
  { label: 'CP', age: 6 },
  { label: 'CE1', age: 7 },
  { label: 'CE2', age: 8 },
  { label: 'CM1', age: 9 },
  { label: 'CM2', age: 10 },
  { label: '6ème', age: 11 },
  { label: '5ème', age: 12 },
  { label: '4ème', age: 13 },
  { label: '3ème', age: 14 },
  { label: 'Seconde', age: 15 },
  { label: 'Première', age: 16 },
  { label: 'Terminale', age: 17 },
  { label: 'Étudiant / Jeune adulte (18-25 ans)', age: 18 },
  { label: 'Adulte (26 ans et +)', age: 26 },
];

function RechercheParAge({
  coursAffiches,
  professeursColors,
}: {
  coursAffiches: CoursPlanning[];
  professeursColors: Record<string, string>;
}) {
  const [mode, setMode] = useState<'age' | 'classe'>('classe');
  const [age, setAge] = useState('');
  const [classeAge, setClasseAge] = useState<number | null>(null);
  const [resultats, setResultats] = useState<{ niveau: string; cours: CoursPlanning[] }[] | null>(null);

  const calculerResultats = (ageRecherche: number) => {
    const groupes: { niveau: string; cours: CoursPlanning[] }[] = [];
    grilleNiveaux.forEach(n => {
      if (n.surSelection) return;
      const min = n.ageMin ?? 0;
      const max = n.ageMax ?? 999;
      if (ageRecherche >= min && ageRecherche < max) {
        const coursNiveau = n.coursIds
          .map(id => coursAffiches.find(c => c.id === id))
          .filter((c): c is CoursPlanning => !!c);
        if (coursNiveau.length > 0) {
          groupes.push({ niveau: n.niveau, cours: coursNiveau });
        }
      }
    });
    setResultats(groupes);
  };

  const handleSearch = () => {
    const ageNum = mode === 'age' ? parseInt(age) : classeAge;
    if (!ageNum || ageNum < 3 || ageNum > 80) return;
    calculerResultats(ageNum);
  };

  const reset = () => {
    setResultats(null);
    setAge('');
    setClasseAge(null);
  };

  const jourOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="mb-12 bg-gradient-to-br from-[#F9CA24]/10 to-amber-50 border border-amber-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#F9CA24] flex items-center justify-center flex-shrink-0">
          <Search className="h-5 w-5 text-[#2D3436]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Trouvez vos cours</h3>
          <p className="text-sm text-gray-600">Entrez votre âge ou classe scolaire pour voir les cours qui vous correspondent. En cas de doute, consultez la <span className="font-medium text-amber-700 underline underline-offset-2">grille indicative des niveaux</span> ci-dessous.</p>
        </div>
      </div>

      {/* Sélecteur de mode */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('classe'); reset(); }}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            mode === 'classe' ? 'bg-[#2D3436] text-white border-[#2D3436]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >Par classe scolaire</button>
        <button
          onClick={() => { setMode('age'); reset(); }}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            mode === 'age' ? 'bg-[#2D3436] text-white border-[#2D3436]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >Par âge</button>
      </div>

      {/* Formulaire */}
      <div className="flex gap-3 items-end flex-wrap">
        {mode === 'classe' ? (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe scolaire</label>
            <select
              value={classeAge ?? ''}
              onChange={e => { setClasseAge(Number(e.target.value)); setResultats(null); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">-- Sélectionner une classe --</option>
              {CLASSES_SCOLAIRES.map(c => (
                <option key={c.label} value={c.age}>{c.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex-1 min-w-[140px] max-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Âge (en septembre 2025)</label>
            <input
              type="number"
              min={3}
              max={80}
              value={age}
              onChange={e => { setAge(e.target.value); setResultats(null); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Ex : 10"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        )}
        <button
          onClick={handleSearch}
          disabled={mode === 'age' ? !age : !classeAge}
          className="px-6 py-2.5 bg-[#2D3436] text-white rounded-lg text-sm font-medium hover:bg-[#3d4446] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Rechercher
        </button>
        {resultats !== null && (
          <button onClick={reset} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 underline">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Résultats */}
      {resultats !== null && (
        <div className="mt-6">
          {resultats.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun cours trouvé pour cet âge.</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                {resultats.reduce((acc, r) => acc + r.cours.length, 0)} cours disponibles dans {resultats.length} discipline{resultats.length > 1 ? 's' : ''} :
              </p>
              <div className="space-y-4">
                {resultats.map(({ niveau, cours }) => (
                  <div key={niveau}>
                    <h4 className="text-sm font-bold text-[#2D3436] mb-2 uppercase tracking-wide">{niveau}</h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {cours
                        .sort((a, b) => jourOrder.indexOf(a.jour) - jourOrder.indexOf(b.jour))
                        .map(c => {
                          const colorClass = professeursColors[c.professeur] || 'bg-gray-50 border-gray-200 text-gray-700';
                          return (
                            <div key={c.id} className={`rounded-xl border-2 p-3 ${colorClass}`}>
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <p className="font-semibold text-sm">{c.jour}</p>
                                  <p className="text-xs opacity-80 mt-0.5">{c.horaire}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-medium">{c.professeur}</p>
                                  <p className="text-xs opacity-70">Salle {c.salle}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MobilePlanningView({
  coursAffiches,
  professeursColors,
}: {
  coursAffiches: CoursPlanning[];
  professeursColors: Record<string, string>;
}) {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const [jourActif, setJourActif] = useState(jours[0]);

  return (
    <div className="md:hidden w-full">
      {/* Onglets jours */}
      <div className="flex overflow-x-auto gap-1 pb-2 mb-4 scrollbar-hide">
        {jours.map((jour) => {
          const nb = coursAffiches.filter((c) => c.jour === jour).length;
          if (nb === 0) return null;
          return (
            <button
              key={jour}
              onClick={() => setJourActif(jour)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                jourActif === jour
                  ? "bg-[#2D3436] text-white border-[#2D3436]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {jour.slice(0, 3)}
              <span className="ml-1 text-[11px] opacity-70">({nb})</span>
            </button>
          );
        })}
      </div>

      {/* Liste des cours du jour sélectionné */}
      <div className="space-y-3">
        {coursAffiches
          .filter((c) => c.jour === jourActif)
          .sort((a, b) => a.heureDebut - b.heureDebut)
          .map((c) => {
            const colorClass = professeursColors[c.professeur] || "bg-gray-50 border-gray-200 text-gray-700";
            return (
              <div key={c.id} className={`rounded-xl border-2 p-4 ${colorClass}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base leading-tight">{c.nom}</p>
                    <p className="text-sm mt-1 opacity-80">{c.professeur}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm">{c.horaire}</p>
                    <p className="text-xs opacity-70 mt-0.5">Salle {c.salle} · {c.duree} min</p>
                  </div>
                </div>
                {(c.isDanseEtudes || c.isConcours) && (
                  <div className="mt-2">
                    {c.isDanseEtudes && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">Danse Études</span>
                    )}
                    {c.isConcours && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Concours</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        {coursAffiches.filter((c) => c.jour === jourActif).length === 0 && (
          <p className="text-center text-gray-400 py-8">Aucun cours ce jour</p>
        )}
      </div>
    </div>
  );
}
