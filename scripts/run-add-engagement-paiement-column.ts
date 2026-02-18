import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function addEngagementPaiementColumn() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL non définie dans .env.local');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  try {
    console.log('🔄 Ajout de la colonne engagement_paiement_echelonne...');
    
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS engagement_paiement_echelonne BOOLEAN DEFAULT false
    `;
    
    console.log('✅ Colonne engagement_paiement_echelonne ajoutée avec succès !');
    console.log('📝 Cette colonne stocke l\'attestation sur l\'honneur pour les paiements échelonnés');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la colonne:', error);
    process.exit(1);
  }
}

addEngagementPaiementColumn();
