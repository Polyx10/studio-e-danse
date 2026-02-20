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
  
  // Arrondir le montant total à l'euro inférieur
  const totalArrondi = Math.floor(montantTotal);
  
  if (avecPreinscription) {
    // Avec préinscription : 90€ comme premier paiement (sous 5 jours), puis le reste réparti
    const montantPreinscription = 90;
    const montantRestant = totalArrondi - montantPreinscription;
    
    // Toujours afficher la préinscription en premier
    echeances.push({
      mois: 'Préinscription (sous 5 jours)',
      montant: montantPreinscription,
      details: 'Adhésion 12€ + Licence 24€ + Acompte cours 54€'
    });
    
    if (nombreVersements === 1) {
      // Paiement en 1 fois : reste en septembre
      if (montantRestant > 0) {
        echeances.push({
          mois: 'Septembre',
          montant: montantRestant,
          details: `Solde cours ${montantRestant}€`
        });
      }
    } else {
      // Répartir le montant restant sur les versements mensuels
      const versementsRestants = repartirHomogene(montantRestant, nombreVersements);
      
      // Ajouter les échéances mensuelles
      for (let i = 0; i < nombreVersements; i++) {
        echeances.push({
          mois: getMoisByIndex(i, nombreVersements, moisDepart),
          montant: versementsRestants[i].montant,
          details: `Cours ${versementsRestants[i].montant}€`
        });
      }
    }
  } else {
    // Sans préinscription : premier versement avec adhésion + licence
    const montantCours = totalArrondi - adhesion - licence;
    
    if (nombreVersements === 1) {
      const nomMois = getMoisByIndex(0, nombreVersements, moisDepart);
      echeances.push({
        mois: nomMois,
        montant: totalArrondi,
        details: `Adhésion ${adhesion}€ + Licence ${licence}€ + Cours ${montantCours}€`
      });
    } else {
      // Répartir le montant des cours sur les versements
      const versementsCours = repartirHomogene(montantCours, nombreVersements);
      
      // Premier versement = adhésion + licence + première part de cours
      echeances.push({
        mois: getMoisByIndex(0, nombreVersements, moisDepart),
        montant: adhesion + licence + versementsCours[0].montant,
        details: `Adhésion ${adhesion}€ + Licence ${licence}€ + Cours ${versementsCours[0].montant}€`
      });
      
      // Versements suivants = parts de cours uniquement
      for (let i = 1; i < nombreVersements; i++) {
        echeances.push({
          mois: getMoisByIndex(i, nombreVersements, moisDepart),
          montant: versementsCours[i].montant,
          details: `Cours ${versementsCours[i].montant}€`
        });
      }
    }
  }
  
  return echeances;
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
