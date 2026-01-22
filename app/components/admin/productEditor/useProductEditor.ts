import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { ProductImage, ProductDTO } from "@/lib/types";
import {
  getProductById,
  updateProductById,
} from "@/app/actions/product.actions";
import { useProductStore } from "@/stores";

interface UseProductEditorReturn {
  product: ProductDTO | null;
  isLoading: boolean;
  updateImages: (images: ProductImage[]) => void;
  save: (values: ProductDTO, skipRedirect?: boolean) => Promise<void>;
}

export const useProductEditor = (): UseProductEditorReturn => {
  const router = useRouter();

  const params = useParams<{ id?: string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const currentProduct = useProductStore((state) => state.currentProduct);

  // Fetch product from server if productId is available and not in store
  useEffect(() => {
    if (productId && productId !== "create") {
      setIsLoading(true);
      getProductById(productId).then((fetched) => {
        if (fetched) {
          useProductStore.getState().setCurrentProduct(fetched);
        }
        setIsLoading(false);
      });
    } else {
      useProductStore.getState().clearCurrentProduct();
    }
  }, [productId]);

  const product = currentProduct;

  /* Updates the product images in the state
   * @param images - The new images to set for the product
   */
  const updateImages = useCallback((images: ProductImage[]) => {
    useProductStore.getState().updateProductImages(images);
  }, []);

  /* Saves the product, either creating a new one or updating an existing one
   * @param values - The product values to save
   * @returns A promise that resolves when the product is saved
   */
  const save = useCallback(
    (values: ProductDTO, skipRedirect?: boolean): Promise<void> => {
      return new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            let newProduct: ProductDTO | null = null;
            console.log(values.images);
            if (productId && product) {
              // If product exists, update it
              newProduct = await updateProductById(product.id, {
                name: values.name,
                description: values.description ?? undefined,
                price: values.price,
                stock: values.stock,
                isFeatured: values.isFeatured,
                isEnquiryOnly: values.isEnquiryOnly,
                category: values.categoryId
                  ? { connect: { id: values.categoryId } }
                  : undefined,
                images: values.images
                  ? {
                      deleteMany: {},
                      create: values.images.map((img) => ({
                        url: img.url,
                        orderPosition: img.orderPosition,
                      })),
                    }
                  : undefined,
              });
            } else {
              // If product does not exist, create a new one via API
              const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: values.name,
                  description: values.description ?? undefined,
                  price: values.price,
                  stock: values.stock,
                  isFeatured: values.isFeatured,
                  isEnquiryOnly: values.isEnquiryOnly,
                  category: values.categoryId
                    ? { connect: { id: values.categoryId } }
                    : undefined,
                  images: values.images
                    ? {
                        create: values.images.map((img) => ({
                          url: img.url,
                          orderPosition: img.orderPosition,
                        })),
                      }
                    : undefined,
                }),
              });

              if (!response.ok) throw new Error("Failed to create product");
              newProduct = await response.json();
            }

            if (!newProduct) throw new Error("Failed to save product");

            useProductStore.getState().updateAllProducts(newProduct);
            useProductStore.getState().clearCurrentProduct();

            // Only redirect if skipRedirect is not true
            if (!skipRedirect) {
              router.push("/admin");
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    [productId, product, router]
  );

  return {
    product,
    isLoading: isLoading || isPending,
    updateImages,
    save,
  };
};
