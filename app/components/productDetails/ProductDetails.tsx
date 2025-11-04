"use client";

import omit from "lodash/omit";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PiBasket } from "react-icons/pi";
import { ZodError } from "zod";

import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import {
  onValidationProps,
  ProductField,
} from "@/components/productFields/ProductField";
import { Button } from "@/components/ui/button";
import { useAddOrderMutation } from "@/services/order/useAddOrderMutation";
import { useProductStore, useOrderStore } from "@/stores";
import { sendEmail } from "@/utils/email";

import { fields } from "./fields";
import { OrderEmailTemplate } from "./orderEmailTemplate";

import { Input } from "../ui/input";
import { EnquiryEmailTemplate } from "./EnquiryEmailTemplate";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order, OrderProduct } from "@/lib/types";

export const enquiryFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
});

const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

export const ProductDetails = () => {
  const addOrderMutation = useAddOrderMutation();
  const router = useRouter();
  // States
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ZodError | null>
  >({});
  const [productDetails, setProductDetails] = useState<Record<string, unknown>>(
    {}
  );
  const [actionType, setActionType] = useState<"purchase" | "basket" | null>(
    null
  );
  const [enquiryDetails, setEnquiryDetails] = useState<Record<string, unknown>>(
    {}
  );
  const [enquiryEmailSent, setEnquiryEmailSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(enquiryFieldSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Selectors

  const clearCurrentOrder = useOrderStore((state) => state.clearCurrentOrder);
  const currentProduct = useProductStore((state) => state.currentProduct);
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const currentOrderProduct = currentOrder?.products.find(
    (product) => product.productId === currentProduct?.id
  );
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const updateOrderProduct = useOrderStore((state) => state.updateOrderProduct);

  // check if the order is valid before we show the PayPal button
  const isValidOrderProduct = useMemo(
    () =>
      Object.keys(omit(productDetails, "productId")).length >=
        requiredFieldNames.length &&
      Object.values(fieldErrors).every((error) => error === null),
    [productDetails, fieldErrors]
  );

  const enquiryValid = useMemo(
    () => Object.keys(form.formState.errors).length === 0,
    [form.formState.errors]
  );

  const addProductToOrder = () => {
    // If there is no order, create a new one

    if (!currentOrder) {
      setCurrentOrder({
        id: crypto.randomUUID(),
        products: [],
      } as Order);
    }

    // Add or update the product in the order
    updateOrderProduct({
      productId: currentProduct?.id || "",
      name: currentProduct?.name || "",
      uid: crypto.randomUUID(),
      price: currentProduct?.price || 0,
      updates: {
        id: crypto.randomUUID(),
        quantity: 1,
        ...productDetails,
      },
    });
  };
  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async (orderDetails: OrderResponseBody) => {
    const newOrder: Order = {
      id: orderDetails.id || crypto.randomUUID(),
      products: [
        {
          id: crypto.randomUUID(),
          productId: currentProduct?.id || "",
          name: currentProduct?.name || "",
          quantity: currentOrderProduct?.quantity || 1,
          price: currentProduct?.price || 0,
          uid: crypto.randomUUID(),
          ...productDetails,
        } as OrderProduct,
      ],
      total_amount: currentProduct?.price || 0,
      status: "Pending",
    };

    if (isValidOrderProduct && currentOrder) {
      addOrderMutation.mutateAsync({
        customer_name: currentOrder.customer_name ?? undefined,
        customer_email: currentOrder.customer_email ?? undefined,
        customer_phone: currentOrder.customer_phone ?? undefined,
        notes: currentOrder.notes ?? undefined,
        products: currentOrder.products.map((p) => ({
          productId: p.productId,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        })),
      });

      setActionType("purchase");

      if (process.env.SMTP_EMAIL) {
        await sendEmail({
          to: process.env.SMTP_EMAIL,
          subject: "New Order Received",
          html: OrderEmailTemplate(orderDetails, newOrder),
        });
      }
    }
  };

  /*
   * Handle validation of product fields
   * @param fieldName - The name of the field being validated
   * @param value - The value of the field being validated
   * @param type - The type of validation field
   * @returns true if there is an error, false otherwise
   */
  const handleValidation = ({ fieldName, value, type }: onValidationProps) => {
    if (type === "error") {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError,
      }));

      return true;
    }

    // remove field errors if the field is valid
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    setProductDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    return false;
  };

  const handleEnquiry = () => {
    if (
      Object.keys(form.formState.errors).length < 1 &&
      process.env.SMTP_EMAIL &&
      currentProduct
    ) {
      sendEmail({
        to: process.env.SMTP_EMAIL,
        subject: "Product Enquiry",
        html: EnquiryEmailTemplate({
          name: form.getValues().name || "",
          email: form.getValues().email || "",
          phone: form.getValues().phone || "",
          product: currentProduct,
          order: {
            id: crypto.randomUUID(),
            products: [],
            ...productDetails,
          } as Order,
        }),
      });
      setEnquiryEmailSent(true);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>Please add product details below</p>
      </div>

      <div className="flex flex-wrap flex-row gap-y-4 w-full justify-between">
        {fields.map((field, index) => {
          const [name, props] = Object.entries(field)[0];

          return (
            <div
              className={`${props.span ? "w-full" : "w-[48%]"} `}
              key={props.name || index}
            >
              <ProductField
                {...props}
                name={name}
                onValidation={handleValidation}
              />
            </div>
          );
        })}
      </div>
      {!currentProduct?.isEnquiryOnly ? (
        <div className="flex flex-row w-full items-center gap-4">
          {actionType !== "purchase" && actionType !== "basket" ? (
            <div className="flex gap-4 w-full h-full">
              <Button
                disabled={!isValidOrderProduct || !productDetails}
                onClick={() => {
                  if (!currentProduct) {
                    alert("Product is not available");
                  } else {
                    setActionType("basket");
                    addProductToOrder();
                  }
                }}
                className="flex items-center-safe justify-center"
              >
                Add to Basket <PiBasket size={20} />
              </Button>

              <div className="flex flex-col justify-center items-center w-[20px] h-3/4">
                <div className="bg-gray-200 w-[1px] h-[40%]" />

                <span
                  className={`${
                    !isValidOrderProduct || !productDetails
                      ? "text-gray-400"
                      : "text-black"
                  }`}
                >
                  or
                </span>

                <div className="bg-gray-200 w-[1px] h-[40%]" />
              </div>
              <PayPalProvider>
                <PayPalButton
                  amount="31.50"
                  onSuccess={handleSuccess}
                  disabled={!isValidOrderProduct || !productDetails}
                />
              </PayPalProvider>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              {actionType === "basket" ? (
                <>
                  <div>Your item has been added to your basket</div>
                  <Button onClick={() => router.push("/")}>View Basket</Button>
                </>
              ) : (
                <div>Thanks for your purchase</div>
              )}
              <Button
                onClick={() => {
                  router.push("/");
                  if (clearCurrentOrder) {
                    clearCurrentOrder();
                  }
                }}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4 flex-col">
          {!enquiryEmailSent ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => {
                  setEnquiryDetails(data);
                })}
              >
                <div className="flex flex-wrap  gap-y-4 w-full justify-between">
                  <div className="w-full md:w-[48%]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Contact Name"
                              className={`${
                                form.formState.errors.name
                                  ? "border-pink-300"
                                  : ""
                              }`}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              placeholder="Email Address"
                              className={`${
                                form.formState.errors.email
                                  ? "border-pink-300"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Phone Number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
              <Button
                onClick={handleEnquiry}
                disabled={
                  form.getValues("name") === "" ||
                  form.getValues("email") === "" ||
                  !isValidOrderProduct
                }
                type="submit"
              >
                Enquire
              </Button>
            </Form>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full text-lg text-pink-500">
              Thanks for your enquiry, we will contact you shortly for more
              details.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
