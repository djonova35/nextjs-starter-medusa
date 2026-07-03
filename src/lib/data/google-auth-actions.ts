"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag, setAuthToken } from "./cookies"

// -----------------------------------------------------
// Decode JWT payload
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
// Manually refresh the token by calling Medusa's
// refresh endpoint with the current token in the header
// -----------------------------------------------------
async function manualRefreshToken(currentToken: string): Promise<string | null> {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://medusa-production-08a5.up.railway.app"

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  try {
    const response = await fetch(`${backendUrl}/auth/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
        authorization: `Bearer ${currentToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[GoogleAuth] Manual refresh HTTP ${response.status}:`,
        errorText.slice(0, 200)
      )
      return null
    }

    const data = await response.json()
    return data?.token || null
  } catch (err: any) {
    console.error("[GoogleAuth] Manual refresh threw error:", err?.message)
    return null
  }
}

// -----------------------------------------------------
// Complete the Google OAuth callback
// -----------------------------------------------------
export async function completeGoogleLoginFromParams(
  queryParams: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  console.log("[GoogleAuth] Step 1: Starting SDK callback flow")
  console.log("[GoogleAuth] Query param keys:", Object.keys(queryParams))

  try {
    // -----------------------------------------------
    // Step A: SDK does the code-for-token exchange
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 2: Calling sdk.auth.callback")

    const initialToken = (await sdk.auth.callback(
      "customer",
      "google",
      queryParams
    )) as string

    console.log(
      "[GoogleAuth] Step 3: Received initial token, length:",
      initialToken?.length || 0
    )

    if (!initialToken) {
      return { success: false, error: "SDK callback returned no token" }
    }

    // -----------------------------------------------
    // Step B: Check if customer exists
    // -----------------------------------------------
    const payload = decodeJwtPayload(initialToken)
    console.log(
      "[GoogleAuth] Step 4: Initial token actor_id:",
      payload.actor_id || "(empty - new user)"
    )

    let finalToken = initialToken

    // -----------------------------------------------
    // Step C: If no actor_id, create customer AND
    // then manually refresh with the initial token
    // in the authorization header
    // -----------------------------------------------
    if (!payload.actor_id) {
      const email =
        payload.email ||
        payload.user_metadata?.email ||
        payload.app_metadata?.email

      console.log("[GoogleAuth] Step 5: Creating customer for", email)

      try {
        await sdk.store.customer.create(
          email ? { email } : {},
          {},
          { authorization: `Bearer ${initialToken}` }
        )
        console.log("[GoogleAuth] Customer create call completed")
      } catch (createErr: any) {
        const msg = createErr?.message || String(createErr)
        console.log("[GoogleAuth] Customer create result:", msg)
        // Ignore "already exists" errors
      }

      // -----------------------------------------------
      // MANUAL refresh — pass the initial token in header
      // This is the key fix
      // -----------------------------------------------
      console.log("[GoogleAuth] Step 6: Manually refreshing token")
      const refreshedToken = await manualRefreshToken(initialToken)

      if (refreshedToken) {
        finalToken = refreshedToken
        const refreshedPayload = decodeJwtPayload(refreshedToken)
        console.log(
          "[GoogleAuth] Refreshed token actor_id:",
          refreshedPayload.actor_id || "(still empty - bad)"
        )
        console.log(
          "[GoogleAuth] Refreshed token length:",
          refreshedToken.length
        )
      } else {
        console.error(
          "[GoogleAuth] ⚠️ Refresh returned no token — using initial (login will fail)"
        )
      }
    }

    // -----------------------------------------------
    // Step D: Store the final token in the cookie
    // -----------------------------------------------
    console.log("[GoogleAuth] Step 7: Setting auth cookie")
    await setAuthToken(finalToken)

    // -----------------------------------------------
    // Step E: Clear cache so account page re-fetches
    // -----------------------------------------------
    const customerCacheTag = await getCacheTag("customers")
    if (customerCacheTag) {
      revalidateTag(customerCacheTag)
    }

    // -----------------------------------------------
    // Step F: Sanity check — does the final token
    // actually have an actor_id?
    // -----------------------------------------------
    const finalPayload = decodeJwtPayload(finalToken)
    if (!finalPayload.actor_id) {
      console.error(
        "[GoogleAuth] ❌ Final token has no actor_id — user won't stay logged in"
      )
      return {
        success: false,
        error: "Token refresh did not attach customer ID",
      }
    }

    console.log(
      "[GoogleAuth] ✅ All steps complete, actor_id:",
      finalPayload.actor_id
    )
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
