import { useState } from 'react'
import { Bell, Gauge, Target, Shield, Trash2, Save } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CAREERS } from '../data/mockData.js'
import './Settings.css'

export default function Settings() {
  const { settings, updateSettings } = useApp()
  const [prefs, setPrefs] = useState(settings)
  const [saved, setSaved] = useState(false)

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  function save() {
    updateSettings(prefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your preferences and account</p>
      </div>

      <div className="settings-sections">
        <div className="card settings-section">
          <div className="settings-section-title"><Bell size={18} /> Notifications</div>
          <ToggleRow label="Email Notifications" desc="Receive updates about your progress" checked={prefs.emailNotifications} onChange={() => toggle('emailNotifications')} />
          <ToggleRow label="Weekly Report" desc="Get a weekly summary of your learning" checked={prefs.weeklyReport} onChange={() => toggle('weeklyReport')} />
        </div>

        <div className="card settings-section">
          <div className="settings-section-title"><Gauge size={18} /> Learning pace</div>
          <select value={prefs.learningPace || 'moderate'} onChange={e => setPrefs(p => ({ ...p, learningPace: e.target.value }))}>
            <option value="relaxed">Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="focused">Focused</option>
          </select>
        </div>

        <div className="card settings-section">
          <div className="settings-section-title"><Target size={18} /> Target career</div>
          <select value={prefs.targetCareerId || ''} onChange={e => setPrefs(p => ({ ...p, targetCareerId: e.target.value }))}>
            {CAREERS.map(career => <option key={career.id} value={career.id}>{career.title}</option>)}
          </select>
          <div className="settings-section-title" style={{ marginTop: '1.25rem' }}><Shield size={18} /> Privacy</div>
          <ToggleRow label="Public Profile" desc="Allow others to view your profile" checked={prefs.publicProfile ?? true} onChange={() => toggle('publicProfile')} />
        </div>

        <button className="btn btn-primary" onClick={save}><Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}</button>

        <div className="card settings-section danger-zone">
          <div className="settings-section-title"><Trash2 size={18} /> Danger Zone</div>
          <p>Permanently delete your account and all data.</p>
          <button className="btn" style={{ background: 'var(--danger)', color: '#fff', marginTop: '0.75rem' }}>
            Delete Account
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="toggle-label">{label}</div>
        <div className="toggle-desc">{desc}</div>
      </div>
      <button className={`toggle-btn${checked ? ' on' : ''}`} onClick={onChange} aria-label={label}>
        <span className="toggle-thumb" />
      </button>
    </div>
  )
}
