-- Table pour gérer les quotas de cours
CREATE TABLE IF NOT EXISTS cours_quotas (
  id SERIAL PRIMARY KEY,
  cours_id VARCHAR(50) UNIQUE NOT NULL,
  quota_en_ligne INTEGER NOT NULL DEFAULT 15,
  inscriptions_en_ligne INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour la liste d'attente
CREATE TABLE IF NOT EXISTS liste_attente (
  id SERIAL PRIMARY KEY,
  cours_id VARCHAR(50) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cours_quotas_cours_id ON cours_quotas(cours_id);
CREATE INDEX IF NOT EXISTS idx_liste_attente_cours_id ON liste_attente(cours_id);
CREATE INDEX IF NOT EXISTS idx_liste_attente_email ON liste_attente(email);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_cours_quotas_updated_at ON cours_quotas;
CREATE TRIGGER update_cours_quotas_updated_at
    BEFORE UPDATE ON cours_quotas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Initialiser les quotas pour tous les cours (sauf cours spéciaux)
INSERT INTO cours_quotas (cours_id, quota_en_ligne, inscriptions_en_ligne)
VALUES 
  ('eveil-mercredi-10h', 15, 0),
  ('eveil-mercredi-14h', 15, 0),
  ('initiation-mercredi-11h', 15, 0),
  ('initiation-mercredi-15h', 15, 0),
  ('classique-1-mercredi-16h', 15, 0),
  ('classique-2-mercredi-17h', 15, 0),
  ('classique-3-mercredi-18h', 15, 0),
  ('modern-jazz-1-mercredi-16h', 15, 0),
  ('modern-jazz-2-mercredi-17h', 15, 0),
  ('modern-jazz-3-mercredi-18h', 15, 0),
  ('classique-1-samedi-10h', 15, 0),
  ('classique-2-samedi-11h', 15, 0),
  ('classique-3-samedi-12h', 15, 0),
  ('modern-jazz-1-samedi-13h30', 15, 0),
  ('modern-jazz-2-samedi-14h30', 15, 0),
  ('modern-jazz-3-samedi-15h30', 15, 0),
  ('hip-hop-debutant-samedi-16h30', 15, 0),
  ('hip-hop-intermediaire-samedi-17h30', 15, 0),
  ('contemporain-adulte-lundi-19h', 15, 0),
  ('classique-adulte-mardi-19h', 15, 0),
  ('modern-jazz-adulte-jeudi-19h', 15, 0)
ON CONFLICT (cours_id) DO NOTHING;
