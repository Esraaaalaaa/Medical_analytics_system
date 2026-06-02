import { Navigate } from 'react-router-dom'
import { getSession } from '../../lib/authSession'
import { isValidRole } from '../../lib/authRoles'

export default function ProtectedRoute({ children }) {
  const session = getSession()
  if (!session?.role || !isValidRole(session.role)) {
    return <Navigate to="/login" replace />
  }
  return children
}
