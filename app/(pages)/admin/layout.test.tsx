import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AdminLayout from "./layout";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock dependencies
jest.mock("@aws-amplify/ui-react", () => ({
  Authenticator: ({ children, components }: any) => (
    <div>
      {components?.Footer && (
        <div data-testid="footer">{components.Footer()}</div>
      )}
      {children}
    </div>
  ),
}));
jest.mock("@/components/auth/Auth", () => () => <div>CheckAuth</div>);
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

describe("AdminLayout", () => {
  it("calls router.push('/') when Cancel is clicked", () => {
    const push = jest.fn();
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      push,
    });

    const { getByText } = render(
      <AdminLayout>
        <div>ChildContent</div>
      </AdminLayout>
    );

    fireEvent.click(getByText("Cancel"));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("renders children and CheckAuth", () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    const { getByText } = render(
      <AdminLayout>
        <div>ChildContent</div>
      </AdminLayout>
    );

    expect(getByText("CheckAuth")).toBeInTheDocument();
    expect(getByText("ChildContent")).toBeInTheDocument();
  });
});
