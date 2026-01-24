// Script temporaire pour initialiser les quotas dans Supabase
// À exécuter avec: node setup-quotas.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Charger les variables d'environnement depuis .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupQuotas() {
  console.log('🚀 Démarrage du setup des quotas...\n');

  try {
    // Lire le script SQL
    const sqlScript = fs.readFileSync('./supabase-setup-quotas.sql', 'utf8');
    
    console.log('📝 Script SQL chargé');
    console.log('⚠️  IMPORTANT: Ce script doit être exécuté manuellement dans le SQL Editor de Supabase');
    console.log('');
    console.log('Instructions:');
    console.log('1. Ouvrir Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Sélectionner votre projet');
    console.log('3. Aller dans SQL Editor');
    console.log('4. Créer une nouvelle requête');
    console.log('5. Copier-coller le contenu de supabase-setup-quotas.sql');
    console.log('6. Exécuter le script');
    console.log('');
    console.log('Le script va créer:');
    console.log('  ✓ 3 tables (cours_quotas, liste_attente, alertes_quotas)');
    console.log('  ✓ 3 fonctions SQL sécurisées');
    console.log('  ✓ 46 cours avec leurs quotas initialisés');
    console.log('');
    
    // Vérifier si les tables existent déjà
    console.log('🔍 Vérification de l\'état actuel...\n');
    
    const { data: quotasData, error: quotasError } = await supabase
      .from('cours_quotas')
      .select('count');
    
    if (!quotasError && quotasData) {
      console.log('✅ La table cours_quotas existe déjà');
      
      const { count } = await supabase
        .from('cours_quotas')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 ${count || 0} cours actuellement dans la base`);
    } else {
      console.log('⚠️  La table cours_quotas n\'existe pas encore');
      console.log('👉 Veuillez exécuter le script SQL dans Supabase Dashboard');
    }
    
    const { data: listeData, error: listeError } = await supabase
      .from('liste_attente')
      .select('count');
    
    if (!listeError && listeData) {
      console.log('✅ La table liste_attente existe');
    } else {
      console.log('⚠️  La table liste_attente n\'existe pas encore');
    }
    
    const { data: alertesData, error: alertesError } = await supabase
      .from('alertes_quotas')
      .select('count');
    
    if (!alertesError && alertesData) {
      console.log('✅ La table alertes_quotas existe');
    } else {
      console.log('⚠️  La table alertes_quotas n\'existe pas encore');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

setupQuotas();
