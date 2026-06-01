import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { AlertTriangle, User, Clock, CheckCircle2, Plus, Zap } from 'lucide-react'

const CIRCULARS = [
  {
    id: 1,
    title: 'تحديث بروتوكول الطوارئ',
    badge: 'هام جداً',
    source: 'المجلس الأعلى للمستشفيات الجامعية',
    time: 'اليوم، 10:30 صباحاً',
    body: 'يرجى من جميع مديري المستشفيات مراجعة وتحديث غرف الرعاية المركزة في موعد أقصاه اليوم تزامناً مع تفعيل منظومة الربط الجديدة.',
    confirmed: false,
  },
  {
    id: 2,
    title: 'اجتماع طارئ لمديري المستشفيات',
    badge: null,
    source: 'مكتب وزير التعليم العالي',
    time: 'أمس، 02:15 مساءً',
    body: 'تقرر عقد اجتماع طارئ يوم الخميس القادم لمناقشة آليات تطبيق منظومة الشراء الموحد وتأثيرها على موازنة المستشفيات.',
    confirmed: false,
  },
]

function CircularCard({ circular, onConfirm }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Colored left accent bar */}
      <div className="flex">
        <div className="w-1 shrink-0 bg-red-400 rounded-r-full" />

        <div className="flex-1 p-5">
          {/* Title + badge row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            {circular.badge && (
              <span className="flex items-center gap-1 text-[11.5px] font-bold text-red-500
                bg-red-50 border border-red-200 px-2.5 py-1 rounded-full shrink-0 mt-0.5">
                <Zap className="w-3 h-3" />
                {circular.badge}
              </span>
            )}
            <h3 className="text-slate-800 font-bold text-[15px] text-right flex-1 leading-snug">
              {circular.title}
            </h3>
          </div>

          {/* Meta: source + time */}
          <div className="flex items-center justify-end gap-4 mb-3 text-slate-500 text-[12.5px]">
            <div className="flex items-center gap-1.5">
              <span>{circular.time}</span>
              <Clock className="w-3.5 h-3.5 shrink-0" />
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <span>{circular.source}</span>
              <User className="w-3.5 h-3.5 shrink-0" />
            </div>
          </div>

          {/* Body text */}
          <p className="text-slate-600 text-[13.5px] leading-relaxed text-right mb-4 border-t border-slate-100 pt-3">
            {circular.body}
          </p>

          {/* Confirm receipt */}
          <div className="flex justify-end">
            <button
              onClick={() => !circular.confirmed && onConfirm(circular.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium
                transition-all duration-200 ${
                circular.confirmed
                  ? 'text-green-600 bg-green-50 border border-green-200 cursor-default'
                  : 'text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95'
              }`}
            >
              <span>{circular.confirmed ? 'تم الاستلام' : 'تأكيد الاستلام'}</span>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${circular.confirmed ? 'text-green-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UrgentCirculars() {
  const [circulars, setCirculars] = useState(CIRCULARS)

  const handleConfirm = (id) => {
    setCirculars(prev => prev.map(c => c.id === id ? { ...c, confirmed: true } : c))
  }

  return (
    <MainLayout>
      <div dir="ltr" className="p-6 max-w-8xl mx-auto">
        <PageHeader
          title="التعميمات العاجلة"
          subtitle="رسائل وتنبيهات هامة لجميع القيادات"
          icon={AlertTriangle}
          iconVariant="red"
          leftContent={
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 shadow-sm">
              <Plus className="w-4 h-4 shrink-0" />
              <span>إرسال تعميم جديد</span>
            </button>
          }
        />

        <div className="flex flex-col gap-4">
          {circulars.map(c => (
            <CircularCard key={c.id} circular={c} onConfirm={handleConfirm} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
