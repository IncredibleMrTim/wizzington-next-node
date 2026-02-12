import prisma from "../lib/prisma";

interface CategoryData {
  name: string;
  description: string | null;
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
    } else {
      const category = await prisma.category.create({
        data: {
          name: item.name,
          description: item.description,
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
  console.log("Seeding production database...");

  try {
    // Seed categories from menu structure
    const categories: CategoryData[] = [
      {
        name: "Dance wear",
        description: null,
        children: [
          {
            name: "Aerial",
            description: null,
            children: [
              { name: "Accessories", description: null, children: [] },
              { name: "Acro", description: null, children: [] },
              { name: "Airbrush", description: null, children: [] },
              { name: "Character inspired", description: null, children: [] },
              { name: "Gallery", description: null, children: [] },
              { name: "Hand painted", description: null, children: [] },
              { name: "Jazz", description: null, children: [] },
              { name: "Lyrical", description: null, children: [] },
              { name: "Modern", description: null, children: [] },
              { name: "Other", description: null, children: [] },
              { name: "Pancake tutus", description: null, children: [] },
              { name: "Stretch", description: null, children: [] },
              { name: "Tap", description: null, children: [] },
            ],
          },
          {
            name: "Figure Skating",
            description: null,
            children: [
              { name: "Accessories", description: null, children: [] },
              { name: "Acro", description: null, children: [] },
              { name: "Airbrush", description: null, children: [] },
              { name: "Character inspired", description: null, children: [] },
              { name: "Gallery", description: null, children: [] },
              { name: "Hand painted", description: null, children: [] },
              { name: "Jazz", description: null, children: [] },
              { name: "Lyrical", description: null, children: [] },
              { name: "Modern", description: null, children: [] },
              { name: "Other", description: null, children: [] },
              { name: "Pancake tutus", description: null, children: [] },
              { name: "Stretch", description: null, children: [] },
              { name: "Tap", description: null, children: [] },
            ],
          },
        ],
      },
      {
        name: "Pageant Wear",
        description: null,
        children: [
          { name: "Casual wear", description: null, children: [] },
          { name: "Glitz dresses", description: null, children: [] },
          { name: "Natural dresses", description: null, children: [] },
          { name: "OOC/fun fashion", description: null, children: [] },
          { name: "Swimwear", description: null, children: [] },
        ],
      },
    ];

    await seedCategoriesRecursive(categories);
    console.log("✓ Seeded categories");

    console.log("✅ Production database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding production database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
