import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  DollarSign,
  Building2,
  TrendingUp,
  TrendingDown,
  Printer,
  Plus,
  X,
  Download,
  CalendarDays,
  Wallet,
  ReceiptText,
} from 'lucide-react'

const HOSPITALS = {
  cairo: {
    name: 'مستشفيات جامعة القاهرة',
    university: 'جامعة القاهرة',
  },
  alexandria: {
    name: 'مستشفيات جامعة الإسكندرية',
    university: 'جامعة الإسكندرية',
  },
  mansoura: {
    name: 'مستشفيات جامعة المنصورة',
    university: 'جامعة المنصورة',
  },
  assiut: {
    name: 'مستشفيات جامعة أسيوط',
    university: 'جامعة أسيوط',
  },
}

const PERIODS = [
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
    multiplier: 2.8,
  },
  {
    id: 'year',
    label: 'السنة الحالية',
    from: '1/1/2026',
    to: '30/6/2026',
    multiplier: 5.2,
  },
]

const BASE_ITEMS = [
  {
    id: 1,
    type: 'receivable',
    name: 'نفقة دولة',
    amount: 5200000,
    note: 'مطالبات علاج على نفقة الدولة',
  },
  {
    id: 2,
    type: 'receivable',
    name: 'تأمين صحي',
    amount: 3100000,
    note: 'مستحقات التأمين الصحي',
  },
  {
    id: 3,
    type: 'receivable',
    name: 'قوائم انتظار',
    amount: 4300000,
    note: 'مطالبات قوائم الانتظار',
  },
  {
    id: 4,
    type: 'receivable',
    name: 'علاج اقتصادي',
    amount: 1850000,
    note: 'خدمات علاج اقتصادي',
  },
  {
    id: 5,
    type: 'debt',
    name: 'مديونية هيئة الشراء الموحد - المجاني',
    amount: 4100000,
    note: 'مديونية مستلزمات وأدوية',
  },
  {
    id: 6,
    type: 'debt',
    name: 'مديونية هيئة الشراء الموحد - الاقتصادي',
    amount: 3000000,
    note: 'مديونية خدمات اقتصادية',
  },
  {
    id: 7,
    type: 'debt',
    name: 'توريدات تحت التسوية',
    amount: 1650000,
    note: 'بنود لم يتم تسويتها بعد',
  },
]

