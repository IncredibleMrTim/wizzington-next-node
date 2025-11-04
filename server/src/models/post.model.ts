import db from '../db';
import { Post, CreatePostInput, UpdatePostInput } from '../types';

export function getAllPosts(): Post[] {
  const stmt = db.prepare(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  return stmt.all() as Post[];
}

export function getPostById(id: number): Post | undefined {
  const stmt = db.prepare(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `);
  return stmt.get(id) as Post | undefined;
}

export function createPost(input: CreatePostInput): Post {
  const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
  const result = stmt.run(input.title, input.content || null, input.user_id || null);

  const newPost = getPostById(result.lastInsertRowid as number);
  if (!newPost) {
    throw new Error('Failed to create post');
  }
  return newPost;
}

export function updatePost(id: number, input: UpdatePostInput): Post | undefined {
  const updates: string[] = [];
  const values: any[] = [];

  if (input.title !== undefined) {
    updates.push('title = ?');
    values.push(input.title);
  }

  if (input.content !== undefined) {
    updates.push('content = ?');
    values.push(input.content);
  }

  if (input.user_id !== undefined) {
    updates.push('user_id = ?');
    values.push(input.user_id);
  }

  if (updates.length === 0) {
    return getPostById(id);
  }

  values.push(id);
  const stmt = db.prepare(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getPostById(id);
}

export function deletePost(id: number): boolean {
  const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
