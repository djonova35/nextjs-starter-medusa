"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "./cookies"

// -----------------------------------------------------
// Decode JWT payload manually — no external library
// -----------------------------------------------------
function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const payloadPart = token.split(".")[1]
    // Add padding if needed for base64 decoding
    const padded = payloadPart + "=".repeat((4 - (payloadPart.length % 4)) % 4)
    const decoded = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch (err) {
    console.error("[GoogleAuth] JWT decode failed:", err)
    return {}
  }
}

// -----------------------------------------------------
// Complete the Google login flow on the server
// -----------------------------------------------------
export async function completeGoogleLogin(
  token: string
): Promise<{ success: boolean; error?: string }> {
  console.log("[GoogleAuth] Step 1: Starting completeGoogleLogin")

  try {
    if (!token) {
      console.error("[GoogleAuth] No token provided")
      return { success: false, error: "No token provided" }
    }

    // -----------------------------------------------
    // Step A: Store the token FIRST
    // Even if later steps fail, at least the user
    // has an auth cookie
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 2: Setting auth token cookie")
    await setAuthToken(token)

    // -----------------------------------------------
    // Step B: Inspect the token to see if a customer
    // exists yet
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 3: Decoding JWT payload")
    const payload = decodeJwtPayload(token)
    console.log("[GoogleAuth] Payload keys:", Object.keys(payload))
    console.log("[GoogleAuth] actor_id:", payload.actor_id)

    let finalToken = token

    // -----------------------------------------------
    // Step C: If no actor_id, this is a first-time
    // Google login — create the customer record
    // -----------------------------------------------
    if (!payload.actor_id) {
      console.log(
        "[GoogleAuth] Step 4: First-time login, creating customer record"
      )

      const email =
        payload.email ||
        payload.user_metadata?.email ||
        payload.app_metadata?.email ||
        payload.auth_identity?.email

      console.log("[GoogleAuth] Email from payload:", email)

      if (!email) {
        // Fall back: try to fetch email from the auth identity
        try {
          const authIdentity = await sdk.client.fetch<any>(
            "/auth/session",
            {
              method: "GET",
              headers: { authorization: `Bearer ${token}` },
            }
          )
          console.log("[GoogleAuth] Auth session:", authIdentity)
        } catch (e) {
          console.error("[GoogleAuth] Auth session fetch failed:", e)
        }
      }

      // Try to create the customer — swallow error if it already exists
      try {
        await sdk.store.customer.create(
          { email: email || `google-user-${Date.now()}@djonova.com` },
          {},
          { authorization: `Bearer ${token}` }
        )
        console.log("[GoogleAuth] Customer created successfully")
      } catch (createError: any) {
        const errMsg = createError?.message || String(createError)
        console.log("[GoogleAuth] Customer creation result:", errMsg)
        // If customer already exists, that's fine — continue
        if (
          !errMsg.toLowerCase().includes("already") &&
          !errMsg.toLowerCase().includes("exist")
        ) {
          console.warn(
            "[GoogleAuth] Non-duplicate customer creation error, continuing anyway"
          )
        }
      }

      // Refresh the token so it includes the actor_id
      try {
        console.log("[GoogleAuth] Step 5: Refreshing token")
        const refreshResponse = await sdk.client.fetch<{ token: string }>(
          "/auth/token/refresh",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        )

        if (refreshResponse?.token) {
          finalToken = refreshResponse.token
          await setAuthToken(finalToken)
          console.log("[GoogleAuth] Token refreshed and stored")
        } else {
          console.warn(
            "[GoogleAuth] Refresh returned no token, keeping original"
          )
        }
      } catch (refreshError: any) {
        console.warn(
          "[GoogleAuth] Token refresh failed (non-fatal):",
          refreshError?.message || refreshError
        )
        // Keep the original token — the customer creation may still let us in
      }
    }

    // -----------------------------------------------
    // Step D: Clear the cached "not logged in" state
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 6: Revalidating customer cache")
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    console.log("[GoogleAuth] ✅ All steps complete")
    return { success: true }
  } catch (error: any) {
    console.error("[GoogleAuth] ❌ FATAL error in completeGoogleLogin:", error)
    console.error("[GoogleAuth] Error stack:", error?.stack)
    return {
      success: false,
      error: error?.message || String(error),
    }
  }
}
