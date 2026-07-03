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
          router.push(`/${countryCode}/account?error=google_auth_failed`)
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

        // STEP 1: Exchange the Google code for a Medusa token
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
          throw new Error(`Auth failed: ${response.status}`)
        }

        const data = await response.json()

        if (!data.token) {
          throw new Error("No token received from Medusa")
        }

        // STEP 2: Hand the token to the SERVER so it can
        // set the proper HTTP-only cookie, create the
        // customer record if needed, and clear the cache
        setStatus("Setting up your account...")

        const result = await completeGoogleLogin(data.token)

        if (!result.success) {
          throw new Error(result.error || "Login completion failed")
        }

        setStatus("Success! Redirecting to your account...")

        setTimeout(() => {
          router.push(`/${countryCode}/account`)
          router.refresh()
        }, 500)
      } catch (error) {
        console.error("Google callback failed:", error)
        setStatus("Sign in failed. Redirecting...")
        setTimeout(() => {
          router.push(`/${countryCode}/account?error=google_auth_failed`)
        }, 2000)
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
      <p style={{ fontSize: "16px", color: "#333" }}>{status}</p>
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
