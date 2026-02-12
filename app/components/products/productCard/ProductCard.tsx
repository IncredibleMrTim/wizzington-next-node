"use client";
import Link from "next/link";
import Image from "next/image";
import { ProductDTO, USER_ROLE } from "@/lib/types";
import { useSession } from "next-auth/react";
import { FiEdit } from "react-icons/fi";
import { Button } from "../../ui/button";
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
    <div className="flex flex-col p-4">
      <Link
        href={`/product/${product?.id}`}
        className="flex flex-col  text-black  mb-4 hover:opacity-75 transition-opacity"
      >
        <div className="flex flex-col  h-full">
          <div className="relative flex-1 rounded-sm overflow-hidden aspect-2/3">
            {product?.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]?.url}
                alt={product.name}
                fill
                className="w-full h-full object-cover object-top"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="relative flex flex-col gap-2 px-4 justify-center w-full">
        <p className="text-center">{product.name}</p>
        {showDescription && product.description && (
          <p className="text-gray-600 text-center">{product.description}</p>
        )}
        {price && <p className="text-green-600 text-center">£{price}</p>}
        {isAdmin && (
          <Button
            onClick={() => router.push(`/admin/product/${product.id}`)}
            aria-label="Edit Product"
            className="flex w-fit absolute top-0 right-2"
          >
            <FiEdit />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
