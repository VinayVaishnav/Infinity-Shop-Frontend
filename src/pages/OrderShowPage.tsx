import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchOrderDetail } from '../api/orderApi'
import { AppShell } from '../components/AppShell'
import type { OrderDetail } from '../types/order'

export function OrderShowPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const id = orderId ? Number.parseInt(orderId, 10) : Number.NaN

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Invalid order')
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const data = await fetchOrderDetail(id)
        if (!cancelled) {
          setDetail(data)
          setLoading(false)
        }
      } catch (e) {
        if (cancelled) return
        if (e instanceof Error && e.message === 'UNAUTHORIZED') {
          navigate('/login', { replace: true })
          return
        }
        setError(e instanceof Error ? e.message : 'Could not load order')
        setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id, navigate])

  const order = detail?.order

  return (
    <AppShell title="Order detail">
      <div>
        <Link
          to="/user/orders"
          className="text-sm font-semibold text-red-400 hover:text-red-300"
        >
          ← Back to orders
        </Link>

        {loading ? (
          <p className="mt-8 text-zinc-500">Loading order…</p>
        ) : error ? (
          <p className="mt-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
            {error}
          </p>
        ) : order ? (
          <>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl uppercase text-white">
                  Order #{order.id}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatInstant(order.createTime)}
                </p>
                {order.status ? (
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-violet-400">
                    {order.status}
                  </p>
                ) : null}
              </div>
              <p className="font-display text-3xl text-amber-400">
                ${order.totalPrice?.toFixed(2)}
              </p>
            </div>

            {detail.address ? (
              <section className="mt-8 rounded-xl border border-red-900/30 bg-zinc-900/40 p-4">
                <h3 className="font-display text-lg uppercase text-white">
                  Delivery address
                </h3>
                <p className="mt-2 text-sm text-zinc-300">{detail.address.address}</p>
                <p className="text-sm text-zinc-500">
                  {detail.address.cityLabel ?? `City #${detail.address.city}`} ·{' '}
                  {detail.address.pincode}
                </p>
              </section>
            ) : null}

            {order.razorpayPaymentId ? (
              <p className="mt-4 text-xs text-zinc-500">
                Payment ref: {order.razorpayPaymentId}
              </p>
            ) : null}

            <section className="mt-8">
              <h3 className="font-display text-lg uppercase text-white">Items</h3>
              {detail.lineItems.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500">No line items recorded.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {detail.lineItems.map((line, index) => {
                    const product = line.product
                    const key = product?.id ?? `missing-${index}`
                    const unit = product
                      ? Number.parseFloat(product.price)
                      : Number.NaN
                    const lineTotal = Number.isFinite(unit)
                      ? unit * line.quantity
                      : null

                    return (
                      <li
                        key={key}
                        className="flex flex-col gap-4 rounded-xl border border-red-900/30 bg-zinc-900/50 p-4 sm:flex-row sm:items-center"
                      >
                        {product?.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="h-24 w-24 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs text-zinc-500">
                            N/A
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          {product ? (
                            <>
                              <Link
                                to={`/user/product/${encodeURIComponent(product.name)}`}
                                className="font-display text-xl text-white hover:text-red-300"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-zinc-500">
                                {product.size ? `Size ${product.size} · ` : ''}$
                                {product.price} × {line.quantity}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-zinc-400">
                              Product unavailable × {line.quantity}
                            </p>
                          )}
                        </div>
                        {lineTotal != null ? (
                          <p className="font-display text-xl text-amber-400">
                            ${lineTotal.toFixed(2)}
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  )
}

function formatInstant(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
