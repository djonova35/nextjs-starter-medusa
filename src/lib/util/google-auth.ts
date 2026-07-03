// -----------------------------------------------------
// Google Auth Client-Side Utility
// -----------------------------------------------------

export async function loginWithGoogle(): Promise<void> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://medusa-production-08a5.up.railway.app"

  const publishableKey =
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  // Detect the current country code from the URL
  const pathSegments = window.location.pathname.split("/").filter(Boolean)
  const countryCode = pathSegments[0] || "gb"

  // ⚠️ Callback URL WITHOUT /account/ — matches new file location
  const callbackUrl = `${window.location.origin}/${countryCode}/google-callback`

  try {
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
        `Failed to initiate Google login: ${response.status}`
      )
    }

    const data = await response.json()

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
