import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    console.log('🔄 Exécution de la migration pour ajouter les colonnes de préinscription...');
    
    // Exécuter chaque commande séparément
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS preinscription_payee BOOLEAN DEFAULT FALSE
    `;
    
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS montant_preinscription INTEGER DEFAULT 0
    `;
    
    await sql`
      ALTER TABLE inscriptions 
      ADD COLUMN IF NOT EXISTS echeancier_personnalise JSONB DEFAULT NULL
    `;
    
    console.log('✅ Migration réussie ! Colonnes ajoutées :');
    console.log('   - preinscription_payee (BOOLEAN)');
    console.log('   - montant_preinscription (INTEGER)');
    console.log('   - echeancier_personnalise (JSONB)');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

runMigration();
