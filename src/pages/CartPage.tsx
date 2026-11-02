import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAddresses } from '../api/addressApi'
import {
  cartTotal,
  fetchCartDetails,
  notifyCartUpdated,
  removeFromCart,
} from '../api/cartApi'
import {
  createRazorpayPaymentSession,
  loadRazorpayCheckoutScript,
  verifyRazorpayPayment,
} from '../api/paymentApi'
import type { Address } from '../types/address'
import { parseJwtClaims } from '../auth/jwt'
import { getStoredJwt } from '../auth/tokenStorage'
import { AppShell } from '../components/AppShell'
import type { CartItem } from '../types/cart'

export function CartPage() {
  const navigate = useNavigate()
  const username = parseJwtClaims(getStoredJwt() ?? '')?.username ?? ''

  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchCartDetails()
      setItems(data)
    } catch {
      setError('Could not load your cart')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    void fetchAddresses()
      .then((list) => {
        setAddresses(list)
        if (list.length > 0 && list[0].id != null) {
          setSelectedAddressId(list[0].id)
        }
      })
      .catch(() => setError('Could not load delivery addresses'))
  }, [load])

  const total = cartTotal(items)

  async function handleRemove(prodId: number) {
    if (!username) return
    setBusy(true)
    try {
      await removeFromCart(prodId, username)
      await load()
      notifyCartUpdated()
    } catch {
      setError('Could not update cart')
    } finally {
      setBusy(false)
    }
  }

  async function handleCheckout() {
    if (items.length === 0) return
    if (addresses.length === 0 || selectedAddressId == null) {
      setError('Please add a delivery address on your profile before checkout.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await loadRazorpayCheckoutScript()
      const session = await createRazorpayPaymentSession(total, selectedAddressId)
      const Razorpay = window.Razorpay
      if (!Razorpay) {
        throw new Error('Razorpay checkout is unavailable')
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new Razorpay({
          key: session.keyId,
          amount: session.amountPaise,
          currency: session.currency,
          name: 'INFINITY SHOP',
          description: 'Test payment via Razorpay',
          order_id: session.razorpayOrderId,
          prefill: {
            name: session.prefillName,
            email: session.prefillEmail,
          },
          theme: { color: '#dc2626' },
          handler: (response) => {
            void (async () => {
              try {
                await verifyRazorpayPayment(total, selectedAddressId, response)
                notifyCartUpdated()
                navigate('/user/orders', { replace: false })
                resolve()
              } catch (e) {
                reject(e instanceof Error ? e : new Error('Payment verification failed'))
              }
            })()
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled'))
            },
          },
        })
        rzp.on('payment.failed', (response) => {
          reject(
            new Error(response.error?.description ?? 'Payment failed'),
          )
        })
        rzp.open()
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Checkout failed'
      if (message !== 'Payment cancelled') {
        setError(message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title="Gear locker">
      <div>
        <h2 className="font-display text-3xl uppercase text-white">My cart</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Review your loadout, then pay with Razorpay test checkout (INR, same
          numeric total as cart).
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-zinc-500">Loading cart…</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-700 p-10 text-center">
            <p className="text-zinc-400">Your cart is empty.</p>
            <Link
              to="/user"
              className="mt-4 inline-block text-sm font-semibold text-red-400 hover:text-red-300"
            >
              Shop the catalog →
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex flex-col gap-4 rounded-xl border border-red-900/30 bg-zinc-900/50 p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl text-white">{product.name}</h3>
                    <p className="text-sm text-zinc-500">
                      {product.size ? `Size ${product.size} · ` : ''}${product.price} ×{' '}
                      {quantity}
                    </p>
                  </div>
                  <p className="font-display text-xl text-amber-400">
                    $
                    {(
                      Number.parseFloat(product.price) * quantity
                    ).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleRemove(product.id)}
                    className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    Remove one
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-red-900/30 bg-zinc-900/40 p-4">
              <h3 className="font-display text-lg uppercase text-white">
                Delivery address
              </h3>
              {addresses.length === 0 ? (
                <p className="mt-2 text-sm text-red-300">
                  No address on file.{' '}
                  <Link to="/user/profile" className="underline hover:text-red-200">
                    Add one in your profile
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {addresses.map((addr) => (
                    <li key={addr.id}>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm ${
                          selectedAddressId === addr.id
                            ? 'border-red-500 bg-red-950/30'
                            : 'border-zinc-800 hover:border-red-900/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="checkout-address"
                          checked={selectedAddressId === addr.id}
                          onChange={() =>
                            addr.id != null && setSelectedAddressId(addr.id)
                          }
                          className="mt-1"
                        />
                        <span className="text-zinc-300">
                          <span className="block text-white">{addr.address}</span>
                          <span className="text-zinc-500">
                            {addr.cityLabel ?? `City #${addr.city}`} · {addr.pincode}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex flex-col items-end gap-4 border-t border-red-900/30 pt-6 sm:flex-row sm:justify-between">
              <p className="font-display text-3xl text-white">
                Total{' '}
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleCheckout()}
                className="rounded-lg bg-red-600 px-8 py-3 font-display text-lg uppercase tracking-wide text-white hover:bg-red-500 disabled:opacity-60"
              >
                {busy ? 'Opening payment…' : 'Pay with Razorpay (test)'}
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
