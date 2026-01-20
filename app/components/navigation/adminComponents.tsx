import { NavComponent } from "./Navigation";
import { FiPlus } from "react-icons/fi";

const components: NavComponent[] = [
  {
    id: "new-product",
    type: "button",
    title: "New Product",
    href: "/admin/product/create",
    icon: <FiPlus className="text-white" />,
  },
];

export default components;
