import { Request, Response } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../models/user.model';
import { CreateUserInput, UpdateUserInput } from '../types';

export async function getAll(req: Request, res: Response) {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const user = getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: CreateUserInput = req.body;

    if (!input.name || !input.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = createUser(input);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const input: UpdateUserInput = req.body;

    const user = updateUser(id, input);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const success = deleteUser(id);

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}
