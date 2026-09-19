import styles from './ProgressBar.module.css'

export default function ProgressBar({ value, max = 100, color, height = 8, label, showPct = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={styles.wrap}>
      {(label || showPct) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showPct && <span className={styles.pct}>{pct}%</span>}
        </div>
      )}
      <div className={styles.track} style={{ height }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: color || 'var(--forest)', height }}
        />
      </div>
    </div>
  )
}
