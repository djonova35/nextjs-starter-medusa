// src/subscribers/order-delivery-handler.ts
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderDeliveryHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModuleService = container.resolve(Modules.ORDER)
  const customerModuleService = container.resolve(Modules.CUSTOMER)

  const order = await orderModuleService.retrieveOrder(data.id)

  // 1. Calculate points (1 point per £1)
  const pointsEarned = Math.floor(Number(order.total) / 100)

  // 2. Update Customer Metadata (Points & Delivery Date for Timer)
  if (order.customer_id) {
    const customer = await customerModuleService.retrieveCustomer(order.customer_id)
    
    // Update total points and store the delivery date for this specific order
    await customerModuleService.updateCustomer(order.customer_id, {
      metadata: {
        ...customer.metadata,
        points: (Number(customer.metadata?.points || 0)) + pointsEarned,
        [`delivery_date_${order.id}`]: new Date().toISOString(),
      }
    })
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfilled", // Or your custom "delivered" event
}
