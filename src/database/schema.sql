-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  store_type VARCHAR(50) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255),
  credentials JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  sku VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abandoned carts table
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  customer_id VARCHAR(255),
  customer_email VARCHAR(255),
  items JSONB,
  total DECIMAL(10, 2),
  recovered BOOLEAN DEFAULT false,
  recovery_emails_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  campaign_name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(50) NOT NULL,
  config JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign emails table
CREATE TABLE IF NOT EXISTS campaign_emails (
  id UUID PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  customer_email VARCHAR(255),
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  converted BOOLEAN DEFAULT false,
  revenue DECIMAL(10, 2),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP
);

-- Content suggestions table
CREATE TABLE IF NOT EXISTS content_suggestions (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id),
  title_suggestions TEXT[],
  description_suggestion TEXT,
  keywords TEXT[],
  optimization_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_abandoned_carts_store_id ON abandoned_carts(store_id);
CREATE INDEX idx_abandoned_carts_recovered ON abandoned_carts(recovered);
CREATE INDEX idx_campaigns_store_id ON campaigns(store_id);
CREATE INDEX idx_campaign_emails_campaign_id ON campaign_emails(campaign_id);
