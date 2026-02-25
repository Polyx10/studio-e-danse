-- Table pour les alertes admin (basculements tarif famille, etc.)
CREATE TABLE IF NOT EXISTS notifications_admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  inscription_id UUID REFERENCES inscriptions(id) ON DELETE SET NULL,
  inscription_concernee_id UUID REFERENCES inscriptions(id) ON DELETE SET NULL,
  delta NUMERIC(10,2),
  lu BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notifications_admin_lu ON notifications_admin(lu);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_created_at ON notifications_admin(created_at DESC);
