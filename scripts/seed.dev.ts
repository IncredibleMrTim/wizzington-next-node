import prisma from "../lib/prisma";

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

    // Seed categories
    const electronics = await prisma.category.create({
      data: {
        name: "Electronics",
        description: "Electronic devices and gadgets",
      },
    });
    console.log(`✓ Created category: ${electronics.name}`);

    const clothing = await prisma.category.create({
      data: {
        name: "Clothing",
        description: "Fashion and apparel",
      },
    });
    console.log(`✓ Created category: ${clothing.name}`);

    const books = await prisma.category.create({
      data: {
        name: "Books",
        description: "Books and publications",
      },
    });
    console.log(`✓ Created category: ${books.name}`);

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
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones",
        price: 199.99,
        stock: 50,
        isFeatured: true,
        categoryId: electronics.id,
        images: {
          create: [
            { url: "/images/headphones-1.jpg", orderPosition: 0 },
            { url: "/images/headphones-2.jpg", orderPosition: 1 },
          ],
        },
      },
    });
    console.log(`✓ Created product: ${product1.name}`);

    const product2 = await prisma.product.create({
      data: {
        name: "Classic T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 29.99,
        stock: 100,
        isFeatured: false,
        categoryId: clothing.id,
        images: {
          create: [{ url: "/images/tshirt-1.jpg", orderPosition: 0 }],
        },
      },
    });
    console.log(`✓ Created product: ${product2.name}`);

    const product3 = await prisma.product.create({
      data: {
        name: "JavaScript: The Good Parts",
        description: "Essential JavaScript programming guide",
        price: 34.99,
        stock: 25,
        isFeatured: true,
        categoryId: books.id,
        images: {
          create: [{ url: "/images/book-1.jpg", orderPosition: 0 }],
        },
      },
    });
    console.log(`✓ Created product: ${product3.name}`);

    // Seed sample order
    const order = await prisma.order.create({
      data: {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1234567890",
        status: "pending",
        totalAmount: 229.98,
        notes: "Please deliver before 5 PM",
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
