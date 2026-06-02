import { useState } from 'react'
import { Shield, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function MainLayout({ children, userName, userSub, activeNavId }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      dir="rtl"
      className="flex h-screen w-full bg-background flex-col md:flex-row font-body overflow-hidden"
    >
      <Sidebar
        userName={userName}
        userSub={userSub}
        activeNavId={activeNavId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            onClick={() => setSidebarOpen(true)}
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
