import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  AlertTriangle,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Archive,
  X,
  Megaphone,
  Eye,
} from 'lucide-react'

const INITIAL_ALERTS = [
  {
    id: 1,
    title: 'تحديث عاجل لبيانات المؤشرات الطبية',
    body:
      'يرجى استكمال ومراجعة بيانات المؤشرات الطبية الخاصة بشهر يونيو قبل نهاية اليوم، حتى يتم تجهيز التقرير المجمع للمجلس.',
    source: 'أمانة المجلس الأعلى للمستشفيات الجامعية',
    date: '10 يونيو 2026',
    time: '11:20 ص',
    priority: 'urgent',
    status: 'unread',
  },
  {
    id: 2,
    title: 'مراجعة موقف المستحقات والمديونيات',
    body:
      'برجاء مراجعة بيانات المستحقات والمديونيات والتأكد من اكتمال التوقيعات المطلوبة قبل إرسال التقرير النهائي.',
    source: 'الإدارة المالية',
    date: '9 يونيو 2026',
    time: '3:45 م',
    priority: 'high',
    status: 'read',
  },
  {
    id: 3,
    title: 'تأكيد حضور اجتماع متابعة الأداء',
    body:
      'تم تحديد اجتماع متابعة الأداء الأسبوعي لمراجعة مؤشرات التشغيل وموقف التقارير المالية والطبية.',
    source: 'وحدة المتابعة',
    date: '8 يونيو 2026',
    time: '12:00 م',
    priority: 'normal',
    status: 'read',
  },
  {
    id: 4,
    title: 'تذكير بإرسال التقرير الدوري',
    body:
      'يرجى إرسال التقرير الدوري بعد استكمال البيانات والتوقيعات الخاصة بالجهة.',
    source: 'إدارة التقارير',
    date: '7 يونيو 2026',
    time: '10:10 ص',
    priority: 'normal',
    status: 'archived',
  },
]

const FILTERS = [
  ['active', 'النشطة'],
  ['unread', 'غير المقروءة'],
  ['urgent', 'العاجلة'],
  ['archived', 'الأرشيف'],
]

const PRIORITY_META = {
  urgent: {
    label: 'عاجل جداً',
    className: 'border-red-200 bg-red-50 text-red-600',
    icon: AlertTriangle,
  },
  high: {
    label: 'هام',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Megaphone,
  },
  normal: {
    label: 'متابعة',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Clock,
  },
}

