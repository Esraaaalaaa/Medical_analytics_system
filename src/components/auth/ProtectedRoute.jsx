import { Navigate } from 'react-router-dom'
import { getSession } from '../../lib/authSession'
import { isValidRole } from '../../lib/authRoles'

export default function ProtectedRoute({ children, allowedRoles }) {
  const session = getSession()
  if (!session?.role || !isValidRole(session.role)) {
    return <Navigate to="/login" replace />
  }

  if (session.role !== 'admin' && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(session.role)) {
      return <Navigate to="/home" replace />
    }
  }
  return children
}
