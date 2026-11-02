import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { updateProduct } from '../api/adminApi'
import { fetchAllProducts } from '../api/productApi'
import { PRODUCT_CATEGORIES } from '../constants/categories'
import { categoryLabel } from '../constants/categories'
import { AppShell } from '../components/AppShell'
import type { Product, ProductCategoryId } from '../types/product'

const inputClass =
  'mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-500'

export function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const list = await fetchAllProducts()
      setProducts(
        [...list].sort((a, b) =>
          `${a.name}-${a.size}`.localeCompare(`${b.name}-${b.size}`),
        ),
      )
    } catch {
      setError('Could not load inventory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.size ?? '').toLowerCase().includes(q),
    )
  }, [products, filter])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setMessage(null)
    try {
      await updateProduct(editing)
      setMessage(`Saved ${editing.name} (${editing.size})`)
      setEditing(null)
      await load()
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell title="Inventory command">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            ← Admin dashboard
          </Link>
          <h1 className="mt-2 font-display text-3xl uppercase text-white">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Edit SKUs via <code className="text-violet-300">POST /admin/product</code>
          </p>
        </div>
        <input
          type="search"
          placeholder="Filter by name or size…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
        />
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mb-4 text-sm text-emerald-300">{message}</p>
      ) : null}

      {loading ? (
        <p className="text-zinc-500">Loading inventory…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-violet-900/40">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-violet-900/40 bg-violet-950/30 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.map((p) => (
                <tr key={p.id} className="bg-zinc-950/40 hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-zinc-500">{p.id}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-white">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{p.size ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    {p.categoryLabel ?? categoryLabel(p.category)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        (p.stock ?? 0) <= 0 ? 'text-red-400' : 'text-emerald-400'
                      }
                    >
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-amber-400">${p.price}</td>
                  <td className="px-4 py-3">
                    {p.isAvailable === false ? (
                      <span className="text-red-400">No</span>
                    ) : (
                      <span className="text-emerald-400">Yes</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing({ ...p })
                        setMessage(null)
                      }}
                      className="rounded-md border border-violet-700 px-2 py-1 text-xs font-semibold text-violet-300 hover:bg-violet-950/50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-zinc-500">No products match.</p>
          ) : null}
        </div>
      )}

      {editing ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-product-title"
        >
          <form
            onSubmit={(e) => void handleSave(e)}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-violet-800/50 bg-zinc-950 p-6 shadow-2xl"
          >
            <h2 id="edit-product-title" className="font-display text-2xl uppercase text-white">
              Edit SKU #{editing.id}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Changes apply to this size variant only.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block text-sm text-zinc-300">
                Name
                <input
                  className={inputClass}
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  required
                />
              </label>
              <label className="block text-sm text-zinc-300">
                Description
                <textarea
                  className={inputClass}
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-zinc-300">
                  Size
                  <input
                    className={inputClass}
                    value={editing.size ?? ''}
                    onChange={(e) =>
                      setEditing({ ...editing, size: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm text-zinc-300">
                  Price
                  <input
                    className={inputClass}
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <label className="block text-sm text-zinc-300">
                Category
                <select
                  className={inputClass}
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: Number(e.target.value) as ProductCategoryId,
                    })
                  }
                >
                  {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm text-zinc-300">
                Image URL
                <input
                  className={inputClass}
                  value={editing.image}
                  onChange={(e) =>
                    setEditing({ ...editing, image: e.target.value })
                  }
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-zinc-300">
                  Stock
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={editing.stock ?? 0}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        stock: Number.parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editing.isAvailable !== false}
                    onChange={(e) =>
                      setEditing({ ...editing, isAvailable: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-zinc-600"
                  />
                  Available for sale
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save product'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AppShell>
  )
}
