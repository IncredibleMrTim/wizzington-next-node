import db from '../db';
import { User, CreateUserInput, UpdateUserInput } from '../types';

export function getAllUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
  return stmt.all() as User[];
}

export function getUserById(id: number): User | undefined {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | undefined;
}

export function createUser(input: CreateUserInput): User {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(input.name, input.email);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
  return newUser;
}

export function updateUser(id: number, input: UpdateUserInput): User | undefined {
  const updates: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    updates.push('name = ?');
    values.push(input.name);
  }

  if (input.email !== undefined) {
    updates.push('email = ?');
    values.push(input.email);
  }

  if (updates.length === 0) {
    return getUserById(id);
  }

  values.push(id);
  const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getUserById(id);
}

export function deleteUser(id: number): boolean {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
