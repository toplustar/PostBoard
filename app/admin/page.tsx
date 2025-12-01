"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, text }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setSuccess(true);
      setTitle("");
      setText("");

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">
        Back to Home
      </Link>

      <header className="header">
        <h1 className="site-title">Admin Panel</h1>
        <p className="site-subtitle">Create a new post</p>
      </header>

      <div className="form-container">
        {success && (
          <div className="success-message">Post created successfully!</div>
        )}

        {error && (
          <div className="error" style={{ marginBottom: "1rem" }}>
            Error: {error}
          </div>
        )}

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

      <Link href="/" className="bottom-link">
        View Posts
      </Link>
    </div>
  );
}
