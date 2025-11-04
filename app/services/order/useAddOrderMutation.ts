"use client";
import { Order, CreateOrderInput } from "@/lib/types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { OrderMutationKeys } from "./keys";

export const useAddOrderMutation = (): UseMutationResult<
  Order | null,
  unknown,
  CreateOrderInput
> => {
  const addOrder = async (order: CreateOrderInput) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return response.json() as Promise<Order>;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error(`Failed to create order: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [OrderMutationKeys.CREATE_ORDER],
    mutationFn: (order: CreateOrderInput) => addOrder(order),
  });
};
