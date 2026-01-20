"use client";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
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
import { ProductDTO, ProductImage } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProductEditor } from "./useProductEditor";
import { useEffect } from "react";

const formSchema = z.object({
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

export const ProductEditor = () => {
  const { product, updateImages, save } = useProductEditor();
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
      isFeatured: product?.isFeatured ?? false,
      isEnquiryOnly: product?.isEnquiryOnly ?? false,
      category: undefined,
    },
  });

  useEffect(() => {
    const validateForm = async () => {
      await form.trigger(); // Validates all fields immediately
    };
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const updateProductImageOrder = (key: string, newPosition: number) => {
    if (!product?.images || product.images.length === 0) {
      return;
    }

    const currentImages = product.images as ProductImage[];
    const imagesCopy = [...currentImages];

    const currentIndex = imagesCopy.findIndex((img) => img.url === key);
    if (currentIndex === -1) return;

    // Remove image from current position
    const [movedImage] = imagesCopy.splice(currentIndex, 1);

    // Insert at new position
    imagesCopy.splice(newPosition, 0, movedImage);

    // Update order positions for all images
    const reorderedImages = imagesCopy.map((img, index) => ({
      ...img,
      orderPosition: index,
    })) as ProductImage[];

    updateImages(reorderedImages);
  };

  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
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
    await save(payload);
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
                  disabled={true}
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
                        <div className="flex gap-2 w-container relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              disabled={field.disabled}
                              asChild
                              className="ring-0! bg-white w-full"
                            >
                              <Button
                                id={field.name}
                                variant="outline"
                                className="flex w-full justify-between"
                              >
                                {field.value ?? "Category"}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-white w-full">
                              <DropdownMenuItem className="w-full">
                                In Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem>Out of Stock</DropdownMenuItem>
                            </DropdownMenuContent>
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
                            checked={field.value}
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
