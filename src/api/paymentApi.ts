import { authFetch } from './client'
import type { PaymentCreateResponse, RazorpaySuccessPayload } from '../types/razorpay'

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

let scriptPromise: Promise<void> | null = null

export function loadRazorpayCheckoutScript(): Promise<void> {
  if (window.Razorpay) {
    return Promise.resolve()
  }
  if (scriptPromise) {
    return scriptPromise
  }
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay')))
      return
    }
    const script = document.createElement('script')
    script.src = CHECKOUT_SCRIPT
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load Razorpay checkout'))
    document.body.appendChild(script)
  })
  return scriptPromise
}

export async function createRazorpayPaymentSession(
  amount: number,
  addressId: number,
): Promise<PaymentCreateResponse> {
  const res = await authFetch('/user/order/payment/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, addressId }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Could not start payment')
  }
  return (await res.json()) as PaymentCreateResponse
}

export async function verifyRazorpayPayment(
  amount: number,
  addressId: number,
  payload: RazorpaySuccessPayload,
): Promise<void> {
  const res = await authFetch('/user/order/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      addressId,
      razorpayOrderId: payload.razorpay_order_id,
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature,
    }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Payment verification failed')
  }
}
