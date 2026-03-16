import { db } from './db'

// CoinGecko API integration for real-time price data
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

export interface PriceData {
  price: number
  market_cap: number
  volume_24h: number
  change_24h: number
  timestamp: Date
}

// Get BNB price in USD for conversion
export async function getBNBPrice(): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=binancecoin&vs_currencies=usd`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    )
    const data = await response.json()
    return data.binancecoin.usd
  } catch (error) {
    console.error('Error fetching BNB price:', error)
    return 0
  }
}

// Get price data for a specific token (using contract address)
export async function getTokenPriceData(
  contractAddress: string
): Promise<PriceData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/token_price/binance-smart-chain?contract_addresses=${contractAddress}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )
    const data = await response.json()

    if (data[contractAddress]) {
      const tokenData = data[contractAddress]
      return {
        price: tokenData.usd || 0,
        market_cap: tokenData.usd_market_cap || 0,
        volume_24h: tokenData.usd_24h_vol || 0,
        change_24h: tokenData.usd_24h_change || 0,
        timestamp: new Date(),
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching token price data:', error)
    return null
  }
}

// Store price history in database
export async function recordPriceHistory(
  tokenId: number,
  priceData: PriceData
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO price_history (token_id, price, volume_24h, market_cap, holders_count, timestamp)
       VALUES ($1, $2, $3, $4, NULL, $5)`,
      [tokenId, priceData.price, priceData.volume_24h, priceData.market_cap, priceData.timestamp]
    )
  } catch (error) {
    console.error('Error recording price history:', error)
  }
}

// Get historical price data for charting
export async function getPriceHistory(
  tokenId: number,
  hours: number = 24
): Promise<PriceData[]> {
  try {
    const response = await db.query(
      `SELECT price, volume_24h, market_cap, timestamp 
       FROM price_history 
       WHERE token_id = $1 
       AND timestamp > NOW() - INTERVAL '${hours} hours'
       ORDER BY timestamp ASC`,
      [tokenId]
    )

    return response.rows.map((row: any) => ({
      price: parseFloat(row.price),
      market_cap: parseFloat(row.market_cap || 0),
      volume_24h: parseFloat(row.volume_24h || 0),
      change_24h: 0, // Calculate from price difference
      timestamp: new Date(row.timestamp),
    }))
  } catch (error) {
    console.error('Error fetching price history:', error)
    return []
  }
}

// Get trending tokens from CoinGecko
export async function getTrendingTokens(limit: number = 10) {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending?x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`, {
      next: { revalidate: 300 },
    })
    const data = await response.json()
    
    return data.coins.slice(0, limit).map((coin: any) => ({
      name: coin.item.name,
      symbol: coin.item.symbol.toUpperCase(),
      thumb: coin.item.thumb,
      market_cap_rank: coin.item.market_cap_rank,
    }))
  } catch (error) {
    console.error('Error fetching trending tokens:', error)
    return []
  }
}

// Update all token prices (run periodically via cron job)
export async function updateAllTokenPrices(): Promise<void> {
  try {
    const tokens = await db.query('SELECT id, contract_address FROM tokens WHERE active = true LIMIT 100')

    for (const token of tokens.rows) {
      const priceData = await getTokenPriceData(token.contract_address)
      if (priceData) {
        await recordPriceHistory(token.id, priceData)
      }
    }

    console.log('[Price Feed] Updated prices for', tokens.rows.length, 'tokens')
  } catch (error) {
    console.error('Error updating all token prices:', error)
  }
}
