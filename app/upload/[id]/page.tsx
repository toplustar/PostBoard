'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Post } from '@/lib/prisma'

export default function PostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  async function fetchPost(id: string) {
    try {
      const response = await fetch(`/api/posts/${id}`)
      if (!response.ok) throw new Error('Post not found')
      const data = await response.json()
      setPost(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string | Date) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container">
        <Link href="/" className="back-link">
          Back to Home
        </Link>
        <div className="error">Post not found</div>
      </div>
    )
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <div className="post-detail">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          Posted on {formatDate(post.created_at)}
        </div>
        <div className="post-content">{post.text}</div>
      </div>

      <Link href="/admin" className="bottom-link">
        Admin Panel
      </Link>
    </div>
  )
}

