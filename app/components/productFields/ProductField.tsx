import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import { IconType } from "react-icons";
import z, { ZodError } from "zod";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/date";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { fieldSchema } from "@/app/components/productFields/fields";
import moment from "moment";
import { offsetDate } from "@/utils/date";
import { Variant, onValidationProps } from "@/app/hooks/useProductFieldValidation";

export type Field = {
  label: string;
  placeholderText: string;
  variant: Variant;
  icon?: IconType;
  classes?: { formItem: string };
  span?: boolean;
  name?: string;
  value?: string | number;
  error?: string;
  required?: boolean;
};

export const ProductField = ({
  onValidation,
  ...props
}: Field & {
  onValidation?: (props: onValidationProps) => void;
} & React.ComponentProps<"input">) => {
  const [value, setValue] = useState<Date | string | undefined | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [pendingValidation, setPendingValidation] = useState<{
    value: string | Date;
    type: Variant;
  } | null>(null);

  // Debounced validation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pendingValidation && props.name) {
        try {
          z.object({
            [props.name]:
              fieldSchema.shape[props.name as keyof typeof fieldSchema.shape],
          }).parse({ [props.name]: pendingValidation.value });
          setError(null);
          onValidation?.({
            fieldName: props.name,
            value: pendingValidation.value,
            type: pendingValidation.type,
          });
        } catch (error) {
          setError(error as ZodError);
          onValidation?.({
            fieldName: props.name,
            value: error as ZodError,
            type: "error",
          });
        }
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [pendingValidation, props.name, onValidation]);

  /* Render the component based on the variant */
  const renderComponent = () => {
    switch (props.variant) {
      case "date":
        return (
          <Popover key={props.label}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <FiCalendar
                  size={20}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  type="text"
                  placeholder={props.placeholderText || "Select a date"}
                  value={
                    value
                      ? moment(formatDate({ date: new Date(value) })).format(
                          "DD/MM/YYYY",
                        )
                      : moment(formatDate({ offset: 7 })).format("DD/MM/YYYY")
                  }
                  readOnly
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white!">
              <Calendar
                defaultMonth={undefined}
                startMonth={offsetDate(7)}
                selected={value ? new Date(value) : undefined}
                mode="single"
                disabled={(date: Date) => date < offsetDate(7)}
                onSelect={(date: Date | undefined) => {
                  if (date) {
                    setValue(date.toISOString());

                    if (props.name) {
                      try {
                        z.object({
                          [props.name]:
                            fieldSchema.shape[
                              props.name as keyof typeof fieldSchema.shape
                            ],
                        }).parse({ [props.name]: date });
                        setError(null);
                        onValidation?.({
                          fieldName: props.name || "",
                          value: date,
                          type: props.variant,
                        });
                      } catch (error) {
                        setError(error as ZodError);
                        onValidation?.({
                          fieldName: props.name || "",
                          value: error as ZodError,
                          type: "error",
                        });
                      }
                    }
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        );
      case "textarea":
        return (
          <Textarea
            key={props.label}
            maxLength={1000}
            placeholder={props.placeholderText}
            className={`w-full h-32 border-gray-300 focus-visible:ring-transparent shadow-none ${
              props?.classes?.formItem || ""
            }`}
            onChange={(e) => {
              setValue(e.target.value);
              setPendingValidation({
                value: e.target.value,
                type: props.variant,
              });
            }}
          />
        );
      case "hidden":
        return null;
      default:
        return (
          <div key={props.label}>
            <Input
              key={props.label}
              type={props.variant}
              placeholder={`${props.placeholderText} (cm)`}
              onChange={(e) => {
                setValue(e.target.value);
                setPendingValidation({
                  value: e.target.value,
                  type: props.variant,
                });
              }}
            />
          </div>
        );
    }
  };

  /* Render the error message if exists */
  return (
    <div className="flex flex-col gap-2 w-full relative">
      {renderComponent()}
      {error && (
        <div className="absolute -bottom-6 text-sm left-3 text-red-400">
          {props.error}
        </div>
      )}
    </div>
  );
};
