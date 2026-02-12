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
  console.log("Seeding production database...");

  try {
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

    console.log("✅ Production database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding production database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
