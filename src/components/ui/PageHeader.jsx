const ICON_VARIANTS = {
  sky: {
    bg: 'bg-sky-50 ring-sky-100',
    icon: 'text-sky-600',
    glow: 'from-sky-500/10',
  },
  red: {
    bg: 'bg-red-50 ring-red-100',
    icon: 'text-red-500',
    glow: 'from-red-500/10',
  },
  green: {
    bg: 'bg-emerald-50 ring-emerald-100',
    icon: 'text-emerald-600',
    glow: 'from-emerald-500/10',
  },
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconVariant = 'sky',
  leftContent,
}) {
  const iv = ICON_VARIANTS[iconVariant] ?? ICON_VARIANTS.sky

  return (
    <div
      dir="rtl"
      className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 text-right shadow-sm"
    >
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l ${iv.glow} to-transparent`}
      />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-1 items-start justify-start gap-3 text-right">
          {Icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iv.bg} ring-1`}
            >
              <Icon className={`h-5 w-5 ${iv.icon}`} strokeWidth={2} />
            </div>
          )}

          <div className="min-w-0 text-right">
            <h2 className="text-right text-xl font-black leading-tight text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 max-w-3xl text-right text-sm font-medium leading-7 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {leftContent && (
          <div className="flex shrink-0 items-center justify-start gap-2 md:justify-end">
            {leftContent}
          </div>
        )}
      </div>
    </div>
  )
}