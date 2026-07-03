"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "./cookies"

// -----------------------------------------------------
// Decode JWT payload to check if customer exists
// -----------------------------------------------------
function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const payloadPart = token.split(".")[1]
    const padded = payloadPart + "=".repeat((4 - (payloadPart.length % 4)) % 4)
    const decoded = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch (err) {
    console.error("[GoogleAuth] JWT decode failed:", err)
    return {}
  }
}

// -----------------------------------------------------
// Complete the Google OAuth callback using the SDK's
// built-in method. This handles:
// - Exchanging the code with Medusa
// - Creating the customer record if first-time
// - Returning a proper session token
// -----------------------------------------------------
export async function completeGoogleLoginFromParams(
  queryParams: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  console.log("[GoogleAuth] Step 1: Starting SDK callback flow")
  console.log("[GoogleAuth] Query param keys:", Object.keys(queryParams))

  try {
    // -----------------------------------------------
    // Step A: Use SDK's built-in callback method
    // This does the code-for-token exchange for us
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 2: Calling sdk.auth.callback")

    const token = (await sdk.auth.callback(
      "customer",
      "google",
      queryParams
    )) as string

    console.log(
      "[GoogleAuth] Step 3: Received token, length:",
      token?.length || 0
    )

    if (!token) {
      return { success: false, error: "SDK callback returned no token" }
    }

    // -----------------------------------------------
    // Step B: Check if customer record exists yet
    // by inspecting the token's actor_id
    // -----------------------------------------------
    const payload = decodeJwtPayload(token)
    console.log("[GoogleAuth] Step 4: Token payload actor_id:", payload.actor_id)

    let finalToken = token

    if (!payload.actor_id) {
      // -----------------------------------------------
      // First-time Google user — need to create the
      // customer record before the token becomes valid
      // -----------------------------------------------
      console.log(
        "[GoogleAuth] Step 5: First-time user, creating customer"
      )

      const email =
        payload.email ||
        payload.user_metadata?.email ||
        payload.app_metadata?.email

      console.log("[GoogleAuth] Email:", email || "not in token")

      try {
        await sdk.store.customer.create(
          email ? { email } : {},
          {},
          { authorization: `Bearer ${token}` }
        )
        console.log("[GoogleAuth] Customer created")
      } catch (createErr: any) {
        const msg = createErr?.message || String(createErr)
        console.log("[GoogleAuth] Customer create result:", msg)
        // Ignore "already exists" errors — that's fine
      }

      // -----------------------------------------------
      // Refresh the token using SDK's proper method
      // Now that customer exists, we get a real session
      // -----------------------------------------------
      try {
        console.log("[GoogleAuth] Step 6: Refreshing token via SDK")
        const refreshed = (await sdk.auth.refresh()) as string

        if (refreshed) {
          finalToken = refreshed
          console.log(
            "[GoogleAuth] Refreshed token length:",
            refreshed.length
          )
        }
      } catch (refreshErr: any) {
        console.warn(
          "[GoogleAuth] Refresh failed (non-fatal):",
          refreshErr?.message
        )
      }
    }

    // -----------------------------------------------
    // Step C: Store the final token in the cookie
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 7: Setting auth cookie")
    await setAuthToken(finalToken)

    // -----------------------------------------------
    // Step D: Clear the cached "not logged in" state
    // -----------------------------------------------
    const customerCacheTag = await getCacheTag("customers")
    if (customerCacheTag) {
      revalidateTag(customerCacheTag)
    }

    console.log("[GoogleAuth] ✅ All steps complete")
    return { success: true }
  } catch (error: any) {
    console.error("[GoogleAuth] ❌ FATAL:", error?.message || error)
    console.error("[GoogleAuth] Stack:", error?.stack)
    return {
      success: false,
      error: error?.message || String(error),
    }
  }
}
