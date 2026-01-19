import Navigation from "@/components/navigation/Navigation";
import ProductList from "@/components/admin/productList/ProductList";
import { USER_ROLE } from "@/lib/types";

const AdminPage = async () => {
  return (
    <div>
      <div className="flex justify-start">
        <Navigation type={USER_ROLE.ADMIN} />
      </div>
      <ProductList />
    </div>
  );
};
export default AdminPage;
