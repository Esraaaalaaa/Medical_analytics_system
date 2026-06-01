import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import {
  Users, CalendarPlus, Calendar, Clock, Monitor, MapPin,
  ChevronLeft, ChevronRight, CheckSquare, Square,
} from 'lucide-react'

/* ── Data ── */
const MEETINGS = [
  {
    id: 1,
    title: 'اجتماع المجلس الأعلى للمستشفيات الجامعية',
    type: 'حضوري',
    isOnline: false,
    day: 15,
    date: 'الخميس، 15 نوفمبر 2025',
    time: 'صباحاً 10:00 - 01:00 مساءً',
    location: 'قاعة الاجتماعات الرئيسية - الوزارة',
  },
  {
    id: 2,
    title: 'مناقشة موازنة الربع الرابع وتحديثات الشراء الموحد',
    type: 'أونلاين',
    isOnline: true,
    day: 18,
    date: 'الأحد، 18 نوفمبر 2025',
    time: 'مساءً 02:00 - 12:00 مساءً',
    location: 'عبر تقنية الفيديو كونفرانس (Zoom)',
  },
  {
    id: 3,
    title: 'تنسيق القوافل الطبية للمحافظات الحدودية',
    type: 'حضوري',
    isOnline: false,
    day: 20,
    date: 'الثلاثاء، 20 نوفمبر 2025',
    time: 'صباحاً 09:00 - 11:00 صباحاً',
    location: 'مقر المجلس الأعلى للمستشفيات',
  },
]

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
const DAYS_AR   = ['ح','ت','ث','ر','غ','ع','س'] // Saturday-first (RTL: Sat on right)
const TODAY     = 12   // simulated today in November 2025

