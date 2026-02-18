-- Ajouter la colonne engagement_paiement_echelonne pour l'attestation sur l'honneur
ALTER TABLE inscriptions 
ADD COLUMN IF NOT EXISTS engagement_paiement_echelonne BOOLEAN DEFAULT false;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN inscriptions.engagement_paiement_echelonne IS 'Attestation sur l''honneur de régler les sommes dues pour paiement échelonné (3x ou 10x)';
