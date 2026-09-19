import { useState } from 'react';
import { api } from '../api';

export default function StudentProfile({ onComplete }) {
  const [form, setForm] = useState({ name: '', email: '', skillInput: '', skills: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function addSkill() {
    const s = form.skillInput.trim();
    if (!s) return;
    if (form.skills.includes(s)) { setForm(f => ({ ...f, skillInput: '' })); return; }
    setForm(f => ({ ...f, skills: [...f.skills, s], skillInput: '' }));
  }

  function removeSkill(skill) {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setLoading(true); setError('');
    try {
      const student = await api.upsertStudent({ name: form.name.trim(), email: form.email.trim(), skills: form.skills });
      onComplete(student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="section-label">Step 01</div>
      <h2 className="page-title">Field Journal</h2>
      <p className="page-subtitle">Tell us about yourself and the skills you already have.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-title">Your Profile</div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="e.g. Alex Johnson" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="e.g. alex@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Current Skills</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="Type a skill and press Enter or Add"
                value={form.skillInput} onChange={e => setForm(f => ({ ...f, skillInput: e.target.value }))}
                onKeyDown={handleKeyDown} style={{ flex: 1 }} />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
            </div>
            {form.skills.length > 0 ? (
              <div className="skill-tags" style={{ marginTop: 12 }}>
                {form.skills.map(s => (
                  <span key={s} className="skill-tag">
                    {s}
                    <button className="skill-tag-remove" onClick={() => removeSkill(s)} type="button">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-light)', marginTop: 8, fontStyle: 'italic' }}>
                No skills added yet. Add skills you already know.
              </p>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Career Paths →'}
        </button>
      </form>
    </div>
  );
}
