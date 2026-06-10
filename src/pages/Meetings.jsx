import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  Users,
  CalendarPlus,
  Calendar,
  Clock,
  Monitor,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  Plus,
} from 'lucide-react'

const INITIAL_MEETINGS = [
  {
    id: 1,
    title: 'اجتماع متابعة مؤشرات الأداء بالمستشفيات الجامعية',
    type: 'حضوري',
    status: 'upcoming',
    isOnline: false,
    day: 11,
    month: 5,
    year: 2026,
    date: 'الخميس، 11 يونيو 2026',
    time: '10:00 صباحاً - ساعة واحدة',
    location: 'قاعة الاجتماعات الرئيسية - المجلس',
  },
  {
    id: 2,
    title: 'مناقشة موازنة الربع الحالي وتحديثات الشراء الموحد',
    type: 'أونلاين',
    status: 'upcoming',
    isOnline: true,
    day: 14,
    month: 5,
    year: 2026,
    date: 'الأحد، 14 يونيو 2026',
    time: '02:00 مساءً - ساعة ونصف',
    location: 'اجتماع عبر الفيديو كونفرانس',
  },
  {
    id: 3,
    title: 'تنسيق جاهزية أقسام الطوارئ والرعاية المركزة',
    type: 'حضوري',
    status: 'upcoming',
    isOnline: false,
    day: 18,
    month: 5,
    year: 2026,
    date: 'الخميس، 18 يونيو 2026',
    time: '09:30 صباحاً - ساعة واحدة',
    location: 'مقر المجلس الأعلى للمستشفيات',
  },
  {
    id: 4,
    title: 'مراجعة تقرير شهر مايو',
    type: 'أونلاين',
    status: 'past',
    isOnline: true,
    day: 3,
    month: 5,
    year: 2026,
    date: 'الأربعاء، 3 يونيو 2026',
    time: '01:00 مساءً - 30 دقيقة',
    location: 'اجتماع عبر الفيديو كونفرانس',
  },
]

const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

const DAYS_AR = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج']

const DAY_NAMES = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

const TIME_SLOTS = [
  '09:00 صباحاً',
  '09:30 صباحاً',
  '10:00 صباحاً',
  '10:30 صباحاً',
  '11:00 صباحاً',
  '11:30 صباحاً',
  '12:00 ظهراً',
  '12:30 ظهراً',
  '01:00 مساءً',
  '01:30 مساءً',
  '02:00 مساءً',
  '02:30 مساءً',
  '03:00 مساءً',
  '03:30 مساءً',
]

const DURATION_OPTIONS = [
  { label: '30 دقيقة', minutes: 30 },
  { label: 'ساعة واحدة', minutes: 60 },
  { label: 'ساعة ونصف', minutes: 90 },
  { label: 'ساعتان', minutes: 120 },
]

function getDayName(day, month, year) {
  return DAY_NAMES[new Date(year, month, day).getDay()]
}

function getDaysForMonth(month, year) {
  const count = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: count }, (_, i) => i + 1)
}

function formatArabicDate(day, month, year) {
  return `${getDayName(day, month, year)}، ${day} ${MONTHS_AR[month]} ${year}`
}

function formatMeetingTime(startTime, durationLabel) {
  return `${startTime} - ${durationLabel}`
}

