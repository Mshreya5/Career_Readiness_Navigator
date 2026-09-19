import { useState } from 'react';
import Milestone from './Milestone';

export default function Expedition({ roadmap: initialRoadmap, student, onBack, onRegenerate }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);

  const total = roadmap.milestones.length;
  const completed = roadmap.milestones.filter(m => m.status === 'Completed').length;
  const inProgress = roadmap.milestones.filter(m => m.status === 'In Progress').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const currentMilestone = roadmap.milestones.find(m => m.status !== 'Completed');

  function handleMilestoneUpdate(updatedRoadmap) {
    setRoadmap(updatedRoadmap);
  }

  return (
    <div>
      <div className="section-label">Step 03 — Expedition</div>

      <div className="expedition-header">
        <div className="expedition-title">{roadmap.careerTitle}</div>
        <div className="expedition-meta">
          <span className="match-badge">Starting Match: {roadmap.matchPercentage}%</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-light)' }}>
            {student.name} · {total} milestone{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="progress-section">
        <div className="progress-title">Journey Log</div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
        <div className="progress-stats">
          <div className="progress-stat"><strong>{percentage}%</strong> complete</div>
          <div className="progress-stat"><strong>{completed}/{total}</strong> completed</div>
          {inProgress > 0 && <div className="progress-stat"><strong>{inProgress}</strong> in progress</div>}
          <div className="progress-stat"><strong>{total - completed}</strong> remaining</div>
          {currentMilestone && (
            <div className="progress-stat">Current: <strong>{currentMilestone.skill}</strong></div>
          )}
        </div>
      </div>

      {/* All milestones completed */}
      {completed === total && total > 0 && (
        <div className="alert alert-success" style={{ marginBottom: 24 }}>
          🎉 Expedition complete! You've covered all skills for <strong>{roadmap.careerTitle}</strong>.
        </div>
      )}

      {/* Milestones */}
      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <p>No skill gaps found — you already match all requirements for this career!</p>
        </div>
      ) : (
        <div className="milestone-list">
          {roadmap.milestones.map((m, idx) => (
            <Milestone
              key={m._id}
              milestone={m}
              roadmapId={roadmap._id}
              isLast={idx === roadmap.milestones.length - 1}
              onUpdate={handleMilestoneUpdate}
            />
          ))}
        </div>
      )}

      <hr className="divider" />
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-secondary" onClick={onBack}>← Change Career</button>
        <button className="btn btn-secondary" onClick={onRegenerate}>↺ Regenerate</button>
      </div>
    </div>
  );
}
