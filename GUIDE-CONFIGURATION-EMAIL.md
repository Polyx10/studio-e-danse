# 📧 Guide de configuration des emails

## 🎯 Objectif

Configurer l'envoi automatique d'emails de confirmation après inscription et pour la liste d'attente.

---

## 📦 Ce qui a été implémenté

### 1. **Email de confirmation d'inscription**

Envoyé automatiquement après chaque inscription validée, contenant :
- ✅ Récapitulatif complet de l'inscription
- ✅ Liste des cours sélectionnés avec horaires
- ✅ Détail de la tarification (cours, adhésion, licence FFD)
- ✅ **Rappel important** : passer à l'école pour finaliser
- ✅ Coordonnées de contact du studio
- ✅ Design professionnel aux couleurs du studio

### 2. **Email de liste d'attente**

Envoyé automatiquement lors de l'inscription sur liste d'attente :
- ✅ Confirmation de l'inscription
- ✅ Position dans la file d'attente
- ✅ Informations de contact
- ✅ Design cohérent avec l'email de confirmation

---

## 🚀 Configuration Resend

### Étape 1 : Créer un compte Resend

1. Aller sur **https://resend.com**
2. Créer un compte gratuit
3. Vérifier votre email

### Étape 2 : Obtenir la clé API

1. Se connecter à Resend Dashboard
2. Aller dans **API Keys**
3. Cliquer sur **Create API Key**
4. Donner un nom : `Studio E Danse - Production`
5. Copier la clé API (elle commence par `re_`)

### Étape 3 : Configurer le domaine (optionnel mais recommandé)

Pour envoyer depuis `noreply@studioedanse.fr` au lieu de `onboarding@resend.dev` :

1. Dans Resend Dashboard, aller dans **Domains**
2. Cliquer sur **Add Domain**
3. Entrer votre domaine : `studioedanse.fr`
4. Suivre les instructions pour ajouter les enregistrements DNS :
   - **SPF** : Ajouter un enregistrement TXT
   - **DKIM** : Ajouter un enregistrement TXT
   - **DMARC** : Ajouter un enregistrement TXT

**Note** : Sans domaine vérifié, les emails seront envoyés depuis `onboarding@resend.dev` mais fonctionneront quand même.

### Étape 4 : Ajouter la clé API au projet

Modifier le fichier `.env` :

```bash
RESEND_API_KEY=re_votre_cle_api_ici
```

### Étape 5 : Redémarrer le serveur

```bash
npm run dev
```

---

## 🧪 Tester l'envoi d'emails

### Test 1 : Email de confirmation d'inscription

1. Aller sur http://localhost:3001/inscription
2. Remplir le formulaire complet
3. Utiliser une **vraie adresse email** pour le responsable légal
4. Valider l'inscription
5. Vérifier la réception de l'email

**Vérifications** :
- ✅ Email reçu dans les 30 secondes
- ✅ Récapitulatif correct des cours
- ✅ Tarifs corrects
- ✅ Rappel de passer à l'école présent
- ✅ Design professionnel

### Test 2 : Email de liste d'attente

1. Simuler un cours complet dans Supabase :
```sql
UPDATE cours_quotas 
SET inscriptions_en_ligne = quota_en_ligne 
WHERE cours_id = 'lun-1';
```

2. Aller sur http://localhost:3001/inscription
3. Essayer de sélectionner le cours complet
4. Cliquer sur "S'inscrire sur la liste d'attente"
5. Remplir le formulaire avec une **vraie adresse email**
6. Valider
7. Vérifier la réception de l'email

**Vérifications** :
- ✅ Email reçu
- ✅ Position dans la file affichée
- ✅ Nom du cours correct

---

## 📊 Limites du plan gratuit Resend

| Fonctionnalité | Plan Gratuit | Plan Pro |
|----------------|--------------|----------|
| Emails/mois | 3 000 | 50 000 |
| Emails/jour | 100 | Illimité |
| Domaines | 1 | Illimité |
| Support | Email | Prioritaire |
| Prix | 0 € | 20 $/mois |

**Pour Studio E Danse** : Le plan gratuit devrait suffire largement (3000 emails/mois = ~100 inscriptions/mois).

---

## 🎨 Personnalisation des emails

Les templates d'email sont dans `src/lib/email.ts`.

### Modifier le contenu

```typescript
// src/lib/email.ts

// Modifier le message d'introduction
<p style="...">
  Nous avons bien reçu la <strong>pré-inscription en ligne</strong>...
</p>

// Modifier les coordonnées
<p style="...">
  <strong>📧 Email :</strong> votre-email@exemple.com
</p>
```

### Modifier les couleurs

```typescript
// Couleur principale (actuellement #2D3436 - gris foncé)
style="background-color: #2D3436;"

// Couleur accent (actuellement #F9CA24 - jaune)
style="color: #F9CA24;"
```

### Ajouter des sections

Ajouter du HTML dans la variable `htmlContent` :

```typescript
<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
  <h3>Nouvelle section</h3>
  <p>Contenu de la nouvelle section...</p>
</div>
```

---

## 🔧 Dépannage

### Problème : Les emails ne sont pas envoyés

**Vérifications** :
1. La clé API Resend est-elle correcte dans `.env` ?
2. Le serveur a-t-il été redémarré après modification de `.env` ?
3. Vérifier les logs de la console :
```bash
# Dans le terminal où tourne npm run dev
# Chercher : "Email de confirmation envoyé"
```

### Problème : Les emails arrivent en spam

**Solutions** :
1. Configurer un domaine vérifié dans Resend
2. Ajouter les enregistrements SPF, DKIM, DMARC
3. Demander aux utilisateurs d'ajouter `noreply@studioedanse.fr` à leurs contacts

### Problème : Erreur "Invalid API key"

**Solution** :
1. Vérifier que la clé commence par `re_`
2. Régénérer une nouvelle clé dans Resend Dashboard
3. Mettre à jour `.env`
4. Redémarrer le serveur

### Problème : Les emails sont envoyés mais vides

**Solution** :
1. Vérifier que les données sont bien passées à la fonction
2. Vérifier les logs dans la console
3. Tester avec des données statiques d'abord

---

## 📝 Structure des fichiers

```
src/
├── lib/
│   └── email.ts                                    # Templates et fonctions d'envoi
├── app/
│   └── api/
│       ├── submit-inscription/route.ts             # Envoi email après inscription
│       ├── liste-attente/ajouter/route.ts          # Envoi email liste attente
│       ├── send-confirmation-email/route.ts        # API dédiée confirmation
│       └── send-waitlist-email/route.ts            # API dédiée liste attente
```

---

## 🎯 Prochaines améliorations possibles

1. **Email de rappel** : Envoyer un rappel 24h après la pré-inscription si pas finalisée
2. **Email admin** : Notifier les admins à chaque nouvelle inscription
3. **Email de bienvenue** : Après finalisation de l'inscription au secrétariat
4. **Email de relance liste d'attente** : Quand une place se libère
5. **Newsletter** : Informations sur les événements, spectacles, etc.

---

## ✅ Checklist de déploiement

- [ ] Compte Resend créé
- [ ] Clé API générée
- [ ] Clé API ajoutée dans `.env`
- [ ] Domaine configuré (optionnel)
- [ ] DNS configurés (si domaine)
- [ ] Tests d'envoi réussis
- [ ] Emails reçus correctement
- [ ] Emails non en spam
- [ ] Design validé
- [ ] Contenu validé
- [ ] Coordonnées à jour

---

**Date de création** : 8 janvier 2026  
**Version** : 1.0  
**Service utilisé** : Resend (https://resend.com)
