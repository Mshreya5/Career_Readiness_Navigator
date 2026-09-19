import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'priya@example.com', password: 'demo1234', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => {
      login(form.email, form.password, form.remember)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}><Compass size={22} strokeWidth={1.8} /><span>CareerNav</span></Link>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to continue your journey</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={submit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handle} autoComplete="email" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className={styles.pwWrap}>
              <input id="password" name="password" type={showPw ? 'text' : 'password'} className="form-input" value={form.password} onChange={handle} autoComplete="current-password" required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <label className={styles.checkRow}>
            <input type="checkbox" name="remember" checked={form.remember} onChange={handle} />
            <span>Remember me</span>
          </label>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className={styles.switchText}>Don't have an account? <Link to="/signup">Create one</Link></p>
        <p className={styles.demoHint}>Demo: use any email + any password</p>
      </div>
    </div>
  )
}
