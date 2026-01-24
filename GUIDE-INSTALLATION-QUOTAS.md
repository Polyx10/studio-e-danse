# 📘 Guide d'installation du système de quotas

## 🎯 Objectif

Installer le système de gestion des quotas d'inscription en ligne pour limiter les inscriptions à 2/3 de la capacité de chaque cours et gérer une liste d'attente automatique.

---

## ⚡ Installation rapide

### Étape 1 : Accéder à Supabase Dashboard

1. Ouvrir **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionner votre projet **Studio E Danse**
3. Dans le menu latéral, cliquer sur **SQL Editor**

### Étape 2 : Exécuter le script SQL

1. Cliquer sur **"New query"** (Nouvelle requête)
2. Ouvrir le fichier `supabase-setup-quotas.sql` dans votre éditeur
3. **Copier tout le contenu** du fichier
4. **Coller** dans l'éditeur SQL de Supabase
5. Cliquer sur **"Run"** (Exécuter) ou appuyer sur `Ctrl+Enter`

### Étape 3 : Vérifier l'installation

Le script affichera un résumé à la fin :

```
✅ Setup complet terminé !
📊 Tables créées : cours_quotas, liste_attente, alertes_quotas
⚙️ Fonctions créées : verifier_disponibilite_cours, incrementer_inscription, ajouter_liste_attente
📝 46 cours initialisés avec leurs quotas
```

Vous devriez aussi voir un tableau récapitulatif :

| nb_cours_total | capacite_totale | places_en_ligne_total | reserve_papier_total | effectif_moyen |
|----------------|-----------------|----------------------|---------------------|----------------|
| 46             | 911             | 597                  | 314                 | 19.8           |

---

## 📊 Ce qui a été créé

### 1. Tables de base de données

