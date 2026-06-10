import {
  LOGIN_PATHS,
  NAV_ITEMS,
  flattenNavItems,
  isPathMatch,
  isRoleAllowed,
} from '../config/navigation'

const STATIC_ALLOWED_PATHS = ['/home']

/**
 * Role-based access control for routes and navigation items.
 * Session role values come from `src/lib/authRoles.js` keys.
 */
export function canAccessPath(role, pathname) {
  if (LOGIN_PATHS.includes(pathname)) return true
  if (role === 'admin') return true
  if (STATIC_ALLOWED_PATHS.includes(pathname)) return Boolean(role)

  const navItem = flattenNavItems(NAV_ITEMS).find((item) =>
    isPathMatch(item, pathname),
  )

  if (!navItem) return false

  return isRoleAllowed(role, navItem.allowedRoles)
}

export function roleAllowedRolesForPath(pathname) {
  const navItem = flattenNavItems(NAV_ITEMS).find((item) =>
    isPathMatch(item, pathname),
  )

  return navItem?.allowedRoles ?? null
}