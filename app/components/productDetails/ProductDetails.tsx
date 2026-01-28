"use client";

import omit from "lodash/omit";
// import { useRouter } from "next/navigation";
import { useMemo, useState, useActionState } from "react";

import { LuMail, LuUpload } from "react-icons/lu";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// import { useSession } from "next-auth/react";

import {
  onValidationProps,
  ProductField,
} from "@/components/productFields/ProductField";
import { Button } from "@/components/ui/button";
// import { createOrder } from "@/actions/order.actions";
import { useOrderStore } from "@/stores";

import { fields } from "./fields";
import { OrderEmailTemplate } from "./orderEmailTemplate";
import { handleEnquiryAction } from "@/actions/enquiry.actions";

import z from "zod";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { ProductDTO } from "@/lib/types";

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
  const currentProduct = product;
  // const { status: authState } = useSession();
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ZodError | null>
  >({});
  const [productDetails, setProductDetails] = useState<Record<string, unknown>>(
    {},
  );

  const currentOrder = useOrderStore((state) => state.currentOrder);
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const updateOrderProduct = useOrderStore((state) => state.updateOrderProduct);

  const [enquiryState, submitEnquiry, isPending] = useActionState(
    handleEnquiryAction,
    { success: false, message: "" },
  );

  const isValidOrderProduct = useMemo(
    () =>
      Object.keys(omit(productDetails, "productId")).length >=
        requiredFieldNames.length &&
      Object.values(fieldErrors).every((error) => error === null),
    [productDetails, fieldErrors],
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
        <h1 className="text-2xl font-bold">
          {currentProduct.isEnquiryOnly ? "Enquiry Details" : "Order Details"}
        </h1>
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

      <div className="flex flex-row w-full items-center gap-4">
        <div className="flex gap-4 w-full h-full">
          <Button
            disabled={!isValidOrderProduct || !productDetails}
            onClick={() => {
              if (!currentProduct) {
                alert("Product is not available");
              } else {
                addProductToOrder();
              }
            }}
            className="flex items-center-safe justify-center"
          >
            <div className="flex justify-between gap-2">
              Add to Collection
              <LuUpload />
            </div>
          </Button>
          {/* 
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

          <Button
            disabled={!isValidOrderProduct || !productDetails || isPending}
            onClick={() => {
              addProductToOrder();

              // const emailHtml = ReactDOMServer.renderToStaticMarkup(
              //   OrderEmailTemplate(productDetails as any, currentOrder as any),
              // );
              // submitEnquiry({
              //   emailHtml,
              // });
            }}
            className="flex items-center-safe justify-center"
          >
            {isPending ? "Sending..." : "Enquire Now"}
            <LuMail size={20} />
          </Button> */}
        </div>
      </div>
    </div>
  );
};
