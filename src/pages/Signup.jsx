import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import styles from './Auth.module.css'

const INTERESTS = ['Web Development','Data Science','Machine Learning','Mobile Dev','DevOps','Cybersecurity','UX Design','Product Management']

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', education: '', interests: [] })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

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
  function submit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { signup(form); navigate('/dashboard') }, 500)
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <Link to="/" className={styles.logo}><Compass size={22} strokeWidth={1.8} /><span>CareerNav</span></Link>
        <h1 className={styles.heading}>Create your account</h1>
        <p className={styles.sub}>Start navigating your career today — it's free.</p>
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
