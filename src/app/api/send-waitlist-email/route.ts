import { NextRequest, NextResponse } from 'next/server';
import { envoyerEmailListeAttente } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nomComplet, email, coursNom, position } = body;

    if (!nomComplet || !email || !coursNom || !position) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi de l\'email' },
        { status: 400 }
      );
    }

    // Envoyer l'email
    const result = await envoyerEmailListeAttente(
      nomComplet,
      email,
      coursNom,
      position
    );

    if (!result.success) {
      console.error('Erreur envoi email liste attente:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      emailId: result.data?.id 
    });

  } catch (error) {
    console.error('Erreur API send-waitlist-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
