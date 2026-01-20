import { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";

import ReactDOMServer from "react-dom/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/types";

export const OrderEmailTemplate = (props: OrderResponseBody, order: Order) => {
  // const name = props.payer?.name;
  // const from = props.payer?.email_address;
  // const temp = document.createElement("div");

  // const emailHtml = (
  //   <div>
  //     <p>Hey Wizzington Moos Boutique Admin</p>
  //     <p>
  //       You have a new order from:
  //       <strong>
  //         {name?.given_name} {name?.surname || ""}
  //       </strong>
  //     </p>

  //     <h3>Message Details</h3>
  //     <p>
  //       <strong>From:</strong> {from}
  //     </p>
  //     {order.products.map((product) => (
  //       <div key={product.productId}>
  //         <p>
  //           <strong>Product:</strong> {product.name || "Unknown Product"}
  //           <Table
  //             style={{
  //               marginLeft: "10px",
  //               border: "1px solid #ccc",
  //               width: "300px",
  //             }}
  //           >
  //             <TableCaption
  //               style={{
  //                 textAlign: "left",
  //               }}
  //             >
  //               Specifications
  //             </TableCaption>
  //             <TableHeader style={{ backgroundColor: "#808b96" }}>
  //               <TableRow>
  //                 <TableHead
  //                   style={{
  //                     textAlign: "left",
  //                     fontWeight: "normal",
  //                     color: "#fff",
  //                   }}
  //                 >
  //                   Name
  //                 </TableHead>
  //                 <TableHead
  //                   style={{
  //                     display: "flex",
  //                     justifyContent: "start",
  //                     fontWeight: "normal",
  //                     color: "#fff",
  //                   }}
  //                 >
  //                   Value
  //                 </TableHead>
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody>
  //               {Object.entries(product).map(
  //                 ([key, value]) =>
  //                   key !== "productId" &&
  //                   key !== "name" && (
  //                     <TableRow
  //                       key={key}
  //                       style={{
  //                         backgroundColor: "#f9f9f9",
  //                         padding: "4px",
  //                       }}
  //                     >
  //                       <TableCell>
  //                         {key
  //                           .replace(/([A-Z])/g, " $1")
  //                           .replace(/^./, (str) => str.toUpperCase())}
  //                       </TableCell>
  //                       <TableCell>
  //                         {value !== undefined ? value.toString() : "N/A"}
  //                       </TableCell>
  //                     </TableRow>
  //                   )
  //               )}
  //             </TableBody>
  //           </Table>
  //         </p>
  //       </div>
  //     ))}
  //   </div>
  // );
  // temp.innerHTML = ReactDOMServer.renderToStaticMarkup(emailHtml);
  // return temp.innerHTML;

  <div>Order email template</div>;
};
