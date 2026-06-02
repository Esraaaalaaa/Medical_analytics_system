import { Shield, CheckCircle, Building2, Award } from 'lucide-react'

const FEATURES = [
  'إحصائيات دورية دقيقة ومحدثة',
  'متابعة المديونيات والمستحقات',
  'تعميمات وقرارات عاجلة مركزية',
]

export default function LoginBrandPanel() {
  return (
    <div className="hidden lg:flex w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-full h-96 bg-secondary/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/3 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex items-center gap-4">
        <Shield className="text-secondary shrink-0" size={48} strokeWidth={1.75} />
        <div>
          <h2 className="text-2xl font-bold font-headings tracking-widest">
            UH-CONNECT
          </h2>
          <p className="text-sm opacity-80 mt-1">
            الشبكة الموحدة للمستشفيات الجامعية
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-8 max-w-md">
        <h1 className="text-4xl font-black leading-tight">
          منصة موحدة لرصد ومتابعة الأداء الطبي والمالي
        </h1>
        <ul className="space-y-4">
          {FEATURES.map((text) => (
            <li key={text} className="flex items-center gap-3 text-lg">
              <CheckCircle
                className="text-secondary shrink-0"
                size={24}
                strokeWidth={2}
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex items-center gap-6 opacity-70">
        <div className="flex items-center gap-2">
          <Building2 size={24} strokeWidth={1.75} />
          <span className="text-sm font-bold">المجلس الأعلى للمستشفيات</span>
        </div>
        <div className="flex items-center gap-2">
          <Award size={24} strokeWidth={1.75} />
          <span className="text-sm font-bold">وزارة التعليم العالي</span>
        </div>
      </div>
    </div>
  )
}
