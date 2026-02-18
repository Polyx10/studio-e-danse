import { sql } from '@/lib/neon';
import { ArchivesClient } from './ArchivesClient';

export const metadata = {
  title: "Archives | Studio e - École de danse à Brest",
  description: "Retrouvez les archives de Studio e : anciens événements, spectacles, concours et moments forts de l'école.",
};

export const revalidate = 60;

async function getFiches() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, categorie, highlight, show_date, created_at
      FROM pages_content
      WHERE page = 'archives' AND published = true
      ORDER BY ordre ASC, created_at DESC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

export default async function ArchivesPage() {
  const fiches = await getFiches();
  return <ArchivesClient fiches={fiches as any} />;
}
