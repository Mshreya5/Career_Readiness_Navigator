import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { MOCK_USER, ROADMAP_PHASES, CAREERS } from '../data/mockData.js'

const AppContext = createContext(null)
const SESSION_KEY = 'careernav_session'

function loadSession() {
  try { const r = sessionStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : null } catch { return null }
}
function saveSession(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)) } catch {}
}

export function AppProvider({ children }) {
  const session = loadSession()
  const [user, setUser]         = useState(session?.user || null)
  const [skills, setSkills]     = useState(session?.skills || {})
  const [roadmap, setRoadmap]   = useState(session?.roadmap || ROADMAP_PHASES)
  const [tutorProgress, setTutorProgress] = useState(session?.tutorProgress || {})
  const [settings, setSettings] = useState(session?.settings || {
    emailNotifications: true, weeklyReport: true,
    learningPace: 'moderate', targetCareerId: MOCK_USER.targetCareerId,
  })
  const [toasts, setToasts] = useState([])

  useEffect(() => { saveSession({ user, skills, roadmap, settings, tutorProgress }) }, [user, skills, roadmap, settings, tutorProgress])

  function login(email, _pw, remember) {
    const u = { ...MOCK_USER, email }
    setUser(u); setSkills(MOCK_USER.skills)
    if (remember) localStorage.setItem('cn_remember', email)
    return u
  }
  function signup(data) {
    const u = { ...MOCK_USER, ...data, id: 'u_new', joinedAt: new Date().toISOString() }
    setUser(u); setSkills({})
    return u
  }
  function logout() {
    setUser(null); setSkills({}); setRoadmap(ROADMAP_PHASES)
    sessionStorage.removeItem(SESSION_KEY)
  }

  function updateSkill(name, level) { setSkills(s => ({ ...s, [name]: level })) }
  function saveAssessment(s) { setSkills(s); toast('Assessment saved! Skill profile updated.', 'success') }

  function toggleMilestone(phaseId, milestoneId) {
    setRoadmap(r => r.map(phase => {
      if (phase.id !== phaseId) return phase
      const milestones = phase.milestones.map(m => m.id === milestoneId ? { ...m, done: !m.done } : m)
      const allDone = milestones.every(m => m.done)
      const anyDone = milestones.some(m => m.done)
      return { ...phase, milestones, status: allDone ? 'completed' : anyDone ? 'in-progress' : phase.status }
    }))
  }

  function toggleTutorTask(taskKey) {
    setTutorProgress(progress => ({ ...progress, [taskKey]: !progress[taskKey] }))
  }

  function updateProfile(data) { setUser(u => ({ ...u, ...data })); toast('Profile updated.', 'success') }
  function updateSettings(data) { setSettings(s => ({ ...s, ...data })); toast('Settings saved.', 'success') }
  function selectCareer(id) {
    setUser(u => ({ ...u, targetCareerId: id }))
    setSettings(s => ({ ...s, targetCareerId: id }))
    const c = CAREERS.find(x => x.id === id)
    toast(`Target career set to ${c?.title}.`, 'success')
  }

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  function dismissToast(id) { setToasts(t => t.filter(x => x.id !== id)) }

  const targetCareer = CAREERS.find(c => c.id === (user?.targetCareerId || settings.targetCareerId))

  return (
    <AppContext.Provider value={{
      user, skills, roadmap, settings, toasts, targetCareer,
      tutorProgress,
      login, signup, logout,
      updateSkill, saveAssessment,
      toggleMilestone, toggleTutorTask, updateProfile, updateSettings, selectCareer,
      toast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
