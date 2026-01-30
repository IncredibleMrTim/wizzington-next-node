import { useState } from "react";
import { ZodError } from "zod";

export enum Variant {
  NUMBER = "number",
  TEXTAREA = "textarea",
  TEXT = "text",
  DATE = "date",
  HIDDEN = "hidden",
  ERROR = "error",
}

export interface onValidationProps {
  fieldName: string;
  value: ZodError | string | number | Date;
  type?: Variant;
}

export const useProductFieldValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ZodError | null>
  >({});

  const handleValidation = ({ fieldName, type, value }: onValidationProps) => {
    if (type === Variant.ERROR) {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError,
      }));
    } else {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  return {
    fieldErrors,
    handleValidation,
  };
};