function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.normal
  const Icon = meta.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${meta.className}`}
    >
      <span>{meta.label}</span>
      <Icon className="h-3.5 w-3.5" />
    </span>
  )
}

function AlertCard({ item, onOpen, onRead, onArchive }) {
  return (
    <article
      className={`rounded-3xl border bg-white p-5 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        item.status === 'unread' ? 'border-red-200' : 'border-slate-200'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex shrink-0 flex-col items-end gap-2">
          <PriorityBadge priority={item.priority} />

          {item.status === 'unread' && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
              غير مقروء
            </span>
          )}

          {item.status === 'archived' && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
              مؤرشف
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-right">
          <h3 className="text-base font-black leading-7 text-slate-900">
            {item.title}
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-400">
            {item.source}
          </p>
        </div>
      </div>

      <p className="line-clamp-3 text-sm font-medium leading-7 text-slate-600">
        {item.body}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs font-bold text-slate-400">
          {item.date} - {item.time}
        </span>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-slate-50"
          >
            <span>عرض</span>
            <Eye className="h-3.5 w-3.5" />
          </button>

          {item.status !== 'read' && item.status !== 'archived' && (
            <button
              type="button"
              onClick={() => onRead(item.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <span>تمت القراءة</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}

          {item.status !== 'archived' && (
            <button
              type="button"
              onClick={() => onArchive(item.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-slate-50"
            >
              <span>أرشفة</span>
              <Archive className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function AddAlertModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    priority: 'high',
  })

  if (!open) return null

  const canSubmit = form.title.trim() && form.body.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return

    onAdd({
      id: Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      source: 'أمانة المجلس الأعلى للمستشفيات الجامعية',
      priority: form.priority,
      status: 'unread',
      date: 'اليوم',
      time: 'الآن',
    })

    setForm({
      title: '',
      body: '',
      priority: 'high',
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div dir="rtl" className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white text-right shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-5 pl-16 text-right">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 z-10 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-right">
            <h3 className="text-lg font-black text-slate-900">
              إضافة تنبيه
            </h3>
            <p className="mt-1 text-right text-sm font-medium text-slate-500">
              أضف عنوان التنبيه وتفاصيله.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              العنوان
            </label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              dir="rtl"
              placeholder="اكتب عنوان التنبيه..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none transition-all focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              درجة الأهمية
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['urgent', 'عاجل جداً'],
                ['high', 'هام'],
                ['normal', 'متابعة'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, priority: id }))}
                  className={`rounded-2xl border px-3 py-2.5 text-sm font-black transition-colors ${
                    form.priority === id
                      ? 'border-red-300 bg-red-50 text-red-600 ring-2 ring-red-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              التفاصيل
            </label>
            <textarea
              value={form.body}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, body: event.target.value }))
              }
              rows={4}
              dir="rtl"
              placeholder="اكتب تفاصيل التنبيه..."
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm outline-none transition-all focus:border-red-300 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span>إضافة</span>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DetailsModal({ alert, onClose }) {
  if (!alert) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        dir="rtl"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white text-right shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-10 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-slate-100 px-5 py-5 pl-16 text-right">
          <div className="mb-3 flex justify-start">
            <PriorityBadge priority={alert.priority} />
          </div>

          <h3
            dir="rtl"
            className="w-full text-right text-xl font-black leading-8 text-slate-900"
          >
            {alert.title}
          </h3>

          <p
            dir="rtl"
            className="mt-2 w-full text-right text-xs font-bold text-slate-400"
          >
            {alert.source} - {alert.date} - {alert.time}
          </p>
        </div>

        <div className="p-5 text-right">
          <p
            dir="rtl"
            className="whitespace-pre-line rounded-3xl border border-slate-100 bg-slate-50 p-5 text-right text-sm font-medium leading-8 text-slate-700"
          >
            {alert.body}
          </p>
        </div>
      </div>
    </div>
  )
}
export default function UrgentCirculars() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('active')
  const [addOpen, setAddOpen] = useState(false)
  const [detailsAlert, setDetailsAlert] = useState(null)
  const [toast, setToast] = useState('')

  const counts = useMemo(() => {
    return {
      active: alerts.filter((item) => item.status !== 'archived').length,
      unread: alerts.filter((item) => item.status === 'unread').length,
      urgent: alerts.filter(
        (item) => item.priority === 'urgent' && item.status !== 'archived',
      ).length,
      archived: alerts.filter((item) => item.status === 'archived').length,
    }
  }, [alerts])

  const filteredAlerts = useMemo(() => {
    return alerts.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.includes(search) ||
        item.body.includes(search) ||
        item.source.includes(search)

      const matchesFilter =
        filter === 'active'
          ? item.status !== 'archived'
          : filter === 'unread'
            ? item.status === 'unread'
            : filter === 'urgent'
              ? item.priority === 'urgent' && item.status !== 'archived'
              : item.status === 'archived'

      return matchesSearch && matchesFilter
    })
  }, [alerts, search, filter])

  const handleMarkRead = (id) => {
    setAlerts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'read' } : item)),
    )
    setToast('تم تحديث حالة التنبيه.')
  }

  const handleArchive = (id) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'archived' } : item,
      ),
    )
    setToast('تم نقل التنبيه إلى الأرشيف.')
  }

  const handleAdd = (newAlert) => {
    setAlerts((prev) => [newAlert, ...prev])
    setFilter('active')
    setToast('تمت إضافة التنبيه بنجاح.')
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="التنبيهات العاجلة"
            subtitle="متابعة الرسائل العاجلة والقرارات المهمة"
            icon={AlertTriangle}
            iconVariant="red"
            leftContent={
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                <span>إضافة تنبيه</span>
                <Plus className="h-4 w-4" />
              </button>
            }
          />

          {toast && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              {toast}
            </div>
          )}

          <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="بحث في التنبيهات..."
                  dir="rtl"
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-4 pr-9 text-right text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setFilter(id)
                      setToast('')
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
                      filter === id
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                    <span className="mr-1" dir="ltr">
                      ({counts[id] || 0})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredAlerts.map((item) => (
              <AlertCard
                key={item.id}
                item={item}
                onOpen={setDetailsAlert}
                onRead={handleMarkRead}
                onArchive={handleArchive}
              />
            ))}

            {filteredAlerts.length === 0 && (
              <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400 shadow-sm">
                لا توجد تنبيهات مطابقة
              </div>
            )}
          </section>
        </div>
      </div>

      <AddAlertModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <DetailsModal alert={detailsAlert} onClose={() => setDetailsAlert(null)} />
    </MainLayout>
  )
}