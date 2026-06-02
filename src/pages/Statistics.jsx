import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import DataTable from '../components/ui/DataTable'
import { BarChart3, Download, Droplet, AlertCircle, Bed, Activity, Heart, Users, TrendingUp, Radio } from 'lucide-react'

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

// Secretary form sections
const SECRETARY_FORM_SECTIONS = [
  {
    title: 'حالات الطوارئ',
    titleEn: 'Emergency Cases',
    fields: [
      { id: 'emergencyCases', label: 'حالات الطوارئ', labelEn: 'Emergency Cases', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات العلاج الطبيعي',
    titleEn: 'Dialysis Sessions',
    fields: [
      { id: 'dialysisSessions', label: 'جلسات الغسيل الكلوي', labelEn: 'Dialysis Sessions', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات العلاج الكيميائي',
    titleEn: 'Chemotherapy Sessions',
    fields: [
      { id: 'chemotherapySessions', label: 'جلسات العلاج الكيميائي', labelEn: 'Chemotherapy Sessions', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات العلاج الإشعاعي',
    titleEn: 'Radiotherapy Sessions',
    fields: [
      { id: 'radiotherapySessions', label: 'جلسات العلاج الإشعاعي', labelEn: 'Radiotherapy Sessions', placeholder: '0' },
    ]
  },
  {
    title: 'الحالات الخارجية',
    titleEn: 'Outpatient Clinic Visits',
    fields: [
      { id: 'outpatientVisits', label: 'الكشوف على العيادات الخارجية', labelEn: 'Outpatient Clinic Visits', placeholder: '0' },
    ]
  },
  {
    title: 'مرضى العناية المركزة',
    titleEn: 'ICU Patients',
    fields: [
      { id: 'icuPatients', label: 'مرضى غرف عناية مركزة', labelEn: 'ICU Patients', placeholder: '0' },
    ]
  },
  {
    title: 'العمليات الجراحية',
    titleEn: 'Surgical Operations',
    fields: [
      { id: 'surgicalOperations', label: 'العمليات الجراحية', labelEn: 'Surgical Operations', placeholder: '0' },
    ]
  },
  {
    title: 'حالات الطوارئ',
    titleEn: 'Inpatient Cases',
    fields: [
      { id: 'inpatientCases', label: 'حالات مرضى داخلي', labelEn: 'Inpatient Cases', placeholder: '0' },
    ]
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



export default function Statistics() {
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate, setToDate] = useState('30/09/2025')
  const [activeTab, setActiveTab] = useState('president') // 'president', 'secretary', or 'director'
  
  // Secretary form state
  const [formData, setFormData] = useState({})

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  // Calculate totals for President view
  const calculateTotals = () => {
    return {
      emergencyTotal: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyTotal, 0),
      emergencyDaily: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyDaily, 0),
      criticalCare: PRESIDENT_DATA.reduce((sum, row) => sum + row.criticalCare, 0),
      emergencyLabor: PRESIDENT_DATA.reduce((sum, row) => sum + row.emergencyLabor, 0),
      inpatientTotal: PRESIDENT_DATA.reduce((sum, row) => sum + row.inpatientTotal, 0),
      inpatientDaily: PRESIDENT_DATA.reduce((sum, row) => sum + row.inpatientDaily, 0),
      outpatientClinic: PRESIDENT_DATA.reduce((sum, row) => sum + row.outpatientClinic, 0),
      medicalExamination: PRESIDENT_DATA.reduce((sum, row) => sum + row.medicalExamination, 0),
    }
  }

  const totals = calculateTotals()

  const getUserInfo = () => {
    switch (activeTab) {
      case 'president':
        return { name: 'رئيس المستشفيات', sub: 'إحصائيات المستشفيات الجامعية' }
      case 'secretary':
        return { name: 'أمين عام', sub: 'إحصائيات المستشفيات الجامعية' }
      case 'director':
        return { name: 'مدير مستشفى', sub: 'مستشفيات جامعة الإسكندرية - عرض بصندوقات إدارة نقطي' }
      default:
        return { name: 'رئيس المستشفيات', sub: 'إحصائيات المستشفيات الجامعية' }
    }
  }

  const userInfo = getUserInfo()

  return (
    <MainLayout
      userName={userInfo.name}
      userSub={userInfo.sub}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-5" dir="rtl">
          <button
            onClick={() => setActiveTab('president')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'president'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            عرض الرئيس
          </button>
          <button
            onClick={() => setActiveTab('secretary')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'secretary'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            عرض الأمين العام
          </button>
          <button
            onClick={() => setActiveTab('director')}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'director'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            عرض المدير
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'director' ? (
          /* Director Dashboard View */
          <div className="space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-4 gap-4" dir="rtl">
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
                  <h3 className="font-bold text-slate-800 text-base">
                    توزيع حالات المرضى
                  </h3>
                </div>
                <div className="h-48 flex items-center justify-center">
                  <div className="w-32 h-32 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-emerald-400" strokeWidth={1} />
                  </div>
                </div>
              </div>

              {/* Chart 2: Service Trends */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-base">
                    مؤشر الخدمات الطبية
                  </h3>
                </div>
                <div className="h-48 flex items-center justify-center">
                  {/* Simple line chart visualization */}
                  <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                    <polyline
                      points="0,120 50,100 100,80 150,90 200,60 250,70 300,40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'president' ? (
          <>
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
          </>
        ) : (
          /* Secretary Form View */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8" dir="rtl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                إحصائيات النشاط المستشفى
              </h2>
              <p className="text-sm text-slate-500">
                نموذج إدخال البيانات اليومية للمستشفيات الجامعية
              </p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {SECRETARY_FORM_SECTIONS.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Section Header */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                    <h3 className="font-bold text-slate-700 text-sm">
                      {section.title}
                    </h3>
                    <p className="text-xs text-slate-400">{section.titleEn}</p>
                  </div>

                  {/* Fields */}
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-600 text-right">
                        {field.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                          #
                        </span>
                        <input
                          type="number"
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2.5 pl-8 border border-slate-200 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300
                            text-slate-700 text-sm transition-all"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center pt-6 border-t border-slate-200">
              <button className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold 
                rounded-lg transition-all shadow-sm text-sm">
                حفظ البيانات
              </button>
              <button className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-600 font-semibold 
                rounded-lg border border-slate-200 transition-all text-sm">
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
