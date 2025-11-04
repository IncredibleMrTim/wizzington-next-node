import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../models/product.model';
import { CreateProductInput, UpdateProductInput } from '../types';

export async function getAll(req: Request, res: Response) {
  try {
    const isFeatured = req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined;
    const category = req.query.category as string | undefined;

    const products = getAllProducts({ isFeatured, category });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const product = getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function getByCategory(req: Request, res: Response) {
  try {
    const categoryId = req.params.categoryId;
    const products = getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: CreateProductInput = req.body;

    if (!input.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const product = createProduct(input);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const input: UpdateProductInput = { ...req.body, id };

    const product = updateProduct(input);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const success = deleteProduct(id);

    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
