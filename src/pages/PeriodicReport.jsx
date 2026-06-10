import { useEffect, useMemo, useState } from 'react'
import {
  Clock,
  Building2,
  CheckCircle2,
  Loader2,
  TrendingUp,
  TrendingDown,
  PenLine,
  Award,
  Printer,
  FileCheck2,
} from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateRangePicker from '../components/ui/DateRangePicker'
import FormInputField from '../components/ui/FormInputField'
import SignatureUploadModal from '../components/ui/SignatureUploadModal'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'

const fmt = (n) =>
  Number.isFinite(n) && n !== 0
    ? n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'

const sum = (obj, keys) =>
  keys.reduce((acc, key) => acc + (parseFloat(obj[key]) || 0), 0)

const SIGNATURE_FIELDS = [
  {
    id: 'director',
    title: 'توقيع المدير',
    sub: 'إرفاق صورة التوقيع',
    type: 'pen',
  },
  {
    id: 'seal',
    title: 'ختم الجهة',
    sub: 'إرفاق صورة الختم',
    type: 'seal',
  },
  {
    id: 'dean',
    title: 'توقيع العميد',
    sub: 'إرفاق صورة التوقيع',
    type: 'pen',
  },
]

export default function PeriodicReport() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [recv, setRecv] = useState({
    from: '2026-06-01',
    to: '2026-06-30',
    stateExpense: '',
    healthInsurance: '',
    comprehensiveInsurance: '',
    waitingList: '',
  })

  const [debt, setDebt] = useState({
    from: '2026-06-01',
    to: '2026-06-30',
    free: '',
    economic: '',
  })

  const [signatures, setSignatures] = useState({})
  const [activeSignature, setActiveSignature] = useState(null)
  const [saveStatus, setSaveStatus] = useState('saved')
  const [lastSaved, setLastSaved] = useState(new Date())
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    setSaveStatus('saving')
    const timer = setTimeout(() => {
      setSaveStatus('saved')
      setLastSaved(new Date())
    }, 800)

    return () => clearTimeout(timer)
  }, [recv, debt, signatures])

  const recvTotal = useMemo(
    () =>
      sum(recv, [
        'stateExpense',
        'healthInsurance',
        'comprehensiveInsurance',
        'waitingList',
      ]),
    [recv],
  )

  const debtTotal = useMemo(() => sum(debt, ['free', 'economic']), [debt])

  const netBalance = recvTotal - debtTotal

  const completedSignatures = SIGNATURE_FIELDS.filter(
    (field) => signatures[field.id],
  ).length

  const selectedSignatureField = SIGNATURE_FIELDS.find(
    (field) => field.id === activeSignature,
  )

  const updateRecv = (key) => (value) => {
    setApproved(false)
    setRecv((prev) => ({ ...prev, [key]: value }))
  }

  const updateDebt = (key) => (value) => {
    setApproved(false)
    setDebt((prev) => ({ ...prev, [key]: value }))
  }

  const formatTime = (date) =>
    date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="التقرير المالي الدوري"
            subtitle="إدخال ومراجعة المستحقات والمديونيات قبل الاعتماد"
            icon={Clock}
            leftContent={
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                    saveStatus === 'saving'
                      ? 'border-amber-200 bg-amber-50 text-amber-600'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  }`}
                >
                  <span>{saveStatus === 'saving' ? 'جاري الحفظ...' : 'محفوظ'}</span>
                  {saveStatus === 'saving' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
                >
                  معاينة التقرير
                </button>
              </div>
            }
          />

          <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">الجهة</p>
              <p className="mt-1 text-base font-black text-slate-800">
                مستشفيات جامعة القاهرة
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">آخر تحديث</p>
              <p className="mt-1 text-base font-black text-slate-800">
                اليوم، {formatTime(lastSaved)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-400">التوقيعات</p>
              <p className="mt-1 text-base font-black text-slate-800">
                {completedSignatures} من {SIGNATURE_FIELDS.length}
              </p>
            </div>
          </div>

          {approved && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              تم اعتماد التقرير بنجاح، ويمكن الآن طباعته أو إرساله للمراجعة النهائية.
            </div>
          )}

          <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-right shadow-sm">
            <p className="text-sm font-medium leading-7 text-slate-500">
              أدخل بيانات المستحقات والمديونيات، ثم أرفق التوقيعات أو الختم لاعتماد التقرير.
              يتم حفظ التغييرات تلقائياً أثناء العمل.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-center justify-start gap-3 border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-white px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-black text-emerald-700">
                  إجمالي المستحقات
                </h3>
              </div>

              <div className="flex-1 space-y-4 p-4">
                <DateRangePicker
                  fromDate={recv.from}
                  toDate={recv.to}
                  onFromChange={(value) =>
                    setRecv((prev) => ({ ...prev, from: value }))
                  }
                  onToChange={(value) =>
                    setRecv((prev) => ({ ...prev, to: value }))
                  }
                  accentColor="green"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormInputField
                    label="نفقة دولة"
                    value={recv.stateExpense}
                    onChange={updateRecv('stateExpense')}
                  />
                  <FormInputField
                    label="تأمين صحي"
                    value={recv.healthInsurance}
                    onChange={updateRecv('healthInsurance')}
                  />
                  <FormInputField
                    label="تأمين صحي شامل"
                    value={recv.comprehensiveInsurance}
                    onChange={updateRecv('comprehensiveInsurance')}
                  />
                  <FormInputField
                    label="قوائم انتظار"
                    value={recv.waitingList}
                    onChange={updateRecv('waitingList')}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-emerald-100 bg-emerald-50/60 px-5 py-3">
                <span className="text-base font-black tabular-nums text-emerald-600" dir="ltr">
                  {fmt(recvTotal)}
                  <span className="ml-1.5 text-xs font-bold text-emerald-400">
                    EGP
                  </span>
                </span>
                <span className="text-sm font-black text-emerald-700">
                  إجمالي المستحقات
                </span>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
              <div className="flex items-center justify-start gap-3 border-b border-red-100 bg-gradient-to-l from-red-50 to-white px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-sm font-black text-red-700">
                  إجمالي المديونية لهيئة الشراء الموحد
                </h3>
              </div>

              <div className="flex-1 space-y-4 p-4">
                <DateRangePicker
                  fromDate={debt.from}
                  toDate={debt.to}
                  onFromChange={(value) =>
                    setDebt((prev) => ({ ...prev, from: value }))
                  }
                  onToChange={(value) =>
                    setDebt((prev) => ({ ...prev, to: value }))
                  }
                  accentColor="red"
                />

                <div className="space-y-3">
                  <FormInputField
                    label="المجاني"
                    value={debt.free}
                    onChange={updateDebt('free')}
                    showCurrency
                  />
                  <FormInputField
                    label="الاقتصادي"
                    value={debt.economic}
                    onChange={updateDebt('economic')}
                    showCurrency
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-red-100 bg-red-50/60 px-5 py-3">
                <span className="text-base font-black tabular-nums text-red-600" dir="ltr">
                  {fmt(debtTotal)}
                  <span className="ml-1.5 text-xs font-bold text-red-300">
                    EGP
                  </span>
                </span>
                <span className="text-sm font-black text-red-700">
                  إجمالي المديونية
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <span
              dir="ltr"
              className={`text-lg font-black tabular-nums ${
                netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {netBalance >= 0 ? '+' : ''}
              {fmt(netBalance)}
              <span className="ml-1.5 text-xs font-bold opacity-60">EGP</span>
            </span>
            <span className="text-sm font-black text-slate-600">
              صافي المركز المالي
            </span>
          </div>

          <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-start gap-2.5 border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-black text-slate-700">
                الاعتمادات والتوقيعات الرسمية
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                <PenLine className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SIGNATURE_FIELDS.map((signature) => {
                  const image = signatures[signature.id]

                  return (
                    <button
                      key={signature.id}
                      type="button"
                      onClick={() => setActiveSignature(signature.id)}
                      className="flex min-h-36 cursor-pointer flex-col items-center justify-between rounded-2xl border-2 border-dashed border-slate-200 p-4 text-right transition-all hover:border-sky-300 hover:bg-sky-50/30"
                    >
                      <div className="w-full">
                        <p className="text-sm font-black text-slate-700">
                          {signature.title}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {image ? 'تم إرفاق الصورة' : signature.sub}
                        </p>
                      </div>

                      {image ? (
                        <img
                          src={image}
                          alt={signature.title}
                          className="mt-3 max-h-16 max-w-full rounded-xl object-contain"
                        />
                      ) : (
                        <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-slate-200">
                          {signature.type === 'seal' ? (
                            <Award className="h-5 w-5 text-slate-300" />
                          ) : (
                            <PenLine className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-start">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <span>معاينة وطباعة</span>
              <Printer className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setApproved(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              <span>اعتماد وحفظ التقرير</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <SignatureUploadModal
        open={Boolean(activeSignature)}
        title={selectedSignatureField?.title}
        subtitle="ارفع صورة واضحة للتوقيع أو الختم ليتم عرضها داخل التقرير."
        currentImage={signatures[activeSignature]}
        onClose={() => setActiveSignature(null)}
        onSave={(image) => {
          setApproved(false)
          setSignatures((prev) => ({ ...prev, [activeSignature]: image }))
        }}
        onRemove={() => {
          setApproved(false)
          setSignatures((prev) => {
            const next = { ...prev }
            delete next[activeSignature]
            return next
          })
        }}
      />
    </MainLayout>
  )
}