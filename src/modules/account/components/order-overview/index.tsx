"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

// Logic to add inside your Order display component:

const OrderTimer = ({ order }: { order: any }) => {
  const deliveryDate = order.metadata?.[`delivery_date_${order.id}`]
  
  if (!deliveryDate) return null

  const expiryDate = new Date(deliveryDate)
  expiryDate.setDate(expiryDate.getDate() + 14)
  
  const now = new Date()
  const timeLeft = expiryDate.getTime() - now.getTime()
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  if (daysLeft <= 0) return <p className="text-red-500">Return window closed</p>

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
      <p className="font-bold">Return Window: {daysLeft} days remaining</p>
      
      {/* THE REFUND BUTTON */}
      <button 
        onClick={() => /* open your refund modal */}
        className="mt-2 bg-black text-white px-4 py-2 rounded"
      >
        Request Refund
      </button>
    </div>
  )
}
const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">Nothing to see here</h2>
      <p className="text-base-regular">
        You don&apos;t have any orders yet, let us change that {":)"}
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Continue shopping
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
