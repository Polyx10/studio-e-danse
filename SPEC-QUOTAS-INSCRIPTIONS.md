# 📋 Spécifications Techniques - Système de Quotas et Liste d'Attente

**Date :** 31 décembre 2025  
**Projet :** Studio E Danse  
**Fonctionnalité :** Gestion des quotas d'inscription en ligne avec liste d'attente

---

## 🎯 Objectifs

1. **Limiter les inscriptions en ligne** à 2/3 de l'effectif maximum par défaut
2. **Proposer automatiquement** une liste d'attente quand un cours est complet
3. **Alerter les administrateurs** aux seuils critiques (50%, 75%, 90%)
4. **Fournir des statistiques** pour optimiser la gestion des cours
5. **Permettre une ouverture temporaire** par l'admin en cas de besoin

---

## 📊 Schéma de base de données Supabase

### Table 1 : `cours_quotas`

```sql
CREATE TABLE public.cours_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL UNIQUE,  -- Référence au cours dans planning-data.ts
  cours_nom TEXT NOT NULL,
  effectif_max INTEGER NOT NULL,
  quota_en_ligne INTEGER NOT NULL,  -- Calculé : effectif_max * ratio
  ratio_quota DECIMAL(3,2) DEFAULT 0.67,  -- 0.67 = 2/3, configurable par cours
  inscriptions_en_ligne INTEGER DEFAULT 0,
  inscriptions_papier INTEGER DEFAULT 0,
  ouverture_temporaire BOOLEAN DEFAULT false,
  date_ouverture_temp TIMESTAMPTZ,
  date_expiration_temp TIMESTAMPTZ,
  alerte_50_envoyee BOOLEAN DEFAULT false,
  alerte_75_envoyee BOOLEAN DEFAULT false,
  alerte_90_envoyee BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_cours_quotas_cours_id ON public.cours_quotas(cours_id);
CREATE INDEX idx_cours_quotas_ouverture ON public.cours_quotas(ouverture_temporaire);

-- Trigger pour updated_at
CREATE TRIGGER update_cours_quotas_updated_at
  BEFORE UPDATE ON public.cours_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### Table 2 : `liste_attente`

```sql
CREATE TABLE public.liste_attente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL,
  cours_nom TEXT NOT NULL,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  date_inscription TIMESTAMPTZ DEFAULT NOW(),
  notifie BOOLEAN DEFAULT false,  -- Si la personne a été notifiée d'une place disponible
  date_notification TIMESTAMPTZ,
  statut TEXT DEFAULT 'en_attente',  -- 'en_attente', 'notifie', 'inscrit', 'annule'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_liste_attente_cours_id ON public.liste_attente(cours_id);
CREATE INDEX idx_liste_attente_statut ON public.liste_attente(statut);
CREATE INDEX idx_liste_attente_date ON public.liste_attente(date_inscription);

-- Trigger pour updated_at
CREATE TRIGGER update_liste_attente_updated_at
  BEFORE UPDATE ON public.liste_attente
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### Table 3 : `alertes_quotas`

```sql
CREATE TABLE public.alertes_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL,
  cours_nom TEXT NOT NULL,
  type_alerte TEXT NOT NULL,  -- '50%', '75%', '90%', 'complet', 'ouverture_temp'
  pourcentage INTEGER,
  inscriptions_actuelles INTEGER,
  effectif_max INTEGER,
  message TEXT,
  lue BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_alertes_cours_id ON public.alertes_quotas(cours_id);
CREATE INDEX idx_alertes_lue ON public.alertes_quotas(lue);
CREATE INDEX idx_alertes_date ON public.alertes_quotas(created_at DESC);
```

---

## 🔧 Fonctions SQL

### Fonction 1 : Vérifier la disponibilité d'un cours

