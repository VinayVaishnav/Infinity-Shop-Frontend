import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch } from '../api/client'
import { AppShell } from '../components/AppShell'

export function AdminHomePage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const res = await authFetch('/admin/dashboard')
      if (cancelled) return

      if (res.status === 401 || res.status === 403) {
        navigate('/login', { replace: true })
        return
      }
      if (!res.ok) {
        setError('Could not load admin dashboard')
        return
      }
      const data = (await res.json()) as { message?: string }
      setMessage(data.message ?? 'Welcome')
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <AppShell title="Admin command">
      <div className="rounded-2xl border border-violet-900/40 bg-gradient-to-br from-slate-900 to-violet-950/30 p-6">
        <h2 className="font-display text-3xl uppercase text-white">
          Admin dashboard
        </h2>
        {error ? <p className="mt-4 text-red-300">{error}</p> : null}
        {message ? (
          <p className="mt-4 text-xl text-violet-200">{message}</p>
        ) : !error ? (
          <p className="mt-4 text-slate-400">Loading…</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/inventory"
          className="group rounded-2xl border border-violet-800/50 bg-zinc-950/80 p-6 transition hover:border-violet-500 hover:bg-violet-950/20"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
            Operations
          </p>
          <h3 className="mt-2 font-display text-2xl uppercase text-white group-hover:text-violet-300">
            Inventory management
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            View all SKUs, update stock, pricing, images, and availability.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-violet-400">
            Open inventory →
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="group rounded-2xl border border-amber-900/40 bg-zinc-950/80 p-6 transition hover:border-amber-500/60 hover:bg-amber-950/10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Fulfillment
          </p>
          <h3 className="mt-2 font-display text-2xl uppercase text-white group-hover:text-amber-300">
            Order management
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            View all orders and update status from pending to delivered.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-amber-400">
            Manage orders →
          </span>
        </Link>

        <Link
          to="/user"
          className="group rounded-2xl border border-red-900/40 bg-zinc-950/80 p-6 transition hover:border-red-500/60"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">
            Storefront
          </p>
          <h3 className="mt-2 font-display text-2xl uppercase text-white group-hover:text-red-300">
            View shop
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            See the customer catalog as shoppers do.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-red-400">
            Go to shop →
          </span>
        </Link>
      </div>
    </AppShell>
  )
}
