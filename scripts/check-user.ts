import prisma from '../lib/prisma';

async function checkUser() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total users found:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));

    const adminUser = await prisma.user.findUnique({
      where: { email: 'timsmarttechnology@gmail.com' }
    });
    console.log('\nAdmin user:', JSON.stringify(adminUser, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
