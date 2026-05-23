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
    // Step 1: Get region by country code
    const regionRes = await fetch(`${backendUrl}/store/regions`, {
      headers: { "x-publishable-api-key": publishableKey },
    })

    let regionId: string | null = null

    if (regionRes.ok) {
      const regionData = await regionRes.json()
      const regions = regionData.regions || []

      for (const region of regions) {
        const match = region.countries?.find(
          (c: any) => c.iso_2?.toLowerCase() === countryCode.toLowerCase()
        )
        if (match) {
          regionId = region.id
          break
        }
      }

      if (!regionId && regions.length > 0) {
        regionId = regions[0].id
      }

      console.log("Country:", countryCode, "| Region ID:", regionId)
    }

    // Step 2: Fetch products with region_id
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

    // Step 3: Log what prices actually came back so we can debug
    console.log("=== PRICE DEBUG ===")
    data.products?.forEach((p: any) => {
      console.log("Product:", p.title)
      p.variants?.forEach((v: any) => {
        console.log("  Variant:", v.title)
        console.log("  calculated_price:", JSON.stringify(v.calculated_price))
        console.log("  prices:", JSON.stringify(v.prices))
      })
    })
    console.log("===================")

    return NextResponse.json({
      ...data,
      region_id: regionId,
    })
  } catch (err: any) {
    console.error("Wishlist fetch error:", err)
    return NextResponse.json(
      { error: "Failed to fetch products", detail: err.message },
      { status: 500 }
    )
  }
}
