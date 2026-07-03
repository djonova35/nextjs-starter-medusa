// src/api/store/return-request/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { orderId, reason, images } = req.body

  // In a real implementation, you would use the Medusa Return Module
  // For now, we store this in the Order's metadata so the admin can see it
  const orderModuleService = req.scope.resolve("orderModuleService")
  
  await orderModuleService.updateOrders(orderId, {
    metadata: {
      return_status: "pending",
      return_reason: reason,
      return_images: images,
      return_requested_at: new Date().toISOString()
    }
  })

  res.status(200).json({ success: true })
}
