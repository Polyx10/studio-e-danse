import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(request: Request) {
  try {
    const { nom, prenom, dateNaissance } = await request.json();

    if (!nom || !prenom || !dateNaissance) {
      return NextResponse.json({ error: 'Nom, prénom et date de naissance requis' }, { status: 400 });
    }

    const now = new Date();
    const saison = now.getMonth() >= 6
      ? `${now.getFullYear()}-${now.getFullYear() + 1}`
      : `${now.getFullYear() - 1}-${now.getFullYear()}`;

    const results = await sql`
      SELECT id,
        COALESCE(student_name, student_last_name || ' ' || student_first_name) as nom_complet,
        student_birth_date
      FROM inscriptions
      WHERE saison = ${saison}
        AND statut != 'annule'
        AND LOWER(TRIM(COALESCE(student_last_name, student_name))) = LOWER(TRIM(${nom}))
        AND LOWER(TRIM(COALESCE(student_first_name, ''))) = LOWER(TRIM(${prenom}))
      LIMIT 5
    `;

    if (results.length === 0) {
      return NextResponse.json({ found: false, message: 'Aucun adhérent trouvé avec ce nom et prénom pour la saison en cours.' });
    }

    // Vérifier la date de naissance
    const membre = results.find((r: Record<string, unknown>) => {
      if (!r.student_birth_date) return true;
      const dbDate = new Date(r.student_birth_date as string).toISOString().split('T')[0];
      return dbDate === dateNaissance;
    });

    if (!membre) {
      return NextResponse.json({ found: false, message: 'La date de naissance ne correspond pas à nos enregistrements.' });
    }

    return NextResponse.json({
      found: true,
      membre: {
        id: membre.id,
        nom_complet: membre.nom_complet,
      }
    });
  } catch (error) {
    console.error('[verify-membre-famille]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
