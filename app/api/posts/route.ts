import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Post, CreatePostInput } from '@/lib/types';

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const posts = db.prepare(`
      SELECT posts.*, users.name as user_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `).all() as Post[];
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body: CreatePostInput = await request.json();
    const { title, content, user_id } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
    const result = stmt.run(title, content || null, user_id || null);

    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid) as Post;

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
