import { useState, useEffect } from 'react';
import { api } from '../api';

export default function CareerSelection({ student, onComplete, onBack }) {
  const [careers, setCareers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCareers()
      .then(setCareers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    if (!selected) return;
    setGenerating(true); setError('');
    try {
      const roadmap = await api.generateRoadmap({ studentId: student._id, careerId: selected._id });
      onComplete(roadmap, selected);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) return <div className="loading">Loading career paths<span className="loading-dots" /></div>;

  return (
    <div>
      <div className="section-label">Step 02</div>
      <h2 className="page-title">Career Paths</h2>
      <p className="page-subtitle">Choose the destination you want to reach, {student.name.split(' ')[0]}.</p>
      {error && <div className="alert alert-error">{error}</div>}

      {careers.length === 0 ? (
        <div className="alert alert-info">
          No careers found in the database. Run <code>npm run seed</code> in the server folder first.
        </div>
      ) : (
        <div className="career-grid">
          {careers.map(c => (
            <div key={c._id} className={`career-card${selected?._id === c._id ? ' selected' : ''}`}
              onClick={() => setSelected(c)}>
              <div className="career-card-title">{c.title}</div>
              {c.description && <p style={{ fontSize: '0.82rem', color: 'var(--ink-light)', marginBottom: 8 }}>{c.description}</p>}
              <div className="career-card-skills">
                Required: {c.requiredSkills.slice(0, 4).join(', ')}{c.requiredSkills.length > 4 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={handleGenerate}
          disabled={!selected || generating}>
          {generating ? 'Charting Expedition...' : 'Generate Expedition →'}
        </button>
        {selected && !generating && (
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-light)', fontStyle: 'italic' }}>
            Selected: {selected.title}
          </span>
        )}
      </div>
    </div>
  );
}
