import { Link } from 'react-router-dom'
import { CartIconLink } from './CartIconLink'
import { HeaderSearch, HeaderSearchMobile } from './HeaderSearch'
import { UserNavDropdown } from './UserNavDropdown'

interface AppShellProps {
  title: string
  children: React.ReactNode
}

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#050508]">
      <header className="sticky top-0 z-50 border-b border-red-900/50 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/user" className="group flex shrink-0 items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-display text-xl font-bold text-white shadow-lg shadow-red-900/50"
            >
              M
            </span>
            <div>
              <p className="font-display text-lg uppercase leading-none text-white group-hover:text-red-400">
                INFINITY SHOP
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                {title}
              </p>
            </div>
          </Link>
          <HeaderSearch />
          <div className="flex shrink-0 items-center gap-2">
            <CartIconLink />
            <UserNavDropdown />
          </div>
        </div>
        <HeaderSearchMobile />
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
    </div>
  )
}