/* ── Calendar widget ── */
function CalendarWidget() {
  const [month, setMonth] = useState(10) // 0-indexed → November
  const [year,  setYear]  = useState(2025)

  const meetingDays = MEETINGS.map(m => m.day)

  // Saturday-first offset: JS getDay() → 0=Sun..6=Sat  →  offset = (day - 6 + 7) % 7
  const firstDay    = new Date(year, month, 1).getDay()
  const offset      = (firstDay - 6 + 7) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells       = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const prevMonth = () => month === 0  ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const nextMonth = () => month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1)

  const isToday   = (d) => d === TODAY  && month === 10 && year === 2025
  const hasMeeting = (d) => meetingDays.includes(d) && month === 10 && year === 2025

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      {/* Month navigation — LTR so arrows stay left/right naturally */}
      <div className="flex items-center justify-between mb-3" dir="ltr">
        <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-slate-500" />
        </button>
        <span className="text-[13.5px] font-bold text-slate-700">{MONTHS_AR[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Day headers — grid inherits RTL so ح (Sat) is rightmost */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_AR.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-8">
            {day && (
              <button className={`relative w-7 h-7 flex items-center justify-center rounded-full
                text-[12px] font-medium transition-all duration-150 ${
                  isToday(day)
                    ? 'bg-[#0d1526] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {day}
                {hasMeeting(day) && !isToday(day) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-red-400 rounded-full" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Filter section ── */
const FILTER_OPTS = [
  { id: 'all',      label: 'الكل' },
  { id: 'presence', label: 'اجتماعات حضورية' },
  { id: 'online',   label: 'اجتماعات افتراضية' },
  { id: 'past',     label: 'الاجتماعات السابقة' },
]

function FilterSection({ active, onToggle }) {
  return (
    <div dir="rtl" className="bg-white rounded-2xl border border-slate-200 p-4">
      <h4 className="text-[13.5px] font-bold text-slate-700 mb-3 text-right">تصنيف الاجتماعات</h4>
      <div className="flex flex-col gap-2.5">
        {FILTER_OPTS.map(opt => (
          <label key={opt.id} className="flex items-center justify-end gap-2.5 cursor-pointer group">
            <span className="text-[13px] text-slate-600 group-hover:text-slate-800 transition-colors select-none">
              {opt.label}
            </span>
            <input
              type="checkbox"
              checked={active.includes(opt.id)}
              onChange={() => onToggle(opt.id)}
              className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

/* ── Meeting card ── */
function MeetingCard({ meeting }) {
  const [rsvp, setRsvp] = useState(null) // 'confirmed' | 'declined' | null
  const LocationIcon = meeting.isOnline ? Monitor : MapPin
  const accentColor  = meeting.isOnline ? 'bg-sky-400' : 'bg-amber-400'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex">
        {/* Colored accent bar on the left edge (RTL "end") */}
        <div className={`w-1 shrink-0 ${accentColor}`} />

        <div className="flex-1 p-5">
          {/* Title + badge row — badge on left (end) in RTL */}
          <div className="flex gap-4 mb-3">
            {/* Details — first child → RIGHT in RTL */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-800 font-bold text-[15px] leading-snug text-right mb-2.5">
                {meeting.title}
              </h3>
              <div className="flex flex-col gap-1.5 text-slate-500 text-[12.5px]">
                <div className="flex items-center justify-end gap-1.5">
                  <span>{meeting.date}</span>
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{meeting.time}</span>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{meeting.location}</span>
                  <LocationIcon className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            </div>

            {/* Badge — second child → LEFT in RTL */}
            <div className="shrink-0 pt-0.5">
              <span className={`text-[11.5px] font-bold px-2.5 py-1 rounded-full ${
                meeting.isOnline
                  ? 'bg-sky-50 text-sky-600 border border-sky-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {meeting.type}
              </span>
            </div>
          </div>

          {/* Action buttons — justify-end in RTL pushes group to visual LEFT */}
          <div className="flex gap-2 pt-3 border-t border-slate-100 justify-end">
            {/* First in RTL flex = rightmost in group */}
            <button
              onClick={() => setRsvp(v => v === 'confirmed' ? null : 'confirmed')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12.5px] font-medium
                border transition-all duration-150 ${
                rsvp === 'confirmed'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>تأكيد الحضور</span>
              {rsvp === 'confirmed'
                ? <CheckSquare className="w-3.5 h-3.5" />
                : <Square className="w-3.5 h-3.5" />
              }
            </button>
            {/* Second in RTL flex = leftmost in group */}
            <button
              onClick={() => setRsvp(v => v === 'declined' ? null : 'declined')}
              className={`px-4 py-1.5 rounded-lg text-[12.5px] font-medium border transition-all duration-150 ${
                rsvp === 'declined'
                  ? 'bg-red-50 text-red-500 border-red-200'
                  : 'text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              الاعتذار
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function Meetings() {
  const [activeFilters, setActiveFilters] = useState(['all', 'presence', 'online'])

  const toggleFilter = (id) =>
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  return (
    <MainLayout>
      <div dir="ltr" className="p-6">
        <PageHeader
          title="جدول الاجتماعات"
          subtitle="متابعة وتنسيق الاجتماعات الدورية والطارئة لقيادات المستشفيات الجامعية"
          icon={Users}
          leftContent={
            <button className="flex items-center gap-2 bg-[#0d1526] hover:bg-slate-700 text-white
              px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 shadow-sm">
              <CalendarPlus className="w-4 h-4 shrink-0" />
              <span>طلب جدولة اجتماع</span>
            </button>
          }
        />

        {/* Two-column layout — dir="ltr" wrapper: first child → left, second child → right */}
        <div className="flex gap-5 items-start">

          {/* LEFT column: meeting list */}
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-11rem)]">
            {MEETINGS.map((meeting, idx) => (
              <div key={meeting.id}>
                {/* "Today" divider between first and second upcoming meetings */}
                {idx === 1 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                )}
                <MeetingCard meeting={meeting} />
              </div>
            ))}
          </div>

          {/* RIGHT column: calendar + filter */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <CalendarWidget />
            <FilterSection active={activeFilters} onToggle={toggleFilter} />
          </div>

        </div>
      </div>
    </MainLayout>
  )
}
