import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import DataTable from '../components/ui/DataTable'
import { BarChart3, Download } from 'lucide-react'

// Data matching screenshot EXACTLY - row by row
const PRESIDENT_DATA = [
  { 
    num: 1, 
    hospital: 'مستشفيات جامعة الإسكندرية',
    surgicalOperations: 39687,
    inpatientCases: 104306,
    emergencyCases: 136318,
    dialysisSessions: 41232,
    radiotherapySessions: 4115,
    chemotherapySessions: 24558,
    outpatientVisits: 568339,
    icuPatients: 13788
  },
  { 
    num: 2, 
    hospital: 'مستشفيات جامعة عين شمس',
    surgicalOperations: 32360,
    inpatientCases: 29835,
    emergencyCases: 183722,
    dialysisSessions: 35923,
    radiotherapySessions: 561,
    chemotherapySessions: 3213,
    outpatientVisits: 363425,
    icuPatients: 11902
  },
  { 
    num: 3, 
    hospital: 'مستشفيات جامعة الزقازيق',
    surgicalOperations: 27117,
    inpatientCases: 65691,
    emergencyCases: 293755,
    dialysisSessions: 21144,
    radiotherapySessions: 18422,
    chemotherapySessions: 7818,
    outpatientVisits: 394564,
    icuPatients: 8408
  },
  { 
    num: 4, 
    hospital: 'مستشفيات جامعة المنصورة',
    surgicalOperations: 44325,
    inpatientCases: 127565,
    emergencyCases: 194212,
    dialysisSessions: 34200,
    radiotherapySessions: 18875,
    chemotherapySessions: 39487,
    outpatientVisits: 1069312,
    icuPatients: 10021
  },
  { 
    num: 5, 
    hospital: 'مستشفيات جامعة طنطا',
    surgicalOperations: 28709,
    inpatientCases: 62413,
    emergencyCases: 189854,
    dialysisSessions: 18749,
    radiotherapySessions: 1228,
    chemotherapySessions: 63749,
    outpatientVisits: 262825,
    icuPatients: 14814
  },
  { 
    num: 6, 
    hospital: 'مستشفيات جامعة عين شمس',
    surgicalOperations: 47492,
    inpatientCases: 65594,
    emergencyCases: 109692,
    dialysisSessions: 38741,
    radiotherapySessions: 8439,
    chemotherapySessions: 11170,
    outpatientVisits: 420620,
    icuPatients: 25252
  },
  { 
    num: 7, 
    hospital: 'مستشفيات جامعة أسيوط',
    surgicalOperations: 45277,
    inpatientCases: 94425,
    emergencyCases: 136770,
    dialysisSessions: 49171,
    radiotherapySessions: 4815,
    chemotherapySessions: 0,
    outpatientVisits: 263489,
    icuPatients: 10921
  },
  { 
    num: 8, 
    hospital: 'مستشفى أبوان الجامعي',
    surgicalOperations: 13859,
    inpatientCases: 18442,
    emergencyCases: 217204,
    dialysisSessions: 23074,
    radiotherapySessions: 0,
    chemotherapySessions: 50,
    outpatientVisits: 66500,
    icuPatients: 3220
  },
  { 
    num: 9, 
    hospital: 'مستشفيات جامعة المنوفية',
    surgicalOperations: 12826,
    inpatientCases: 10713,
    emergencyCases: 8315,
    dialysisSessions: 0,
    radiotherapySessions: 0,
    chemotherapySessions: 0,
    outpatientVisits: 48498,
    icuPatients: 2580
  },
  { 
    num: 10, 
    hospital: 'المعهد القومي للأورام',
    surgicalOperations: 3463,
    inpatientCases: 6980,
    emergencyCases: 27385,
    dialysisSessions: 0,
    radiotherapySessions: 34893,
    chemotherapySessions: 67938,
    outpatientVisits: 318539,
    icuPatients: 474
  },
]

