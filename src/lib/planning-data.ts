// Grille tarifaire à l'heure (en minutes -> tarif plein / tarif réduit)
export const tarifGrille: Record<number, { plein: number; reduit: number }> = {
  30: { plein: 270, reduit: 216 },
  45: { plein: 291, reduit: 233 },
  60: { plein: 306, reduit: 246 },
  75: { plein: 360, reduit: 288 },
  90: { plein: 405, reduit: 324 },
  105: { plein: 444, reduit: 357 },
  120: { plein: 477, reduit: 381 },
  135: { plein: 504, reduit: 402 },
  150: { plein: 537, reduit: 429 },
  165: { plein: 570, reduit: 456 },
  180: { plein: 597, reduit: 477 },
  195: { plein: 618, reduit: 495 },
  210: { plein: 642, reduit: 516 },
  225: { plein: 690, reduit: 552 },
  240: { plein: 735, reduit: 588 },
  255: { plein: 780, reduit: 624 },
  270: { plein: 828, reduit: 662 },
  285: { plein: 873, reduit: 698 },
  300: { plein: 918, reduit: 734 },
  315: { plein: 963, reduit: 771 },
  330: { plein: 1011, reduit: 807 },
  345: { plein: 1056, reduit: 845 },
  360: { plein: 1101, reduit: 882 },
  375: { plein: 1149, reduit: 918 },
  390: { plein: 1198, reduit: 958 },
  405: { plein: 1249, reduit: 999 },
  420: { plein: 1297, reduit: 1037 },
  435: { plein: 1346, reduit: 1076 },
  450: { plein: 1393, reduit: 1114 },
  465: { plein: 1458, reduit: 1166 },
  480: { plein: 1501, reduit: 1206 },
  495: { plein: 1558, reduit: 1246 },
  510: { plein: 1608, reduit: 1286 },
  525: { plein: 1658, reduit: 1326 },
  540: { plein: 1708, reduit: 1366 },
  555: { plein: 1758, reduit: 1406 },
  570: { plein: 1808, reduit: 1446 },
  585: { plein: 1858, reduit: 1486 },
  600: { plein: 1908, reduit: 1526 },
};

// Tarifs spéciaux
export const tarifsSpeciaux = {
  danseEtudes1: 350,
  danseEtudes2: 700,
  onStage: 100,
  classesConcours: 200,
};

// Frais fixes
export const fraisFixes = {
  adhesion: 12,
  licenceFFD: 24,
  licenceFFDMoins4ans: 0, // Gratuit pour les moins de 4 ans
};

// Couleurs des professeurs (pastel uniforme, bordures legeres)
export const professeursColors: Record<string, string> = {
  "Romane": "bg-pink-50 border-pink-100 text-pink-700",
  "Titouan": "bg-blue-50 border-blue-100 text-blue-700",
  "Audrey": "bg-green-50 border-green-100 text-green-700",
  "Jeanette": "bg-amber-50 border-amber-100 text-amber-700",
  "Aymeric": "bg-cyan-50 border-cyan-100 text-cyan-700",
};

export interface CoursPlanning {
  id: string;
  jour: string;
  nom: string;
  horaire: string;
  duree: number;
  professeur: string;
  salle: "AC" | "LDN" | "TV"; // Arthur Cadre, Luciano Di Natale, Thierry Verger
  isDanseEtudes?: boolean;
  isConcours?: boolean;
  heureDebut: number;
  heureFin: number;
}

