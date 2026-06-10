import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  BarChart2,
  RotateCcw,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

const STAT_FIELDS = [
  {
    key: 'outpatientVisits',
    label: 'زيارات العيادات الخارجية',
    placeholder: 'مثال: 1250',
  },
  {
    key: 'emergencyVisits',
    label: 'حالات الطوارئ',
    placeholder: 'مثال: 320',
  },
  {
    key: 'admissions',
    label: 'حالات الدخول',
    placeholder: 'مثال: 180',
  },
  {
    key: 'operations',
    label: 'العمليات الجراحية',
    placeholder: 'مثال: 74',
  },
  {
    key: 'icuBeds',
    label: 'أسرة الرعاية المتاحة',
    placeholder: 'مثال: 18',
  },
  {
    key: 'waitingList',
    label: 'حالات قوائم الانتظار',
    placeholder: 'مثال: 96',
  },
  {
    key: 'labTests',
    label: 'تحاليل المعامل',
    placeholder: 'مثال: 2500',
  },
  {
    key: 'radiology',
    label: 'فحوصات الأشعة',
    placeholder: 'مثال: 640',
  },
]

const INITIAL_FORM = {
  hospitalName: 'مستشفيات جامعة القاهرة',
  reportMonth: '2026-06',
  outpatientVisits: '',
  emergencyVisits: '',
  admissions: '',
  operations: '',
  icuBeds: '',
  waitingList: '',
  labTests: '',
  radiology: '',
  notes: '',
}

function StatInput({ label, value, onChange, placeholder }) {
  const hasValue = value !== ''

  return (
    <label className="block text-right">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ''))}
        placeholder={placeholder}
        inputMode="numeric"
        dir="ltr"
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-left text-sm font-bold text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 ${
          hasValue ? 'border-emerald-200' : 'border-slate-200'
        }`}
      />
    </label>
  )
}

export default function Statistics() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const completedFields = useMemo(() => {
    return STAT_FIELDS.filter((field) => form[field.key]).length
  }, [form])

  const completionPercent = Math.round((completedFields / STAT_FIELDS.length) * 100)
  const canSubmit = completedFields === STAT_FIELDS.length

  const updateField = (key, value) => {
    setSubmitted(false)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setSubmitted(false)
    setForm(INITIAL_FORM)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <PageHeader
            title="إدخال الإحصائيات"
            subtitle="تسجيل مؤشرات التشغيل الشهرية للمستشفى قبل المراجعة والاعتماد"
            icon={BarChart2}
            leftContent={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  <span>إعادة ضبط</span>
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <span>إرسال للمراجعة</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            }
          />

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">الجهة</p>
              <p className="mt-1 text-base font-black text-slate-800">
                {form.hospitalName}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">شهر التقرير</p>
              <p className="mt-1 text-base font-black text-slate-800">
                يونيو 2026
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">اكتمال البيانات</p>
              <p className="mt-1 text-base font-black text-slate-800">
                {completedFields} من {STAT_FIELDS.length}
              </p>
            </div>
          </div>

          {submitted && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              تم إرسال الإحصائيات للمراجعة بنجاح.
            </div>
          )}

          {!canSubmit && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-right text-sm font-bold text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                أكمل جميع مؤشرات التشغيل قبل إرسال البيانات للمراجعة.
              </span>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="text-right">
                <h3 className="text-base font-black text-slate-900">
                  مؤشرات التشغيل
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  الحقول المكتملة: {completedFields} من {STAT_FIELDS.length}
                </p>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                {completionPercent}%
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {STAT_FIELDS.map((field) => (
                <StatInput
                  key={field.key}
                  label={field.label}
                  value={form[field.key]}
                  placeholder={field.placeholder}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
            </div>

            <div className="mt-5">
              <label className="block text-right">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  ملاحظات إضافية
                </span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  rows={4}
                  dir="rtl"
                  placeholder="اكتب أي ملاحظات أو توضيحات مرتبطة بالإحصائيات..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}