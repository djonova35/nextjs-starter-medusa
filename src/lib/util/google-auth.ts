// -----------------------------------------------------
// Google Auth Client-Side Utility
// -----------------------------------------------------
// Medusa v2's Google auth endpoint returns a JSON
// response containing the actual Google URL to redirect
// to. We fetch that JSON, then perform the redirect
// ourselves in the browser.
// -----------------------------------------------------

export async function loginWithGoogle(): Promise<void> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://medusa-production-08a5.up.railway.app"

  if (!backendUrl) {
    console.error("Medusa backend URL not configured")
    return
  }

  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  // Where Google will send the user back to after they log in
  const callbackUrl = `${window.location.origin}/account/google-callback`

  try {
    // -----------------------------------------------
    // STEP 1: Ask Medusa where to send the user
    // Medusa responds with { location: "https://accounts.google.com/..." }
    // -----------------------------------------------
    const response = await fetch(
      `${backendUrl}/auth/customer/google?callback_url=${encodeURIComponent(
        callbackUrl
      )}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to initiate Google login: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    // -----------------------------------------------
    // STEP 2: Redirect the browser to Google
    // -----------------------------------------------
    if (data.location) {
      window.location.href = data.location
    } else {
      throw new Error("No redirect URL returned from Medusa")
    }
  } catch (error) {
    console.error("Google login error:", error)
    alert(
      "Sorry, we could not start Google login. Please try again or use email/password."
    )
  }
}
