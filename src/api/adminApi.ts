import { authFetch } from './client'
import type { OrderAdminRow } from '../types/order'
import type { Product } from '../types/product'

export async function updateProduct(product: Product): Promise<void> {
  const res = await authFetch('/admin/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  if (!res.ok) {
    throw new Error('Failed to save product')
  }
}

export async function fetchAllOrdersAdmin(): Promise<OrderAdminRow[]> {
  const res = await authFetch('/admin/allOrders')
  if (!res.ok) {
    throw new Error('Failed to load orders')
  }
  return (await res.json()) as OrderAdminRow[]
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
): Promise<void> {
  const res = await authFetch('/admin/order/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Failed to update status')
  }
}
