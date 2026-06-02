import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Mail, BarChart2, DollarSign,
  Users, FileText, User, Settings, LogOut,
  ChevronDown, LayoutGrid, Building2, ClipboardList,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'urgent',     label: 'Urgent',     icon: AlertTriangle, urgent: true },
  { id: 'mailbox',    label: 'Mailbox',    icon: Mail,          path: '/mailbox', badge: 3 },
  {
    id: 'statistics',
    label: 'Statistics',
    icon: BarChart2,
    subItems: [
      { id: 'secretary-stats', label: 'عرض الأمين العام', path: '/statistics',           icon: ClipboardList },
      { id: 'president-stats', label: 'عرض الرئيس',      path: '/statistics/president', icon: LayoutGrid },
      { id: 'director-stats',  label: 'عرض المدير',      path: '/statistics/director',  icon: Building2 },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    subItems: [
      { id: 'president-finance', label: 'الملخص المجمع',  path: '/president-finance',           icon: LayoutGrid },
      { id: 'director-finance',  label: 'الملخص المالي',  path: '/director-finance/alexandria',  icon: Building2 },
      { id: 'periodic-report',   label: 'التقرير الدوري', path: '/periodic-report',              icon: ClipboardList },
    ],
  },
  { id: 'meetings', label: 'Meetings', icon: Users,    path: '/meetings' },
  { id: 'news',     label: 'News',     icon: FileText, path: '/news' },
]

const matchesSub = (sub, pathname) =>
  pathname === sub.path ||
  pathname.startsWith('/' + sub.path.split('/')[1] + '/')

export default function Sidebar({
  userName = 'مدير مستشفى',
  userSub  = 'مستشفيات جامعة الإسكندرية',
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const [expandedId, setExpandedId] = useState(() => {
    for (const item of NAV_ITEMS) {
      if (item.subItems?.some(s => matchesSub(s, location.pathname))) return item.id
    }
    return null
  })

  useEffect(() => {
    for (const item of NAV_ITEMS) {
      if (item.subItems?.some(s => matchesSub(s, location.pathname))) {
        setExpandedId(item.id)
        return
      }
    }
  }, [location.pathname])

  const isDirectActive = (path) =>
    path && (location.pathname === path || location.pathname.startsWith(path + '/'))

  const hasActiveChild = (item) =>
    item.subItems?.some(s => matchesSub(s, location.pathname))

  const toggle = (item) => {
    if (item.subItems) {
      setExpandedId(prev => (prev === item.id ? null : item.id))
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    /* ── RTL wrapper fills full screen height ── */
       <aside
      dir="ltr"
      className="w-80 bg-[#0d1526] flex flex-col h-screen sticky top-0 shrink-0 border-l border-white/10"
    >

      {/* ── Logo ── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10">
        <div className="flex items-center justify-end gap-3">
          <div>
            <h1 className="text-white font-bold text-[15px] tracking-widest leading-none text-right">
              UH-CONNECT
            </h1>
            <p className="text-white/35 text-[11px] mt-1.5 leading-snug text-right">
              المجلس الأعلى للمستشفيات الجامعية
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── User ── */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-end gap-3">
        <div className="text-right min-w-0">
          <p className="text-white text-[14px] font-semibold truncate">{userName}</p>
          <p className="text-white/40 text-[12px] truncate mt-0.5">{userSub}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30
          flex items-center justify-center shrink-0 border border-white/10">
          <User className="w-5 h-5 text-white/60" />
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_ITEMS.map((item) => {
          const Icon        = item.icon
          const active      = isDirectActive(item.path)
          const childActive = hasActiveChild(item)
          const expanded    = expandedId === item.id

          /* ─ Urgent special button ─ */
          if (item.urgent) {
            const urgentActive = location.pathname === '/urgent'
            return (
              <div dir="rtl" key={item.id} className="px-3 mb-1">
                <button
                  onClick={() => navigate('/urgent')}
                  className={`w-full flex items-center justify-end gap-3 px-4 py-3 text-red-400 rounded-lg
                    border transition-all duration-150 ${
                    urgentActive
                      ? 'border-red-500/60 bg-red-500/20'
                      : 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20'
                  }`}
                >
                  <span className="text-[13.5px] font-semibold">Urgent</span>
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="mr-auto">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 opacity-70" />
                  </span>
                </button>
              </div>
            )
          }

          return (
            <div key={item.id}>
              {/* ─ Parent button ─ */}
              <button
                onClick={() => toggle(item)}
                className={`w-full flex items-center justify-end gap-3 px-5 py-3 relative
                  transition-all duration-150 ${
                    active || childActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/55 hover:bg-white/5 hover:text-white/90'
                  }`}
              >
                {/* Active indicator bar — right side for RTL */}
                {active && !item.subItems && (
                  <span className="absolute right-0 top-1.5 bottom-1.5 w-[3px] bg-blue-400 rounded-l-full" />
                )}

                {/* Chevron */}
                {item.subItems && (
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      expanded ? 'rotate-180' : ''
                    } ${childActive ? 'text-sky-400' : ''}`}
                  />
                )}

                <span className="text-[13.5px] font-medium">{item.label}</span>

                <div className="relative">
                  <Icon className={`w-[18px] h-[18px] ${childActive ? 'text-sky-400' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-2.5 -left-2.5 bg-red-500 text-white rounded-full w-4 h-4
                      flex items-center justify-center text-[9px] font-bold leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>

              {/* ─ Submenu ─ */}
              {item.subItems && (
                <div
                  className={`overflow-hidden transition-[max-height] duration-250 ease-in-out ${
                    expanded ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  {/* Connector line — right side for RTL */}
                  <div className="border-r-2 border-white/10 mr-[1.35rem] py-0.5">
                    {item.subItems.map((sub) => {
                      const SubIcon   = sub.icon
                      const subActive = matchesSub(sub, location.pathname)

                      return (
                        <button
                          key={sub.id}
                          onClick={() => navigate(sub.path)}
                          className={`w-full flex items-center justify-end gap-2.5 pr-4 pl-3 py-2.5
                            transition-all duration-150 rounded-r-lg ${
                              subActive
                                ? 'text-sky-300 bg-sky-500/15 font-semibold'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                            }`}
                        >
                          <span className="text-[12.5px] truncate">{sub.label}</span>
                          <SubIcon className={`w-4 h-4 shrink-0 ${subActive ? 'text-sky-400' : ''}`} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="border-t border-white/10 py-2">
        <button className="w-full flex items-center justify-end gap-3 px-5 py-3 text-white/50
          hover:bg-white/5 hover:text-white/80 transition-all text-[13.5px]">
          <span>الملف الشخصي</span>
          <User className="w-[18px] h-[18px]" />
        </button>
        <button className="w-full flex items-center justify-end gap-3 px-5 py-3 text-white/50
          hover:bg-white/5 hover:text-white/80 transition-all text-[13.5px]">
          <span>الإعدادات</span>
          <Settings className="w-[18px] h-[18px]" />
        </button>
        <button className="w-full flex items-center justify-end gap-3 px-5 py-3 text-red-400/80
          hover:bg-red-500/10 hover:text-red-400 transition-all text-[13.5px]">
          <span>تسجيل الخروج</span>
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </div>

    </aside>
  )
}