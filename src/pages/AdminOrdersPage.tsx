import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllOrdersAdmin, updateOrderStatus } from '../api/adminApi'
import { AppShell } from '../components/AppShell'
import { ORDER_STATUSES, type OrderAdminRow, type OrderStatus } from '../types/order'

const statusColors: Record<string, string> = {
  PENDING: 'text-amber-400',
  CONFIRMED: 'text-blue-400',
  PROCESSING: 'text-violet-400',
  SHIPPED: 'text-cyan-400',
  DELIVERED: 'text-emerald-400',
  CANCELLED: 'text-red-400',
}

export function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderAdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      setRows(await fetchAllOrdersAdmin())
    } catch {
      setError('Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleStatusChange(orderId: number, status: OrderStatus) {
    setUpdatingId(orderId)
    setError(null)
    try {
      await updateOrderStatus(orderId, status)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AppShell title="Order command">
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-violet-400 hover:text-violet-300">
          ← Admin dashboard
        </Link>
        <h1 className="mt-2 font-display text-3xl uppercase text-white">
          Order management
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Fulfillment queue from <code className="text-violet-300">GET /admin/allOrders</code>
        </p>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-500">Loading orders…</p>
      ) : rows.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map(({ order, address, userInfo }) => (
            <article
              key={order.id}
              className="rounded-xl border border-violet-900/40 bg-zinc-950/60 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-white">Order #{order.id}</p>
                  <p className="text-xs text-zinc-500">
                    {formatInstant(order.createTime)}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Customer:{' '}
                    <span className="text-white">
                      {userInfo?.userName ?? `User #${order.userId}`}
                    </span>
                    {userInfo?.email ? (
                      <span className="text-zinc-500"> · {userInfo.email}</span>
                    ) : null}
                  </p>
                  {address ? (
                    <p className="mt-1 text-sm text-zinc-400">
                      Ship to: {address.address}
                      {address.cityLabel ? `, ${address.cityLabel}` : ''}{' '}
                      {address.pincode}
                    </p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-amber-400">
                    ${order.totalPrice?.toFixed(2)}
                  </p>
                  <p
                    className={`mt-1 text-xs font-bold uppercase ${statusColors[order.status ?? 'PENDING'] ?? 'text-zinc-400'}`}
                  >
                    {order.status ?? 'PENDING'}
                  </p>
                </div>
              </div>

              <ul className="mt-4 text-sm text-zinc-400">
                {Object.entries(order.products ?? {}).map(([productId, qty]) => (
                  <li key={productId}>
                    Product #{productId} × {qty}
                  </li>
                ))}
              </ul>
              {order.razorpayPaymentId ? (
                <p className="mt-2 text-xs text-zinc-500">
                  Razorpay: {order.razorpayPaymentId}
                </p>
              ) : null}

              <label className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
                Update status
                <select
                  value={(order.status ?? 'PENDING') as OrderStatus}
                  disabled={updatingId === order.id}
                  onChange={(e) =>
                    void handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className="rounded-md border border-violet-800 bg-black px-2 py-1.5 text-sm text-white"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {updatingId === order.id ? (
                  <span className="text-xs text-zinc-500">Saving…</span>
                ) : null}
              </label>
            </article>
          ))}
        </div>
      )}
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
