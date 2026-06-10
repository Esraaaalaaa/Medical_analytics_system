import { useState } from 'react'
import { Shield, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function MainLayout({ children, userName, userSub, activeNavId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 font-body md:flex-row"
    >
      <Sidebar
        userName={userName}
        userSub={userSub}
        activeNavId={activeNavId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-primary p-4 text-primary-foreground md:hidden">
          <div className="flex items-center gap-2">
            <Shield className="text-secondary" size={20} strokeWidth={1.75} />
            <div className="text-lg font-bold font-headings">UH-CONNECT</div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-white/10"
            aria-label="القائمة"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto bg-slate-50/80">
          {children}
        </div>
      </main>
    </div>
  )
}