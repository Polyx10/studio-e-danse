import { tarifGrille } from './planning-data';

// Les 6 demi-trimestres de l'année scolaire
export type PeriodeProrata = '1A' | '1B' | '2A' | '2B' | '3A' | '3B';

export interface VacancesScolaires {
  saison: string; // ex: "2025-2026"
  toussaint_debut: string;    // Début des vacances de la Toussaint → début période 1B
  noel_debut: string;         // Début des vacances de Noël → début période 2A
  hiver_debut: string;        // Début des vacances d'hiver → début période 2B
  printemps_debut: string;    // Début des vacances de printemps → début période 3A
  ascension_debut: string;    // Début du pont de l'Ascension → début période 3B
  fin_saison: string;         // Fin de la saison (fin juin)
}

// Dates par défaut pour 2025-2026 (zone C - à adapter)
export const vacancesDefaut2526: VacancesScolaires = {
  saison: '2025-2026',
  toussaint_debut: '2025-10-19',
  noel_debut: '2025-12-21',
  hiver_debut: '2026-02-08',
  printemps_debut: '2026-04-05',
  ascension_debut: '2026-05-29',
  fin_saison: '2026-06-30',
};

// Nombre de demi-trimestres restants selon la période d'entrée
export const periodesRestantes: Record<PeriodeProrata, number> = {
  '1A': 6, // Année complète
  '1B': 5, // Après Toussaint
  '2A': 4, // Après Noël
  '2B': 3, // Après vacances d'hiver
  '3A': 2, // Après Pâques (31 mars)
  '3B': 1, // Dernière période (19 mai → fin juin)
};

export const periodesLabels: Record<PeriodeProrata, string> = {
  '1A': 'Année complète (rentrée)',
  '1B': 'Après la Toussaint',
  '2A': 'Après Noël (janvier)',
  '2B': 'Après les vacances d\'hiver',
  '3A': 'Après les vacances de printemps',
  '3B': 'Dernière période (mai-juin)',
};

// Déterminer la période en cours à partir d'une date et des vacances scolaires
export function getPeriodeFromDate(date: Date | string, vacances: VacancesScolaires): PeriodeProrata {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;

  const toussaintDebut = new Date(vacances.toussaint_debut + 'T00:00:00');
  const noelDebut = new Date(vacances.noel_debut + 'T00:00:00');
  const hiverDebut = new Date(vacances.hiver_debut + 'T00:00:00');
  const printempsDebut = new Date(vacances.printemps_debut + 'T00:00:00');
  const ascensionDebut = new Date(vacances.ascension_debut + 'T00:00:00');

  if (d < toussaintDebut) return '1A';
  if (d < noelDebut) return '1B';
  if (d < hiverDebut) return '2A';
  if (d < printempsDebut) return '2B';
  if (d < ascensionDebut) return '3A';
  return '3B';
}

// Calculer le tarif prorata pour une durée totale en minutes
export function calculerTarifProrata(
  totalMinutes: number,
  isReduit: boolean,
  periode: PeriodeProrata
): number {
  const rounded = Math.ceil(totalMinutes / 15) * 15;
  const capped = Math.min(rounded, 600);

  // Trouver le tarif annuel dans la grille
  let tarifAnnuel: number;
  if (tarifGrille[capped]) {
    tarifAnnuel = isReduit ? tarifGrille[capped].reduit : tarifGrille[capped].plein;
  } else {
    const keys = Object.keys(tarifGrille).map(Number).sort((a, b) => a - b);
    let found = false;
    for (let i = 0; i < keys.length - 1; i++) {
      if (capped > keys[i] && capped < keys[i + 1]) {
        tarifAnnuel = isReduit ? tarifGrille[keys[i + 1]].reduit : tarifGrille[keys[i + 1]].plein;
        found = true;
        break;
      }
    }
    if (!found) {
      tarifAnnuel = isReduit ? tarifGrille[600].reduit : tarifGrille[600].plein;
    }
  }

  // Appliquer le prorata
  const nbPeriodes = periodesRestantes[periode];
  return Math.round(tarifAnnuel! * nbPeriodes / 6 * 100) / 100;
}

// Calculer le détail complet du prorata (pour affichage)
export function detailProrata(
  totalMinutes: number,
  isReduit: boolean,
  periode: PeriodeProrata
): {
  tarifAnnuel: number;
  tarifProrata: number;
  periodesRestantes: number;
  periodesTotal: number;
  pourcentage: number;
  reduction: number;
  periode: PeriodeProrata;
  periodeLabel: string;
} {
  const rounded = Math.ceil(totalMinutes / 15) * 15;
  const capped = Math.min(rounded, 600);

  let tarifAnnuel: number;
  if (tarifGrille[capped]) {
    tarifAnnuel = isReduit ? tarifGrille[capped].reduit : tarifGrille[capped].plein;
  } else {
    const keys = Object.keys(tarifGrille).map(Number).sort((a, b) => a - b);
    tarifAnnuel = isReduit ? tarifGrille[600].reduit : tarifGrille[600].plein;
    for (let i = 0; i < keys.length - 1; i++) {
      if (capped > keys[i] && capped < keys[i + 1]) {
        tarifAnnuel = isReduit ? tarifGrille[keys[i + 1]].reduit : tarifGrille[keys[i + 1]].plein;
        break;
      }
    }
  }

  const nbPeriodes = periodesRestantes[periode];
  const tarifProrata = Math.round(tarifAnnuel * nbPeriodes / 6 * 100) / 100;

  return {
    tarifAnnuel,
    tarifProrata,
    periodesRestantes: nbPeriodes,
    periodesTotal: 6,
    pourcentage: Math.round(nbPeriodes / 6 * 100),
    reduction: Math.round((tarifAnnuel - tarifProrata) * 100) / 100,
    periode,
    periodeLabel: periodesLabels[periode],
  };
}
