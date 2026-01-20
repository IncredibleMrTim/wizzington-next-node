"use client";

import { Order, Product } from "@/lib/types";
import ReactDOMServer from "react-dom/server";

export interface EnquiryEmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  product: Product;
  order: Order;
}

export const EnquiryEmailTemplate = ({
  name,
  email,
  phone,
  product,
  order,
}: EnquiryEmailTemplateProps) => {
  // const temp = document.createElement("div");

  // const emailHtml = (
  //   <div style={{ padding: "4px" }}>
  //     <p>Hey Wizzington Moos UK Admin</p>
  //     <p>
  //       <p>
  //         <i>You have a new enquiry:</i>
  //       </p>
  //       <div>
  //         <div>
  //           Name:
  //           <span style={{ fontWeight: "bold" }}>{name}</span>
  //         </div>
  //         <div>
  //           Email:
  //           <span style={{ fontWeight: "bold" }}> {email}</span>
  //         </div>
  //         <div>
  //           Phone:
  //           <span style={{ fontWeight: "bold" }}> {phone}</span>
  //         </div>
  //       </div>
  //     </p>

  //     <hr />

  //     <p>
  //       <div>
  //         <span style={{ fontWeight: "bold" }}>Product: </span> {product.name}
  //       </div>
  //       <div>
  //         <span style={{ fontWeight: "bold" }}>Base Price: </span>
  //         {`£${product.price}`}
  //       </div>
  //       <div>
  //         <span style={{ fontWeight: "bold" }}>
  //           Measurement type: Centimeters (cm)
  //         </span>
  //       </div>
  //     </p>

  //     <table width="600" style={{ width: "600px", backgroundColor: "#f5f3ff" }}>
  //       <thead style={{ backgroundColor: "#fda5d6", padding: "4px" }}>
  //         <tr>
  //           <th style={{ textAlign: "left" }}>Name</th>
  //           <th style={{ textAlign: "left" }}>Value</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {Object.entries(order).map(
  //           ([key, value]) =>
  //             key !== "productId" &&
  //             key !== "uid" &&
  //             key !== "name" && (
  //               <tr
  //                 key={`${value}-${key}`}
  //                 style={{
  //                   borderBottom: "1px solid #d1d5dc",
  //                   padding: "4px",
  //                 }}
  //               >
  //                 <td>
  //                   {key
  //                     .replace(/([A-Z])/g, " $1")
  //                     .replace(/^./, (str) => str.toUpperCase())}
  //                 </td>
  //                 <td>{value !== undefined ? value.toString() : "N/A"}</td>
  //               </tr>
  //             )
  //         )}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  // temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  // return temp.innerHTML;
  return <div>Enquiry Email Template</div>;
};
