import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Briefcase, ClipboardList,
  TrendingUp, Map, BarChart2, Settings, LogOut, Compass
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/career-selection', icon: Briefcase, label: 'Career Selection' },
  { to: '/skill-assessment', icon: ClipboardList, label: 'Skill Assessment' },
  { to: '/skill-gap', icon: TrendingUp, label: 'Skill Gap' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Compass size={24} />
        <span>CareerNav</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  )
}
