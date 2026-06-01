/**
 * StatCard — large KPI card for summary numbers.
 * variants: 'dark' | 'green' | 'red'
 */
export default function StatCard({ value, label, currency = 'EGP', icon: Icon, variant = 'green' }) {
  const styles = {
    dark: {
      wrapper: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
      iconBg:  'bg-white/10',
      iconFg:  'text-white',
      value:   'text-white',
      curr:    'text-white/50',
      label:   'text-white/65',
      glow:    'bg-white/5',
    },
    green: {
      wrapper: 'bg-white border-emerald-100',
      iconBg:  'bg-emerald-50',
      iconFg:  'text-emerald-600',
      value:   'text-emerald-600',
      curr:    'text-emerald-400',
      label:   'text-slate-600',
      glow:    'bg-emerald-50',
    },
    red: {
      wrapper: 'bg-white border-red-100',
      iconBg:  'bg-red-50',
      iconFg:  'text-red-600',
      value:   'text-red-600',
      curr:    'text-red-300',
      label:   'text-slate-600',
      glow:    'bg-red-50',
    },
  }

  const s = styles[variant]

  return (
    <div className={`relative rounded-2xl border px-5 py-4 flex items-center gap-4 overflow-hidden shadow-sm ${s.wrapper}`}>
      {/* decorative circle */}
      <div className={`absolute -bottom-5 -left-5 w-20 h-20 rounded-full ${s.glow} pointer-events-none`} />

      {/* icon — appears on the LEFT visually (last in RTL flex) */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
        {Icon && <Icon className={`w-6 h-6 ${s.iconFg}`} strokeWidth={1.8} />}
      </div>

      {/* text — appears on the RIGHT visually (first in RTL flex) */}
      <div className="flex-1 text-right min-w-0">
        <p className={`text-2xl font-bold tracking-tight leading-none ${s.value}`}>{value}</p>
        <p className={`text-xs font-semibold mt-1 ${s.curr}`}>{currency}</p>
        <p className={`text-sm mt-2 leading-snug ${s.label}`}>{label}</p>
      </div>
    </div>
  )
}
