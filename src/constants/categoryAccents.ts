import { ProductCategoryId, type ProductCategoryId as CategoryId } from '../types/product'

type ChipKey = CategoryId | 'all'

const chipBase =
  'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition'

export function categoryChipClass(id: ChipKey, active: boolean): string {
  const styles: Record<ChipKey, { on: string; off: string }> = {
    all: {
      on: 'border-red-500 bg-red-600 text-white shadow-md shadow-red-900/40',
      off: 'border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-red-500/50',
    },
    [ProductCategoryId.T_SHIRT]: {
      on: 'border-red-500 bg-red-600 text-white shadow-md shadow-red-900/40',
      off: 'border-red-900/40 bg-zinc-900/80 text-zinc-300 hover:border-red-500/50',
    },
    [ProductCategoryId.SHIRT]: {
      on: 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-900/40',
      off: 'border-blue-900/40 bg-zinc-900/80 text-zinc-300 hover:border-blue-500/50',
    },
    [ProductCategoryId.SHOES]: {
      on: 'border-amber-500 bg-amber-600 text-black shadow-md shadow-amber-900/40',
      off: 'border-amber-900/40 bg-zinc-900/80 text-zinc-300 hover:border-amber-500/50',
    },
    [ProductCategoryId.HOODIE]: {
      on: 'border-emerald-500 bg-emerald-600 text-white shadow-md shadow-emerald-900/40',
      off: 'border-emerald-900/40 bg-zinc-900/80 text-zinc-300 hover:border-emerald-500/50',
    },
    [ProductCategoryId.ACCESSORY]: {
      on: 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-900/40',
      off: 'border-purple-900/40 bg-zinc-900/80 text-zinc-300 hover:border-purple-500/50',
    },
    [ProductCategoryId.CAP]: {
      on: 'border-cyan-500 bg-cyan-600 text-black shadow-md shadow-cyan-900/40',
      off: 'border-cyan-900/40 bg-zinc-900/80 text-zinc-300 hover:border-cyan-500/50',
    },
  }

  const s = styles[id]
  return `${chipBase} ${active ? s.on : s.off}`
}
