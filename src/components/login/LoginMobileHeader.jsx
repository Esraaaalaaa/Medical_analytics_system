import { Shield } from 'lucide-react'

export default function LoginMobileHeader() {
  return (
    <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
      <Shield className="text-primary" size={40} strokeWidth={1.75} />
      <div>
        <h2 className="text-2xl font-black text-primary font-headings">
          UH-CONNECT
        </h2>
        <p className="text-xs text-muted-foreground font-bold">الشبكة الموحدة</p>
      </div>
    </div>
  )
}