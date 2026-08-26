import { getCachedProductById } from "@/actions";
import { ProductEnquiryForm } from "./ProductEnquiryForm";
import { ProductDetails } from "./ProductDetails";
import { Footer } from "@/app/components/footer/Footer";

interface ProductDetailsContainerProps {
  id: string;
}

export async function ProductDetailsContainer({
  id,
}: ProductDetailsContainerProps) {
  const product = await getCachedProductById(id);

  if (!product) {
    return (
      <div className="-m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen bg-brand-plum text-brand-cream">
        Product not found
      </div>
    );
  }

  return (
    <div className="-m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 min-h-screen bg-brand-plum">
      <div className="container mx-auto">
        <ProductDetails product={product} />

        {/* Product Details Form */}
        <div className="mt-8">
          <ProductEnquiryForm product={product} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
