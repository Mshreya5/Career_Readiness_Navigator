import { useState } from 'react'
import { CheckCircle, Circle, ChevronDown, ChevronUp, Clock, ExternalLink } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import styles from './Roadmap.module.css'

const STATUS_STYLE = {
  completed:   { badge: 'badge-forest', dot: 'var(--forest)' },
  'in-progress': { badge: 'badge-gold',   dot: 'var(--gold)' },
  upcoming:    { badge: 'badge-slate',  dot: 'var(--border)' },
}

export default function Roadmap() {
  const { roadmap, toggleMilestone, targetCareer } = useApp()
  const [expanded, setExpanded] = useState({ p2: true })

  const totalDone = roadmap.reduce((s, p) => s + p.milestones.filter(m => m.done).length, 0)
  const totalAll  = roadmap.reduce((s, p) => s + p.milestones.length, 0)

  function toggle(id) { setExpanded(e => ({ ...e, [id]: !e[id] })) }

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
            const done = phase.milestones.filter(m => m.done).length
            const total = phase.milestones.length
            const pct = Math.round((done / total) * 100)
            const ss = STATUS_STYLE[phase.status] || STATUS_STYLE.upcoming
            const isOpen = !!expanded[phase.id]

            return (
              <div key={phase.id} className={styles.phaseRow}>
                {/* Timeline spine */}
                <div className={styles.spine}>
                  <div className={styles.spineDot} style={{ background: ss.dot, borderColor: ss.dot }} />
                  {idx < roadmap.length - 1 && <div className={styles.spineLine} />}
                </div>

                {/* Phase card */}
                <div className={`card ${styles.phaseCard} ${phase.status === 'upcoming' ? styles.upcoming : ''}`}>
                  <button className={styles.phaseHeader} onClick={() => toggle(phase.id)} aria-expanded={isOpen}>
                    <div className={styles.phaseLeft}>
                      <span className={`badge ${ss.badge}`}>Phase {phase.phase}</span>
                      <h3 className={styles.phaseTitle}>{phase.title}</h3>
                      <span className={styles.phaseDur}><Clock size={12} />{phase.duration}</span>
                    </div>
                    <div className={styles.phaseRight}>
                      <div className={styles.phasePct}>{pct}%</div>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  <div className={styles.phaseBarWrap}>
                    <ProgressBar
                      value={done} max={total} height={5}
                      color={phase.status === 'completed' ? 'var(--forest)' : phase.status === 'in-progress' ? 'var(--gold)' : 'var(--border)'}
                    />
                  </div>

                  {isOpen && (
                    <div className={styles.phaseBody}>
                      <p className={styles.phaseDesc}>{phase.description}</p>
                      <div className={styles.milestones}>
                        <h4 className={styles.milestonesTitle}>Milestones</h4>
                        {phase.milestones.map(m => (
                          <button
                            key={m.id}
                            className={`${styles.milestone} ${m.done ? styles.milestoneDone : ''}`}
                            onClick={() => toggleMilestone(phase.id, m.id)}
                            aria-pressed={m.done}
                          >
                            {m.done
                              ? <CheckCircle size={16} className={styles.milestoneCheck} />
                              : <Circle size={16} className={styles.milestoneCircle} />
                            }
                            <span className={styles.milestoneText}>{m.text}</span>
                            <span className={styles.milestoneHours}>{m.hours}h</span>
                          </button>
                        ))}
                      </div>
                      {phase.resources.length > 0 && (
                        <div className={styles.resources}>
                          <h4 className={styles.resourcesTitle}>Resources</h4>
                          <div className={styles.resourceLinks}>
                            {phase.resources.map(r => (
                              <a key={r.label} href={r.url} className={styles.resourceLink} target="_blank" rel="noreferrer">
                                <ExternalLink size={12} />{r.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
