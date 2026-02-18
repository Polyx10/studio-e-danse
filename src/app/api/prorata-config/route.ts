import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';
import { vacancesDefaut2526, type VacancesScolaires } from '@/lib/prorata-data';

export async function GET() {
  try {
    const result = await sql`
      SELECT key, value FROM app_config WHERE key IN ('vacances_scolaires', 'prorata_mode', 'prorata_periode_forcee')
    `;

    const configMap: Record<string, string> = {};
    result.forEach((row: any) => {
      configMap[row.key] = row.value;
    });

    const vacances: VacancesScolaires = configMap.vacances_scolaires
      ? JSON.parse(configMap.vacances_scolaires)
      : vacancesDefaut2526;

    return NextResponse.json({
      vacances,
      prorata_mode: configMap.prorata_mode || 'auto',
      prorata_periode_forcee: configMap.prorata_periode_forcee || null,
    });
  } catch (error) {
    console.error('Erreur chargement prorata config:', error);
    return NextResponse.json({
      vacances: vacancesDefaut2526,
      prorata_mode: 'auto',
      prorata_periode_forcee: null,
    });
  }
}
