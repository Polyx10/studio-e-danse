import { sql } from '@/lib/neon';
import { ActualitesClient } from './ActualitesClient';

export const metadata = {
  title: "Actualités | Studio e - École de danse à Brest",
  description: "Suivez toute l'actualité de Studio e : événements, spectacles, concours, stages et informations importantes.",
};

export const revalidate = 60;

async function getFiches() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, categorie, highlight, show_date, created_at, lien_bouton_url, lien_bouton_texte
      FROM pages_content
      WHERE page = 'actualites' AND published = true
      ORDER BY ordre ASC, created_at DESC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

export default async function ActualitesPage() {
  const fiches = await getFiches();
  return <ActualitesClient fiches={fiches as any} />;
}
