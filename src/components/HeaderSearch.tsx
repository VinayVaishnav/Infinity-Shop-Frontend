import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../constants/categories'
export function HeaderSearch() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [categoryId, setCategoryId] = useState<string>(
    searchParams.get('cat') ?? '0',
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    const q = keyword.trim()
    if (q) params.set('q', q)
    if (categoryId !== '0') params.set('cat', categoryId)
    navigate(`/user${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function clearSearch() {
    setKeyword('')
    setCategoryId('0')
    navigate('/user')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden min-w-0 flex-1 max-w-md items-center gap-2 md:flex"
    >
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="max-w-[7rem] shrink-0 rounded-md border border-red-900/50 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 outline-none focus:border-red-500"
        aria-label="Search category"
      >
        <option value="0">All</option>
        {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
          <option key={String(c.id)} value={String(c.id)}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search gear…"
        className="min-w-0 flex-1 rounded-md border border-red-900/50 bg-zinc-950 px-3 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-red-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold uppercase text-white hover:bg-red-500"
      >
        Search
      </button>
      {searchParams.get('q') ? (
        <button
          type="button"
          onClick={clearSearch}
          className="shrink-0 text-xs text-zinc-400 hover:text-white"
        >
          Clear
        </button>
      ) : null}
    </form>
  )
}

/** Mobile search — compact row below header on small screens */
export function HeaderSearchMobile() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')
  const [categoryId, setCategoryId] = useState(searchParams.get('cat') ?? '0')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    const q = keyword.trim()
    if (q) params.set('q', q)
    if (categoryId !== '0') params.set('cat', categoryId)
    navigate(`/user${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-red-900/30 px-4 py-2 md:hidden">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="rounded-md border border-red-900/50 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200"
        aria-label="Category"
      >
        <option value="0">All</option>
        {PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
          <option key={String(c.id)} value={String(c.id)}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search…"
        className="min-w-0 flex-1 rounded-md border border-red-900/50 bg-zinc-950 px-2 py-1.5 text-sm text-white"
      />
      <button type="submit" className="rounded-md bg-red-600 px-3 text-xs font-bold text-white">
        Go
      </button>
    </form>
  )
}
