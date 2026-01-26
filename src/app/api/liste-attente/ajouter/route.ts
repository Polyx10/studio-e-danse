import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function POST(request: NextRequest) {
  try {
    const { coursId, nom, prenom, email, telephone } = await request.json();

    if (!coursId || !nom || !prenom || !email) {
      return NextResponse.json(
        { error: 'coursId, nom, prenom et email sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si la personne n'est pas déjà sur la liste d'attente pour ce cours
    const existing = await sql`
      SELECT id FROM liste_attente
      WHERE cours_id = ${coursId} AND email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit sur la liste d\'attente pour ce cours' },
        { status: 400 }
      );
    }

    // Ajouter à la liste d'attente
    await sql`
      INSERT INTO liste_attente (cours_id, nom, prenom, email, telephone)
      VALUES (${coursId}, ${nom}, ${prenom}, ${email}, ${telephone || null})
    `;

    return NextResponse.json({
      success: true,
      message: 'Inscription sur la liste d\'attente réussie'
    });
  } catch (error) {
    console.error('Erreur ajout liste d\'attente:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout à la liste d\'attente' },
      { status: 500 }
    );
  }
}
