import { neon } from '@neondatabase/serverless';

async function fixMissingColumns() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL non définie dans .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  try {
    console.log('🔄 Ajout des colonnes manquantes...');
    
    // Ajouter les colonnes responsable2
    console.log('  → Ajout colonnes responsable2_address, responsable2_postal_code, responsable2_city');
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS responsable2_address TEXT,
      ADD COLUMN IF NOT EXISTS responsable2_postal_code TEXT,
      ADD COLUMN IF NOT EXISTS responsable2_city TEXT
    `;
    
    // Ajouter les colonnes options spectacle
    console.log('  → Ajout colonnes participation_spectacle, nombre_costumes, droit_image');
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS participation_spectacle TEXT DEFAULT 'oui',
      ADD COLUMN IF NOT EXISTS nombre_costumes TEXT DEFAULT '1',
      ADD COLUMN IF NOT EXISTS droit_image TEXT DEFAULT 'autorise'
    `;
    
    // Ajouter les colonnes paiement
    console.log('  → Ajout colonnes type_cours, mode_paiement, nombre_versements');
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS type_cours TEXT DEFAULT 'loisirs',
      ADD COLUMN IF NOT EXISTS mode_paiement TEXT,
      ADD COLUMN IF NOT EXISTS nombre_versements TEXT DEFAULT '1'
    `;
    
    // Ajouter les colonnes validation
    console.log('  → Ajout colonnes accept_rules, signature_name');
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS reglement_accepte BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS signature_name TEXT
    `;
    
    console.log('✅ Toutes les colonnes ont été ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des colonnes:', error);
    process.exit(1);
  }
}

fixMissingColumns();
