export interface PaymentCreateResponse {
  keyId: string
  razorpayOrderId: string
  amountPaise: number
  currency: string
  cartTotal: number
  prefillName?: string
  prefillEmail?: string
}

export interface RazorpaySuccessPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface RazorpayCheckoutOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
  }
  theme?: { color?: string }
  handler: (response: RazorpaySuccessPayload) => void
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void
}

export interface RazorpayConstructor {
  new (options: RazorpayCheckoutOptions): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

export {}
