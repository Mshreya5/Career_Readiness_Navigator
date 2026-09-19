import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../data/mockData.js'
import styles from './Assessment.module.css'

export default function Assessment() {
  const { skills, updateSkill, saveAssessment } = useApp()
  const [localSkills, setLocalSkills] = useState({ ...skills })
  const [activeCategory, setActiveCategory] = useState('all')
  const [saved, setSaved] = useState(false)

  const allSkills = SKILL_CATEGORIES.flatMap(c => c.skills.map(s => ({ skill: s, category: c.id, categoryLabel: c.label })))
  const filtered = activeCategory === 'all' ? allSkills : allSkills.filter(s => s.category === activeCategory)

  const assessed = Object.keys(localSkills).filter(k => localSkills[k] && localSkills[k] !== 'none').length
  const total = allSkills.length
  const pct = Math.round((assessed / total) * 100)

  function setLevel(skill, level) {
    setLocalSkills(s => ({ ...s, [skill]: level }))
    setSaved(false)
  }

  function handleSave() {
    saveAssessment(localSkills)
    setSaved(true)
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Skill Assessment</h1>
            <p className={styles.sub}>Rate your proficiency honestly — this powers your skill gap analysis and roadmap.</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.progressInfo}>
              <span className={styles.progressPct}>{pct}%</span>
              <span className={styles.progressLabel}>{assessed}/{total} rated</span>
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? <><CheckCircle size={15} /> Saved</> : 'Save Assessment'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        {/* Category tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeCategory === 'all' ? styles.tabActive : ''}`} onClick={() => setActiveCategory('all')}>All Skills</button>
          {SKILL_CATEGORIES.map(c => (
            <button key={c.id} className={`${styles.tab} ${activeCategory === c.id ? styles.tabActive : ''}`} onClick={() => setActiveCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className={styles.grid}>
          {filtered.map(({ skill, categoryLabel }) => {
            const current = localSkills[skill] || 'none'
            return (
              <div key={skill} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill}</span>
                  <span className={styles.skillCategory}>{categoryLabel}</span>
                </div>
                <div className={styles.levels}>
                  {PROFICIENCY_LEVELS.filter(p => p.value !== 'none').map(p => (
                    <button
                      key={p.value}
                      className={`${styles.levelBtn} ${current === p.value ? styles.levelActive : ''}`}
                      style={current === p.value ? { '--lc': p.color } : {}}
                      onClick={() => setLevel(skill, p.value)}
                      aria-pressed={current === p.value}
                      aria-label={`${skill}: ${p.label}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.saveRow}>
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            {saved ? <><CheckCircle size={16} /> Assessment Saved!</> : 'Save Assessment'}
          </button>
          <p className={styles.saveHint}>Your skill profile will be updated and your skill gap analysis will refresh.</p>
        </div>
      </div>
    </AppLayout>
  )
}
