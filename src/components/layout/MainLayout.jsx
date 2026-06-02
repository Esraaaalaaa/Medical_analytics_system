import { Shield, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function MainLayout({
  children,
  userName,
  userSub,
  activeNavId,
}) {
  return (
    <div
      dir="rtl"
      className="flex h-screen w-full bg-background flex-col md:flex-row font-body overflow-hidden"
    >
      <Sidebar
        userName={userName}
        userSub={userSub}
        activeNavId={activeNavId}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="text-secondary" size={20} strokeWidth={1.75} />
            <div className="text-lg font-bold font-headings">UH-CONNECT</div>
          </div>
          <button
            type="button"
            className="p-1"
            aria-label="القائمة"
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-muted/10 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
