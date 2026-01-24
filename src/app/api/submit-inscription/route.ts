import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { envoyerEmailConfirmationInscription } from '@/lib/email';
import { planningCours } from '@/lib/planning-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Tentative d\'insertion depuis l\'API route:', body);
    
    // Insertion dans Neon Database
    const result = await sql`
      INSERT INTO inscriptions (
        student_name, student_gender, student_birth_date, student_address,
        student_postal_code, student_city, student_phone, student_email,
        responsable1_name, responsable1_phone, responsable1_email,
        responsable2_name, responsable2_phone, responsable2_email,
        selected_courses, tarif_reduit, tarif_cours, adhesion, licence_ffd, tarif_total,
        danse_etudes_option, concours_on_stage, concours_classes,
        mode_paiement, nombre_versements, reglement_accepte, droit_image,
        adherent_precedent
      ) VALUES (
        ${body.student_name}, ${body.student_gender}, ${body.student_birth_date}, ${body.student_address},
        ${body.student_postal_code}, ${body.student_city}, ${body.student_phone}, ${body.student_email},
        ${body.responsable1_name}, ${body.responsable1_phone}, ${body.responsable1_email},
        ${body.responsable2_name}, ${body.responsable2_phone}, ${body.responsable2_email},
        ${JSON.stringify(body.selected_courses)}, ${body.tarif_reduit}, ${body.tarif_cours}, 
        ${body.adhesion}, ${body.licence_ffd}, ${body.tarif_total},
        ${body.danse_etudes_option}, ${body.concours_on_stage}, ${body.concours_classes},
        ${body.mode_paiement}, ${body.nombre_versements}, ${body.reglement_accepte}, ${body.droit_image},
        ${body.adherent_precedent}
      )
      RETURNING *
    `;
    
    console.log('Insertion réussie:', result);
    
    // Envoyer l'email de confirmation
    try {
      const cours = body.selected_courses.map((coursId: string) => {
        const coursData = planningCours.find(c => c.id === coursId);
        if (!coursData) return null;
        return {
          nom: coursData.nom,
          jour: coursData.jour,
          horaire: coursData.horaire,
        };
      }).filter(Boolean);

      await envoyerEmailConfirmationInscription({
        nomEleve: body.student_name,
        emailResponsable: body.responsable1_email,
        cours,
        tarifTotal: body.tarif_total,
        tarifCours: body.tarif_cours,
        adhesion: body.adhesion,
        licenceFFD: body.licence_ffd,
        modePaiement: body.mode_paiement,
        nombreVersements: body.nombre_versements,
      });
      
      console.log('Email de confirmation envoyé');
    } catch (emailError) {
      console.error('Erreur envoi email (non bloquant):', emailError);
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
