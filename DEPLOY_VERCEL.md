# Guide de déploiement sur Vercel - Site Principal

## Prérequis

1. Compte Vercel (gratuit) : https://vercel.com/signup
2. Dépôt GitHub du package planning-shared créé et configuré
3. Variables d'environnement prêtes

## Étapes de déploiement

### 1. Connecter le dépôt GitHub à Vercel

1. Allez sur https://vercel.com/new
2. Importez votre dépôt `studio-e-danse`
3. Configurez le projet :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

### 2. Configurer les variables d'environnement

Dans les paramètres du projet Vercel, ajoutez ces variables :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
DATABASE_URL=votre_url_neon_database
RESEND_API_KEY=votre_clé_resend
ADMIN_EMAIL=votre_email_admin
```

### 3. Configurer l'accès au dépôt privé GitHub

Pour que Vercel puisse installer le package `@studio-e-danse/planning-shared` depuis GitHub privé :

1. Dans les paramètres Vercel du projet
2. Allez dans "Git" → "GitHub App"
3. Assurez-vous que Vercel a accès au dépôt `studio-e-planning-shared`

### 4. Déployer

1. Cliquez sur "Deploy"
2. Vercel va build et déployer automatiquement
3. Vous obtiendrez une URL de type : `https://studio-e-danse.vercel.app`

## Mises à jour automatiques

Chaque fois que vous poussez sur la branche `main` de GitHub, Vercel redéploie automatiquement le site.

## Domaine personnalisé (optionnel)

Si vous avez un nom de domaine :
1. Allez dans "Settings" → "Domains"
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer les DNS
