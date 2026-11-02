/** Matches backend ProductCategory ids */
export const ProductCategoryId = {
  T_SHIRT: 1,
  SHIRT: 2,
  SHOES: 3,
  HOODIE: 4,
  ACCESSORY: 5,
  CAP: 6,
} as const

export type ProductCategoryId =
  (typeof ProductCategoryId)[keyof typeof ProductCategoryId]

export interface Product {
  id: number
  name: string
  description: string
  category: ProductCategoryId
  categoryLabel?: string
  price: string
  image: string
  isAvailable?: boolean
  stock?: number
  size?: string
}
