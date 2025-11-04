import BreadCrumbWrapper from "./BreadCrumbWrapper";
import { renderWithProviders, StoreProps } from "@/testing/utils";
import { screen, render } from "@testing-library/react";

// Mock usePathname
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: jest.fn().mockReturnValue("/product/test-product"),
  };
});

describe("BreadCrumbWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // mock the product store data
  const mockProduct = {
    id: "1",
    name: "Test Product",
  };

  const mockStore: StoreProps = {
    preloadedState: { products: { currentProduct: mockProduct } },
    reducer: {
      products: (state = mockProduct, action: any) => state,
    },
  };

  it("should render the breadcrumb component", async () => {
    const { container } = render(
      renderWithProviders({ children: <BreadCrumbWrapper />, ...mockStore })
    );
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });
});
