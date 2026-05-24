import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import NewArrivalsClient from "./new-arrivals-client"

export default async function NewArrivals({
  countryCode,
}: {
  countryCode: string
}) {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 12,
      order: "-created_at",
      fields: "*variants.calculated_price,*tags,*images,*options,*variants.options",
    } as any,
  })

  const products = (response?.products ?? []) as HttpTypes.StoreProduct[]

  return <NewArrivalsClient products={products} countryCode={countryCode} />
}
