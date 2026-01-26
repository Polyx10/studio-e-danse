import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { coursIds } = await request.json();

    if (!Array.isArray(coursIds) || coursIds.length === 0) {
      return NextResponse.json(
        { error: 'coursIds doit être un tableau non vide' },
        { status: 400 }
      );
    }

    // Récupérer les quotas pour tous les cours demandés
    const quotas = await sql`
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
      WHERE cours_id = ANY(${coursIds})
    `;

    // Créer un objet avec les quotas indexés par cours_id
    const quotasMap = quotas.reduce((acc: any, quota: any) => {
      acc[quota.cours_id] = {
        disponible: quota.disponible,
        places_restantes: quota.places_restantes,
        quota_total: quota.quota_en_ligne,
        inscriptions: quota.inscriptions_en_ligne
      };
      return acc;
    }, {});

    return NextResponse.json({ quotas: quotasMap });
  } catch (error) {
    console.error('Erreur vérification quotas:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des quotas' },
      { status: 500 }
    );
  }
}
