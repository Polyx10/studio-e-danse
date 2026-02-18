import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function runMigration() {
  try {
    console.log('🔄 Création de la table de configuration...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS app_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      INSERT INTO app_config (key, value, description) 
      VALUES 
        ('preinscription_active', 'false', 'Active ou désactive la possibilité de payer la préinscription de 90€'),
        ('montant_preinscription', '90', 'Montant de la préinscription en euros')
      ON CONFLICT (key) DO NOTHING
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_app_config_key ON app_config(key)
    `;
    
    console.log('✅ Table app_config créée avec succès !');
    console.log('   Configuration initiale :');
    console.log('   - preinscription_active: false');
    console.log('   - montant_preinscription: 90€');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error);
    process.exit(1);
  }
}

runMigration();
