// -----------------------------------------------------
// Google Auth Client-Side Utility
// This runs in the browser (not on the server)
// because it needs access to window.location
// -----------------------------------------------------

export function loginWithGoogle(): void {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "https://medusa-production-08a5.up.railway.app"

  if (!backendUrl) {
    console.error("Medusa backend URL not configured")
    return
  }

  // Build the callback URL — where Google sends the user back
  const callbackUrl = `${window.location.origin}/account/google-callback`

  // Redirect the browser to Medusa's Google auth endpoint
  // Medusa handles the OAuth handshake with Google
  window.location.href = `${backendUrl}/auth/customer/google?callback_url=${encodeURIComponent(
    callbackUrl
  )}`
}
