import { Schema } from "amplify/data/resource";
import * as nextNavigation from "next/navigation";

import { renderWithProviders, StoreProps } from "@/testing/utils";
import { screen, render } from "@testing-library/react";

import { BreadCrumb } from "./BreadCrumb";

// Mock usePathname
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: jest.fn(),
  };
});

jest.mock("@/components/breadCrumb/breadcrumbMappings");

describe("BreadCrumb", () => {
  // mock the product store data
  const mockProduct = {
    id: "1",
    name: "Test Product",
  } as unknown as Schema["Product"]["type"];

  const mockStore: StoreProps = {
    preloadedState: { products: { currentProduct: mockProduct } },
    reducer: {
      products: (state = mockProduct, action: any) => state,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("renders breadcrumb links for a simple path", () => {
    render(
      <BreadCrumb
        pathname="/product/test-product"
        product={mockProduct}
        segments={["product", "shoes"]}
      />,
      {
        wrapper: ({ children }) =>
          renderWithProviders({ children, ...mockStore }),
      }
    );

    expect(screen.getByText(/Products/)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it("does not render on admin path", async () => {
    jest.mocked(nextNavigation.usePathname).mockReturnValue("/admin/dashboard");

    render(<BreadCrumb pathname="/admin/dashboard" segments={["admin"]} />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(screen.queryByText(/Products/)).not.toBeInTheDocument();
  });

  it("should replace hyphens with a space in product names", () => {
    const productWithHyphen = {
      ...mockProduct,
      name: "Test-Product",
    } as unknown as Schema["Product"]["type"];

    render(
      <BreadCrumb
        pathname="/product/test-product"
        product={productWithHyphen}
        segments={["product", "test-product"]}
      />,
      {
        wrapper: ({ children }) =>
          renderWithProviders({ children, ...mockStore }),
      }
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });
});
