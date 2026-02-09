import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { ProductImage, ProductDTO } from "@/lib/types";
import { createProduct, getProductById, updateProductById } from "@/actions";
import { useProductStore } from "@/stores";

interface UseProductEditorReturn {
  product: ProductDTO | null;
  isLoading: boolean;
  updateImages: (images: ProductImage[]) => void;
  save: (values: ProductDTO, skipRedirect?: boolean) => Promise<ProductDTO>;
  uploadAndUpdateImages: (productId: string, files: File[]) => Promise<ProductImage[]>;
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

  /* Uploads files to Vercel Blob and updates the product with image URLs
   * @param productId - The product ID to update
   * @param files - Files to upload
   */
  const uploadAndUpdateImages = useCallback(
    async (productId: string, files: File[]) => {
      try {
        const { upload } = await import("@vercel/blob/client");

        const uploadPromises = files.map(async (file) => {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload/blob",
          });

          return {
            id: crypto.randomUUID(),
            productId: productId,
            url: blob.url,
            orderPosition: product?.images?.length ?? 0,
            createdAt: new Date(),
          };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Update product with uploaded images
        await updateProductById(productId, {
          images: {
            deleteMany: {},
            create: uploadedImages.map((img) => ({
              url: img.url,
              orderPosition: img.orderPosition,
            })),
          },
        });

        return uploadedImages;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to upload images: ${errorMessage}`);
      }
    },
    [product?.images?.length],
  );

  /* Saves the product, either creating a new one or updating an existing one
   * @param values - The product values to save
   * @returns A promise that resolves when the product is saved
   */
  const save = useCallback(
    (values: ProductDTO, skipRedirect?: boolean): Promise<ProductDTO> => {
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
              newProduct = await createProduct({
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
              });
            }

            if (!newProduct) throw new Error("Failed to save product");

            useProductStore.getState().updateAllProducts(newProduct);
            useProductStore.getState().clearCurrentProduct();

            // Only redirect if skipRedirect is not true
            if (!skipRedirect) {
              // Refresh server-side data to ensure revalidated cache is used
              router.refresh();
              // Navigate after refresh to ensure fresh cache is fetched
              router.push("/admin");
            }
            resolve(newProduct);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    [productId, product, router],
  );

  return {
    product,
    isLoading: isLoading || isPending,
    updateImages,
    save,
    uploadAndUpdateImages,
  };
};
