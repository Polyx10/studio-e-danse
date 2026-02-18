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
  licenceFFDMoins4ans: 0,
};

// Configuration de la saison
export interface SaisonConfig {
  label: string;
  debut: string;
  fin: string;
}

export const saisonCourante: SaisonConfig = {
  label: '2025-2026',
  debut: '2025-09-08',
  fin: '2026-07-04',
};

// Grille des niveaux : tranches d'âge par niveau (dynamiques selon la saison)
// L'âge est calculé au 1er septembre de l'année de début de saison
export interface NiveauConfig {
  niveau: string;
  ageMin: number | null;
  ageMax: number | null;
  coursIds: string[];
  surSelection?: boolean;
}

export const grilleNiveaux: NiveauConfig[] = [
  { niveau: 'Classique Ado 1', ageMin: 9, ageMax: 13, coursIds: ['lun-1', 'mer-10'] },
  { niveau: 'BAS', ageMin: 11, ageMax: null, coursIds: ['lun-2', 'mar-4', 'mer-12', 'ven-1'] },
  { niveau: 'Classique Adulte Intermédiaire', ageMin: 16, ageMax: null, coursIds: ['lun-3', 'mar-6'] },
  { niveau: 'Danse Études', ageMin: null, ageMax: null, coursIds: ['mar-1', 'ven-2'], surSelection: true },
  { niveau: 'Classique Ado 2', ageMin: 12, ageMax: null, coursIds: ['mar-2', 'ven-3'] },
  { niveau: 'Jazz ADO', ageMin: 11, ageMax: 15, coursIds: ['mar-3', 'mer-6'] },
  { niveau: 'Jazz Adulte Débutant', ageMin: 26, ageMax: null, coursIds: ['mar-5'] },
  { niveau: 'Jazz Adulte Intermédiaire', ageMin: 26, ageMax: null, coursIds: ['mar-7', 'sam-9'] },
  { niveau: 'Éveils', ageMin: 4, ageMax: 7, coursIds: ['mer-1', 'mer-7', 'sam-7'] },
  { niveau: 'Classique Initiation', ageMin: 6, ageMax: 8, coursIds: ['mer-2', 'sam-2'] },
  { niveau: 'Jazz KID', ageMin: 8, ageMax: 12, coursIds: ['mer-4', 'jeu-1'] },
  { niveau: 'Classique Enfant 1', ageMin: 7, ageMax: 9, coursIds: ['mer-5'] },
  { niveau: 'Classique Enfant 2', ageMin: 8, ageMax: 10, coursIds: ['mer-8'] },
  { niveau: 'Jazz Jeune Adulte Inter', ageMin: 15, ageMax: 19, coursIds: ['mer-9', 'ven-4'] },
  { niveau: 'Jazz Jeune Adulte Avancé', ageMin: 16, ageMax: null, coursIds: ['mer-11', 'ven-6'] },
  { niveau: 'Jazz Adulte Avancé', ageMin: 26, ageMax: null, coursIds: ['mer-13'] },
  { niveau: 'Technique KID-ADO', ageMin: 8, ageMax: 15, coursIds: ['jeu-2'] },
  { niveau: 'Concours Youth', ageMin: null, ageMax: null, coursIds: ['jeu-3'], surSelection: true },
  { niveau: 'Classique Adulte Avancé', ageMin: 16, ageMax: null, coursIds: ['jeu-4', 'sam-10'] },
  { niveau: 'Classique Adulte Débutant', ageMin: 16, ageMax: null, coursIds: ['ven-5', 'sam-8'] },
  { niveau: 'Concours Jazz Adulte', ageMin: null, ageMax: null, coursIds: ['jeu-5'], surSelection: true },
  { niveau: 'Contemporain Adulte Avancé', ageMin: 16, ageMax: null, coursIds: ['ven-7'] },
  { niveau: 'Baby danse', ageMin: 3, ageMax: 5, coursIds: ['sam-1'] },
  { niveau: 'Concours Jazz KID', ageMin: null, ageMax: null, coursIds: ['sam-3'], surSelection: true },
  { niveau: 'Jazz Initiation', ageMin: 6, ageMax: 9, coursIds: ['sam-4'] },
  { niveau: 'Classique Enfant 1 & 2', ageMin: 7, ageMax: 10, coursIds: ['sam-5'] },
  { niveau: 'Concours Jazz ADO', ageMin: null, ageMax: null, coursIds: ['sam-6'], surSelection: true },
  { niveau: 'Contemporain ADO', ageMin: 11, ageMax: 17, coursIds: ['sam-11'] },
];

