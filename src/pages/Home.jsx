import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import { canAccessPath } from '../lib/roleAccess'
import { NAV_ITEMS } from '../config/navigation'
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Clock,
  Shield,
  Sparkles,
} from 'lucide-react'

const ROLE_COPY = {
  admin: {
    title: 'لوحة التحكم الرئيسية',
    subtitle: 'إدارة ومتابعة وحدات النظام من مكان واحد.',
    badge: 'صلاحيات كاملة',
  },
  secretary: {
    title: 'مساحة عمل السكرتارية',
    subtitle: 'إدخال البيانات، متابعة المراسلات، وتجهيز التقارير الدورية.',
    badge: 'متابعة وتشغيل',
  },
  president: {
    title: 'لوحة رئيس المجلس',
    subtitle: 'متابعة المؤشرات الطبية والمالية واتخاذ القرارات على مستوى المستشفيات الجامعية.',
    badge: 'عرض قيادي',
  },
  director: {
    title: 'لوحة مدير المستشفى',
    subtitle: 'متابعة أداء المستشفى، الإحصائيات، والملخص المالي الخاص بالجهة.',
    badge: 'إدارة المستشفى',
  },
}

const QUICK_STATS = [
  {
    id: 'alerts',
    label: 'تنبيهات تحتاج متابعة',
    value: '4',
    icon: Bell,
    tone: 'red',
  },
  {
    id: 'meetings',
    label: 'اجتماعات قادمة',
    value: '3',
    icon: CalendarDays,
    tone: 'sky',
  },
  {
    id: 'pending',
    label: 'تقارير قيد المراجعة',
    value: '2',
    icon: Clock,
    tone: 'amber',
  },
]

function getToneClasses(tone) {
  const tones = {
    red: 'bg-red-50 text-red-600 ring-red-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  }

  return tones[tone] ?? tones.sky
}

function getHomeTiles(role) {
  return NAV_ITEMS.filter((item) => item.showOnHome !== false).flatMap((item) => {
    if (item.path && canAccessPath(role, item.path)) {
      return [
        {
          id: item.id,
          label: item.label,
          description: getTileDescription(item.id),
          icon: item.icon,
          path: item.path,
          urgent: item.urgent,
        },
      ]
    }

    if (!item.subItems) return []

    const allowedSubItems = item.subItems.filter((sub) =>
      canAccessPath(role, sub.path),
    )

    if (allowedSubItems.length === 0) return []

    if (allowedSubItems.length === 1) {
      const sub = allowedSubItems[0]

      return [
        {
          id: sub.id,
          label: sub.label,
          description: getTileDescription(item.id),
          icon: item.icon,
          path: sub.path,
        },
      ]
    }

    return [
      {
        id: item.id,
        label: item.label,
        description: getTileDescription(item.id),
        icon: item.icon,
        path: allowedSubItems[0].path,
      },
    ]
  })
}

function getTileDescription(id) {
  const descriptions = {
    urgent: 'متابعة القرارات والتنبيهات المهمة',
    mailbox: 'مراجعة المراسلات والردود الداخلية',
    statistics: 'إدخال ومتابعة مؤشرات التشغيل',
    finance: 'متابعة التقارير والملخصات المالية',
    meetings: 'تنظيم الاجتماعات ومتابعة الحضور',
    news: 'آخر الأخبار والتحديثات الرسمية',
  }

  return descriptions[id] ?? 'فتح الصفحة ومتابعة البيانات'
}

function QuickStatCard({ item }) {
  const Icon = item.icon

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${getToneClasses(
          item.tone,
        )}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-2xl font-black text-slate-900">{item.value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{item.label}</p>
    </div>
  )
}

function TileCard({ tile }) {
  const navigate = useNavigate()
  const Icon = tile.icon

  return (
    <button
      type="button"
      onClick={() => navigate(tile.path)}
      className="group rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-100 transition-all group-hover:bg-sky-50 group-hover:text-sky-600 group-hover:ring-sky-100">
          <Icon className="h-5 w-5" />
        </div>

        {tile.urgent && (
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-500">
            عاجل
          </span>
        )}
      </div>

      <h3 className="text-base font-black text-slate-900">{tile.label}</h3>
      <p className="mt-2 min-h-12 text-sm font-medium leading-6 text-slate-500">
        {tile.description}
      </p>

      <div className="mt-5 flex items-center justify-end gap-2 text-sm font-black text-sky-600 opacity-0 transition-opacity group-hover:opacity-100">
        <span>فتح الصفحة</span>
        <ArrowLeft className="h-4 w-4" />
      </div>
    </button>
  )
}

export default function Home() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)
  const roleCopy = ROLE_COPY[session?.role] ?? ROLE_COPY.admin

  const tiles = useMemo(() => getHomeTiles(session?.role), [session?.role])

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-right shadow-sm md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-sky-900/50 via-transparent to-transparent" />
            <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70">
                  <span>UH-CONNECT</span>
                  <Shield className="h-3.5 w-3.5 text-sky-300" />
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-white/80">
                  <span>{roleCopy.badge}</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                </div>
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-relaxed text-white md:text-4xl">
                {roleCopy.title}
              </h1>

              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-white/65 md:text-base">
                {roleCopy.subtitle}
              </p>
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {QUICK_STATS.map((item) => (
              <QuickStatCard key={item.id} item={item} />
            ))}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-right">
                <h2 className="text-lg font-black text-slate-900">
                  الوصول السريع
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  اختر الصفحة التي تريد العمل عليها.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                {tiles.length} صفحات متاحة
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tiles.map((tile) => (
                <TileCard key={tile.id} tile={tile} />
              ))}
            </div>

            {tiles.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
                لا توجد صفحات متاحة لهذا المستخدم حالياً.
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  )
}