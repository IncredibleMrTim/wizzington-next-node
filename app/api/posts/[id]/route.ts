import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Post } from '@/lib/types';

// GET /api/posts/[id] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = db.prepare(`
      SELECT posts.*, users.name as user_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `).get(id) as Post | undefined;

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

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

    const stmt = db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post;
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
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
