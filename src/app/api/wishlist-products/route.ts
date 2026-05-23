import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll("id")

  if (!ids.length) {
    return NextResponse.json({ products: [] })
  }

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      { error: "Store configuration missing" },
      { status: 500 }
    )
  }

  try {
    // Step 1: Get the first available region
    const regionRes = await fetch(`${backendUrl}/store/regions`, {
      headers: { "x-publishable-api-key": publishableKey },
    })

    let regionId: string | null = null

    if (regionRes.ok) {
      const regionData = await regionRes.json()
      regionId = regionData.regions?.[0]?.id || null
      console.log("Using region:", regionId)
    }

    // Step 2: Fetch products with region for pricing
    const params = new URLSearchParams()
    ids.forEach((id) => params.append("id", id))
    if (regionId) params.append("region_id", regionId)

    const res = await fetch(
      `${backendUrl}/store/products?${params.toString()}`,
      {
        headers: { "x-publishable-api-key": publishableKey },
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Medusa error:", res.status, errorText)
      return NextResponse.json(
        { error: `Backend error: ${res.status}`, detail: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    // Pass region back so client can use it for cart
    return NextResponse.json({ ...data, region_id: regionId })

  } catch (err: any) {
    console.error("Fetch error:", err)
    return NextResponse.json(
      { error: "Failed to fetch products", detail: err.message },
      { status: 500 }
    )
  }
}
