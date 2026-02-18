import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(request: Request) {
  try {
    const { nom, prenom, dateNaissance } = await request.json();

    if (!nom || !prenom || !dateNaissance) {
      return NextResponse.json(
        { error: 'Nom, prénom et date de naissance requis' },
        { status: 400 }
      );
    }

    // Calculer la saison précédente
    const now = new Date();
    const currentYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
    const saisonPrecedente = `${currentYear - 1}-${currentYear}`;

    // Chercher l'adhérent dans la saison précédente (insensible à la casse)
    const results = await sql`
      SELECT id, student_last_name, student_first_name, student_birth_date,
             student_address, student_postal_code, student_city,
             student_phone, student_email,
             responsable1_name, responsable1_phone, responsable1_email,
             responsable2_name, responsable2_phone, responsable2_email,
             responsable2_address, responsable2_postal_code, responsable2_city,
             numero_adherent, student_gender
      FROM inscriptions 
      WHERE LOWER(TRIM(COALESCE(student_last_name, student_name))) = LOWER(TRIM(${nom}))
      AND LOWER(TRIM(COALESCE(student_first_name, ''))) = LOWER(TRIM(${prenom}))
      AND saison = ${saisonPrecedente}
      AND statut IN ('valide', 'en_attente')
      LIMIT 1
    `;

    if (results.length === 0) {
      return NextResponse.json({
        found: false,
        message: `Aucun adhérent trouvé avec ce nom et prénom pour la saison ${saisonPrecedente}.`
      });
    }

    const adherent = results[0];

    // Vérification de la date de naissance (2e facteur de sécurité)
    // Utiliser un objet Date pour normaliser en UTC et éviter les décalages de timezone
    const dbDateObj = new Date(adherent.student_birth_date);
    const dbDate = `${dbDateObj.getUTCFullYear()}-${String(dbDateObj.getUTCMonth() + 1).padStart(2, '0')}-${String(dbDateObj.getUTCDate()).padStart(2, '0')}`;
    if (dbDate !== dateNaissance) {
      return NextResponse.json({
        found: false,
        message: 'Les informations saisies ne correspondent pas à nos enregistrements.'
      });
    }

    return NextResponse.json({
      found: true,
      adherent: {
        student_last_name: adherent.student_last_name,
        student_first_name: adherent.student_first_name,
        student_birth_date: dbDate,
        student_gender: adherent.student_gender,
        student_address: adherent.student_address,
        student_postal_code: adherent.student_postal_code,
        student_city: adherent.student_city,
        student_phone: adherent.student_phone,
        student_email: adherent.student_email,
        responsable1_name: adherent.responsable1_name,
        responsable1_phone: adherent.responsable1_phone,
        responsable1_email: adherent.responsable1_email,
        responsable2_name: adherent.responsable2_name,
        responsable2_phone: adherent.responsable2_phone,
        responsable2_email: adherent.responsable2_email,
        responsable2_address: adherent.responsable2_address,
        responsable2_postal_code: adherent.responsable2_postal_code,
        responsable2_city: adherent.responsable2_city,
        numero_adherent: adherent.numero_adherent,
      }
    });
  } catch (error) {
    console.error('Erreur vérification adhérent:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
