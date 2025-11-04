import { useParams } from "next/navigation";
import React, { act } from "react";

import { renderWithProviders, StoreProps } from "@/testing/utils";
import { screen, render } from "@testing-library/react";

import { ProductEditor } from "./ProductEditor";
import { Schema } from "amplify/data/resource";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";

import { FileUploader } from "@/components/fileUploader/FileUploader";
import { useProductEditor } from "./useProductEditor";

import userEvent from "@testing-library/user-event";
import { updateProductImages } from "@/app/stores/product/useProductStore";
import { isValid } from "zod";

// mock the product store data
const mockProduct = {
  id: "1",
  name: "Test Product",
  description: "Test Description",
  price: 100,
  stock: 10,
  category: "Test Category",
  isFeatured: true,
  isEnquiryOnly: true,
  images: [
    {
      id: "image1",
      url: "https://example.com/image1.jpg",
      altText: "Image 1",
    },
    {
      id: "image2",
      url: "https://example.com/image2.jpg",
      altText: "Image 2",
    },
  ],
} as unknown as Schema["Product"]["type"];

const mockStore: StoreProps = {
  preloadedState: { products: { currentProduct: mockProduct } },
  reducer: {
    products: (state = mockProduct, action: any) => state,
  },
};

jest.mock("@/components/fileUploader/FileUploader", () => ({
  FileUploader: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useParams: jest.fn().mockReturnValue({ productId: "1" }),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  };
});

// Mock product query/mutation hooks
jest.mock("@/services/product/useGetProductQuery", () => ({
  useGetProductQuery: jest.fn(),
}));

jest.mock("@/services/product/useAddProductMutation", () => ({
  useAddProductMutation: () => ({
    mutateAsync: jest.fn(),
  }),
}));
jest.mock("@/services/product/useUpdateProductMutation", () => ({
  useUpdateProductMutation: () => ({
    mutateAsync: jest.fn(),
  }),
}));

jest.mock("./useProductEditor", () => {
  const actual = jest.requireActual("./useProductEditor");
  return {
    useProductEditor: jest.fn().mockReturnValue({
      ...actual,
      updateProductImages: jest.fn(),
    }),
  };
});

