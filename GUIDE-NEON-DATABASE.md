# Guide de Configuration Neon Database

## 1. Création du projet Neon

1. Allez sur [https://console.neon.tech](https://console.neon.tech)
2. Connectez-vous ou créez un compte (gratuit)
3. Cliquez sur **"Create a project"**
4. Donnez un nom à votre projet : `studio-e-danse`
5. Sélectionnez la région la plus proche (ex: Europe - Frankfurt)
6. Cliquez sur **"Create project"**

## 2. Récupération de la chaîne de connexion

Une fois le projet créé :

1. Dans le dashboard Neon, cliquez sur **"Connection string"**
2. Copiez la chaîne de connexion qui ressemble à :
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Collez cette chaîne dans votre fichier `.env` :
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

## 3. Création de la table inscriptions

1. Dans le dashboard Neon, allez dans l'onglet **"SQL Editor"**
2. Ouvrez le fichier `supabase-setup-inscriptions.sql` de votre projet
3. Copiez tout le contenu du fichier
4. Collez-le dans l'éditeur SQL de Neon
5. Cliquez sur **"Run"** pour exécuter le script

Le script va créer :
- ✅ La table `inscriptions` avec tous les champs nécessaires
- ✅ Les index pour optimiser les performances
- ✅ Les contraintes de validation

## 4. Vérification

Pour vérifier que la table a bien été créée :

```sql
SELECT * FROM inscriptions LIMIT 1;
```

Vous devriez voir une table vide (normal, aucune inscription pour le moment).

## 5. Architecture hybride

Le projet utilise maintenant deux bases de données :

- **Supabase** : Pour les quotas de cours (système temps réel)
- **Neon** : Pour les inscriptions (stockage principal)

Cette architecture permet :
- ✅ Meilleure performance pour les quotas en temps réel
- ✅ Base de données PostgreSQL optimisée pour Vercel
- ✅ Déploiement simplifié avec Neon

## 6. Déploiement sur Vercel

Lors du déploiement sur Vercel :

1. Ajoutez la variable d'environnement `DATABASE_URL` dans les settings Vercel
2. Collez votre chaîne de connexion Neon
3. Redéployez votre application

Vercel détectera automatiquement Neon et optimisera la connexion.

## 7. Consultation des données

Pour consulter les inscriptions dans Neon :

1. Allez dans **"Tables"** dans le dashboard Neon
2. Sélectionnez la table `inscriptions`
3. Vous verrez toutes les pré-inscriptions enregistrées

Vous pouvez également exécuter des requêtes SQL personnalisées :

```sql
-- Voir toutes les inscriptions récentes
SELECT student_name, responsable1_email, created_at, statut
FROM inscriptions
ORDER BY created_at DESC;

-- Compter les inscriptions par statut
SELECT statut, COUNT(*) as nombre
FROM inscriptions
GROUP BY statut;
```

## 8. Sécurité

⚠️ **Important** : Ne partagez jamais votre `DATABASE_URL` publiquement. Elle contient vos identifiants de connexion.

La chaîne de connexion doit rester dans :
- ✅ Le fichier `.env` (local, non versionné)
- ✅ Les variables d'environnement Vercel (production)
- ❌ Jamais dans le code source versionné

## Support

- Documentation Neon : [https://neon.tech/docs](https://neon.tech/docs)
- Support Neon : [https://neon.tech/discord](https://neon.tech/discord)
