import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  BarChart2,
  CalendarDays,
  Activity,
  Users,
  Bed,
  Stethoscope,
  HeartPulse,
  Dumbbell,
  Syringe,
  Droplets,
  Download,
  Printer,
  TrendingUp,
  PieChart,
} from 'lucide-react'

const DATE_PRESETS = [
  {
    id: 'current',
    label: 'الشهر الحالي',
    from: '1/6/2026',
    to: '30/6/2026',
    multiplier: 1,
  },
  {
    id: 'quarter',
    label: 'الربع الحالي',
    from: '1/4/2026',
    to: '30/6/2026',
    multiplier: 2.85,
  },
  {
    id: 'year',
    label: 'السنة الحالية',
    from: '1/1/2026',
    to: '30/6/2026',
    multiplier: 5.4,
  },
]

const BASE_INDICATORS = [
  {
    key: 'surgeries',
    label: 'العمليات الجراحية',
    value: 39607,
    icon: Stethoscope,
    tone: 'sky',
    change: '+5%',
  },
  {
    key: 'inpatients',
    label: 'حالات مرضى الداخلي',
    value: 104306,
    icon: Bed,
    tone: 'purple',
    change: '+7%',
  },
  {
    key: 'emergency',
    label: 'حالات الطوارئ',
    value: 136318,
    icon: Activity,
    tone: 'red',
    change: '+4%',
  },
  {
    key: 'dialysis',
    label: 'جلسات الغسيل الكلوي',
    value: 41232,
    icon: Droplets,
    tone: 'cyan',
    change: '+3%',
  },
  {
    key: 'icuPatients',
    label: 'المرضى بالرعاية المركزة',
    value: 39607,
    icon: HeartPulse,
    tone: 'pink',
    change: '+2%',
  },
  {
    key: 'outpatient',
    label: 'المترددين على العيادات الخارجية',
    value: 568339,
    icon: Users,
    tone: 'emerald',
    change: '+9%',
  },
  {
    key: 'chemotherapy',
    label: 'جلسات العلاج الكيماوي',
    value: 24558,
    icon: Syringe,
    tone: 'violet',
    change: '+6%',
  },
  {
    key: 'physicalTherapy',
    label: 'جلسات العلاج الطبيعي',
    value: 4115,
    icon: Dumbbell,
    tone: 'amber',
    change: '+1%',
  },
]

const BASE_MONTHLY_SURGERIES = [
  { month: 'يناير', value: 27200 },
  { month: 'فبراير', value: 31500 },
  { month: 'مارس', value: 29600 },
  { month: 'أبريل', value: 36200 },
  { month: 'مايو', value: 34500 },
  { month: 'يونيو', value: 39607 },
]

