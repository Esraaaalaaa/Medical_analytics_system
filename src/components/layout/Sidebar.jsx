import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { getSession, clearSession } from '../../lib/authSession'
import { getRoleProfile } from '../../lib/authRoles'
import { canAccessPath } from '../../lib/roleAccess'
import { NAV_ITEMS, isPathMatch } from '../../config/navigation'

const matchesSub = (sub, pathname) => isPathMatch(sub, pathname)

function resolveActiveId(pathname, activeNavId, allowedNavItems) {
  if (activeNavId) return activeNavId

  for (const item of allowedNavItems) {
    if (item.path && isPathMatch(item, pathname)) return item.id

    if (item.subItems?.some((sub) => matchesSub(sub, pathname))) {
      return item.id
    }
  }

  return null
}

export default function Sidebar({
  userName: userNameProp,
  userSub: userSubProp,
  activeNavId,
  isOpen = false,
  onClose,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const session = getSession()
  const profile = getRoleProfile(session?.role)
  const role = session?.role

  const allowedNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (item.path) return canAccessPath(role, item.path)
      if (item.subItems) return item.subItems.some((sub) => canAccessPath(role, sub.path))
      return false
    })
  }, [role])

  const userName = userNameProp ?? profile?.userName ?? 'مستخدم'
  const userSub = userSubProp ?? profile?.userSub ?? 'المجلس الأعلى للمستشفيات الجامعية'

  const activeId = resolveActiveId(location.pathname, activeNavId, allowedNavItems)

  const [expandedId, setExpandedId] = useState(() => {
    for (const item of allowedNavItems) {
      if (item.subItems?.some((sub) => matchesSub(sub, location.pathname))) {
        return item.id
      }
    }

    return null
  })

  useEffect(() => {
    for (const item of allowedNavItems) {
      if (item.subItems?.some((sub) => matchesSub(sub, location.pathname))) {
        setExpandedId(item.id)
        return
      }
    }

    setExpandedId(null)
  }, [allowedNavItems, location.pathname])

  const getAllowedSubItems = (item) => {
    return item.subItems?.filter((sub) => canAccessPath(role, sub.path)) ?? []
  }

  const navItemClass = (item) => {
    const isActive = activeId === item.id

    if (item.urgent && isActive) {
      return 'border-red-300 bg-red-500/15 text-red-100 font-bold'
    }

    if (isActive) {
      return 'border-white/20 bg-white/10 text-white font-bold shadow-sm'
    }

    return 'border-transparent text-white/75 hover:border-white/10 hover:bg-white/10 hover:text-white'
  }

  const handleNavClick = (item) => {
    const subItemsAllowed = getAllowedSubItems(item)

    if (item.subItems && subItemsAllowed.length === 1) {
      navigate(subItemsAllowed[0].path)
      onClose?.()
      return
    }

    if (item.subItems) {
      setExpandedId((prev) => (prev === item.id ? null : item.id))
      return
    }

    if (item.path) {
      navigate(item.path)
      onClose?.()
    }
  }

  const handleSubNav = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`
        fixed inset-y-0 right-0 z-40 flex h-full w-72 shrink-0 flex-col border-l border-white/10
        bg-gradient-to-b from-primary via-primary to-slate-950 text-primary-foreground shadow-2xl
        transition-transform duration-300 ease-out md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="shrink-0 text-secondary" size={24} strokeWidth={1.75} />
          <div className="text-xl font-black font-headings">UH-CONNECT</div>
        </div>

        <div className="mt-2 text-center text-xs font-medium leading-relaxed text-white/60">
          المجلس الأعلى للمستشفيات الجامعية
        </div>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <User size={20} strokeWidth={1.75} />
          </div>

          <div className="flex min-w-0 flex-col text-right">
            <span className="truncate text-sm font-black">{userName}</span>
            <span className="mt-0.5 truncate text-xs font-medium text-white/60">{userSub}</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto py-4">
        <ul className="flex-1 space-y-1 px-3">
          {allowedNavItems.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedId === item.id
            const subItemsAllowed = getAllowedSubItems(item)
            const hasMultipleSubItems = subItemsAllowed.length > 1
            const hasActiveChild = subItemsAllowed.some((sub) =>
              matchesSub(sub, location.pathname),
            )

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm transition-all ${navItemClass(item)}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={2} className="shrink-0" />
                    <span className="flex-1 text-right">{item.label}</span>

                    {item.badge != null && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-black text-secondary-foreground">
                        {item.badge}
                      </span>
                    )}

                    {item.subItems && hasMultipleSubItems && (
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </button>

                {hasMultipleSubItems && isExpanded && (
                  <ul className="mr-4 mt-1 space-y-1 border-r border-white/15 pr-2">
                    {subItemsAllowed.map((sub) => {
                      const SubIcon = sub.icon
                      const subActive = matchesSub(sub, location.pathname)

                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => handleSubNav(sub.path)}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                              subActive
                                ? 'bg-white/15 font-bold text-white'
                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <SubIcon size={14} strokeWidth={2} className="shrink-0" />
                            <span className="flex-1 text-right">{sub.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {hasMultipleSubItems && hasActiveChild && !isExpanded && (
                  <ul className="mr-4 mt-1 space-y-1 border-r border-white/15 pr-2">
                    {subItemsAllowed.map((sub) => {
                      const SubIcon = sub.icon
                      const subActive = matchesSub(sub, location.pathname)

                      if (!subActive) return null

                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => handleSubNav(sub.path)}
                            className="flex w-full items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs font-bold text-white"
                          >
                            <SubIcon size={14} strokeWidth={2} />
                            <span className="flex-1 text-right">{sub.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-auto border-t border-white/10 px-3 pt-3">
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-white/10 hover:bg-white/10 hover:text-white"
              >
                <User size={18} strokeWidth={2} />
                <span className="flex-1 text-right">الملف الشخصي</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-white/10 hover:bg-white/10 hover:text-white"
              >
                <Settings size={18} strokeWidth={2} />
                <span className="flex-1 text-right">الإعدادات</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
              >
                <LogOut size={18} strokeWidth={2} />
                <span className="flex-1 text-right">تسجيل الخروج</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  )
}