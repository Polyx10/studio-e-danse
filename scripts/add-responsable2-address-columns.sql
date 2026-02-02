-- Ajouter les colonnes d'adresse pour le responsable légal 2
ALTER TABLE inscriptions 
ADD COLUMN IF NOT EXISTS responsable2_address TEXT,
ADD COLUMN IF NOT EXISTS responsable2_postal_code TEXT,
ADD COLUMN IF NOT EXISTS responsable2_city TEXT;
