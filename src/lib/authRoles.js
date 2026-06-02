export const ROLES = {
  admin: {
    id: 'admin',
    label: 'مدير النظام',
    userName: 'admin',
    userSub: 'المجلس الأعلى للمستشفيات الجامعية',
    destination: '/home',
    financePath: '/president-finance',
  },
  secretary: {
    id: 'secretary',
    label: 'سكرتير طبي',
    userName: 'سكرتير طبي',
    userSub: 'مستشفيات جامعة الإسكندرية',
    destination: '/home',
    financePath: '/periodic-report',
  },
  director: {
    id: 'director',
    label: 'مدير مستشفى',
    userName: 'مدير مستشفى',
    userSub: 'مستشفيات جامعة الإسكندرية',
    destination: '/home',
    financePath: '/director-finance/alexandria',
  },
  president: {
    id: 'president',
    label: 'رئيس المستشفيات',
    userName: 'رئيس المستشفيات',
    userSub: 'المجلس الأعلى للمستشفيات الجامعية',
    destination: '/home',
    financePath: '/president-finance',
  },
}

export const isValidRole = (role) => role && role in ROLES

export const getRoleDestination = (role) => ROLES[role]?.destination ?? '/login'

export const getRoleProfile = (role) => ROLES[role] ?? null
