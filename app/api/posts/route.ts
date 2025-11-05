import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Post, CreatePostInput } from '@/lib/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT posts.*, users.name as user_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    const posts = rows as Post[];
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

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
      [title, content || null, user_id || null]
    );

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    const newPost = rows[0] as Post;

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
