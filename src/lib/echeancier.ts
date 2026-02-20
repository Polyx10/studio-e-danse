/**
 * Utilitaires pour calculer les échéanciers de paiement sans centimes
 */

export interface Echeance {
  mois: string;
  montant: number;
  details?: string;
}

/**
 * Répartit un montant en versements sans centimes de manière homogène
 * @param montantTotal - Montant total en euros (peut avoir des centimes)
 * @param nombreVersements - Nombre de versements (3 ou 10)
 * @param avecPreinscription - Si true, la préinscription de 90€ est le premier paiement
 * @param adhesion - Montant de l'adhésion (12€)
 * @param licence - Montant de la licence FFD (24€ ou 15€ pour moins de 4 ans)
 * @returns Tableau d'échéances avec mois et montants arrondis
 */
export function calculerEcheancierSansCentimes(
  montantTotal: number,
  nombreVersements: number,
  avecPreinscription: boolean = false,
  adhesion: number = 12,
  licence: number = 24,
  moisDepart?: number // 0=Janvier, 8=Septembre (par défaut si non fourni)
): Echeance[] {
  const echeances: Echeance[] = [];
  
  // Travailler en centimes pour éviter les erreurs de virgule flottante
  // Le total est réparti exactement, le premier versement absorbe l'arrondi résiduel
  const totalCentimes = Math.round(montantTotal * 100);
  const adhesionCentimes = Math.round(adhesion * 100);
  const licenceCentimes = Math.round(licence * 100);

  if (avecPreinscription) {
    const montantPreinscriptionCentimes = 9000; // 90€
    const montantRestantCentimes = totalCentimes - montantPreinscriptionCentimes;

    echeances.push({
      mois: 'Préinscription (sous 5 jours)',
      montant: montantPreinscriptionCentimes / 100,
      details: 'Adhésion 12€ + Licence 24€ + Acompte cours 54€'
    });

    if (nombreVersements === 1) {
      if (montantRestantCentimes > 0) {
        echeances.push({
          mois: getMoisByIndex(0, nombreVersements, moisDepart),
          montant: montantRestantCentimes / 100,
          details: `Solde cours ${montantRestantCentimes / 100}€`
        });
      }
    } else {
      const versements = repartirHomogeneCentimes(montantRestantCentimes, nombreVersements);
      for (let i = 0; i < nombreVersements; i++) {
        echeances.push({
          mois: getMoisByIndex(i, nombreVersements, moisDepart),
          montant: versements[i] / 100,
          details: `Cours ${versements[i] / 100}€`
        });
      }
    }
  } else {
    const coursCentimes = totalCentimes - adhesionCentimes - licenceCentimes;

    if (nombreVersements === 1) {
      echeances.push({
        mois: getMoisByIndex(0, nombreVersements, moisDepart),
        montant: totalCentimes / 100,
        details: `Adhésion ${adhesion}€ + Licence ${licence}€ + Cours ${coursCentimes / 100}€`
      });
    } else {
      const versementsCours = repartirHomogeneCentimes(coursCentimes, nombreVersements);

      // Premier versement = adhésion + licence + première part de cours
      const premier = adhesionCentimes + licenceCentimes + versementsCours[0];
      echeances.push({
        mois: getMoisByIndex(0, nombreVersements, moisDepart),
        montant: premier / 100,
        details: `Adhésion ${adhesion}€ + Licence ${licence}€ + Cours ${versementsCours[0] / 100}€`
      });

      for (let i = 1; i < nombreVersements; i++) {
        echeances.push({
          mois: getMoisByIndex(i, nombreVersements, moisDepart),
          montant: versementsCours[i] / 100,
          details: `Cours ${versementsCours[i] / 100}€`
        });
      }
    }
  }

  return echeances;
}

/**
 * Répartit un montant en centimes de manière homogène
 * @param montantCentimes - Montant total en centimes
 * @param nombre - Nombre de versements
 * @returns Tableau de montants en centimes
 */
function repartirHomogeneCentimes(montantCentimes: number, nombre: number): number[] {
  const base = Math.floor(montantCentimes / nombre);
  const reste = montantCentimes - base * nombre;
  return Array.from({ length: nombre }, (_, i) => i < reste ? base + 1 : base);
}

/**
 * Répartit un montant de manière homogène sans centimes
 * @param montant - Montant total à répartir
 * @param nombre - Nombre de versements
 * @returns Tableau d'échéances avec répartition optimale
 */
function repartirHomogene(montant: number, nombre: number): Echeance[] {
  const echeances: Echeance[] = [];
  
  // Montant de base par versement (arrondi à l'inférieur)
  const montantBase = Math.floor(montant / nombre);
  
  // Reste à répartir sur les premiers versements
  const reste = montant - (montantBase * nombre);
  
  // Créer les échéances
  for (let i = 0; i < nombre; i++) {
    const montantVersement = i < reste ? montantBase + 1 : montantBase;
    echeances.push({
      mois: getMoisByIndex(i, nombre),
      montant: montantVersement
    });
  }
  
  return echeances;
}

/**
 * Retourne le nom du mois selon l'index, le nombre de versements et le mois de départ
 * @param index - Index du versement (0-based)
 * @param nombreVersements - Nombre total de versements (3 ou 10)
 * @param moisDepart - Mois de départ (0=Janvier ... 11=Décembre), défaut=8 (Septembre)
 * @returns Nom du mois
 */
function getMoisByIndex(index: number, nombreVersements: number, moisDepart: number = 8): string {
  const nomsMois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const moisReel = (moisDepart + index) % 12;
  return nomsMois[moisReel];
}

/**
 * Calcule le montant restant à payer après déduction des paiements effectués
 * @param montantTotal - Montant total de l'inscription
 * @param paiementsEffectues - Tableau des paiements déjà effectués
 * @returns Montant restant à payer
 */
export function calculerResteAPayer(
  montantTotal: number,
  paiementsEffectues: number[]
): number {
  const totalPaye = paiementsEffectues.reduce((sum, p) => sum + p, 0);
  return Math.max(0, montantTotal - totalPaye);
}

/**
 * Recalcule l'échéancier après un paiement partiel
 * @param montantRestant - Montant restant à payer
 * @param nombreVersementsRestants - Nombre de versements restants
 * @returns Nouvel échéancier
 */
export function recalculerEcheancier(
  montantRestant: number,
  nombreVersementsRestants: number
): Echeance[] {
  if (nombreVersementsRestants <= 0) return [];
  
  return repartirHomogene(Math.floor(montantRestant), nombreVersementsRestants);
}

/**
 * Formate un échéancier pour l'affichage
 * @param echeances - Tableau d'échéances
 * @returns Chaîne formatée pour l'affichage
 */
export function formaterEcheancier(echeances: Echeance[]): string {
  return echeances
    .map((e, i) => {
      const details = e.details ? ` (${e.details})` : '';
      return `${i + 1}. ${e.mois} : ${e.montant}€${details}`;
    })
    .join('\n');
}
