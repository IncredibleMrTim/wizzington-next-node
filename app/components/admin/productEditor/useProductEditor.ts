import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SubmitHandler } from "react-hook-form";
import z from "zod";

import { ProductImage, ProductDTO } from "@/lib/types";
import { createProduct, getProductById, updateProductById } from "@/actions";
import { useProductStore } from "@/stores";

export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number" })
    .max(10000, { message: "Price must be less than 10000" })
    .optional(),
  stock: z
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(10000, { message: "Stock must be less than 10000" })
    .optional(),
  isFeatured: z.boolean().optional(),
  isEnquiryOnly: z.boolean().optional(),
  id: z.string().optional(),
  category: z.string().optional(),
});

interface UseProductEditorReturn {
  // Product data
  product: ProductDTO | null;
  isLoading: boolean;
  selectedFiles: File[];

  // State setters
  setSelectedFiles: (files: File[]) => void;

  // Image operations
  updateImages: (images: ProductImage[]) => void;
  updateProductImageOrder: (key: string, newPosition: number) => void;

  // File operations
  uploadAndUpdateImages: (
    productId: string,
    files: File[],
  ) => Promise<ProductImage[]>;

  // Form handlers
  handleSubmit: SubmitHandler<z.infer<typeof formSchema>>;

  // Product save
  save: (
    values: ProductDTO,
    onAfterSave?: (product: ProductDTO) => Promise<void>,
  ) => Promise<ProductDTO>;
}

export const useProductEditor = (): UseProductEditorReturn => {
  const router = useRouter();
  const params = useParams<{ id?: string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const currentProduct = useProductStore((state) => state.currentProduct);
  const product = currentProduct;

  /**
   * Fetch product from server if productId is available and not in store
   */
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

  /**
   * Updates the product images in the state
   * @param images - The new images to set for the product
   */
  const updateImages = useCallback((images: ProductImage[]) => {
    useProductStore.getState().updateProductImages(images);
  }, []);

  /**
   * Reorder product images by moving an image to a new position
   * @param key - The image URL (unique identifier)
   * @param newPosition - The new position index for the image
   */
  const updateProductImageOrder = (key: string, newPosition: number) => {
    if (!product?.images || product.images.length === 0) {
      return;
    }

    const currentImages = product.images as ProductImage[];
    const imagesCopy = [...currentImages];

    const currentIndex = imagesCopy.findIndex((img) => img.url === key);
    if (currentIndex === -1) return;

    // Remove image from current position and insert at new position
    const [movedImage] = imagesCopy.splice(currentIndex, 1);
    imagesCopy.splice(newPosition, 0, movedImage);

    // Update order positions for all images
    const reorderedImages = imagesCopy.map((img, index) => ({
      ...img,
      orderPosition: index,
    })) as ProductImage[];

    updateImages(reorderedImages);
  };

  /**
   * Uploads files to Vercel Blob and updates the product with image URLs
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
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to upload images: ${errorMessage}`);
      }
    },
    [product?.images?.length],
  );

  /**
   * Saves the product to the database (create or update)
   * Executes optional post-save operations (like file uploads) before navigating
   * @param values - The product values to save
   * @param onAfterSave - Optional callback to execute after product is saved (e.g., for file uploads)
   */
  const save = useCallback(
    (
      values: ProductDTO,
      onAfterSave?: (product: ProductDTO) => Promise<void>,
    ): Promise<ProductDTO> => {
      return new Promise((resolve, reject) => {
        startTransition(async () => {
          try {
            let newProduct: ProductDTO | null = null;

            if (productId && product) {
              // Update existing product
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
              // Create new product
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

            // Update store with new product
            useProductStore.getState().updateAllProducts(newProduct);
            useProductStore.getState().clearCurrentProduct();

            // Execute any post-save operations (e.g., file uploads)
            if (onAfterSave) {
              await onAfterSave(newProduct);
            }

            // Refresh cache and navigate to admin
            router.refresh();
            router.push("/admin");

            resolve(newProduct);
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    [productId, product, router],
  );

  /**
   * Handles form submission
   * Converts form values to ProductDTO and triggers save with file uploads if needed
   */
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    const payload: ProductDTO = {
      id: values.id || product?.id || crypto.randomUUID(),
      name: values.name,
      description: values.description ?? null,
      price: values.price ?? 0,
      stock: values.stock ?? 0,
      isFeatured: !!values.isFeatured,
      isEnquiryOnly: !!values.isEnquiryOnly,
      categoryId: values.category ?? null,
      images: (product?.images ?? []) as ProductImage[],
      createdAt: product?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    // Create callback for file uploads if there are files to upload
    const onAfterSave =
      selectedFiles.length > 0
        ? async (savedProduct: ProductDTO) => {
            try {
              const uploadedImages = await uploadAndUpdateImages(
                savedProduct.id,
                selectedFiles,
              );
              updateImages([...(product?.images ?? []), ...uploadedImages]);
              setSelectedFiles([]);
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : String(error);
              alert(errorMessage);
              throw error;
            }
          }
        : undefined;

    // Save the product and handle uploads (if any) before navigating
    await save(payload, onAfterSave);
  };

  return {
    product,
    isLoading: isLoading || isPending,
    selectedFiles,
    setSelectedFiles,
    updateImages,
    updateProductImageOrder,
    uploadAndUpdateImages,
    handleSubmit,
    save,
  };
};
