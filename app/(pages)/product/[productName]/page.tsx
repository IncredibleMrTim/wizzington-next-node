"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, STORE_KEYS } from "@/stores/store";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { ProductDetails } from "@/components/productDetails/ProductDetails";
import { useProductStore, useAuthStore } from "@/stores";

const ProductPage = () => {
  const params = useParams();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { getProductByName } = useGetProductQuery();
  const dispatch = useAppDispatch();
  const currentProduct = useProductStore((state) => state.currentProduct);
  const currentUser = useAuthStore((state) => state.currentUser);

  // Fetch current product is not already in state
  // this allows deep linking to product pages
  const queryResult = params.productName?.[0]
    ? getProductByName(params.productName[0])
    : null;

  useEffect(() => {
    if (!currentProduct && queryResult?.data) {
      dispatch({
        type: STORE_KEYS.SET_CURRENT_PRODUCT,
        payload: queryResult.data,
      });
    }
  }, [currentProduct, queryResult, dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <meta
        name="og:image"
        content={`${process.env.S3_PRODUCT_IMAGE_URL}${currentProduct?.images?.[0]?.url}`}
      />
      <meta
        name="og:title"
        content={`Wizzington Moo's Boutique - ${currentProduct?.name}`}
      />
      <meta
        name="og:description"
        content={`Checkout this product i found on Wizzington Moo's Boutique: ${currentProduct?.name}.`}
      />
      <meta
        name="og:url"
        content={`${
          process.env.ROOT_URL
        }/product/${currentProduct?.name?.replace(/\s+/g, "-")}`}
      />
      {/* Mobile title */}
      <h1 className="flex md:hidden">
        {currentProduct ? currentProduct?.name : "...Loading"}
      </h1>
      <div className="flex flex-col-reverse gap-8 md:gap-16 md:flex-row justify-between">
        <div className="flex flex-col gap-4 w-full md:w-3/5">
          {/* Desktop title */}
          <h1 className="hidden md:flex">
            {currentProduct ? currentProduct?.name : "...Loading"}
          </h1>
          <div className="flex flex-col gap-4">
            <p className="whitespace-pre-wrap">{currentProduct?.description}</p>
            <div className="flex items-center justify-between w-full">
              <p className="!font-bold !text-lg">
                Price: £{currentProduct?.price}
              </p>
              {/* <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.ROOT_URL}/product/${currentProduct?.name?.replace(
                    /\s+/g,
                    "-"
                  )}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 opacity-70 hover:opacity-100 transition-opacity w-auto"
              >
                Share on Facebook:
                <FaFacebook size={20} />
              </Link> */}
            </div>
            <hr className="mt-4 md:mt-auto" />
            <ProductDetails />
          </div>
        </div>
        <div className="flex flex-col justify-around w-full gap-2 overflow-hidden md:w-3/5 md:h-164 md:flex-row">
          <div className="flex relative w-full h-128 md:h-auto md:w-7/8">
            <img
              src={`${process.env.S3_PRODUCT_IMAGE_URL}${
                selectedImageUrl ?? currentProduct?.images?.[0]?.url
              }`}
              alt={currentProduct?.name}
              className="flex w-full object-cover grow-0 shrink-0"
            />
            {currentUser?.isAdmin && (
              <Link
                prefetch
                href={`/admin/product/${currentProduct?.id}`}
                className="flex p-3 border-1 self-end rounded-full bg-pink-200 opacity-60 absolute bottom-2 right-2 hover:opacity-90  hover:bg-pink-200 duration-300 transition-all"
                aria-label="Edit Product"
              >
                <FiEdit />
              </Link>
            )}
          </div>
          <div className="flex w-full shrink-0 gap-1 overflow-scroll h-32 md:h-full md:flex-col md:w-1/8">
            {currentProduct?.images?.map((image) => {
              return (
                <img
                  key={image?.url}
                  src={image?.url}
                  alt={currentProduct?.name}
                  className="border-1 object-fit border-pink-100 p-1  cursor-pointer  hover:border-pink-200 hover:shadow-lg transition-all duration-300 rounded-sm flex-shrink-0"
                  onClick={() => setSelectedImageUrl(image?.url || null)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
