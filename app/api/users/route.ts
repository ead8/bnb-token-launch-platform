import { NextRequest, NextResponse } from 'next/server'
import { getUser, createUser } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')
    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      )
    }

    const user = await getUser(address)
    return NextResponse.json(user || { message: 'User not found' })
  } catch (error) {
    console.error('[v0] Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address, ens } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const user = await createUser(address, ens)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
