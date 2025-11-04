import db from '../lib/db';

console.log('Seeding database...');

// Clear existing data
db.exec('DELETE FROM posts');
db.exec('DELETE FROM users');

// Seed users
const users = [
  { name: 'Alice Johnson', email: 'alice@example.com' },
  { name: 'Bob Smith', email: 'bob@example.com' },
  { name: 'Charlie Brown', email: 'charlie@example.com' },
];

const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');

const userIds: number[] = [];
for (const user of users) {
  const result = insertUser.run(user.name, user.email);
  userIds.push(result.lastInsertRowid as number);
  console.log(`Created user: ${user.name}`);
}

// Seed posts
const posts = [
  {
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework that makes building web applications a breeze.',
    user_id: userIds[0],
  },
  {
    title: 'Why SQLite is Great for Prototypes',
    content: 'SQLite is a lightweight, serverless database that\'s perfect for rapid prototyping and small to medium applications.',
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

const insertPost = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');

for (const post of posts) {
  insertPost.run(post.title, post.content, post.user_id);
  console.log(`Created post: ${post.title}`);
}

console.log('Database seeded successfully!');
db.close();
