import db from '../db';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';
import { randomUUID } from 'crypto';

function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function getAllCategories(): Category[] {
  const stmt = db.prepare('SELECT * FROM categories ORDER BY name ASC');
  const rows = stmt.all() as any[];
  return rows.map(rowToCategory);
}

export function getCategoryById(id: string): Category | undefined {
  const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
  const row = stmt.get(id) as any;
  return row ? rowToCategory(row) : undefined;
}

export function createCategory(input: CreateCategoryInput): Category {
  const id = randomUUID();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO categories (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(id, input.name, input.description || null, now, now);

  const category = getCategoryById(id);
  if (!category) throw new Error('Failed to create category');
  return category;
}

export function updateCategory(input: UpdateCategoryInput): Category | undefined {
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

  updates.push('updated_at = ?');
  values.push(new Date().toISOString());

  if (updates.length > 1) {
    values.push(input.id);
    const stmt = db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  return getCategoryById(input.id);
}

export function deleteCategory(id: string): boolean {
  const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
