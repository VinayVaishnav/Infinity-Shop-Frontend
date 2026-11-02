import { apiUrl } from './apiBase'
import { authFetch } from './client'
import type { Address, CityOption } from '../types/address'

export async function fetchCityOptions(): Promise<CityOption[]> {
  const res = await fetch(apiUrl('/options/cities'))
  if (!res.ok) {
    throw new Error('Failed to load cities')
  }
  return (await res.json()) as CityOption[]
}

export async function fetchAddresses(): Promise<Address[]> {
  const res = await authFetch('/user/addresses')
  if (!res.ok) {
    throw new Error('Failed to load addresses')
  }
  const data = (await res.json()) as Address[] | null
  return data ?? []
}

export async function saveAddress(address: Omit<Address, 'id'> & { id?: number }): Promise<void> {
  const res = await authFetch('/user/address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })
  if (!res.ok) {
    throw new Error('Failed to save address')
  }
}

export async function deleteAddress(addressId: number): Promise<void> {
  const res = await authFetch(`/user/address/${addressId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to remove address')
  }
}
