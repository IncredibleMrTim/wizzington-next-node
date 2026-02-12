"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface CategoryWithChildren {
  id: string;
  name: string;
  children: CategoryWithChildren[];
  position: number;
}

interface MenuItem {
  id: string;
  type: "link" | "button";
  title: string;
  href: string;
  position: number;
  items?: MenuItem[];
}

/**
 * Transform Category hierarchy to MenuItem format
 * Maps category id and name to MenuItem structure
 */
const transformCategoriesToMenuItems = (
  categories: CategoryWithChildren[],
): MenuItem[] => {
  return categories.map((cat) => ({
    id: cat.id,
    type: "link" as const,
    title: cat.name,
    position: cat.position,
    href: `/categories/${cat.id}`,
    items:
      cat.children && cat.children.length > 0
        ? transformCategoriesToMenuItems(cat.children)
        : undefined,
  }));
};

/**
 * Recursively renders menu items with proper layout and nesting
 *
 * @param content - Array of menu items to render
 * @param isTopLevel - Whether this is the top-level rendering (default: true)
 *   - true: items displayed horizontally (flex-row) only if items have sub-categories/children
 *   - false: items positioned vertically (flex-col) - used for nested sub-items
 *   - When isTopLevel is true but items have no children, displays vertically (simple list)
 *
 * @returns Rendered menu structure with ULs and LIs, where:
 *   - Each item displays its title (bold if it has children)
 *   - Child items are rendered in a recursive call below the parent title
 *   - Multiple sub-categories appear side-by-side horizontally (e.g., Figure Skating and Aerial)
 *   - Simple item lists with no sub-categories appear vertically (e.g., Pageant Wear items)
 *   - Nested items appear stacked vertically below their parent
 */
const renderMenuContent = (content: MenuItem[], isTopLevel: boolean = true) => {
  // Check if any items have children - determines if this should be horizontal or vertical
  const hasSubcategories = content.some(
    (item) => item.items && item.items.length > 0,
  );
  const shouldBeHorizontal = isTopLevel && hasSubcategories;

  return (
    <div
      className={`${shouldBeHorizontal ? "flex flex-row gap-8" : "flex flex-col gap-2"} w-max`}
    >
      {content.map((item) => (
        <ul key={item.id} className="flex flex-col">
          <li
            className={`flex flex-col${item.items ? "text-lg uppercase pb-6" : ""} pr-8`}
          >
            {item.title}
          </li>
          {item?.items ? (
            <li className="">{renderMenuContent(item?.items, false)}</li>
          ) : null}
        </ul>
      ))}
    </div>
  );
};

export const NavClient = ({
  categories,
}: {
  categories: CategoryWithChildren[];
}) => {
  const menuItems = transformCategoriesToMenuItems(categories);

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {menuItems.map((n0) => (
            <NavigationMenuItem key={n0.id}>
              {n0.items?.length ? (
                <>
                  <NavigationMenuTrigger className="font-normal">
                    {n0.title.toUpperCase()}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-10 bg-white border-0! border-t-2! rounded-none! shadow-lg! flex flex-row mt-0! p-6">
                    <NavigationMenuLink className="font-normal" href={n0.href}>
                      {renderMenuContent(
                        n0.items.sort((item) => item.position),
                      )}
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} font-normal`}
                  href={n0.href}
                >
                  {n0.title.toLocaleUpperCase()}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
