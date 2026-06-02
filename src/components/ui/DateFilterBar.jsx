import { Calendar, Printer } from 'lucide-react'

/**
 * DateFilterBar — interactive from/to date range filter bar.
 * All dates in "DD/MM/YYYY" display format.
 */

const displayToInput = (d = '') => {
  const p = d.split('/')
  return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : ''
}

const inputToDisplay = (d = '') => {
  const p = d.split('-')
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : ''
}

function DatePill({ label, date, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium shrink-0">{label}</span>
      <div className="relative group cursor-pointer">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg
          group-hover:border-sky-400 group-hover:bg-sky-50 transition-all duration-150 select-none">
          <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 transition-colors shrink-0" />
          <span className="text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors tabular-nums whitespace-nowrap">
            {date}
          </span>
        </div>
        {/* Invisible overlay opens native date picker */}
        <input
          type="date"
          value={displayToInput(date)}
          onChange={(e) => e.target.value && onChange(inputToDisplay(e.target.value))}
          className="absolute inset-0 opacity-0 w-full cursor-pointer"
        />
      </div>
    </div>
  )
}

export default function DateFilterBar({
  fromDate = '01/01/2025',
  toDate   = '31/10/2025',
  onFromChange,
  onToChange,
  onPrint,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-3 shadow-sm ${className}`}>

      {/* Visual LEFT — print */}
      <button
        onClick={onPrint}
        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
        title="طباعة"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* Visual RIGHT — date range (RTL: first DOM = rightmost) */}
      <div  dir="rtl" className="flex items-center gap-2">
        {/* من تاريخ — rightmost in RTL */}
        <DatePill label="من" date={fromDate} onChange={onFromChange ?? (() => {})} />

        <span className="text-slate-300 text-lg leading-none select-none">←</span>

        {/* إلى تاريخ — slightly to the left */}
        <DatePill label="إلى" date={toDate} onChange={onToChange ?? (() => {})} />
      </div>

    </div>
  )
}
