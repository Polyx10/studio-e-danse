-- ============================================
-- SETUP COMPLET SYSTÈME DE QUOTAS - STUDIO E
-- Date: 31 décembre 2025
-- ============================================
-- Ce script doit être exécuté dans le SQL Editor de Supabase
-- Il crée les tables, fonctions et initialise les données

-- ============================================
-- PARTIE 1: CRÉATION DES TABLES
-- ============================================

-- Table 1: cours_quotas
CREATE TABLE IF NOT EXISTS public.cours_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL UNIQUE,
  cours_nom TEXT NOT NULL,
  effectif_max INTEGER NOT NULL,
  quota_en_ligne INTEGER NOT NULL,
  ratio_quota DECIMAL(3,2) DEFAULT 0.67,
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

-- Index pour cours_quotas
CREATE INDEX IF NOT EXISTS idx_cours_quotas_cours_id ON public.cours_quotas(cours_id);
CREATE INDEX IF NOT EXISTS idx_cours_quotas_ouverture ON public.cours_quotas(ouverture_temporaire);

-- Table 2: liste_attente
CREATE TABLE IF NOT EXISTS public.liste_attente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL,
  cours_nom TEXT NOT NULL,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  date_inscription TIMESTAMPTZ DEFAULT NOW(),
  notifie BOOLEAN DEFAULT false,
  date_notification TIMESTAMPTZ,
  statut TEXT DEFAULT 'en_attente',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour liste_attente
CREATE INDEX IF NOT EXISTS idx_liste_attente_cours_id ON public.liste_attente(cours_id);
CREATE INDEX IF NOT EXISTS idx_liste_attente_statut ON public.liste_attente(statut);
CREATE INDEX IF NOT EXISTS idx_liste_attente_date ON public.liste_attente(date_inscription);

-- Table 3: alertes_quotas
CREATE TABLE IF NOT EXISTS public.alertes_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cours_id TEXT NOT NULL,
  cours_nom TEXT NOT NULL,
  type_alerte TEXT NOT NULL,
  pourcentage INTEGER,
  inscriptions_actuelles INTEGER,
  effectif_max INTEGER,
  message TEXT,
  lue BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour alertes_quotas
CREATE INDEX IF NOT EXISTS idx_alertes_cours_id ON public.alertes_quotas(cours_id);
CREATE INDEX IF NOT EXISTS idx_alertes_lue ON public.alertes_quotas(lue);
CREATE INDEX IF NOT EXISTS idx_alertes_date ON public.alertes_quotas(created_at DESC);

-- ============================================
-- PARTIE 2: TRIGGERS POUR updated_at
-- ============================================

-- Trigger pour cours_quotas
DROP TRIGGER IF EXISTS update_cours_quotas_updated_at ON public.cours_quotas;
CREATE TRIGGER update_cours_quotas_updated_at
  BEFORE UPDATE ON public.cours_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour liste_attente
DROP TRIGGER IF EXISTS update_liste_attente_updated_at ON public.liste_attente;
CREATE TRIGGER update_liste_attente_updated_at
  BEFORE UPDATE ON public.liste_attente
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PARTIE 3: FONCTIONS SQL
-- ============================================

-- Fonction 1: Vérifier la disponibilité d'un cours
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
  SELECT * INTO v_quota
  FROM cours_quotas
  WHERE cours_id = p_cours_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'disponible', false,
      'raison', 'cours_non_trouve'
    );
  END IF;
  
  v_places_restantes := v_quota.quota_en_ligne - v_quota.inscriptions_en_ligne;
  v_disponible := (v_places_restantes > 0) OR v_quota.ouverture_temporaire;
  
  IF v_quota.ouverture_temporaire AND v_quota.date_expiration_temp IS NOT NULL THEN
    IF v_quota.date_expiration_temp < NOW() THEN
      UPDATE cours_quotas
      SET ouverture_temporaire = false,
          date_expiration_temp = NULL
      WHERE cours_id = p_cours_id;
      
      v_disponible := v_places_restantes > 0;
    END IF;
  END IF;
  
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

