import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import ToastContainer from './components/ui/ToastContainer.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Careers from './pages/Careers.jsx'
import Assessment from './pages/Assessment.jsx'
import SkillGap from './pages/SkillGap.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Progress from './pages/Progress.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Tutor from './pages/Tutor.jsx'

function PrivateRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/careers"    element={<PrivateRoute><Careers /></PrivateRoute>} />
        <Route path="/career-selection" element={<PrivateRoute><Careers /></PrivateRoute>} />
        <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
        <Route path="/skill-assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
        <Route path="/skill-gap"  element={<PrivateRoute><SkillGap /></PrivateRoute>} />
        <Route path="/roadmap"    element={<PrivateRoute><Roadmap /></PrivateRoute>} />
        <Route path="/tutor"      element={<PrivateRoute><Tutor /></PrivateRoute>} />
        <Route path="/progress"   element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings"   element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
