import type { Product } from '../types/product'

export interface ProductGroup {
  name: string
  representative: Product
  variantCount: number
  totalStock: number
}

export function groupProductsByName(products: Product[]): ProductGroup[] {
  const byName = new Map<string, Product[]>()

  for (const product of products) {
    const list = byName.get(product.name) ?? []
    list.push(product)
    byName.set(product.name, list)
  }

  return Array.from(byName.entries()).map(([name, variants]) => {
    const sorted = [...variants].sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
    const representative =
      sorted.find(
        (v) => v.isAvailable !== false && (v.stock ?? 0) > 0,
      ) ?? sorted[0]

    return {
      name,
      representative,
      variantCount: variants.length,
      totalStock: variants.reduce((sum, v) => sum + (v.stock ?? 0), 0),
    }
  })
}
