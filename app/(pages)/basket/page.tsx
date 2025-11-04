"use client";
import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import { OrderEmailTemplate } from "@/components/emailTemplates/orderEmailTemplate";
import { sendEmail } from "@/utils/email";
import { useOrderStore, useProductStore } from "@/stores";
import { Order } from "@/lib/types";

const BasketPage = () => {
  const currentOrder = useOrderStore((state) => state.currentOrder);
  const totalCost = useOrderStore((state) => state.totalCost);
  const allProducts = useProductStore((state) => state.allProducts);

  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async (orderDetails: OrderResponseBody) => {
    if (process.env.SMTP_EMAIL) {
      await sendEmail({
        to: process.env.SMTP_EMAIL,
        subject: "New Order Received",
        html: OrderEmailTemplate(
          orderDetails,
          currentOrder as unknown as Order
        ),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {totalCost}
      <main className="flex flex-col flex-grow p-4 gap-4">
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
        {currentOrder && currentOrder.products.length > 0 ? (
          <div className="flex flex-col gap-4  border-gray-200 border-1 rounded-sm p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Your Order</h2>
            <ul className="list-none">
              {currentOrder.products.map((product) => {
                const productDetails = allProducts.find(
                  (p) => p.id === product.productId
                );
                return (
                  <li key={product.uid} className="flex gap-4">
                    <img
                      src={`${process.env.S3_PRODUCT_IMAGE_URL}${productDetails?.images?.[0]?.url}`}
                      alt={productDetails?.name}
                      className="h-32 inline-block mr-2"
                    />
                    {productDetails?.name} - Quantity: {product.quantity}
                  </li>
                );
              })}
            </ul>

            <PayPalProvider>
              <PayPalButton
                amount={totalCost?.toString() || ""}
                onSuccess={handleSuccess}
              />
            </PayPalProvider>
          </div>
        ) : (
          <p>Your basket is empty.</p>
        )}
      </main>
    </div>
  );
};
export default BasketPage;
