-- Créer une table de configuration pour les paramètres globaux de l'application

CREATE TABLE IF NOT EXISTS app_config (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer la configuration de la préinscription
INSERT INTO app_config (key, value, description) 
VALUES 
  ('preinscription_active', 'false', 'Active ou désactive la possibilité de payer la préinscription de 90€'),
  ('montant_preinscription', '90', 'Montant de la préinscription en euros')
ON CONFLICT (key) DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_app_config_key ON app_config(key);

COMMENT ON TABLE app_config IS 'Configuration globale de l''application';
