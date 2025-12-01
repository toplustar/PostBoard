'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/prisma'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
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
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error loading posts: {error}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="site-title">Posting Site</h1>
        <p className="site-subtitle">Share your thoughts with the world</p>
      </header>

      {posts.length === 0 ? (
        <div className="empty-state">
          No posts yet. Visit <Link href="/admin" style={{ color: 'var(--accent)' }}>admin</Link> to create one.
        </div>
      ) : (
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} onClick={() => window.location.href = `/upload/${post.id}`}>
                <td>
                  <Link href={`/upload/${post.id}`} className="post-link">
                    {post.title}
                  </Link>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(post.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/admin" className="bottom-link">
        Admin Panel
      </Link>
    </div>
  )
}

