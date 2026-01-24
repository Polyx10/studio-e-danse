import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { coursId } = await request.json();

    if (!coursId) {
      return NextResponse.json(
        { error: 'coursId requis' },
        { status: 400 }
      );
    }

    // Appeler la fonction Supabase pour vérifier la disponibilité
    const { data, error } = await supabase.rpc('verifier_disponibilite_cours', {
      p_cours_id: coursId
    });

    if (error) {
      console.error('Erreur vérification quota:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du quota' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API verifier quota:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
