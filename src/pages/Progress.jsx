import { useMemo } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import { getProficiency, WEEKLY_ACTIVITY, computeSkillMatch } from '../data/mockData.js'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import './Progress.css'

export default function Progress() {
  const { roadmap, backendRoadmap, skills, targetCareer, analysis, assessments } = useApp()

  const careerSkills = targetCareer?.requiredSkills || targetCareer?.skills || ['JavaScript', 'Python', 'React', 'Node.js', 'SQL']

  const skillBarData = useMemo(() => {
    const requiredList = targetCareer?.requiredSkills || targetCareer?.skills || []
    return requiredList.map(name => ({
      name,
      Current: getProficiency(skills[name]).score,
      Required: 80,
    }))
  }, [skills, targetCareer])

  const progressData = WEEKLY_ACTIVITY.map(day => ({
    week: day.day,
    progress: Math.round(day.hours * 20),
  }))

  const matchFallback = computeSkillMatch(skills, targetCareer)
  const activeScore = analysis?.matchPercentage ?? matchFallback.score

  const backendMilestones = backendRoadmap?.milestones || []
  const completed = backendMilestones.length > 0
    ? backendMilestones.filter(m => m.status === 'Completed').length
    : roadmap.filter(phase => phase.status === 'completed').length

  const inProgress = backendMilestones.length > 0
    ? backendMilestones.filter(m => m.status === 'In Progress').length
    : roadmap.filter(phase => phase.status === 'in-progress').length

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Progress Tracker</h1>
        <p>Visualize your learning journey toward {targetCareer?.title || 'your target career'}.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--forest)' }}>{activeScore}%</div>
          <div className="progress-stat-label">Skill Match</div>
        </div>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--success)' }}>{completed}</div>
          <div className="progress-stat-label">Milestones Completed</div>
        </div>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--warning)' }}>{inProgress}</div>
          <div className="progress-stat-label">In Progress</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="var(--forest)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Skill Levels vs Required</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={skillBarData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Current" fill="var(--forest)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Required" fill="var(--sand)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>SKILL CONFIDENCE &amp; ASSESSMENT EVIDENCE</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {careerSkills.map(sk => {
            const rec = (assessments || []).find(a => a.skill?.toLowerCase() === sk.toLowerCase())
            const score = rec ? rec.percentage : null
            return (
              <div key={sk} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FAF8F5', border: '1px solid #EAE5DC', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{sk}</div>
                <div>
                  {rec ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)' }}>
                      ✓ Assessment completed · {score}% ({rec.skillLevel})
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                      Not assessed — skill match based on profile information
                    </span>
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
