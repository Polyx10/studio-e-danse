"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, Users, Calendar } from "lucide-react";
import { planningCours, professeursColors, CoursPlanning } from "@/lib/planning-data";
import { useRef, useEffect } from "react";

// Metadata moved to layout or removed for client component

const courses = [
  {
    id: "eveil",
    title: "Éveil",
    age: "4-6 ans",
    duration: "45 min",
    
    color: "from-pink-400 to-pink-500",
    description: "Les cours d'éveil sont à destination des très jeunes enfants. La pédagogie développée est centrée sur des notions d'expression corporelle, de rythmique et de motricité.",
    details: [
      "Extérioriser l'énergie du corps",
      "Solliciter la fantaisie et l'imaginaire",
      "Développer la concentration et l'attention",
      "Découvrir les différentes parties du corps",
      "Développer la coordination",
      "Écouter et percevoir différents styles de musique",
      "Se structurer dans l'espace",
    ],
    objectives: [
      "Placer l'enfant en condition d'écoute",
      "Amener l'enfant à se recentrer",
      "Prendre conscience de son corps et maîtriser ses mouvements",
      "Développer sa capacité respiratoire et son sens du rythme",
      "Développer l'imaginaire et la créativité",
    ],
  },
  {
    id: "initiation",
    title: "Initiation",
    age: "6-7 ans",
    duration: "1h",
    
    color: "from-purple-400 to-purple-500",
    description: "Suite logique des cours d'éveil, le cours d'initiation approfondit le travail réalisé précédemment et prépare aux différentes disciplines de danse.",
    details: [
      "Développement des notions de 'parallèle' et 'en dehors'",
      "Précision du rapport danse-musique",
      "Travail sur le rythme et la mesure",
      "Début du travail de coordination",
      "Apprentissage des fondamentaux de la danse",
    ],
    objectives: [
      "Maîtriser l'énergie (contrôle de la force du mouvement)",
      "Comprendre le temps (apprentissage de la mesure)",
      "Gérer l'espace (positionnement par rapport aux autres)",
      "Appréhender le poids (imitation du lourd, du léger)",
    ],
  },
  {
    id: "classique",
    title: "Danse Classique",
    age: "8 ans et +",
    duration: "1h30",
    
    color: "from-rose-400 to-rose-500",
    description: "La danse classique est la base de toutes les danses. Elle revêt un caractère d'exigence et de respect de codes établis, héritière de la belle danse française depuis le 12ème siècle.",
    details: [
      "Esprit de rigueur et de netteté",
      "Technique des pointes (niveau avancé)",
      "Travail du placement et de la posture",
      "Évolution vers le néo-classique",
      "Formes angulaires, travail de décalé et de déséquilibre",
    ],
    objectives: [
      "Acquérir une technique solide",
      "Développer la grâce et l'élégance",
      "Maîtriser le vocabulaire classique",
      "Progresser vers les pointes",
    ],
  },
  {
    id: "modern-jazz",
    title: "Modern'Jazz",
    age: "8 ans et +",
    duration: "1h30",
    
    color: "from-amber-400 to-orange-500",
    description: "Une danse puissante dont le fondamental est la relation à la musique. Le Modern'Jazz nécessite rigueur et sens de l'expression, sollicitant inspiration, émotion et énergie vitale.",
    details: [
      "Passerelle entre vocabulaire classique et contemporain",
      "Alliance harmonieuse des rythmes et des styles",
      "Technique exigeante et sentiment authentique",
      "Jeu subtil entre force et douceur",
      "Moyen d'expression complet",
    ],
    objectives: [
      "Maîtriser la technique jazz",
      "Développer l'expression personnelle",
      "Travailler la musicalité",
      "Acquérir puissance et fluidité",
    ],
  },
  {
    id: "contemporain",
    title: "Danse Contemporaine",
    age: "Ados/Adultes",
    duration: "1h30",
    
    color: "from-teal-400 to-cyan-500",
    description: "La danse contemporaine offre une liberté d'expression unique, explorant le mouvement dans toutes ses dimensions et encourageant la créativité personnelle.",
    details: [
      "Exploration du mouvement libre",
      "Travail au sol",
      "Improvisation guidée",
      "Création chorégraphique",
      "Expression personnelle",
    ],
    objectives: [
      "Développer sa propre gestuelle",
      "Explorer les possibilités du corps",
      "Créer et improviser",
      "S'exprimer à travers le mouvement",
    ],
  },
  {
    id: "barre-au-sol",
    title: "Barre au Sol",
    age: "15 ans et +",
    duration: "1h",
    
    color: "from-green-400 to-emerald-500",
    description: "Ce cours propose des séances d'échauffement, d'assouplissement et de travail de l'en-dehors. Chaque chaîne musculaire est systématiquement étirée.",
    details: [
      "Exercices assis, allongé ou sur le côté",
      "Étirement de chaque chaîne musculaire",
      "Renforcement musculaire profond",
      "Travail de l'en-dehors",
      "Amélioration de la souplesse",
    ],
    objectives: [
      "Renforcer les muscles en profondeur",
      "Gagner en souplesse",
      "Améliorer sa posture",
      "Prévenir les blessures",
    ],
  },
  {
    id: "danse-etudes",
    title: "Danse Études Jazz",
    age: "Collège/Lycée",
    duration: "1h45 x 2/semaine",
    
    color: "from-indigo-400 to-indigo-500",
    description: "Section intensive pour les élèves souhaitant approfondir leur pratique avec des horaires aménagés en partenariat avec les établissements scolaires.",
    details: [
      "Cours le mardi et vendredi de 15h45 à 17h30",
      "Admission : 4 ans de pratique minimum",
      "Travail technique approfondi",
      "Improvisation et danse contact",
      "Création chorégraphique",
    ],
    objectives: [
      "Atteindre un niveau pré-professionnel",
      "Développer sa créativité",
      "Préparer les concours",
      "Concilier études et danse intensive",
    ],
    requirements: "4 ans de pratique de la danse Jazz et/ou 2 cours niveau ADO minimum. Aval du professeur requis.",
  },
  {
    id: "concours",
    title: "Préparation Concours",
    age: "Sur sélection",
    duration: "Variable",
    
    color: "from-yellow-400 to-amber-500",
    description: "Préparation et participation aux concours départementaux, régionaux et nationaux de la Fédération Française de Danse et autres compétitions.",
    details: [
      "Concours FFDanse",
      "Confédération Nationale de Danse",
      "Aéra Dance Compétition",
      "NéodanceContest",
      "Autres compétitions nationales et internationales",
    ],
    objectives: [
      "Se préparer aux compétitions",
      "Développer la performance scénique",
      "Gérer le stress de la compétition",
      "Représenter l'école avec excellence",
    ],
  },
];

export default function CoursPage() {
  // Pas de scroll nécessaire pour la vue compacte

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
                  const coursJour = planningCours.filter((c: CoursPlanning) => c.jour === jour);
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
                  const coursJour = planningCours.filter((c: CoursPlanning) => c.jour === jour);
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {courses.map((course, index) => (
              <Card key={course.id} id={course.id} className="overflow-hidden border-0 shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl">{course.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{course.age}</Badge>
                        <Badge variant="outline">{course.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contenu du cours</h4>
                      <ul className="space-y-2">
                        {course.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600">
                            <span className="text-[#F9CA24] mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Objectifs</h4>
                      <ul className="space-y-2">
                        {course.objectives.map((objective, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600">
                            <span className="text-green-500 mt-1">✓</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {course.requirements && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-[#2D3436] text-sm">
                        <strong>Conditions d&apos;admission :</strong> {course.requirements}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
