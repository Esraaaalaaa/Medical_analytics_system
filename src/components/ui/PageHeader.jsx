const ICON_VARIANTS = {
  sky: { bg: 'bg-sky-100',  icon: 'text-sky-600'  },
  red: { bg: 'bg-red-100',  icon: 'text-red-500'  },
}

/**
 * PageHeader — page title + subtitle block.
 * icon: lucide icon component
 * iconVariant: 'sky' (default) | 'red'
 * leftContent: optional JSX rendered on the left side (visual) in RTL
 */
export default function PageHeader({ title, subtitle, icon: Icon, iconVariant = 'sky', leftContent }) {
  const iv = ICON_VARIANTS[iconVariant] ?? ICON_VARIANTS.sky
  return (
    <div className="flex items-start justify-between mb-6">
      {/* Visual left: optional extra content (e.g. download button) */}
      <div className="flex items-center gap-2">
        {leftContent}
      </div>

      {/* Visual right: title block */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-2.5">
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{title}</h2>
          {Icon && (
            <div className={`w-9 h-9 rounded-xl ${iv.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${iv.icon}`} strokeWidth={1.8} />
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
