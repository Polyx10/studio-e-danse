import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { coursId, type } = await request.json();

    if (!coursId || !type) {
      return NextResponse.json(
        { error: 'coursId et type sont requis' },
        { status: 400 }
      );
    }

    if (type !== 'en_ligne' && type !== 'sur_place') {
      return NextResponse.json(
        { error: 'type doit être "en_ligne" ou "sur_place"' },
        { status: 400 }
      );
    }

    // Vérifier si le quota existe
    const quotaCheck = await sql`
      SELECT cours_id, quota_en_ligne, inscriptions_en_ligne
      FROM cours_quotas
      WHERE cours_id = ${coursId}
    `;

    if (quotaCheck.length === 0) {
      // Créer automatiquement une entrée de quota pour ce cours
      await sql`
        INSERT INTO cours_quotas (cours_id, quota_en_ligne, inscriptions_en_ligne)
        VALUES (${coursId}, 30, 1)
        ON CONFLICT (cours_id) DO NOTHING
      `;
      return NextResponse.json({
        success: true,
        quota: {
          disponible: true,
          places_restantes: 29,
          quota_total: 30,
          inscriptions: 1
        }
      });
    }

    const quota = quotaCheck[0];

    // Vérifier si le quota n'est pas dépassé (pour les inscriptions en ligne)
    if (type === 'en_ligne' && quota.inscriptions_en_ligne >= quota.quota_en_ligne) {
      return NextResponse.json(
        { error: 'Quota atteint pour ce cours' },
        { status: 400 }
      );
    }

    // Incrémenter le compteur d'inscriptions en ligne
    if (type === 'en_ligne') {
      await sql`
        UPDATE cours_quotas
        SET inscriptions_en_ligne = inscriptions_en_ligne + 1
        WHERE cours_id = ${coursId}
      `;
    }

    // Récupérer les nouvelles valeurs
    const updated = await sql`
      SELECT 
        cours_id,
        quota_en_ligne,
        inscriptions_en_ligne,
        (quota_en_ligne - inscriptions_en_ligne) as places_restantes,
        CASE 
          WHEN inscriptions_en_ligne < quota_en_ligne THEN true 
          ELSE false 
        END as disponible
      FROM cours_quotas
      WHERE cours_id = ${coursId}
    `;

    return NextResponse.json({
      success: true,
      quota: {
        disponible: updated[0].disponible,
        places_restantes: updated[0].places_restantes,
        quota_total: updated[0].quota_en_ligne,
        inscriptions: updated[0].inscriptions_en_ligne
      }
    });
  } catch (error) {
    console.error('Erreur incrémentation quota:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'incrémentation du quota' },
      { status: 500 }
    );
  }
}
