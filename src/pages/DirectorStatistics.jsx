import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import { BarChart3, Droplet, AlertCircle, Bed, Activity, Heart, Users, TrendingUp, Radio, PieChart } from 'lucide-react'

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
              <PieChart className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-800 text-base">
                توزيع حالات المرضى
              </h3>
            </div>
            <div className="h-48 flex items-center justify-center">
              {/* Bar chart visualization */}
              <div className="w-full h-full flex items-end justify-around gap-4 px-8">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-red-200 rounded-t-lg" style={{ height: '65%' }}></div>
                  <span className="text-xs text-slate-500">طوارئ</span>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-emerald-200 rounded-t-lg" style={{ height: '85%' }}></div>
                  <span className="text-xs text-slate-500">عيادات</span>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-blue-200 rounded-t-lg" style={{ height: '50%' }}></div>
                  <span className="text-xs text-slate-500">داخلي</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Service Trends */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-slate-800 text-base">
                مؤشر الخدمات الطبية
              </h3>
            </div>
            <div className="h-48 flex items-center justify-center relative">
              {/* Simple line chart visualization */}
              <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area under line */}
                <path
                  d="M0,120 L50,100 L100,80 L150,90 L200,60 L250,70 L300,40 L300,150 L0,150 Z"
                  fill="url(#lineGradient)"
                />
                {/* Line */}
                <polyline
                  points="0,120 50,100 100,80 150,90 200,60 250,70 300,40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-2">
                <span>سبتمبر</span>
                <span>أغسطس</span>
                <span>يوليو</span>
                <span>يونيو</span>
                <span>مايو</span>
                <span>أبريل</span>
                <span>مارس</span>
                <span>فبراير</span>
                <span>يناير</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
