import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllProducts, searchProducts } from '../api/productApi'
import { PRODUCT_CATEGORIES } from '../constants/categories'
import { categoryChipClass } from '../constants/categoryAccents'
import { AppShell } from '../components/AppShell'
import { MarvelCarousel } from '../components/MarvelCarousel'
import { ProductCard } from '../components/ProductCard'
import type { Product, ProductCategoryId } from '../types/product'
import { groupProductsByName } from '../utils/groupProducts'

export function UserHomePage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q')?.trim() ?? ''
  const searchCategory = Number.parseInt(searchParams.get('cat') ?? '0', 10)

  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<ProductCategoryId | 'all'>(
    'all',
  )

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        let list: Product[]
        if (searchQuery) {
          list = await searchProducts(
            searchQuery,
            Number.isFinite(searchCategory) ? searchCategory : 0,
          )
        } else {
          list = await fetchAllProducts()
        }
        if (cancelled) return
        setProducts(list)
      } catch {
        if (!cancelled) setError('Could not load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [searchQuery, searchCategory])

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return products
    return products.filter((p) => p.category === categoryFilter)
  }, [products, categoryFilter])

  const groups = useMemo(() => groupProductsByName(filtered), [filtered])

  return (
    <AppShell title="Shop the Multiverse">
      <div className="space-y-10">
        <MarvelCarousel />

        {searchQuery ? (
          <p className="text-sm text-zinc-400">
            Search results for{' '}
            <span className="text-amber-400">&quot;{searchQuery}&quot;</span>
            {searchCategory > 0 ? (
              <>
                {' '}
                in{' '}
                <span className="text-red-300">
                  {
                    PRODUCT_CATEGORIES.find(
                      (c) => c.id !== 'all' && c.id === searchCategory,
                    )?.label
                  }
                </span>
              </>
            ) : null}
          </p>
        ) : null}

        <section className="rounded-2xl border border-white/5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl uppercase text-white">
                Hero catalog
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {loading
                  ? 'Loading gear…'
                  : `${groups.length} style${groups.length === 1 ? '' : 's'} · pick a size on the product page`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => {
                const active = categoryFilter === cat.id
                return (
                  <button
                    key={String(cat.id)}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={categoryChipClass(cat.id, active)}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {error ? (
            <p className="mt-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-red-200">
              {error}
            </p>
          ) : null}

          {!error && !loading && groups.length === 0 ? (
            <p className="mt-8 text-center text-zinc-500">No products found.</p>
          ) : null}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <ProductCard key={group.name} group={group} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
