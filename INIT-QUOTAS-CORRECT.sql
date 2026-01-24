-- ============================================
-- Script d'initialisation des quotas Studio E
-- Date: 31 décembre 2025
-- Basé sur les effectifs réels fournis et croisés avec planning-data.ts
-- ============================================

-- Insertion des quotas pour tous les cours
-- Format: (cours_id, cours_nom, effectif_max, quota_en_ligne, ratio_quota)
-- quota_en_ligne = FLOOR(effectif_max * 2/3) par défaut

INSERT INTO public.cours_quotas (cours_id, cours_nom, effectif_max, quota_en_ligne, ratio_quota)
VALUES
  -- ========== LUNDI ==========
  -- lun-1: Classique ADO 1, 17h45-19h15 → "Lundi ado 1 Max 15"
  ('lun-1', 'Classique ADO 1 - Lundi 17h45-19h15', 15, 10, 0.67),
  
  -- lun-2: BAS, 19h15-20h15 → "lundi BAS max 14"
  ('lun-2', 'BAS - Lundi 19h15-20h15', 14, 9, 0.67),
  
  -- lun-3: Classique Adulte Inter, 20h15-21h45 → "lundi classique adultes Inter Max 29"
  ('lun-3', 'Classique Adulte Inter - Lundi 20h15-21h45', 29, 19, 0.67),

  -- ========== MARDI ==========
  -- mar-1: Jazz Danse Etude, 15h45-17h30 → "mardi DE jazz Max 15"
  ('mar-1', 'Jazz Danse Etude - Mardi 15h45-17h30', 15, 10, 0.67),
  
  -- mar-2: Classique ADO 2, 17h45-19h15 → "mardi classique ado 2 Max 15"
  ('mar-2', 'Classique ADO 2 - Mardi 17h45-19h15', 15, 10, 0.67),
  
  -- mar-3: Jazz ADO, 17h45-19h15 → "mardi jazz ado Max 29"
  ('mar-3', 'Jazz ADO - Mardi 17h45-19h15', 29, 19, 0.67),
  
  -- mar-4: BAS, 19h15-20h15 → "mardi barre au sol Max 15"
  ('mar-4', 'BAS - Mardi 19h15-20h15', 15, 10, 0.67),
  
  -- mar-5: Jazz Adulte Debutant, 19h15-20h30 → "mardi jazz adultes débutant Max 29"
  ('mar-5', 'Jazz Adulte Debutant - Mardi 19h15-20h30', 29, 19, 0.67),
  
  -- mar-6: Classique Adulte Inter, 20h15-21h45 → "mardi classique adultes inter max 12"
  ('mar-6', 'Classique Adulte Inter - Mardi 20h15-21h45', 12, 8, 0.67),
  
  -- mar-7: Jazz Adulte Inter, 20h30-21h45 → "mardi jazz adulte inter Max 29"
  ('mar-7', 'Jazz Adulte Inter - Mardi 20h30-21h45', 29, 19, 0.67),

  -- ========== MERCREDI ==========
  -- mer-1: Eveil, 10h15-11h00 → "mercredi Eveil 10h15-11h" (pas de max spécifié, on garde une valeur par défaut)
  ('mer-1', 'Eveil - Mercredi 10h15-11h00', 10, 6, 0.67),
  
  -- mer-2: Initiation, 11h00-12h00 → "mercredi Initiation 11h00-12h00 max 20"
  ('mer-2', 'Initiation - Mercredi 11h00-12h00', 20, 13, 0.67),
  
  -- mer-3: Classique Initiation, 13h30-14h30 → "mercredi Classiq. Init. 13h30-14h30 max 15"
  ('mer-3', 'Classique Initiation - Mercredi 13h30-14h30', 15, 10, 0.67),
  
  -- mer-4: Jazz KID, 14h00-15h15 → "mercredi Jazz Kids 14h00-15h15 max 29"
  ('mer-4', 'Jazz KID - Mercredi 14h00-15h15', 29, 19, 0.67),
  
  -- mer-5: Classique Enfant 1, 14h30-15h30 → "mercredi Classisq. Enfant 1 14h30-15h30 max 15"
  ('mer-5', 'Classique Enfant 1 - Mercredi 14h30-15h30', 15, 10, 0.67),
  
  -- mer-6: Jazz ADO, 15h15-16h45 → "mercredi Jazz Ado. 15h15-16h45 max 29"
  ('mer-6', 'Jazz ADO - Mercredi 15h15-16h45', 29, 19, 0.67),
  
  -- mer-7: Eveil, 15h45-16h30 → (pas de max spécifié dans la liste)
  ('mer-7', 'Eveil - Mercredi 15h45-16h30', 10, 6, 0.67),
  
  -- mer-8: Classique Enfant 2, 16h30-18h00 → "mercredi Classiq. Enfant 2 16h30-18h" (pas de max spécifié)
  ('mer-8', 'Classique Enfant 2 - Mercredi 16h30-18h00', 15, 10, 0.67),
  
  -- mer-9: Jazz Jeune Adulte Inter, 17h00-18h30 → "Jazz Jeun. Adu. Inter 17h00-18h30 max 29"
  ('mer-9', 'Jazz Jeune Adulte Inter - Mercredi 17h00-18h30', 29, 19, 0.67),
  
  -- mer-10: Classique ADO 1, 18h00-19h30 → "classiq ADO 1 18h-19h30" (pas de max spécifié)
  ('mer-10', 'Classique ADO 1 - Mercredi 18h00-19h30', 15, 10, 0.67),
  
  -- mer-11: Jazz Jeune Adulte Avance, 18h30-20h00 → "Jazz jeun. Adu. Avancés 18h30-20h00 max 29"
  ('mer-11', 'Jazz Jeune Adulte Avance - Mercredi 18h30-20h00', 29, 19, 0.67),
  
  -- mer-12: BAS, 20h00-21h00 → "BAS 20h-21h00" (pas de max spécifié)
  ('mer-12', 'BAS - Mercredi 20h00-21h00', 15, 10, 0.67),
  
  -- mer-13: Jazz Adulte Avance, 20h00-21h30 → "Jazz Adu. Avancé 20h00-21h30 max 29"
  ('mer-13', 'Jazz Adulte Avance - Mercredi 20h00-21h30', 29, 19, 0.67),

  -- ========== JEUDI ==========
  -- jeu-1: Jazz KID, 17h30-18h45 → "Jazz Kids 17h30-18h45 max 12"
  ('jeu-1', 'Jazz KID - Jeudi 17h30-18h45', 12, 8, 0.67),
  
  -- jeu-2: Technique KID-ADO, 17h45-19h15 → "Technique Kids - Ado 17h45-19h15 max 29"
  ('jeu-2', 'Technique KID-ADO - Jeudi 17h45-19h15', 29, 19, 0.67),
  
  -- jeu-3: Concours Youth, 19h00-19h45 (cours concours, pas dans la liste des effectifs)
  ('jeu-3', 'Concours Youth - Jeudi 19h00-19h45', 15, 10, 0.67),
  
  -- jeu-4: Classique Adulte Avance, 19h45-21h15 → "Classiq. Adu. Avancé 19h45-21h15 max 29"
  ('jeu-4', 'Classique Adulte Avance - Jeudi 19h45-21h15', 29, 19, 0.67),
  
  -- jeu-5: Concours Jazz Adulte, 20h00-21h00 (cours concours, pas dans la liste des effectifs)
  ('jeu-5', 'Concours Jazz Adulte - Jeudi 20h00-21h00', 15, 10, 0.67),

  -- ========== VENDREDI ==========
  -- ven-1: BAS, 12h30-13h30 → "BAS 12h30-13h30 max 14"
  ('ven-1', 'BAS - Vendredi 12h30-13h30', 14, 9, 0.67),
  
  -- ven-2: Jazz Danse Etude, 15h45-17h30 → "Jazz DE 15h45-17h30 max 15"
  ('ven-2', 'Jazz Danse Etude - Vendredi 15h45-17h30', 15, 10, 0.67),
  
  -- ven-3: Classique ADO 2, 17h45-19h15 → "Classique ado 2 17h45-19h15 max 12"
  ('ven-3', 'Classique ADO 2 - Vendredi 17h45-19h15', 12, 8, 0.67),
  
  -- ven-4: Jazz Jeune Adulte Inter, 17h30-19h00 → "Jazz Jeun. Adu. Inter 17h30-19h00 max 29"
  ('ven-4', 'Jazz Jeune Adulte Inter - Vendredi 17h30-19h00', 29, 19, 0.67),
  
  -- ven-5: Classique Adulte Debutant, 19h15-20h30 → "Classique Adu. Deb 19h15-20h30 max 15"
  ('ven-5', 'Classique Adulte Debutant - Vendredi 19h15-20h30', 15, 10, 0.67),
  
  -- ven-6: Jazz Jeune Adulte Avance, 19h00-20h30 → "Jazz jeun. Adu. Avancés 19h00-20h30 max 29"
  ('ven-6', 'Jazz Jeune Adulte Avance - Vendredi 19h00-20h30', 29, 19, 0.67),
  
  -- ven-7: Contemporain Adulte, 20h30-22h00 → "contempo avancé 20h30-22h max 29"
  ('ven-7', 'Contemporain Adulte - Vendredi 20h30-22h00', 29, 19, 0.67),

  -- ========== SAMEDI ==========
  -- sam-1: Baby danse, 9h30-10h00 → "Baby danse 9h30-10h max 20"
  ('sam-1', 'Baby danse - Samedi 9h30-10h00', 20, 13, 0.67),
  
  -- sam-2: Classique Initiation, 10h00-11h00 → "Classiq. Init 10h00-11h00 max 10"
  ('sam-2', 'Classique Initiation - Samedi 10h00-11h00', 10, 6, 0.67),
  
  -- sam-3: Jazz KID Concours, 10h00-11h00 → "jazz Kid Concours 10h-11h max 12"
  ('sam-3', 'Jazz KID Concours - Samedi 10h00-11h00', 12, 8, 0.67),
  
  -- sam-4: Jazz Initiation, 10h00-11h00 → "JAZZ Init. 10h00-11h00 max 20"
  ('sam-4', 'Jazz Initiation - Samedi 10h00-11h00', 20, 13, 0.67),
  
  -- sam-5: Classique Enfant 1 Enfant 2, 11h00-12h15 → "Classiq. Enfant 1 11h-12h max 10"
  ('sam-5', 'Classique Enfant 1 Enfant 2 - Samedi 11h00-12h15', 10, 6, 0.67),
  
  -- sam-6: Jazz ADO Concours, 11h00-12h00 → "jazz Ado Concours 11h-12h max 12"
  ('sam-6', 'Jazz ADO Concours - Samedi 11h00-12h00', 12, 8, 0.67),
  
  -- sam-7: Eveil, 11h00-11h45 → "Eveil 11h-11h45 max 20"
  ('sam-7', 'Eveil - Samedi 11h00-11h45', 20, 13, 0.67),
  
  -- sam-8: Classique Adulte Debutant, 12h15-13h30 → "Classique Adu. deb 12h00-13h15 max 15"
  ('sam-8', 'Classique Adulte Debutant - Samedi 12h15-13h30', 15, 10, 0.67),
  
  -- sam-9: Jazz Adulte Inter, 12h00-13h30 → "Jazz Adu. Inter 12h00-13h30 max 29"
  ('sam-9', 'Jazz Adulte Inter - Samedi 12h00-13h30', 29, 19, 0.67),
  
  -- sam-10: Classique Adulte Avance, 13h45-15h15 → "Classiq. Adu. Avancé 13h45-15h15 max 29"
  ('sam-10', 'Classique Adulte Avance - Samedi 13h45-15h15', 29, 19, 0.67),
  
  -- sam-11: Contemporain ADO, 15h15-16h45 → "CONTEMPO Ado. 15h15-16h45 max 29"
  ('sam-11', 'Contemporain ADO - Samedi 15h15-16h45', 29, 19, 0.67)

