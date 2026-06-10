import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  BarChart2,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Download,
  Printer,
  Building2,
  Users,
  Bed,
  Stethoscope,
  HeartPulse,
} from 'lucide-react'

const HOSPITALS = [
  {
    id: 1,
    hospital: 'مستشفيات جامعة الإسكندرية',
    surgeries: 39607,
    inpatients: 104306,
    emergency: 136318,
    dialysis: 41232,
    physicalTherapy: 4115,
    chemotherapy: 24558,
    outpatient: 568339,
    icuPatients: 13788,
    status: 'submitted',
    lastUpdate: '10 يونيو 2026',
  },
  {
    id: 2,
    hospital: 'مستشفيات جامعة المنيا',
    surgeries: 32360,
    inpatients: 29035,
    emergency: 103722,
    dialysis: 35923,
    physicalTherapy: 561,
    chemotherapy: 3213,
    outpatient: 363425,
    icuPatients: 11902,
    status: 'approved',
    lastUpdate: '10 يونيو 2026',
  },
  {
    id: 3,
    hospital: 'مستشفيات جامعة الزقازيق',
    surgeries: 27117,
    inpatients: 65691,
    emergency: 293755,
    dialysis: 21144,
    physicalTherapy: 10422,
    chemotherapy: 7018,
    outpatient: 394564,
    icuPatients: 8400,
    status: 'review',
    lastUpdate: '9 يونيو 2026',
  },
  {
    id: 4,
    hospital: 'مستشفيات جامعة المنصورة',
    surgeries: 44325,
    inpatients: 127565,
    emergency: 194212,
    dialysis: 34200,
    physicalTherapy: 10875,
    chemotherapy: 39487,
    outpatient: 1069312,
    icuPatients: 10021,
    status: 'submitted',
    lastUpdate: '9 يونيو 2026',
  },
  {
    id: 5,
    hospital: 'مستشفيات جامعة طنطا',
    surgeries: 28709,
    inpatients: 62413,
    emergency: 189054,
    dialysis: 18749,
    physicalTherapy: 1220,
    chemotherapy: 63749,
    outpatient: 262025,
    icuPatients: 14814,
    status: 'approved',
    lastUpdate: '8 يونيو 2026',
  },
  {
    id: 6,
    hospital: 'مستشفيات جامعة عين شمس',
    surgeries: 47492,
    inpatients: 65594,
    emergency: 109692,
    dialysis: 38741,
    physicalTherapy: 8439,
    chemotherapy: 11170,
    outpatient: 420620,
    icuPatients: 25252,
    status: 'submitted',
    lastUpdate: '8 يونيو 2026',
  },
  {
    id: 7,
    hospital: 'مستشفيات جامعة أسيوط',
    surgeries: 45277,
    inpatients: 94425,
    emergency: 136770,
    dialysis: 49171,
    physicalTherapy: 4815,
    chemotherapy: 0,
    outpatient: 263409,
    icuPatients: 10921,
    status: 'draft',
    lastUpdate: '7 يونيو 2026',
  },
  {
    id: 8,
    hospital: 'مستشفى أسوان الجامعي',
    surgeries: 13859,
    inpatients: 18442,
    emergency: 217204,
    dialysis: 23074,
    physicalTherapy: 0,
    chemotherapy: 50,
    outpatient: 66500,
    icuPatients: 3220,
    status: 'review',
    lastUpdate: '7 يونيو 2026',
  },
  {
    id: 9,
    hospital: 'مستشفيات جامعة المنوفية',
    surgeries: 12826,
    inpatients: 10713,
    emergency: 8315,
    dialysis: 0,
    physicalTherapy: 0,
    chemotherapy: 0,
    outpatient: 48498,
    icuPatients: 2580,
    status: 'draft',
    lastUpdate: '6 يونيو 2026',
  },
  {
    id: 10,
    hospital: 'المعهد القومي للأورام',
    surgeries: 3463,
    inpatients: 6980,
    emergency: 27385,
    dialysis: 0,
    physicalTherapy: 34893,
    chemotherapy: 67938,
    outpatient: 318539,
    icuPatients: 474,
    status: 'approved',
    lastUpdate: '6 يونيو 2026',
  },
  {
    id: 11,
    hospital: 'معهد تيودور بلهارس',
    surgeries: 1126,
    inpatients: 2303,
    emergency: 2918,
    dialysis: 702,
    physicalTherapy: 0,
    chemotherapy: 0,
    outpatient: 26495,
    icuPatients: 390,
    status: 'draft',
    lastUpdate: '5 يونيو 2026',
  },
  {
    id: 12,
    hospital: 'مستشفيات جامعة بني سويف',
    surgeries: 13376,
    inpatients: 25125,
    emergency: 107513,
    dialysis: 19000,
    physicalTherapy: 0,
    chemotherapy: 8535,
    outpatient: 198448,
    icuPatients: 7257,
    status: 'submitted',
    lastUpdate: '5 يونيو 2026',
  },
]

