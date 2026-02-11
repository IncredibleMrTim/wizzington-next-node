import { NavComponent } from "./NavUserButtons";

export interface MenuItem {
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
    title: "PAGEANT WEAR",
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
 * Recursively render menu items and their nested items
 * Level 1 items (direct children of main menu) create separate columns
 */
const renderMenuItems = (
  items: MenuItem[],
  depth: number = 0,
): React.ReactNode => {
  // Check if any items have subitems - if so, we're rendering level-1 items
  const hasNestedItems = items.some(
    (item) => item.items && item.items.length > 0,
  );

  // Level 1 items with subitems should be in columns
  if (depth === 0 && hasNestedItems) {
    return (
      <div className="flex gap-8">
        {items.map((item) => (
          <div key={item.id}>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            {item.items &&
              item.items.length > 0 &&
              renderMenuItems(item.items, depth + 1)}
          </div>
        ))}
      </div>
    );
  }

  // Regular list for deeper levels
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title}
          {item.items &&
            item.items.length > 0 &&
            renderMenuItems(item.items, depth + 1)}
        </li>
      ))}
    </ul>
  );
};

const components: NavComponent[] = menuItems.map((item) => ({
  id: item.id,
  type: item.type,
  title: item.title,
  href: item.href,
  menuItems: item.items,
  content: item.items ? (
    <div className="p-4">{renderMenuItems(item.items)}</div>
  ) : null,
}));

export default components;
export { menuItems };
