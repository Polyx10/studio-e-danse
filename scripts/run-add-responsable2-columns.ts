import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

async function addResponsable2Columns() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL non définie dans .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  try {
    console.log('🔄 Ajout des colonnes responsable2_address, responsable2_postal_code, responsable2_city...');
    
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS responsable2_address TEXT,
      ADD COLUMN IF NOT EXISTS responsable2_postal_code TEXT,
      ADD COLUMN IF NOT EXISTS responsable2_city TEXT
    `;
    
    console.log('✅ Colonnes ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des colonnes:', error);
    process.exit(1);
  }
}

addResponsable2Columns();
