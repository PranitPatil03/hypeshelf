'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const sidebarSections = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Introduction' },
    ],
  },
  {
    title: 'System Design',
    items: [
      { href: '/docs/architecture', label: 'Architecture' },
      { href: '/docs/backend', label: 'Backend & Database' },
    ],
  },
  {
    title: 'Security',
    items: [
      { href: '/docs/security', label: 'Auth & Security' },
    ],
  },
];

export function DocsHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Top header bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white">
        <div className="h-full flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 -ml-1.5 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/icons/sunflower.png" alt="hypeshelf" width={26} height={26} />
              <span className="text-lg font-lora text-slate-900 tracking-tight">hypeshelf</span>
            </Link>
            <div className="hidden sm:block h-5 w-px bg-slate-200" />
            <span className="hidden sm:block text-sm font-medium text-slate-900">Documentation</span>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-14 left-0 bottom-0 w-[240px] bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={() => setIsSidebarOpen(false)} />
      </aside>
    </>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="py-4 px-3">
      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-5">
          <h3 className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {section.title}
          </h3>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-all duration-100",
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  )}
                >
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 text-slate-400" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
