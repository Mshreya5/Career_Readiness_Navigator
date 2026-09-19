import { useState } from 'react'
import { User, Mail, GraduationCap, Save } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import './Profile.css'

export default function Profile() {
  const { user, updateProfile } = useApp()
  const [form, setForm] = useState({ ...user })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSave(e) {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="profile-layout">
        <div className="card profile-avatar-card">
          <div className="avatar-circle">
            {form.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3>{form.name}</h3>
          <p>{form.email}</p>
          <span className="badge badge-primary">Career explorer</span>
        </div>

        <div className="card profile-form-card">
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label><User size={14} /> Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><Mail size={14} /> Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label><GraduationCap size={14} /> College</label>
                <input name="college" value={form.college} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Education</label>
                <input name="education" value={form.education || ''} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
