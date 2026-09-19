import { Bell, Menu, Compass } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import styles from './Navbar.module.css'

export default function Navbar({ onMenuClick }) {
  const { user, targetCareer } = useApp()

  return (
    <header className={styles.navbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className={styles.mobileLogo}>
        <Compass size={18} strokeWidth={1.8} />
        <span>CareerNav</span>
      </div>
      <div className={styles.right}>
        {targetCareer && (
          <span className={styles.careerBadge}>
            <span className={styles.careerDot} />
            {targetCareer.title}
          </span>
        )}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={1.8} />
        </button>
        <div className={styles.avatar} aria-label={`User: ${user?.name}`}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
