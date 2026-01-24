import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { envoyerEmailListeAttente } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { coursId, coursNom, nomComplet, email, telephone } = await request.json();

    if (!coursId || !coursNom || !nomComplet || !email || !telephone) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Appeler la fonction Supabase pour ajouter à la liste d'attente
    const { data, error } = await supabase.rpc('ajouter_liste_attente', {
      p_cours_id: coursId,
      p_cours_nom: coursNom,
      p_nom_complet: nomComplet,
      p_email: email,
      p_telephone: telephone
    });

    if (error) {
      console.error('Erreur ajout liste d\'attente:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout à la liste d\'attente' },
        { status: 500 }
      );
    }

    // Envoyer l'email de confirmation de liste d'attente
    try {
      await envoyerEmailListeAttente(
        nomComplet,
        email,
        coursNom,
        data.position
      );
      console.log('Email de liste d\'attente envoyé');
    } catch (emailError) {
      console.error('Erreur envoi email liste attente (non bloquant):', emailError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API liste attente:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
