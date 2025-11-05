import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Post } from '@/lib/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/posts/[id] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT posts.*, users.name as user_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = rows[0] as Post;
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, user_id } = body;

    if (!title && !content && user_id === undefined) {
      return NextResponse.json({ error: 'At least one field is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (user_id !== undefined) {
      updates.push('user_id = ?');
      values.push(user_id);
    }

    values.push(id);

    await pool.query(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = rows[0] as Post;
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
