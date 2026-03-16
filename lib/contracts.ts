import { createPublicClient, createWalletClient, http, parseUnits, Address } from 'viem'
import { bsc } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const publicClient = createPublicClient({
  chain: bsc,
  transport: http(),
})

// Flap.sh Contract Addresses on BNB Chain
export const FLAP_CONTRACTS = {
  FACTORY: process.env.NEXT_PUBLIC_FLAP_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000',
  BONDING_CURVE: process.env.NEXT_PUBLIC_FLAP_BONDING_CURVE || '0x0000000000000000000000000000000000000000',
  FEE_DISTRIBUTOR: process.env.NEXT_PUBLIC_FLAP_FEE_DISTRIBUTOR || '0x0000000000000000000000000000000000000000',
}

// Flap.sh Token Factory Contract ABI
const FLAP_FACTORY_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'initialSupply', type: 'uint256' },
      { name: 'feePercentage', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'imageUrl', type: 'string' },
    ],
    name: 'createToken',
    outputs: [{ name: 'tokenAddress', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenAddress', type: 'address' }],
    name: 'getTokenInfo',
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'creator', type: 'address' },
      { name: 'createdAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// Bonding Curve ABI
const BONDING_CURVE_ABI = [
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'buy',
    outputs: [{ name: 'cost', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'sell',
    outputs: [{ name: 'proceeds', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'calculateBuyPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'tokenAddress', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'calculateSellPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
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

// Flap.sh: Create a new token
export async function createTokenOnFlap(
  name: string,
  symbol: string,
  initialSupply: bigint,
  feePercentage: number,
  description: string,
  imageUrl: string,
  walletAddress: string,
  privateKey: string
) {
  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(),
    })

    const hash = await walletClient.writeContract({
      address: FLAP_CONTRACTS.FACTORY as Address,
      abi: FLAP_FACTORY_ABI,
      functionName: 'createToken',
      args: [name, symbol, initialSupply, feePercentage, description, imageUrl],
      value: parseUnits('0.01', 18), // Example: 0.01 BNB creation fee
    })

    console.log('[Flap.sh] Token creation tx:', hash)
    return hash
  } catch (error) {
    console.error('[Flap.sh] Error creating token:', error)
    throw error
  }
}

// Flap.sh: Calculate buy price
export async function calculateBuyPrice(tokenAddress: string, amount: bigint) {
  try {
    const price = await publicClient.readContract({
      address: FLAP_CONTRACTS.BONDING_CURVE as Address,
      abi: BONDING_CURVE_ABI,
      functionName: 'calculateBuyPrice',
      args: [tokenAddress as Address, amount],
    })
    return price as bigint
  } catch (error) {
    console.error('[Flap.sh] Error calculating buy price:', error)
    throw error
  }
}

// Flap.sh: Calculate sell price
export async function calculateSellPrice(tokenAddress: string, amount: bigint) {
  try {
    const price = await publicClient.readContract({
      address: FLAP_CONTRACTS.BONDING_CURVE as Address,
      abi: BONDING_CURVE_ABI,
      functionName: 'calculateSellPrice',
      args: [tokenAddress as Address, amount],
    })
    return price as bigint
  } catch (error) {
    console.error('[Flap.sh] Error calculating sell price:', error)
    throw error
  }
}

// Flap.sh: Buy tokens via bonding curve
export async function buyTokensOnFlap(
  tokenAddress: string,
  amount: bigint,
  walletAddress: string,
  privateKey: string
) {
  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(),
    })

    // Calculate cost
    const cost = await calculateBuyPrice(tokenAddress, amount)

    const hash = await walletClient.writeContract({
      address: FLAP_CONTRACTS.BONDING_CURVE as Address,
      abi: BONDING_CURVE_ABI,
      functionName: 'buy',
      args: [tokenAddress as Address, amount],
      value: cost,
    })

    console.log('[Flap.sh] Buy tokens tx:', hash)
    return hash
  } catch (error) {
    console.error('[Flap.sh] Error buying tokens:', error)
    throw error
  }
}

// Flap.sh: Sell tokens via bonding curve
export async function sellTokensOnFlap(
  tokenAddress: string,
  amount: bigint,
  walletAddress: string,
  privateKey: string
) {
  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(),
    })

    const hash = await walletClient.writeContract({
      address: FLAP_CONTRACTS.BONDING_CURVE as Address,
      abi: BONDING_CURVE_ABI,
      functionName: 'sell',
      args: [tokenAddress as Address, amount],
    })

    console.log('[Flap.sh] Sell tokens tx:', hash)
    return hash
  } catch (error) {
    console.error('[Flap.sh] Error selling tokens:', error)
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
