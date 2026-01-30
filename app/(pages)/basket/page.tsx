"use client";
import Image from "next/image";
import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import { OrderEmailTemplate } from "@/app/components/productDetails/orderEmailTemplate";
import { sendEmail } from "@/utils/email";
import { useOrderStore, useProductStore } from "@/stores";
import { EmailEnquiryUser, Order, ProductDTO } from "@/lib/types";
import { getCachedProducts } from "@/actions";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";

const BasketPage = () => {
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const totalCost = useOrderStore((state) => state.totalCost);
  const [allProducts, setAllProducts] = useState<ProductDTO[] | null>(null);

  useEffect(() => {
    getCachedProducts().then(setAllProducts);
  }, []);

  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async () => {
    console.log("Email");
    const userDetails = {
      firstName: "Tim",
      surname: "Smart",
      email: "tjsmart57@gmail.com",
      address: "Test Address",
      phone: "12345",
    } as EmailEnquiryUser;

    const emailHtml = OrderEmailTemplate(
      userDetails,
      currentOrder as unknown as Order,
    );

    await sendEmail({
      user: userDetails,
      subject: "New Order Received",
      html: emailHtml,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col grow p-4 gap-4">
        <h1 className="text-2xl font-bold mb-4">Basket</h1>
        <p>
          {`Review your order below. If you are happy with your order, click the
          "Checkout" button to proceed.`}
        </p>
        <p>
          Vivamus eu turpis luctus, rutrum ex non, ultrices dolor. Nullam sem
          nunc, convallis in risus at, iaculis pretium leo. Proin ornare libero
          vitae nisl mollis, ac facilisis nibh auctor. Sed non eros hendrerit,
          suscipit justo nec, lobortis felis. Ut venenatis risus at ligula
          condimentum pretium. Pellentesque non justo sit amet nisi feugiat
          euismod. Donec consectetur cursus eros ac aliquam. Ut tempor elementum
          tincidunt. Nullam maximus ex a tempus hendrerit. Sed feugiat leo quis
          lorem fringilla, ut volutpat dolor blandit. Suspendisse potenti. Donec
          iaculis tincidunt justo id sollicitudin.
        </p>
        {currentOrder && currentOrder.orderProducts.length > 0 ? (
          <div className="flex flex-col gap-4 border border-gray-200 rounded-sm p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Your Order</h2>
            <ul className="list-none">
              {allProducts &&
                currentOrder.orderProducts.map((product) => {
                  const productDetails = allProducts.find(
                    (p) => p.id === product.productId,
                  );
                  console.log("Product.", productDetails);
                  return (
                    <li key={product.id} className="flex gap-4">
                      <Image
                        src={`${productDetails?.images?.[0]?.url}`}
                        alt={productDetails?.name || "Product image"}
                        width={128}
                        height={128}
                        className="h-32 inline-block mr-2"
                      />
                      {productDetails?.name} - Quantity: {product.quantity}
                    </li>
                  );
                })}
            </ul>

            {/* <PayPalProvider>
              <PayPalButton
                amount={totalCost?.toString() || ""}
                onSuccess={handleSuccess}
              />
            </PayPalProvider> */}
            {totalCost}
            <Button onClick={handleSuccess}>Send Enquiry</Button>
          </div>
        ) : (
          <p>Your basket is empty.</p>
        )}
      </main>
    </div>
  );
};
export default BasketPage;
