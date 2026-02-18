import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

// Horaires prédéfinis
const horairesReguliers = {
  mardi: '15h00 - 19h30',
  mercredi: '10h15 - 12h30 / 13h00 - 19h00',
  jeudi: '15h00 - 19h30',
  vendredi: '15h15 - 19h30',
  samedi: '09h45 - 12h30 / 13h00 - 16h00',
};

const horairesVacances = {
  mardi: '10h00 - 12h30 / 13h00 - 15h00',
  mercredi: '10h00 - 12h30 / 13h00 - 16h30',
  jeudi: '10h00 - 12h30 / 13h00 - 15h00',
  vendredi: '10h00 - 12h30 / 13h00 - 14h45',
  samedi: '09h45 - 12h30 / 13h00 - 16h00',
};

export async function GET() {
  try {
    const result = await sql`
      SELECT value FROM app_config WHERE key = 'horaires_secretariat'
    `;

    if (result.length > 0 && result[0].value) {
      const config = JSON.parse(result[0].value);
      
      // Retourner les horaires selon le mode
      if (config.mode === 'reguliers') {
        return NextResponse.json({ mode: 'reguliers', horaires: horairesReguliers });
      } else if (config.mode === 'vacances') {
        return NextResponse.json({ mode: 'vacances', horaires: horairesVacances });
      } else if (config.mode === 'personnalises' && config.horaires_personnalises) {
        // Filtrer pour ne retourner que les jours actifs
        const horairesActifs: Record<string, string> = {};
        Object.keys(config.horaires_personnalises).forEach((jour: string) => {
          const jourData = config.horaires_personnalises[jour];
          // Support ancien format (string) et nouveau format (objet avec actif/horaire)
          if (typeof jourData === 'string') {
            if (jourData !== '') horairesActifs[jour] = jourData;
          } else if (jourData.actif && jourData.horaire) {
            horairesActifs[jour] = jourData.horaire;
          }
        });
        return NextResponse.json({ mode: 'personnalises', horaires: horairesActifs });
      }
    }

    // Par défaut : horaires réguliers
    return NextResponse.json({ mode: 'reguliers', horaires: horairesReguliers });
  } catch (error) {
    console.error('Erreur chargement horaires:', error);
    return NextResponse.json({ mode: 'reguliers', horaires: horairesReguliers });
  }
}
