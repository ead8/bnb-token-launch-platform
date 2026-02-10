-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100) UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id SERIAL PRIMARY KEY,
  contract_address VARCHAR(42) UNIQUE NOT NULL,
  creator_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  twitter_url TEXT,
  telegram_url TEXT,
  initial_supply BIGINT NOT NULL,
  total_supply BIGINT NOT NULL,
  decimals INTEGER DEFAULT 18,
  bonding_curve_address VARCHAR(42),
  auto_buyback BOOLEAN DEFAULT FALSE,
  fee_sharing_enabled BOOLEAN DEFAULT FALSE,
  fee_percent DECIMAL(5, 2) DEFAULT 0,
  price_bnb DECIMAL(20, 8),
  market_cap_bnb DECIMAL(20, 8),
  volume_24h DECIMAL(20, 8),
  holders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active' -- active, completed, failed
);

-- Create token holders table
CREATE TABLE IF NOT EXISTS token_holders (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  balance BIGINT NOT NULL,
  percent_owned DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(token_id, user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  transaction_type VARCHAR(50) NOT NULL, -- buy, sell, transfer
  amount BIGINT NOT NULL,
  price_bnb DECIMAL(20, 8),
  total_bnb DECIMAL(20, 8),
  tx_hash VARCHAR(66) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fee shares table
CREATE TABLE IF NOT EXISTS fee_shares (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  platform VARCHAR(50) NOT NULL, -- twitter, github, tiktok, twitch
  platform_handle VARCHAR(255),
  share_percent DECIMAL(5, 2),
  accumulated_bnb DECIMAL(20, 8) DEFAULT 0,
  claimed_bnb DECIMAL(20, 8) DEFAULT 0,
  last_claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table (Stripe & Crypto)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token_id INTEGER,
  payment_type VARCHAR(50) NOT NULL, -- stripe_card, crypto_transfer
  amount DECIMAL(20, 8),
  currency VARCHAR(10),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  tx_hash VARCHAR(66) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboard snapshot table
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_earnings_bnb DECIMAL(20, 8),
  total_created_tokens INTEGER,
  total_trades INTEGER,
  rank INTEGER,
  snapshot_date DATE DEFAULT CURRENT_DATE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator_id);
CREATE INDEX IF NOT EXISTS idx_tokens_contract ON tokens(contract_address);
CREATE INDEX IF NOT EXISTS idx_holders_user ON token_holders(user_id);
CREATE INDEX IF NOT EXISTS idx_holders_token ON token_holders(token_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_token ON transactions(token_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_fee_shares_user ON fee_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_snapshots(user_id);
