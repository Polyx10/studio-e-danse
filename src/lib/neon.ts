import { neon } from '@neondatabase/serverless';

// Connexion à Neon Database
export const sql = neon(process.env.DATABASE_URL!);