// Columns for LTR body (leftmost visual = first in array for data rows)
const PRESIDENT_COLUMNS = [
  { key: 'num', header: 'م', className: 'text-center w-16 font-medium text-slate-700' },
  { key: 'hospital', header: 'الجامعة', className: 'text-right font-semibold text-slate-800 min-w-72' },
  { key: 'surgicalOperations', header: 'العمليات الجراحية', group: 'emergency', className: 'text-center' },
  { key: 'inpatientCases', header: 'حالات مرضى داخلي', group: 'emergency', className: 'text-center' },
  { key: 'emergencyCases', header: 'حالات الطوارئ', group: 'emergency', className: 'text-center' },
  { key: 'dialysisSessions', header: 'جلسات الغسيل الكلوي', group: 'emergency', className: 'text-center' },
  { key: 'radiotherapySessions', header: 'جلسات العلاج الإشعاعي', group: 'inpatient', className: 'text-center' },
  { key: 'chemotherapySessions', header: 'جلسات العلاج الكيميائي', group: 'inpatient', className: 'text-center' },
  { key: 'outpatientVisits', header: 'الكشوف على العيادات الخارجية', group: 'outpatient', className: 'text-center' },
  { key: 'icuPatients', header: 'مرضى غرف عناية مركزة', className: 'text-center' },
]

// Groups for RTL headers (rightmost visual = first in array)
const PRESIDENT_GROUPS = [
  { id: 'outpatient', label: 'عيادات خارجية', colorClass: 'text-slate-700', bgClass: 'bg-slate-100' },
  { id: 'inpatient', label: 'الحالات المقيمة', colorClass: 'text-blue-700', bgClass: 'bg-blue-50' },
  { id: 'emergency', label: 'حالات الطوارئ', colorClass: 'text-red-700', bgClass: 'bg-red-50' },
]

export default function PresidentStatistics() {
  const [fromDate, setFromDate] = useState('1/1/2025')
  const [toDate, setToDate] = useState('30/9/2025')

  // Calculate totals
  const totals = {
    surgicalOperations: PRESIDENT_DATA.reduce((sum, row) => sum + row.surgicalOperations, 0),
    inpatientCases: PRESIDENT_DATA.reduce((sum, row) => sum + row.inpatientCases, 0),
    emergencyCases: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyCases, 0),
    dialysisSessions: PRESIDENT_DATA.reduce((sum, row) => sum + row.dialysisSessions, 0),
    radiotherapySessions: PRESIDENT_DATA.reduce((sum, row) => sum + row.radiotherapySessions, 0),
    chemotherapySessions: PRESIDENT_DATA.reduce((sum, row) => sum + row.chemotherapySessions, 0),
    outpatientVisits: PRESIDENT_DATA.reduce((sum, row) => sum + row.outpatientVisits, 0),
    icuPatients: PRESIDENT_DATA.reduce((sum, row) => sum + row.icuPatients, 0),
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

        {/* Date Range Header Bar - matching screenshot */}
        <div className="bg-[#0d1526] text-white py-3 px-6 rounded-t-xl text-center font-bold text-base mb-0">
          الفترة من {fromDate} حتى {toDate}
        </div>

        {/* Data Table */}
        <div>
          <DataTable
            columns={PRESIDENT_COLUMNS}
            groups={PRESIDENT_GROUPS}
            data={PRESIDENT_DATA}
            noTopRadius={true}
            dir="rtl"
            bodyDir="ltr"
          />
        </div>

        {/* Totals Row */}
        <div className="bg-[#0d1526] rounded-b-xl rounded-t-none p-4 shadow-lg mt-0" dir="ltr">
          <div className="grid grid-cols-10 gap-3 text-center">
            <div className="col-span-2 text-left pl-4">
              <p className="text-white font-bold text-sm">الإجمالي</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.surgicalOperations.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.inpatientCases.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.emergencyCases.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.dialysisSessions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.radiotherapySessions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.chemotherapySessions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.outpatientVisits.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sky-400 font-bold text-base tabular-nums">{totals.icuPatients.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
