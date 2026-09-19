import { useState } from 'react';
import { api } from '../api';

const STATUS_CYCLE = { 'Not Started': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Not Started' };
const STATUS_CLASS = { 'Not Started': 'not-started', 'In Progress': 'in-progress', 'Completed': 'completed' };
const PRIORITY_CLASS = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };

export default function Milestone({ milestone, roadmapId, isLast, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  async function cycleStatus() {
    const next = STATUS_CYCLE[milestone.status];
    setUpdating(true);
    try {
      const updated = await api.updateMilestone(roadmapId, milestone._id, next);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  }

  async function setStatus(status) {
    if (status === milestone.status) return;
    setUpdating(true);
    try {
      const updated = await api.updateMilestone(roadmapId, milestone._id, status);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  }

  const statusClass = STATUS_CLASS[milestone.status];

  return (
    <div className="milestone-item">
      <div className="milestone-left">
        <div className="milestone-number">0{milestone.order}</div>
        <button
          className={`milestone-status-dot ${statusClass}`}
          onClick={cycleStatus}
          disabled={updating}
          title={`Click to advance: ${STATUS_CYCLE[milestone.status]}`}
        />
        {!isLast && <div className="milestone-line" />}
      </div>

      <div className={`milestone-body ${statusClass}`}>
        <div className="milestone-header">
          <div className="milestone-skill">{milestone.skill}</div>
          <div className="milestone-badges">
            <span className={`badge ${PRIORITY_CLASS[milestone.priority] || 'badge-medium'}`}>
              {milestone.priority}
            </span>
            <span className={`badge ${milestone.status === 'Completed' ? 'badge-green' : ''}`}
              style={milestone.status !== 'Completed' ? { background: 'var(--paper)', border: '1px solid var(--border-dark)', color: 'var(--ink-light)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', padding: '2px 10px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' } : {}}>
              {milestone.status}
            </span>
          </div>
        </div>

        {milestone.description && (
          <p className="milestone-description">{milestone.description}</p>
        )}

        {milestone.nextStep && (
          <div className="milestone-nextstep">
            <strong style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--green)' }}>Next Step</strong>
            <p style={{ marginTop: 4 }}>{milestone.nextStep}</p>
          </div>
        )}

        {milestone.resource && (
          <div className="milestone-resource">
            Resources: <span>{milestone.resource}</span>
          </div>
        )}

        <div className="milestone-actions">
          {['Not Started', 'In Progress', 'Completed'].map(s => (
            <button key={s} className={`btn btn-sm ${milestone.status === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatus(s)} disabled={updating || milestone.status === s}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