// Pour une date de naissance, retourner les IDs de cours recommandés
export function getCoursRecommandes(dateNaissance: string, saison: SaisonConfig = saisonCourante): string[] {
  if (!dateNaissance) return [];
  // L'âge est déterminé par l'année civile (règle scolaire française) :
  // un enfant né en 2019 a "6 ans" pour la saison 2025/2026, quel que soit son mois de naissance
  const anneeSaison = new Date(saison.debut + 'T00:00:00').getFullYear();
  const birthDate = new Date(dateNaissance + 'T00:00:00');
  const age = anneeSaison - birthDate.getFullYear();

  const coursIds: string[] = [];
  grilleNiveaux.forEach(n => {
    if (n.surSelection) return;
    if (n.ageMin === null && n.ageMax === null) {
      coursIds.push(...n.coursIds);
      return;
    }
    const min = n.ageMin ?? 0;
    const max = n.ageMax ?? 999;
    if (age >= min && age < max) {
      coursIds.push(...n.coursIds);
    }
  });

  return [...new Set(coursIds)];
}

// Couleurs des professeurs
export const professeursColors: Record<string, string> = {
  "Audrey": "bg-green-50 border-green-100 text-green-700",
  "Aymeric": "bg-cyan-50 border-cyan-100 text-cyan-700",
  "Jeanette": "bg-amber-50 border-amber-100 text-amber-700",
  "Romane": "bg-pink-50 border-pink-100 text-pink-700",
  "Titouan": "bg-blue-50 border-blue-100 text-blue-700",
};

export interface CoursPlanning {
  id: string;
  jour: string;
  nom: string;
  horaire: string;
  duree: number;
  professeur: string;
  salle: "AC" | "LDN" | "TV";
  isDanseEtudes?: boolean;
  isConcours?: boolean;
  inscriptionFermee?: boolean;
  heureDebut: number;
  heureFin: number;
}

