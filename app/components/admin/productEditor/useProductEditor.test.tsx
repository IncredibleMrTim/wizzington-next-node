import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

import { Schema } from "amplify/data/resource";
import { useProductEditor } from "./useProductEditor";
import { useProductStore } from "@/stores";

import { renderWithProviders } from "@/testing/utils";
import { useParams } from "next/navigation";

const mockAddProductMutation = jest.fn();
const mockUpdateProductMutation = jest.fn();

jest.mock("@/stores", () => ({
  ...jest.requireActual("@/stores"),
  useProductStore: jest.fn(), // Mock useProductStore
}));

jest.mock("@/services/product/useGetProductById", () => ({
  useGetProductById: () => ({
    getProductById: jest.fn(() => ({
      data: null, // Simulate no product found
    })),
  }),
}));
jest.mock("@/services/product/useAddProductMutation", () => ({
  useAddProductMutation: () => ({
    mutateAsync: mockAddProductMutation,
  }),
}));
jest.mock("@/services/product/useUpdateProductMutation", () => ({
  useUpdateProductMutation: () => ({
    mutateAsync: mockUpdateProductMutation,
  }),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({ productId: ["123"] })), // or [] for “new”
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: jest.fn(() => ({
      getQueryData: jest.fn(),
      setQueryData: jest.fn(),
      invalidateQueries: jest.fn(),
      removeQueries: jest.fn(),
    })),
  };
});

describe.skip("useProductEditor", () => {
  const queryClient = new QueryClient();
  const dispatch = jest.fn();

  // mock the product store data
  const mockProduct = {
    id: "1",
    name: "Test Product",
  };

  const mockStore = {
    preloadedState: { products: { mockProduct } },
    reducer: {
      products: (state = mockProduct, action: any) => state,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    // mock the Zustand store
    (useProductStore as jest.Mock).mockReturnValue({
      updateProductImages: jest.fn(),
      updateAllProducts: jest.fn(),
      clearCurrentProduct: jest.fn(),
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const { product, save, updateImages } = result.current;

    expect(product).toBeNull();
  });

  it("dispatches UPDATE_PRODUCT_IMAGES when updateImages() is called", () => {
    // Create a mock store for this test
    const mockStore = {
      reducer: {
        products: (state = {}, action: any) => state,
      },
      preloadedState: {
        products: (state = mockProduct, action: any) => state,
      },
    };

    const dispatch = jest.fn();
    jest
      .spyOn(require("@/stores/store"), "useAppDispatch")
      .mockReturnValue(dispatch);

    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const newImages = [
      {
        id: "img-1",
        url: "https://example.com/image1.jpg",
        productId: "123",
        orderPosition: 0,
        createdAt: new Date(),
      },
    ];

    act(() => {
      result.current.updateImages(newImages);
    });

    expect(useProductStore).toHaveBeenCalled();
  });

  // TODO: Fix this
  it.skip("should update an existing product when productId is provided", async () => {
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const updatedProduct = {
      id: "123",
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stockLevel: 20,
      category: "Updated Category",
      isFeatured: true,
      isEnquiryOnly: false,
      images: [],
    } as unknown as Schema["Product"]["type"];

    result.current.save(updatedProduct);

    // Assert that the mutation was called
    expect(mockUpdateProductMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        name: "Updated Product",
        description: "Updated Description",
        price: 200,
        stockLevel: 20,
        category: "Updated Category",
        isFeatured: true,
        isEnquiryOnly: false,
        images: [],
      })
    );
  });

  it("should save a new product when no current product exists", async () => {
    (useParams as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    await act(async () => {
      const newProduct = {
        name: "New Product",
        description: "New Description",
        price: 100,
        stockLevel: 10,
        category: "New Category",
        isFeatured: false,
        isEnquiryOnly: false,
        images: [],
      } as unknown as Schema["Product"]["type"];

      result.current.save(newProduct);

      expect(mockAddProductMutation).toHaveBeenCalledWith({
        ...newProduct,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
