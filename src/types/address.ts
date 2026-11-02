export interface CityOption {
  id: number
  label: string
}

export interface Address {
  id?: number
  userId?: number
  address: string
  city: number
  cityLabel?: string
  pincode: number
}
