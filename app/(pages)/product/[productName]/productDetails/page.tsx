"use client";

import omit from "lodash/omit";
import { useEffect, useState } from "react";
import { ZodError } from "zod";

import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import { useAddOrderMutation } from "@/services/order/useAddOrderMutation";
import { STORE_KEYS, useAppDispatch, useAppSelector, RootState } from "@/stores/store";
import { sendEmail } from "@/utils/email";

import { fields } from "./fields";
import { OrderEmailTemplate } from "@/components/emailTemplates/orderEmailTemplate";
import {
  onValidationProps,
  ProductField,
} from "@/components/productFields/ProductField";
import { Order, OrderProduct } from "@/lib/types";

const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

const SpecificationPage = () => {
  const dispatch = useAppDispatch();
  const addOrderMutation = useAddOrderMutation();

  // States
  const [isValidOrderProduct, setIsValidOrderProduct] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: ZodError | null;
  }>({});

  // Selectors

  const currentProduct = useAppSelector(
    (state: RootState) => state.products.currentProduct
  );
  const currentOrder = useAppSelector((state: RootState) => state.order.currentOrder);
  const currentOrderProduct = currentOrder?.products.find(
    (product: OrderProduct) => product.productId === currentProduct?.id
  );

  // check if the order is valid before we show the PayPal button
  useEffect(() => {
    setIsValidOrderProduct(
      Object.keys(omit(currentOrderProduct, "productId")).length >=
        requiredFieldNames.length &&
        Object.values(fieldErrors).every((error) => error === null)
    );
  }, [currentOrder, fieldErrors]);

  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async (orderDetails: OrderResponseBody) => {
    if (isValidOrderProduct && currentOrder) {
      addOrderMutation.mutateAsync({
        customer_name: currentOrder.customer_name || undefined,
        customer_email: currentOrder.customer_email || undefined,
        customer_phone: currentOrder.customer_phone || undefined,
        notes: currentOrder.notes || undefined,
        products: currentOrder.products,
      });

      await sendEmail({
        to: process.env.SMTP_EMAIL || "",
        subject: "New Order Received",
        html: OrderEmailTemplate(orderDetails, currentOrder),
      });
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

    // If there is no order, create a new one
    if (!currentOrder) {
      dispatch({
        type: STORE_KEYS.SET_CURRENT_ORDER,
        payload: {
          id: crypto.randomUUID(),
          products: [],
        } as Order,
      });
    }

    // Add or update the product in the order
    const parsedValue = parseInt(value.toString(), 10);
    dispatch({
      type: STORE_KEYS.UPDATE_ORDER_PRODUCT,
      payload: {
        productId: currentProduct?.id || "",
        name: currentProduct?.name || "",
        uid: currentOrderProduct?.uid || crypto.randomUUID(),
        price: currentProduct?.price || 0,
        updates: { [fieldName]: isNaN(parsedValue) ? value : parsedValue },
      },
    });

    return false;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>
          Fill out the form below to place your order for {currentProduct?.name}
        </p>
        <p>
          Nunc porttitor porttitor ante vitae suscipit. Donec pretium purus et
          est aliquet tempor. Mauris maximus et dolor pulvinar fringilla. In
          dignissim eros porta felis laoreet mollis. Aliquam erat volutpat.
          Etiam mollis ex ut quam pretium, eget ullamcorper erat blandit. In a
          libero eget orci malesuada ornare. Praesent vulputate eros quis quam
          aliquet, pulvinar luctus justo aliquam.
        </p>
      </div>

      <div className="flex flex-wrap flex-row gap-y-4 w-full">
        {fields.map((field, index) => {
          const [name, props] = Object.entries(field)[0];

          return (
            <div
              className={`${props.span ? "w-full" : "w-1/2"} py-2 px-4`}
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

      <PayPalProvider>
        <PayPalButton
          amount={currentProduct?.price?.toString() || "0"}
          onSuccess={handleSuccess}
          disabled={!isValidOrderProduct || !currentOrderProduct}
        />
      </PayPalProvider>
    </div>
  );
};

export default SpecificationPage;
