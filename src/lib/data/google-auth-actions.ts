"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "./cookies"
import { transferCart } from "./customer"

// -----------------------------------------------------
// Decode a JWT payload without any external library
// -----------------------------------------------------
function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const payloadPart = token.split(".")[1]
    const decoded = Buffer.from(payloadPart, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

// -----------------------------------------------------
// Complete the Google login on the server side.
// 1. Store the token in the proper HTTP-only cookie
// 2. If this is a first-time Google user, create their
//    customer record and refresh the token
// 3. Revalidate the customer cache so the layout sees
//    the logged-in state immediately
// -----------------------------------------------------
export async function completeGoogleLogin(
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token) {
      return { success: false, error: "No token provided" }
    }

    // Store the token the same way normal email login does
    await setAuthToken(token)

    const payload = decodeJwtPayload(token)

    // -----------------------------------------------
    // First-time Google user: actor_id is empty,
    // meaning no customer record exists yet.
    // We must create one, then refresh the token.
    // -----------------------------------------------
    if (!payload.actor_id) {
      const email =
        payload.email ||
        payload.user_metadata?.email ||
        payload.app_metadata?.email

      if (!email) {
        return {
          success: false,
          error: "Could not determine email from Google account",
        }
      }

      // Create the customer using the auth token
      await sdk.store.customer.create(
        { email },
        {},
        { authorization: `Bearer ${token}` }
      )

      // Refresh the token so it now contains the customer ID
      const refreshedToken = await sdk.auth.refresh()
      await setAuthToken(refreshedToken as string)
    }

    // Clear the cached "not logged in" state
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    // Merge any guest cart into the customer's cart
    try {
      await transferCart()
    } catch {
      // Non-fatal — cart transfer failing shouldn't block login
    }

    return { success: true }
  } catch (error: any) {
    console.error("completeGoogleLogin failed:", error)
    return { success: false, error: error.toString() }
  }
}
