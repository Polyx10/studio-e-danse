# 🔒 Mémo Sécurité Supabase - Studio E Danse

**Date de création :** 31 décembre 2025  
**Statut :** ⚠️ À CORRIGER AVANT LA MISE EN PRODUCTION

---

## 📋 Résumé des problèmes de sécurité

Supabase Security Advisor a identifié **3 problèmes de sécurité** sur le projet `studio-e-danse` qui doivent être résolus avant la mise en production.

---

## 🔴 Problème 1 : Table `inscriptions` - RLS non activée

### Description
La table `public.inscriptions` est publique mais le Row Level Security (RLS) n'est pas activé.

### Impact
Sans RLS, **toutes les données de la table sont accessibles publiquement** par n'importe quel utilisateur ayant accès à l'API Supabase. Cela signifie que les inscriptions des élèves peuvent être lues, modifiées ou supprimées sans contrôle d'accès.

### Solution
Activer le RLS sur la table `inscriptions` :

```sql
-- Activer RLS sur la table inscriptions
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
```

---

## 🔴 Problème 2 : Table `inscriptions` - Politiques RLS manquantes

### Description
La table a des politiques RLS définies mais le RLS n'est pas activé sur la table elle-même.

### Impact
Les politiques de sécurité existent mais ne sont pas appliquées, rendant la table vulnérable.

### Solution
Après avoir activé le RLS (voir Problème 1), créer des politiques appropriées selon vos besoins :

#### Option A : Accès public en lecture seule (pour affichage admin)
```sql
-- Permettre la lecture publique (à adapter selon vos besoins)
CREATE POLICY "Lecture publique des inscriptions"
ON public.inscriptions
FOR SELECT
USING (true);

-- Permettre l'insertion publique (formulaire d'inscription)
CREATE POLICY "Insertion publique des inscriptions"
ON public.inscriptions
FOR INSERT
WITH CHECK (true);
```

#### Option B : Accès restreint aux administrateurs uniquement (recommandé)
```sql
-- Seuls les admins authentifiés peuvent lire
CREATE POLICY "Admin peut lire les inscriptions"
ON public.inscriptions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Insertion publique autorisée (formulaire)
CREATE POLICY "Insertion publique des inscriptions"
ON public.inscriptions
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent modifier/supprimer
CREATE POLICY "Admin peut modifier les inscriptions"
ON public.inscriptions
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin peut supprimer les inscriptions"
ON public.inscriptions
FOR DELETE
USING (auth.role() = 'authenticated');
```

#### Option C : Accès anonyme complet (NON RECOMMANDÉ en production)
```sql
-- ⚠️ À utiliser UNIQUEMENT en développement
CREATE POLICY "Accès complet anonyme"
ON public.inscriptions
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## 🟡 Problème 3 : Fonction `update_updated_at_column` - Chemin de recherche mutable

### Description
La fonction `public.update_updated_at_column` a un chemin de recherche mutable qui pourrait poser des problèmes de sécurité.

### Impact
Un attaquant pourrait potentiellement manipuler le chemin de recherche pour exécuter du code malveillant.

### Solution
Recréer la fonction avec un chemin de recherche fixe :

```sql
-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Recréer avec un chemin de recherche sécurisé
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Réappliquer le trigger sur la table inscriptions
DROP TRIGGER IF EXISTS update_inscriptions_updated_at ON public.inscriptions;

CREATE TRIGGER update_inscriptions_updated_at
    BEFORE UPDATE ON public.inscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 📝 Checklist avant la mise en production

- [ ] Activer RLS sur la table `inscriptions`
- [ ] Créer les politiques RLS appropriées (choisir Option A, B ou C selon vos besoins)
- [ ] Sécuriser la fonction `update_updated_at_column`
- [ ] Tester l'accès à la table depuis le frontend
- [ ] Vérifier que le formulaire d'inscription fonctionne toujours
- [ ] Vérifier que l'admin peut accéder aux inscriptions
- [ ] Re-vérifier le Security Advisor Supabase (les alertes doivent disparaître)

---

## 🔧 Comment appliquer ces corrections

### Méthode 1 : Via le SQL Editor de Supabase (recommandé)
1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Créez une nouvelle requête
4. Copiez-collez les commandes SQL ci-dessus
5. Exécutez la requête

### Méthode 2 : Via un fichier de migration
1. Créez un fichier `supabase/migrations/YYYYMMDDHHMMSS_fix_security_issues.sql`
2. Ajoutez toutes les commandes SQL
3. Appliquez la migration avec `supabase db push`

---

## ⚠️ Important

**NE PAS METTRE EN PRODUCTION** tant que ces problèmes de sécurité ne sont pas résolus. Les données des inscriptions (noms, emails, téléphones, etc.) seraient exposées publiquement.

---

## 📞 Support

Si vous avez des questions sur ces corrections :
- Documentation Supabase RLS : https://supabase.com/docs/guides/auth/row-level-security
- Documentation Supabase Security : https://supabase.com/docs/guides/database/postgres/security

---

**Dernière mise à jour :** 31 décembre 2025
