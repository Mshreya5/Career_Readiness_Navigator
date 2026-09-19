import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, ClipboardList, TrendingUp,
  Map, BarChart2, User, Settings, LogOut, Compass, X, GraduationCap
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/careers',    icon: Briefcase,        label: 'Careers' },
  { to: '/assessment', icon: ClipboardList,    label: 'Assessment' },
  { to: '/skill-gap',  icon: TrendingUp,       label: 'Skill Gap' },
  { to: '/roadmap',    icon: Map,              label: 'Roadmap' },
  { to: '/tutor',      icon: GraduationCap,    label: 'Personal Tutor' },
  { to: '/progress',   icon: BarChart2,        label: 'Progress' },
  { to: '/profile',    icon: User,             label: 'Profile' },
  { to: '/settings',   icon: Settings,         label: 'Settings' },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/login') }

  return (
    <>
      {mobileOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <Compass size={22} strokeWidth={1.8} />
          <span>CareerNav</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Student'}</span>
              <span className={styles.userEmail}>{user?.email || ''}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} /><span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
