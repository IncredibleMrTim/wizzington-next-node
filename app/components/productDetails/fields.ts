import { PiBasket } from "react-icons/pi";
import { z } from "zod";

import { Field } from "@/components/productFields/ProductField";

export const fieldSchema = z.object({
  waistSize: z.coerce.number().min(1),
  chestSize: z.coerce.number().min(1),
  hipSize: z.coerce.number().min(1),
  girth: z.coerce.number().min(1),
  headSize: z.coerce.number().min(1),
  neckSize: z.coerce.number().min(1),
  bicepSize: z.coerce.number().min(1),
  armpitToWrist: z.coerce.number().min(1),
  wristSize: z.coerce.number().min(1),
  inseam: z.coerce.number().min(1),
  waistToAnkle: z.coerce.number().min(1),
  waistToFloor: z.coerce.number().min(1),
  ankleSize: z.coerce.number().min(1),
  quantity: z.coerce.number().min(1).max(4),
  height: z.coerce.number().min(1).nullable(),
  notes: z.string().max(1000).optional(),
});

export const fields: {
  [key: string]: Field;
}[] = [
  {
    chestSize: {
      label: "Chest Size (Circumference Around Chest)",
      placeholderText: "Chest size",
      required: true,
      variant: "number",
      error: "Please enter a valid chest size",
    },
  },
  {
    waistSize: {
      label: "Waist Size (Circumference Around Waist)",
      placeholderText: "Waist size",
      required: true,
      variant: "number",
      error: "Please enter a valid waist size",
    },
  },
  {
    hipSize: {
      label: "Hip Size (Circumference Around Hips)",
      placeholderText: "Hip size",
      required: true,
      variant: "number",
      error: "Please enter a valid hip size",
    },
  },
  {
    girth: {
      label: "Girth Measurement (Around the Body)",
      placeholderText: "Girth measurement",
      required: true,
      variant: "number",
      error: "Please enter a valid girth measurement",
    },
  },
  {
    headSize: {
      label: "Head Size (Hat Size)",
      placeholderText: "Head size",
      required: true,
      variant: "number",
      error: "Please enter a valid head size",
    },
  },
  {
    neckSize: {
      label: "Neck Size (Collar Size)",
      placeholderText: "Neck size",
      required: true,
      variant: "number",
      error: "Please enter a valid neck size",
    },
  },
  {
    bicepSize: {
      label: "Bicep Size (Upper Arm Circumference)",
      placeholderText: "Bicep size",
      required: true,
      variant: "number",
      error: "Please enter a valid bicep size",
    },
  },
  {
    armpitToWrist: {
      label: "Armpit to Wrist (Arm Length)",
      placeholderText: "Armpit to wrist",
      required: true,
      variant: "number",
      error: "Please enter a valid armpit to wrist measurement",
    },
  },
  {
    wristSize: {
      label: "Wrist Size",
      placeholderText: "Wrist size",
      required: true,
      variant: "number",
      error: "Please enter a valid wrist size",
    },
  },
  {
    inseam: {
      label: "Inseam (Crotch to Ankle Length)",
      placeholderText: "Crotch to ankle",
      required: true,
      variant: "number",
      error: "Please enter a valid inseam measurement",
    },
  },
  {
    waistToAnkle: {
      label: "Waist to Ankle (Length of Pants)",
      placeholderText: "waist to ankle",
      required: true,
      variant: "number",
      error: "Please enter a valid waist to ankle measurement",
    },
  },
  {
    waistToFloor: {
      label: "Waist to Floor (Length of Dress)",
      placeholderText: "Waist to floor",
      required: true,
      variant: "number",
      error: "Please enter a valid waist to floor measurement",
    },
  },
  {
    ankleSize: {
      label: "Ankle Size (For Shoes)",
      placeholderText: "Ankle size",
      required: true,

      variant: "number",
      error: "Please enter a valid ankle size",
    },
  },
  {
    quantity: {
      label: "Quantity",
      placeholderText: "Quantity",
      icon: PiBasket,
      required: true,
      variant: "number",
      error: "Please enter a quantity (1-4)",
    },
  },
  {
    notes: {
      label: "Additional Information",
      placeholderText: "Provide additional details or special requests",
      variant: "textarea",
      classes: {
        formItem: "flex flex-col items-start w-full",
      },
      span: true,
    },
  },
];
