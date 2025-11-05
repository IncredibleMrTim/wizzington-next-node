import pool from '../db';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';
import { randomUUID } from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY name ASC');
  return rows.map(rowToCategory);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
  return rows.length > 0 ? rowToCategory(rows[0]) : undefined;
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const id = randomUUID();

  await pool.query<ResultSetHeader>(
    'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
    [id, input.name, input.description || null]
  );

  const category = await getCategoryById(id);
  if (!category) throw new Error('Failed to create category');
  return category;
}

export async function updateCategory(input: UpdateCategoryInput): Promise<Category | undefined> {
  const updates: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    updates.push('name = ?');
    values.push(input.name);
  }

  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description);
  }

  if (updates.length > 0) {
    values.push(input.id);
    await pool.query<ResultSetHeader>(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }

  return getCategoryById(input.id);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
