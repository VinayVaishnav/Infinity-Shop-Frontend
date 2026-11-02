import { authFetch } from './client'
import type { CartItem } from '../types/cart'

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, line) => {
    const unit = Number.parseFloat(line.product.price)
    return sum + (Number.isFinite(unit) ? unit : 0) * line.quantity
  }, 0)
}

export async function fetchCartDetails(): Promise<CartItem[]> {
  const res = await authFetch('/user/cartDetails')
  if (!res.ok) {
    throw new Error('Failed to load cart')
  }
  return (await res.json()) as CartItem[]
}

export async function addToCart(prodId: number, username: string): Promise<void> {
  const res = await authFetch('/user/products/addToCart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prodId, username }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Could not add to cart')
  }
}

export async function removeFromCart(
  prodId: number,
  username: string,
): Promise<void> {
  const res = await authFetch('/user/products/removeFromCart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prodId, username }),
  })
  if (!res.ok) {
    throw new Error('Could not update cart')
  }
}

export async function checkout(amount: number, addressId: number): Promise<void> {
  const res = await authFetch('/user/order/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, addressId }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Checkout failed')
  }
}

export const CART_UPDATED_EVENT = 'marvel-cart-updated'

export function notifyCartUpdated(): void {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}
