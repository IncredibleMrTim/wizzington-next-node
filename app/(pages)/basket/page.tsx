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
import { Footer } from "@/app/components/footer/Footer";

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
    <div className="wm-scope -m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 flex flex-col min-h-screen bg-[color:var(--wm-plum)]">
      <main className="flex flex-col grow gap-4 max-w-3xl mx-auto w-full py-8">
        <h1
          className="wm-h-page mb-4"
          style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
        >
          Basket
        </h1>
        <div style={{ color: "rgba(245,237,232,0.65)", fontFamily: "var(--font-wm-body)" }}>
          {`Review your order below. If you are happy with your order, click the
          "Checkout" button to proceed.`}
        </div>
        <div style={{ color: "rgba(245,237,232,0.45)", fontFamily: "var(--font-wm-body)" }}>
          Vivamus eu turpis luctus, rutrum ex non, ultrices dolor. Nullam sem
          nunc, convallis in risus at, iaculis pretium leo. Proin ornare libero
          vitae nisl mollis, ac facilisis nibh auctor. Sed non eros hendrerit,
          suscipit justo nec, lobortis felis. Ut venenatis risus at ligula
          condimentum pretium. Pellentesque non justo sit amet nisi feugiat
          euismod. Donec consectetur cursus eros ac aliquam. Ut tempor elementum
          tincidunt. Nullam maximus ex a tempus hendrerit. Sed feugiat leo quis
          lorem fringilla, ut volutpat dolor blandit. Suspendisse potenti. Donec
          iaculis tincidunt justo id sollicitudin.
        </div>
        {currentOrder && currentOrder.orderProducts.length > 0 ? (
          <div
            className="flex flex-col gap-4 rounded p-4 border"
            style={{
              backgroundColor: "var(--wm-plum-mid)",
              borderColor: "rgba(201,132,154,0.15)",
            }}
          >
            <h2
              className="wm-h-section mb-2"
              style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-cream)" }}
            >
              Your Order
            </h2>
            <ul className="list-none flex flex-col gap-3">
              {allProducts &&
                currentOrder.orderProducts.map((product) => {
                  const productDetails = allProducts.find(
                    (p) => p.id === product.productId,
                  );
                  console.log("Product.", productDetails);
                  return (
                    <li
                      key={product.id}
                      className="flex gap-4 items-center"
                      style={{ color: "var(--wm-cream)", fontFamily: "var(--font-wm-body)" }}
                    >
                      <Image
                        src={`${productDetails?.images?.[0]?.url}`}
                        alt={productDetails?.name || "Product image"}
                        width={128}
                        height={128}
                        className="h-32 inline-block mr-2 rounded object-cover"
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
            <div style={{ color: "var(--wm-gold-light)", fontFamily: "var(--font-wm-body)" }}>
              {totalCost}
            </div>
            <Button
              onClick={handleSuccess}
              className="w-fit rounded-full bg-[color:var(--wm-gold)]! text-[color:var(--wm-plum)]! hover:bg-[color:var(--wm-gold-light)]! font-medium"
            >
              Send Enquiry
            </Button>
          </div>
        ) : (
          <div style={{ color: "rgba(245,237,232,0.5)", fontFamily: "var(--font-wm-body)" }}>
            Your basket is empty.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
export default BasketPage;
