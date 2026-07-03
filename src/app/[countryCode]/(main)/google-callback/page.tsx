"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { completeGoogleLogin } from "@lib/data/google-auth-actions"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const [status, setStatus] = useState("Signing you in with Google...")

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const countryCode = (params.countryCode as string) || "gb"

      if (!code) {
        setStatus("No authorization code received. Redirecting...")
        setTimeout(() => {
          router.push(`/${countryCode}/account?error=no_code`)
        }, 2000)
        return
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        "https://medusa-production-08a5.up.railway.app"

      const publishableKey =
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

      try {
        setStatus("Verifying with Medusa...")

        const response = await fetch(
          `${backendUrl}/auth/customer/google/callback?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state || "")}`,
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
          const errorText = await response.text()
          console.error("Medusa callback error response:", errorText)
          throw new Error(
            `Medusa returned ${response.status}: ${errorText.slice(0, 200)}`
          )
        }

        const data = await response.json()

        if (!data.token) {
          throw new Error("No token received from Medusa")
        }

        setStatus("Setting up your account...")

        const result = await completeGoogleLogin(data.token)

        // Even if result.success is false, the cookie may have been set
        // Just try going to the account page — the middleware will redirect
        // back to login if genuinely not authenticated
        if (!result.success) {
          console.warn(
            "completeGoogleLogin reported failure:",
            result.error
          )
          setStatus("Almost there, redirecting...")
        } else {
          setStatus("Success! Redirecting to your account...")
        }

        // Redirect to account regardless — if cookie was set, user is in
        setTimeout(() => {
          router.push(`/${countryCode}/account`)
          router.refresh()
        }, 800)
      } catch (error: any) {
        console.error("Google callback failed:", error)
        setStatus(`Sign in issue: ${error.message}. Redirecting...`)
        setTimeout(() => {
          router.push(`/${countryCode}/account`)
          router.refresh()
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, router, params])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
        gap: "16px",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e5e5e5",
          borderTopColor: "#4285F4",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ fontSize: "16px", color: "#333", maxWidth: "400px" }}>
        {status}
      </p>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
