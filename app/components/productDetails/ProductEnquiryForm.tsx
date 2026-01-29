"use client";

// import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { LuUpload } from "react-icons/lu";

// import { useSession } from "next-auth/react";

import { ProductField } from "@/components/productFields/ProductField";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores";
import { fields } from "./fields";
import { ProductDTO } from "@/lib/types";
import {
  useProductFieldValidation,
  onValidationProps,
} from "@/app/hooks/useProductFieldValidation";
import Decimal from "decimal.js";

// Extract all required field names from the field definitions
// Used to validate that all mandatory fields are populated
const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

interface ProductEnquiryFormProps {
  product: ProductDTO;
}

export const ProductEnquiryForm = ({ product }: ProductEnquiryFormProps) => {
  const currentProduct = product;

  // State for storing user-provided product measurement/detail values
  const [productEnquiry, setProductEnquiry] = useState<Record<string, unknown>>(
    {},
  );

  // Get field validation state and handler from the custom hook
  const { fieldErrors, handleValidation } = useProductFieldValidation();

  // Access order state from Zustand store
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);
  const updateOrderProduct = useOrderStore((state) => state.updateOrderProduct);

  /**
   * Handles field validation when user enters/changes values
   * - Updates field error state via the hook
   * - Stores valid values in productEnquiry state
   */
  const onFieldValidation = ({ fieldName, value, type }: onValidationProps) => {
    handleValidation({ fieldName, value, type });

    // Only store the value if validation passed (no error)
    if (type !== "error") {
      setProductEnquiry((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  /**
   * Memoized validation check for the form
   * The "Add to Collection" button is only enabled when:
   * 1. All required fields are populated
   * 2. All fields pass validation (no errors)
   */
  const isValidOrderProduct = useMemo(() => {
    // Check that every required field has a value in productEnquiry
    const hasAllRequiredFields = requiredFieldNames.every(
      (fieldName) => productEnquiry[fieldName] !== undefined,
    );

    // Check that there are no validation errors across all fields
    const hasNoErrors = Object.values(fieldErrors).every(
      (error) => error === null,
    );

    // Form is valid only if both conditions are met
    return hasAllRequiredFields && hasNoErrors;
  }, [productEnquiry, fieldErrors]);

  /**
   * Adds the current product to the shopping order with user-provided details
   */
  const addProductToOrder = () => {
    // Initialize a new order if one doesn't exist yet
    if (!currentOrder) {
      setCurrentOrder({
        orderProducts: [],
        status: "pending",
        customerName: null,
        customerEmail: null,
        customerPhone: null,
        totalAmount: new Decimal(0),
        notes: null,
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Add the product to the order with all measurements and details
    updateOrderProduct({
      productId: currentProduct?.id || "",
      name: currentProduct?.name || "",
      uid: crypto.randomUUID(),
      price: currentProduct?.price || 0,
      updates: {
        id: crypto.randomUUID(),
        quantity: 1,
        ...productEnquiry, // Spread all user-provided measurements
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          {currentProduct.isEnquiryOnly ? "Enquiry Details" : "Order Details"}
        </h1>
        <p>Please add product details below</p>
      </div>

      {/* Form section */}
      <div>
        {/* Product measurement fields grid */}
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
                  onValidation={onFieldValidation}
                />
              </div>
            );
          })}
        </div>

        {/* Submit button - enabled only when form is fully populated and valid */}
        <Button
          disabled={!isValidOrderProduct}
          onClick={() => {
            if (!currentProduct) {
              alert("Product is not available");
            } else {
              addProductToOrder();
            }
          }}
          className="flex items-center gap-2 justify-center mt-4"
        >
          Add to Collection
          <LuUpload />
        </Button>
      </div>
    </div>
  );
};
