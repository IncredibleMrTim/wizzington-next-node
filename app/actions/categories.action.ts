"use server";
import prisma from "@/lib/prisma";

export interface CategoryWithChildren {
  id: string;
  name: string;
  description: string | null;
  position: number;
  parentId: string | null;
  children: CategoryWithChildren[];
}

/**
 * Recursively sorts categories and their children by position
 */
const sortCategoriesByPosition = (
  categories: CategoryWithChildren[],
): CategoryWithChildren[] => {
  return categories
    .sort((a, b) => a.position - b.position)
    .map((cat) => ({
      ...cat,
      children:
        cat.children && cat.children.length > 0
          ? sortCategoriesByPosition(cat.children)
          : [],
    }));
};

export const getCategories = async (): Promise<CategoryWithChildren[]> => {
  // Fetch all categories sorted by position
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      position: true,
      parentId: true,
    },
    orderBy: [{ parentId: "asc" }, { position: "asc" }],
  });

  // Build hierarchy by mapping parent-child relationships
  const categoryMap = new Map<string, CategoryWithChildren>(
    allCategories.map((cat) => [cat.id, { ...cat, children: [] }]),
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

  // Recursively sort all levels by position
  return sortCategoriesByPosition(rootCategories);
};

export const getCategoriesByParent = async (parentId: string) =>
  await prisma.category.findMany({
    where: { id: parentId },
    include: { children: true },
  });

export const getCategoryById = async (id: string) =>
  await prisma.category.findFirst({
    where: { id },
    include: { children: true },
  });
