# Posting Site

A clean, modern posting site built with Next.js, Prisma, and Supabase.

## Features

- 📝 Create posts from admin panel
- 📋 View all posts in a clean table layout
- 🔗 Each post has a unique UUID-based URL
- ☁️ Cloud-based database with Supabase

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Once your project is ready, go to **Settings** → **Database**
4. Under **Connection string** → **URI**, copy the connection string

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add your database connection string:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password from Supabase.

### 4. Create the Database Table (Using Prisma)

Run this command to create the database schema automatically:

```bash
npx prisma db push
```

This will create the `posts` table in your Supabase database!

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Homepage** (`/`): View all posts in a table
- **Admin Panel** (`/admin`): Create new posts
- **Individual Posts** (`/upload/[id]`): View a specific post by its UUID

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Language**: TypeScript
- **Styling**: CSS (custom, inspired by duel.com)
- **UUID Generation**: uuid package

## Project Structure

```
/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin panel for creating posts
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts      # API for getting/creating posts
│   │       └── [id]/
│   │           └── route.ts  # API for getting single post
│   ├── upload/
│   │   └── [id]/
│   │       └── page.tsx      # Individual post page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage with posts table
│   └── globals.css           # Global styles
├── lib/
│   └── prisma.ts             # Prisma client configuration
├── prisma/
│   └── schema.prisma         # Database schema
└── package.json
```

## Useful Prisma Commands

- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Open Prisma Studio (GUI for viewing/editing data)
- `npx prisma db pull` - Pull schema from database to Prisma schema
