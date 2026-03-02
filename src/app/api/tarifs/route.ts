import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [grilleRows, configRows] = await Promise.all([
      sql`SELECT duree_minutes, tarif_plein, tarif_reduit FROM tarif_grille ORDER BY duree_minutes ASC`,
      sql`SELECT key, value FROM app_config WHERE key LIKE 'tarif_%'`,
    ]);

    const config = Object.fromEntries((configRows as any[]).map(r => [r.key, parseFloat(r.value)]));

    return NextResponse.json({
      grille: (grilleRows as any[]).map(r => ({
        duree_minutes: Number(r.duree_minutes),
        tarif_plein: Number(r.tarif_plein),
        tarif_reduit: Number(r.tarif_reduit),
      })),
      fraisFixes: {
        adhesion: config['tarif_adhesion'] ?? 12,
        licenceFFD: config['tarif_licence_ffd'] ?? 24,
        licenceFFDMoins4ans: config['tarif_licence_ffd_moins4ans'] ?? 0,
      },
      tarifsSpeciaux: {
        danseEtudes1: config['tarif_danse_etudes_1'] ?? 350,
        danseEtudes2: config['tarif_danse_etudes_2'] ?? 700,
        onStage: config['tarif_on_stage'] ?? 100,
        classesConcours: config['tarif_classes_concours'] ?? 200,
      },
    });
  } catch (error: any) {
    console.error('Erreur GET tarifs:', error?.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
