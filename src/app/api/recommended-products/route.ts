import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const countryCode = searchParams.get("country_code") || "gb"
  const limit = parseInt(searchParams.get("limit") || "8", 10)
  const excludeIds = searchParams.getAll("exclude")

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      { error: "Store configuration missing" },
      { status: 500 }
    )
  }

  try {
    // Find region by country code
    const regionRes = await fetch(`${backendUrl}/store/regions`, {
      headers: { "x-publishable-api-key": publishableKey },
    })

    let regionId: string | null = null
    let currencyCode: string = "gbp"

    if (regionRes.ok) {
      const regionData = await regionRes.json()
      const regions = regionData.regions || []

      for (const region of regions) {
        const match = region.countries?.find(
          (c: any) => c.iso_2?.toLowerCase() === countryCode.toLowerCase()
        )
        if (match) {
          regionId = region.id
          currencyCode = region.currency_code || "gbp"
          break
        }
      }

      if (!regionId && regions.length > 0) {
        regionId = regions[0].id
        currencyCode = regions[0].currency_code || "gbp"
      }
    }

    // Fetch latest products
    const params = new URLSearchParams()
    params.append("limit", String(limit + excludeIds.length)) // overfetch to allow exclusion
    params.append("order", "-created_at")
    if (regionId) params.append("region_id", regionId)

    const res = await fetch(
      `${backendUrl}/store/products?${params.toString()}`,
      {
        headers: { "x-publishable-api-key": publishableKey },
        next: { revalidate: 300 }, // cache 5 mins
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { error: `Backend error: ${res.status}`, detail: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    const filtered = (data.products || [])
      .filter((p: any) => !excludeIds.includes(p.id))
      .slice(0, limit)

    return NextResponse.json({
      products: filtered,
      region_id: regionId,
      currency_code: currencyCode,
    })
  } catch (err: any) {
    console.error("Recommendations fetch error:", err)
    return NextResponse.json(
      { error: "Failed to fetch products", detail: err.message },
      { status: 500 }
    )
  }
}
