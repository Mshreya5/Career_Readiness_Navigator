import { useEffect, useState, useRef } from 'react'
import { CheckCircle, Circle, Clock, ExternalLink, Sparkles, Loader2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import styles from './Roadmap.module.css'

export default function Roadmap() {
  const {
    user,
    targetCareer,
    roadmap,
    backendRoadmap,
    generateRoadmap,
    updateMilestoneStatus,
    toggleMilestone,
    loading
  } = useApp()
  const [generating, setGenerating] = useState(false)
  const ranRef = useRef(null)

  useEffect(() => {
    const sId = user?._id || user?.id
    const cId = user?.selectedCareer?._id || user?.selectedCareer || user?.targetCareerId || targetCareer?.id || targetCareer?._id
    const key = `${sId}_${cId}`
    if (sId && cId && ranRef.current !== key) {
      ranRef.current = key
      setGenerating(true)
      generateRoadmap(sId, cId).finally(() => setGenerating(false))
    }
  }, [user, targetCareer, generateRoadmap])

  const backendMilestones = backendRoadmap?.milestones || []

  if (backendMilestones.length > 0) {
    const totalCount = backendMilestones.length
    const completedCount = backendMilestones.filter((m) => m.status === 'Completed').length
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
      <AppLayout>
        <div className={styles.page}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Learning Roadmap</h1>
              <p className={styles.sub}>
                {targetCareer ? `Personalized path to ${targetCareer.title}` : 'Your personalized learning path'}
              </p>
            </div>
            <div className={styles.overallProgress}>
              {(generating || loading) && (
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Loader2 size={14} className="spin" /> Updating roadmap…
                </span>
              )}
              <span className={styles.overallPct}>{pct}%</span>
              <span className={styles.overallLabel}>{completedCount}/{totalCount} milestones completed</span>
            </div>
          </div>

          <div className={styles.overallBar}>
            <ProgressBar value={completedCount} max={totalCount} height={8} />
          </div>

          <div className={styles.timeline}>
            {backendMilestones.map((m) => {
              const isDone = m.status === 'Completed'
              const isInProgress = m.status === 'In Progress'

              const handleMilestoneClick = () => {
                const nextStatus = isDone ? 'Not Started' : isInProgress ? 'Completed' : 'In Progress'
                updateMilestoneStatus(backendRoadmap._id, m._id, nextStatus)
              }

              return (
                <div key={m._id || m.order} className={styles.phaseRow}>
                  <div className={styles.spine}>
                    <div
                      className={styles.spineDot}
                      style={{
                        background: isDone ? 'var(--forest)' : isInProgress ? 'var(--gold)' : 'var(--border)',
                        borderColor: isDone ? 'var(--forest)' : isInProgress ? 'var(--gold)' : 'var(--border)'
                      }}
                    />
                    <div className={styles.spineLine} />
                  </div>

                  <div className={`card ${styles.phaseCard}`}>
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className={`badge ${isDone ? 'badge-forest' : isInProgress ? 'badge-gold' : 'badge-slate'}`}>
                            Step {m.order}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background: m.priority === 'High' ? '#fee2e2' : '#fef3c7',
                              color: m.priority === 'High' ? '#991b1b' : '#92400e'
                            }}
                          >
                            {m.priority} Priority
                          </span>
                        </div>
                        <span className="badge" style={{ textTransform: 'capitalize' }}>
                          {m.status}
                        </span>
                      </div>

                      <h3 className={styles.phaseTitle} style={{ marginTop: '0.25rem' }}>
                        {m.skill}
                      </h3>
                      <p className={styles.phaseDesc} style={{ marginTop: '0.35rem', color: 'var(--ink-muted)' }}>
                        {m.description}
                      </p>

                      {m.nextStep && (
                        <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', margin: '0.75rem 0 0.5rem', fontSize: '0.88rem' }}>
                          💡 <strong>Action Step:</strong> {m.nextStep}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <button
                          className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                          onClick={handleMilestoneClick}
                        >
                          {isDone ? <CheckCircle size={15} /> : <Circle size={15} />}
                          {isDone ? 'Completed' : isInProgress ? 'Mark Complete' : 'Start Learning'}
                        </button>

                        {m.resource && (
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(m.skill + ' tutorial documentation')}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.resourceLink}
                            style={{ fontSize: '0.85rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <ExternalLink size={13} /> {m.resource}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </AppLayout>
    )
  }

  const totalDone = roadmap.reduce((s, p) => s + p.milestones.filter((m) => m.done).length, 0)
  const totalAll = roadmap.reduce((s, p) => s + p.milestones.length, 0)

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Learning Roadmap</h1>
            <p className={styles.sub}>
              {targetCareer ? `Personalized path to ${targetCareer.title}` : 'Your personalized learning path'}
            </p>
          </div>
          <div className={styles.overallProgress}>
            <span className={styles.overallPct}>{Math.round((totalDone / totalAll) * 100)}%</span>
            <span className={styles.overallLabel}>{totalDone}/{totalAll} milestones</span>
          </div>
        </div>

        <div className={styles.overallBar}>
          <ProgressBar value={totalDone} max={totalAll} height={8} />
        </div>

        <div className={styles.timeline}>
          {roadmap.map((phase, idx) => {
            const done = phase.milestones.filter((m) => m.done).length
            const total = phase.milestones.length
            const pct = Math.round((done / total) * 100)

            return (
              <div key={phase.id} className={styles.phaseRow}>
                <div className={styles.spine}>
                  <div className={styles.spineDot} />
                  {idx < roadmap.length - 1 && <div className={styles.spineLine} />}
                </div>

                <div className={`card ${styles.phaseCard}`}>
                  <div className={styles.phaseHeader}>
                    <div className={styles.phaseLeft}>
                      <span className="badge badge-forest">Phase {phase.phase}</span>
                      <h3 className={styles.phaseTitle}>{phase.title}</h3>
                      <span className={styles.phaseDur}><Clock size={12} />{phase.duration}</span>
                    </div>
                    <div className={styles.phaseRight}>
                      <div className={styles.phasePct}>{pct}%</div>
                    </div>
                  </div>

                  <div className={styles.phaseBody}>
                    <p className={styles.phaseDesc}>{phase.description}</p>
                    <div className={styles.milestones}>
                      {phase.milestones.map((m) => (
                        <button
                          key={m.id}
                          className={`${styles.milestone} ${m.done ? styles.milestoneDone : ''}`}
                          onClick={() => toggleMilestone(phase.id, m.id)}
                        >
                          {m.done ? <CheckCircle size={16} /> : <Circle size={16} />}
                          <span className={styles.milestoneText}>{m.text}</span>
                          <span className={styles.milestoneHours}>{m.hours}h</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
