import { NavComponent } from "./Navigation";

const components: NavComponent[] = [
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
    content: (
      <div className="p-4">
        <ul>
          <li>Glitz dresses</li>
          <li>Natural dresses</li>
          <li>Casual wear</li>
          <li>OOC/fun fashion</li>
          <li>Swimwear</li>
          <li>Other</li>
          <li>Accessories</li>
          <li>Gallery</li>
        </ul>
      </div>
    ),
  },
  {
    id: "dance-wear",
    type: "link",

    title: "Dance wear",
    href: "/docs/primitives/hover-card",
    content: (
      <div className="flex p-4 gap-8">
        <div>
          <h2>Figure Skating</h2>
          <ul>
            <li>Lyrical</li>
            <li>Modern</li>
            <li>Jazz</li>
            <li>Tap</li>
            <li>Character inspired</li>
            <li>Acro</li>
            <li>Stretch</li>
            <li>Pancake tutus</li>
            <li>Hand painted</li>
            <li>Airbrush</li>
            <li>Other</li>
            <li>Accessories</li>
            <li>Gallery</li>
          </ul>
        </div>

        <div>
          <h2>Aerial</h2>
          <ul>
            <li>Lyrical</li>
            <li>Modern</li>
            <li>Jazz</li>
            <li>Tap</li>
            <li>Character inspired</li>
            <li>Acro</li>
            <li>Stretch</li>
            <li>Pancake tutus</li>
            <li>Hand painted</li>
            <li>Airbrush</li>
            <li>Other</li>
            <li>Accessories</li>
            <li>Gallery</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default components;