const TONE_CLASSES = {
  sky: {
    icon: 'bg-sky-50 text-sky-600 ring-sky-100',
    chip: 'bg-sky-50 text-sky-700',
    bar: 'bg-sky-400',
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600 ring-purple-100',
    chip: 'bg-purple-50 text-purple-700',
    bar: 'bg-purple-400',
  },
  red: {
    icon: 'bg-red-50 text-red-600 ring-red-100',
    chip: 'bg-red-50 text-red-700',
    bar: 'bg-red-300',
  },
  cyan: {
    icon: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
    chip: 'bg-cyan-50 text-cyan-700',
    bar: 'bg-cyan-400',
  },
  pink: {
    icon: 'bg-pink-50 text-pink-600 ring-pink-100',
    chip: 'bg-pink-50 text-pink-700',
    bar: 'bg-pink-300',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    chip: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-300',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600 ring-violet-100',
    chip: 'bg-violet-50 text-violet-700',
    bar: 'bg-violet-400',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-100',
    chip: 'bg-amber-50 text-amber-700',
    bar: 'bg-amber-300',
  },
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('en-US')
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')

  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function IndicatorCard({ item }) {
  const Icon = item.icon
  const tone = TONE_CLASSES[item.tone] ?? TONE_CLASSES.sky

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${tone.chip}`}
          dir="ltr"
        >
          {item.change}
        </span>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${tone.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="text-sm font-bold leading-7 text-slate-600">
        {item.label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950" dir="ltr">
        {formatNumber(item.value)}
      </p>
    </div>
  )
}

function LineChartCard({ data }) {
  const max = Math.max(...data.map((item) => item.value))
  const min = Math.min(...data.map((item) => item.value))
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const average = total / data.length
  const highest = [...data].sort((a, b) => b.value - a.value)[0]

  const points = data
    .map((item, index) => {
      const x = 48 + index * 86
      const y = 238 - ((item.value - min) / (max - min || 1)) * 160
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
            الإجمالي: <span dir="ltr">{formatNumber(total)}</span>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
            المتوسط: <span dir="ltr">{formatNumber(average)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <h3 className="text-base font-black text-slate-900">
              تطور العمليات الجراحية
            </h3>
            <p className="mt-1 text-xs font-bold text-slate-400">
              أعلى شهر: {highest.month} -{' '}
              <span dir="ltr">{formatNumber(highest.value)}</span>
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-slate-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 560 310"
          className="h-[310px] min-w-[560px] text-slate-300"
          role="img"
          aria-label="تطور العمليات الجراحية"
        >
          {[70, 120, 170, 220, 270].map((y) => (
            <line
              key={y}
              x1="35"
              y1={y}
              x2="535"
              y2={y}
              stroke="currentColor"
              strokeDasharray="4 6"
            />
          ))}

          <line x1="35" y1="270" x2="535" y2="270" stroke="currentColor" />
          <line x1="35" y1="45" x2="35" y2="270" stroke="currentColor" />

          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            className="text-sky-500"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => {
            const x = 48 + index * 86
            const y = 238 - ((item.value - min) / (max - min || 1)) * 160

            return (
              <g key={item.month}>
                <circle cx={x} cy={y} r="6" className="fill-sky-500" />
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  className="fill-slate-700 text-[12px] font-bold"
                >
                  {formatNumber(item.value)}
                </text>
                <text
                  x={x}
                  y="295"
                  textAnchor="middle"
                  className="fill-slate-600 text-[12px] font-bold"
                >
                  {item.month}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

function DistributionCard({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const max = Math.max(...data.map((item) => item.value))
  const highest = [...data].sort((a, b) => b.value - a.value)[0]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            الإجمالي: <span dir="ltr">{formatNumber(total)}</span>
          </span>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
            الأعلى: {highest.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <h3 className="text-base font-black text-slate-900">
              توزيع حالات المرضى
            </h3>
            <p className="mt-1 text-xs font-bold text-slate-400">
              مقارنة بين الطوارئ والعيادات والداخلي
            </p>
          </div>
          <PieChart className="h-5 w-5 text-slate-500" />
        </div>
      </div>

      <div className="flex h-[280px] items-end justify-center gap-8 border-b border-r border-slate-200 px-6 pb-8">
        {data.map((item) => {
          const tone = TONE_CLASSES[item.tone] ?? TONE_CLASSES.sky
          const height = Math.max(45, (item.value / max) * 190)
          const percent = total ? (item.value / total) * 100 : 0

          return (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <span className="text-xs font-black text-slate-700" dir="ltr">
                {formatNumber(item.value)}
              </span>

              <div
                className={`w-16 rounded-t-2xl ${tone.bar}`}
                style={{ height }}
              />

              <div className="text-center">
                <span className="block text-xs font-black text-slate-600">
                  {item.label}
                </span>
                <span className="block text-[11px] font-bold text-slate-400" dir="ltr">
                  {percent.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {data.map((item) => {
          const tone = TONE_CLASSES[item.tone] ?? TONE_CLASSES.sky
          const percent = total ? (item.value / total) * 100 : 0

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-right"
            >
              <p className="text-xs font-black text-slate-600">{item.label}</p>
              <p className="mt-1 text-sm font-black text-slate-950" dir="ltr">
                {formatNumber(item.value)}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function DirectorStatistics() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [selectedPreset, setSelectedPreset] = useState(DATE_PRESETS[0].id)

  const activePreset = useMemo(() => {
    return DATE_PRESETS.find((item) => item.id === selectedPreset) ?? DATE_PRESETS[0]
  }, [selectedPreset])

  const indicators = useMemo(() => {
    return BASE_INDICATORS.map((item) => ({
      ...item,
      value: Math.round(item.value * activePreset.multiplier),
    }))
  }, [activePreset])

  const monthlySurgeries = useMemo(() => {
    const factor =
      selectedPreset === 'current' ? 1 : selectedPreset === 'quarter' ? 1.35 : 1.8

    return BASE_MONTHLY_SURGERIES.map((item) => ({
      ...item,
      value: Math.round(item.value * factor),
    }))
  }, [selectedPreset])

  const distribution = useMemo(() => {
    const getValue = (key) => indicators.find((item) => item.key === key)?.value ?? 0

    return [
      {
        label: 'الطوارئ',
        value: getValue('emergency'),
        tone: 'red',
      },
      {
        label: 'العيادات',
        value: getValue('outpatient'),
        tone: 'emerald',
      },
      {
        label: 'الداخلي',
        value: getValue('inpatients'),
        tone: 'sky',
      },
    ]
  }, [indicators])

  const handleExport = () => {
    downloadCsv('director-statistics.csv', [
      ['المؤشر', 'القيمة', 'الفترة من', 'الفترة إلى'],
      ...indicators.map((item) => [
        item.label,
        item.value,
        activePreset.from,
        activePreset.to,
      ]),
    ])
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="لوحة المؤشرات الطبية"
            subtitle="مستشفيات جامعة الإسكندرية - عرض إحصائيات الأداء الطبي"
            icon={BarChart2}
            leftContent={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>طباعة</span>
                  <Printer className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>تصدير</span>
                  <Download className="h-4 w-4" />
                </button>
              </div>
            }
          />

          <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {DATE_PRESETS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPreset(item.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
                      selectedPreset === item.id
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-start gap-3 text-right">
                <div>
                  <p className="text-xs font-bold text-slate-400">
                    الفترة المعروضة
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-800">
                    من: <span dir="ltr">{activePreset.from}</span> - إلى:{' '}
                    <span dir="ltr">{activePreset.to}</span>
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {indicators.map((item) => (
              <IndicatorCard key={item.key} item={item} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <LineChartCard data={monthlySurgeries} />
            <DistributionCard data={distribution} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}