-- Add price history table for charting
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  price DECIMAL(20, 8) NOT NULL,
  volume_24h DECIMAL(20, 2),
  market_cap DECIMAL(20, 2),
  holders_count INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX idx_price_history_token_timestamp ON price_history(token_id, timestamp DESC);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp DESC);

-- Add security and verification tables
CREATE TABLE IF NOT EXISTS token_security (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL UNIQUE REFERENCES tokens(id) ON DELETE CASCADE,
  contract_verified BOOLEAN DEFAULT FALSE,
  audit_status VARCHAR(50) DEFAULT 'pending', -- pending, passed, failed, not_audited
  audit_link TEXT,
  risk_score INTEGER DEFAULT 50, -- 0-100, higher is riskier
  honeypot_check BOOLEAN DEFAULT FALSE,
  rug_risk_level VARCHAR(50) DEFAULT 'unknown', -- unknown, low, medium, high
  security_notes TEXT,
  last_checked TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add creator verification table
CREATE TABLE IF NOT EXISTS creator_verification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT FALSE,
  verification_level VARCHAR(50) DEFAULT 'unverified', -- unverified, bronze, silver, gold
  tokens_launched INTEGER DEFAULT 0,
  avg_token_rating DECIMAL(3, 1) DEFAULT 0,
  verification_date TIMESTAMP WITH TIME ZONE,
  badge_icon VARCHAR(255),
  social_verified_twitter BOOLEAN DEFAULT FALSE,
  social_verified_github BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add social features tables
CREATE TABLE IF NOT EXISTS token_comments (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS token_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_id INTEGER NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token_id)
);

-- Add referral system table
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_amount DECIMAL(20, 8),
  reward_token VARCHAR(255), -- BNB or token address
  status VARCHAR(50) DEFAULT 'pending', -- pending, claimed, expired
  claimed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_price_alerts BOOLEAN DEFAULT TRUE,
  email_new_launches BOOLEAN DEFAULT TRUE,
  email_portfolio_updates BOOLEAN DEFAULT FALSE,
  email_community BOOLEAN DEFAULT FALSE,
  push_price_alerts BOOLEAN DEFAULT TRUE,
  push_new_launches BOOLEAN DEFAULT TRUE,
  push_portfolio_updates BOOLEAN DEFAULT FALSE,
  price_alert_threshold DECIMAL(5, 2) DEFAULT 10, -- percent change
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for frequently queried relationships
CREATE INDEX idx_token_security_token_id ON token_security(token_id);
CREATE INDEX idx_creator_verification_user_id ON creator_verification(user_id);
CREATE INDEX idx_token_comments_token_id ON token_comments(token_id);
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_token_favorites_user_id ON token_favorites(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
