import { NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

// GET : lister les fiches publiées (filtrable par page)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  try {
    let results;
    if (page) {
      results = await sql`
        SELECT id, page, titre, texte, photos, categorie, highlight, ordre, show_date, created_at
        FROM pages_content
        WHERE page = ${page} AND published = true
        ORDER BY ordre ASC, created_at DESC
      `;
    } else {
      results = await sql`
        SELECT id, page, titre, texte, photos, categorie, highlight, ordre, show_date, created_at
        FROM pages_content
        WHERE published = true
        ORDER BY page ASC, ordre ASC, created_at DESC
      `;
    }
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Erreur GET pages_content:', error?.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
