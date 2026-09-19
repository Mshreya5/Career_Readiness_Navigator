import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ArrowRight, CheckCircle, Clock, Zap, Briefcase, ClipboardList } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import MetricCard from '../components/ui/MetricCard.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import SkillBadge from '../components/ui/SkillBadge.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CAREERS, RECENT_ACTIVITY, computeSkillMatch } from '../data/mockData.js'
import styles from './Dashboard.module.css'

const activityIcons = { check: CheckCircle, zap: Zap, briefcase: Briefcase, clipboard: ClipboardList, clock: Clock }

export default function Dashboard() {
  const { user, skills, roadmap, targetCareer } = useApp()
  const match = computeSkillMatch(skills, targetCareer)

  const completedPhases = roadmap.filter(p => p.status === 'completed').length
  const totalMilestones = roadmap.reduce((s, p) => s + p.milestones.length, 0)
  const doneMilestones  = roadmap.reduce((s, p) => s + p.milestones.filter(m => m.done).length, 0)
  const currentPhase    = roadmap.find(p => p.status === 'in-progress') || roadmap[0]

  const donutData = [
    { name: 'Matched',  value: match.matched.length,  color: 'var(--forest)' },
    { name: 'Partial',  value: match.partial.length,  color: 'var(--gold)' },
    { name: 'Missing',  value: match.missing.length,  color: 'var(--paper-dark)' },
  ]

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
            <p className={styles.greetingSub}>Here's where you stand on your path to <strong>{targetCareer?.title || 'your goal'}</strong>.</p>
          </div>
          <Link to="/assessment" className="btn btn-primary btn-sm">
            Update Skills <ArrowRight size={15} />
          </Link>
        </div>

        {/* Metrics */}
        <div className={`grid-4 ${styles.metrics}`}>
          <MetricCard icon={<Zap size={18} />} label="Skill Match" value={`${match.score}%`} sub={`for ${targetCareer?.title || '—'}`} accent="forest" />
          <MetricCard icon={<CheckCircle size={18} />} label="Skills Matched" value={match.matched.length} sub={`of ${targetCareer?.skills.length || 0} required`} accent="sage" />
          <MetricCard icon={<Clock size={18} />} label="Milestones Done" value={`${doneMilestones}/${totalMilestones}`} sub="roadmap progress" accent="gold" />
          <MetricCard icon={<Briefcase size={18} />} label="Phases Complete" value={`${completedPhases}/${roadmap.length}`} sub="learning phases" accent="terra" />
        </div>

        <div className={styles.body}>
          {/* Left column */}
          <div className={styles.left}>
            {/* Readiness donut */}
            <div className={`card ${styles.donutCard}`}>
              <h3 className={styles.cardTitle}>Career Readiness</h3>
              <div className={styles.donutWrap}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenter}>
                  <span className={styles.donutScore}>{match.score}%</span>
                  <span className={styles.donutLabel}>ready</span>
                </div>
              </div>
              <div className={styles.donutLegend}>
                {donutData.map(d => (
                  <div key={d.name} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: d.color }} />
                    <span>{d.name}</span>
                    <span className={styles.legendVal}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current phase */}
            <div className="card">
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>Current Phase</h3>
                <Link to="/roadmap" className={styles.seeAll}>View roadmap <ArrowRight size={13} /></Link>
              </div>
              {currentPhase && (
                <div className={styles.phaseBlock}>
                  <div className={styles.phaseMeta}>
                    <span className="badge badge-gold">Phase {currentPhase.phase}</span>
                    <span className={styles.phaseDur}>{currentPhase.duration}</span>
                  </div>
                  <h4 className={styles.phaseTitle}>{currentPhase.title}</h4>
                  <ProgressBar
                    value={currentPhase.milestones.filter(m => m.done).length}
                    max={currentPhase.milestones.length}
                    showPct
                    height={6}
                  />
                  <ul className={styles.milestoneList}>
                    {currentPhase.milestones.slice(0, 4).map(m => (
                      <li key={m.id} className={m.done ? styles.milestoneDone : ''}>
                        <CheckCircle size={13} />
                        <span>{m.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className={styles.right}>
            {/* Skill overview */}
            <div className="card">
              <div className={styles.cardTitleRow}>
                <h3 className={styles.cardTitle}>Skill Overview</h3>
                <Link to="/skill-gap" className={styles.seeAll}>Full analysis <ArrowRight size={13} /></Link>
              </div>
              <div className={styles.skillSection}>
                <p className={styles.skillSectionLabel}>Matched skills</p>
                <div className={styles.skillBadges}>
                  {match.matched.length ? match.matched.map(s => <SkillBadge key={s} skill={s} level={skills[s]} />) : <span className={styles.none}>None yet</span>}
                </div>
              </div>
              <div className={styles.skillSection}>
                <p className={styles.skillSectionLabel}>Developing</p>
                <div className={styles.skillBadges}>
                  {match.partial.length ? match.partial.map(s => <SkillBadge key={s} skill={s} level={skills[s]} />) : <span className={styles.none}>None</span>}
                </div>
              </div>
              <div className={styles.skillSection}>
                <p className={styles.skillSectionLabel}>Priority gaps</p>
                <div className={styles.skillBadges}>
                  {match.missing.slice(0, 5).map(s => <SkillBadge key={s} skill={s} level="none" />)}
                  {match.missing.length > 5 && <span className={styles.more}>+{match.missing.length - 5} more</span>}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="card">
              <h3 className={styles.cardTitle}>Recent Activity</h3>
              <ul className={styles.activityList}>
                {RECENT_ACTIVITY.map(a => {
                  const Icon = activityIcons[a.icon] || Clock
                  return (
                    <li key={a.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}><Icon size={14} /></div>
                      <div className={styles.activityText}>
                        <span>{a.text}</span>
                        <span className={styles.activityTime}>{a.time}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Quick actions */}
            <div className="card">
              <h3 className={styles.cardTitle}>Recommended Actions</h3>
              <div className={styles.actions}>
                <Link to="/assessment" className={`btn btn-secondary btn-sm ${styles.actionBtn}`}>
                  <ClipboardList size={15} /> Take skill assessment
                </Link>
                <Link to="/skill-gap" className={`btn btn-ghost btn-sm ${styles.actionBtn}`}>
                  <Zap size={15} /> View skill gaps
                </Link>
                <Link to="/roadmap" className={`btn btn-ghost btn-sm ${styles.actionBtn}`}>
                  <CheckCircle size={15} /> Continue roadmap
                </Link>
                <Link to="/careers" className={`btn btn-ghost btn-sm ${styles.actionBtn}`}>
                  <Briefcase size={15} /> Explore careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
