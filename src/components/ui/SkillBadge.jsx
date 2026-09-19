import { getProficiency } from '../../data/mockData.js'
import styles from './SkillBadge.module.css'

export default function SkillBadge({ skill, level, size = 'md' }) {
  const prof = getProficiency(level || 'none')
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ '--dot': prof.color }}
      title={`${skill}: ${prof.label}`}
    >
      <span className={styles.dot} />
      {skill}
      {level && <span className={styles.level}>{prof.label}</span>}
    </span>
  )
}
