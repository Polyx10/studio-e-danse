import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

// GET : récupérer tous les cours actifs depuis la BDD
export async function GET() {
  try {
    const cours = await sql`
      SELECT id, jour, nom, horaire, duree, professeur, salle, 
             is_danse_etudes, is_concours, heure_debut, heure_fin, inscription_ouverte
      FROM cours 
      WHERE actif = true 
      ORDER BY 
        CASE jour 
          WHEN 'Lundi' THEN 1 WHEN 'Mardi' THEN 2 WHEN 'Mercredi' THEN 3 
          WHEN 'Jeudi' THEN 4 WHEN 'Vendredi' THEN 5 WHEN 'Samedi' THEN 6 
        END,
        heure_debut ASC
    `;

    // Mapper les noms de colonnes BDD vers le format CoursPlanning
    const formatted = cours.map((c: any) => ({
      id: c.id,
      jour: c.jour,
      nom: c.nom,
      horaire: c.horaire,
      duree: c.duree,
      professeur: c.professeur,
      salle: c.salle,
      heureDebut: c.heure_debut,
      heureFin: c.heure_fin,
      ...(c.is_danse_etudes ? { isDanseEtudes: true } : {}),
      ...(c.is_concours ? { isConcours: true } : {}),
      ...(c.inscription_ouverte === false ? { inscriptionFermee: true } : {}),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Erreur GET planning:', error?.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
