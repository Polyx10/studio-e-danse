-- Table pour stocker les inscriptions
CREATE TABLE inscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Statut de l'inscription
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'enregistre', 'valide')),
  
  -- Informations élève
  adherent_precedent BOOLEAN DEFAULT false,
  student_name TEXT NOT NULL,
  student_last_name TEXT,
  student_first_name TEXT,
  student_gender TEXT NOT NULL,
  student_birth_date TEXT NOT NULL,
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
  responsable2_address TEXT,
  responsable2_postal_code TEXT,
  responsable2_city TEXT,
  responsable2_phone TEXT,
  responsable2_email TEXT,
  
  -- Cours et options
  selected_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  tarif_reduit BOOLEAN DEFAULT false,
  danse_etudes_option TEXT DEFAULT '0',
  concours_on_stage BOOLEAN DEFAULT false,
  concours_classes BOOLEAN DEFAULT false,
  
  -- Options spectacle
  participation_spectacle TEXT DEFAULT 'oui',
  nombre_costumes TEXT DEFAULT '1',
  droit_image TEXT DEFAULT 'autorise',
  
  -- Paiement
  type_cours TEXT DEFAULT 'loisirs',
  mode_paiement TEXT,
  nombre_versements TEXT DEFAULT '1',
  
  -- Validation
  accept_rules BOOLEAN DEFAULT false,
  signature_name TEXT NOT NULL,
  
  -- Tarif calculé
  tarif_total NUMERIC(10, 2) NOT NULL,
  tarif_cours NUMERIC(10, 2) NOT NULL,
  adhesion NUMERIC(10, 2) NOT NULL,
  licence_ffd NUMERIC(10, 2) NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX idx_inscriptions_statut ON inscriptions(statut);
CREATE INDEX idx_inscriptions_created_at ON inscriptions(created_at DESC);
CREATE INDEX idx_inscriptions_student_name ON inscriptions(student_name);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inscriptions_updated_at BEFORE UPDATE ON inscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut insérer (pour le formulaire public)
CREATE POLICY "Permettre insertion publique" ON inscriptions
  FOR INSERT
  WITH CHECK (true);

-- Politique : Seuls les utilisateurs authentifiés peuvent lire/modifier
CREATE POLICY "Lecture authentifiée uniquement" ON inscriptions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Modification authentifiée uniquement" ON inscriptions
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
