import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Retry helper function
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries - 1) throw error;
      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, i)));
    }
  }
  throw new Error("Retry failed");
}

// GET all posts
export async function GET() {
  try {
    const posts = await withRetry(() =>
      prisma.post.findMany({
        orderBy: {
          created_at: "desc",
        },
      })
    );
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// Runtime config for Vercel
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, text } = body;

    if (!title || !text) {
      return NextResponse.json(
        { error: "Title and text are required" },
        { status: 400 }
      );
    }

    const post = await withRetry(() =>
      prisma.post.create({
        data: {
          id: uuidv4(),
          title,
          text,
          created_at: new Date(),
        },
      })
    );

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
