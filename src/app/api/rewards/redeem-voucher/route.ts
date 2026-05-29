import { NextRequest, NextResponse } from "next/server"
import { getAuthHeaders } from "@lib/data/cookies"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL" },
      { status: 500 }
    )
  }

  const authHeaders = await getAuthHeaders()
  const body = await req.text()

  const res = await fetch(
    `${BACKEND_URL}/store/customers/me/rewards/redeem-voucher`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PUBLISHABLE_KEY
          ? { "x-publishable-api-key": PUBLISHABLE_KEY }
          : {}),
        ...authHeaders,
      },
      body,
      cache: "no-store",
    }
  )

  const text = await res.text()

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  })
}
