import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { User, CreateUserInput } from '@/lib/types';

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserInput = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const result = stmt.run(name, email);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
