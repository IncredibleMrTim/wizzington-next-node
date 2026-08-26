"use client"
import Image from "next/image"
import PayPalButton from "@/components/payPal/payPalButton/PayPalButton"
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider"
import { OrderEmailTemplate } from "@/app/components/productDetails/orderEmailTemplate"
import { sendEmail } from "@/utils/email"
import { useOrderStore, useProductStore } from "@/stores"
import { EmailEnquiryUser, Order, ProductDTO } from "@/lib/types"
import { getCachedProducts, createOrder } from "@/actions"
import type { Order as PayPalOrderDetails } from "@paypal/paypal-server-sdk"
import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Footer } from "@/app/components/footer/Footer"
import { calculateTotalCost } from "@/lib/order"

const BasketPage = () => {
  const currentOrder = useOrderStore((state) => state.currentOrder)
  const totalCost = useOrderStore((state) => state.totalCost)
  const clearCurrentOrder = useOrderStore((state) => state.clearCurrentOrder)
  const [allProducts, setAllProducts] = useState<ProductDTO[] | null>(null)

  useEffect(() => {
    getCachedProducts().then(setAllProducts)
  }, [])

  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async () => {
    console.log("Email")
    const userDetails = {
      firstName: "Tim",
      surname: "Smart",
      email: "tjsmart57@gmail.com",
      address: "Test Address",
      phone: "12345",
    } as EmailEnquiryUser

    const emailHtml = OrderEmailTemplate(
      userDetails,
      currentOrder as unknown as Order,
    )

    await sendEmail({
      user: userDetails,
      subject: "New Order Received",
      html: emailHtml,
    })
  }

  /*
   * Handle a server-verified PayPal payment capture: persist the order to
   * the DB, then send the same confirmation email as the enquiry flow.
   */
  const handlePayPalSuccess = async (details: PayPalOrderDetails) => {
    if (!currentOrder || details.status !== "COMPLETED") return

    const userDetails = {
      firstName: "Tim",
      surname: "Smart",
      email: "tjsmart57@gmail.com",
      address: "Test Address",
      phone: "12345",
    } as EmailEnquiryUser

    await createOrder({
      customer_name: `${userDetails.firstName} ${userDetails.surname}`,
      customer_email: userDetails.email,
      customer_phone: userDetails.phone ?? undefined,
      notes: `PayPal order ${details.id}`,
      status: "PAID",
      products: currentOrder.orderProducts.map((product) => ({
        productId: product.productId,
        name: product.productName,
        quantity: product.quantity,
        price: Number(product.price),
      })),
    })

    const emailHtml = OrderEmailTemplate(
      userDetails,
      currentOrder as unknown as Order,
    )

    await sendEmail({
      user: userDetails,
      subject: "New Order Received",
      html: emailHtml,
    })

    clearCurrentOrder()
  }

  return (
    <div className="-m-4 md:-mx-16 md:-my-8 p-4 md:px-16 md:py-8 flex flex-col min-h-screen bg-brand-plum">
      <main className="flex flex-col grow gap-4 max-w-3xl mx-auto w-full py-8">
        <h1
          className="wm-h-page mb-4"
          style={{
            color: "var(--color-brand-cream)",
          }}
        >
          Basket
        </h1>
        <div
          style={{
            color: "rgba(245,237,232,0.65)",
          }}
        >
          {`Review your order below. If you are happy with your order, click the
          "Checkout" button to proceed.`}
        </div>
        <div
          style={{
            color: "rgba(245,237,232,0.45)",
          }}
        >
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
              backgroundColor: "var(--color-brand-plum-mid)",
              borderColor: "rgba(201,132,154,0.15)",
            }}
          >
            <h2
              className="wm-h-section mb-2"
              style={{
                color: "var(--color-brand-cream)",
              }}
            >
              Your Order
            </h2>
            <ul className="list-none flex flex-col gap-3">
              {allProducts &&
                currentOrder.orderProducts.map((product) => {
                  const productDetails = allProducts.find(
                    (p) => p.id === product.productId,
                  )
                  const imageUrl = productDetails?.images?.[0]?.url
                  return (
                    <li
                      key={product.id}
                      className="flex gap-4 items-center"
                      style={{
                        color: "var(--color-brand-cream)",
                      }}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={productDetails?.name || "Product image"}
                          width={128}
                          height={128}
                          className="h-32 inline-block mr-2 rounded object-cover"
                        />
                      ) : (
                        <div
                          className="h-32 w-32 inline-block mr-2 rounded"
                          style={{ backgroundColor: "var(--color-brand-plum)" }}
                        />
                      )}
                      {productDetails?.name || "Unavailable product"} -
                      Quantity: {product.quantity}
                    </li>
                  )
                })}
            </ul>
            <div
              className="text-brand-gold-light"
              style={{
                color: "var(--color-brand-gold-light)",
              }}
            >
              Total: £{calculateTotalCost(currentOrder.orderProducts)}
            </div>
            <PayPalProvider>
              <PayPalButton
                amount={totalCost?.toString() || ""}
                onSuccess={handlePayPalSuccess}
              />
            </PayPalProvider>

            <Button
              onClick={handleSuccess}
              className="w-fit rounded-full bg-brand-gold! text-brand-plum! hover:bg-brand-gold-light! font-medium"
            >
              Send Enquiry
            </Button>
          </div>
        ) : (
          <div
            style={{
              color: "rgba(245,237,232,0.5)",
            }}
          >
            Your basket is empty.
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
export default BasketPage
