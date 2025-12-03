'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/prisma'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts(retries = 3) {
    setLoading(true)
    setError(null)
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data)
        setLoading(false)
        return // Success, exit function
      } catch (err: any) {
        setRetryCount(i + 1)
        if (i === retries - 1) {
          // Last retry failed
          setError(err.message)
          setLoading(false)
        } else {
          // Wait before retry (1s, 2s, 3s)
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
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
        <div className="loading">
          {retryCount > 0 ? `Connecting... (attempt ${retryCount + 1}/3)` : 'Loading posts...'}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <p>Error loading posts: {error}</p>
          <button 
            onClick={() => { setRetryCount(0); fetchPosts(); }} 
            className="btn" 
            style={{ marginTop: '1rem', maxWidth: '200px' }}
          >
            Try Again
          </button>
        </div>
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

