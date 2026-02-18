import { sql } from '@/lib/neon';
import { StagesClient } from './StagesClient';

export const metadata = {
  title: "Stages & Master Classes | Studio e - École de danse à Brest",
  description: "Découvrez nos stages et master classes de danse à Brest. Des intervenants de qualité pour progresser et découvrir de nouveaux styles.",
};

export const revalidate = 60;

async function getFiches() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, categorie, highlight, show_date, created_at
      FROM pages_content
      WHERE page = 'stages' AND published = true
      ORDER BY ordre ASC, created_at DESC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

export default async function StagesPage() {
  const fiches = await getFiches();
  return <StagesClient fiches={fiches as any} />;
}
