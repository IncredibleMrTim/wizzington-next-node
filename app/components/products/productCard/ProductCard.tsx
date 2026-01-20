"use client";
import Link from "next/link";
import Image from "next/image";
import { ProductDTO, USER_ROLE } from "@/lib/types";
import { useSession } from "next-auth/react";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Props {
  product?: ProductDTO;
  showDescription?: boolean;
}

const ProductCard = ({ product, showDescription = true }: Props) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === USER_ROLE.ADMIN;

  const router = useRouter();

  if (!product) return null;

  const price = product.price ? Number(product.price).toFixed(2) : null;

  return (
    <div className="relative">
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/admin/product/${product.id}`);
          }}
          className="flex p-3 mb-1 ml-1 absolute top-2 right-2 rounded-full bg-pink-200 opacity-60 hover:opacity-90 hover:bg-pink-200 duration-300 transition-all cursor-pointer z-2"
          aria-label="Edit Product"
        >
          <FiEdit />
        </button>
      )}
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
          </div>

          <div className="flex flex-col gap-2 px-4 justify-center w-full">
            <p className="text-center">{product.name}</p>
            {showDescription && product.description && (
              <p className="text-gray-600 text-center">{product.description}</p>
            )}
            {price && <p className="text-green-600 text-center">£{price}</p>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
