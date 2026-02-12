import prisma from "../lib/prisma";

interface MenuItem {
  id: string;
  type: "link" | "button";
  title: string;
  href: string;
  items?: MenuItem[];
}

/**
 * Menu items from navigation - defines the category hierarchy
 * Excludes "Home" as it's not a product category
 */
const menuItems: MenuItem[] = [
  {
    id: "pageant-wear",
    type: "link",
    title: "Pageant Wear",
    href: "/docs/primitives/alert-dialog",
    items: [
      {
        id: "glitz-dresses",
        type: "link",
        title: "Glitz dresses",
        href: "/pageant/glitz",
      },
      {
        id: "natural-dresses",
        type: "link",
        title: "Natural dresses",
        href: "/pageant/natural",
      },
      {
        id: "casual-wear",
        type: "link",
        title: "Casual wear",
        href: "/pageant/casual",
      },
      {
        id: "ooc-fun-fashion",
        type: "link",
        title: "OOC/fun fashion",
        href: "/pageant/ooc",
      },
      {
        id: "swimwear",
        type: "link",
        title: "Swimwear",
        href: "/pageant/swimwear",
      },
      {
        id: "pageant-other",
        type: "link",
        title: "Other",
        href: "/pageant/other",
      },
      {
        id: "pageant-accessories",
        type: "link",
        title: "Accessories",
        href: "/pageant/accessories",
      },
      {
        id: "pageant-gallery",
        type: "link",
        title: "Gallery",
        href: "/pageant/gallery",
      },
    ],
  },
  {
    id: "dance-wear",
    type: "link",
    title: "Dance wear",
    href: "/docs/primitives/hover-card",
    items: [
      {
        id: "figure-skating",
        type: "link",
        title: "Figure Skating",
        href: "/dance/figure-skating",
        items: [
          {
            id: "lyrical",
            type: "link",
            title: "Lyrical",
            href: "/dance/figure-skating/lyrical",
          },
          {
            id: "modern",
            type: "link",
            title: "Modern",
            href: "/dance/figure-skating/modern",
          },
          {
            id: "jazz",
            type: "link",
            title: "Jazz",
            href: "/dance/figure-skating/jazz",
          },
          {
            id: "tap",
            type: "link",
            title: "Tap",
            href: "/dance/figure-skating/tap",
          },
          {
            id: "character-inspired",
            type: "link",
            title: "Character inspired",
            href: "/dance/figure-skating/character",
          },
          {
            id: "acro",
            type: "link",
            title: "Acro",
            href: "/dance/figure-skating/acro",
          },
          {
            id: "stretch",
            type: "link",
            title: "Stretch",
            href: "/dance/figure-skating/stretch",
          },
          {
            id: "pancake-tutus",
            type: "link",
            title: "Pancake tutus",
            href: "/dance/figure-skating/pancake-tutus",
          },
          {
            id: "hand-painted",
            type: "link",
            title: "Hand painted",
            href: "/dance/figure-skating/hand-painted",
          },
          {
            id: "airbrush",
            type: "link",
            title: "Airbrush",
            href: "/dance/figure-skating/airbrush",
          },
          {
            id: "fs-other",
            type: "link",
            title: "Other",
            href: "/dance/figure-skating/other",
          },
          {
            id: "fs-accessories",
            type: "link",
            title: "Accessories",
            href: "/dance/figure-skating/accessories",
          },
          {
            id: "fs-gallery",
            type: "link",
            title: "Gallery",
            href: "/dance/figure-skating/gallery",
          },
        ],
      },
      {
        id: "aerial",
        type: "link",
        title: "Aerial",
        href: "/dance/aerial",
        items: [
          {
            id: "aerial-lyrical",
            type: "link",
            title: "Lyrical",
            href: "/dance/aerial/lyrical",
          },
          {
            id: "aerial-modern",
            type: "link",
            title: "Modern",
            href: "/dance/aerial/modern",
          },
          {
            id: "aerial-jazz",
            type: "link",
            title: "Jazz",
            href: "/dance/aerial/jazz",
          },
          {
            id: "aerial-tap",
            type: "link",
            title: "Tap",
            href: "/dance/aerial/tap",
          },
          {
            id: "aerial-character-inspired",
            type: "link",
            title: "Character inspired",
            href: "/dance/aerial/character",
          },
          {
            id: "aerial-acro",
            type: "link",
            title: "Acro",
            href: "/dance/aerial/acro",
          },
          {
            id: "aerial-stretch",
            type: "link",
            title: "Stretch",
            href: "/dance/aerial/stretch",
          },
          {
            id: "aerial-pancake-tutus",
            type: "link",
            title: "Pancake tutus",
            href: "/dance/aerial/pancake-tutus",
          },
          {
            id: "aerial-hand-painted",
            type: "link",
            title: "Hand painted",
            href: "/dance/aerial/hand-painted",
          },
          {
            id: "aerial-airbrush",
            type: "link",
            title: "Airbrush",
            href: "/dance/aerial/airbrush",
          },
          {
            id: "aerial-other",
            type: "link",
            title: "Other",
            href: "/dance/aerial/other",
          },
          {
            id: "aerial-accessories",
            type: "link",
            title: "Accessories",
            href: "/dance/aerial/accessories",
          },
          {
            id: "aerial-gallery",
            type: "link",
            title: "Gallery",
            href: "/dance/aerial/gallery",
          },
        ],
      },
    ],
  },
];

/**
 * Recursively creates categories from menuItems structure
 * Maintains parent-child relationships via parentId
 *
 * @param items - Array of menu items to create as categories
 * @param parentId - ID of parent category (undefined for root-level items)
 * @returns Map of created category IDs by their item ID
 */
async function seedCategoriesRecursive(
  items: MenuItem[],
  parentId?: string
): Promise<Map<string, string>> {
  const categoryIdMap = new Map<string, string>();

  for (const item of items) {
    // Check if category already exists by name and parentId
    const existing = await prisma.category.findFirst({
      where: { name: item.title, parentId },
    });

    let categoryId: string;

    if (existing) {
      categoryId = existing.id;
      console.log(`ℹ Category already exists: ${item.title}`);

      // Update parentId if different
      if (existing.parentId !== parentId) {
        await prisma.category.update({
          where: { id: existing.id },
          data: { parentId },
        });
        console.log(
          `✓ Updated parentId for: ${item.title}${parentId ? ` (parent: ${parentId})` : " (root level)"}`
        );
      }
    } else {
      // Create new category
      const category = await prisma.category.create({
        data: {
          name: item.title,
          description: undefined,
          parentId,
        },
      });
      categoryId = category.id;
      console.log(
        `✓ Created category: ${item.title}${parentId ? ` (parent: ${parentId})` : " (root level)"}`
      );
    }

    categoryIdMap.set(item.id, categoryId);

    // Recursively process child items
    if (item.items && item.items.length > 0) {
      const childMap = await seedCategoriesRecursive(item.items, categoryId);
      childMap.forEach((id, key) => categoryIdMap.set(key, id));
    }
  }

  return categoryIdMap;
}

async function seed() {
  console.log("🌱 Seeding categories from menuItems...\n");

  try {
    await seedCategoriesRecursive(menuItems);
    console.log("\n✅ Categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
