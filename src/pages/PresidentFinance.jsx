import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  DollarSign,
  Building2,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Download,
} from 'lucide-react'

const HOSPITALS = [
  {
    id: 'alexandria',
    university: 'جامعة الإسكندرية',
    hospital: 'مستشفيات جامعة الإسكندرية',
    receivables: 12600000,
    debts: 7100000,
    status: 'review',
    lastUpdate: '10 يونيو 2026',
  },
  {
    id: 'cairo',
    university: 'جامعة القاهرة',
    hospital: 'مستشفيات جامعة القاهرة',
    receivables: 18450000,
    debts: 9200000,
    status: 'submitted',
    lastUpdate: '10 يونيو 2026',
  },
  {
    id: 'mansoura',
    university: 'جامعة المنصورة',
    hospital: 'مستشفيات جامعة المنصورة',
    receivables: 14800000,
    debts: 6800000,
    status: 'approved',
    lastUpdate: '9 يونيو 2026',
  },
  {
    id: 'zagazig',
    university: 'جامعة الزقازيق',
    hospital: 'مستشفيات جامعة الزقازيق',
    receivables: 11350000,
    debts: 6400000,
    status: 'submitted',
    lastUpdate: '9 يونيو 2026',
  },
  {
    id: 'tanta',
    university: 'جامعة طنطا',
    hospital: 'مستشفيات جامعة طنطا',
    receivables: 10900000,
    debts: 5250000,
    status: 'approved',
    lastUpdate: '8 يونيو 2026',
  },
  {
    id: 'ain-shams',
    university: 'جامعة عين شمس',
    hospital: 'مستشفيات جامعة عين شمس',
    receivables: 17100000,
    debts: 8800000,
    status: 'submitted',
    lastUpdate: '8 يونيو 2026',
  },
  {
    id: 'assiut',
    university: 'جامعة أسيوط',
    hospital: 'مستشفيات جامعة أسيوط',
    receivables: 9800000,
    debts: 5600000,
    status: 'draft',
    lastUpdate: '7 يونيو 2026',
  },
  {
    id: 'aswan',
    university: 'جامعة أسوان',
    hospital: 'مستشفى أسوان الجامعي',
    receivables: 6900000,
    debts: 3400000,
    status: 'review',
    lastUpdate: '7 يونيو 2026',
  },
  {
    id: 'menoufia',
    university: 'جامعة المنوفية',
    hospital: 'مستشفيات جامعة المنوفية',
    receivables: 7400000,
    debts: 3900000,
    status: 'draft',
    lastUpdate: '6 يونيو 2026',
  },
  {
    id: 'nci',
    university: 'جامعة القاهرة',
    hospital: 'المعهد القومي للأورام',
    receivables: 13200000,
    debts: 7600000,
    status: 'approved',
    lastUpdate: '6 يونيو 2026',
  },
  {
    id: 'theodor',
    university: 'معهد تيودور بلهارس',
    hospital: 'معهد تيودور بلهارس',
    receivables: 3600000,
    debts: 1800000,
    status: 'draft',
    lastUpdate: '5 يونيو 2026',
  },
  {
    id: 'beni-suef',
    university: 'جامعة بني سويف',
    hospital: 'مستشفيات جامعة بني سويف',
    receivables: 8200000,
    debts: 4100000,
    status: 'submitted',
    lastUpdate: '5 يونيو 2026',
  },
]

