import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { planningCours } from '@/lib/planning-data';

// Calcule le total de minutes de cours pour une liste d'IDs
function calculerMinutes(courseIds: string[]): number {
  return courseIds.reduce((total, id) => {
    const cours = planningCours.find(c => c.id === id);
    return total + (cours?.duree || 0);
  }, 0);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      student_email,
      student_phone,
      responsable1_email,
      responsable1_phone,
      responsable2_email,
      responsable2_phone,
      selected_courses = [],
    } = body;

    // Saison courante
    const now = new Date();
    const saison = now.getMonth() >= 6
      ? `${now.getFullYear()}-${now.getFullYear() + 1}`
      : `${now.getFullYear() - 1}-${now.getFullYear()}`;

    // Collecter les valeurs non nulles pour la recherche
    const emails = [student_email, responsable1_email, responsable2_email].filter(Boolean);
    const phones = [student_phone, responsable1_phone, responsable2_phone].filter(Boolean);

    if (emails.length === 0 && phones.length === 0) {
      return NextResponse.json({ famille: null });
    }

    // Recherche des inscriptions liées sur la saison courante
    const membres = await sql`
      SELECT
        id,
        student_last_name,
        student_first_name,
        student_name,
        selected_courses,
        tarif_reduit,
        tarif_cours,
        adhesion,
        licence_ffd,
        tarif_total,
        student_email,
        student_phone,
        responsable1_email,
        responsable1_phone,
        responsable2_email,
        responsable2_phone
      FROM inscriptions
      WHERE saison = ${saison}
        AND statut != 'annule'
        AND (
          (${emails[0] || null}::text IS NOT NULL AND (student_email = ${emails[0] || null} OR responsable1_email = ${emails[0] || null} OR responsable2_email = ${emails[0] || null}))
          OR (${emails[1] || null}::text IS NOT NULL AND (student_email = ${emails[1] || null} OR responsable1_email = ${emails[1] || null} OR responsable2_email = ${emails[1] || null}))
          OR (${emails[2] || null}::text IS NOT NULL AND (student_email = ${emails[2] || null} OR responsable1_email = ${emails[2] || null} OR responsable2_email = ${emails[2] || null}))
          OR (${phones[0] || null}::text IS NOT NULL AND (student_phone = ${phones[0] || null} OR responsable1_phone = ${phones[0] || null} OR responsable2_phone = ${phones[0] || null}))
          OR (${phones[1] || null}::text IS NOT NULL AND (student_phone = ${phones[1] || null} OR responsable1_phone = ${phones[1] || null} OR responsable2_phone = ${phones[1] || null}))
          OR (${phones[2] || null}::text IS NOT NULL AND (student_phone = ${phones[2] || null} OR responsable1_phone = ${phones[2] || null} OR responsable2_phone = ${phones[2] || null}))
        )
    `;

    if (membres.length === 0) {
      return NextResponse.json({ famille: null });
    }

    // Calculer les minutes de chaque membre existant
    type MembreRaw = {
      id: string;
      student_name: string;
      student_first_name: string;
      student_last_name: string;
      selected_courses: string[];
      tarif_reduit: boolean;
      tarif_cours: string;
      tarif_total: string;
    };
    const membresAvecMinutes = (membres as MembreRaw[]).map((m) => {
      const courseIds: string[] = Array.isArray(m.selected_courses) ? m.selected_courses : [];
      const minutes = calculerMinutes(courseIds);
      return {
        id: m.id,
        nom: m.student_name || `${m.student_first_name} ${m.student_last_name}`,
        minutes,
        tarif_reduit: m.tarif_reduit,
        tarif_cours: parseFloat(m.tarif_cours),
        tarif_total: parseFloat(m.tarif_total),
      };
    });

    // Trouver le membre avec le plus de minutes (actuellement en tarif plein)
    const maxMinutes = Math.max(...membresAvecMinutes.map((m: { minutes: number }) => m.minutes));
    const membrePrincipal = membresAvecMinutes.find((m: { minutes: number }) => m.minutes === maxMinutes);

    // Calculer les minutes du nouvel inscrit
    const minutesNouvel = calculerMinutes(selected_courses);

    // Déterminer le tarif du nouvel inscrit
    // plein si strictement plus de minutes que tous les existants, réduit sinon
    const tarifReduitNouvel = minutesNouvel <= maxMinutes;

    // Y a-t-il un basculement nécessaire ? (nouvel inscrit > membre principal existant)
    const basculementNecessaire = minutesNouvel > maxMinutes && membrePrincipal && !membrePrincipal.tarif_reduit;

    return NextResponse.json({
      famille: {
        membres: membresAvecMinutes,
        maxMinutes,
        membrePrincipalId: membrePrincipal?.id || null,
        membrePrincipalNom: membrePrincipal?.nom || null,
      },
      tarifReduitNouvel,
      minutesNouvel,
      basculementNecessaire: basculementNecessaire || false,
      membreABascuer: basculementNecessaire ? {
        id: membrePrincipal!.id,
        nom: membrePrincipal!.nom,
        tarif_total_actuel: membrePrincipal!.tarif_total,
      } : null,
    });
  } catch (error) {
    console.error('[detect-famille]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
