// src/lib/data/returns.ts
// -----------------------------------------------------
// Server actions for handling customer refund requests
// Saves the request to the order's metadata for you to
// review in Medusa Admin later
// -----------------------------------------------------

"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getAuthHeaders, getCacheTag } from "./cookies"

// -----------------------------------------------------
// Submit a refund request for an order
// -----------------------------------------------------
export async function submitRefundRequest(
  orderId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`[Refund] Submitting request for order ${orderId}`)

  if (!orderId) {
    return { success: false, error: "Order ID is required" }
  }

  if (!reason || reason.trim().length < 10) {
    return {
      success: false,
      error: "Please provide a reason with at least 10 characters",
    }
  }

  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://medusa-production-08a5.up.railway.app"

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const authHeaders = await getAuthHeaders()

    // Call the backend endpoint to save the refund request
    const response = await fetch(
      `${backendUrl}/store/refund-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
          ...(authHeaders as any),
        },
        body: JSON.stringify({
          order_id: orderId,
          reason: reason.trim(),
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Refund] HTTP ${response.status}:`, errorText)
      return {
        success: false,
        error: `Request failed: ${response.status}`,
      }
    }

    // Clear any cached order data so the customer sees the update
    const orderCacheTag = await getCacheTag("orders")
    if (orderCacheTag) {
      revalidateTag(orderCacheTag)
    }

    console.log(`[Refund] ✅ Successfully submitted request`)
    return { success: true }
  } catch (error: any) {
    console.error("[Refund] Error:", error?.message)
    return {
      success: false,
      error: error?.message || "Something went wrong",
    }
  }
}
