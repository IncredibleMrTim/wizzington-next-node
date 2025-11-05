import pool from '../db';
import { Post, CreatePostInput, UpdatePostInput } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function getAllPosts(): Promise<Post[]> {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  return rows as Post[];
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT posts.*, users.name as user_name
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `, [id]);
  return rows.length > 0 ? (rows[0] as Post) : undefined;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
    [input.title, input.content || null, input.user_id || null]
  );

  const newPost = await getPostById(result.insertId);
  if (!newPost) {
    throw new Error('Failed to create post');
  }
  return newPost;
}

export async function updatePost(id: number, input: UpdatePostInput): Promise<Post | undefined> {
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
  await pool.query<ResultSetHeader>(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, values);

  return getPostById(id);
}

export async function deletePost(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
