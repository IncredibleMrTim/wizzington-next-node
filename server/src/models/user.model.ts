import pool from '../db';
import { User, CreateUserInput, UpdateUserInput } from '../types';
import { randomUUID } from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function getAllUsers(): Promise<User[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
  return rows as User[];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
  return rows.length > 0 ? (rows[0] as User) : undefined;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const id = randomUUID();

  await pool.query<ResultSetHeader>(
    'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
    [id, input.name, input.email]
  );

  const user = await getUserById(id);
  if (!user) throw new Error('Failed to create user');
  return user;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User | undefined> {
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
  await pool.query<ResultSetHeader>(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  return getUserById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
