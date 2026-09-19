import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className={styles.layout}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={styles.main}>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <div className={styles.content}>
          <div className="page-enter">{children}</div>
        </div>
      </div>
    </div>
  )
}
