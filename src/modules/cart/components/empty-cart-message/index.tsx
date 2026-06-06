import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import CartRecommendations from "@modules/cart/components/cart-recommendations"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Cart
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>

      {/* ── RECOMMENDATIONS (Favourites + Recently Viewed) ── */}
      <div className="w-full mt-12">
        <CartRecommendations />
      </div>
    </div>
  )
}

export default EmptyCartMessage
