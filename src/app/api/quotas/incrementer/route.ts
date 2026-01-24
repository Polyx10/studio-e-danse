import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { coursId, type = 'en_ligne' } = await request.json();

    if (!coursId) {
      return NextResponse.json(
        { error: 'coursId requis' },
        { status: 400 }
      );
    }

    // Appeler la fonction Supabase pour incrémenter
    const { data, error } = await supabase.rpc('incrementer_inscription', {
      p_cours_id: coursId,
      p_type: type
    });

    if (error) {
      console.error('Erreur incrémentation quota:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'incrémentation du quota' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API incrementer quota:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
