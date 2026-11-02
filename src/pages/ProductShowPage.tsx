import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductsByName } from '../api/productApi'
import { addToCart, notifyCartUpdated } from '../api/cartApi'
import { parseJwtClaims } from '../auth/jwt'
import { getStoredJwt } from '../auth/tokenStorage'
import { categoryLabel } from '../constants/categories'
import { AppShell } from '../components/AppShell'
import type { Product } from '../types/product'

export function ProductShowPage() {
  const { name: encodedName } = useParams<{ name: string }>()
  const name = encodedName ? decodeURIComponent(encodedName) : ''
  const username = parseJwtClaims(getStoredJwt() ?? '')?.username ?? ''

  const [variants, setVariants] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const list = await fetchProductsByName(name)
        if (cancelled) return
        if (list.length === 0) {
          setError('Product not found')
          setLoading(false)
          return
        }
        setVariants(list)
        const defaultVariant =
          list.find((v) => v.isAvailable !== false && (v.stock ?? 0) > 0) ??
          list[0]
        setSelectedId(defaultVariant.id)
        setLoading(false)
      } catch {
        if (!cancelled) {
          setError('Could not load product')
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [name])

  const selected = useMemo(
    () => variants.find((v) => v.id === selectedId) ?? null,
    [variants, selectedId],
  )

  const sortedSizes = useMemo(() => {
    return [...variants].sort((a, b) =>
      (a.size ?? '').localeCompare(b.size ?? '', undefined, { numeric: true }),
    )
  }, [variants])

  async function handleAddToCart() {
    if (!selected || !username) return
    setAdding(true)
    setMessage(null)
    try {
      await addToCart(selected.id, username)
      notifyCartUpdated()
      setMessage(`Size ${selected.size ?? '—'} added to cart`)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (!name) {
    return (
      <AppShell title="Product">
        <p className="text-red-300">Invalid product</p>
      </AppShell>
    )
  }

  return (
    <AppShell title={name}>
      <Link to="/user" className="text-sm text-red-400 hover:text-red-300">
        ← Back to catalog
      </Link>

      {loading ? (
        <p className="mt-8 text-zinc-500">Loading…</p>
      ) : error ? (
        <p className="mt-8 text-red-300">{error}</p>
      ) : selected ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-red-900/40 bg-zinc-950">
            <img
              src={selected.image}
              alt={selected.name}
              className="aspect-square w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">
              {categoryLabel(selected.category)}
            </p>
            <h1 className="mt-2 font-display text-4xl uppercase text-white">
              {selected.name}
            </h1>
            <p className="mt-4 text-zinc-300">{selected.description}</p>
            <p className="mt-6 font-display text-3xl text-amber-400">
              ${selected.price}
            </p>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Select size
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sortedSizes.map((variant) => {
                  const outOfStock =
                    variant.isAvailable === false || (variant.stock ?? 0) <= 0
                  const active = variant.id === selectedId
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedId(variant.id)}
                      className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm font-semibold transition ${
                        outOfStock
                          ? 'cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600 line-through'
                          : active
                            ? 'border-red-500 bg-red-600 text-white'
                            : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-red-500/60'
                      }`}
                    >
                      {variant.size ?? '—'}
                    </button>
                  )
                })}
              </div>
              {selected.stock != null ? (
                <p className="mt-2 text-xs text-zinc-500">
                  {selected.stock > 0
                    ? `${selected.stock} in stock for this size`
                    : 'Out of stock'}
                </p>
              ) : null}
            </div>

            {message ? (
              <p className="mt-4 text-sm text-amber-200">{message}</p>
            ) : null}

            <button
              type="button"
              disabled={
                adding ||
                selected.isAvailable === false ||
                (selected.stock ?? 0) <= 0
              }
              onClick={() => void handleAddToCart()}
              className="mt-8 w-full rounded-lg bg-red-600 py-3 font-display text-lg uppercase tracking-wide text-white hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
