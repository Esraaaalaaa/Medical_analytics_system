import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import { BarChart3, Droplet, AlertCircle, Bed, Activity, Heart, Users, TrendingUp, Radio, PieChart } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Area, AreaChart
} from 'recharts'

const SERVICES_TREND_DATA = [
  { month: 'يناير',  جراحة: 1100, طوارئ: 10200, عيادات: 44000 },
  { month: 'فبراير', جراحة: 1250, طوارئ: 11500, عيادات: 47000 },
  { month: 'مارس',   جراحة: 1400, طوارئ: 13000, عيادات: 52000 },
  { month: 'أبريل',  جراحة: 1180, طوارئ: 12400, عيادات: 49000 },
  { month: 'مايو',   جراحة: 1520, طوارئ: 14800, عيادات: 58000 },
  { month: 'يونيو',  جراحة: 1350, طوارئ: 13200, عيادات: 54000 },
  { month: 'يوليو',  جراحة: 1600, طوارئ: 15600, عيادات: 61000 },
  { month: 'أغسطس', جراحة: 1480, طوارئ: 14200, عيادات: 57000 },
  { month: 'سبتمبر', جراحة: 1700, طوارئ: 16800, عيادات: 65000 },
]

const PATIENT_DIST_DATA = [
  { name: 'طوارئ',       value: 136318, color: '#ef4444' },
  { name: 'عيادات',      value: 568339, color: '#10b981' },
  { name: 'داخلي',       value: 104306, color: '#3b82f6' },
  { name: 'عناية مركزة', value: 39607,  color: '#8b5cf6' },
  { name: 'جراحة',       value: 13788,  color: '#06b6d4' },
  { name: 'كيميائي',     value: 24558,  color: '#f97316' },
]

// Director dashboard cards
const DIRECTOR_CARDS = [
  {
    id: 1,
    label: 'العمليات الجراحية',
    value: '13,788',
    change: '+5%',
    icon: Activity,
    color: 'sky',
  },
  {
    id: 2,
    label: 'حالات المقيم',
    value: '104,306',
    change: '+8%',
    icon: Bed,
    color: 'purple',
  },
  {
    id: 3,
    label: 'حالات الطوارئ',
    value: '136,318',
    change: '+5%',
    icon: AlertCircle,
    color: 'red',
  },
  {
    id: 4,
    label: 'ولادات الطوارئ',
    value: '41,232',
    change: '+5%',
    icon: Droplet,
    color: 'cyan',
  },
  {
    id: 5,
    label: 'جلسات العلاج الإشعاعي',
    value: '4,115',
    change: '+5%',
    icon: Radio,
    color: 'purple',
  },
  {
    id: 6,
    label: 'جلسات العلاج الكيميائي',
    value: '24,558',
    change: '+4%',
    icon: TrendingUp,
    color: 'emerald',
  },
  {
    id: 7,
    label: 'الكشوف على العيادات الخارجية',
    value: '568,339',
    change: '+3%',
    icon: Users,
    color: 'green',
  },
  {
    id: 8,
    label: 'مرضى غرفات العناية المركزة',
    value: '39,607',
    change: '+5%',
    icon: Heart,
    color: 'red',
  },
]

export default function DirectorStatistics() {
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate, setToDate] = useState('30/09/2025')

  return (
    <MainLayout
      userName="مدير مستشفى"
      userSub="مستشفيات جامعة الإسكندرية - عرض بصندوقات إدارة نقطي"
    >
      <div dir="ltr" className="p-6 max-w-full mx-auto">
        <PageHeader
          title="لوحة المؤشرات الطبية"
          subtitle="مستشفيات جامعة الإسكندرية - عرض بصندوقات إدارة نقطي"
          icon={BarChart3}
        />

        <DateFilterBar
          fromDate={fromDate}
          onFromChange={setFromDate}
          toDate={toDate}
          onToChange={setToDate}
          className="mb-5"
        />

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6" dir="rtl">
          {DIRECTOR_CARDS.map(card => {
            const Icon = card.icon
            const colorClasses = {
              sky: 'bg-sky-50 text-sky-500',
              purple: 'bg-purple-50 text-purple-500',
              red: 'bg-red-50 text-red-500',
              cyan: 'bg-cyan-50 text-cyan-500',
              emerald: 'bg-emerald-50 text-emerald-500',
              green: 'bg-green-50 text-green-500',
            }

            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                {/* Change badge */}
                <div className="flex justify-end mb-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {card.change}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${colorClasses[card.color]}`}>
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Label and Value */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2 font-medium">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">
                    {card.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-5" dir="rtl">
          {/* Chart 1: Patient Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-800 text-base">توزيع حالات المرضى</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={PATIENT_DIST_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), 'حالة']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
                  {PATIENT_DIST_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Service Trends */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-800 text-base">مؤشر الخدمات الطبية</h3>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-3">
              {[{ label: 'عيادات', color: '#10b981' }, { label: 'طوارئ', color: '#ef4444' }, { label: 'جراحة', color: '#3b82f6' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                  <span className="text-xs text-slate-500">{l.label}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={SERVICES_TREND_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradEyada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradTawari" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradJiraha" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  formatter={(value, name) => [value.toLocaleString(), name]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="عيادات" stroke="#10b981" strokeWidth={2} fill="url(#gradEyada)" dot={false} />
                <Area type="monotone" dataKey="طوارئ"  stroke="#ef4444" strokeWidth={2} fill="url(#gradTawari)" dot={false} />
                <Area type="monotone" dataKey="جراحة"  stroke="#3b82f6" strokeWidth={2} fill="url(#gradJiraha)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
