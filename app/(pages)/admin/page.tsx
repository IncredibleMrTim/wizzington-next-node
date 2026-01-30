import ProductList from "@/components/admin/productList/ProductList";

import adminComponents from "@/app/components/navigation/adminComponents";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { getCachedProducts } from "@/app/actions";

const AdminPage = async () => {
  const products = await getCachedProducts();

  return (
    <div>
      {adminComponents.map((component) => (
        <Link key={component.id} href={component.href} prefetch>
          <Button className="px-2 py-2">
            <FiPlus /> {component.title}
          </Button>
        </Link>
      ))}
      <ProductList products={products} />
    </div>
  );
};
export default AdminPage;