function formatMoney(value) {
  return Math.round(value).toLocaleString('en-US')
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
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

function AddItemModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    type: 'receivable',
    name: '',
    amount: '',
    note: '',
  })

  if (!open) return null

  const canSubmit = form.name.trim() && Number(form.amount) > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return

    onAdd({
      id: Date.now(),
      type: form.type,
      name: form.name.trim(),
      amount: Number(form.amount),
      note: form.note.trim(),
    })

    setForm({
      type: 'receivable',
      name: '',
      amount: '',
      note: '',
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        dir="rtl"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white text-right shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-10 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-slate-100 px-5 py-5 pl-16 text-right">
          <h3 className="text-lg font-black text-slate-900">إضافة بند مالي</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            أضف بند مستحقات أو مديونية للملخص المالي.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              نوع البند
            </label>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['receivable', 'مستحقات'],
                ['debt', 'مديونية'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: id }))}
                  className={`rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                    form.type === id
                      ? 'border-sky-300 bg-sky-50 text-sky-700 ring-2 ring-sky-100'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              اسم البند
            </label>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="مثال: تأمين صحي شامل"
              dir="rtl"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              القيمة
            </label>
            <input
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  amount: event.target.value.replace(/[^\d]/g, ''),
                }))
              }
              placeholder="0"
              dir="ltr"
              inputMode="numeric"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              ملاحظات
            </label>
            <textarea
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, note: event.target.value }))
              }
              rows={3}
              placeholder="ملاحظات اختيارية..."
              dir="rtl"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-right text-sm outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
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
              <span>إضافة البند</span>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FinancialSection({ title, items, type }) {
  const isReceivable = type === 'receivable'

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-row-reverse items-center justify-between border-b border-slate-100 px-5 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            isReceivable
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {items.length} بنود
        </span>

        <h3 className="text-right text-base font-black text-slate-900">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="p-4 text-right">
            <div className="flex items-start justify-between gap-4">
              <p
                className={`shrink-0 text-sm font-black ${
                  isReceivable ? 'text-emerald-600' : 'text-red-600'
                }`}
                dir="ltr"
              >
                {formatMoney(item.amount)} EGP
              </p>

              <div className="min-w-0 flex-1 text-right">
                <h4 className="font-black text-slate-900">{item.name}</h4>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                  {item.note || 'لا توجد ملاحظات'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DirectorFinance() {
  const { hospitalId = 'alexandria' } = useParams()
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const hospital = HOSPITALS[hospitalId] ?? HOSPITALS.alexandria

  const [items, setItems] = useState(BASE_ITEMS)
  const [modalOpen, setModalOpen] = useState(false)
  const [periodId, setPeriodId] = useState('current')
  const [toast, setToast] = useState('')

  const activePeriod = useMemo(() => {
    return PERIODS.find((item) => item.id === periodId) ?? PERIODS[0]
  }, [periodId])

  const calculatedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      amount: Math.round(item.amount * activePeriod.multiplier),
    }))
  }, [items, activePeriod])

  const receivables = calculatedItems.filter((item) => item.type === 'receivable')
  const debts = calculatedItems.filter((item) => item.type === 'debt')

  const totals = useMemo(() => {
    const receivablesTotal = receivables.reduce(
      (total, item) => total + item.amount,
      0,
    )
    const debtsTotal = debts.reduce((total, item) => total + item.amount, 0)

    return {
      receivables: receivablesTotal,
      debts: debtsTotal,
      net: receivablesTotal - debtsTotal,
      itemsCount: calculatedItems.length,
    }
  }, [receivables, debts, calculatedItems])

  const handleAdd = (item) => {
    setItems((prev) => [item, ...prev])
    setToast('تمت إضافة البند المالي بنجاح.')
  }

  const handleExport = () => {
    downloadCsv('director-finance.csv', [
      ['نوع البند', 'اسم البند', 'القيمة', 'ملاحظات', 'الفترة من', 'الفترة إلى'],
      ...calculatedItems.map((item) => [
        item.type === 'receivable' ? 'مستحقات' : 'مديونية',
        item.name,
        item.amount,
        item.note,
        activePeriod.from,
        activePeriod.to,
      ]),
    ])
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="الملخص المالي للمستشفى"
            subtitle={`${hospital.name} - ${hospital.university}`}
            icon={DollarSign}
            iconVariant="green"
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

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  <span>إضافة بند</span>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            }
          />

          {toast && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              {toast}
            </div>
          )}

          <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {PERIODS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPeriodId(item.id)
                      setToast('')
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
                      periodId === item.id
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
                    من: <span dir="ltr">{activePeriod.from}</span> - إلى:{' '}
                    <span dir="ltr">{activePeriod.to}</span>
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </div>
          </section>

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard
              title="إجمالي المستحقات"
              value={`${formatMoney(totals.receivables)} EGP`}
              icon={TrendingUp}
              tone="emerald"
              subtitle="حسب الفترة المعروضة"
            />
            <SummaryCard
              title="إجمالي المديونية"
              value={`${formatMoney(totals.debts)} EGP`}
              icon={TrendingDown}
              tone="red"
              subtitle="حسب الفترة المعروضة"
            />
            <SummaryCard
              title="صافي المركز المالي"
              value={`${formatMoney(totals.net)} EGP`}
              icon={Wallet}
              tone={totals.net >= 0 ? 'sky' : 'red'}
              subtitle="مستحقات ناقص مديونيات"
            />
            <SummaryCard
              title="عدد البنود"
              value={String(totals.itemsCount)}
              icon={ReceiptText}
              tone="amber"
              subtitle="بنود مالية مسجلة"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <FinancialSection
              title="إجمالي المستحقات"
              items={receivables}
              type="receivable"
            />

            <FinancialSection
              title="إجمالي المديونية لهيئة الشراء الموحد"
              items={debts}
              type="debt"
            />
          </div>
        </div>
      </div>

      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </MainLayout>
  )
}