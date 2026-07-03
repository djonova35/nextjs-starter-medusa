"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { completeGoogleLoginFromParams } from "@lib/data/google-auth-actions"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const [status, setStatus] = useState("Signing you in with Google...")

  // -----------------------------------------------------
  // useRef persists across re-renders — we use it as
  // a guard to make sure the callback only fires ONCE
  // even if React's strict mode calls useEffect twice
  // -----------------------------------------------------
  const hasRunRef = useRef(false)

  useEffect(() => {
    // Bail out on the second call
    if (hasRunRef.current) {
      console.log("[GoogleCallback] Already ran, skipping second invocation")
      return
    }
    hasRunRef.current = true

    const handleCallback = async () => {
      const countryCode = (params.countryCode as string) || "gb"

      // Collect ALL query params — the SDK needs them
      const queryParams: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        queryParams[key] = value
      })

      if (!queryParams.code) {
        setStatus("No authorization code received. Redirecting...")
        setTimeout(() => {
          router.push(`/${countryCode}/account`)
        }, 2000)
        return
      }

      try {
        setStatus("Completing sign in...")

        const result = await completeGoogleLoginFromParams(queryParams)

        if (!result.success) {
          console.error("Login failed:", result.error)
          setStatus(
            `Sign in issue: ${result.error?.slice(0, 100)}. Redirecting...`
          )
          setTimeout(() => {
            router.push(`/${countryCode}/account`)
            router.refresh()
          }, 3000)
          return
        }

        setStatus("Success! Redirecting to your account...")

        setTimeout(() => {
          router.push(`/${countryCode}/account`)
          router.refresh()
        }, 500)
      } catch (error: any) {
        console.error("Google callback failed:", error)
        setStatus(`Error: ${error.message?.slice(0, 100)}. Redirecting...`)
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
      <p style={{ fontSize: "16px", color: "#333", maxWidth: "500px" }}>
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
