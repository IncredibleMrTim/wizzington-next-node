import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Category, CreateCategoryInput } from '@/lib/types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
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

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY name ASC');
    const categories = rows.map(rowToCategory);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const input: CreateCategoryInput = await request.json();

    if (!input.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const id = randomUUID();

    await pool.query<ResultSetHeader>(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, input.name, input.description || null]
    );

    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
    const category = rowToCategory(rows[0]);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
