import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sql = neon(process.env.DATABASE_URL!);

async function setupQuotas() {
  try {
    console.log('🚀 Création des tables de quotas dans Neon Database...\n');

    // Lire le fichier SQL
    const sqlFile = fs.readFileSync(
      path.resolve(__dirname, 'create-quotas-neon.sql'),
      'utf-8'
    );

    // Exécuter le script SQL complet
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    
    await pool.query(sqlFile);
    await pool.end();

    console.log('✅ Tables de quotas créées avec succès !');
    console.log('✅ Quotas initialisés pour tous les cours');
    
    // Vérifier les quotas créés
    const quotas = await sql`SELECT cours_id, quota_en_ligne, inscriptions_en_ligne FROM cours_quotas ORDER BY cours_id`;
    console.log(`\n📊 ${quotas.length} cours initialisés avec des quotas\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    process.exit(1);
  }
}

setupQuotas();
