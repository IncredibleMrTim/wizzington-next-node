import prisma from "../lib/prisma";

interface CategoryData {
  name: string;
  description: string | null;
  position: number;
  children: CategoryData[];
}

/**
 * Recursively seeds categories with parent-child relationships
 */
async function seedCategoriesRecursive(
  items: CategoryData[],
  parentId?: string
) {
  for (const item of items) {
    const existing = await prisma.category.findFirst({
      where: { name: item.name, parentId },
    });

    let categoryId: string;

    if (existing) {
      categoryId = existing.id;
      // Update position if different
      if (existing.position !== item.position) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { position: item.position },
        });
      }
    } else {
      const category = await prisma.category.create({
        data: {
          name: item.name,
          description: item.description,
          position: item.position,
          parentId,
        },
      });
      categoryId = category.id;
      console.log(`✓ Created category: ${item.name}`);
    }

    if (item.children && item.children.length > 0) {
      await seedCategoriesRecursive(item.children, categoryId);
    }
  }
}

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    await prisma.orderProduct.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log("✓ Cleared existing data");

    // Seed categories from menu structure
    const categories: CategoryData[] = [
      {
        name: "Home",
        description: null,
        position: 0,
        children: [],
      },
      {
        name: "Dance wear",
        description: null,
        position: 1,
        children: [
          {
            name: "Aerial",
            description: null,
            position: 0,
            children: [
              { name: "Accessories", description: null, position: 0, children: [] },
              { name: "Acro", description: null, position: 1, children: [] },
              { name: "Airbrush", description: null, position: 2, children: [] },
              { name: "Character inspired", description: null, position: 3, children: [] },
              { name: "Gallery", description: null, position: 4, children: [] },
              { name: "Hand painted", description: null, position: 5, children: [] },
              { name: "Jazz", description: null, position: 6, children: [] },
              { name: "Lyrical", description: null, position: 7, children: [] },
              { name: "Modern", description: null, position: 8, children: [] },
              { name: "Other", description: null, position: 9, children: [] },
              { name: "Pancake tutus", description: null, position: 10, children: [] },
              { name: "Stretch", description: null, position: 11, children: [] },
              { name: "Tap", description: null, position: 12, children: [] },
            ],
          },
          {
            name: "Figure Skating",
            description: null,
            position: 1,
            children: [
              { name: "Accessories", description: null, position: 0, children: [] },
              { name: "Acro", description: null, position: 1, children: [] },
              { name: "Airbrush", description: null, position: 2, children: [] },
              { name: "Character inspired", description: null, position: 3, children: [] },
              { name: "Gallery", description: null, position: 4, children: [] },
              { name: "Hand painted", description: null, position: 5, children: [] },
              { name: "Jazz", description: null, position: 6, children: [] },
              { name: "Lyrical", description: null, position: 7, children: [] },
              { name: "Modern", description: null, position: 8, children: [] },
              { name: "Other", description: null, position: 9, children: [] },
              { name: "Pancake tutus", description: null, position: 10, children: [] },
              { name: "Stretch", description: null, position: 11, children: [] },
              { name: "Tap", description: null, position: 12, children: [] },
            ],
          },
        ],
      },
      {
        name: "Pageant Wear",
        description: null,
        position: 2,
        children: [
          { name: "Casual wear", description: null, position: 0, children: [] },
          { name: "Glitz dresses", description: null, position: 1, children: [] },
          { name: "Natural dresses", description: null, position: 2, children: [] },
          { name: "OOC/fun fashion", description: null, position: 3, children: [] },
          { name: "Swimwear", description: null, position: 4, children: [] },
        ],
      },
    ];

    await seedCategoriesRecursive(categories);
    console.log("✓ Seeded categories");

    // Get created categories for product seeding
    const danceWear = await prisma.category.findFirst({
      where: { name: "Dance wear", parentId: null },
    });

    const pageantWear = await prisma.category.findFirst({
      where: { name: "Pageant Wear", parentId: null },
    });

    // Seed users
    const user1 = await prisma.user.create({
      data: {
        firstName: "Tim",
        surname: "Smart",
        email: "timsmarttechnology@gmail.com",
        role: "ADMIN",
      },
    });
    console.log(`✓ Created user: ${user1.email}`);

    // Seed products
    const product1 = await prisma.product.create({
      data: {
        name: "Lyrical Dance Costume",
        description: "Elegant lyrical dance costume for performances",
        price: 199.99,
        stock: 50,
        isFeatured: true,
        categoryId: danceWear?.id,
        images: {
          create: [
            { url: "/images/lyrical-1.jpg", orderPosition: 0 },
            { url: "/images/lyrical-2.jpg", orderPosition: 1 },
          ],
        },
      },
    });
    console.log(`✓ Created product: ${product1.name}`);

    const product2 = await prisma.product.create({
      data: {
        name: "Glitz Pageant Dress",
        description: "Sparkling glitz pageant competition dress",
        price: 299.99,
        stock: 30,
        isFeatured: true,
        categoryId: pageantWear?.id,
        images: {
          create: [{ url: "/images/glitz-1.jpg", orderPosition: 0 }],
        },
      },
    });
    console.log(`✓ Created product: ${product2.name}`);

    const product3 = await prisma.product.create({
      data: {
        name: "Dance Shoes",
        description: "Professional dance shoes for all styles",
        price: 89.99,
        stock: 100,
        isFeatured: false,
        categoryId: danceWear?.id,
        images: {
          create: [{ url: "/images/shoes-1.jpg", orderPosition: 0 }],
        },
      },
    });
    console.log(`✓ Created product: ${product3.name}`);

    // Seed sample order
    const order = await prisma.order.create({
      data: {
        customerName: "Jane Doe",
        customerEmail: "jane@example.com",
        customerPhone: "+1234567890",
        status: "pending",
        totalAmount: 589.97,
        notes: "Rush delivery requested",
        orderProducts: {
          create: [
            {
              productId: product1.id,
              productName: product1.name,
              quantity: 1,
              price: product1.price,
            },
            {
              productId: product2.id,
              productName: product2.name,
              quantity: 1,
              price: product2.price,
            },
          ],
        },
      },
    });
    console.log(`✓ Created order: ${order.id}`);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
