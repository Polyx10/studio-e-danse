import { NextRequest, NextResponse } from 'next/server';
import { envoyerEmailConfirmationInscription } from '@/lib/email';
import { planningCours } from '@/lib/planning-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nomEleve, 
      emailResponsable, 
      selectedCourses, 
      tarifTotal, 
      tarifCours, 
      adhesion, 
      licenceFFD,
      modePaiement,
      nombreVersements
    } = body;

    if (!nomEleve || !emailResponsable || !selectedCourses || !tarifTotal) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi de l\'email' },
        { status: 400 }
      );
    }

    // Récupérer les détails des cours
    const cours = selectedCourses.map((coursId: string) => {
      const coursData = planningCours.find(c => c.id === coursId);
      if (!coursData) return null;
      return {
        nom: coursData.nom,
        jour: coursData.jour,
        horaire: coursData.horaire,
      };
    }).filter(Boolean);

    // Envoyer l'email
    const result = await envoyerEmailConfirmationInscription({
      nomEleve,
      emailResponsable,
      cours,
      tarifTotal,
      tarifCours,
      adhesion,
      licenceFFD,
      modePaiement,
      nombreVersements,
    });

    if (!result.success) {
      console.error('Erreur envoi email:', result.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email de confirmation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email de confirmation envoyé avec succès',
      emailId: result.data?.id 
    });

  } catch (error) {
    console.error('Erreur API send-confirmation-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
