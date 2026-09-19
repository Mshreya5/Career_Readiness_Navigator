import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const user = localStorage.getItem('user')
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
