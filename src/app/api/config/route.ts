import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

// GET - Récupérer la configuration
export async function GET() {
  try {
    const config = await sql`
      SELECT key, value, description 
      FROM app_config
    `;
    
    // Transformer en objet clé-valeur
    const configObj: Record<string, string> = {};
    config.forEach((item: any) => {
      configObj[item.key] = item.value;
    });
    
    return NextResponse.json(configObj);
  } catch (error) {
    console.error('Erreur récupération config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Mettre à jour la configuration (réservé à l'admin)
export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Clé et valeur requises' }, { status: 400 });
    }
    
    await sql`
      UPDATE app_config 
      SET value = ${value}, updated_at = CURRENT_TIMESTAMP
      WHERE key = ${key}
    `;
    
    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error('Erreur mise à jour config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
