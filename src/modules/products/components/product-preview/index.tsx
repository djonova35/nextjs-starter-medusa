"use client"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { useWishlist } from "@lib/context/wishlist-context"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wished = isInWishlist(product.id!)
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <div className="relative" data-testid="product-wrapper">
      {/* HEART — always visible */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleWishlist(product.id!)
        }}
        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm transition-all duration-200"
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        <svg
          width="16" height="16"
          viewBox="0 0 24 24"
          fill={wished ? "#9B7FE8" : "none"}
          stroke="#9B7FE8"
          strokeWidth="1.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <LocalizedClientLink href={`/products/${product.handle}`}>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <span className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </span>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
