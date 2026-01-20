"use client";
import { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";
import { Order } from "@/lib/types";

import ReactDOMServer from "react-dom/server";

export const OrderEmailTemplate = (props: OrderResponseBody, order: Order) => {
  // const name = props.payer?.name;
  // const from = props.payer?.email_address;
  // const temp = document.createElement("div");

  // const totalCost = order.products.reduce(
  //   (total, product) => total + (product.price * product.quantity || 0),
  //   0
  // );

  // const emailHtml = (
  //   <div style={{ padding: "4px" }}>
  //     <p>Hey Wizzington Moo's UK Admin</p>
  //     <p>
  //       <p>
  //         <i>You have a new order:</i>
  //       </p>
  //       <div>
  //         <div>
  //           Name:
  //           <span style={{ fontWeight: "bold" }}>
  //             {name?.given_name} {name?.surname || ""}
  //           </span>
  //         </div>
  //         <div>
  //           Email:
  //           <span style={{ fontWeight: "bold" }}> {from}</span>
  //         </div>
  //         <div>
  //           Order Value:
  //           <span style={{ fontWeight: "bold" }}>{`£${totalCost}`}</span>
  //         </div>
  //       </div>
  //     </p>

  //     <hr />

  //     {order.products.map((product) => (
  //       <div key={product.uid}>
  //         <p>
  //           <span style={{ fontWeight: "bold" }}>Product: </span> {product.name}
  //         </p>
  //         <table
  //           width="600"
  //           style={{ width: "600px", backgroundColor: "#f5f3ff" }}
  //         >
  //           <thead style={{ backgroundColor: "#fda5d6" }}>
  //             <tr style={{ padding: "4px" }}>
  //               <th style={{ textAlign: "left" }}>Name</th>
  //               <th style={{ textAlign: "left" }}>Value</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {Object.entries(product).map(
  //               ([key, value]) =>
  //                 key !== "productId" &&
  //                 key !== "uid" &&
  //                 key !== "name" && (
  //                   <tr
  //                     key={`${value}-${key}`}
  //                     style={{
  //                       borderBottom: "1px solid #d1d5dc",
  //                       padding: "4px",
  //                     }}
  //                   >
  //                     <td>
  //                       {key
  //                         .replace(/([A-Z])/g, " $1")
  //                         .replace(/^./, (str) => str.toUpperCase())}
  //                     </td>
  //                     <td>{value !== undefined ? value.toString() : "N/A"}</td>
  //                   </tr>
  //                 )
  //             )}
  //             <tr>
  //               <td style={{ fontWeight: "bold" }}>Cost</td>
  //               <td style={{ fontWeight: "bold" }}>
  //                 {`£${(product.price * product.quantity).toFixed(2)}`}
  //               </td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </div>
  //     ))}
  //   </div>
  // );
  // temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  // return temp.innerHTML;

  return <div>Order Email Template</div>;
};
