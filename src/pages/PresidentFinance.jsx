import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, TrendingUp, TrendingDown, Activity, Download } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import DataTable from '../components/ui/DataTable'
import DateFilterBar from '../components/ui/DateFilterBar'

const TABLE_DATA = [
  { id: 'alexandria', num: 1, university: 'مستشفيات جامعة الإسكندرية', freeDebt: '—', econDebt: '—', totalDebt: '14,500,000', stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '22,850,000' },
  { id: 'minya',      num: 2, university: 'مستشفيات جامعة المنيا',       freeDebt: '—', econDebt: '—', totalDebt: '8,200,000',  stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '15,400,000' },
  { id: 'zagazig',   num: 3, university: 'مستشفيات جامعة الزقازيق',     freeDebt: '—', econDebt: '—', totalDebt: '11,300,000', stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '19,200,000' },
  { id: 'mansoura',  num: 4, university: 'مستشفيات جامعة المنصورة',     freeDebt: '—', econDebt: '—', totalDebt: '25,100,000', stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '42,000,000' },
  { id: 'tanta',     num: 5, university: 'مستشفيات جامعة طنطا',         freeDebt: '—', econDebt: '—', totalDebt: '9,800,000',  stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '17,600,000' },
  { id: 'ainshams',  num: 6, university: 'مستشفيات جامعة عين شمس',      freeDebt: '—', econDebt: '—', totalDebt: '31,200,000', stateExp: '—', healthIns: '—', waitList: '—', comp: '—', totalRecv: '58,500,000' },
]

// In RTL: first DOM column = rightmost visual column
const COLUMNS = [
  { key: 'num',       header: 'م',             className: 'text-center w-10 font-medium text-slate-500' },
  { key: 'university',header: 'الجامعة',        className: 'text-right font-semibold text-slate-800 min-w-52' },
  { key: 'freeDebt',  header: 'المجاني',        group: 'debt', className: 'text-center' },
  { key: 'econDebt',  header: 'الاقتصادي',      group: 'debt', className: 'text-center' },
  { key: 'totalDebt', header: 'الإجمالي',       group: 'debt', className: 'text-center', highlight: true },
  { key: 'stateExp',  header: 'نفقة دولة',      group: 'recv', className: 'text-center' },
  { key: 'healthIns', header: 'تأمين صحي',      group: 'recv', className: 'text-center' },
  { key: 'waitList',  header: 'قوائم انتظار',   group: 'recv', className: 'text-center' },
  { key: 'comp',      header: 'شامل',           group: 'recv', className: 'text-center' },
  { key: 'totalRecv', header: 'الإجمالي',       group: 'recv', className: 'text-center', highlight: true },
]

// In RTL: first DOM group = rightmost visual group
const GROUPS = [
  { id: 'debt', label: 'إجمالي المديونية',  colorClass: 'text-red-600',     bgClass: 'bg-red-50/70' },
  { id: 'recv', label: 'إجمالي المستحقات', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50/70' },
]

export default function PresidentFinance() {
  const navigate = useNavigate()
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate,   setToDate]   = useState('31/10/2025')

  const handleRowClick = (row) => {
    navigate(`/director-finance/${row.id}`)
  }

  return (
    <MainLayout
      userName="رئيس المستشفيات"
      userSub="المجلس الأعلى للمستشفيات الجامعية"
    >
      <div dir="ltr" className="p-6 mx-auto max-w-8xl">
        <PageHeader
          title="الملخص المالي المجمع"
          subtitle="لوحة التحكم المالية الشاملة لجميع المستشفيات الجامعية"
          icon={Clock}
          leftContent={
            <div className="flex gap-2">
              <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          }
        />

        <DateFilterBar
          fromDate={fromDate} onFromChange={setFromDate}
          toDate={toDate}     onToChange={setToDate}
          className="mb-6"
        />

        {/* KPI Cards — in RTL: first DOM = visual RIGHT */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Visual RIGHT: net balance (dark) */}
          <StatCard
            value="+75,450,000"
            label="صافي المركز المالي"
            icon={Activity}
            variant="dark"
          />
          {/* Visual CENTER: total receivables (green) */}
          <StatCard
            value="175,550,000"
            label="إجمالي المستحقات"
            icon={TrendingUp}
            variant="green"
          />
          {/* Visual LEFT: total debts (red) */}
          <StatCard
            value="100,100,000"
            label="إجمالي مديونيات الشراء الموحد"
            icon={TrendingDown}
            variant="red"
          />
        </div>

        {/* Table */}
        <div dir="rtl">
          <p className="text-xs text-slate-400 text-right mb-2">
            اضغط على أي صف لعرض التفاصيل
          </p>
          <DataTable
            columns={COLUMNS}
            groups={GROUPS}
            data={TABLE_DATA}
            onRowClick={handleRowClick}
            rtl
          />
        </div>
      </div>
    </MainLayout>
  )
}