```sql
CREATE OR REPLACE FUNCTION public.verifier_disponibilite_cours(p_cours_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_quota RECORD;
  v_disponible BOOLEAN;
  v_places_restantes INTEGER;
  v_result JSON;
BEGIN
  -- Récupérer les infos du quota
  SELECT * INTO v_quota
  FROM cours_quotas
  WHERE cours_id = p_cours_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'disponible', false,
      'raison', 'cours_non_trouve'
    );
  END IF;
  
  -- Calculer les places restantes
  v_places_restantes := v_quota.quota_en_ligne - v_quota.inscriptions_en_ligne;
  
  -- Vérifier la disponibilité
  v_disponible := (v_places_restantes > 0) OR v_quota.ouverture_temporaire;
  
  -- Si ouverture temporaire, vérifier l'expiration
  IF v_quota.ouverture_temporaire AND v_quota.date_expiration_temp IS NOT NULL THEN
    IF v_quota.date_expiration_temp < NOW() THEN
      -- Expiration dépassée, désactiver l'ouverture temporaire
      UPDATE cours_quotas
      SET ouverture_temporaire = false,
          date_expiration_temp = NULL
      WHERE cours_id = p_cours_id;
      
      v_disponible := v_places_restantes > 0;
    END IF;
  END IF;
  
  -- Construire le résultat
  v_result := json_build_object(
    'disponible', v_disponible,
    'places_restantes', v_places_restantes,
    'effectif_max', v_quota.effectif_max,
    'quota_en_ligne', v_quota.quota_en_ligne,
    'inscriptions_en_ligne', v_quota.inscriptions_en_ligne,
    'inscriptions_papier', v_quota.inscriptions_papier,
    'ouverture_temporaire', v_quota.ouverture_temporaire,
    'pourcentage_rempli', ROUND((v_quota.inscriptions_en_ligne::DECIMAL / v_quota.quota_en_ligne) * 100, 1)
  );
  
  RETURN v_result;
END;
$$;
```

### Fonction 2 : Incrémenter le compteur d'inscriptions

```sql
CREATE OR REPLACE FUNCTION public.incrementer_inscription(
  p_cours_id TEXT,
  p_type TEXT DEFAULT 'en_ligne'  -- 'en_ligne' ou 'papier'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_quota RECORD;
  v_nouveau_total INTEGER;
  v_pourcentage DECIMAL;
  v_alerte_type TEXT;
BEGIN
  -- Récupérer le quota actuel
  SELECT * INTO v_quota
  FROM cours_quotas
  WHERE cours_id = p_cours_id
  FOR UPDATE;  -- Lock pour éviter les race conditions
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'erreur', 'cours_non_trouve');
  END IF;
  
  -- Incrémenter selon le type
  IF p_type = 'en_ligne' THEN
    UPDATE cours_quotas
    SET inscriptions_en_ligne = inscriptions_en_ligne + 1,
        updated_at = NOW()
    WHERE cours_id = p_cours_id;
    
    v_nouveau_total := v_quota.inscriptions_en_ligne + 1;
  ELSE
    UPDATE cours_quotas
    SET inscriptions_papier = inscriptions_papier + 1,
        updated_at = NOW()
    WHERE cours_id = p_cours_id;
    
    v_nouveau_total := v_quota.inscriptions_papier + 1;
  END IF;
  
  -- Calculer le pourcentage (pour les inscriptions en ligne)
  IF p_type = 'en_ligne' THEN
    v_pourcentage := (v_nouveau_total::DECIMAL / v_quota.quota_en_ligne) * 100;
    
    -- Générer des alertes si seuils atteints
    IF v_pourcentage >= 50 AND NOT v_quota.alerte_50_envoyee THEN
      INSERT INTO alertes_quotas (cours_id, cours_nom, type_alerte, pourcentage, inscriptions_actuelles, effectif_max, message)
      VALUES (p_cours_id, v_quota.cours_nom, '50%', 50, v_nouveau_total, v_quota.effectif_max, 
              'Le cours "' || v_quota.cours_nom || '" a atteint 50% de son quota en ligne.');
      
      UPDATE cours_quotas SET alerte_50_envoyee = true WHERE cours_id = p_cours_id;
    END IF;
    
    IF v_pourcentage >= 75 AND NOT v_quota.alerte_75_envoyee THEN
      INSERT INTO alertes_quotas (cours_id, cours_nom, type_alerte, pourcentage, inscriptions_actuelles, effectif_max, message)
      VALUES (p_cours_id, v_quota.cours_nom, '75%', 75, v_nouveau_total, v_quota.effectif_max,
              'Le cours "' || v_quota.cours_nom || '" a atteint 75% de son quota en ligne.');
      
      UPDATE cours_quotas SET alerte_75_envoyee = true WHERE cours_id = p_cours_id;
    END IF;
    
    IF v_pourcentage >= 90 AND NOT v_quota.alerte_90_envoyee THEN
      INSERT INTO alertes_quotas (cours_id, cours_nom, type_alerte, pourcentage, inscriptions_actuelles, effectif_max, message)
      VALUES (p_cours_id, v_quota.cours_nom, '90%', 90, v_nouveau_total, v_quota.effectif_max,
              'Le cours "' || v_quota.cours_nom || '" a atteint 90% de son quota en ligne.');
      
      UPDATE cours_quotas SET alerte_90_envoyee = true WHERE cours_id = p_cours_id;
    END IF;
    
    IF v_pourcentage >= 100 THEN
      INSERT INTO alertes_quotas (cours_id, cours_nom, type_alerte, pourcentage, inscriptions_actuelles, effectif_max, message)
      VALUES (p_cours_id, v_quota.cours_nom, 'complet', 100, v_nouveau_total, v_quota.effectif_max,
              'Le cours "' || v_quota.cours_nom || '" est maintenant complet en ligne.');
    END IF;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'nouveau_total', v_nouveau_total,
    'pourcentage', v_pourcentage
  );
END;
$$;
```