// Planning complet des cours (basé sur l'image officielle)
// heureDebut et heureFin en minutes depuis minuit pour le positionnement
export const planningCours: CoursPlanning[] = [
  // LUNDI
  { id: "lun-1", jour: "Lundi", nom: "Classique ADO 1", horaire: "17h45-19h15", duree: 90, professeur: "Romane", salle: "LDN", heureDebut: 17*60+45, heureFin: 19*60+15 },
  { id: "lun-2", jour: "Lundi", nom: "BAS", horaire: "19h15-20h15", duree: 60, professeur: "Romane", salle: "LDN", heureDebut: 19*60+15, heureFin: 20*60+15 },
  { id: "lun-3", jour: "Lundi", nom: "Classique Adulte Inter", horaire: "20h15-21h45", duree: 90, professeur: "Jeanette", salle: "TV", heureDebut: 20*60+15, heureFin: 21*60+45 },
  
  // MARDI
  { id: "mar-1", jour: "Mardi", nom: "Jazz Danse Etude", horaire: "15h45-17h30", duree: 105, professeur: "Audrey", salle: "TV", isDanseEtudes: true, heureDebut: 15*60+45, heureFin: 17*60+30 },
  { id: "mar-2", jour: "Mardi", nom: "Classique ADO 2", horaire: "17h45-19h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 17*60+45, heureFin: 19*60+15 },
  { id: "mar-3", jour: "Mardi", nom: "Jazz ADO", horaire: "17h45-19h15", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 17*60+45, heureFin: 19*60+15 },
  { id: "mar-4", jour: "Mardi", nom: "BAS", horaire: "19h15-20h15", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 19*60+15, heureFin: 20*60+15 },
  { id: "mar-5", jour: "Mardi", nom: "Jazz Adulte Debutant", horaire: "19h15-20h30", duree: 75, professeur: "Audrey", salle: "TV", heureDebut: 19*60+15, heureFin: 20*60+30 },
  { id: "mar-6", jour: "Mardi", nom: "Classique Adulte Inter", horaire: "20h15-21h45", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 20*60+15, heureFin: 21*60+45 },
  { id: "mar-7", jour: "Mardi", nom: "Jazz Adulte Inter", horaire: "20h30-21h45", duree: 75, professeur: "Audrey", salle: "TV", heureDebut: 20*60+30, heureFin: 21*60+45 },
  
  // MERCREDI
  { id: "mer-1", jour: "Mercredi", nom: "Eveil", horaire: "10h15-11h00", duree: 45, professeur: "Aymeric", salle: "LDN", heureDebut: 10*60+15, heureFin: 11*60 },
  { id: "mer-2", jour: "Mercredi", nom: "Initiation", horaire: "11h00-12h00", duree: 60, professeur: "Aymeric", salle: "LDN", heureDebut: 11*60, heureFin: 12*60 },
  { id: "mer-3", jour: "Mercredi", nom: "Classique Initiation", horaire: "13h30-14h30", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 13*60+30, heureFin: 14*60+30 },
  { id: "mer-4", jour: "Mercredi", nom: "Jazz KID", horaire: "14h00-15h15", duree: 75, professeur: "Audrey", salle: "TV", heureDebut: 14*60, heureFin: 15*60+15 },
  { id: "mer-5", jour: "Mercredi", nom: "Classique Enfant 1", horaire: "14h30-15h30", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 14*60+30, heureFin: 15*60+30 },
  { id: "mer-6", jour: "Mercredi", nom: "Jazz ADO", horaire: "15h15-16h45", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 15*60+15, heureFin: 16*60+45 },
  { id: "mer-7", jour: "Mercredi", nom: "Eveil", horaire: "15h45-16h30", duree: 45, professeur: "Jeanette", salle: "LDN", heureDebut: 15*60+45, heureFin: 16*60+30 },
  { id: "mer-8", jour: "Mercredi", nom: "Classique Enfant 2", horaire: "16h30-18h00", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 16*60+30, heureFin: 18*60 },
  { id: "mer-9", jour: "Mercredi", nom: "Jazz Jeune Adulte Inter", horaire: "17h00-18h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 17*60, heureFin: 18*60+30 },
  { id: "mer-10", jour: "Mercredi", nom: "Classique ADO 1", horaire: "18h00-19h30", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 18*60, heureFin: 19*60+30 },
  { id: "mer-11", jour: "Mercredi", nom: "Jazz Jeune Adulte Avance", horaire: "18h30-20h00", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 18*60+30, heureFin: 20*60 },
  { id: "mer-12", jour: "Mercredi", nom: "BAS", horaire: "20h00-21h00", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 20*60, heureFin: 21*60 },
  { id: "mer-13", jour: "Mercredi", nom: "Jazz Adulte Avance", horaire: "20h00-21h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 20*60, heureFin: 21*60+30 },
  
  // JEUDI
  { id: "jeu-1", jour: "Jeudi", nom: "Jazz KID", horaire: "17h30-18h45", duree: 75, professeur: "Audrey", salle: "LDN", heureDebut: 17*60+30, heureFin: 18*60+45 },
  { id: "jeu-2", jour: "Jeudi", nom: "Technique KID-ADO", horaire: "17h45-19h15", duree: 90, professeur: "Titouan", salle: "TV", heureDebut: 17*60+45, heureFin: 19*60+15 },
  { id: "jeu-3", jour: "Jeudi", nom: "Concours Youth", horaire: "19h00-19h45", duree: 45, professeur: "Titouan", salle: "TV", isConcours: true, heureDebut: 19*60, heureFin: 19*60+45 },
  { id: "jeu-4", jour: "Jeudi", nom: "Classique Adulte Avance", horaire: "19h45-21h15", duree: 90, professeur: "Aymeric", salle: "LDN", heureDebut: 19*60+45, heureFin: 21*60+15 },
  { id: "jeu-5", jour: "Jeudi", nom: "Concours Jazz Adulte", horaire: "20h00-21h00", duree: 60, professeur: "Titouan", salle: "TV", isConcours: true, heureDebut: 20*60, heureFin: 21*60 },
  
  // VENDREDI
  { id: "ven-1", jour: "Vendredi", nom: "BAS", horaire: "12h30-13h30", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 12*60+30, heureFin: 13*60+30 },
  { id: "ven-2", jour: "Vendredi", nom: "Jazz Danse Etude", horaire: "15h45-17h30", duree: 105, professeur: "Audrey", salle: "TV", isDanseEtudes: true, heureDebut: 15*60+45, heureFin: 17*60+30 },
  { id: "ven-3", jour: "Vendredi", nom: "Classique ADO 2", horaire: "17h45-19h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 17*60+45, heureFin: 19*60+15 },
  { id: "ven-4", jour: "Vendredi", nom: "Jazz Jeune Adulte Inter", horaire: "17h30-19h00", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 17*60+30, heureFin: 19*60 },
  { id: "ven-5", jour: "Vendredi", nom: "Classique Adulte Debutant", horaire: "19h15-20h30", duree: 75, professeur: "Jeanette", salle: "LDN", heureDebut: 19*60+15, heureFin: 20*60+30 },
  { id: "ven-6", jour: "Vendredi", nom: "Jazz Jeune Adulte Avance", horaire: "19h00-20h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 19*60, heureFin: 20*60+30 },
  { id: "ven-7", jour: "Vendredi", nom: "Contemporain Adulte", horaire: "20h30-22h00", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 20*60+30, heureFin: 22*60 },
  
  // SAMEDI
  { id: "sam-1", jour: "Samedi", nom: "Baby danse", horaire: "9h30-10h00", duree: 30, professeur: "Audrey", salle: "TV", heureDebut: 9*60+30, heureFin: 10*60 },
  { id: "sam-2", jour: "Samedi", nom: "Classique Initiation", horaire: "10h00-11h00", duree: 60, professeur: "Jeanette", salle: "AC", heureDebut: 10*60, heureFin: 11*60 },
  { id: "sam-3", jour: "Samedi", nom: "Jazz KID Concours", horaire: "10h00-11h00", duree: 60, professeur: "Titouan", salle: "LDN", isConcours: true, heureDebut: 10*60, heureFin: 11*60 },
  { id: "sam-4", jour: "Samedi", nom: "Jazz Initiation", horaire: "10h00-11h00", duree: 60, professeur: "Audrey", salle: "TV", heureDebut: 10*60, heureFin: 11*60 },
  { id: "sam-5", jour: "Samedi", nom: "Classique Enfant 1 Enfant 2", horaire: "11h00-12h15", duree: 75, professeur: "Jeanette", salle: "AC", heureDebut: 11*60, heureFin: 12*60+15 },
  { id: "sam-6", jour: "Samedi", nom: "Jazz ADO Concours", horaire: "11h00-12h00", duree: 60, professeur: "Titouan", salle: "LDN", isConcours: true, heureDebut: 11*60, heureFin: 12*60 },
  { id: "sam-7", jour: "Samedi", nom: "Eveil", horaire: "11h00-11h45", duree: 45, professeur: "Audrey", salle: "TV", heureDebut: 11*60, heureFin: 11*60+45 },
  { id: "sam-8", jour: "Samedi", nom: "Classique Adulte Debutant", horaire: "12h15-13h30", duree: 75, professeur: "Jeanette", salle: "AC", heureDebut: 12*60+15, heureFin: 13*60+30 },
  { id: "sam-9", jour: "Samedi", nom: "Jazz Adulte Inter", horaire: "12h00-13h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 12*60, heureFin: 13*60+30 },
  { id: "sam-10", jour: "Samedi", nom: "Classique Adulte Avance", horaire: "13h45-15h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 13*60+45, heureFin: 15*60+15 },
  { id: "sam-11", jour: "Samedi", nom: "Contemporain ADO", horaire: "15h15-16h45", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 15*60+15, heureFin: 16*60+45 },
];

// Fonction pour calculer le tarif selon la durée totale
export function getTarifForDuree(totalMinutes: number, isReduit: boolean): number {
  const rounded = Math.ceil(totalMinutes / 15) * 15;
  const capped = Math.min(rounded, 600);
  
  if (tarifGrille[capped]) {
    return isReduit ? tarifGrille[capped].reduit : tarifGrille[capped].plein;
  }
  
  const keys = Object.keys(tarifGrille).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < keys.length - 1; i++) {
    if (capped > keys[i] && capped < keys[i + 1]) {
      return isReduit ? tarifGrille[keys[i + 1]].reduit : tarifGrille[keys[i + 1]].plein;
    }
  }
  
  return isReduit ? tarifGrille[600].reduit : tarifGrille[600].plein;
}

// Fonction pour calculer l'âge
export function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
