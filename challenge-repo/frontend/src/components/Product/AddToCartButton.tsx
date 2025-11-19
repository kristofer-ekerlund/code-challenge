'use client'

export function AddToCartButton({ productId }: { productId: string }) {
  const addToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })

    alert(
      'Added to cart! Refresh the page to see the number change in the header. (hint: please remove me)',
    )
  }

  return (
    <button className="border px-2 py-1" onClick={addToCart}>
      Add to Cart
    </button>
  )
}