function CalendarWidget({
  meetings,
  month,
  year,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  const meetingDays = meetings
    .filter((meeting) => meeting.month === month && meeting.year === year)
    .map((meeting) => meeting.day)

  const firstDay = new Date(year, month, 1).getDay()
  const offset = (firstDay + 1) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const today = new Date()
  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()

  const hasMeeting = (day) => meetingDays.includes(day)

  return (
    <div dir="rtl" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-xl p-2 transition-colors hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>

        <span className="text-sm font-black text-slate-700">
          {MONTHS_AR[month]} {year}
        </span>

        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-xl p-2 transition-colors hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {DAYS_AR.map((day) => (
          <div key={day} className="py-1 text-center text-xs font-black text-slate-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const active = day && selectedDay === day

          return (
            <div key={`${day}-${i}`} className="flex h-9 items-center justify-center">
              {day && (
                <button
                  type="button"
                  onClick={() => onSelectDay(active ? null : day)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-sky-600 text-white'
                      : isToday(day)
                        ? 'bg-slate-950 text-white'
                        : hasMeeting(day)
                          ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                          : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {day}
                  {hasMeeting(day) && !active && !isToday(day) && (
                    <span className="absolute bottom-1 left-1/2 h-[2px] w-3 -translate-x-1/2 rounded-full bg-red-400" />
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FILTER_OPTS = [
  { id: 'all', label: 'الكل' },
  { id: 'presence', label: 'اجتماعات حضورية' },
  { id: 'online', label: 'اجتماعات افتراضية' },
  { id: 'past', label: 'الاجتماعات السابقة' },
]

function FilterSection({ active, onChange }) {
  return (
    <div dir="rtl" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-right text-sm font-black text-slate-700">
        تصنيف الاجتماعات
      </h4>

      <div className="flex flex-col gap-2">
        {FILTER_OPTS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
              active === opt.id
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                active === opt.id ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function MeetingCard({ meeting }) {
  const [rsvp, setRsvp] = useState(null)
  const LocationIcon = meeting.isOnline ? Monitor : MapPin
  const accentColor = meeting.isOnline ? 'bg-sky-400' : 'bg-amber-400'

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex">
        <div className="flex-1 p-5">
          <div className="mb-3 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="mb-3 text-right text-base font-black leading-snug text-slate-900">
                {meeting.title}
              </h3>

              <div className="flex flex-col gap-2 text-sm font-medium text-slate-500">
                <div className="flex items-center justify-start gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{meeting.date}</span>
                </div>

                <div className="flex items-center justify-start gap-1.5">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{meeting.time}</span>
                </div>

                <div className="flex items-center justify-start gap-1.5">
                  <LocationIcon className="h-4 w-4 shrink-0" />
                  <span>{meeting.location}</span>
                </div>

                {meeting.agenda && (
                  <p className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-right text-xs leading-6 text-slate-500">
                    {meeting.agenda}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 pt-0.5">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${
                  meeting.isOnline
                    ? 'border-sky-200 bg-sky-50 text-sky-600'
                    : 'border-amber-200 bg-amber-50 text-amber-600'
                }`}
              >
                {meeting.type}
              </span>
            </div>
          </div>

          {meeting.status === 'past' ? (
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500">
                اجتماع سابق
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setRsvp((v) => (v === 'confirmed' ? null : 'confirmed'))}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  rsvp === 'confirmed'
                    ? 'border-green-200 bg-green-50 text-green-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>تأكيد الحضور</span>
                {rsvp === 'confirmed' ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setRsvp((v) => (v === 'declined' ? null : 'declined'))}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                  rsvp === 'declined'
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                الاعتذار
              </button>
            </div>
          )}
        </div>

        <div className={`w-1 shrink-0 ${accentColor}`} />
      </div>
    </div>
  )
}

function MeetingRequestModal({
  open,
  onClose,
  onCreate,
  currentMonth,
  currentYear,
  selectedDay,
}) {
  const defaultDay = selectedDay || 11

  const [form, setForm] = useState({
    title: '',
    type: 'حضوري',
    day: defaultDay,
    startTime: '10:00 صباحاً',
    duration: 60,
    location: '',
    agenda: '',
  })

  if (!open) return null

  const days = getDaysForMonth(currentMonth, currentYear)
  const selectedDuration = DURATION_OPTIONS.find(
    (option) => option.minutes === Number(form.duration),
  )

  const isOnline = form.type === 'أونلاين'
  const canSubmit = form.title.trim() && form.day

  const resetForm = () => {
    setForm({
      title: '',
      type: 'حضوري',
      day: defaultDay,
      startTime: '10:00 صباحاً',
      duration: 60,
      location: '',
      agenda: '',
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) return

    const day = Number(form.day)

    onCreate({
      id: Date.now(),
      title: form.title.trim(),
      type: form.type,
      status: 'upcoming',
      isOnline,
      day,
      month: currentMonth,
      year: currentYear,
      date: formatArabicDate(day, currentMonth, currentYear),
      time: formatMeetingTime(form.startTime, selectedDuration?.label || 'ساعة واحدة'),
      location: isOnline
        ? 'اجتماع عبر الفيديو كونفرانس'
        : form.location || 'يتم تحديد المكان لاحقاً',
      agenda: form.agenda,
    })

    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div dir="rtl" className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-right">
            <h3 className="text-lg font-black text-slate-900">طلب جدولة اجتماع</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              حدد بيانات الاجتماع وسيتم إضافته إلى جدول شهر {MONTHS_AR[currentMonth]} {currentYear}.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              عنوان الاجتماع
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="مثال: اجتماع متابعة مؤشرات الأداء"
              dir="rtl"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              نوع الاجتماع
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {['حضوري', 'أونلاين'].map((type) => {
                const active = form.type === type
                const Icon = type === 'أونلاين' ? Monitor : MapPin

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type }))}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-right transition-all ${
                      active
                        ? 'border-sky-300 bg-sky-50 text-sky-700 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-black">{type}</span>
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {getDayName(Number(form.day), currentMonth, currentYear)}
              </span>
              <label className="text-sm font-bold text-slate-700">
                يوم الاجتماع
              </label>
            </div>

            <div className="grid max-h-36 grid-cols-7 gap-2 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">
              {days.map((day) => {
                const active = Number(form.day) === day

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, day }))}
                    className={`rounded-xl py-2 text-sm font-black transition-all ${
                      active
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                وقت البداية
              </label>
              <select
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                مدة الاجتماع
              </label>
              <select
                value={form.duration}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, duration: Number(e.target.value) }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.minutes} value={option.minutes}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isOnline && (
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                مكان الاجتماع
              </label>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="مثال: قاعة الاجتماعات الرئيسية"
                dir="rtl"
              />
            </div>
          )}

          {isOnline && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-right text-sm font-bold text-sky-700">
              سيتم إنشاء الاجتماع كاجتماع افتراضي عبر الفيديو كونفرانس.
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              ملاحظات أو أجندة الاجتماع
            </label>
            <textarea
              value={form.agenda}
              onChange={(e) => setForm((prev) => ({ ...prev, agenda: e.target.value }))}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="مثال: مراجعة مؤشرات الأداء، مناقشة الاحتياجات، تحديد القرارات المطلوبة..."
              dir="rtl"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs font-bold text-slate-400">ملخص الاجتماع</p>
            <p className="mt-1 text-sm font-black text-slate-700">
              {form.title || 'عنوان الاجتماع'} — {getDayName(Number(form.day), currentMonth, currentYear)} {form.day} {MONTHS_AR[currentMonth]}، {form.startTime} لمدة {selectedDuration?.label}
            </p>
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
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span>إضافة الاجتماع</span>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Meetings() {
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState(null)
  const [month, setMonth] = useState(5)
  const [year, setYear] = useState(2026)
  const [modalOpen, setModalOpen] = useState(false)

  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const sameMonth = meeting.month === month && meeting.year === year
      const sameDay = selectedDay ? meeting.day === selectedDay : true

      if (!sameMonth || !sameDay) return false

      if (activeFilter === 'presence') return !meeting.isOnline && meeting.status !== 'past'
      if (activeFilter === 'online') return meeting.isOnline && meeting.status !== 'past'
      if (activeFilter === 'past') return meeting.status === 'past'

      return true
    })
  }, [activeFilter, meetings, month, selectedDay, year])

  const handlePrevMonth = () => {
    setSelectedDay(null)
    if (month === 0) {
      setMonth(11)
      setYear((prev) => prev - 1)
      return
    }
    setMonth((prev) => prev - 1)
  }

  const handleNextMonth = () => {
    setSelectedDay(null)
    if (month === 11) {
      setMonth(0)
      setYear((prev) => prev + 1)
      return
    }
    setMonth((prev) => prev + 1)
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="جدول الاجتماعات"
            subtitle="متابعة وتنسيق الاجتماعات الدورية والطارئة"
            icon={Users}
            leftContent={
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <span>طلب جدولة اجتماع</span>
                <CalendarPlus className="h-4 w-4 shrink-0" />
              </button>
            }
          />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[18rem_1fr]">
            <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <CalendarWidget
                meetings={meetings}
                month={month}
                year={year}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <FilterSection active={activeFilter} onChange={setActiveFilter} />
            </aside>

            <div className="flex flex-col gap-4">
              {selectedDay && (
                <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-right text-sm font-bold text-sky-700">
                  عرض اجتماعات يوم {selectedDay} {MONTHS_AR[month]} {year}
                </div>
              )}

              {filteredMeetings.map((meeting, idx) => (
                <div key={meeting.id}>
                  {idx === 1 && (
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-px flex-1 bg-slate-200" />
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
                    </div>
                  )}

                  <MeetingCard meeting={meeting} />
                </div>
              ))}

              {filteredMeetings.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
                  لا توجد اجتماعات مطابقة للتصفية الحالية
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MeetingRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(meeting) => setMeetings((prev) => [meeting, ...prev])}
        currentMonth={month}
        currentYear={year}
        selectedDay={selectedDay}
      />
    </MainLayout>
  )
}