// Planning complet des cours
export const planningCours: CoursPlanning[] = [
  // LUNDI
  { id: "lun-1", jour: "Lundi", nom: "Classique ADO 3", horaire: "17h45-19h00", duree: 75, professeur: "Romane", salle: "LDN", heureDebut: 1065, heureFin: 1140 },
  { id: "lun-2", jour: "Lundi", nom: "BAS", horaire: "19h15-20h15", duree: 60, professeur: "Romane", salle: "LDN", heureDebut: 1155, heureFin: 1215 },
  { id: "lun-3", jour: "Lundi", nom: "Classique Adulte Inter", horaire: "20h15-21h45", duree: 90, professeur: "Romane", salle: "TV", heureDebut: 1215, heureFin: 1305 },
  
  // MARDI
  { id: "mar-1", jour: "Mardi", nom: "Jazz Danse Etude", horaire: "15h45-17h30", duree: 105, professeur: "Audrey", salle: "TV", isDanseEtudes: true, heureDebut: 945, heureFin: 1050 },
  { id: "mar-2", jour: "Mardi", nom: "Classique ADO 2", horaire: "17h45-19h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 1065, heureFin: 1155 },
  { id: "mar-3", jour: "Mardi", nom: "Jazz ADO", horaire: "17h45-19h15", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1065, heureFin: 1155 },
  { id: "mar-4", jour: "Mardi", nom: "BAS", horaire: "19h15-20h15", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 1155, heureFin: 1215 },
  { id: "mar-5", jour: "Mardi", nom: "Jazz Adulte Debutant", horaire: "19h15-20h30", duree: 75, professeur: "Titouan", salle: "TV", heureDebut: 1155, heureFin: 1230 },
  { id: "mar-6", jour: "Mardi", nom: "Classique Adulte Inter", horaire: "20h15-21h45", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 1215, heureFin: 1305 },
  { id: "mar-7", jour: "Mardi", nom: "Jazz Adulte Inter", horaire: "20h30-21h45", duree: 75, professeur: "Titouan", salle: "TV", heureDebut: 1230, heureFin: 1305 },
  
  // MERCREDI
  { id: "mer-1", jour: "Mercredi", nom: "Eveil", horaire: "10h15-11h00", duree: 45, professeur: "Aymeric", salle: "LDN", heureDebut: 615, heureFin: 660 },
  { id: "mer-2", jour: "Mercredi", nom: "Initiation", horaire: "11h00-12h00", duree: 60, professeur: "Aymeric", salle: "LDN", heureDebut: 660, heureFin: 720 },
  { id: "mer-4", jour: "Mercredi", nom: "Jazz KID", horaire: "14h00-15h15", duree: 75, professeur: "Audrey", salle: "TV", heureDebut: 840, heureFin: 915 },
  { id: "mer-5", jour: "Mercredi", nom: "Classique Enfant 1", horaire: "14h30-15h30", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 870, heureFin: 930 },
  { id: "mer-6", jour: "Mercredi", nom: "Jazz ADO", horaire: "15h15-16h45", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 915, heureFin: 1005 },
  { id: "mer-7", jour: "Mercredi", nom: "Eveil", horaire: "15h45-16h30", duree: 45, professeur: "Jeanette", salle: "LDN", heureDebut: 945, heureFin: 990 },
  { id: "mer-8", jour: "Mercredi", nom: "Classique Enfant 2", horaire: "16h30-18h00", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 990, heureFin: 1080 },
  { id: "mer-9", jour: "Mercredi", nom: "Jazz Jeune Adulte Inter", horaire: "17h00-18h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1020, heureFin: 1110 },
  { id: "mer-10", jour: "Mercredi", nom: "Classique ADO 1", horaire: "18h00-19h30", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 1080, heureFin: 1170 },
  { id: "mer-11", jour: "Mercredi", nom: "Jazz Jeune Adulte Avance", horaire: "18h30-20h00", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1110, heureFin: 1200 },
  { id: "mer-12", jour: "Mercredi", nom: "BAS", horaire: "20h00-21h00", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 1200, heureFin: 1260 },
  { id: "mer-13", jour: "Mercredi", nom: "Jazz Adulte Avance", horaire: "20h00-21h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1200, heureFin: 1290 },
  
  // JEUDI
  { id: "jeu-1", jour: "Jeudi", nom: "Jazz KID", horaire: "17h30-18h45", duree: 75, professeur: "Romane", salle: "LDN", heureDebut: 1050, heureFin: 1125 },
  { id: "jeu-2", jour: "Jeudi", nom: "Technique KID-ADO", horaire: "17h45-19h15", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1065, heureFin: 1155 },
  { id: "jeu-3", jour: "Jeudi", nom: "Concours Youth", horaire: "19h00-19h45", duree: 45, professeur: "Audrey", salle: "TV", isConcours: true, heureDebut: 1140, heureFin: 1185 },
  { id: "jeu-4", jour: "Jeudi", nom: "Classique Adulte Avance", horaire: "19h45-21h15", duree: 90, professeur: "Aymeric", salle: "LDN", heureDebut: 1185, heureFin: 1275 },
  
  // VENDREDI
  { id: "ven-1", jour: "Vendredi", nom: "BAS", horaire: "12h30-13h30", duree: 60, professeur: "Jeanette", salle: "LDN", heureDebut: 750, heureFin: 810 },
  { id: "ven-2", jour: "Vendredi", nom: "Jazz Danse Etude", horaire: "15h45-17h30", duree: 105, professeur: "Audrey", salle: "TV", isDanseEtudes: true, heureDebut: 945, heureFin: 1050 },
  { id: "ven-4", jour: "Vendredi", nom: "Jazz Jeune Adulte Inter", horaire: "17h30-19h00", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1050, heureFin: 1140 },
  { id: "ven-3", jour: "Vendredi", nom: "Classique ADO 2", horaire: "17h45-19h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 1065, heureFin: 1155 },
  { id: "ven-6", jour: "Vendredi", nom: "Jazz Jeune Adulte Avance", horaire: "19h00-20h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 1140, heureFin: 1230 },
  { id: "ven-5", jour: "Vendredi", nom: "Classique Adulte Debutant", horaire: "19h15-20h30", duree: 75, professeur: "Jeanette", salle: "LDN", heureDebut: 1155, heureFin: 1230 },
  { id: "jeu-5", jour: "Vendredi", nom: "Concours Jazz Adulte", horaire: "20h30-21h30", duree: 60, professeur: "Audrey", salle: "LDN", isConcours: true, heureDebut: 1230, heureFin: 1290 },
  { id: "ven-7", jour: "Vendredi", nom: "Contemporain Adulte", horaire: "20h30-22h00", duree: 90, professeur: "Jeanette", salle: "TV", heureDebut: 1230, heureFin: 1320 },
  
  // SAMEDI
  { id: "sam-1", jour: "Samedi", nom: "Baby danse", horaire: "9h30-10h00", duree: 30, professeur: "Audrey", salle: "TV", heureDebut: 570, heureFin: 600 },
  { id: "sam-3", jour: "Samedi", nom: "Jazz KID Concours", horaire: "10h00-11h00", duree: 60, professeur: "Titouan", salle: "LDN", isConcours: true, heureDebut: 600, heureFin: 660 },
  { id: "sam-4", jour: "Samedi", nom: "Jazz Initiation", horaire: "10h00-11h00", duree: 60, professeur: "Audrey", salle: "TV", heureDebut: 600, heureFin: 660 },
  { id: "sam-2", jour: "Samedi", nom: "Classique Initiation", horaire: "10h00-11h00", duree: 60, professeur: "Jeanette", salle: "AC", heureDebut: 600, heureFin: 660 },
  { id: "sam-5", jour: "Samedi", nom: "Classique Enfant 1 Enfant 2", horaire: "11h00-12h15", duree: 75, professeur: "Jeanette", salle: "AC", heureDebut: 660, heureFin: 735 },
  { id: "sam-6", jour: "Samedi", nom: "Jazz ADO Concours", horaire: "11h00-12h00", duree: 60, professeur: "Titouan", salle: "LDN", isConcours: true, heureDebut: 660, heureFin: 720 },
  { id: "sam-7", jour: "Samedi", nom: "Eveil", horaire: "11h00-11h45", duree: 45, professeur: "Audrey", salle: "TV", heureDebut: 660, heureFin: 705 },
  { id: "sam-9", jour: "Samedi", nom: "Jazz Adulte Inter", horaire: "12h00-13h30", duree: 90, professeur: "Audrey", salle: "TV", heureDebut: 720, heureFin: 810 },
  { id: "sam-8", jour: "Samedi", nom: "Classique Adulte Debutant", horaire: "12h15-13h30", duree: 75, professeur: "Jeanette", salle: "AC", heureDebut: 735, heureFin: 810 },
  { id: "sam-10", jour: "Samedi", nom: "Classique Adulte Avance", horaire: "13h45-15h15", duree: 90, professeur: "Jeanette", salle: "LDN", heureDebut: 825, heureFin: 915 },
  { id: "sam-11", jour: "Samedi", nom: "Contemporain ADO", horaire: "15h15-16h45", duree: 90, professeur: "Jeanette", salle: "TV", heureDebut: 915, heureFin: 1005 },
];

// Fonction helper pour obtenir les informations d'un cours par son ID
export function getCoursByIds(courseIds: string[]): CoursPlanning[] {
  return courseIds
    .map(id => planningCours.find(cours => cours.id === id))
    .filter((cours): cours is CoursPlanning => cours !== undefined);
}

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
