import { useEffect, useState, type FormEvent } from 'react'
import type { CityOption } from '../types/address'

const inputClass =
  'mt-1 w-full rounded-lg border border-red-900/50 bg-black px-3 py-2 text-white outline-none focus:border-red-500'

interface AddressFormProps {
  cities: CityOption[]
  loadingCities?: boolean
  onSubmit: (data: { address: string; city: number; pincode: number }) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function AddressForm({
  cities,
  loadingCities,
  onSubmit,
  onCancel,
  submitLabel = 'Save address',
}: AddressFormProps) {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState<number>(cities[0]?.id ?? 1)
  const [pincode, setPincode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cities.length > 0 && !cities.some((c) => c.id === city)) {
      setCity(cities[0].id)
    }
  }, [cities, city])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const pin = Number.parseInt(pincode, 10)
      if (!Number.isFinite(pin) || pincode.length < 6) {
        throw new Error('Enter a valid 6-digit pincode')
      }
      await onSubmit({ address, city, pincode: pin })
      setAddress('')
      setPincode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={(e) => void handleSubmit(e)}>
      <label className="block text-left text-sm text-zinc-300">
        Street address
        <textarea
          className={inputClass}
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label className="block text-left text-sm text-zinc-300">
        City
        <select
          className={inputClass}
          value={city}
          disabled={loadingCities || cities.length === 0}
          onChange={(e) => setCity(Number(e.target.value))}
          required
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-left text-sm text-zinc-300">
        Pincode
        <input
          className={inputClass}
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          required
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
