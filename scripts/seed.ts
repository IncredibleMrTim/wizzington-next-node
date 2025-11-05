import pool from '../lib/db';
import { randomUUID } from 'crypto';
import { ResultSetHeader } from 'mysql2';

async function seed() {
  console.log('Seeding database...');

  try {
    // Clear existing data
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM users');
    console.log('✓ Cleared existing data');

    // Seed users
    const users = [
      { id: randomUUID(), name: 'Alice Johnson', email: 'alice@example.com' },
      { id: randomUUID(), name: 'Bob Smith', email: 'bob@example.com' },
      { id: randomUUID(), name: 'Charlie Brown', email: 'charlie@example.com' },
    ];

    const userIds: string[] = [];
    for (const user of users) {
      await pool.query<ResultSetHeader>(
        'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
        [user.id, user.name, user.email]
      );
      userIds.push(user.id);
      console.log(`✓ Created user: ${user.name}`);
    }

    // Seed posts
    const posts = [
      {
        title: 'Getting Started with Next.js',
        content: 'Next.js is a powerful React framework that makes building web applications a breeze.',
        user_id: userIds[0],
      },
      {
        title: 'Why MySQL is Great for Production',
        content: 'MySQL is a robust, scalable database that\'s perfect for production applications of all sizes.',
        user_id: userIds[1],
      },
      {
        title: 'Building RESTful APIs',
        content: 'Creating a RESTful API with Next.js API routes is straightforward and follows best practices.',
        user_id: userIds[0],
      },
      {
        title: 'The Power of TypeScript',
        content: 'TypeScript adds type safety to JavaScript, making your code more robust and maintainable.',
        user_id: userIds[2],
      },
      {
        title: 'Tailwind CSS Tips',
        content: 'Tailwind CSS utility classes make styling fast and consistent across your application.',
        user_id: userIds[1],
      },
    ];

    for (const post of posts) {
      await pool.query<ResultSetHeader>(
        'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
        [post.title, post.content, post.user_id]
      );
      console.log(`✓ Created post: ${post.title}`);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
