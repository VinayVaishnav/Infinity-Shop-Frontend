import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #e62429 0%, transparent 40%), radial-gradient(circle at 85% 80%, #1e40af 0%, transparent 35%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-14deg, transparent, transparent 14px, #fff 14px, #fff 15px)',
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-600 font-display text-3xl text-white shadow-lg shadow-red-900/60"
          >
            M
          </span>
        </div>
        <div className="rounded-2xl border border-red-900/50 bg-black/75 p-8 shadow-2xl shadow-red-950/40 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-400">
              INFINITY SHOP
            </p>
            <h1 className="mt-2 font-display text-3xl uppercase text-white">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
            ) : null}
          </div>
          {children}
          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
