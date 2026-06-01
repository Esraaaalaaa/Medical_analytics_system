import { Star, ArrowUpRight } from 'lucide-react'

/**
 * FinanceSummaryCard — shows a financial total with a breakdown list.
 * variants: 'green' (receivables) | 'red' (debts)
 * items: [{ label, value, special? }]
 */
export default function FinanceSummaryCard({ title, total, currency = 'EGP', items = [], variant = 'green', icon: Icon }) {
  const styles = {
    green: {
      headerBg:    'bg-gradient-to-l from-emerald-50 to-white',
      headerBorder:'border-emerald-100',
      titleColor:  'text-emerald-700',
      totalColor:  'text-emerald-600',
      currColor:   'text-emerald-400',
      iconBg:      'bg-emerald-100/80',
      iconFg:      'text-emerald-600',
      accentBar:   'bg-emerald-400',
      dot:         'bg-emerald-400',
    },
    red: {
      headerBg:    'bg-gradient-to-l from-red-50 to-white',
      headerBorder:'border-red-100',
      titleColor:  'text-red-700',
      totalColor:  'text-red-600',
      currColor:   'text-red-300',
      iconBg:      'bg-red-100/80',
      iconFg:      'text-red-600',
      accentBar:   'bg-red-400',
      dot:         'bg-red-400',
    },
  }

  const s = styles[variant]

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${s.headerBorder} overflow-hidden`}>
      {/* Header */}
      <div className={`${s.headerBg} border-b ${s.headerBorder} px-5 py-4 flex items-center justify-between`}>
        {/* Left side (in RTL = visual left): total + currency */}
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
              <Icon className={`w-4.5 h-4.5 ${s.iconFg}`} strokeWidth={2} />
            </div>
          )}
          <div>
            <p className={`text-xl font-bold leading-none ${s.totalColor}`}>
              {total.toLocaleString()}
            </p>
            <p className={`text-xs font-semibold mt-0.5 ${s.currColor}`}>{currency}</p>
          </div>
        </div>

        {/* Right side (in RTL = visual right): title */}
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold ${s.titleColor}`}>{title}</span>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.iconBg}`}>
            <ArrowUpRight className={`w-4 h-4 ${s.iconFg}`} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Items list */}
      <ul className="divide-y divide-slate-50">
        {items.map((item, i) => (
          <li
            key={i}
            className={`flex items-center justify-between px-5 py-3.5 transition-colors ${
              item.special
                ? 'bg-red-50/60 hover:bg-red-50'
                : 'hover:bg-slate-50/80'
            }`}
          >
            {/* Left: value */}
            <span className={`text-sm font-semibold tabular-nums ${item.special ? 'text-red-600' : 'text-slate-800'}`}>
              {item.value.toLocaleString()}
            </span>
            {/* Right: label + star */}
            <div className="flex items-center gap-1.5">
              <span className={`text-sm ${item.special ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                {item.label}
              </span>
              {item.special && (
                <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Footer accent */}
      <div className={`h-1 w-full ${s.accentBar} opacity-40`} />
    </div>
  )
}
