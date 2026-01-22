"use client";

import omit from "lodash/omit";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PiBasket } from "react-icons/pi";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import ReactDOMServer from "react-dom/server";
import dynamic from "next/dynamic";

// Lazy load heavy PayPal components
const PayPalButton = dynamic(
  () => import("@/components/payPal/payPalButton/PayPalButton"),
  { ssr: false, loading: () => null }
);

const PayPalProvider = dynamic(
  () => import("@/components/payPal/payPalProvider/PayPalProvider"),
  { ssr: false, loading: () => null }
);

import {
  onValidationProps,
  ProductField,
} from "@/components/productFields/ProductField";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/actions/order.actions";
import { useOrderStore } from "@/stores";
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
import { OrderProduct, ProductDTO } from "@/lib/types";

export const enquiryFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
});

const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

interface ProductDetailsFormProps {
  product: ProductDTO;
}

export const ProductDetailsForm = ({ product }: ProductDetailsFormProps) => {
  const router = useRouter();
  const currentProduct = product;

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ZodError | null>
  >({});
  const [productDetails, setProductDetails] = useState<Record<string, unknown>>(
    {}
  );
  const [actionType, setActionType] = useState<"purchase" | "basket" | null>(
    null
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

  const currentOrder = useOrderStore((state) => state.currentOrder);
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const updateOrderProduct = useOrderStore((state) => state.updateOrderProduct);
  const clearCurrentOrder = useOrderStore((state) => state.clearCurrentOrder);

  const isValidOrderProduct = useMemo(
    () =>
      Object.keys(omit(productDetails, "productId")).length >=
        requiredFieldNames.length &&
      Object.values(fieldErrors).every((error) => error === null),
    [productDetails, fieldErrors]
  );

  const addProductToOrder = () => {
    if (!currentOrder) {
      setCurrentOrder({
        orderProducts: [],
        status: "pending",
        customerName: null,
        customerEmail: null,
        customerPhone: null,
        totalAmount: new Prisma.Decimal(0),
        notes: null,
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

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

  const handleSuccess = async (orderDetails: any) => {
    if (isValidOrderProduct && currentOrder) {
      await createOrder({
        customer_name: currentOrder.customerName || undefined,
        customer_email: currentOrder.customerEmail || undefined,
        customer_phone: currentOrder.customerPhone || undefined,
        notes: currentOrder.notes || undefined,
        products: currentOrder.orderProducts.map((product) => ({
          productId: product.productId,
          name: product.productName,
          quantity: product.quantity,
          price: Number(product.price),
        })),
      });

      setActionType("purchase");

      if (process.env.SMTP_EMAIL) {
        await sendEmail({
          to: process.env.SMTP_EMAIL,
          subject: "New Order Received",
          html: ReactDOMServer.renderToStaticMarkup(
            OrderEmailTemplate(orderDetails, currentOrder)
          ),
        });
      }
    }
  };

  const handleValidation = ({ fieldName, value, type }: onValidationProps) => {
    if (type === "error") {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError,
      }));
      return true;
    }

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
              className={props.span ? "w-full" : "w-[48%]"}
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

              <div className="flex flex-col justify-center items-center w-5 h-3/4">
                <div className="bg-gray-200 w-px h-[40%]" />
                <span
                  className={
                    !isValidOrderProduct || !productDetails
                      ? "text-gray-400"
                      : "text-black"
                  }
                >
                  or
                </span>
                <div className="bg-gray-200 w-px h-[40%]" />
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
      ) : null}
    </div>
  );
};
