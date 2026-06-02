import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import DateFilterBar from '../components/ui/DateFilterBar'
import { BarChart3 } from 'lucide-react'

// Secretary form sections matching the table columns
const SECRETARY_FORM_SECTIONS = [
  {
    title: 'العمليات الجراحية',
    titleEn: 'Surgical Operations',
    fields: [
      { id: 'surgicalOperations', label: 'العمليات الجراحية', placeholder: '0' },
    ]
  },
  {
    title: 'حالات مرضى داخلي',
    titleEn: 'Inpatient Cases',
    fields: [
      { id: 'inpatientCases', label: 'حالات مرضى داخلي', placeholder: '0' },
    ]
  },
  {
    title: 'حالات الطوارئ',
    titleEn: 'Emergency Cases',
    fields: [
      { id: 'emergencyCases', label: 'حالات الطوارئ', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات الغسيل الكلوي',
    titleEn: 'Dialysis Sessions',
    fields: [
      { id: 'dialysisSessions', label: 'جلسات الغسيل الكلوي', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات العلاج الإشعاعي',
    titleEn: 'Radiotherapy Sessions',
    fields: [
      { id: 'radiotherapySessions', label: 'جلسات العلاج الإشعاعي', placeholder: '0' },
    ]
  },
  {
    title: 'جلسات العلاج الكيميائي',
    titleEn: 'Chemotherapy Sessions',
    fields: [
      { id: 'chemotherapySessions', label: 'جلسات العلاج الكيميائي', placeholder: '0' },
    ]
  },
  {
    title: 'الكشوف على العيادات الخارجية',
    titleEn: 'Outpatient Clinic Visits',
    fields: [
      { id: 'outpatientVisits', label: 'الكشوف على العيادات الخارجية', placeholder: '0' },
    ]
  },
  {
    title: 'مرضى غرف عناية مركزة',
    titleEn: 'ICU Patients',
    fields: [
      { id: 'icuPatients', label: 'مرضى غرف عناية مركزة', placeholder: '0' },
    ]
  },
]

export default function Statistics() {
  const [fromDate, setFromDate] = useState('01/01/2025')
  const [toDate, setToDate] = useState('30/09/2025')
  const [formData, setFormData] = useState({})

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  return (
    <MainLayout
      userName="سكرتير"
      userSub="إحصائيات النشاط المستشفى"
    >
      <div dir="ltr" className="p-6 max-w-full mx-auto">
        <PageHeader
          title="إحصائيات النشاط المستشفى"
          subtitle="نموذج إدخال البيانات اليومية للمستشفيات الجامعية"
          icon={BarChart3}
        />

        <DateFilterBar
          fromDate={fromDate}
          onFromChange={setFromDate}
          toDate={toDate}
          onToChange={setToDate}
          className="mb-5"
        />

        {/* Secretary Form View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8" dir="rtl">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              مؤشرات الأداء الطبي
            </h2>
            <p className="text-sm text-slate-500">
              نموذج إدخال البيانات اليومية للمستشفيات الجامعية
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {SECRETARY_FORM_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-3">
                {/* Fields */}
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 text-right">
                      {field.label}
                    </label>
                    <p className="text-xs text-slate-400 text-right">{section.titleEn}</p>
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
      </div>
    </MainLayout>
  )
}
