"use client";
import { ProductDTO } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

export const ProductDetails = ({ product }: { product: ProductDTO }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.images?.[0].url || null,
  );

  const price = product.price ? Number(product.price).toFixed(2) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="flex flex-col gap-4">
        {product.images && product.images.length > 0 ? (
          <>
            <div className="relative w-full h-96">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              ) : (
                "No image available"
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-20 shrink-0 rounded border-2 transition-colors ${
                      selectedImage === img.url
                        ? "border-brand-gold"
                        : "border-[color:rgba(201,132,154,0.25)] hover:border-brand-rose"
                    }`}
                    aria-label={`Select image ${(product.images?.indexOf(img) || 0) + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} thumbnail`}
                      fill
                      className="object-cover rounded"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-brand-plum-light rounded-lg flex items-center justify-center text-brand-rose">
            No images available
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-4">
        <h1
          className="wm-h-page"
          style={{ color: "var(--color-brand-cream)" }}
        >
          {product.name}
        </h1>

        {product.description && (
          <div
            className="text-lg whitespace-pre-wrap"
            style={{ color: "rgba(245,237,232,0.65)" }}
          >
            {product.description}
          </div>
        )}

        <div className="flex gap-8 items-center">
          {price && (
            <div>
              <span
                className="text-3xl font-medium"
                style={{ color: "var(--color-brand-gold-light)" }}
              >
                £{price}
              </span>
            </div>
          )}
          {product.stock !== undefined && (
            <div>
              <div className="text-sm">
                {product.stock > 0 ? (
                  <span className="font-medium" style={{ color: "var(--color-brand-rose-light)" }}>
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="font-medium text-red-400">Out of stock</span>
                )}
              </div>
            </div>
          )}
        </div>

        {product.isEnquiryOnly && (
          <div
            className="rounded p-3 text-sm border"
            style={{
              backgroundColor: "rgba(200,169,110,0.08)",
              borderColor: "rgba(200,169,110,0.3)",
              color: "var(--color-brand-gold-light)",
            }}
          >
            This item is available on enquiry only. Please add sizing details to
            make an enquiry.
          </div>
        )}
      </div>
    </div>
  );
};
