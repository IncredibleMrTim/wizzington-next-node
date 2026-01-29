import { getCachedProductById } from "@/actions";
import { ProductEnquiryForm } from "./ProductEnquiryForm";
import { ProductDetails } from "./ProductDetails";

interface ProductDetailsContainerProps {
  id: string;
}

export async function ProductDetailsContainer({
  id,
}: ProductDetailsContainerProps) {
  const product = await getCachedProductById(id);

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductDetails product={product} />

      {/* Product Details Form */}
      <div className="mt-8">
        <ProductEnquiryForm product={product} />
      </div>
    </div>
  );
}
