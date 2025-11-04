import { Schema } from "amplify/data/resource";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ProductQueryKeys } from "@/services/product/keys";
import { useAddProductMutation } from "@/services/product/useAddProductMutation";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { useUpdateProductMutation } from "@/services/product/useUpdateProductMutation";
import { STORE_KEYS, useAppDispatch, useAppSelector } from "@/stores/store";
import { useQueryClient } from "@tanstack/react-query";

export const useProductEditor = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const productIdSearchParam = params.get("productId");

  const addMutation = useAddProductMutation();
  const updateMutation = useUpdateProductMutation();
  const queryClient = useQueryClient();

  // Get the current product from the store if available
  const currentProduct = useAppSelector((s) => s.products.currentProduct);

  // get the product from the backend if productId is available
  // this allow the user to refresh the page and still get the product
  const { data: fetched } = useGetProductQuery().getProductById({
    id: productIdSearchParam ?? "",
    enabled: !!productIdSearchParam && !currentProduct,
  });

  // currentProduct if is exists otherwise the fetched product
  const product = useMemo(
    () => currentProduct || fetched || null,
    [currentProduct, fetched]
  );

  /* Updates the product images in the state
   * @param images - The new images to set for the product
   */
  const updateImages = useCallback(
    (images: Schema["Product"]["type"]["images"]) => {
      dispatch({ type: STORE_KEYS.UPDATE_PRODUCT_IMAGES, payload: images });
    },
    [product, dispatch]
  );

  /* Saves the product, either creating a new one or updating an existing one
   * @param values - The product values to save
   * @returns A promise that resolves when the product is saved
   */
  const save = useCallback(
    async (values: Schema["Product"]["type"]): Promise<void> => {
      let newProduct: Schema["Product"]["type"];

      if (productIdSearchParam) {
        // If product exists, update it
        newProduct = await updateMutation.mutateAsync({
          ...product,
          ...values,
        });
      } else {
        // If product does not exist, create a new one
        newProduct = await addMutation.mutateAsync({
          ...values,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          id: values.id || crypto.randomUUID(),
        } as Schema["Product"]["type"]);
      }

      // update allProducts with the new or updated product
      dispatch({
        type: STORE_KEYS.UPDATE_ALL_PRODUCTS_WITH_NEW_PRODUCT,
        payload: newProduct,
      });

      // Clear current product from state so that the editor resets
      dispatch({
        type: STORE_KEYS.CLEAR_CURRENT_PRODUCT,
      });

      // remove the product from the query cache
      queryClient.removeQueries({
        queryKey: [ProductQueryKeys.GET_PRODUCT, product?.id],
        exact: true,
      });

      router.push("/admin");
    },
    [product, addMutation, updateMutation, dispatch, queryClient, router]
  );

  return {
    product,
    isLoading: !product,
    updateImages,
    save,
  };
};
