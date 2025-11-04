import {
  PayPalButtons,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js";

export type OrderResponseBody = {
  id?: string;
  status?: string;
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
    address?: Record<string, any>;
  };
  [key: string]: any;
};

interface PayPalButtonProps {
  amount: string;
  disabled?: boolean; // Optional prop to control button state
  onSuccess: (details: OrderResponseBody) => void; // You can type details more strictly if desired
  onClick?: PayPalButtonsComponentProps["onClick"]; // Optional click handler
}

export default function PayPalButton({
  amount,
  disabled,
  onSuccess,
  onClick,
}: PayPalButtonProps) {
  return (
    <PayPalButtons
      className="w-full"
      disabled={disabled}
      onClick={onClick}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: "GBP", value: amount } }],
          intent: "CAPTURE",
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          onSuccess(details);
        }
      }}
    />
  );
}
