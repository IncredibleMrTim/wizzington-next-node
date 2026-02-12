"use server";
import prisma from "@/lib/prisma";

interface CategoryWithChildren {
  id: string;
  name: string;
  description: string | null;
  position: number;
  parentId: string | null;
  children: CategoryWithChildren[];
}

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

  // Sort root categories by position
  rootCategories.sort((a, b) => a.position - b.position);

  // Sort children by position
  rootCategories.forEach((cat) => {
    if (cat.children && cat.children.length > 0) {
      cat.children.sort((a, b) => a.position - b.position);
    }
  });

  return rootCategories;
};
