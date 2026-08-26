import type { Metadata } from "next";
import { ProductEditor } from "@/components/admin/productEditor/ProductEditor";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const AdminProductsPage = async () => {
  return <ProductEditor />;
};
export default AdminProductsPage;
