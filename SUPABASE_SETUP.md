# Configuration Supabase pour Studio E Danse

## 📋 Étapes de configuration

### 1. Créer un nouveau projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Cliquez sur **"New Project"**
4. Remplissez les informations :
   - **Name** : `studio-e-danse` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le bien !)
   - **Region** : Choisissez `Europe (Frankfurt)` ou la région la plus proche
   - **Pricing Plan** : Sélectionnez **Free** (500MB gratuits)
5. Cliquez sur **"Create new project"**
6. Attendez 1-2 minutes que le projet soit créé

### 2. Créer la table `inscriptions`

1. Dans votre projet Supabase, allez dans l'onglet **"SQL Editor"** (icône de base de données dans la barre latérale)
2. Cliquez sur **"New query"**
3. Copiez-collez **tout le contenu** du fichier `supabase-schema.sql` (à la racine du projet)
4. Cliquez sur **"Run"** (ou appuyez sur Cmd+Enter)
5. Vous devriez voir un message de succès ✅

### 3. Récupérer les clés API

1. Allez dans **"Settings"** (icône d'engrenage en bas de la barre latérale)
2. Cliquez sur **"API"** dans le menu de gauche
3. Vous verrez deux clés importantes :
   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** : Une longue clé commençant par `eyJ...`

### 4. Configurer les variables d'environnement

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez les valeurs par vos vraies clés :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Sauvegardez le fichier**
4. **Redémarrez le serveur de développement** :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

## ✅ Tester l'installation

1. Allez sur `http://localhost:3000/inscription`
2. Remplissez le formulaire et soumettez-le
3. Vérifiez dans Supabase :
   - Allez dans **"Table Editor"**
   - Sélectionnez la table **"inscriptions"**
   - Vous devriez voir votre inscription ! 🎉

## 📊 Consulter les inscriptions

### Option 1 : Interface Supabase (Recommandé)

1. Allez dans **"Table Editor"** dans votre projet Supabase
2. Cliquez sur la table **"inscriptions"**
3. Vous voyez toutes les inscriptions avec :
   - Filtres par statut
   - Recherche
   - Export CSV (bouton en haut à droite)
   - Modification directe des données

### Option 2 : Modifier le statut d'une inscription

1. Dans le **Table Editor**, cliquez sur une ligne
2. Modifiez le champ **"statut"** :
   - `en_attente` → Nouvelle inscription
   - `enregistre` → Inscription saisie dans votre système
   - `valide` → Paiement reçu
3. Cliquez sur **"Save"**

### Option 3 : Exporter vers Excel

1. Dans le **Table Editor**, cliquez sur le bouton **"..."** en haut à droite
2. Sélectionnez **"Download as CSV"**
3. Ouvrez le fichier CSV dans Excel
4. Copiez-collez les données dans votre logiciel maison

## 🔒 Sécurité

### Ce qui est protégé
- ✅ Les données ne sont **pas accessibles** sans authentification
- ✅ Le formulaire public peut **uniquement insérer** (pas lire ni modifier)
- ✅ Seuls les utilisateurs authentifiés Supabase peuvent consulter/modifier
- ✅ Aucune page admin sur le site public

### Pour vous authentifier (consulter les données)
- Utilisez l'interface web de Supabase (recommandé)
- Ou créez un compte utilisateur dans Supabase pour accéder via une app admin locale

## 🚀 Déploiement du site public

Quand vous déployez le site en ligne (Netlify, Vercel, etc.) :

1. **Ajoutez les variables d'environnement** sur votre plateforme de déploiement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Le site public sera accessible en ligne
3. Les inscriptions seront envoyées directement dans votre Supabase
4. Vous consultez les données depuis l'interface Supabase (ou en local)

## ❓ Dépannage

### Erreur "Invalid API key"
- Vérifiez que vous avez bien copié la clé `anon public` (pas la `service_role`)
- Vérifiez qu'il n'y a pas d'espaces avant/après dans le fichier `.env`
- Redémarrez le serveur après modification du `.env`

### Erreur "relation inscriptions does not exist"
- La table n'a pas été créée
- Retournez dans le SQL Editor et exécutez le script `supabase-schema.sql`

### Les inscriptions ne s'affichent pas dans Supabase
- Vérifiez que vous êtes bien connecté à Supabase
- Vérifiez dans l'onglet "Logs" s'il y a des erreurs
- Testez avec un `console.log()` dans le formulaire pour voir si l'insertion est tentée

## 📞 Support

En cas de problème, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
