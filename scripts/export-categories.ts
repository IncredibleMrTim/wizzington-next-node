import prisma from "../lib/prisma";
import fs from "fs";
import path from "path";

interface CategoryNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  children: CategoryNode[];
}

/**
 * Builds a hierarchical tree of categories
 * Groups categories by their parent relationships
 */
const buildCategoryTree = (categories: any[]): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>();

  // Create a map of all categories
  for (const cat of categories) {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId,
      children: [],
    });
  }

  // Build the tree by linking parents and children
  const rootCategories: CategoryNode[] = [];
  for (const cat of categories) {
    const catNode = categoryMap.get(cat.id)!;
    if (cat.parentId === null) {
      rootCategories.push(catNode);
    } else {
      const parent = categoryMap.get(cat.parentId);
      if (parent) {
        parent.children.push(catNode);
      }
    }
  }

  return rootCategories;
};

/**
 * Generates TypeScript code for seeding based on database categories
 */
const generateSeedCode = (categories: CategoryNode[]): string => {
  const categoryData = JSON.stringify(categories, null, 2);

  return `import prisma from "../lib/prisma";

/**
 * Category hierarchy exported from database
 * Auto-generated from export-categories.ts
 */
const categories = ${categoryData};

/**
 * Recursively seeds categories with parent-child relationships
 */
async function seedCategoriesRecursive(
  items: typeof categories,
  parentId?: string
) {
  for (const item of items) {
    const existing = await prisma.category.findUnique({
      where: { name: item.name },
    });

    let categoryId: string;

    if (existing) {
      categoryId = existing.id;
      console.log(\`ℹ Category already exists: \${item.name}\`);

      if (existing.parentId !== parentId) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { parentId },
        });
        console.log(
          \`✓ Updated parentId for: \${item.name}\${parentId ? \` (parent: \${parentId})\` : " (root level)"}\`
        );
      }
    } else {
      const category = await prisma.category.create({
        data: {
          name: item.name,
          description: item.description,
          parentId,
        },
      });
      categoryId = category.id;
      console.log(
        \`✓ Created category: \${item.name}\${parentId ? \` (parent: \${parentId})\` : " (root level)"}\`
      );
    }

    if (item.children && item.children.length > 0) {
      await seedCategoriesRecursive(item.children, categoryId);
    }
  }
}

async function seed() {
  console.log("🌱 Seeding categories from database export...\n");

  try {
    await seedCategoriesRecursive(categories);
    console.log("\n✅ Categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
`;
};

async function main() {
  console.log("📊 Exporting categories from database...\n");

  try {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
      },
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
    });

    if (categories.length === 0) {
      console.log("❌ No categories found in database");
      return;
    }

    console.log(`✓ Found ${categories.length} categories\n`);

    // Build hierarchy
    const tree = buildCategoryTree(categories);

    // Generate seed code
    const seedCode = generateSeedCode(tree);

    // Write to file
    const outputPath = path.join(
      __dirname,
      "../scripts/seed-categories-generated.ts"
    );
    fs.writeFileSync(outputPath, seedCode);

    console.log(`✅ Generated seed file: ${outputPath}`);
    console.log(
      `\nRun this to seed: npx tsx scripts/seed-categories-generated.ts`
    );
  } catch (error) {
    console.error("❌ Error exporting categories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
