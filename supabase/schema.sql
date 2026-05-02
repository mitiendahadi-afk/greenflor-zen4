-- GreenFlor Zen — Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- =============================================
-- TABLE: orders
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  address      TEXT NOT NULL,
  city         TEXT DEFAULT '',
  note         TEXT DEFAULT '',
  status       TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  amount       DECIMAL(10, 2) DEFAULT 395,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  ip_address   TEXT,
  source       TEXT DEFAULT 'direct'
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

-- =============================================
-- TABLE: store_settings
-- =============================================
CREATE TABLE IF NOT EXISTS store_settings (
  key   TEXT PRIMARY KEY,
  value TEXT DEFAULT ''
);

INSERT INTO store_settings (key, value) VALUES
  ('fb_pixel',           ''),
  ('tiktok_pixel',       ''),
  ('google_ads_id',      ''),
  ('product_price',      '395'),
  ('whatsapp_number',    '+212775137626'),
  ('notification_email', 'greenflor7@gmail.com'),
  ('notification_phone', '+212631955019'),
  ('store_active',       'true')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- TABLE: visitors
-- =============================================
CREATE TABLE IF NOT EXISTS visitors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT,
  country    TEXT,
  city       TEXT,
  page       TEXT,
  referrer   TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at DESC);

-- =============================================
-- REALTIME — Activer pour les mises à jour en temps réel
-- =============================================
ALTER TABLE orders   REPLICA IDENTITY FULL;
ALTER TABLE visitors REPLICA IDENTITY FULL;

-- Ajouter les tables dans la publication Realtime
-- (À faire dans les paramètres Supabase > Database > Replication)
-- OU via SQL:
-- ALTER PUBLICATION supabase_realtime ADD TABLE orders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE visitors;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Activer RLS (recommandé en production)
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors       ENABLE ROW LEVEL SECURITY;

-- Politique: accès public pour INSERT dans orders (commandes clients)
CREATE POLICY "Allow public insert orders" ON orders
  FOR INSERT TO anon WITH CHECK (true);

-- Politique: accès public pour INSERT dans visitors (tracking)
CREATE POLICY "Allow public insert visitors" ON visitors
  FOR INSERT TO anon WITH CHECK (true);

-- Politique: accès service role pour tout (dashboard admin)
CREATE POLICY "Allow service role full access orders" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access settings" ON store_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access visitors" ON visitors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================
-- STORAGE BUCKET (pour les images)
-- =============================================
-- Créer dans Supabase > Storage:
-- Bucket: "greenflor-assets" (Public)
-- OU via SQL (si accès):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('greenflor-assets', 'greenflor-assets', true);

-- =============================================
-- FONCTION: updated_at automatique
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
