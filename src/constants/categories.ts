import { ProductCategoryId, type ProductCategoryId as CategoryId } from '../types/product'

export const PRODUCT_CATEGORIES: {
  id: CategoryId | 'all'
  label: string
}[] = [
  { id: 'all', label: 'All gear' },
  { id: ProductCategoryId.T_SHIRT, label: 'T-Shirts' },
  { id: ProductCategoryId.SHIRT, label: 'Shirts' },
  { id: ProductCategoryId.SHOES, label: 'Shoes' },
  { id: ProductCategoryId.HOODIE, label: 'Hoodies' },
  { id: ProductCategoryId.ACCESSORY, label: 'Accessories' },
  { id: ProductCategoryId.CAP, label: 'Caps' },
]

export function categoryLabel(id: CategoryId): string {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? 'Gear'
}
