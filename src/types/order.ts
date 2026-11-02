import type { Product } from './product'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

export interface Order {
  id: number
  name?: string
  products: Record<string, number>
  userId: number
  totalPrice: number
  createTime: string
  addressId?: number
  status?: OrderStatus | string
  razorpayOrderId?: string
  razorpayPaymentId?: string
}

export interface Address {
  id?: number
  userId?: number
  address: string
  city: number
  cityLabel?: string
  pincode: number
}

export interface OrderAdminRow {
  order: Order
  address: Address | null
  userInfo: {
    userId: number
    userName: string
    email?: string
    firstName?: string
    lastName?: string
  } | null
}

export interface OrderLineItem {
  product: Product | null
  quantity: number
}

export interface OrderDetail {
  order: Order
  address: Address | null
  lineItems: OrderLineItem[]
}