### Fonction 3 : Ajouter à la liste d'attente

```sql
CREATE OR REPLACE FUNCTION public.ajouter_liste_attente(
  p_cours_id TEXT,
  p_cours_nom TEXT,
  p_nom_complet TEXT,
  p_email TEXT,
  p_telephone TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id UUID;
  v_position INTEGER;
BEGIN
  -- Insérer dans la liste d'attente
  INSERT INTO liste_attente (cours_id, cours_nom, nom_complet, email, telephone)
  VALUES (p_cours_id, p_cours_nom, p_nom_complet, p_email, p_telephone)
  RETURNING id INTO v_id;
  
  -- Calculer la position dans la file
  SELECT COUNT(*) INTO v_position
  FROM liste_attente
  WHERE cours_id = p_cours_id
    AND statut = 'en_attente'
    AND date_inscription <= NOW();
  
  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'position', v_position,
    'message', 'Vous êtes inscrit(e) sur la liste d''attente à la position ' || v_position
  );
END;
$$;
```

---

## 🎨 Interface utilisateur - Formulaire d'inscription

### Modifications à apporter

#### 1. Vérification de disponibilité au chargement
```typescript
// Dans le composant de sélection des cours
const [coursDisponibilites, setCoursDisponibilites] = useState<Record<string, any>>({});

useEffect(() => {
  // Charger les disponibilités pour tous les cours
  const chargerDisponibilites = async () => {
    const disponibilites: Record<string, any> = {};
    
    for (const cours of planningCours) {
      const { data } = await supabase.rpc('verifier_disponibilite_cours', {
        p_cours_id: cours.id
      });
      disponibilites[cours.id] = data;
    }
    
    setCoursDisponibilites(disponibilites);
  };
  
  chargerDisponibilites();
}, []);
```

