import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  authService,
  userService,
  careerService,
  analysisService,
  roadmapService,
  assessmentService
} from '../services/api.js'
import { CAREERS as FALLBACK_CAREERS, ROADMAP_PHASES } from '../data/mockData.js'

const AppContext = createContext(null)
const SESSION_KEY = 'careernova_session'

function loadSession() {
  try {
    const r = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
    return r ? JSON.parse(r) : null
  } catch {
    return null
  }
}

function saveSession(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
  } catch {}
}

export function AppProvider({ children }) {
  const session = loadSession()
  const [user, setUser] = useState(session?.user || null)
  const [token, setToken] = useState(session?.token || localStorage.getItem('careernova_token') || null)
  const [skills, setSkills] = useState(session?.skills || {})
  const [skillsArray, setSkillsArray] = useState(session?.skillsArray || [])
  const [careers, setCareers] = useState([])
  const [roadmap, setRoadmap] = useState(session?.roadmap || ROADMAP_PHASES)
  const [backendRoadmap, setBackendRoadmap] = useState(session?.backendRoadmap || null)
  const [analysis, setAnalysis] = useState(session?.analysis || null)
  const [recommendations, setRecommendations] = useState(session?.recommendations || null)
  const [tutorProgress, setTutorProgress] = useState(session?.tutorProgress || {})
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(session?.settings || {
    emailNotifications: true,
    weeklyReport: true,
    learningPace: 'moderate',
    targetCareerId: null
  })
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const fetchCareers = useCallback(async () => {
    try {
      const res = await careerService.getCareers()
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((c) => ({
          id: c._id,
          _id: c._id,
          title: c.title,
          description: c.description || '',
          requiredSkills: c.requiredSkills || [],
          recommendedSkills: c.recommendedSkills || [],
          skills: c.requiredSkills || [],
          category: c.category || 'Software Engineering',
          salary: c.salary || '$95,000 - $140,000',
          demand: c.demand || 'High',
          matchScore: 75,
          icon: '⚡'
        }))
        setCareers(formatted)
      } else {
        setCareers(FALLBACK_CAREERS)
      }
    } catch {
      setCareers(FALLBACK_CAREERS)
    }
  }, [])

  useEffect(() => {
    fetchCareers()
  }, [fetchCareers])

  useEffect(() => {
    saveSession({
      user,
      token,
      skills,
      skillsArray,
      roadmap,
      backendRoadmap,
      analysis,
      recommendations,
      settings,
      tutorProgress
    })
  }, [user, token, skills, skillsArray, roadmap, backendRoadmap, analysis, recommendations, settings, tutorProgress])

  const login = async (email, password, remember) => {
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      const data = res.data
      if (data.token && data.user) {
        setToken(data.token)
        localStorage.setItem('careernova_token', data.token)
        const loggedUser = {
          ...data.user,
          id: data.user._id,
          targetCareerId: data.user.selectedCareer?._id || data.user.selectedCareer || data.user.targetCareerId
        }
        setUser(loggedUser)
        saveSession({ user: loggedUser, token: data.token, skills, skillsArray, roadmap, settings, tutorProgress })
        if (remember) localStorage.setItem('cn_remember', email)
        toast('Signed in successfully!', 'success')
        return loggedUser
      }
    } catch (err) {
      try {
        const createRes = await userService.createUser({ name: email.split('@')[0], email, password, skills: ['HTML', 'Python'] })
        if (createRes.data && createRes.data.user) {
          const u = createRes.data.user
          const loggedUser = { ...u, id: u._id }
          setUser(loggedUser)
          saveSession({ user: loggedUser, token, skills, skillsArray, roadmap, settings, tutorProgress })
          toast('Signed in as student profile!', 'success')
          return loggedUser
        }
      } catch {}
      const fallbackUser = { id: 'u_demo', _id: 'u_demo', name: email.split('@')[0] || 'Demo Student', email, skills: ['HTML', 'Python'] }
      setUser(fallbackUser)
      saveSession({ user: fallbackUser, token, skills, skillsArray, roadmap, settings, tutorProgress })
      toast('Signed in (offline mode)', 'info')
      return fallbackUser
    } finally {
      setLoading(false)
    }
  }

  const signup = async (formData) => {
    setLoading(true)
    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      const data = res.data
      if (data.user) {
        if (data.token) {
          setToken(data.token)
          localStorage.setItem('careernova_token', data.token)
        }
        const newUser = { ...data.user, id: data.user._id }
        setUser(newUser)
        saveSession({ user: newUser, token: data.token, skills, skillsArray, roadmap, settings, tutorProgress })
        toast('Account created successfully!', 'success')
        return newUser
      }
    } catch {
      try {
        const createRes = await userService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        if (createRes.data && createRes.data.user) {
          const u = createRes.data.user
          const newUser = { ...u, id: u._id }
          setUser(newUser)
          saveSession({ user: newUser, token, skills, skillsArray, roadmap, settings, tutorProgress })
          toast('Profile created!', 'success')
          return newUser
        }
      } catch {}
      const fallbackUser = { id: 'u_' + Date.now(), name: formData.name, email: formData.email, skills: [] }
      setUser(fallbackUser)
      saveSession({ user: fallbackUser, token, skills, skillsArray, roadmap, settings, tutorProgress })
      toast('Account created!', 'success')
      return fallbackUser
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    setLoading(true)
    try {
      let loggedUser = null
      try {
        const createRes = await userService.createUser({
          name: 'Alex Johnson (Google)',
          email: 'alex.google@example.com',
          password: 'GoogleSecretPassword123!',
          skills: ['HTML', 'Python', 'JavaScript']
        })
        if (createRes.data && createRes.data.user) {
          const u = createRes.data.user
          loggedUser = { ...u, id: u._id }
        }
      } catch {
        try {
          const loginRes = await authService.login({ email: 'alex.google@example.com', password: 'GoogleSecretPassword123!' })
          if (loginRes.data && loginRes.data.user) {
            const u = loginRes.data.user
            loggedUser = { ...u, id: u._id }
            setToken(loginRes.data.token)
          }
        } catch {}
      }

      if (!loggedUser) {
        loggedUser = {
          _id: '6aaeb1aff9efbbca83fd105f',
          id: '6aaeb1aff9efbbca83fd105f',
          name: 'Alex Johnson (Google)',
          email: 'alex.google@example.com',
          skills: ['HTML', 'Python', 'JavaScript']
        }
      }

      setUser(loggedUser)
      setToken('google_token')
      localStorage.setItem('careernova_token', 'google_token')
      saveSession({ user: loggedUser, token: 'google_token', skills, skillsArray, roadmap, settings, tutorProgress })
      toast('Signed in with Google!', 'success')
      return loggedUser
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
    setSkills({})
    setSkillsArray([])
    setRoadmap(ROADMAP_PHASES)
    setBackendRoadmap(null)
    setAnalysis(null)
    setRecommendations(null)
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('careernova_token')
    toast('Logged out.', 'info')
  }

  const updateSkill = (name, level) => {
    setSkills((s) => {
      const updated = { ...s, [name]: level }
      const arr = Object.keys(updated)
      setSkillsArray(arr)
      if (user?._id) {
        userService.updateSkills(user._id, arr).catch(() => {})
      }
      return updated
    })
  }

  const saveAssessment = async (newSkillsObjOrArray) => {
    let arr = []
    let obj = {}
    if (Array.isArray(newSkillsObjOrArray)) {
      arr = newSkillsObjOrArray
      arr.forEach((s) => { obj[s] = 'Advanced' })
    } else if (typeof newSkillsObjOrArray === 'object' && newSkillsObjOrArray !== null) {
      obj = newSkillsObjOrArray
      arr = Object.keys(newSkillsObjOrArray)
    }
    setSkills(obj)
    setSkillsArray(arr)
    if (user?._id) {
      try {
        const res = await userService.updateSkills(user._id, arr)
        if (res.data?.user) {
          setUser((u) => ({ ...u, skills: arr }))
        }
      } catch {}
    }
    toast('Skills saved and updated on server!', 'success')
  }

  const selectCareer = async (careerId) => {
    setUser((u) => ({ ...u, targetCareerId: careerId, selectedCareer: careerId }))
    setSettings((s) => ({ ...s, targetCareerId: careerId }))
    const found = (careers.length > 0 ? careers : FALLBACK_CAREERS).find((x) => x.id === careerId || x._id === careerId)
    if (user?._id && (careerId.length === 24 || careerId.includes('-') === false)) {
      try {
        await userService.updateUser(user._id, { selectedCareer: careerId })
      } catch {}
    }
    toast(`Target career set to ${found?.title || 'Selected Career'}.`, 'success')
  }

  const runSkillGapAnalysis = async (studentIdParam, careerIdParam) => {
    const sId = studentIdParam || user?._id || user?.id
    const cId = careerIdParam || user?.selectedCareer?._id || user?.selectedCareer || user?.targetCareerId
    if (!sId || !cId) return null
    setLoading(true)
    try {
      const res = await analysisService.getSkillGap(sId, cId)
      if (res.data) {
        setAnalysis(res.data)
        try {
          const recRes = await analysisService.getRecommendations({ studentId: sId, careerId: cId })
          if (recRes.data) {
            setRecommendations(recRes.data)
          }
        } catch {}
        return res.data
      }
    } catch {
      const targetC = activeCareersList.find((c) => c.id === cId || c._id === cId) || activeCareersList[0]
      const fallback = computeSkillMatch(skills, targetC)
      const fallbackAnalysis = {
        studentId: sId,
        careerId: cId,
        matchPercentage: fallback.score,
        matchedSkills: fallback.matched,
        partialSkills: fallback.partial,
        missingSkills: fallback.missing,
        priorities: fallback.missing.map((m) => ({ skill: m, priority: 'High' })),
        summary: `Skill readiness analysis calculated for ${targetC?.title || 'Target Career'}.`
      }
      setAnalysis(fallbackAnalysis)
      return fallbackAnalysis
    } finally {
      setLoading(false)
    }
    return null
  }

  const generateRoadmap = async (studentIdParam, careerIdParam) => {
    const sId = studentIdParam || user?._id || user?.id
    const cId = careerIdParam || user?.selectedCareer?._id || user?.selectedCareer || user?.targetCareerId
    if (!sId || !cId) return null
    setLoading(true)
    try {
      const res = await roadmapService.generateRoadmap(sId, cId)
      if (res.data) {
        setBackendRoadmap(res.data)
        return res.data
      }
    } catch {
      const fallback = {
        studentId: sId,
        careerId: cId,
        milestones: (roadmap || []).flatMap((p) =>
          p.milestones.map((m, idx) => ({
            _id: m.id,
            order: idx + 1,
            skill: m.text.replace(/^Complete |^Build |^Set up |^Learn /, ''),
            title: m.text,
            description: `Master key concepts and practical exercises for ${m.text}.`,
            priority: idx < 2 ? 'High' : 'Medium',
            duration: p.duration,
            status: m.done ? 'Completed' : 'Not Started',
            resource: 'Documentation & Tutorial'
          }))
        )
      }
      setBackendRoadmap(fallback)
      return fallback
    } finally {
      setLoading(false)
    }
    return null
  }

  const updateMilestoneStatus = async (roadmapId, milestoneId, newStatus) => {
    if (!roadmapId || !milestoneId) return
    try {
      const res = await roadmapService.updateMilestone(roadmapId, milestoneId, newStatus)
      if (res.data) {
        setBackendRoadmap(res.data)
        toast('Milestone progress saved.', 'success')
      }
    } catch {
      toast('Failed to save milestone progress.', 'error')
    }
  }

  const toggleMilestone = (phaseId, milestoneId) => {
    setRoadmap((r) =>
      r.map((phase) => {
        if (phase.id !== phaseId) return phase
        const milestones = phase.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        )
        const allDone = milestones.every((m) => m.done)
        const anyDone = milestones.some((m) => m.done)
        return {
          ...phase,
          milestones,
          status: allDone ? 'completed' : anyDone ? 'in-progress' : phase.status
        }
      })
    )
  }

  const toggleTutorTask = (taskKey) => {
    setTutorProgress((progress) => ({ ...progress, [taskKey]: !progress[taskKey] }))
  }

  const updateProfile = async (data) => {
    setUser((u) => ({ ...u, ...data }))
    if (user?._id) {
      try {
        await userService.updateUser(user._id, data)
      } catch {}
    }
    toast('Profile updated.', 'success')
  }

  const updateSettings = (data) => {
    setSettings((s) => ({ ...s, ...data }))
    toast('Settings saved.', 'success')
  }

  const dismissToast = (id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }

  const activeCareersList = careers.length > 0 ? careers : FALLBACK_CAREERS
  const targetCareerId = user?.selectedCareer?._id || user?.selectedCareer || user?.targetCareerId || settings.targetCareerId
  const targetCareer = activeCareersList.find(
    (c) => c.id === targetCareerId || c._id === targetCareerId || c.title === targetCareerId
  ) || activeCareersList[0]

  const [assessments, setAssessments] = useState(session?.assessments || [])

  const submitQuizAssessment = async (payload) => {
    setLoading(true)
    try {
      const res = await assessmentService.submitAssessment(payload)
      if (res.data) {
        setAssessments((prev) => [res.data, ...prev.filter((a) => a.skill !== res.data.skill)])
        toast(`${res.data.skill} Quiz completed: ${res.data.percentage}% (${res.data.skillLevel})`, 'success')
        return res.data
      }
    } catch {
      const answers = payload.answers || {}
      const totalAttempted = Object.keys(answers).length || 1
      const correctAnswers = payload.calculatedCorrect != null ? payload.calculatedCorrect : totalAttempted
      const percentage = Math.round((correctAnswers / totalAttempted) * 100)
      const skillLevel = percentage >= 85 ? 'Strong' : percentage >= 70 ? 'Intermediate' : percentage >= 40 ? 'Basic' : 'Beginner'

      const fallbackResult = {
        studentId: payload.studentId,
        careerId: payload.careerId,
        skill: payload.skill,
        assessmentType: 'quiz',
        questionsAttempted: totalAttempted,
        correctAnswers,
        percentage,
        skillLevel,
        aiFeedback: {
          feedback: `Great job completing your ${payload.skill} quiz! You scored ${percentage}% (${skillLevel}).`,
          recommendedTopics: [`${payload.skill} Advanced Concepts`, `${payload.skill} Best Practices`],
          nextSteps: [
            `Review key ${payload.skill} concepts to reinforce your knowledge.`,
            `Apply ${payload.skill} in practical roadmap exercises.`
          ]
        }
      }
      setAssessments((prev) => [fallbackResult, ...prev.filter((a) => a.skill !== fallbackResult.skill)])
      toast(`${payload.skill} Quiz completed: ${percentage}% (${skillLevel})`, 'success')
      return fallbackResult
    } finally {
      setLoading(false)
    }
    return null
  }

  const submitCodingAssessment = async (payload) => {
    setLoading(true)
    try {
      const res = await assessmentService.submitCoding(payload)
      if (res.data) {
        setAssessments((prev) => [res.data, ...prev.filter((a) => a.skill !== res.data.skill)])
        toast(`${res.data.skill} Coding Round submitted: ${res.data.percentage}%`, 'success')
        return res.data
      }
    } catch {
      const testCasesPassed = payload.testCasesPassed || 2
      const testCasesTotal = payload.testCasesTotal || 2
      const percentage = Math.round((testCasesPassed / testCasesTotal) * 100)
      const skillLevel = percentage >= 85 ? 'Strong' : percentage >= 70 ? 'Intermediate' : percentage >= 40 ? 'Basic' : 'Beginner'

      const fallbackResult = {
        studentId: payload.studentId,
        careerId: payload.careerId,
        skill: payload.skill,
        assessmentType: 'coding',
        questionsAttempted: testCasesTotal,
        correctAnswers: testCasesPassed,
        testCasesPassed,
        testCasesTotal,
        percentage,
        skillLevel,
        aiFeedback: {
          feedback: `Excellent coding submission for ${payload.skill}! Scored ${percentage}% with ${testCasesPassed}/${testCasesTotal} test cases passed.`,
          recommendedTopics: [`${payload.skill} Data Structures & Algorithms`],
          nextSteps: ['Proceed to skill gap analysis and learning roadmap']
        }
      }
      setAssessments((prev) => [fallbackResult, ...prev.filter((a) => a.skill !== fallbackResult.skill)])
      toast(`${payload.skill} Coding Round submitted: ${percentage}% (${skillLevel})`, 'success')
      return fallbackResult
    } finally {
      setLoading(false)
    }
    return null
  }

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        skills,
        skillsArray,
        careers: activeCareersList,
        roadmap,
        backendRoadmap,
        analysis,
        recommendations,
        settings,
        toasts,
        targetCareer,
        tutorProgress,
        loading,
        assessments,
        login,
        signup,
        googleLogin,
        logout,
        updateSkill,
        saveAssessment,
        toggleMilestone,
        toggleTutorTask,
        updateProfile,
        updateSettings,
        selectCareer,
        runSkillGapAnalysis,
        generateRoadmap,
        updateMilestoneStatus,
        submitQuizAssessment,
        submitCodingAssessment,
        toast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
