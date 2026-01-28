"use client";

import { Order, EmailEnquiryUser } from "@/lib/types";

import ReactDOMServer from "react-dom/server";

export const OrderEmailTemplate = (user: EmailEnquiryUser, order: Order) => {
  const temp = document.createElement("div");

  const totalCost = order.orderProducts.reduce(
    (total, product) => total + (Number(product.price) * product.quantity || 0),
    0,
  );

  const emailHtml = (
    <div style={{ padding: "4px" }}>
      <p>Hey Wizzington Moo's UK Admin</p>
      <p>
        <p>
          <i>You have a new order:</i>
        </p>
        <div>
          <div>
            Name:
            <span style={{ fontWeight: "bold" }}>
              {user?.firstName} {user?.surname || ""}
            </span>
          </div>
          <div>
            Email:
            <span style={{ fontWeight: "bold" }}> {user.email}</span>
          </div>
          <div>
            Order Value:
            <span style={{ fontWeight: "bold" }}>{`£${totalCost}`}</span>
          </div>
        </div>
      </p>

      <hr />

      {order.orderProducts.map((product) => (
        <div key={product.id}>
          <p>
            <span style={{ fontWeight: "bold" }}>Product: </span>{" "}
            {product.productName}
          </p>
          <table
            width="600"
            style={{ width: "600px", backgroundColor: "#f5f3ff" }}
          >
            <thead style={{ backgroundColor: "#fda5d6" }}>
              <tr style={{ padding: "4px" }}>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(product).map(
                ([key, value]) =>
                  key !== "productId" &&
                  key !== "uid" &&
                  key !== "name" && (
                    <tr
                      key={`${value}-${key}`}
                      style={{
                        borderBottom: "1px solid #d1d5dc",
                        padding: "4px",
                      }}
                    >
                      <td>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </td>
                      <td>{value !== undefined ? value.toString() : "N/A"}</td>
                    </tr>
                  ),
              )}
              <tr>
                <td style={{ fontWeight: "bold" }}>Cost</td>
                <td style={{ fontWeight: "bold" }}>
                  {`£${(Number(product.price) * product.quantity).toFixed(2)}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  return temp.innerHTML;
};