#### `cours_quotas`
Stocke les quotas et compteurs pour chaque cours :
- `cours_id` : Identifiant du cours (lun-1, mar-2, etc.)
- `cours_nom` : Nom complet avec jour et horaire
- `effectif_max` : Capacité maximale du cours
- `quota_en_ligne` : Places disponibles en ligne (2/3 de l'effectif max)
- `inscriptions_en_ligne` : Compteur d'inscriptions en ligne
- `inscriptions_papier` : Compteur d'inscriptions papier
- `ouverture_temporaire` : Permet d'ouvrir temporairement un cours complet
- Alertes automatiques à 50%, 75%, 90%

#### `liste_attente`
Gère les inscriptions sur liste d'attente :
- Informations de contact (nom, email, téléphone)
- Position dans la file d'attente
- Statut (en_attente, notifié, inscrit)
- Date d'inscription

#### `alertes_quotas`
Historique des alertes de remplissage :
- Type d'alerte (50%, 75%, 90%, complet)
- Pourcentage de remplissage
- Message descriptif
- Statut de lecture

### 2. Fonctions SQL sécurisées

#### `verifier_disponibilite_cours(cours_id)`
Vérifie si un cours a encore des places disponibles en ligne.

**Retourne :**
```json
{
  "disponible": true,
  "places_restantes": 5,
  "effectif_max": 15,
  "quota_en_ligne": 10,
  "inscriptions_en_ligne": 5,
  "inscriptions_papier": 2,
  "ouverture_temporaire": false,
  "pourcentage_rempli": 50.0
}
```

#### `incrementer_inscription(cours_id, type)`
Incrémente le compteur d'inscriptions et génère des alertes automatiques.

**Paramètres :**
- `cours_id` : ID du cours
- `type` : 'en_ligne' ou 'papier'

**Retourne :**
```json
{
  "success": true,
  "nouveau_total": 6,
  "pourcentage": 60.0
}
```

#### `ajouter_liste_attente(cours_id, cours_nom, nom_complet, email, telephone)`
Ajoute une personne sur la liste d'attente d'un cours complet.

**Retourne :**
```json
{
  "success": true,
  "id": "uuid",
  "position": 3,
  "message": "Vous êtes inscrit(e) sur la liste d'attente à la position 3"
}
```

---

## 🔧 Fonctionnalités implémentées

### ✅ Côté utilisateur (formulaire d'inscription)

1. **Affichage en temps réel des quotas**
   - Badge "X places" quand il reste 5 places ou moins
   - Badge "Complet en ligne" pour les cours pleins
   - Désactivation automatique des cours complets

2. **Liste d'attente**
   - Bouton "S'inscrire sur la liste d'attente" pour les cours complets
   - Modal de saisie des coordonnées
   - Confirmation avec position dans la file

3. **Incrémentation automatique**
   - Après chaque inscription validée, les quotas sont mis à jour
   - Alertes automatiques envoyées aux admins

### ✅ Côté backend

1. **API Routes créées**
   - `/api/quotas/verifier` - Vérifier disponibilité
   - `/api/quotas/incrementer` - Incrémenter compteur
   - `/api/liste-attente/ajouter` - Ajouter à la liste d'attente

2. **Sécurité**
   - Fonctions SQL avec `SECURITY DEFINER`
   - Protection contre les conditions de concurrence (FOR UPDATE)
   - Validation des données

3. **Alertes automatiques**
   - À 50% : Première alerte
   - À 75% : Alerte intermédiaire
   - À 90% : Alerte critique
   - À 100% : Cours complet

---

## 📈 Données initialisées

**46 cours** ont été initialisés avec leurs quotas :

### Répartition par jour

| Jour | Nb cours | Capacité | En ligne | Papier |
|------|----------|----------|----------|--------|
| Lundi | 3 | 58 | 38 | 20 |
| Mardi | 7 | 144 | 95 | 49 |
| **Mercredi** | **13** | **260** | **170** | **90** |
| Jeudi | 5 | 100 | 66 | 34 |
| Vendredi | 7 | 143 | 94 | 49 |
| Samedi | 11 | 206 | 134 | 72 |
| **TOTAL** | **46** | **911** | **597** | **314** |

### Exemples de quotas

- **Classique ADO 1 (Lundi 17h45)** : 15 places max → 10 en ligne
- **Jazz Adulte Inter (Mardi 20h30)** : 29 places max → 19 en ligne
- **Baby danse (Samedi 9h30)** : 20 places max → 13 en ligne

---

## 🧪 Tester le système

### Test 1 : Vérifier les quotas dans le formulaire

1. Ouvrir http://localhost:3001/inscription
2. Aller à l'étape 3 "Choix des cours"
3. Observer les badges de places restantes
4. Vérifier que les cours complets affichent "Complet en ligne"

### Test 2 : Simuler un cours complet

Dans Supabase SQL Editor :

```sql
-- Remplir un cours pour le tester
UPDATE cours_quotas 
SET inscriptions_en_ligne = quota_en_ligne 
WHERE cours_id = 'lun-1';

-- Vérifier
SELECT * FROM cours_quotas WHERE cours_id = 'lun-1';
```

Recharger le formulaire → Le cours devrait apparaître comme complet.

### Test 3 : Tester la liste d'attente

1. Cliquer sur "S'inscrire sur la liste d'attente" pour un cours complet
2. Remplir le formulaire (nom, email, téléphone)
3. Valider
4. Vérifier dans Supabase :

```sql
SELECT * FROM liste_attente ORDER BY date_inscription DESC;
```

### Test 4 : Vérifier les alertes

```sql
-- Voir toutes les alertes générées
SELECT * FROM alertes_quotas ORDER BY created_at DESC;
```

---

## 🔐 Sécurité et RLS

⚠️ **IMPORTANT** : Avant la mise en production, appliquer les politiques RLS (Row Level Security).

Voir le fichier `SECURITE-SUPABASE-MEMO.md` pour les instructions complètes.

### Politiques RLS recommandées

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE cours_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE liste_attente ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertes_quotas ENABLE ROW LEVEL SECURITY;

-- Lecture publique des quotas (pour affichage)
CREATE POLICY "Lecture publique quotas" ON cours_quotas
  FOR SELECT USING (true);

-- Seuls les admins peuvent modifier
CREATE POLICY "Admin peut tout faire" ON cours_quotas
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Liste d'attente : insertion publique, lecture admin
CREATE POLICY "Insertion publique liste attente" ON liste_attente
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin lecture liste attente" ON liste_attente
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🎨 Interface admin (à développer)

Prochaines étapes recommandées :

1. **Page `/admin/quotas`**
   - Tableau de bord des quotas
   - Visualisation en temps réel
   - Modification manuelle des quotas

2. **Page `/admin/liste-attente`**
   - Liste des personnes en attente
   - Notification par email
   - Gestion des statuts

3. **Page `/admin/alertes`**
   - Historique des alertes
   - Notifications push
   - Statistiques

---

## 📞 Support

En cas de problème :

1. Vérifier les logs dans Supabase Dashboard > Logs
2. Consulter la console du navigateur (F12)
3. Vérifier que les tables existent : `SELECT * FROM cours_quotas LIMIT 1;`
4. Vérifier que les fonctions existent : `SELECT * FROM pg_proc WHERE proname LIKE '%quota%';`

---

## ✅ Checklist de déploiement

- [ ] Script SQL exécuté dans Supabase
- [ ] 46 cours initialisés (vérifier le count)
- [ ] Fonctions SQL créées et testées
- [ ] Formulaire d'inscription testé
- [ ] Liste d'attente testée
- [ ] Alertes vérifiées
- [ ] RLS activé (avant production)
- [ ] Politiques RLS configurées
- [ ] Tests de charge effectués
- [ ] Documentation lue par l'équipe

---

**Date de création** : 2 janvier 2026  
**Version** : 1.0  
**Auteur** : Système automatisé Studio E Danse
