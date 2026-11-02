import { Link } from 'react-router-dom'
import { categoryLabel } from '../constants/categories'
import type { ProductGroup } from '../utils/groupProducts'

interface ProductCardProps {
  group: ProductGroup
}

export function ProductCard({ group }: ProductCardProps) {
  const product = group.representative
  const label = product.categoryLabel ?? categoryLabel(product.category)
  const outOfStock = group.totalStock <= 0

  return (
    <Link
      to={`/user/product/${encodeURIComponent(group.name)}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-red-900/40 bg-gradient-to-b from-zinc-900 to-black shadow-lg shadow-red-950/30 transition hover:-translate-y-1 hover:border-red-500/60 hover:shadow-red-600/20"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rotate-12 rounded-full bg-red-600/20 blur-2xl transition group-hover:bg-red-500/30" />
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <span className="absolute left-3 top-3 rounded-md border border-red-500/50 bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-300">
          {label}
        </span>
        {group.variantCount > 1 ? (
          <span className="absolute right-3 top-3 rounded-md border border-amber-500/40 bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-300">
            {group.variantCount} sizes
          </span>
        ) : null}
        {outOfStock ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-zinc-900/90 px-2 py-1 text-xs font-bold uppercase text-zinc-400">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-tight text-white">{product.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="font-display text-xl text-amber-400">${product.price}</p>
          <span className="text-xs font-bold uppercase tracking-wide text-red-400 group-hover:text-red-300">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}
