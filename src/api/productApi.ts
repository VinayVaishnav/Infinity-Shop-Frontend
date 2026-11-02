import { authFetch } from './client'
import type { Product } from '../types/product'
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await authFetch('/user/products/all')
  if (!res.ok) {
    throw new Error('Failed to load products')
  }
  return (await res.json()) as Product[]
}

export async function fetchProductsByName(name: string): Promise<Product[]> {
  const res = await authFetch(
    `/user/products/product?name=${encodeURIComponent(name)}`,
  )
  if (!res.ok) {
    throw new Error('Failed to load product')
  }
  return (await res.json()) as Product[]
}

export async function searchProducts(
  keyword: string,
  categoryId: number,
): Promise<Product[]> {
  const res = await authFetch('/user/products/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, categoryId }),
  })
  if (!res.ok) {
    throw new Error('Search failed')
  }
  return (await res.json()) as Product[]
}
