import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthError } from '../api/authApi'
import { useAuth } from '../auth/AuthContext'
import { AuthCard } from '../components/AuthCard'

const inputClass =
  'mt-1 w-full rounded-lg border border-red-900/50 bg-black px-3 py-2 text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, status } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const role = await login(username, password)
      navigate(role === 'ADMIN' ? '/admin' : '/user', { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not log in')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508] text-zinc-400">
        Assembling suit…
      </div>
    )
  }

  return (
    <AuthCard
      title="Assemble"
      subtitle="Every universe has its gear. Sign in and shop yours."
      footer={
        <span className="text-zinc-400">
          New recruit?{' '}
          <Link className="font-semibold text-red-400 hover:text-red-300" to="/signin">
            Join the team
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-left text-sm text-zinc-300">
          Username
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-left text-sm text-zinc-300">
          Password
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? (
          <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-red-600 py-2.5 font-display text-lg uppercase tracking-wide text-white hover:bg-red-500 disabled:opacity-60"
        >
          {submitting ? 'Deploying…' : 'Log in'}
        </button>
      </form>
    </AuthCard>
  )
}
