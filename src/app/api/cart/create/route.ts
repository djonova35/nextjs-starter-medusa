import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      { error: "Store configuration missing" },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const regionId = body.region_id

    // Get region if not provided
    let finalRegionId = regionId
    if (!finalRegionId) {
      const regionRes = await fetch(`${backendUrl}/store/regions`, {
        headers: { "x-publishable-api-key": publishableKey },
      })
      if (regionRes.ok) {
        const regionData = await regionRes.json()
        finalRegionId = regionData.regions?.[0]?.id
      }
    }

    const res = await fetch(`${backendUrl}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify({ region_id: finalRegionId }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Cart create error:", data)
      return NextResponse.json(
        { error: data.message || "Failed to create cart" },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error("Cart create error:", err)
    return NextResponse.json(
      { error: "Failed to create cart", detail: err.message },
      { status: 500 }
    )
  }
}
