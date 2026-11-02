import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch } from '../api/client'
import { AppShell } from '../components/AppShell'
import type { Order } from '../types/order'

export function MyOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const res = await authFetch('/user/order/all')
      if (cancelled) return

      if (res.status === 401 || res.status === 403) {
        navigate('/login', { replace: true })
        return
      }
      if (!res.ok) {
        setError('Could not load orders')
        setLoading(false)
        return
      }
      setOrders((await res.json()) as Order[])
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <AppShell title="Mission log">
      <div>
        <h2 className="font-display text-3xl uppercase text-white">My orders</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Past deployments from your cart checkouts.
        </p>

        {error ? (
          <p className="mt-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-zinc-500">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-700 p-10 text-center">
            <p className="text-zinc-400">No orders yet.</p>
            <Link
              to="/user"
              className="mt-4 inline-block text-sm font-semibold text-red-400 hover:text-red-300"
            >
              Browse the catalog →
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/user/orders/${order.id}`}
                  className="block rounded-xl border border-red-900/30 bg-zinc-900/50 p-5 transition hover:border-red-500/50 hover:bg-zinc-900/80"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-xl text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatInstant(order.createTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl text-amber-400">
                        ${order.totalPrice?.toFixed(2)}
                      </p>
                      {order.status ? (
                        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-violet-400">
                          {order.status}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {order.products && Object.keys(order.products).length > 0 ? (
                    <p className="mt-4 text-sm text-zinc-500">
                      {Object.keys(order.products).length} line item(s) — tap for
                      details
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-zinc-500">View order details</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
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
