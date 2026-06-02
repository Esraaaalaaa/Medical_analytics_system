import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Building2, CheckCircle2, Loader2, TrendingUp, TrendingDown, PenLine, Award, Printer } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateRangePicker from '../components/ui/DateRangePicker'
import FormInputField from '../components/ui/FormInputField'

const fmt = (n) =>
  Number.isFinite(n) && n !== 0
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'

const sum = (obj, keys) =>
  keys.reduce((acc, k) => acc + (parseFloat(obj[k]) || 0), 0)

export default function PeriodicReport() {
  const navigate = useNavigate()

  const [recv, setRecv] = useState({
    from: '2025-01-01',
    to:   '2025-10-31',
    stateExpense:            '',
    healthInsurance:         '',
    comprehensiveInsurance:  '',
    waitingList:             '',
  })

  const [debt, setDebt] = useState({
    from: '2025-01-01',
    to:   '2025-10-31',
    free:     '',
    economic: '',
  })

  const [saveStatus, setSaveStatus] = useState('saved') // 'saving' | 'saved'
  const [lastSaved, setLastSaved] = useState(new Date())

  // Auto-save simulation
  useEffect(() => {
    setSaveStatus('saving')
    const t = setTimeout(() => {
      setSaveStatus('saved')
      setLastSaved(new Date())
    }, 900)
    return () => clearTimeout(t)
  }, [recv, debt])

  const recvTotal = useMemo(
    () => sum(recv, ['stateExpense', 'healthInsurance', 'comprehensiveInsurance', 'waitingList']),
    [recv]
  )
  const debtTotal = useMemo(
    () => sum(debt, ['free', 'economic']),
    [debt]
  )

  const updateRecv = (key) => (val) => setRecv(p => ({ ...p, [key]: val }))
  const updateDebt = (key) => (val) => setDebt(p => ({ ...p, [key]: val }))

  const formatTime = (d) =>
    d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

  return (
    <MainLayout
      userName="سكرتير طبي"
      userSub="مستشفيات جامعة القاهرة (القصر العيني)"
    >
      <div dir="ltr" className="p-6 max-w-8xl mx-auto">

        {/* Page Header */}
        <PageHeader
          title="التقرير المالي الدوري"
          icon={Clock}
          leftContent={
            <div className="flex items-center gap-2">
              {/* Auto-save indicator */}
              <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                saveStatus === 'saving'
                  ? 'text-amber-600 bg-amber-50 border-amber-200'
                  : 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }`}>
                {saveStatus === 'saving'
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <CheckCircle2 className="w-3 h-3" />}
                <span className="font-medium">
                  {saveStatus === 'saving' ? 'جاري الحفظ...' : 'محفوظ'}
                </span>
              </div>
              <button
                onClick={() => navigate('/president-finance')}
                className="text-xs text-slate-500 hover:text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-all font-medium"
              >
                ← العرض الموحد
              </button>
            </div>
          }
        />

        {/* Hospital badge + description */}
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3.5 mb-5 shadow-sm flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              آخر تحديث: اليوم، {formatTime(lastSaved)} صباحاً
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <p className="text-sm font-bold text-slate-800">مستشفيات جامعة القاهرة</p>
              <div className="w-7 h-7 flex items-center justify-center bg-sky-50 border border-sky-100 rounded-lg">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              يرجى إدخال بيانات المديونيات والمستحقات وتحديد الفترة الزمنية لكل منها.
              <span className="text-emerald-600 font-medium"> يتم حفظ التغييرات تلقائياً كمسودة.</span>
            </p>
          </div>
        </div>

        {/* Two data-entry cards */}
        {/* DOM first → visual RIGHT in RTL = receivables (green) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* ─── RECEIVABLES CARD ─── */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
            {/* Card header */}
            <div className="bg-gradient-to-l from-emerald-50 to-white border-b border-emerald-100 px-5 py-4 flex items-center justify-between">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-emerald-700 text-sm">إجمالي المستحقات</h3>
            </div>

            <div className="p-4 flex-1 space-y-4">
              {/* Date range */}
              <DateRangePicker
                fromDate={recv.from}
                toDate={recv.to}
                onFromChange={(v) => setRecv(p => ({ ...p, from: v }))}
                onToChange={(v) => setRecv(p => ({ ...p, to: v }))}
                accentColor="green"
              />

              {/* 2×2 fields grid */}
              {/* In RTL: first DOM column = visual RIGHT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInputField label="نفقة دولة"   value={recv.stateExpense}    onChange={updateRecv('stateExpense')} />
                <FormInputField label="تأمين صحي"   value={recv.healthInsurance} onChange={updateRecv('healthInsurance')} />
                <FormInputField
                  label="تأمين صحي شامل"
                  value={recv.comprehensiveInsurance}
                  onChange={updateRecv('comprehensiveInsurance')}
                  special
                />
                <FormInputField label="قوائم انتظار" value={recv.waitingList}     onChange={updateRecv('waitingList')} />
              </div>
            </div>

            {/* Footer total */}
            <div className="bg-emerald-50/60 border-t border-emerald-100 px-5 py-3 flex items-center justify-between">
              <span className="text-emerald-600 font-bold text-base tabular-nums">
                {fmt(recvTotal)}
                <span className="text-xs font-semibold text-emerald-400 mr-1.5">EGP</span>
              </span>
              <span className="text-sm font-semibold text-emerald-700">إجمالي المستحقات</span>
            </div>
          </div>

          {/* ─── DEBTS CARD ─── */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden flex flex-col">
            {/* Card header */}
            <div className="bg-gradient-to-l from-red-50 to-white border-b border-red-100 px-5 py-4 flex items-center justify-between">
              <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-red-700 text-sm">إجمالي المديونية لهيئة الشراء الموحد</h3>
            </div>

            <div className="p-4 flex-1 space-y-4">
              {/* Date range */}
              <DateRangePicker
                fromDate={debt.from}
                toDate={debt.to}
                onFromChange={(v) => setDebt(p => ({ ...p, from: v }))}
                onToChange={(v) => setDebt(p => ({ ...p, to: v }))}
                accentColor="red"
              />

              {/* Single-column fields with currency indicator */}
              <div className="space-y-3">
                <FormInputField label="المجاني"    value={debt.free}     onChange={updateDebt('free')}     showCurrency />
                <FormInputField label="الاقتصادي"  value={debt.economic} onChange={updateDebt('economic')} showCurrency />
              </div>
            </div>

            {/* Footer total */}
            <div className="bg-red-50/60 border-t border-red-100 px-5 py-3 flex items-center justify-between">
              <span className="text-red-600 font-bold text-base tabular-nums">
                {fmt(debtTotal)}
                <span className="text-xs font-semibold text-red-300 mr-1.5">EGP</span>
              </span>
              <span className="text-sm font-semibold text-red-700">إجمالي المديونية</span>
            </div>
          </div>
        </div>

        {/* Net balance */}
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3.5 mb-5 shadow-sm flex items-center justify-between">
          <span className={`font-bold text-lg tabular-nums ${recvTotal - debtTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {recvTotal - debtTotal >= 0 ? '+' : ''}{fmt(recvTotal - debtTotal)}
            <span className="text-xs font-semibold opacity-60 mr-1.5">EGP</span>
          </span>
          <span className="text-sm font-semibold text-slate-600">صافي المركز المالي</span>
        </div>

        {/* Signature section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-end gap-2.5">
            <h3 className="text-sm font-bold text-slate-700">الاعتمادات والتوقيعات الرسمية</h3>
            <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg">
              <PenLine className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'توقيع المدير',  sub: 'إدراج التوقيع الإلكتروني', type: 'pen' },
                { title: 'ختم الجهة',    sub: 'إرفاق صورة الختم',         type: 'seal' },
                { title: 'توقيع العميد', sub: 'إدراج التوقيع الإلكتروني', type: 'pen' },
              ].map((sig, i) => (
                <div
                  key={i}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-between min-h-28 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer group"
                >
                  <div className="text-right w-full">
                    <p className="text-sm font-semibold text-slate-700">{sig.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sig.sub}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 group-hover:border-sky-400 transition-colors flex items-center justify-center">
                    {sig.type === 'seal'
                      ? <Award className="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors" />
                      : <PenLine className="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 justify-start">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>اعتماد وحفظ التقرير</span>
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-sm">
            <Printer className="w-4 h-4" />
            <span>معاينة وطباعة</span>
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