-- Fonction 2: Incrémenter le compteur d'inscriptions
CREATE OR REPLACE FUNCTION public.incrementer_inscription(
  p_cours_id TEXT,
  p_type TEXT DEFAULT 'en_ligne'
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
BEGIN
  SELECT * INTO v_quota
  FROM cours_quotas
  WHERE cours_id = p_cours_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'erreur', 'cours_non_trouve');
  END IF;
  
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
  
  IF p_type = 'en_ligne' THEN
    v_pourcentage := (v_nouveau_total::DECIMAL / v_quota.quota_en_ligne) * 100;
    
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

-- Fonction 3: Ajouter à la liste d'attente
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
  INSERT INTO liste_attente (cours_id, cours_nom, nom_complet, email, telephone)
  VALUES (p_cours_id, p_cours_nom, p_nom_complet, p_email, p_telephone)
  RETURNING id INTO v_id;
  
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

-- ============================================
-- PARTIE 4: INITIALISATION DES QUOTAS
-- ============================================

INSERT INTO public.cours_quotas (cours_id, cours_nom, effectif_max, quota_en_ligne, ratio_quota)
VALUES
  -- LUNDI
  ('lun-1', 'Classique ADO 1 - Lundi 17h45-19h15', 15, 10, 0.67),
  ('lun-2', 'BAS - Lundi 19h15-20h15', 14, 9, 0.67),
  ('lun-3', 'Classique Adulte Inter - Lundi 20h15-21h45', 29, 19, 0.67),

  -- MARDI
  ('mar-1', 'Jazz Danse Etude - Mardi 15h45-17h30', 15, 10, 0.67),
  ('mar-2', 'Classique ADO 2 - Mardi 17h45-19h15', 15, 10, 0.67),
  ('mar-3', 'Jazz ADO - Mardi 17h45-19h15', 29, 19, 0.67),
  ('mar-4', 'BAS - Mardi 19h15-20h15', 15, 10, 0.67),
  ('mar-5', 'Jazz Adulte Debutant - Mardi 19h15-20h30', 29, 19, 0.67),
  ('mar-6', 'Classique Adulte Inter - Mardi 20h15-21h45', 12, 8, 0.67),
  ('mar-7', 'Jazz Adulte Inter - Mardi 20h30-21h45', 29, 19, 0.67),

  -- MERCREDI
  ('mer-1', 'Eveil - Mercredi 10h15-11h00', 10, 6, 0.67),
  ('mer-2', 'Initiation - Mercredi 11h00-12h00', 20, 13, 0.67),
  ('mer-3', 'Classique Initiation - Mercredi 13h30-14h30', 15, 10, 0.67),
  ('mer-4', 'Jazz KID - Mercredi 14h00-15h15', 29, 19, 0.67),
  ('mer-5', 'Classique Enfant 1 - Mercredi 14h30-15h30', 15, 10, 0.67),
  ('mer-6', 'Jazz ADO - Mercredi 15h15-16h45', 29, 19, 0.67),
  ('mer-7', 'Eveil - Mercredi 15h45-16h30', 10, 6, 0.67),
  ('mer-8', 'Classique Enfant 2 - Mercredi 16h30-18h00', 15, 10, 0.67),
  ('mer-9', 'Jazz Jeune Adulte Inter - Mercredi 17h00-18h30', 29, 19, 0.67),
  ('mer-10', 'Classique ADO 1 - Mercredi 18h00-19h30', 15, 10, 0.67),
  ('mer-11', 'Jazz Jeune Adulte Avance - Mercredi 18h30-20h00', 29, 19, 0.67),
  ('mer-12', 'BAS - Mercredi 20h00-21h00', 15, 10, 0.67),
  ('mer-13', 'Jazz Adulte Avance - Mercredi 20h00-21h30', 29, 19, 0.67),

  -- JEUDI
  ('jeu-1', 'Jazz KID - Jeudi 17h30-18h45', 12, 8, 0.67),
  ('jeu-2', 'Technique KID-ADO - Jeudi 17h45-19h15', 29, 19, 0.67),
  ('jeu-3', 'Concours Youth - Jeudi 19h00-19h45', 15, 10, 0.67),
  ('jeu-4', 'Classique Adulte Avance - Jeudi 19h45-21h15', 29, 19, 0.67),
  ('jeu-5', 'Concours Jazz Adulte - Jeudi 20h00-21h00', 15, 10, 0.67),

  -- VENDREDI
  ('ven-1', 'BAS - Vendredi 12h30-13h30', 14, 9, 0.67),
  ('ven-2', 'Jazz Danse Etude - Vendredi 15h45-17h30', 15, 10, 0.67),
  ('ven-3', 'Classique ADO 2 - Vendredi 17h45-19h15', 12, 8, 0.67),
  ('ven-4', 'Jazz Jeune Adulte Inter - Vendredi 17h30-19h00', 29, 19, 0.67),
  ('ven-5', 'Classique Adulte Debutant - Vendredi 19h15-20h30', 15, 10, 0.67),
  ('ven-6', 'Jazz Jeune Adulte Avance - Vendredi 19h00-20h30', 29, 19, 0.67),
  ('ven-7', 'Contemporain Adulte - Vendredi 20h30-22h00', 29, 19, 0.67),

  -- SAMEDI
  ('sam-1', 'Baby danse - Samedi 9h30-10h00', 20, 13, 0.67),
  ('sam-2', 'Classique Initiation - Samedi 10h00-11h00', 10, 6, 0.67),
  ('sam-3', 'Jazz KID Concours - Samedi 10h00-11h00', 12, 8, 0.67),
  ('sam-4', 'Jazz Initiation - Samedi 10h00-11h00', 20, 13, 0.67),
  ('sam-5', 'Classique Enfant 1 Enfant 2 - Samedi 11h00-12h15', 10, 6, 0.67),
  ('sam-6', 'Jazz ADO Concours - Samedi 11h00-12h00', 12, 8, 0.67),
  ('sam-7', 'Eveil - Samedi 11h00-11h45', 20, 13, 0.67),
  ('sam-8', 'Classique Adulte Debutant - Samedi 12h15-13h30', 15, 10, 0.67),
  ('sam-9', 'Jazz Adulte Inter - Samedi 12h00-13h30', 29, 19, 0.67),
  ('sam-10', 'Classique Adulte Avance - Samedi 13h45-15h15', 29, 19, 0.67),
  ('sam-11', 'Contemporain ADO - Samedi 15h15-16h45', 29, 19, 0.67)

ON CONFLICT (cours_id) DO UPDATE SET
  cours_nom = EXCLUDED.cours_nom,
  effectif_max = EXCLUDED.effectif_max,
  quota_en_ligne = EXCLUDED.quota_en_ligne,
  ratio_quota = EXCLUDED.ratio_quota,
  updated_at = NOW();

-- ============================================
-- PARTIE 5: VÉRIFICATION
-- ============================================

-- Afficher un résumé
SELECT 
  COUNT(*) as nb_cours_total,
  SUM(effectif_max) as capacite_totale,
  SUM(quota_en_ligne) as places_en_ligne_total,
  SUM(effectif_max - quota_en_ligne) as reserve_papier_total,
  ROUND(AVG(effectif_max), 1) as effectif_moyen
FROM public.cours_quotas;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Setup complet terminé !';
  RAISE NOTICE '📊 Tables créées : cours_quotas, liste_attente, alertes_quotas';
  RAISE NOTICE '⚙️ Fonctions créées : verifier_disponibilite_cours, incrementer_inscription, ajouter_liste_attente';
  RAISE NOTICE '📝 46 cours initialisés avec leurs quotas';
END $$;
