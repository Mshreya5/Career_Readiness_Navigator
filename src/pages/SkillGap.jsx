import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { SKILL_CATEGORIES, computeSkillMatch, getProficiency } from '../data/mockData.js'
import styles from './SkillGap.module.css'

export default function SkillGap() {
  const { skills, targetCareer } = useApp()
  const match = computeSkillMatch(skills, targetCareer)

  // Domain breakdown
  const domains = SKILL_CATEGORIES.map(cat => {
    const catSkills = cat.skills
    const relevant = targetCareer ? catSkills.filter(s => targetCareer.skills.includes(s)) : catSkills
    if (!relevant.length) return null
    const scored = relevant.map(s => getProficiency(skills[s] || 'none').score)
    const avg = Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    return { label: cat.label, avg, count: relevant.length }
  }).filter(Boolean)

  const donutData = [
    { name: 'Matched',  value: match.matched.length || 0,  color: 'var(--forest)' },
    { name: 'Partial',  value: match.partial.length || 0,  color: 'var(--gold)' },
    { name: 'Missing',  value: match.missing.length || 0,  color: 'var(--terra)' },
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
          <Link to="/assessment" className="btn btn-secondary btn-sm">Update Skills <ArrowRight size={14} /></Link>
        </div>

        <div className={styles.top}>
          {/* Score */}
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
                <span className={styles.donutScore}>{match.score}%</span>
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

          {/* Domain bars */}
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

        {/* Skill breakdown */}
        <div className={styles.breakdown}>
          <SkillGroup
            icon={<CheckCircle size={16} />}
            title="Matched Skills"
            desc="You meet or exceed the required level."
            skills={match.matched}
            userSkills={skills}
            colorClass={styles.matched}
            accent="var(--forest)"
          />
          <SkillGroup
            icon={<AlertCircle size={16} />}
            title="Developing Skills"
            desc="You have some knowledge but need to grow."
            skills={match.partial}
            userSkills={skills}
            colorClass={styles.partial}
            accent="var(--gold)"
          />
          <SkillGroup
            icon={<XCircle size={16} />}
            title="Priority Gaps"
            desc="These skills are required but not yet started."
            skills={match.missing}
            userSkills={skills}
            colorClass={styles.missing}
            accent="var(--terra)"
          />
        </div>

        {/* Recommendations */}
        {match.missing.length > 0 && (
          <div className={`card ${styles.recs}`}>
            <h3 className={styles.cardTitle}>Recommended Actions</h3>
            <ul className={styles.recList}>
              {match.missing.slice(0, 3).map(s => (
                <li key={s} className={styles.recItem}>
                  <span className={styles.recDot} />
                  <span>Start learning <strong>{s}</strong> — it's a required skill for {targetCareer.title}.</span>
                </li>
              ))}
              {match.partial.slice(0, 2).map(s => (
                <li key={s} className={styles.recItem}>
                  <span className={styles.recDot} style={{ background: 'var(--gold)' }} />
                  <span>Deepen your <strong>{s}</strong> skills from Developing to Proficient.</span>
                </li>
              ))}
            </ul>
            <Link to="/roadmap" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              View your roadmap <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function SkillGroup({ icon, title, desc, skills, userSkills, colorClass, accent }) {
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
            {userSkills[s] && <span className={styles.pillLevel}>{getProficiency(userSkills[s]).label}</span>}
          </span>
        )) : <span className={styles.none}>None</span>}
      </div>
    </div>
  )
}
