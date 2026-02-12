"use client";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import z from "zod";

import { FileUploader } from "@/components/fileUploader/FileUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProductEditor, formSchema } from "./useProductEditor";
import { useEffect } from "react";
import { CategoryWithChildren } from "@/app/actions/categories.action";

export const ProductEditor = () => {
  const {
    product,
    updateImages,
    selectedFiles,
    setSelectedFiles,
    handleSubmit,
    updateProductImageOrder,
    categories,
  } = useProductEditor();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    values: {
      id: product?.id || "",
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      isFeatured: product?.isFeatured ?? true,
      isEnquiryOnly: product?.isEnquiryOnly ?? true,
      category: product?.categoryId || undefined,
    },
  });

  useEffect(() => {
    const validateForm = async () => {
      await form.trigger(); // Validates all fields immediately
    };
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  /**
   * Recursively flattens categories with indentation for nested items
   */
  const flattenCategories = (
    categories: CategoryWithChildren[],
    level: number = 0,
  ): Array<{ id: string; name: string; level: number }> => {
    let flat: Array<{ id: string; name: string; level: number }> = [];
    for (const cat of categories) {
      flat.push({ id: cat.id, name: cat.name, level });
      if (cat.children && cat.children.length > 0) {
        flat = flat.concat(flattenCategories(cat.children, level + 1));
      }
    }
    return flat;
  };

  const renderCategories = (
    categories: CategoryWithChildren[],
    onSelect: (catId: string) => void,
  ) => {
    const flatCats = flattenCategories(categories);
    return (
      <DropdownMenuContent className="bg-white w-(--radix-dropdown-menu-trigger-width) min-w-full">
        {flatCats.map((cat) => (
          <DropdownMenuItem
            key={cat.id}
            className="w-full cursor-pointer"
            onClick={() => onSelect(cat.id)}
          >
            <span style={{ paddingLeft: `${cat.level * 16}px` }}>
              {cat.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    );
  };

  return (
    <div className="-mt-8 bg-violet-50 p-4 shadow-sm shadow-gray-300 border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} aria-controls="form">
          <div className="flex flex-col gap-6">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-xl">
                      Product Name
                    </FormLabel>
                    <FormDescription>
                      Enter the name of the product.
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          id={field.name}
                          type="text"
                          placeholder="Product Name"
                        />
                      </div>
                    </FormControl>
                    <FormMessage aria-live="assertive" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-xl">
                      Description
                    </FormLabel>
                    <FormDescription>
                      Enter the product description.
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Textarea
                          {...field}
                          id={field.name}
                          placeholder="Product Description"
                          className="border-0 border-b border-gray-300 rounded-none focus:ring-0!"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 justify-between">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel htmlFor={field.name} className="text-xl">
                      Price
                    </FormLabel>
                    <FormDescription>
                      Enter the product price (£).
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          placeholder="Price"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-xl" htmlFor={field.name}>
                      Stock Level
                    </FormLabel>
                    <FormDescription>
                      Enter the product stock level.
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          type="number"
                          placeholder="Stock"
                          id={field.name}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-xl">
                        Product Category
                      </FormLabel>
                      <FormDescription>
                        Select product category.
                      </FormDescription>
                      <FormControl className="w-full">
                        <div className="flex gap-2 w-full">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className="ring-0! bg-white w-full"
                            >
                              <Button
                                id={field.name}
                                variant="outline"
                                className="flex w-full justify-between"
                              >
                                {flattenCategories(categories).find(
                                  (cat) => cat.id === field.value,
                                )?.name ?? "Category"}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            {renderCategories(categories, (catId) =>
                              field.onChange(catId),
                            )}
                          </DropdownMenu>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl" htmlFor={field.name}>
                        Feature Product
                      </FormLabel>
                      <FormDescription>
                        Marking a product as Featured will display it on the
                        home page.
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <p>Check this box to feature the product.</p>
                          <Checkbox
                            id={field.name}
                            checked={field.value}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                            disabled={field.disabled}
                            className={`h-4 w-4 bg-white border-gray-500 ${
                              form.getValues("isFeatured") === true
                                ? "bg-pink-500 border-pink-500 text-white"
                                : ""
                            }`}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="isEnquiryOnly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl" htmlFor={field.name}>
                        Enquiry Only
                      </FormLabel>
                      <FormDescription>
                        Marking this product as Enquiry Only will hide the
                        payment methods and only allow the user to send an
                        enquiry email.
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <p>
                            Check this box to mark the product as Enquiry Only.
                          </p>
                          <Checkbox
                            className={`h-4 w-4 bg-white border-gray-500 ${
                              form.getValues("isEnquiryOnly") === true
                                ? "bg-pink-500 border-pink-500 text-white"
                                : ""
                            }`}
                            id={field.name}
                            checked={field.value || true}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                            disabled={field.disabled}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div key={product?.id}>
                {/* FileUploader component for uploading images */}
                <FileUploader
                  product={product!}
                  updateProductImages={updateImages}
                  updateProductImageOrder={updateProductImageOrder}
                  selectedFiles={selectedFiles}
                  onFilesSelected={setSelectedFiles}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.replace("/admin")}
            >
              <FiArrowLeft />
              Cancel
            </Button>

            <Button
              role="submit"
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="flex items-center gap-2"
              aria-label={`Submit ${
                product ? "Update" : "Create"
              } product form`}
            >
              <FiCheck />
              {product ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
