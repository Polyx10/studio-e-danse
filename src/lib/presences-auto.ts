import { sql } from '@/lib/neon';

/**
 * Génère automatiquement les entrées de présence pour une inscription
 * Crée des présences pour tous les cours sélectionnés, pour toutes les dates futures
 * jusqu'à la fin de la saison (30 juin)
 * 
 * @param inscriptionId - UUID de l'inscription
 * @param selectedCourses - Array des IDs de cours (ex: ["mar-1", "ven-2"])
 * @param saison - Saison au format "2025-2026"
 */
export async function genererPresencesAutomatiques(
  inscriptionId: string,
  selectedCourses: string[],
  saison: string
): Promise<{ created: number; errors: number }> {
  if (!selectedCourses || selectedCourses.length === 0) {
    return { created: 0, errors: 0 };
  }

  let created = 0;
  let errors = 0;

  try {
    // Déterminer la date de fin de saison (30 juin de l'année de fin)
    const [anneeDebut] = saison.split('-').map(Number);
    const anneeFin = anneeDebut + 1;
    const finSaison = new Date(`${anneeFin}-06-30`);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    // Pour chaque cours sélectionné
    for (const coursId of selectedCourses) {
      // Récupérer les informations du cours (jour de la semaine)
      const coursInfo = await sql`
        SELECT id, jour, professeur
        FROM cours
        WHERE id = ${coursId} AND actif = true
      `;

      if (coursInfo.length === 0) {
        console.warn(`Cours ${coursId} non trouvé ou inactif`);
        errors++;
        continue;
      }

      const cours = coursInfo[0];
      const jourCours = cours.jour; // "Lundi", "Mardi", etc.

      // Récupérer le professeur_id si disponible
      const professeurInfo = await sql`
        SELECT id FROM professeurs WHERE nom = ${cours.professeur} LIMIT 1
      `;
      const professeurId = professeurInfo.length > 0 ? professeurInfo[0].id : null;

      // Mapper le jour en index (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
      const joursMap: Record<string, number> = {
        'Dimanche': 0,
        'Lundi': 1,
        'Mardi': 2,
        'Mercredi': 3,
        'Jeudi': 4,
        'Vendredi': 5,
        'Samedi': 6,
      };

      const jourIndex = joursMap[jourCours];
      if (jourIndex === undefined) {
        console.warn(`Jour invalide pour le cours ${coursId}: ${jourCours}`);
        errors++;
        continue;
      }

      // Générer toutes les dates futures pour ce jour jusqu'à la fin de saison
      const dates: string[] = [];
      let currentDate = new Date(aujourdhui);

      // Avancer jusqu'au prochain jour correspondant
      while (currentDate.getDay() !== jourIndex) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Générer toutes les occurrences jusqu'à la fin de saison
      while (currentDate <= finSaison) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dates.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 7); // Semaine suivante
      }

      // Insérer les présences (statut par défaut = 'P' pour Présent)
      for (const dateSeance of dates) {
        try {
          await sql`
            INSERT INTO presences (cours_id, inscription_id, date_seance, statut, professeur_id, created_at, updated_at)
            VALUES (${coursId}, ${inscriptionId}, ${dateSeance}, 'P', ${professeurId}, NOW(), NOW())
            ON CONFLICT (cours_id, inscription_id, date_seance) DO NOTHING
          `;
          created++;
        } catch (err: any) {
          // Ignorer les conflits (présence déjà existante)
          if (!err.message?.includes('duplicate key')) {
            console.error(`Erreur insertion présence ${coursId} ${dateSeance}:`, err.message);
            errors++;
          }
        }
      }
    }

    return { created, errors };
  } catch (error: any) {
    console.error('Erreur génération présences automatiques:', error.message);
    return { created, errors: errors + 1 };
  }
}
