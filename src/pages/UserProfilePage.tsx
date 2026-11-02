import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteAddress,
  fetchAddresses,
  fetchCityOptions,
  saveAddress,
} from '../api/addressApi'
import { authFetch } from '../api/client'
import { updateUserProfile } from '../api/userApi'
import { AddressForm } from '../components/AddressForm'
import { AppShell } from '../components/AppShell'
import type { Address, CityOption } from '../types/address'
import type { UserInfo } from '../types/auth'

const inputClass =
  'mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-red-500'

export function UserProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserInfo | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cities, setCities] = useState<CityOption[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    const res = await authFetch('/user/')
    if (res.status === 401 || res.status === 403) {
      navigate('/login', { replace: true })
      return
    }
    if (!res.ok) {
      setError('Could not load profile')
      return
    }
    const data = (await res.json()) as UserInfo
    setProfile(data)
    setFirstName(data.firstName ?? '')
    setLastName(data.lastName ?? '')
  }, [navigate])

  const loadAddresses = useCallback(async () => {
    try {
      setAddresses(await fetchAddresses())
    } catch {
      setError('Could not load addresses')
    }
  }, [])

  useEffect(() => {
    void loadProfile()
    void loadAddresses()
    void fetchCityOptions()
      .then(setCities)
      .catch(() => setError('Could not load city options'))
  }, [loadProfile, loadAddresses])

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await updateUserProfile({ firstName, lastName })
      setMessage('Profile updated')
      await loadProfile()
    } catch {
      setError('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddAddress(data: {
    address: string
    city: number
    pincode: number
  }) {
    await saveAddress(data)
    setShowAddressForm(false)
    setMessage('Address added')
    await loadAddresses()
  }

  async function handleRemoveAddress(id: number) {
    setError(null)
    try {
      await deleteAddress(id)
      setMessage('Address removed')
      await loadAddresses()
    } catch {
      setError('Could not remove address')
    }
  }

  return (
    <AppShell title="Hero profile">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="overflow-hidden rounded-2xl border border-red-900/40 bg-gradient-to-br from-zinc-900 to-black">
          <div className="border-b border-red-900/30 bg-red-950/30 px-6 py-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              S.H.I.E.L.D. dossier
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase text-white">
              {profile?.userName ?? '…'}
            </h2>
            <p className="mt-1 text-sm text-amber-400/90">
              Clearance: {profile?.role?.name ?? '—'}
            </p>
          </div>
          <div className="p-6">
            {error ? <p className="mb-4 text-red-300">{error}</p> : null}
            {message ? (
              <p className="mb-4 text-sm text-amber-200">{message}</p>
            ) : null}
            {!profile ? (
              <p className="text-zinc-500">Loading profile…</p>
            ) : (
              <form className="space-y-4" onSubmit={(e) => void handleProfileSave(e)}>
                <ReadOnlyField label="Username" value={profile.userName} />
                <ReadOnlyField label="Email" value={profile.email || '—'} />
                <label className="block text-sm text-zinc-300">
                  First name
                  <input
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="block text-sm text-zinc-300">
                  Last name
                  <input
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save profile'}
                </button>
              </form>
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-red-900/40 bg-zinc-900/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-2xl uppercase text-white">Addresses</h3>
            <button
              type="button"
              onClick={() => setShowAddressForm((v) => !v)}
              className="rounded-md border border-red-700 px-3 py-1.5 text-sm text-red-300 hover:bg-red-950/50"
            >
              {showAddressForm ? 'Close form' : 'Add address'}
            </button>
          </div>

          {showAddressForm ? (
            <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-4">
              <AddressForm
                cities={cities}
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddressForm(false)}
              />
            </div>
          ) : null}

          <ul className="mt-6 space-y-3">
            {addresses.length === 0 ? (
              <li className="text-sm text-zinc-500">No saved addresses yet.</li>
            ) : (
              addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-sm text-zinc-300">
                    <p className="text-white">{addr.address}</p>
                    <p className="text-zinc-500">
                      {addr.cityLabel ?? `City #${addr.city}`} · {addr.pincode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addr.id != null && void handleRemoveAddress(addr.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </AppShell>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  )
}
