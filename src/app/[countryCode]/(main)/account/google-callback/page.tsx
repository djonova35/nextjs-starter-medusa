"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      // Google returns a code in the URL after the user authorizes
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (!code) {
        console.error("No code received from Google")
        router.push("/account?error=google_auth_failed")
        return
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        "https://medusa-production-08a5.up.railway.app"

      try {
        // Send the code to Medusa's callback endpoint
        // Medusa exchanges it for a user session
        const response = await fetch(
          `${backendUrl}/auth/customer/google/callback?code=${code}&state=${state}`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error(`Auth failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.token) {
          // Store the auth token so the user is logged in
          document.cookie = `_medusa_jwt=${data.token}; path=/; max-age=86400; SameSite=Lax`
        }

        // Redirect to account page
        router.push("/account")
        router.refresh()
      } catch (error) {
        console.error("Google callback failed:", error)
        router.push("/account?error=google_auth_failed")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      flexDirection: "column",
      gap: "16px",
    }}>
      <p>Signing you in with Google...</p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Please wait, this only takes a moment.
      </p>
    </div>
  )
}
