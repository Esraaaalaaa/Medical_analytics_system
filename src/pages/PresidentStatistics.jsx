import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import DataTable from '../components/ui/DataTable'
import { BarChart3, Download } from 'lucide-react'

// Sample data for President view (comprehensive statistics)
const PRESIDENT_DATA = [
  { 
    num: 1, 
    hospital: 'مستشفيات جامعة الإسكندرية',
    emergencyTotal: 39087,
    emergencyDaily: 104306,
    criticalCare: 136318,
    emergencyLabor: 41232,
    inpatientTotal: 4115,
    inpatientDaily: 24558,
    outpatientClinic: 568339,
    medicalExamination: 13788
  },
  { 
    num: 2, 
    hospital: 'مستشفيات جامعة عين شمس',
    emergencyTotal: 32360,
    emergencyDaily: 29835,
    criticalCare: 183722,
    emergencyLabor: 35923,
    inpatientTotal: 561,
    inpatientDaily: 3213,
    outpatientClinic: 303425,
    medicalExamination: 11902
  },
  { 
    num: 3, 
    hospital: 'مستشفيات جامعة الزقازيق',
    emergencyTotal: 27117,
    emergencyDaily: 65691,
    criticalCare: 293755,
    emergencyLabor: 21144,
    inpatientTotal: 18422,
    inpatientDaily: 7818,
    outpatientClinic: 194564,
    medicalExamination: 8408
  },
  { 
    num: 4, 
    hospital: 'مستشفيات جامعة المنصورة',
    emergencyTotal: 44325,
    emergencyDaily: 127565,
    criticalCare: 194212,
    emergencyLabor: 34200,
    inpatientTotal: 18875,
    inpatientDaily: 39487,
    outpatientClinic: 1069312,
    medicalExamination: 18021
  },
  { 
    num: 5, 
    hospital: 'مستشفيات جامعة طنطا',
    emergencyTotal: 28709,
    emergencyDaily: 62411,
    criticalCare: 189854,
    emergencyLabor: 18749,
    inpatientTotal: 1228,
    inpatientDaily: 63749,
    outpatientClinic: 202825,
    medicalExamination: 14814
  },
  { 
    num: 6, 
    hospital: 'مستشفيات جامعة عين شمس',
    emergencyTotal: 47492,
    emergencyDaily: 65594,
    criticalCare: 109692,
    emergencyLabor: 38741,
    inpatientTotal: 8439,
    inpatientDaily: 11170,
    outpatientClinic: 420620,
    medicalExamination: 17252
  },
  { 
    num: 7, 
    hospital: 'مستشفيات جامعة أسيوط',
    emergencyTotal: 45277,
    emergencyDaily: 94425,
    criticalCare: 136770,
    emergencyLabor: 45171,
    inpatientTotal: 4815,
    inpatientDaily: 0,
    outpatientClinic: 203489,
    medicalExamination: 10921
  },
  { 
    num: 8, 
    hospital: 'مستشفى بورفؤاد العام',
    emergencyTotal: 13859,
    emergencyDaily: 18442,
    criticalCare: 173204,
    emergencyLabor: 21042,
    inpatientTotal: 0,
    inpatientDaily: 928,
    outpatientClinic: 66500,
    medicalExamination: 9120
  },
  { 
    num: 9, 
    hospital: 'جامعة المنوفية',
    emergencyTotal: 12826,
    emergencyDaily: 18713,
    criticalCare: 8315,
    emergencyLabor: 0,
    inpatientTotal: 0,
    inpatientDaily: 0,
    outpatientClinic: 48498,
    medicalExamination: 2580
  },
  { 
    num: 10, 
    hospital: 'المعهد القومي للأورام',
    emergencyTotal: 1463,
    emergencyDaily: 6980,
    criticalCare: 27385,
    emergencyLabor: 0,
    inpatientTotal: 34893,
    inpatientDaily: 67938,
    outpatientClinic: 118539,
    medicalExamination: 474
  },
  { 
    num: 11, 
    hospital: 'معهد تيودور بلهارس',
    emergencyTotal: 1126,
    emergencyDaily: 2383,
    criticalCare: 2918,
    emergencyLabor: 702,
    inpatientTotal: 0,
    inpatientDaily: 0,
    outpatientClinic: 26495,
    medicalExamination: 390
  },
  { 
    num: 12, 
    hospital: 'مستشفى جامعة بني سويف',
    emergencyTotal: 13376,
    emergencyDaily: 25125,
    criticalCare: 107513,
    emergencyLabor: 15000,
    inpatientTotal: 0,
    inpatientDaily: 8535,
    outpatientClinic: 198448,
    medicalExamination: 7257
  },
]

