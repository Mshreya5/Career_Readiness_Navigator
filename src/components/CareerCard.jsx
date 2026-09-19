import { TrendingUp, DollarSign, CheckCircle } from 'lucide-react'
import styles from './CareerCard.module.css'

const demandColor = { 'Very High': 'forest', 'High': 'sage', 'Medium': 'gold', 'Low': 'terra' }

export default function CareerCard({ career, isSelected, onClick }) {
  const dc = demandColor[career.demand] || 'slate'
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <div className={styles.top}>
        <span className={styles.icon}>{career.icon}</span>
        <span className={`badge badge-${dc}`}>{career.demand}</span>
      </div>
      <h3 className={styles.title}>{career.title}</h3>
      <p className={styles.category}>{career.category}</p>
      <p className={styles.desc}>{career.description}</p>
      <div className={styles.meta}>
        <span className={styles.metaItem}><DollarSign size={13} />{career.salary}</span>
        <span className={styles.metaItem}><TrendingUp size={13} />{career.demand} demand</span>
      </div>
      <div className={styles.skills}>
        {career.skills.slice(0, 4).map(s => (
          <span key={s} className={styles.skillTag}>{s}</span>
        ))}
        {career.skills.length > 4 && (
          <span className={styles.skillTag}>+{career.skills.length - 4}</span>
        )}
      </div>
      {isSelected && (
        <div className={styles.selectedBadge}><CheckCircle size={14} /> Selected</div>
      )}
    </button>
  )
}
