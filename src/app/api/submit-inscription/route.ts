import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { envoyerEmailConfirmationInscription } from '@/lib/email';
import { planningCours } from '@/lib/planning-data';
import { inscriptionSchema } from '@/lib/validation';
import { ZodError } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting : 5 inscriptions max par IP toutes les 15 minutes
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Veuillez réessayer plus tard.',
          resetTime: resetDate.toISOString()
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validation des données avec Zod
    const validatedData = inscriptionSchema.parse(body);
    
    // Log uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Tentative d\'insertion depuis l\'API route');
    }
    
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
        ${validatedData.student_name}, ${validatedData.student_gender}, ${validatedData.student_birth_date}, ${validatedData.student_address},
        ${validatedData.student_postal_code}, ${validatedData.student_city}, ${validatedData.student_phone}, ${validatedData.student_email},
        ${validatedData.responsable1_name}, ${validatedData.responsable1_phone}, ${validatedData.responsable1_email},
        ${validatedData.responsable2_name}, ${validatedData.responsable2_phone}, ${validatedData.responsable2_email},
        ${JSON.stringify(validatedData.selected_courses)}, ${validatedData.tarif_reduit}, ${validatedData.tarif_cours}, 
        ${validatedData.adhesion}, ${validatedData.licence_ffd}, ${validatedData.tarif_total},
        ${validatedData.danse_etudes_option}, ${validatedData.concours_on_stage}, ${validatedData.concours_classes},
        ${validatedData.mode_paiement}, ${validatedData.nombre_versements}, ${validatedData.reglement_accepte}, ${validatedData.droit_image},
        ${validatedData.adherent_precedent}
      )
      RETURNING *
    `;
    
    // Log uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Inscription enregistrée avec succès');
    }
    
    // Envoyer l'email de confirmation
    try {
      const cours = validatedData.selected_courses
        .map((coursId: string) => {
          const coursData = planningCours.find(c => c.id === coursId);
          if (!coursData) return null;
          return {
            nom: coursData.nom,
            jour: coursData.jour,
            horaire: coursData.horaire,
          };
        })
        .filter((c): c is { nom: string; jour: string; horaire: string } => c !== null);

      await envoyerEmailConfirmationInscription({
        nomEleve: validatedData.student_name,
        emailResponsable: validatedData.responsable1_email,
        cours,
        tarifTotal: validatedData.tarif_total,
        tarifCours: validatedData.tarif_cours,
        adhesion: validatedData.adhesion,
        licenceFFD: validatedData.licence_ffd,
        modePaiement: validatedData.mode_paiement,
        nombreVersements: validatedData.nombre_versements,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Email de confirmation envoyé');
      }
    } catch (emailError) {
      // Log d'erreur uniquement en développement
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur envoi email (non bloquant):', emailError);
      }
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // Gestion spécifique des erreurs de validation Zod
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: formattedErrors 
      }, { status: 400 });
    }
    
    // Log d'erreur uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur serveur:', error);
    }
    
    // Message générique pour l'utilisateur, pas de détails techniques
    return NextResponse.json({ 
      error: 'Une erreur est survenue lors de l\'enregistrement de votre inscription. Veuillez réessayer.' 
    }, { status: 500 });
  }
}
