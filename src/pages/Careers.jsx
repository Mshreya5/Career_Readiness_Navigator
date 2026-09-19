import { useState, useMemo } from 'react'
import { Search, X, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import CareerCard from '../components/CareerCard.jsx'
import Modal from '../components/ui/Modal.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CAREERS, computeSkillMatch } from '../data/mockData.js'
import styles from './Careers.module.css'

const CATEGORIES = ['All', ...Array.from(new Set(CAREERS.map(c => c.category)))]
const DEMANDS = ['All', 'Very High', 'High', 'Medium', 'Low']

export default function Careers() {
  const { user, skills, selectCareer } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [demand, setDemand] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => CAREERS.filter(c => {
    const q = query.toLowerCase()
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q))
    const matchC = category === 'All' || c.category === category
    const matchD = demand === 'All' || c.demand === demand
    return matchQ && matchC && matchD
  }), [query, category, demand])

  function handleSelect(careerId) {
    selectCareer(careerId)
    setSelected(null)
  }

  const detailMatch = selected ? computeSkillMatch(skills, selected) : null

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Career Catalog</h1>
            <p className={styles.sub}>Explore in-demand careers and find your path.</p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search careers, skills…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search careers"
            />
            {query && <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <div className={styles.filterGroup}>
            {CATEGORIES.map(c => (
              <button key={c} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className={styles.filterGroup}>
            {DEMANDS.map(d => (
              <button key={d} className={`${styles.filterBtn} ${demand === d ? styles.filterActive : ''}`} onClick={() => setDemand(d)}>{d}</button>
            ))}
          </div>
        </div>

        <p className={styles.count}>{filtered.length} career{filtered.length !== 1 ? 's' : ''}</p>

        <div className={styles.grid}>
          {filtered.map(c => (
            <CareerCard
              key={c.id}
              career={c}
              isSelected={user?.targetCareerId === c.id}
              onClick={() => setSelected(c)}
            />
          ))}
        </div>

        {/* Detail modal */}
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ''} width={620}>
          {selected && detailMatch && (
            <div className={styles.detail}>
              <div className={styles.detailTop}>
                <span className={styles.detailIcon}>{selected.icon}</span>
                <div>
                  <p className={styles.detailCategory}>{selected.category}</p>
                  <p className={styles.detailDesc}>{selected.description}</p>
                </div>
              </div>
              <div className={styles.detailMeta}>
                <span><DollarSign size={14} />{selected.salary}</span>
                <span><TrendingUp size={14} />{selected.demand} demand</span>
              </div>
              <div className={styles.detailMatch}>
                <div className={styles.detailMatchHeader}>
                  <span>Your skill match</span>
                  <strong>{detailMatch.score}%</strong>
                </div>
                <ProgressBar value={detailMatch.score} height={8} />
              </div>
              <div className={styles.detailSkills}>
                <div className={styles.skillCol}>
                  <p className={styles.skillColLabel}><CheckCircle size={13} /> Matched ({detailMatch.matched.length})</p>
                  {detailMatch.matched.map(s => <span key={s} className={`${styles.skillPill} ${styles.matched}`}>{s}</span>)}
                  {!detailMatch.matched.length && <span className={styles.none}>None yet</span>}
                </div>
                <div className={styles.skillCol}>
                  <p className={styles.skillColLabel}>⚡ Developing ({detailMatch.partial.length})</p>
                  {detailMatch.partial.map(s => <span key={s} className={`${styles.skillPill} ${styles.partial}`}>{s}</span>)}
                  {!detailMatch.partial.length && <span className={styles.none}>None</span>}
                </div>
                <div className={styles.skillCol}>
                  <p className={styles.skillColLabel}>○ Missing ({detailMatch.missing.length})</p>
                  {detailMatch.missing.map(s => <span key={s} className={`${styles.skillPill} ${styles.missing}`}>{s}</span>)}
                  {!detailMatch.missing.length && <span className={styles.none}>None — great match!</span>}
                </div>
              </div>
              <div className={styles.detailActions}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSelect(selected.id)}
                  disabled={user?.targetCareerId === selected.id}
                >
                  {user?.targetCareerId === selected.id ? '✓ Current target' : 'Set as target career'}
                </button>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  )
}
