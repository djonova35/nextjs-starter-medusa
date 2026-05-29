import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.getAll("id")
  const countryCode = searchParams.get("country_code") || "gb"

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
    // Get region by country code
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

      // Fallback to first region
      if (!regionId && regions.length > 0) {
        regionId = regions[0].id
        currencyCode = regions[0].currency_code || "gbp"
      }

      console.log("Country:", countryCode, "| Region:", regionId, "| Currency:", currencyCode)
    }

    // Fetch products with region_id
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
      return NextResponse.json(
        { error: `Backend error: ${res.status}`, detail: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      ...data,
      region_id: regionId,
      currency_code: currencyCode,
    })
  } catch (err: any) {
    console.error("Wishlist fetch error:", err)
    return NextResponse.json(
      { error: "Failed to fetch products", detail: err.message },
      { status: 500 }
    )
  }
}
