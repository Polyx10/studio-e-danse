import { neon } from '@neondatabase/serverless';

// Connexion à Neon Database
// Utilise une valeur par défaut pour éviter l'erreur de build si DATABASE_URL n'est pas encore configurée
export const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder');