const STATUS_META = {
  approved: {
    label: 'معتمد',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  submitted: {
    label: 'مرسل للمراجعة',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: FileText,
  },
  review: {
    label: 'قيد المراجعة',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Clock,
  },
  draft: {
    label: 'غير مكتمل',
    className: 'border-red-200 bg-red-50 text-red-600',
    icon: AlertTriangle,
  },
}

function formatMoney(value) {
  return value.toLocaleString('en-US')
}

function SummaryCard({ title, value, icon: Icon, tone, subtitle }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${
          toneClasses[tone] ?? toneClasses.sky
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-900" dir="ltr">
        {value}
      </p>
      {subtitle && (
        <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft
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

export default function PresidentFinance() {
  const navigate = useNavigate()
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvedAll, setApprovedAll] = useState(false)

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter((row) => {
      const matchesSearch =
        !search ||
        row.university.includes(search) ||
        row.hospital.includes(search)

      const matchesStatus =
        statusFilter === 'all' ? true : row.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totals = useMemo(() => {
    const receivables = filteredHospitals.reduce(
      (total, row) => total + row.receivables,
      0,
    )
    const debts = filteredHospitals.reduce((total, row) => total + row.debts, 0)

    return {
      receivables,
      debts,
      net: receivables - debts,
      approvedCount: HOSPITALS.filter((row) => row.status === 'approved').length,
    }
  }, [filteredHospitals])

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="الملخص المالي المجمع"
            subtitle="متابعة المستحقات والمديونيات على مستوى المستشفيات الجامعية"
            icon={DollarSign}
            iconVariant="green"
            leftContent={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>تصدير</span>
                  <Download className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setApprovedAll(true)}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <span>اعتماد الملخص</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            }
          />

          {approvedAll && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              تم اعتماد الملخص المالي المجمع بنجاح.
            </div>
          )}

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard
              title="إجمالي المستحقات"
              value={`${formatMoney(totals.receivables)} EGP`}
              icon={TrendingUp}
              tone="emerald"
              subtitle="حسب النتائج المعروضة"
            />
            <SummaryCard
              title="إجمالي المديونيات"
              value={`${formatMoney(totals.debts)} EGP`}
              icon={TrendingDown}
              tone="red"
              subtitle="حسب النتائج المعروضة"
            />
            <SummaryCard
              title="صافي المركز المالي"
              value={`${formatMoney(totals.net)} EGP`}
              icon={DollarSign}
              tone={totals.net >= 0 ? 'sky' : 'red'}
              subtitle="مستحقات ناقص مديونيات"
            />
            <SummaryCard
              title="تقارير معتمدة"
              value={`${totals.approvedCount} / ${HOSPITALS.length}`}
              icon={CheckCircle2}
              tone="amber"
              subtitle="على مستوى الجهات"
            />
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="بحث باسم الجامعة أو المستشفى..."
                  dir="rtl"
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-4 pr-9 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ['all', 'الكل'],
                  ['approved', 'معتمد'],
                  ['submitted', 'مرسل للمراجعة'],
                  ['review', 'قيد المراجعة'],
                  ['draft', 'غير مكتمل'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStatusFilter(id)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                      statusFilter === id
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-row-reverse items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                {filteredHospitals.length} جهة
              </span>

              <h3 className="text-right text-base font-black text-slate-900">
                تقارير المستشفيات
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-right text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500">
                  <tr>
                    <th className="px-5 py-3">الجامعة</th>
                    <th className="px-5 py-3">المستشفى</th>
                    <th className="px-5 py-3">المستحقات</th>
                    <th className="px-5 py-3">المديونيات</th>
                    <th className="px-5 py-3">الصافي</th>
                    <th className="px-5 py-3">الحالة</th>
                    <th className="px-5 py-3">آخر تحديث</th>
                    <th className="px-5 py-3">إجراء</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredHospitals.map((row) => {
                    const net = row.receivables - row.debts

                    return (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-bold text-slate-800">
                          {row.university}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {row.hospital}
                        </td>
                        <td className="px-5 py-4 font-black text-emerald-600" dir="ltr">
                          {formatMoney(row.receivables)}
                        </td>
                        <td className="px-5 py-4 font-black text-red-600" dir="ltr">
                          {formatMoney(row.debts)}
                        </td>
                        <td
                          className={`px-5 py-4 font-black ${
                            net >= 0 ? 'text-sky-600' : 'text-red-600'
                          }`}
                          dir="ltr"
                        >
                          {formatMoney(net)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {row.lastUpdate}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/director-finance/${row.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-700"
                          >
                            <span>فتح التفاصيل</span>
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredHospitals.length === 0 && (
              <div className="p-10 text-center text-sm font-bold text-slate-400">
                لا توجد نتائج مطابقة للبحث الحالي
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}