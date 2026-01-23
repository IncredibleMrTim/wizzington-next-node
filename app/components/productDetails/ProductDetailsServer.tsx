import Image from "next/image";
import { getCachedProductById } from "@/app/actions";
import { ProductDetailsForm } from "./ProductDetails";
// import { AdminTools } from "./AdminTools";

interface ProductDetailsServerProps {
  id: string;
}

export async function ProductDetailsSection({ id }: ProductDetailsServerProps) {
  const product = await getCachedProductById(id);

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  const price = product.price ? Number(product.price).toFixed(2) : null;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="relative w-full h-96">
                <Image
                  src={product.images[0]?.url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 shrink-0">
                      <Image
                        src={img.url}
                        alt="thumbnail"
                        fill
                        className="object-cover rounded cursor-pointer"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              No images available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>

          {product.description && (
            <p className="text-gray-600 text-lg">{product.description}</p>
          )}

          <div className="flex gap-4 items-center">
            {price && (
              <span className="text-3xl font-bold text-green-600">
                £{price}
              </span>
            )}
            {product.stock !== undefined && (
              <span className="text-sm text-gray-500">
                Stock:{" "}
                {product.stock > 0
                  ? `${product.stock} available`
                  : "Out of stock"}
              </span>
            )}
          </div>

          {product.isEnquiryOnly && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
              This item is available on enquiry only. Please contact us for more
              information.
            </div>
          )}

          {/* <AdminTools /> */}
        </div>
      </div>

      {/* Product Details Form */}
      <div className="mt-8">
        <ProductDetailsForm product={product} />
      </div>
    </div>
  );
}
