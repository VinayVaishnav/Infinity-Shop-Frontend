import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CART_UPDATED_EVENT, fetchCartDetails } from '../api/cartApi'

export function CartIconLink() {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    try {
      const items = await fetchCartDetails()
      setCount(items.reduce((n, line) => n + line.quantity, 0))
    } catch {
      setCount(0)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onUpdate = () => void refresh()
    window.addEventListener(CART_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate)
  }, [refresh])

  return (
    <Link
      to="/user/cart"
      className="relative rounded-md border border-red-800/80 p-2 text-zinc-200 transition hover:border-red-500 hover:bg-red-950/40 hover:text-white"
      aria-label={`Cart, ${count} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-5 w-5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
        />
        <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="17" cy="20" r="1.25" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 ? (
        <span
          className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  )
}