const COLUMNS = [
  {
    key: 'surgeries',
    label: 'العمليات الجراحية',
  },
  {
    key: 'inpatients',
    label: 'حالات مرضى الداخلي',
  },
  {
    key: 'emergency',
    label: 'حالات الطوارئ',
  },
  {
    key: 'dialysis',
    label: 'جلسات الغسيل الكلوي',
  },
  {
    key: 'physicalTherapy',
    label: 'جلسات العلاج الطبيعي',
  },
  {
    key: 'chemotherapy',
    label: 'جلسات العلاج الكيماوي',
  },
  {
    key: 'outpatient',
    label: 'المترددين على العيادات الخارجية',
  },
  {
    key: 'icuPatients',
    label: 'المرضى بالرعاية المركزة',
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
    icon: Activity,
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

function formatNumber(value) {
  return value.toLocaleString('en-US')
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

function SummaryCard({ title, value, icon: Icon, tone, subtitle }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    red: 'bg-red-50 text-red-600 ring-red-100',
    sky: 'bg-sky-50 text-sky-600 ring-sky-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
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

export default function PresidentStatistics() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approved, setApproved] = useState(false)

  const filteredHospitals = useMemo(() => {
    return HOSPITALS.filter((row) => {
      const matchesSearch = !search || row.hospital.includes(search)
      const matchesStatus =
        statusFilter === 'all' ? true : row.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totals = useMemo(() => {
    return filteredHospitals.reduce((acc, row) => {
      COLUMNS.forEach((column) => {
        acc[column.key] = (acc[column.key] || 0) + row[column.key]
      })

      return acc
    }, {})
  }, [filteredHospitals])

  const allTotals = useMemo(() => {
    return HOSPITALS.reduce((acc, row) => {
      COLUMNS.forEach((column) => {
        acc[column.key] = (acc[column.key] || 0) + row[column.key]
      })

      return acc
    }, {})
  }, [])

  const approvedCount = HOSPITALS.filter((row) => row.status === 'approved').length

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="لوحة المؤشرات الطبية"
            subtitle="متابعة مؤشرات التشغيل بالمستشفيات الجامعية على مستوى المجلس"
            icon={BarChart2}
            leftContent={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>طباعة</span>
                  <Printer className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>تصدير</span>
                  <Download className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setApproved(true)}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <span>اعتماد المؤشرات</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            }
          />

          {approved && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              تم اعتماد المؤشرات الطبية المعروضة بنجاح.
            </div>
          )}

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="إجمالي المترددين"
              value={formatNumber(allTotals.outpatient)}
              icon={Users}
              tone="sky"
              subtitle="على مستوى جميع الجهات"
            />
            <SummaryCard
              title="حالات الطوارئ"
              value={formatNumber(allTotals.emergency)}
              icon={Activity}
              tone="red"
              subtitle="على مستوى جميع الجهات"
            />
            <SummaryCard
              title="حالات الداخلي"
              value={formatNumber(allTotals.inpatients)}
              icon={Bed}
              tone="purple"
              subtitle="على مستوى جميع الجهات"
            />
            <SummaryCard
              title="العمليات الجراحية"
              value={formatNumber(allTotals.surgeries)}
              icon={Stethoscope}
              tone="emerald"
              subtitle="على مستوى جميع الجهات"
            />
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <HeartPulse className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">مرضى الرعاية المركزة</p>
              <p className="mt-2 text-2xl font-black text-slate-900" dir="ltr">
                {formatNumber(allTotals.icuPatients)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">تقارير معتمدة</p>
              <p className="mt-2 text-2xl font-black text-slate-900" dir="ltr">
                {approvedCount} / {HOSPITALS.length}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">عدد الجهات</p>
              <p className="mt-2 text-2xl font-black text-slate-900" dir="ltr">
                {HOSPITALS.length}
              </p>
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="بحث باسم المستشفى..."
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

              <div className="text-right">
                <h3 className="text-base font-black text-slate-900">
                  جدول المؤشرات الطبية
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  يمكن التمرير أفقياً لعرض جميع المؤشرات.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-right text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500">
                  <tr>
                    <th className="w-16 border-b border-slate-100 px-4 py-3 text-center">
                      م
                    </th>
                    <th className="min-w-[260px] border-b border-slate-100 px-4 py-3">
                      الجامعة
                    </th>
                    {COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        className="min-w-[140px] border-b border-slate-100 px-4 py-3 text-center"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="min-w-[140px] border-b border-slate-100 px-4 py-3 text-center">
                      حالة التقرير
                    </th>
                    <th className="min-w-[140px] border-b border-slate-100 px-4 py-3 text-center">
                      آخر تحديث
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHospitals.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3 text-center font-black text-slate-700">
                        {row.id}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 font-black text-slate-800">
                        {row.hospital}
                      </td>

                      {COLUMNS.map((column) => (
                        <td
                          key={column.key}
                          className="border-b border-slate-100 px-4 py-3 text-center font-bold text-slate-700"
                          dir="ltr"
                        >
                          {formatNumber(row[column.key])}
                        </td>
                      ))}

                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center text-slate-500">
                        {row.lastUpdate}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-950 text-sm font-black text-white">
                  <tr>
                    <td className="border-t border-slate-800 bg-slate-950 px-4 py-4 text-center" />
                    <td className="border-t border-slate-800 bg-slate-950 px-4 py-4">
                      الإجمالي
                    </td>
                    {COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className="border-t border-slate-800 px-4 py-4 text-center text-emerald-300"
                        dir="ltr"
                      >
                        {formatNumber(totals[column.key] || 0)}
                      </td>
                    ))}
                    <td className="border-t border-slate-800 px-4 py-4 text-center text-slate-300">
                      —
                    </td>
                    <td className="border-t border-slate-800 px-4 py-4 text-center text-slate-300">
                      —
                    </td>
                  </tr>
                </tfoot>
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