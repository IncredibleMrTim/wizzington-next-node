import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

export const renderWithProviders = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
