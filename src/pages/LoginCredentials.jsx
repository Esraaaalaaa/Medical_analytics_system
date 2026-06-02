import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Check,
} from 'lucide-react'
import LoginBrandPanel from '../components/login/LoginBrandPanel'
import LoginMobileHeader from '../components/login/LoginMobileHeader'
import { isValidRole, ROLES } from '../lib/authRoles'
import { setSession } from '../lib/authSession'
import { validateCredentials, CREDENTIALS } from '../lib/credentials'

export default function LoginCredentials() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = location.state?.role

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isValidRole(role)) return
    const key = `uh-connect-remember-${role}`
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const { username: u } = JSON.parse(saved)
        if (u) setUsername(u)
        setRememberMe(true)
      } catch {
        localStorage.removeItem(key)
      }
    }
  }, [role])

  if (!isValidRole(role)) {
    return <Navigate to="/login" replace />
  }

  const roleInfo = ROLES[role]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    if (!validateCredentials(role, username, password)) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
      return
    }
    setError('')
    setLoading(true)

    if (rememberMe) {
      localStorage.setItem(
        `uh-connect-remember-${role}`,
        JSON.stringify({ username: username.trim() }),
      )
    } else {
      localStorage.removeItem(`uh-connect-remember-${role}`)
    }

    setTimeout(() => {
      setLoading(false)
      setSession({ role, username: username.trim() })
      navigate('/home', { replace: true })
    }, 800)
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
            <p className="text-sm font-bold text-primary mt-2">
              {roleInfo.label}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-bold text-foreground block"
                >
                  اسم المستخدم أو البريد الإلكتروني
                </label>
                <div className="flex items-center border border-border rounded-lg bg-input px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <User
                    className="text-muted-foreground shrink-0 ml-3"
                    size={20}
                    strokeWidth={2}
                  />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError('') }}
                    placeholder="أدخل اسم المستخدم..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    autoComplete="username"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-foreground block"
                >
                  كلمة المرور
                </label>
                <div className="flex items-center border border-border rounded-lg bg-input px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <Lock
                    className="text-muted-foreground shrink-0 ml-3"
                    size={20}
                    strokeWidth={2}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none tracking-widest"
                    autoComplete="current-password"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground mr-2 hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? (
                      <Eye size={20} strokeWidth={2} />
                    ) : (
                      <EyeOff size={20} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium text-center">{error}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe((v) => !v)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    rememberMe
                      ? 'border-primary bg-primary'
                      : 'border-border bg-input'
                  }`}
                >
                  {rememberMe && (
                    <Check className="text-primary-foreground" size={14} strokeWidth={3} />
                  )}
                </button>
                <span className="text-sm font-bold text-muted-foreground">
                  تذكرني
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-primary font-bold hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
              <LogIn size={20} strokeWidth={2} />
            </button>
          </form>
{/* 
          {CREDENTIALS[role] && (
            <div className="mt-4 bg-muted/40 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1" dir="rtl">
              <p className="font-bold text-foreground">بيانات تجريبية:</p>
              <p>اسم المستخدم: <span className="font-mono font-bold text-foreground">{CREDENTIALS[role].username}</span></p>
              <p>كلمة المرور: <span className="font-mono font-bold text-foreground">{CREDENTIALS[role].password}</span></p>
            </div>
          )} */}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-4 w-full text-center text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
          >
            ← العودة لاختيار الدور
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground font-medium">
            نظام مخصص للاستخدام الرسمي فقط. جميع العمليات مسجلة وخاضعة للرقابة.
          </p>
        </div>
      </div>
    </div>
  )
}
