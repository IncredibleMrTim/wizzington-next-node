import { Request, Response } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../models/category.model';
import { CreateCategoryInput, UpdateCategoryInput } from '../types';

export async function getAll(req: Request, res: Response) {
  try {
    const categories = getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const category = getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: CreateCategoryInput = req.body;

    if (!input.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const category = createCategory(input);
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input: UpdateCategoryInput = { ...req.body, id };

    const category = updateCategory(input);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const success = deleteCategory(id);

    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
}
