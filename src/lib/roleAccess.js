const LOGIN_PATHS = ['/login', '/login/credentials', '/login/']

/**
 * Role-based access control for routes and navigation items.
 * Session role values come from `src/lib/authRoles.js` keys.
 */
export function canAccessPath(role, pathname) {
  // Always allow login pages
  if (LOGIN_PATHS.includes(pathname)) return true

  if (role === 'director') {
    return (
      pathname === '/home' ||
      pathname === '/urgent' ||
      pathname === '/news' ||
      pathname === '/meetings' ||
      pathname === '/mailbox' ||
      pathname === '/statistics/director' ||
      pathname === '/director-finance/alexandria' ||
      pathname.startsWith('/director-finance/')
    )
  }

  if (role === 'president') {
    return (
      pathname === '/home' ||
      pathname === '/statistics/president' ||
      pathname === '/president-finance'
    )
  }

  if (role === 'secretary') {
    return (
      pathname === '/home' ||
      pathname === '/statistics' ||
      pathname === '/periodic-report'
    )
  }

  return false
}

export function roleAllowedRolesForPath(pathname) {
  // Kept for future extension; currently not used.
  return null
}

