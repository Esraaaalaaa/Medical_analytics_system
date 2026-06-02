import { useNavigate } from 'react-router-dom'
import { User, Briefcase, Shield, KeyRound } from 'lucide-react'
import LoginBrandPanel from '../components/login/LoginBrandPanel'
import LoginMobileHeader from '../components/login/LoginMobileHeader'

const DEMO_ROLES = [
  {
    label: 'الدخول كمدير النظام',
    icon: KeyRound,
    role: 'admin',
    className:
      'w-full bg-red-600 text-white font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-red-700 transition-colors',
  },
  {
    label: 'الدخول كسكرتير طبي',
    icon: User,
    role: 'secretary',
    className:
      'w-full bg-primary/10 text-primary font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/20 transition-colors',
  },
  {
    label: 'الدخول كمدير مستشفى',
    icon: Briefcase,
    role: 'director',
    className:
      'w-full bg-primary/10 text-primary font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/20 transition-colors',
  },
  {
    label: 'الدخول كرئيس للمستشفيات',
    icon: Shield,
    role: 'president',
    className:
      'w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors',
  },
]

export default function Login() {
  const navigate = useNavigate()

  const selectRole = (role) => {
    navigate('/login/credentials', { state: { role } })
  }

  return (
    <div dir="rtl" className="min-h-screen flex bg-background font-body">
      <LoginBrandPanel />

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 bg-muted/10 relative">
        <LoginMobileHeader />

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-right">
            <h2 className="text-3xl font-black text-foreground mb-3">
              تسجيل الدخول
            </h2>
            <p className="text-muted-foreground">
              أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <div className="text-sm font-bold text-foreground text-center border-b border-border pb-3 mb-3">
              تسجيل الدخول للتجربة (اختر الدور للتنقل بين الشاشات)
            </div>

            {DEMO_ROLES.map(({ label, icon: Icon, role, className }) => (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
                className={className}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground font-medium">
            نظام مخصص للاستخدام الرسمي فقط. جميع العمليات مسجلة وخاضعة للرقابة.
          </p>
        </div>
      </div>
    </div>
  )
}