#### 2. Affichage des cours avec badges
```tsx
{planningCours.map((cours) => {
  const dispo = coursDisponibilites[cours.id];
  const estComplet = dispo && !dispo.disponible;
  const placesRestantes = dispo?.places_restantes || 0;
  
  return (
    <div 
      key={cours.id}
      className={`p-4 border rounded-lg ${
        estComplet ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:border-[#F9CA24]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{cours.nom}</h4>
          <p className="text-sm text-gray-600">{cours.jour} - {cours.horaire}</p>
        </div>
        
        {estComplet ? (
          <Badge variant="destructive">Complet en ligne</Badge>
        ) : placesRestantes <= 3 ? (
          <Badge variant="warning">Plus que {placesRestantes} places</Badge>
        ) : (
          <Badge variant="success">Disponible</Badge>
        )}
      </div>
      
      {estComplet && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Ce cours est complet en ligne.</strong>
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCoursListeAttente(cours)}
            className="w-full"
          >
            S'inscrire sur la liste d'attente
          </Button>
        </div>
      )}
    </div>
  );
})}
```

#### 3. Modal de liste d'attente
```tsx
{coursListeAttente && (
  <Dialog open={!!coursListeAttente} onOpenChange={() => setCoursListeAttente(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Liste d'attente - {coursListeAttente.nom}</DialogTitle>
        <DialogDescription>
          Ce cours est actuellement complet en ligne. Inscrivez-vous sur la liste d'attente
          et nous vous contacterons dès qu'une place se libère.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleListeAttenteSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nom">Nom complet *</Label>
          <Input id="nom" required />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" required />
        </div>
        
        <div>
          <Label htmlFor="tel">Téléphone *</Label>
          <Input id="tel" type="tel" required />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm text-gray-700">
            <strong>ℹ️ Information :</strong> Vous pouvez également contacter directement
            le secrétariat pour vérifier la disponibilité en temps réel.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            📞 06 98 27 30 98<br />
            📧 studioedanse@gmail.com
          </p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setCoursListeAttente(null)}>
            Annuler
          </Button>
          <Button type="submit" className="bg-[#F9CA24] text-[#2D3436]">
            M'inscrire sur la liste d'attente
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)}
```

---

## 👨‍💼 Interface administrateur

### Page `/admin/quotas`

#### Tableau de bord principal
```tsx
<div className="space-y-6">
  {/* Statistiques globales */}
  <div className="grid md:grid-cols-4 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Cours complets</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-[#F9CA24]">{coursComplets}</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Liste d'attente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-blue-600">{totalListeAttente}</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Alertes non lues</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-red-600">{alertesNonLues}</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Taux de remplissage</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-green-600">{tauxMoyen}%</p>
      </CardContent>
    </Card>
  </div>
  
  {/* Liste des cours */}
  <Card>
    <CardHeader>
      <CardTitle>Gestion des quotas par cours</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cours</TableHead>
            <TableHead>En ligne</TableHead>
            <TableHead>Papier</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Quota</TableHead>
            <TableHead>%</TableHead>
            <TableHead>Liste attente</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotas.map((quota) => (
            <TableRow key={quota.cours_id}>
              <TableCell className="font-medium">{quota.cours_nom}</TableCell>
              <TableCell>{quota.inscriptions_en_ligne}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={quota.inscriptions_papier}
                  onChange={(e) => updateInscriptionsPapier(quota.cours_id, e.target.value)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                {quota.inscriptions_en_ligne + quota.inscriptions_papier} / {quota.effectif_max}
              </TableCell>
              <TableCell>{quota.quota_en_ligne}</TableCell>
              <TableCell>
                <Badge variant={
                  quota.pourcentage >= 90 ? 'destructive' :
                  quota.pourcentage >= 75 ? 'warning' :
                  'default'
                }>
                  {quota.pourcentage}%
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() => voirListeAttente(quota.cours_id)}
                >
                  {quota.nb_liste_attente || 0}
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">⋮</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => ouvrirTemporairement(quota.cours_id)}>
                      Ouvrir temporairement
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => modifierQuota(quota.cours_id)}>
                      Modifier le quota
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => voirStatistiques(quota.cours_id)}>
                      Voir statistiques
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  
  {/* Alertes récentes */}
  <Card>
    <CardHeader>
      <CardTitle>Alertes récentes</CardTitle>
    </CardHeader>
    <CardContent>
      {alertes.map((alerte) => (
        <div key={alerte.id} className="flex items-center justify-between p-3 border-b last:border-0">
          <div>
            <p className="font-medium">{alerte.cours_nom}</p>
            <p className="text-sm text-gray-600">{alerte.message}</p>
            <p className="text-xs text-gray-400">{formatDate(alerte.created_at)}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => marquerCommeLue(alerte.id)}
          >
            Marquer comme lue
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>
</div>
```

---

## 📧 Notifications et alertes

### Email aux administrateurs (seuils 50%, 75%, 90%)
```
Objet: [Studio E] Alerte quota - [Nom du cours] à [XX]%

Bonjour,

Le cours "[Nom du cours]" a atteint [XX]% de son quota d'inscription en ligne.

Détails :
- Inscriptions en ligne : X / Y
- Inscriptions papier : Z
- Total : X+Z / Effectif max
- Places restantes en ligne : Y-X

Actions recommandées :
- Vérifier la liste d'attente
- Ajuster le quota si nécessaire
- Ouvrir temporairement si besoin

Voir le tableau de bord : [lien]

Studio E - Système de gestion
```

### Email de confirmation liste d'attente
```
Objet: [Studio E] Inscription sur liste d'attente - [Nom du cours]

Bonjour [Nom],

Votre inscription sur la liste d'attente pour le cours "[Nom du cours]" a bien été enregistrée.

Votre position : [X]

Nous vous contacterons dès qu'une place se libère.

En attendant, vous pouvez contacter le secrétariat pour plus d'informations :
📞 06 98 27 30 98
📧 studioedanse@gmail.com

À bientôt,
L'équipe Studio E
```

---

## 📊 Statistiques et exports

### Requêtes SQL pour les statistiques

```sql
-- Vue d'ensemble des quotas
CREATE OR REPLACE VIEW v_statistiques_quotas AS
SELECT 
  cq.cours_nom,
  cq.effectif_max,
  cq.quota_en_ligne,
  cq.inscriptions_en_ligne,
  cq.inscriptions_papier,
  cq.inscriptions_en_ligne + cq.inscriptions_papier as total_inscriptions,
  ROUND((cq.inscriptions_en_ligne::DECIMAL / cq.quota_en_ligne) * 100, 1) as taux_remplissage_en_ligne,
  ROUND(((cq.inscriptions_en_ligne + cq.inscriptions_papier)::DECIMAL / cq.effectif_max) * 100, 1) as taux_remplissage_total,
  COUNT(la.id) as nb_liste_attente
FROM cours_quotas cq
LEFT JOIN liste_attente la ON la.cours_id = cq.cours_id AND la.statut = 'en_attente'
GROUP BY cq.cours_id, cq.cours_nom, cq.effectif_max, cq.quota_en_ligne, cq.inscriptions_en_ligne, cq.inscriptions_papier;

-- Export CSV des inscriptions par cours
SELECT 
  cours_nom,
  inscriptions_en_ligne,
  inscriptions_papier,
  inscriptions_en_ligne + inscriptions_papier as total,
  effectif_max,
  quota_en_ligne,
  ROUND(((inscriptions_en_ligne + inscriptions_papier)::DECIMAL / effectif_max) * 100, 1) as pourcentage_rempli
FROM cours_quotas
ORDER BY pourcentage_rempli DESC;
```

---

## 🚀 Plan d'implémentation

### Phase 1 : Base de données (1-2h)
- [ ] Créer les 3 tables (cours_quotas, liste_attente, alertes_quotas)
- [ ] Créer les fonctions SQL
- [ ] Initialiser les quotas pour tous les cours existants
- [ ] Tester les fonctions

### Phase 2 : API Routes (2-3h)
- [ ] `/api/quotas/verifier` - Vérifier disponibilité
- [ ] `/api/quotas/incrementer` - Incrémenter compteur
- [ ] `/api/liste-attente/ajouter` - Ajouter à la liste
- [ ] `/api/admin/quotas` - CRUD quotas
- [ ] `/api/admin/alertes` - Gérer alertes

### Phase 3 : Frontend formulaire (3-4h)
- [ ] Intégrer vérification des quotas
- [ ] Afficher badges de disponibilité
- [ ] Créer modal liste d'attente
- [ ] Gérer soumission liste d'attente
- [ ] Tester le parcours utilisateur

### Phase 4 : Interface admin (4-5h)
- [ ] Créer page `/admin/quotas`
- [ ] Tableau de bord avec statistiques
- [ ] Gestion des quotas par cours
- [ ] Visualisation liste d'attente
- [ ] Ouverture temporaire
- [ ] Système d'alertes

### Phase 5 : Notifications (2-3h)
- [ ] Configurer emails administrateurs
- [ ] Email confirmation liste d'attente
- [ ] Email notification place disponible
- [ ] Tester les envois

### Phase 6 : Tests et optimisation (2-3h)
- [ ] Tests de charge (inscriptions simultanées)
- [ ] Tests des race conditions
- [ ] Optimisation des requêtes
- [ ] Documentation utilisateur

**Durée totale estimée : 14-20 heures**

---

## ⚙️ Configuration initiale

### Script d'initialisation des quotas

```sql
-- Exemple d'initialisation pour quelques cours
-- À adapter selon vos effectifs réels

INSERT INTO cours_quotas (cours_id, cours_nom, effectif_max, quota_en_ligne, ratio_quota)
VALUES
  ('eveil-mercredi-10h', 'Éveil - Mercredi 10h', 15, 10, 0.67),
  ('initiation-mercredi-11h', 'Initiation - Mercredi 11h', 15, 10, 0.67),
  ('classique-debutant-mercredi-14h', 'Classique Débutant - Mercredi 14h', 20, 13, 0.67),
  -- ... autres cours
ON CONFLICT (cours_id) DO NOTHING;
```

---

## 📝 Notes importantes

1. **Race conditions** : Les fonctions utilisent `FOR UPDATE` pour éviter les problèmes d'inscriptions simultanées
2. **Expiration temporaire** : Vérifiée automatiquement à chaque appel de `verifier_disponibilite_cours`
3. **Alertes** : Envoyées une seule fois par seuil grâce aux flags `alerte_XX_envoyee`
4. **Liste d'attente** : Position calculée dynamiquement selon la date d'inscription
5. **Sécurité** : Toutes les fonctions utilisent `SECURITY DEFINER` avec `search_path` fixe

---

**Document créé le :** 31 décembre 2025  
**Prêt pour implémentation**
