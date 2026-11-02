import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthError } from '../api/authApi'
import { useAuth } from '../auth/AuthContext'
import { AuthCard } from '../components/AuthCard'

const inputClass =
  'mt-1 w-full rounded-lg border border-red-900/50 bg-black px-3 py-2 text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50'

export function SignInPage() {
  const navigate = useNavigate()
  const { signUp, status } = useAuth()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const role = await signUp({
        userName,
        password,
        firstName,
        lastName,
        email,
      })
      navigate(role === 'ADMIN' ? '/admin' : '/user', { replace: true })
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Could not sign up')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508] text-zinc-400">
        Loading…
      </div>
    )
  }

  return (
    <AuthCard
      title="Enlist"
      subtitle="Create your INFINITY SHOP account. New users register as USER."
      footer={
        <span className="text-zinc-400">
          Already enlisted?{' '}
          <Link className="font-semibold text-red-400 hover:text-red-300" to="/login">
            Log in
          </Link>
        </span>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-left text-sm text-zinc-300">
          First name
          <input
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="block text-left text-sm text-zinc-300">
          Last name
          <input
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </label>
        <label className="block text-left text-sm text-zinc-300">
          Email
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="block text-left text-sm text-zinc-300">
          Username
          <input
            className={inputClass}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
            autoComplete="new-password"
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
          {submitting ? 'Recruiting…' : 'Sign up'}
        </button>
      </form>
    </AuthCard>
  )
}
