import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { AppRole } from '../types/auth'
import { parseJwtClaims } from '../auth/jwt'
import { getStoredJwt } from '../auth/tokenStorage'

export function UserNavDropdown() {
  const navigate = useNavigate()
  const { logout, role } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const displayName =
    parseJwtClaims(getStoredJwt() ?? '')?.username ?? 'Hero'

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-red-800/80 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-red-500 hover:bg-red-950/40"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="hidden max-w-[120px] truncate sm:inline">{displayName}</span>
        <span className="font-display text-amber-400">▾</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-red-900/60 bg-zinc-950 shadow-xl shadow-black/50"
        >
          <Link
            role="menuitem"
            to="/user"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-red-950/50 hover:text-white"
          >
            Shop
          </Link>
          <Link
            role="menuitem"
            to="/user/cart"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-red-950/50 hover:text-white"
          >
            My cart
          </Link>
          <Link
            role="menuitem"
            to="/user/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-red-950/50 hover:text-white"
          >
            Profile
          </Link>
          <Link
            role="menuitem"
            to="/user/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-200 hover:bg-red-950/50 hover:text-white"
          >
            My orders
          </Link>
          {(role as AppRole | null) === 'ADMIN' ? (
            <Link
              role="menuitem"
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-amber-300/90 hover:bg-red-950/50 hover:text-amber-200"
            >
              Admin console
            </Link>
          ) : null}
          <div className="border-t border-red-900/40" />
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleLogout()}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-300 hover:bg-red-950/50 hover:text-red-200"
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  )
}
