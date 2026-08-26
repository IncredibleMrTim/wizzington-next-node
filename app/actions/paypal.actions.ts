"use server";

import { Client, Environment, OrdersController } from "@paypal/paypal-server-sdk";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
  environment:
    process.env.PAYPAL_ENVIRONMENT === "production"
      ? Environment.Production
      : Environment.Sandbox,
});

const ordersController = new OrdersController(client);

/**
 * Captures a PayPal order server-side using the client secret, so payment
 * completion is verified by PayPal rather than trusted from the client SDK.
 */
export const capturePayPalOrder = async (orderId: string) => {
  const { result } = await ordersController.captureOrder({ id: orderId });
  return result;
};
