import logo from '@/assets/kutum-logo.png'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate phone number (required by backend)
    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      setError('Phone number is required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password
    })

    if (success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="card w-[90%] max-w-xl p-8 md:p-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center mb-4">
          <img src={logo} className="w-8 h-8" alt="logo" />
        </div>
        <h1 className="text-3xl font-extrabold text-center text-primary">Create Account</h1>
        <p className="text-center text-slate-500 mb-6">Join the Kutum family management system</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">First Name (Optional)</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g., John"
                className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Last Name (Optional)</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g., Doe"
                className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 9999999999"
              className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
            />
            <p className="mt-1 text-xs text-slate-500">Required for login and account recovery</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email (Optional)</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., user@example.com"
              className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl bg-slate-100/80 px-4 py-3 outline-none focus:ring-2 ring-primary"
            />
          </div>

          {error && <p className="text-rose-600 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-3 text-center"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

