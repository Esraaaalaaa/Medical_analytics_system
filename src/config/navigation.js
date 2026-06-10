import {
  AlertTriangle,
  Mail,
  BarChart2,
  DollarSign,
  Users,
  FileText,
  LayoutGrid,
  Building2,
  ClipboardList,
  Home,
} from 'lucide-react'

export const LOGIN_PATHS = ['/login', '/login/credentials', '/login/']

export const MAIN_ROLES = ['secretary', 'president', 'director']

export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'الرئيسية',
    icon: Home,
    path: '/home',
    showOnHome: false,
  },
  {
    id: 'urgent',
    label: 'تنبيهات عاجلة',
    icon: AlertTriangle,
    path: '/urgent',
    urgent: true,
    allowedRoles: MAIN_ROLES,
  },
  {
    id: 'mailbox',
    label: 'صندوق البريد',
    icon: Mail,
    path: '/mailbox',
    badge: 3,
    allowedRoles: MAIN_ROLES,
  },
  {
    id: 'statistics',
    label: 'الإحصائيات',
    icon: BarChart2,
    subItems: [
      {
        id: 'secretary-stats',
        label: 'إدخال الإحصائيات',
        path: '/statistics',
        icon: ClipboardList,
        allowedRoles: ['secretary'],
      },
      {
        id: 'president-stats',
        label: 'لوحة المؤشرات الطبية',
        path: '/statistics/president',
        icon: LayoutGrid,
        allowedRoles: ['president'],
      },
      {
        id: 'director-stats',
        label: 'إحصائيات المستشفى',
        path: '/statistics/director',
        icon: Building2,
        allowedRoles: ['director'],
      },
    ],
  },
  {
    id: 'finance',
    label: 'المالية',
    icon: DollarSign,
    subItems: [
      {
        id: 'president-finance',
        label: 'الملخص المالي المجمع',
        path: '/president-finance',
        icon: LayoutGrid,
        allowedRoles: ['president'],
      },
      {
        id: 'director-finance',
        label: 'الملخص المالي للمستشفى',
        path: '/director-finance/alexandria',
        pathPrefix: '/director-finance/',
        icon: Building2,
        allowedRoles: ['director'],
      },
      {
        id: 'periodic-report',
        label: 'التقرير المالي الدوري',
        path: '/periodic-report',
        icon: ClipboardList,
        allowedRoles: ['secretary'],
      },
    ],
  },
  {
    id: 'meetings',
    label: 'الاجتماعات',
    icon: Users,
    path: '/meetings',
    allowedRoles: MAIN_ROLES,
  },
  {
    id: 'news',
    label: 'الأخبار',
    icon: FileText,
    path: '/news',
    allowedRoles: MAIN_ROLES,
  },
]

export function flattenNavItems(items = NAV_ITEMS) {
  return items.flatMap((item) => (item.subItems ? item.subItems : item))
}

export function isPathMatch(navItem, pathname) {
  if (!navItem?.path) return false

  if (pathname === navItem.path) return true

  if (navItem.pathPrefix && pathname.startsWith(navItem.pathPrefix)) {
    return true
  }

  return false
}

export function isRoleAllowed(role, allowedRoles) {
  if (role === 'admin') return true
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true
  return allowedRoles.includes(role)
}