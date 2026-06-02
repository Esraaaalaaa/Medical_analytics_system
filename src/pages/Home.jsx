import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Mail,
  BarChart2,
  DollarSign,
  Users,
  FileText,
} from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import { canAccessPath } from '../lib/roleAccess'

export default function Home() {
  const navigate = useNavigate()
  const session = getSession()
  const profile = getRoleProfile(session?.role)
  const role = session?.role

  const statisticsPath =
    role === 'president'
      ? '/statistics/president'
      : role === 'director'
      ? '/statistics/director'
      : '/statistics'

  const financeTileLabel =
    role === 'secretary'
      ? 'التقرير المالي الدوري'
      : role === 'director'
      ? 'الملخص المالي المجمع'
      : 'Finance'

  const tiles = [
    {
      id: 'urgent',
      label: 'Urgent',
      icon: AlertTriangle,
      path: '/urgent',
    },
    {
      id: 'mailbox',
      label: 'Mailbox',
      icon: Mail,
      path: '/mailbox',
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: BarChart2,
      path: statisticsPath,
    },
    {
      id: 'finance',
      label: financeTileLabel,
      icon: DollarSign,
      path: profile?.financePath ?? '/president-finance',
    },
    {
      id: 'meetings',
      label: 'Meetings',
      icon: Users,
      path: '/meetings',
    },
    {
      id: 'news',
      label: 'News',
      icon: FileText,
      path: '/news',
    },
  ].filter((t) => canAccessPath(role, t.path))

  return (
    <MainLayout
      userName={profile?.userName}
      userSub={profile?.userSub}
    >
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 mt-12">
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-primary mb-2">
            مرحباً بك في نظام التواصل الموحد
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            منصة التقارير والتواصل للمستشفيات الجامعية المصرية.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {tiles.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center p-8 border border-border bg-card shadow-sm hover:shadow-md hover:border-primary rounded-xl transition-all active:scale-95 group"
                >
                  <Icon
                    size={40}
                    strokeWidth={1.75}
                    className="mb-4 text-primary/70 group-hover:text-primary transition-colors"
                  />
                  <span
                    dir="ltr"
                    className={`font-bold text-lg ${
                      'text-foreground group-hover:text-primary transition-colors'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
