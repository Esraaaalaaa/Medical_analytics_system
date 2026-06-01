import { Calendar } from 'lucide-react'

/**
 * DateRangePicker — from/to date range picker.
 * Values are YYYY-MM-DD strings (HTML date input format).
 * In RTL: "من تاريخ" appears on the RIGHT, "إلى تاريخ" on the LEFT.
 */
export default function DateRangePicker({ fromDate, toDate, onFromChange, onToChange, accentColor = 'sky' }) {
  const focusRing = accentColor === 'green'
    ? 'focus:ring-emerald-400 focus:border-emerald-400'
    : accentColor === 'red'
    ? 'focus:ring-red-400 focus:border-red-400'
    : 'focus:ring-sky-400 focus:border-sky-400'

  const inputCls = `w-full pl-3 py-2 pr-9 border border-slate-200 rounded-lg text-sm bg-white
    text-right text-slate-700 font-medium focus:outline-none focus:ring-2 transition-all
    cursor-pointer hover:border-slate-300 ${focusRing}`

  return (
    <div dir="rtl" className="flex items-end gap-3">
      {/* DOM first → visual RIGHT in RTL = من تاريخ (from) */}
      <div className="flex-1">
        <p className="text-xs text-slate-500 text-right mb-1.5 font-medium">من تاريخ</p>
        <div className="relative">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromChange(e.target.value)}
            className={inputCls}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* DOM second → visual LEFT in RTL = إلى تاريخ (to) */}
      <div className="flex-1">
        <p className="text-xs text-slate-500 text-right mb-1.5 font-medium">إلى تاريخ</p>
        <div className="relative">
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToChange(e.target.value)}
            className={inputCls}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
