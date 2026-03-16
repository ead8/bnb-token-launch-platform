import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET comments for a token
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tokenId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await db.query(
      `SELECT 
        tc.id, tc.user_id, tc.content, tc.likes, tc.created_at,
        u.username, u.avatar_url
      FROM token_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.token_id = $1
      ORDER BY tc.created_at DESC
      LIMIT $2 OFFSET $3`,
      [tokenId, limit, offset]
    )

    return NextResponse.json({
      comments: result.rows,
      total: result.rows.length,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, content } = body
    const tokenId = parseInt(params.id)

    if (!userId || !content || !tokenId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment too long (max 500 characters)' },
        { status: 400 }
      )
    }

    const result = await db.query(
      `INSERT INTO token_comments (token_id, user_id, content, likes)
       VALUES ($1, $2, $3, 0)
       RETURNING id, created_at`,
      [tokenId, userId, content]
    )

    return NextResponse.json(
      {
        id: result.rows[0].id,
        message: 'Comment created successfully',
        createdAt: result.rows[0].created_at,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