// President columns
const PRESIDENT_COLUMNS = [
  { key: 'num', header: 'م', className: 'text-center w-12 font-medium text-slate-500' },
  { key: 'hospital', header: 'الجامعة', className: 'text-right font-semibold text-slate-800 min-w-64' },
  { key: 'emergencyTotal', header: 'إجمالي الطوارئ', group: 'emergency', className: 'text-center' },
  { key: 'emergencyDaily', header: 'حالات طوارئ', group: 'emergency', className: 'text-center' },
  { key: 'criticalCare', header: 'حالات الرعاية المركزة', group: 'emergency', className: 'text-center' },
  { key: 'emergencyLabor', header: 'ولادات طوارئ', group: 'emergency', className: 'text-center' },
  { key: 'inpatientTotal', header: 'جملة المقيم', group: 'inpatient', className: 'text-center' },
  { key: 'inpatientDaily', header: 'جملة اليوم المقيم', group: 'inpatient', className: 'text-center' },
  { key: 'outpatientClinic', header: 'عيادات خارجية', className: 'text-center font-semibold' },
  { key: 'medicalExamination', header: 'كشوف طبية عام', className: 'text-center font-semibold' },
]

const PRESIDENT_GROUPS = [
  { id: 'emergency', label: 'حالات الطوارئ', colorClass: 'text-red-600', bgClass: 'bg-red-50/70' },
  { id: 'inpatient', label: 'الحالات المقيمة', colorClass: 'text-blue-600', bgClass: 'bg-blue-50/70' },
]

export default function PresidentStatistics() {
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate, setToDate] = useState('30/09/2025')

  // Calculate totals
  const totals = {
    emergencyTotal: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyTotal, 0),
    emergencyDaily: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyDaily, 0),
    criticalCare: PRESIDENT_DATA.reduce((sum, row) => sum + row.criticalCare, 0),
    emergencyLabor: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyLabor, 0),
    inpatientTotal: PRESIDENT_DATA.reduce((sum, row) => sum + row.inpatientTotal, 0),
    inpatientDaily: PRESIDENT_DATA.reduce((sum, row) => sum + row.inpatientDaily, 0),
    outpatientClinic: PRESIDENT_DATA.reduce((sum, row) => sum + row.outpatientClinic, 0),
    medicalExamination: PRESIDENT_DATA.reduce((sum, row) => sum + row.medicalExamination, 0),
  }

  return (
    <MainLayout
      userName="رئيس المستشفيات"
      userSub="إحصائيات المستشفيات الجامعية"
    >
      <div dir="ltr" className="p-6 max-w-full mx-auto">
        <PageHeader
          title="إحصائيات المستشفيات الجامعية"
          subtitle="لوحة المتابعة الشاملة لجميع المستشفيات الجامعية"
          icon={BarChart3}
          leftContent={
            <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm">
              <Download className="w-4 h-4" />
            </button>
          }
        />

        <DateFilterBar
          fromDate={fromDate}
          onFromChange={setFromDate}
          toDate={toDate}
          onToChange={setToDate}
          className="mb-5"
        />

        {/* Data Table */}
        <div className="mb-4">
          <DataTable
            columns={PRESIDENT_COLUMNS}
            groups={PRESIDENT_GROUPS}
            data={PRESIDENT_DATA}
          />
        </div>

        {/* Totals Row */}
        <div className="bg-[#0d1526] rounded-xl p-4 shadow-lg" dir="rtl">
          <div className="grid grid-cols-10 gap-3 text-center">
            <div className="col-span-2">
              <p className="text-white font-bold text-sm mb-1">الإجمالي</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.emergencyTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.emergencyDaily.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.criticalCare.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.emergencyLabor.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.inpatientTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.inpatientDaily.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.outpatientClinic.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-lg tabular-nums">{totals.medicalExamination.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
