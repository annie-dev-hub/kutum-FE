import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import logo from '@/assets/kutum-logo.png'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@kutum.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const success = await login(email, password)
    if (success) {
      const to = location.state?.from?.pathname || '/dashboard'
      navigate(to, { replace: true })
    } else {
      setError('Invalid credentials. Use admin@kutum.com / admin123 for admin or register for user account')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="card w-[90%] max-w-xl p-8 md:p-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-4">
          <img src={logo} className="w-8 h-8" alt="logo" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-primary">Kutum</h1>
        <p className="text-center text-slate-500 mb-6">Family Management System</p>
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>Demo: admin@kutum.com / admin123</p>
          <p>Or register for a new user account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary" />
          </div>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button disabled={loading} className="gradient-btn w-full py-3 text-center">
            {loading ? 'Signing In…' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

