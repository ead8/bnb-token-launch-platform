import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function getUser(address: string) {
  const result = await sql`SELECT * FROM users WHERE wallet_address = ${address.toLowerCase()}`
  return result[0] || null
}

export async function createUser(address: string, username?: string) {
  const result = await sql`INSERT INTO users (wallet_address, username, created_at) 
     VALUES (${address.toLowerCase()}, ${username || null}, NOW()) 
     RETURNING *`
  return result[0]
}

export async function getTokens(limit = 50, offset = 0) {
  const result = await sql`SELECT * FROM tokens 
     ORDER BY market_cap_bnb DESC NULLS LAST 
     LIMIT ${limit} OFFSET ${offset}`
  return result
}

export async function getTokenById(tokenId: string) {
  const result = await sql`SELECT * FROM tokens WHERE id = ${tokenId}`
  return result[0] || null
}

export async function getTokenByAddress(contractAddress: string) {
  const result = await sql`SELECT * FROM tokens WHERE contract_address = ${contractAddress.toLowerCase()}`
  return result[0] || null
}

export async function createToken(data: {
  name: string
  symbol: string
  description: string
  image_url?: string
  creator_id: number
  contract_address: string
  initial_supply: number
  fee_percent?: number
}) {
  const result = await sql`INSERT INTO tokens (
      name, symbol, description, image_url, creator_id, 
      contract_address, initial_supply, total_supply, fee_percent, created_at
    ) VALUES (${data.name}, ${data.symbol}, ${data.description}, ${data.image_url || null}, ${data.creator_id}, 
      ${data.contract_address.toLowerCase()}, ${data.initial_supply}, ${data.initial_supply}, ${data.fee_percent || 0}, NOW())
    RETURNING *`
  return result[0]
}

export async function recordTransaction(data: {
  token_id: string
  user_address: string
  type: 'buy' | 'sell'
  amount: number
  price_per_unit: number
  tx_hash: string
}) {
  const result = await sql`INSERT INTO transactions (
      token_id, user_address, type, amount, price_per_unit, tx_hash, created_at
    ) VALUES (${data.token_id}, ${data.user_address.toLowerCase()}, ${data.type}, ${data.amount}, ${data.price_per_unit}, ${data.tx_hash}, NOW())
    RETURNING *`
  return result[0]
}

export async function getTokenHolders(tokenId: string, limit = 20) {
  const result = await sql`SELECT * FROM token_holders 
     WHERE token_id = ${tokenId} 
     ORDER BY balance DESC 
     LIMIT ${limit}`
  return result
}

export async function getLeaderboard(type: 'earners' | 'tokens', limit = 50) {
  if (type === 'earners') {
    const result = await sql`SELECT u.wallet_address, u.ens_name, 
              SUM(CAST(ls.total_earnings AS NUMERIC)) as total_earnings
       FROM leaderboard_snapshots ls
       JOIN users u ON ls.user_id = u.id
       GROUP BY u.id, u.wallet_address, u.ens_name
       ORDER BY total_earnings DESC NULLS LAST
       LIMIT ${limit}`
    return result
  } else {
    const result = await sql`SELECT * FROM tokens 
       ORDER BY market_cap_bnb DESC NULLS LAST 
       LIMIT ${limit}`
    return result
  }
}

export async function recordFeeShare(data: {
  token_id: string
  user_address: string
  platform: 'twitter' | 'github' | 'tiktok' | 'twitch'
  amount: number
}) {
  const result = await sql`INSERT INTO fee_shares (token_id, user_address, platform, amount, created_at)
     VALUES (${data.token_id}, ${data.user_address.toLowerCase()}, ${data.platform}, ${data.amount}, NOW())
     RETURNING *`
  return result[0]
}

export async function getUserEarnings(userAddress: string) {
  const result = await sql`SELECT platform, SUM(CAST(amount AS NUMERIC)) as total
     FROM fee_shares
     WHERE user_address = ${userAddress.toLowerCase()}
     GROUP BY platform`
  return result
}

export async function recordPayment(data: {
  user_address: string
  amount: number
  currency: 'USD' | 'BNB'
  stripe_payment_id?: string
  tx_hash?: string
}) {
  const result = await sql`INSERT INTO payments (
      user_address, amount, currency, stripe_payment_id, tx_hash, created_at
    ) VALUES (${data.user_address.toLowerCase()}, ${data.amount}, ${data.currency}, ${data.stripe_payment_id || null}, ${data.tx_hash || null}, NOW())
    RETURNING *`
  return result[0]
}
