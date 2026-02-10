import { createPublicClient, http, parseUnits, Address } from 'viem'
import { bsc } from 'viem/chains'

const publicClient = createPublicClient({
  chain: bsc,
  transport: http(),
})

// Flap.sh Token Factory Contract ABI (simplified)
const FLAP_FACTORY_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'initialSupply', type: 'uint256' },
      { name: 'feePercentage', type: 'uint256' },
    ],
    name: 'createToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
]

// Standard ERC20 ABI for interactions
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
]

// Get token balance
export async function getTokenBalance(tokenAddress: string, userAddress: string) {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress as Address],
    })
    return balance as bigint
  } catch (error) {
    console.error('[v0] Error fetching token balance:', error)
    throw error
  }
}

// Get token total supply
export async function getTokenTotalSupply(tokenAddress: string) {
  try {
    const supply = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'totalSupply',
    })
    return supply as bigint
  } catch (error) {
    console.error('[v0] Error fetching token supply:', error)
    throw error
  }
}

// Get token decimals
export async function getTokenDecimals(tokenAddress: string) {
  try {
    const decimals = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })
    return Number(decimals)
  } catch (error) {
    console.error('[v0] Error fetching token decimals:', error)
    throw error
  }
}

// Get token info
export async function getTokenInfo(tokenAddress: string) {
  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: 'name',
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
    ])

    return {
      name: name as string,
      symbol: symbol as string,
      decimals: Number(decimals),
      totalSupply: totalSupply as bigint,
    }
  } catch (error) {
    console.error('[v0] Error fetching token info:', error)
    throw error
  }
}

// Get BNB price in USD (using Binance API)
export async function getBNBPrice() {
  try {
    const response = await fetch(
      'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'
    )
    const data = await response.json()
    return parseFloat(data.price)
  } catch (error) {
    console.error('[v0] Error fetching BNB price:', error)
    return null
  }
}

// Format token amount based on decimals
export function formatTokenAmount(amount: bigint, decimals: number): number {
  return Number(amount) / Math.pow(10, decimals)
}

// Parse token amount to contract units
export function parseTokenAmount(amount: string, decimals: number) {
  return parseUnits(amount, decimals)
}
