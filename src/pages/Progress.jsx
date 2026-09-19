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
  const { roadmap, skills, targetCareer } = useApp()
  const skillBarData = useMemo(() => (targetCareer?.skills || []).map(name => ({
    name,
    Current: getProficiency(skills[name]).score,
    Required: 80,
  })), [skills, targetCareer])
  const progressData = WEEKLY_ACTIVITY.map(day => ({
    week: day.day,
    progress: Math.round(day.hours * 20),
  }))
  const completed = roadmap.filter(phase => phase.status === 'completed').length
  const inProgress = roadmap.filter(phase => phase.status === 'in-progress').length
  const match = computeSkillMatch(skills, targetCareer)

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Progress Tracker</h1>
        <p>Visualize your learning journey toward {targetCareer?.title || 'your target career'}.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--forest)' }}>{match.score}%</div>
          <div className="progress-stat-label">Skill Match</div>
        </div>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--success)' }}>{completed}</div>
          <div className="progress-stat-label">Phases Completed</div>
        </div>
        <div className="card progress-stat">
          <div className="progress-stat-value" style={{ color: 'var(--warning)' }}>{inProgress}</div>
          <div className="progress-stat-label">In Progress</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Weekly Progress</h3>
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
    </AppLayout>
  )
}
