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
      SELECT id, titre, texte, photos, photos_legendes, categorie, highlight, ordre, show_date, created_at, lien_bouton_url, lien_bouton_texte, lien_bouton2_url, lien_bouton2_texte
      FROM pages_content
      WHERE page = 'equipe' AND published = true
      ORDER BY ordre ASC, created_at ASC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

async function getFichesEleves() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, photos_legendes, categorie, highlight, ordre, show_date, created_at, lien_bouton_url, lien_bouton_texte, lien_bouton2_url, lien_bouton2_texte
      FROM pages_content
      WHERE page = 'eleves' AND published = true
      ORDER BY ordre ASC, created_at ASC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

async function getFichesParrains() {
  try {
    const fiches = await sql`
      SELECT id, titre, texte, photos, photos_legendes, categorie, highlight, ordre, show_date, created_at, lien_bouton_url, lien_bouton_texte, lien_bouton2_url, lien_bouton2_texte
      FROM pages_content
      WHERE page = 'parrains' AND published = true
      ORDER BY ordre ASC, created_at ASC
    `;
    return fiches as any[];
  } catch {
    return [];
  }
}

export default async function EquipePage() {
  const [fiches, fichesEleves, fichesParrains] = await Promise.all([getFiches(), getFichesEleves(), getFichesParrains()]);
  return <EquipeClient fiches={fiches as any} fichesEleves={fichesEleves as any} fichesParrains={fichesParrains as any} />;
}