describe("ProductEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useParams).mockReturnValue({ productId: "1" });

    // mock the product returned from useProductEditor with no images
    (useProductEditor as jest.Mock).mockReturnValue({
      product: { ...mockProduct, images: [] },
    });
  });

  it("renders without crashing", () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByText(/Enter the name of the product./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product description./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product price \(£\)\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product stock level./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Marking a product as Featured will display it on the home page./
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Select product category./)).toBeInTheDocument();

    expect(
      screen.getByText(/Check this box to feature the product./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Check this box to mark the product as Enquiry Only./)
    ).toBeInTheDocument();
  });

  it("renders the form with the product name", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Product Name", {
        exact: false,
      })
    ).toHaveValue("Test Product");
  });

  it("renders the form with the product description", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Description", {
        exact: false,
      })
    ).toHaveValue("Test Description");
  });

  it("renders the form with the product price", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Price", {
        exact: false,
      })
    ).toHaveValue(100);
  });

  it("renders the form with the product stock", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Stock", {
        exact: false,
      })
    ).toHaveValue(10);
  });

  it("renders the form with the product category", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("category", {
        exact: false,
      })
    ).toHaveTextContent("Category");
  });

  it("renders the form with the product feature product checkbox", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Feature Product", {
        exact: false,
      })
    ).toBeChecked();
  });

  it("renders the form with the product feature product un-checkbox", async () => {
    // mock the product returned from useProductEditor with isFeatured = false
    (useProductEditor as jest.Mock).mockReturnValue({
      product: { ...mockProduct, isFeatured: false },
    });

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Feature Product", {
        exact: false,
      })
    ).not.toBeChecked();
  });

  it("renders the form with the product enquiry only checkbox", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Enquiry Only", {
        exact: false,
      })
    ).toBeChecked();
  });

  it("renders the form with the product enquiry only un-checkbox", async () => {
    // mock the product returned from useProductEditor with isEnquiryOnly = false
    (useProductEditor as jest.Mock).mockReturnValue({
      product: { ...mockProduct, isEnquiryOnly: false },
    });

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Enquiry Only", {
        exact: false,
      })
    ).not.toBeChecked();
  });

  (useGetProductQuery as jest.Mock).mockImplementation(() => ({
    getProductById: () => ({
      data: null, // Simulate no product being loaded
    }),
  }));

  it("renders the submit button with Update Product if product is loaded", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(screen.getByRole("submit")).toHaveTextContent("Update Product");
  });

  it("renders the submit button with Create Product if no product is loaded", async () => {
    // mock the product returned from useProductEditor to return no product
    (useProductEditor as jest.Mock).mockReturnValue({
      product: null,
    });

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({
          children,
          ...mockStore,
        }),
    });

    expect(screen.getByRole("submit")).toHaveTextContent("Create Product");
  });

  // TODO: fix this
  it.skip("should call the save function if the form is valid", async () => {
    const mockSave = jest.fn();
    // mock the product returned and the save function from useProductEditor

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({
          children,
          ...mockStore,
        }),
    });

    screen.getAllByRole("form");

    const submitButton = screen.getByRole("submit");

    submitButton.setAttribute("disabled", "false");

    screen.debug(submitButton);

    userEvent.click(submitButton);

    expect(mockSave).toHaveBeenCalled();
  });

  describe("FileUploader", () => {
    const mockUpdateProductImages = jest.fn();
    beforeEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it("should update the order of product image order 0 to 1", async () => {
      // mock updateImages function from useProductEditor so we can check if its called
      (useProductEditor as jest.Mock).mockReturnValue({
        updateImages: mockUpdateProductImages,
        product: mockProduct,
      });

      // Re-mock the FileUploader so we can call the updateProductImageOrder function using the onClick
      (FileUploader as jest.Mock).mockImplementation(
        ({
          updateProductImageOrder,
          product,
        }: {
          updateProductImageOrder: jest.Mock;
          product: Schema["Product"]["type"];
        }) => {
          return (
            <div
              onClick={() => {
                updateProductImageOrder(mockProduct.images[0].url, 1);
              }}
              data-testid="file-uploader"
            >
              reorder image {product?.name}
            </div>
          );
        }
      );

      render(<ProductEditor />, {
        wrapper: ({ children }) =>
          renderWithProviders({
            children,
            ...mockStore,
          }),
      });

      const reorderProductImages = screen.getByTestId("file-uploader");

      await act(() => userEvent.click(reorderProductImages));

      expect(mockUpdateProductImages).toHaveBeenCalledWith(
        expect.arrayContaining([{ ...mockProduct.images[0], order: 1 }])
      );
    });

    it("renders loaded images from product", () => {
      // mock updateImages function from useProductEditor so we can check if its called
      (useProductEditor as jest.Mock).mockReturnValue({
        updateImages: mockUpdateProductImages,
        product: mockProduct,
      });

      // Re-mock the FileUploader so we can check that all images are added to the component
      (FileUploader as jest.Mock).mockImplementation(
        ({ product }: { product: Schema["Product"]["type"] }) => (
          <div data-testid="file-uploader" onClick={mockUpdateProductImages}>
            {product.images.map((p) => (
              <div data-testid={p.url} />
            ))}
          </div>
        )
      );

      render(<ProductEditor />, {
        wrapper: ({ children }) =>
          renderWithProviders({
            children,
            ...mockStore,
          }),
      });

      expect(screen.getByTestId(mockProduct.images[0].url)).toBeInTheDocument();
      expect(screen.getByTestId(mockProduct.images[1].url)).toBeInTheDocument();
    });

    it("Adds a new image", async () => {
      const mockUpdateProductImages = jest.fn();

      // mock updateImages function from useProductEditor so we can check if its called
      (useProductEditor as jest.Mock).mockReturnValue({
        updateImages: mockUpdateProductImages,
      });

      // Re-mock the FileUploader so we can test if the updateImages function is called
      (FileUploader as jest.Mock).mockReturnValue(
        <div data-testid="file-uploader" onClick={mockUpdateProductImages}>
          Hello
        </div>
      );

      render(<ProductEditor />, {
        wrapper: ({ children }) =>
          renderWithProviders({
            children,
            ...mockStore,
          }),
      });

      const updateProductImageButton = screen.getByTestId("file-uploader");

      await act(() => userEvent.click(updateProductImageButton));

      expect(mockUpdateProductImages).toHaveBeenCalled();
    });

    it("should return the product if the image array is empty", async () => {
      // mock updateImages function from useProductEditor so we can check if its called
      // and clear all images so we can check that only the input product is returned
      (useProductEditor as jest.Mock).mockReturnValue({
        updateImages: mockUpdateProductImages,
        product: { ...mockProduct, images: [] },
      });

      // Mock the default FileUpload component
      (FileUploader as jest.Mock).mockImplementation(
        ({
          updateProductImageOrder,
          product,
        }: {
          updateProductImageOrder: jest.Mock;
          product: Schema["Product"]["type"];
        }) => {
          return (
            <div
              onClick={() => {
                updateProductImageOrder(mockProduct.images[0].url, 1);
              }}
              data-testid="file-uploader"
            >
              reorder image {product?.name}
            </div>
          );
        }
      );

      render(<ProductEditor />, {
        wrapper: ({ children }) =>
          renderWithProviders({
            children,
            ...mockStore,
          }),
      });

      const reorderProductImages = screen.getByTestId("file-uploader");

      await act(() => userEvent.click(reorderProductImages));

      expect(mockUpdateProductImages).not.toHaveBeenCalled();
    });
  });
});
