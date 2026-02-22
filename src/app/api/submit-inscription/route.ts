import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { envoyerEmailConfirmationInscription } from '@/lib/email';
import { planningCours } from '@/lib/planning-data';
import { inscriptionSchema } from '@/lib/validation';
import { ZodError } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { genererPresencesAutomatiques } from '@/lib/presences-auto';

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
    
    // Insertion dans Neon Database
    let result;
    try {
      result = await sql`
        INSERT INTO inscriptions (
          student_name, student_last_name, student_first_name, student_gender, student_birth_date, student_address,
          student_postal_code, student_city, student_phone, student_email,
          responsable1_name, responsable1_phone, responsable1_email,
          responsable2_name, responsable2_address, responsable2_postal_code, responsable2_city, responsable2_phone, responsable2_email,
          selected_courses, tarif_reduit, rattachement_famille, tarif_cours, adhesion, licence_ffd, tarif_total,
          danse_etudes_option, concours_on_stage, concours_classes,
          participation_spectacle, nombre_costumes, type_cours,
          mode_paiement, nombre_versements, reglement_accepte, droit_image,
          signature_name, adherent_precedent, preinscription_payee, montant_preinscription, saison
        ) VALUES (
          ${validatedData.student_last_name + ' ' + validatedData.student_first_name}, ${validatedData.student_last_name}, ${validatedData.student_first_name}, ${validatedData.student_gender}, ${validatedData.student_birth_date}, ${validatedData.student_address},
          ${validatedData.student_postal_code}, ${validatedData.student_city}, ${validatedData.student_phone}, ${validatedData.student_email},
          ${validatedData.responsable1_name || ''}, ${validatedData.responsable1_phone || ''}, ${validatedData.responsable1_email || ''},
          ${validatedData.responsable2_name}, ${validatedData.responsable2_address}, ${validatedData.responsable2_postal_code}, ${validatedData.responsable2_city}, ${validatedData.responsable2_phone}, ${validatedData.responsable2_email},
          ${JSON.stringify(validatedData.selected_courses)}, ${validatedData.tarif_reduit}, ${validatedData.rattachement_famille || null}, ${validatedData.tarif_cours}, 
          ${validatedData.adhesion}, ${validatedData.licence_ffd}, ${validatedData.tarif_total},
          ${validatedData.danse_etudes_option}, ${validatedData.concours_on_stage}, ${validatedData.concours_classes},
          ${validatedData.participation_spectacle}, ${validatedData.nombre_costumes}, ${validatedData.type_cours},
          ${validatedData.mode_paiement ? JSON.stringify(validatedData.mode_paiement) : null}, ${validatedData.nombre_versements}, ${validatedData.accept_rules}, ${validatedData.droit_image},
          ${validatedData.signature_name},
          ${validatedData.adherent_precedent}, ${validatedData.preinscription_payee || false}, ${validatedData.preinscription_payee ? 90 : 0},
          ${(() => { const now = new Date(); const year = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1; return `${year}-${year + 1}`; })()}
        )
        RETURNING *
      `;

      // Générer automatiquement les présences pour tous les cours sélectionnés
      if (result.length > 0 && validatedData.selected_courses.length > 0) {
        const inscriptionId = result[0].id;
        const saison = result[0].saison;
        try {
          const presencesResult = await genererPresencesAutomatiques(
            inscriptionId,
            validatedData.selected_courses,
            saison
          );
          console.log(`✅ Présences générées: ${presencesResult.created} créées, ${presencesResult.errors} erreurs`);
        } catch (presencesError: any) {
          console.error('⚠️ Erreur génération présences (non bloquant):', presencesError.message);
        }
      }
    } catch (sqlError: any) {
      console.error('❌ ERREUR SQL DÉTAILLÉE:', {
        message: sqlError.message,
        code: sqlError.code,
        detail: sqlError.detail,
        hint: sqlError.hint,
        stack: sqlError.stack
      });
      throw sqlError;
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

      const modePaiement = Array.isArray(validatedData.mode_paiement)
        ? validatedData.mode_paiement.join(', ')
        : undefined;

      const nombreVersements = validatedData.nombre_versements
        ? Number.parseInt(validatedData.nombre_versements, 10)
        : undefined;

      // Pour les majeurs, utiliser l'email de l'élève, sinon celui du responsable
      const emailDestination = validatedData.responsable1_email || validatedData.student_email || '';
      
      if (emailDestination) {
        await envoyerEmailConfirmationInscription({
          nomEleve: `${validatedData.student_last_name} ${validatedData.student_first_name}`,
          emailResponsable: emailDestination,
          cours,
          tarifTotal: validatedData.tarif_total,
          tarifCours: validatedData.tarif_cours,
          adhesion: validatedData.adhesion,
          licenceFFD: validatedData.licence_ffd,
          modePaiement,
          nombreVersements,
        });
      }
      
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
    
    // Message générique pour l'utilisateur
    return NextResponse.json({ 
      error: 'Une erreur est survenue lors de l\'enregistrement de votre inscription. Veuillez réessayer.' 
    }, { status: 500 });
  }
}
