-- =====================================================
-- SCRIPT DE CRÉATION DE LA TABLE INSCRIPTIONS
-- Studio E - École de danse à Brest
-- Pour Neon Database (PostgreSQL)
-- =====================================================

-- Table pour stocker les pré-inscriptions
CREATE TABLE IF NOT EXISTS inscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informations élève
  student_name TEXT NOT NULL,
  student_gender TEXT,
  student_birth_date DATE NOT NULL,
  student_address TEXT,
  student_postal_code TEXT,
  student_city TEXT,
  student_phone TEXT,
  student_email TEXT,
  
  -- Responsables légaux
  responsable1_name TEXT NOT NULL,
  responsable1_phone TEXT NOT NULL,
  responsable1_email TEXT NOT NULL,
  responsable2_name TEXT,
  responsable2_phone TEXT,
  responsable2_email TEXT,
  
  -- Cours sélectionnés
  selected_courses JSONB NOT NULL,
  
  -- Tarification
  tarif_reduit BOOLEAN DEFAULT FALSE,
  tarif_cours NUMERIC(10,2) NOT NULL,
  adhesion NUMERIC(10,2) NOT NULL,
  licence_ffd NUMERIC(10,2) NOT NULL,
  tarif_total NUMERIC(10,2) NOT NULL,
  
  -- Options
  danse_etudes_option TEXT,
  concours_on_stage BOOLEAN DEFAULT FALSE,
  concours_classes BOOLEAN DEFAULT FALSE,
  
  -- Paiement
  mode_paiement TEXT NOT NULL,
  nombre_versements INTEGER,
  
  -- Règlement et droits
  reglement_accepte BOOLEAN DEFAULT FALSE,
  droit_image TEXT,
  
  -- Statut
  adherent_precedent BOOLEAN DEFAULT FALSE,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'refuse', 'archive'))
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON inscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscriptions_student_name ON inscriptions(student_name);
CREATE INDEX IF NOT EXISTS idx_inscriptions_statut ON inscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON inscriptions(responsable1_email);

COMMENT ON TABLE inscriptions IS 'Table des pré-inscriptions pour la saison 2025-2026';
