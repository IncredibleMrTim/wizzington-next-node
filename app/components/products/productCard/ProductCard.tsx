"use client";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useProductStore } from "@/app/stores";
import { FiEdit } from "react-icons/fi";

interface Props {
  product?: Product;
  showDescription?: boolean;
}

const ProductCard = ({ product, showDescription = true }: Props) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const setCurrentProduct = useProductStore((state) => state.setCurrentProduct);

  if (!product) return null;

  const price = product.price ? Number(product.price).toFixed(2) : null;

  return (
    <Link
      href={`/product/${product?.id}`}
      className="flex flex-col gap-2 text-black w-60 h-100 mb-8 hover:opacity-75 transition-opacity"
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="relative flex-1 rounded-sm bg-gray-100 overflow-hidden">
          {product?.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]?.url}
              alt={product.name}
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 176px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {isAdmin && (
            <Link
              prefetch
              href={`/admin/product/${product.id}`}
              className="flex p-3 mb-1 ml-1 absolute top-2 right-2 rounded-full bg-pink-200 opacity-60 hover:opacity-90 hover:bg-pink-200 duration-300 transition-all cursor-pointer"
              aria-label="Edit Product"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentProduct(product);
              }}
            >
              <FiEdit />
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2 px-4">
          <p className="line-clamp-2 font-bold! text-lg! font-">
            {product.name}
          </p>
          {showDescription && product.description && (
            <p className="text-gray-600 line-clamp-2">{product.description}</p>
          )}
          {price && <p className="text-green-600">£{price}</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
