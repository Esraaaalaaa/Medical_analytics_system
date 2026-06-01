import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import FinanceSummaryCard from '../components/ui/FinanceSummaryCard'

const HOSPITAL_DATA = {
  alexandria: {
    name: 'مستشفيات جامعة الإسكندرية',
    receivables: {
      total: 22_850_000,
      items: [
        { label: 'نفقة دولة',        value: 10_500_000 },
        { label: 'تأمين صحي',        value: 7_100_000 },
        { label: 'قوائم انتظار',      value: 3_000_000 },
        { label: 'تأمين صحي شامل',   value: 2_250_000, special: true },
      ],
    },
    debts: {
      total: 14_500_000,
      items: [
        { label: 'مجاني',       value: 8_200_000 },
        { label: 'الإقتصادي',   value: 6_300_000 },
      ],
    },
  },
  minya: {
    name: 'مستشفيات جامعة المنيا',
    receivables: {
      total: 15_400_000,
      items: [
        { label: 'نفقة دولة',       value: 8_400_000 },
        { label: 'تأمين صحي',       value: 4_200_000 },
        { label: 'قوائم انتظار',     value: 2_800_000 },
      ],
    },
    debts: {
      total: 8_200_000,
      items: [
        { label: 'مجاني',      value: 5_100_000 },
        { label: 'الإقتصادي',  value: 3_100_000 },
      ],
    },
  },
  zagazig: {
    name: 'مستشفيات جامعة الزقازيق',
    receivables: {
      total: 19_200_000,
      items: [
        { label: 'نفقة دولة',       value: 10_200_000 },
        { label: 'تأمين صحي',       value: 5_600_000 },
        { label: 'قوائم انتظار',     value: 3_400_000 },
      ],
    },
    debts: {
      total: 11_300_000,
      items: [
        { label: 'مجاني',      value: 6_800_000 },
        { label: 'الإقتصادي',  value: 4_500_000 },
      ],
    },
  },
  mansoura: {
    name: 'مستشفيات جامعة المنصورة',
    receivables: {
      total: 42_000_000,
      items: [
        { label: 'نفقة دولة',        value: 22_000_000 },
        { label: 'تأمين صحي',        value: 11_500_000 },
        { label: 'قوائم انتظار',      value: 8_500_000 },
      ],
    },
    debts: {
      total: 25_100_000,
      items: [
        { label: 'مجاني',      value: 15_600_000 },
        { label: 'الإقتصادي',  value: 9_500_000 },
      ],
    },
  },
  tanta: {
    name: 'مستشفيات جامعة طنطا',
    receivables: {
      total: 17_600_000,
      items: [
        { label: 'نفقة دولة',       value: 9_200_000 },
        { label: 'تأمين صحي',       value: 5_100_000 },
        { label: 'قوائم انتظار',     value: 3_300_000 },
      ],
    },
    debts: {
      total: 9_800_000,
      items: [
        { label: 'مجاني',      value: 5_800_000 },
        { label: 'الإقتصادي',  value: 4_000_000 },
      ],
    },
  },
  ainshams: {
    name: 'مستشفيات جامعة عين شمس',
    receivables: {
      total: 58_500_000,
      items: [
        { label: 'نفقة دولة',        value: 30_000_000 },
        { label: 'تأمين صحي',        value: 17_000_000 },
        { label: 'قوائم انتظار',      value: 11_500_000 },
      ],
    },
    debts: {
      total: 31_200_000,
      items: [
        { label: 'مجاني',      value: 19_500_000 },
        { label: 'الإقتصادي',  value: 11_700_000 },
      ],
    },
  },
}

export default function DirectorFinance() {
  const { hospitalId = 'alexandria' } = useParams()
  const navigate = useNavigate()
  const hospital = HOSPITAL_DATA[hospitalId] ?? HOSPITAL_DATA.alexandria
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate,   setToDate]   = useState('31/10/2025')

  return (
    <MainLayout
      userName="مدير مستشفى"
      userSub={hospital.name}
    >
      <div dir="ltr" className="p-6 max-w-8xl mx-auto">
        <PageHeader
          title="الملخص المالي"
          subtitle={`${hospital.name} — تقرير المديونيات والمستحقات`}
          icon={DollarSign}
          leftContent={
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/periodic-report')}
                className="text-xs text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-lg transition-all font-medium"
              >
                + إدخال بيانات
              </button>
              <button
                onClick={() => navigate('/president-finance')}
                className="text-xs text-slate-500 hover:text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-all font-medium"
              >
                ← العرض الموحد
              </button>
            </div>
          }
        />

        <DateFilterBar
          fromDate={fromDate} onFromChange={setFromDate}
          toDate={toDate}     onToChange={setToDate}
          className="mb-5"
        />

        {/* Cards — in RTL first DOM child = visual RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Visual RIGHT: debts (red) */}
          <FinanceSummaryCard
            title="إجمالي المديونية"
            total={hospital.debts.total}
            items={hospital.debts.items}
            variant="red"
            icon={TrendingDown}
          />
          {/* Visual LEFT: receivables (green) */}
          <FinanceSummaryCard
            title="إجمالي المستحقات"
            total={hospital.receivables.total}
            items={hospital.receivables.items}
            variant="green"
            icon={TrendingUp}
          />
        </div>

        {/* Net balance bar */}
        <div className="mt-5 bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between shadow-sm">
          <span className="text-emerald-600 font-bold text-lg tabular-nums">
            +{(hospital.receivables.total - hospital.debts.total).toLocaleString()}
            <span className="text-xs font-semibold text-emerald-400 mr-1">EGP</span>
          </span>
          <span className="text-sm font-semibold text-slate-600">صافي المركز المالي</span>
        </div>
      </div>
    </MainLayout>
  )
}
