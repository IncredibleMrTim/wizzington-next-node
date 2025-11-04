import { Request, Response } from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../models/post.model';
import { CreatePostInput, UpdatePostInput } from '../types';

export async function getAll(req: Request, res: Response) {
  try {
    const posts = getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const post = getPostById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const input: CreatePostInput = req.body;

    if (!input.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const post = createPost(input);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const input: UpdatePostInput = req.body;

    const post = updatePost(id, input);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const success = deletePost(id);

    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}
