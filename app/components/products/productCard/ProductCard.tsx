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
    <div className="wm-scope flex flex-col overflow-hidden rounded m-2 border border-[color:rgba(201,132,154,0.12)] bg-[color:var(--wm-plum-mid)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
      <Link
        href={`/product/${product?.id}`}
        className="flex flex-col transition-opacity"
      >
        <div className="flex flex-col h-full">
          <div className="relative flex-1 overflow-hidden aspect-2/3 bg-[color:var(--wm-plum-light)]">
            {product?.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]?.url}
                alt={product.name}
                fill
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[color:var(--wm-rose)]">
                No image
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="relative flex flex-col gap-2 px-4 py-4 justify-center w-full">
        <div
          className="wm-h-card text-center"
          style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
        >
          {product.name}
        </div>
        {showDescription && product.description && (
          <div
            className="text-center text-sm"
            style={{ color: "rgba(245,237,232,0.6)", fontFamily: "var(--font-wm-body)" }}
          >
            {product.description}
          </div>
        )}
        {price && (
          <div
            className="text-center text-lg font-medium"
            style={{ color: "var(--wm-gold-light)", fontFamily: "var(--font-wm-body)" }}
          >
            £{price}
          </div>
        )}
        {isAdmin && (
          <Button
            onClick={() => router.push(`/admin/product/${product.id}`)}
            aria-label="Edit Product"
            className="flex w-fit absolute top-2 right-2"
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
