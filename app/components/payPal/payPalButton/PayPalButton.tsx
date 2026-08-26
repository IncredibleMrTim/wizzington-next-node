import {
  PayPalButtons,
  PayPalButtonsComponentProps,
} from "@paypal/react-paypal-js"
import type { Order as PayPalOrderDetails } from "@paypal/paypal-server-sdk"
import { capturePayPalOrder } from "@/actions"

interface PayPalButtonProps {
  amount: string
  disabled?: boolean // Optional prop to control button state
  onSuccess: (details: PayPalOrderDetails) => void
  onClick?: PayPalButtonsComponentProps["onClick"] // Optional click handler
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
      createOrder={(_data, actions) => {
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: "GBP", value: amount } }],
          intent: "CAPTURE",
        })
      }}
      onApprove={async (data) => {
        // Capture server-side (using the client secret) so payment
        // completion is verified by PayPal, not just trusted from the client SDK.
        const details = await capturePayPalOrder(data.orderID)
        onSuccess(details)
      }}
    />
  )
}
