import { sql } from '@/lib/neon';
import { EquipeClient } from './EquipeClient';

export const metadata = {
  title: "Notre Équipe | Studio e - École de danse à Brest",
  description: "Découvrez nos professeurs diplômés et passionnés. Une équipe expérimentée pour vous accompagner.",
};

export const revalidate = 60;

async function getFiches() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, categorie, highlight, ordre, show_date, created_at
      FROM pages_content
      WHERE page = 'equipe' AND published = true
      ORDER BY ordre ASC, created_at ASC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

export default async function EquipePage() {
  const fiches = await getFiches();
  return <EquipeClient fiches={fiches as any} />;
}
