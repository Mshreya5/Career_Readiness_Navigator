import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import styles from './Auth.module.css'

const INTERESTS = ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Dev', 'DevOps', 'Cybersecurity', 'UX Design', 'Product Management']

export default function Signup() {
  const { signup, googleLogin } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', education: '', interests: [] })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function toggleInterest(i) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
    }))
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const u = await signup(form)
      if (u) {
        navigate('/dashboard')
      } else {
        setError('Could not create account. Please try again.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    try {
      const res = await googleLogin()
      if (res) {
        navigate('/dashboard')
      }
    } catch {
      setError('Google Sign-In failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <Link to="/" className={styles.logo}><Compass size={22} strokeWidth={1.8} /><span>CareerNova</span></Link>
        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.sub}>Start navigating your career today — it's free.</p>
        {error && <div className={styles.error}>{error}</div>}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: 600 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign up with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>or email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
        </div>

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.grid2}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input id="name" name="name" className="form-input" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="semail">Email address</label>
              <input id="semail" name="email" type="email" className="form-input" value={form.email} onChange={handle} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="education">Education</label>
            <input id="education" name="education" className="form-input" placeholder="e.g. B.Tech CS, 3rd Year — NIT" value={form.education} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="spw">Password</label>
            <div className={styles.pwWrap}>
              <input id="spw" name="password" type={showPw ? 'text' : 'password'} className="form-input" value={form.password} onChange={handle} required />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)} aria-label="Toggle password">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Interests (select all that apply)</label>
            <div className={styles.interestGrid}>
              {INTERESTS.map(i => (
                <button key={i} type="button"
                  className={`${styles.interestBtn} ${form.interests.includes(i) ? styles.interestActive : ''}`}
                  onClick={() => toggleInterest(i)}>
                  {i}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className={styles.switchText}>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
