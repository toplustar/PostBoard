import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

// GET all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
    })
    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, text } = body

    if (!title || !text) {
      return NextResponse.json(
        { error: 'Title and text are required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        id: uuidv4(),
        title,
        text,
        created_at: new Date(),
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

