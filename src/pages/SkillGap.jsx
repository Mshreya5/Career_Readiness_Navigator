import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CheckCircle, AlertCircle, XCircle, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { SKILL_CATEGORIES, computeSkillMatch, getProficiency } from '../data/mockData.js'
import styles from './SkillGap.module.css'

export default function SkillGap() {
  const { user, skills, targetCareer, analysis, recommendations, runSkillGapAnalysis, loading } = useApp()
  const [analyzing, setAnalyzing] = useState(false)
  const ranRef = useRef(null)

  const matchFallback = computeSkillMatch(skills, targetCareer)

  const activeScore = analysis?.matchPercentage ?? matchFallback.score
  const activeMatched = analysis?.matchedSkills ?? matchFallback.matched
  const activePartial = analysis?.partialSkills ?? matchFallback.partial
  const activeMissing = analysis?.missingSkills ?? matchFallback.missing
  const activePriorities = analysis?.priorities ?? []

  useEffect(() => {
    const sId = user?._id || user?.id
    const cId = user?.selectedCareer?._id || user?.selectedCareer || user?.targetCareerId || targetCareer?.id || targetCareer?._id
    const key = `${sId}_${cId}`
    if (sId && cId && ranRef.current !== key) {
      ranRef.current = key
      setAnalyzing(true)
      runSkillGapAnalysis(sId, cId).finally(() => setAnalyzing(false))
    }
  }, [user, targetCareer, runSkillGapAnalysis])

  const domains = SKILL_CATEGORIES.map(cat => {
    const catSkills = cat.skills
    const relevant = targetCareer ? (targetCareer.skills || targetCareer.requiredSkills || []).filter(s => catSkills.includes(s)) : catSkills
    if (!relevant.length) return null
    const scored = relevant.map(s => getProficiency(skills[s] || 'none').score)
    const avg = Math.round(scored.reduce((a, b) => a + b, 0) / Math.max(scored.length, 1))
    return { label: cat.label, avg, count: relevant.length }
  }).filter(Boolean)

  const donutData = [
    { name: 'Matched', value: activeMatched.length || 0, color: 'var(--forest)' },
    { name: 'Partial', value: activePartial.length || 0, color: 'var(--gold)' },
    { name: 'Missing', value: activeMissing.length || 0, color: 'var(--terra)' },
  ]

  if (!targetCareer) return (
    <AppLayout>
      <div className={styles.page}>
        <h1 className={styles.title}>Skill Gap Analysis</h1>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem' }}>Select a target career first to see your skill gap analysis.</p>
          <Link to="/careers" className="btn btn-primary">Browse Careers <ArrowRight size={15} /></Link>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Skill Gap Analysis</h1>
            <p className={styles.sub}>Your readiness for <strong>{targetCareer.title}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {(analyzing || loading) && (
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Loader2 size={14} className="spin" /> Analyzing your skills…
              </span>
            )}
            <Link to="/assessment" className="btn btn-secondary btn-sm">Update Skills <ArrowRight size={14} /></Link>
          </div>
        </div>

        <div className={styles.top}>
          <div className={`card ${styles.scoreCard}`}>
            <h3 className={styles.cardTitle}>Readiness Score</h3>
            <div className={styles.donutWrap}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={62} outerRadius={88} dataKey="value" strokeWidth={0}>
                    {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
                <span className={styles.donutScore}>{activeScore}%</span>
                <span className={styles.donutLabel}>ready</span>
              </div>
            </div>
            <div className={styles.legend}>
              {donutData.map(d => (
                <div key={d.name} className={styles.legendRow}>
                  <span className={styles.legendDot} style={{ background: d.color }} />
                  <span>{d.name}</span>
                  <span className={styles.legendCount}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`card ${styles.domainsCard}`}>
            <h3 className={styles.cardTitle}>Domain Proficiency</h3>
            <div className={styles.domainList}>
              {domains.map(d => (
                <div key={d.label} className={styles.domainRow}>
                  <div className={styles.domainMeta}>
                    <span className={styles.domainLabel}>{d.label}</span>
                    <span className={styles.domainPct}>{d.avg}%</span>
                  </div>
                  <ProgressBar
                    value={d.avg}
                    height={8}
                    color={d.avg >= 70 ? 'var(--forest)' : d.avg >= 40 ? 'var(--gold)' : 'var(--terra)'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.breakdown}>
          <SkillGroup
            icon={<CheckCircle size={16} />}
            title="Matched Skills"
            desc="You meet or exceed the required level."
            skills={activeMatched}
            userSkills={skills}
            colorClass={styles.matched}
            accent="var(--forest)"
          />
          <SkillGroup
            icon={<AlertCircle size={16} />}
            title="Developing Skills"
            desc="You have partial knowledge."
            skills={activePartial}
            userSkills={skills}
            colorClass={styles.partial}
            accent="var(--gold)"
          />
          <SkillGroup
            icon={<XCircle size={16} />}
            title="Priority Gaps"
            desc="Required skills prioritized by prerequisites."
            skills={activeMissing}
            userSkills={skills}
            priorities={activePriorities}
            colorClass={styles.missing}
            accent="var(--terra)"
          />
        </div>

        {recommendations && (
          <div className={`card ${styles.recs}`} style={{ marginTop: '1.5rem', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sparkles size={18} style={{ color: '#6366f1' }} />
              <h3 className={styles.cardTitle} style={{ margin: 0 }}>Gemini AI Recommendations</h3>
            </div>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {recommendations.summary}
            </p>

            {recommendations.learningOrder && recommendations.learningOrder.length > 0 && (
              <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--ink)' }}>Recommended Learning Order:</strong>
                <ol style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, fontSize: '0.9rem' }}>
                  {recommendations.learningOrder.map((s, idx) => (
                    <li key={idx} style={{ margin: '0.25rem 0' }}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {recommendations.recommendations && (
              <ul className={styles.recList}>
                {recommendations.recommendations.map((r, i) => (
                  <li key={i} className={styles.recItem}>
                    <span className={styles.recDot} style={{ background: r.priority === 'High' ? 'var(--terra)' : 'var(--gold)' }} />
                    <div>
                      <strong>{r.skill}</strong> ({r.priority} Priority): {r.reason}
                      {r.nextStep && <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: '0.2rem' }}>💡 Next step: {r.nextStep}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link to="/roadmap" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              View your personalized roadmap <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function SkillGroup({ icon, title, desc, skills, userSkills, priorities = [], colorClass, accent }) {
  const prioMap = {}
  priorities.forEach(p => { prioMap[p.skill] = p.priority })

  return (
    <div className={`card ${styles.skillGroup}`}>
      <div className={styles.groupHeader} style={{ '--accent': accent }}>
        <span className={styles.groupIcon}>{icon}</span>
        <div>
          <h4 className={styles.groupTitle}>{title} <span className={styles.groupCount}>({skills.length})</span></h4>
          <p className={styles.groupDesc}>{desc}</p>
        </div>
      </div>
      <div className={styles.skillPills}>
        {skills.length ? skills.map(s => (
          <span key={s} className={`${styles.pill} ${colorClass}`}>
            {s}
            {prioMap[s] && <span className={styles.pillLevel} style={{ fontWeight: 600 }}>{prioMap[s]}</span>}
            {!prioMap[s] && userSkills[s] && <span className={styles.pillLevel}>{getProficiency(userSkills[s]).label}</span>}
          </span>
        )) : <span className={styles.none}>None</span>}
      </div>
    </div>
  )
}
