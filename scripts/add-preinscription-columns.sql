-- Ajouter les colonnes pour la gestion de la préinscription et des échéanciers personnalisés

ALTER TABLE inscriptions 
ADD COLUMN IF NOT EXISTS preinscription_payee BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS montant_preinscription INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS echeancier_personnalise JSONB DEFAULT NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN inscriptions.preinscription_payee IS 'Indique si l''adhérent a payé la préinscription de 90€';
COMMENT ON COLUMN inscriptions.montant_preinscription IS 'Montant de la préinscription payée (généralement 90€)';
COMMENT ON COLUMN inscriptions.echeancier_personnalise IS 'Échéancier de paiement personnalisé au format JSON avec dates et montants';
