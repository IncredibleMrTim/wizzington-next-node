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
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
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
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{product.name}</h1>

        {product.description && (
          <p className="text-gray-600 text-lg whitespace-pre-wrap">
            {product.description}
          </p>
        )}

        <div className="flex gap-8 items-center">
          {price && (
            <div>
              <span className="text-3xl font-bold text-green-600">
                £{price}
              </span>
            </div>
          )}
          {product.stock !== undefined && (
            <div>
              <p className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
              </p>
            </div>
          )}
        </div>

        {product.isEnquiryOnly && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
            This item is available on enquiry only. Please add sizing details to
            make an enquiry.
          </div>
        )}
      </div>
    </div>
  );
};
