import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Mail,
  BarChart2,
  DollarSign,
  Users,
  FileText,
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  LayoutGrid,
  Building2,
  ClipboardList,
} from 'lucide-react'
import { getSession, clearSession } from '../../lib/authSession'
import { getRoleProfile } from '../../lib/authRoles'

const NAV_ITEMS = [
  { id: 'urgent', label: 'Urgent', icon: AlertTriangle, path: '/home', urgent: true },
  { id: 'mailbox', label: 'Mailbox', icon: Mail, path: '/mailbox', badge: 3 },
  { id: 'statistics', label: 'Statistics', icon: BarChart2, path: '/statistics' },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    subItems: [
      { id: 'president-finance', label: 'الملخص المجمع', path: '/president-finance', icon: LayoutGrid },
      { id: 'director-finance', label: 'الملخص المالي', path: '/director-finance/alexandria', icon: Building2 },
      { id: 'periodic-report', label: 'التقرير الدوري', path: '/periodic-report', icon: ClipboardList },
    ],
  },
  { id: 'meetings', label: 'Meetings', icon: Users, path: '/meetings' },
  { id: 'news', label: 'News', icon: FileText, path: '/news' },
]

const matchesSub = (sub, pathname) =>
  pathname === sub.path ||
  pathname.startsWith('/' + sub.path.split('/')[1] + '/')

function resolveActiveId(pathname, activeNavId) {
  if (activeNavId) return activeNavId
  if (pathname === '/home' || pathname === '/urgent') return 'urgent'
  for (const item of NAV_ITEMS) {
    if (item.path && (pathname === item.path || pathname.startsWith(item.path + '/'))) {
      return item.id
    }
    if (item.subItems?.some((s) => matchesSub(s, pathname))) return item.id
  }
  return null
}

export default function Sidebar({
  userName: userNameProp,
  userSub: userSubProp,
  activeNavId,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const userName = userNameProp ?? profile?.userName ?? 'مدير مستشفى'
  const userSub = userSubProp ?? profile?.userSub ?? 'مستشفيات جامعة الإسكندرية'

  const activeId = resolveActiveId(location.pathname, activeNavId)

  const [expandedId, setExpandedId] = useState(() => {
    for (const item of NAV_ITEMS) {
      if (item.subItems?.some((s) => matchesSub(s, location.pathname))) return item.id
    }
    return null
  })

  useEffect(() => {
    for (const item of NAV_ITEMS) {
      if (item.subItems?.some((s) => matchesSub(s, location.pathname))) {
        setExpandedId(item.id)
        return
      }
    }
  }, [location.pathname])

  const navItemClass = (item) => {
    const isActive = activeId === item.id
    if (item.urgent && isActive) {
      return 'border-secondary text-secondary bg-secondary/10 font-bold'
    }
    if (isActive) {
      return 'border-primary-foreground/30 bg-primary-foreground/10 font-bold'
    }
    return 'border-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/20'
  }

  const handleNavClick = (item) => {
    if (item.subItems) {
      setExpandedId((prev) => (prev === item.id ? null : item.id))
      return
    }
    if (item.path) navigate(item.path)
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground border-l border-border shrink-0 h-full">
      <div className="p-4 border-b border-primary-foreground/20 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <Shield className="text-secondary shrink-0" size={24} strokeWidth={1.75} />
          <div className="text-xl font-bold font-headings">UH-CONNECT</div>
        </div>
        <div className="text-xs text-primary-foreground/70 text-center">
          المجلس الأعلى للمستشفيات الجامعية
        </div>
      </div>

      <div className="p-4 border-b border-primary-foreground/20 flex items-center gap-3">
        <div className="size-10 bg-primary-foreground/10 rounded-sm flex items-center justify-center border border-primary-foreground/20 shrink-0">
          <User size={20} strokeWidth={1.75} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold truncate">{userName}</span>
          <span className="text-xs text-primary-foreground/70 truncate">{userSub}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
        <ul className="space-y-1 px-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedId === item.id
            const hasActiveChild = item.subItems?.some((s) =>
              matchesSub(s, location.pathname),
            )

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm border transition-colors ${navItemClass(item)}`}
                >
                  <Icon size={18} strokeWidth={2} className="shrink-0" />
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.badge != null && (
                    <span className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.subItems && (
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {item.subItems && isExpanded && (
                  <ul className="mt-1 mr-2 border-r-2 border-primary-foreground/20 pr-1 space-y-0.5">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon
                      const subActive = matchesSub(sub, location.pathname)
                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => navigate(sub.path)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs transition-colors ${
                              subActive
                                ? 'bg-primary-foreground/15 text-primary-foreground font-bold'
                                : 'text-primary-foreground/70 hover:bg-primary-foreground/10'
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

                {hasActiveChild && !isExpanded && item.subItems && (
                  <ul className="mt-1 mr-2 border-r-2 border-primary-foreground/20 pr-1 space-y-0.5">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon
                      const subActive = matchesSub(sub, location.pathname)
                      if (!subActive) return null
                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onClick={() => navigate(sub.path)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs bg-primary-foreground/15 font-bold"
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

        <div className="px-4 py-2 mt-auto border-t border-primary-foreground/20">
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm border border-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-colors"
              >
                <User size={18} strokeWidth={2} />
                <span className="flex-1 text-right">الملف الشخصي</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm border border-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-colors"
              >
                <Settings size={18} strokeWidth={2} />
                <span className="flex-1 text-right">الإعدادات</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-sm text-sm font-bold text-red-400 border border-transparent hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