ON CONFLICT (cours_id) DO UPDATE SET
  cours_nom = EXCLUDED.cours_nom,
  effectif_max = EXCLUDED.effectif_max,
  quota_en_ligne = EXCLUDED.quota_en_ligne,
  ratio_quota = EXCLUDED.ratio_quota,
  updated_at = NOW();

-- ============================================
-- Afficher un résumé après l'insertion
-- ============================================

SELECT 
  cours_nom,
  effectif_max,
  quota_en_ligne,
  ROUND(ratio_quota * 100) || '%' as ratio,
  effectif_max - quota_en_ligne as reserve_papier
FROM public.cours_quotas
ORDER BY 
  CASE 
    WHEN cours_nom LIKE '%Lundi%' THEN 1
    WHEN cours_nom LIKE '%Mardi%' THEN 2
    WHEN cours_nom LIKE '%Mercredi%' THEN 3
    WHEN cours_nom LIKE '%Jeudi%' THEN 4
    WHEN cours_nom LIKE '%Vendredi%' THEN 5
    WHEN cours_nom LIKE '%Samedi%' THEN 6
  END,
  cours_nom;

-- ============================================
-- Statistiques globales
-- ============================================

SELECT 
  COUNT(*) as nb_cours_total,
  SUM(effectif_max) as capacite_totale,
  SUM(quota_en_ligne) as places_en_ligne_total,
  SUM(effectif_max - quota_en_ligne) as reserve_papier_total,
  ROUND(AVG(effectif_max), 1) as effectif_moyen,
  ROUND((SUM(quota_en_ligne)::DECIMAL / SUM(effectif_max)) * 100, 1) || '%' as ratio_moyen
FROM public.cours_quotas;
