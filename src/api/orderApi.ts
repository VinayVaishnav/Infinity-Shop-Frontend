import { authFetch } from './client'
import type { OrderDetail } from '../types/order'

export async function fetchOrderDetail(orderId: number): Promise<OrderDetail> {
  const res = await authFetch(
    `/user/order/getOrder?orderId=${encodeURIComponent(String(orderId))}`,
  )
  if (res.status === 401 || res.status === 403) {
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Could not load order')
  }
  return (await res.json()) as OrderDetail
}
