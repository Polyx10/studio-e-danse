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

    // Déterminer la saison courante
    const now = new Date();
    const saisonCourante = now.getMonth() >= 6
      ? `${now.getFullYear()}-${now.getFullYear() + 1}`
      : `${now.getFullYear() - 1}-${now.getFullYear()}`;

    // Vérification des doublons : même élève (nom + prénom + date de naissance) déjà inscrit cette saison
    const doublon = await sql`
      SELECT id, student_last_name, student_first_name FROM inscriptions
      WHERE saison = ${saisonCourante}
        AND statut != 'annule'
        AND LOWER(TRIM(student_last_name)) = LOWER(TRIM(${validatedData.student_last_name}))
        AND LOWER(TRIM(student_first_name)) = LOWER(TRIM(${validatedData.student_first_name}))
        AND student_birth_date = ${validatedData.student_birth_date}
      LIMIT 1
    `;

    if (doublon.length > 0) {
      return NextResponse.json(
        { error: `${validatedData.student_first_name} ${validatedData.student_last_name} est déjà inscrit(e) pour cette saison. Veuillez contacter le secrétariat si vous souhaitez modifier votre inscription.` },
        { status: 409 }
      );
    }

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
    
    // Gestion automatique du tarif famille — détection côté serveur (fiable, indépendant du state React)
    if (result.length > 0) {
      try {
        const nouvelId = result[0].id;
        const nouvelNom = `${validatedData.student_last_name} ${validatedData.student_first_name}`;
        const emailEleve = validatedData.student_email || null;
        const telEleve = validatedData.student_phone || null;
        const emailResp1 = validatedData.responsable1_email || null;
        const telResp1 = validatedData.responsable1_phone || null;

        // Chercher tous les membres de la même famille déjà inscrits cette saison
        console.log(`[famille] Recherche pour nouvelId=${nouvelId}, saison=${saisonCourante}, emailEleve=${emailEleve}, telEleve=${telEleve}, emailResp1=${emailResp1}, telResp1=${telResp1}`);
        const membresFamille = await sql`
          SELECT id, student_name, selected_courses, tarif_reduit, tarif_cours, adhesion, licence_ffd, tarif_total
          FROM inscriptions
          WHERE saison = ${saisonCourante}
            AND statut != 'annule'
            AND id != ${nouvelId}
            AND (
              (${emailEleve}::text IS NOT NULL AND (student_email = ${emailEleve} OR responsable1_email = ${emailEleve}))
              OR (${telEleve}::text IS NOT NULL AND (student_phone = ${telEleve} OR responsable1_phone = ${telEleve}))
              OR (${emailResp1}::text IS NOT NULL AND (student_email = ${emailResp1} OR responsable1_email = ${emailResp1}))
              OR (${telResp1}::text IS NOT NULL AND (student_phone = ${telResp1} OR responsable1_phone = ${telResp1}))
            )
        `;
        console.log(`[famille] Membres trouvés : ${membresFamille.length}`, membresFamille.map((m: Record<string, unknown>) => m.student_name));

        if (membresFamille.length > 0) {
          // Calculer les minutes du nouvel inscrit
          const minutesNouvel = validatedData.selected_courses.reduce((total: number, id: string) => {
            const c = planningCours.find(p => p.id === id);
            return total + (c?.duree || 0);
          }, 0);

          // Calculer les minutes de chaque membre existant
          type MembreFamille = {
            id: string;
            student_name: string;
            selected_courses: string[];
            tarif_reduit: boolean;
            tarif_cours: string;
            adhesion: string;
            licence_ffd: string;
            tarif_total: string;
            minutes: number;
          };
          const membresAvecMinutes: MembreFamille[] = (membresFamille as MembreFamille[]).map(m => ({
            ...m,
            minutes: (Array.isArray(m.selected_courses) ? m.selected_courses : []).reduce((total: number, id: string) => {
              const c = planningCours.find(p => p.id === id);
              return total + (c?.duree || 0);
            }, 0),
          }));

          // Trouver le membre avec le plus de minutes parmi tous (incluant le nouvel inscrit)
          const maxMinutesExistants = Math.max(...membresAvecMinutes.map(m => m.minutes));
          const coursNouvel = validatedData.selected_courses
            .map((id: string) => { const c = planningCours.find(p => p.id === id); return c ? `${c.nom} (${c.jour} ${c.horaire})` : id; })
            .join(', ');

          console.log(`[famille] minutesNouvel=${minutesNouvel}, maxMinutesExistants=${maxMinutesExistants}`);
          if (minutesNouvel > maxMinutesExistants) {
            // Le nouvel inscrit a plus d'heures → le membre avec le max actuel doit passer en réduit
            const membreABascule = membresAvecMinutes.find(m => m.minutes === maxMinutesExistants)!;
            const tarifCoursActuel = parseFloat(membreABascule.tarif_cours);
            // Si déjà en tarif réduit, recalculer depuis le tarif plein (doubler pour retrouver le plein, puis diviser)
            const tarifCoursPlein = membreABascule.tarif_reduit ? tarifCoursActuel * 2 : tarifCoursActuel;
            const tarifCoursReduit = parseFloat((tarifCoursPlein * 0.5).toFixed(2));
            const adhesion = parseFloat(membreABascule.adhesion);
            const licence = parseFloat(membreABascule.licence_ffd);
            const nouveauTotal = parseFloat((tarifCoursReduit + adhesion + licence).toFixed(2));
            const ancienTotal = parseFloat(membreABascule.tarif_total);
            const delta = parseFloat((ancienTotal - nouveauTotal).toFixed(2));

            await sql`
              UPDATE inscriptions
              SET tarif_reduit = true,
                  tarif_cours = ${tarifCoursReduit},
                  tarif_total = ${nouveauTotal},
                  updated_at = NOW()
              WHERE id = ${membreABascule.id}
            `;

            await sql`
              INSERT INTO notifications_admin (type, message, inscription_id, inscription_concernee_id, delta, created_at)
              VALUES (
                'bascule_tarif_famille',
                ${`FRATRIE DÉTECTÉE — ${nouvelNom} vient de s'inscrire (${coursNouvel}) avec plus d'heures que ${membreABascule.student_name}. Le tarif de ${membreABascule.student_name} a été automatiquement mis en tarif réduit : ${ancienTotal.toFixed(2).replace('.', ',')} € → ${nouveauTotal.toFixed(2).replace('.', ',')} €. Trop-perçu à régulariser : ${delta.toFixed(2).replace('.', ',')} €.`},
                ${nouvelId},
                ${membreABascule.id},
                ${delta},
                NOW()
              )
            `;
            console.log(`✅ Basculement famille (serveur) : ${membreABascule.student_name} → tarif réduit (delta: ${delta}€)`);

          } else {
            // Le nouvel inscrit a moins ou autant d'heures → il est directement en tarif réduit
            const nomsMembres = membresAvecMinutes.map(m => m.student_name).join(', ');
            const membrePrincipal = membresAvecMinutes.find(m => m.minutes === maxMinutesExistants)!;
            await sql`
              INSERT INTO notifications_admin (type, message, inscription_id, inscription_concernee_id, delta, created_at)
              VALUES (
                'tarif_reduit_famille',
                ${`FRATRIE — ${nouvelNom} vient de s'inscrire en tarif réduit (${coursNouvel}). Membre(s) de la même famille : ${nomsMembres}. Vérifier que le tarif plein est bien appliqué au membre ayant le plus d'heures.`},
                ${nouvelId},
                ${membrePrincipal.id},
                null,
                NOW()
              )
            `;
            console.log(`ℹ️ Notification tarif réduit direct famille (serveur) : ${nouvelNom}`);
          }
        }
      } catch (familleError: unknown) {
        console.error('⚠️ Erreur gestion famille (non bloquant):', familleError instanceof Error ? familleError.message : familleError);
      }
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
