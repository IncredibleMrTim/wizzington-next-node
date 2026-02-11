import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "../separator/Separator";

interface MenuItem {
  id: string;
  type: "link" | "button";
  title: string;
  href: string;
  items?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    type: "link",
    title: "Home",
    href: "/",
  },
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

export const Nav = () => {
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
                  <NavigationMenuLink className="font-normal">
                    {renderMenuContent(n0.items)}
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} font-normal`}
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
