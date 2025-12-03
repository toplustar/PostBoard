"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { Post } from "@/lib/prisma";

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(retries = 3) {
    setPostsLoading(true);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
        setPostsLoading(false);
        return;
      } catch (err: any) {
        if (i === retries - 1) {
          setError(err.message);
          setPostsLoading(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setSuccess("Post created successfully!");
      setTitle("");
      setText("");
      fetchPosts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setSuccess("Post deleted successfully!");
      fetchPosts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function openEditModal(post: Post) {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditText(post.text);
  }

  function closeEditModal() {
    setEditingPost(null);
    setEditTitle("");
    setEditText("");
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingPost) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, text: editText }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      setSuccess("Post updated successfully!");
      closeEditModal();
      fetchPosts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string | Date) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <header className="header">
        <h1 className="site-title">Admin Panel</h1>
        <p className="site-subtitle">Manage your posts</p>
      </header>

      {success && <div className="success-message">{success}</div>}
      {error && (
        <div
          className="error"
          style={{ marginBottom: "1rem", textAlign: "center" }}
        >
          Error: {error}
        </div>
      )}

      {/* Create New Post Form */}
      <div className="form-container" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
          Create New Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="text" className="form-label">
              Content
            </label>
            <textarea
              id="text"
              className="form-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your post content..."
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="form-container">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
          Manage Posts
        </h2>

        {postsLoading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">No posts yet.</div>
        ) : (
          <div className="admin-posts-list">
            {posts.map((post) => (
              <div key={post.id} className="admin-post-item">
                <div className="admin-post-info">
                  <h3 className="admin-post-title">{post.title}</h3>
                  <span className="admin-post-date">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <div className="admin-post-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>
              Edit Post
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="edit-title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-text" className="form-label">
                  Content
                </label>
                <textarea
                  id="edit-text"
                  className="form-textarea"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={closeEditModal}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Link href="/" className="bottom-link">
        View Posts
      </Link>
    </div>
  );
}
