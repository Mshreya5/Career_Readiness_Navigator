import { useApp } from '../../context/AppContext.jsx'
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import styles from './ToastContainer.module.css'

const icons = { success: CheckCircle, info: Info, warning: AlertTriangle, error: AlertTriangle }
const colorMap = { success: 'forest', info: 'slate', warning: 'gold', error: 'terra' }

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map(t => {
        const Icon = icons[t.type] || Info
        return (
          <div key={t.id} className={`${styles.toast} ${styles[colorMap[t.type] || 'slate']}`}>
            <Icon size={16} />
            <span>{t.message}</span>
            <button className={styles.close} onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
