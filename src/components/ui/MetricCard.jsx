import styles from './MetricCard.module.css'

export default function MetricCard({ icon, label, value, sub, accent = 'forest' }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={`${styles.icon} ${styles[accent]}`}>{icon}</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}
