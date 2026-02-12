"use server";
import prisma from "@/lib/prisma";

interface CategoryWithChildren {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  children: CategoryWithChildren[];
}

export const getCategories = async (): Promise<CategoryWithChildren[]> => {
  // Fetch all categories
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      parentId: true,
    },
  });

  // Build hierarchy by mapping parent-child relationships
  const categoryMap = new Map<string, CategoryWithChildren>(
    allCategories.map((cat) => [cat.id, { ...cat, children: [] }])
  );

  const rootCategories: CategoryWithChildren[] = [];
  for (const category of allCategories) {
    const catWithChildren = categoryMap.get(category.id)!;
    if (category.parentId === null) {
      rootCategories.push(catWithChildren);
    } else {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(catWithChildren);
      }
    }
  }

  return rootCategories;
};
