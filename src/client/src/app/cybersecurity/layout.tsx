'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Bug,
  CheckSquare,
  Eye,
  Settings,
  Search as SearchIcon,
  Monitor,
  FileText,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  Shield,
  Menu,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    items: [
      { label: 'Dashboards', icon: LayoutDashboard, href: '/cybersecurity' },
      { label: 'Purple AI', icon: Sparkles, href: '#', badge: null },
    ],
  },
  {
    title: 'Triage',
    items: [
      { label: 'Alerts', icon: AlertTriangle, href: '/cybersecurity/alerts' },
      { label: 'Misconfigurations', icon: ShieldAlert, href: '#' },
      { label: 'Vulnerabilities', icon: Bug, href: '#' },
      { label: 'Compliance', icon: CheckSquare, href: '#' },
    ],
  },
  {
    title: 'Discover',
    items: [
      { label: 'Event Visibility', icon: Eye, href: '#' },
    ],
  },
  {
    title: 'Configure',
    items: [
      { label: 'Detect', icon: SearchIcon, href: '#' },
      { label: 'Agents', icon: Monitor, href: '#' },
      { label: 'Report', icon: FileText, href: '#' },
      { label: 'Policies', icon: ScrollText, href: '#' },
    ],
  },
]

export default function CybersecurityLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f4f5f7' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r transition-all duration-300 flex-shrink-0"
        style={{
          width: collapsed ? 56 : 200,
          background: '#1a1a2e',
          borderColor: '#2a2a45',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-3 h-12 border-b" style={{ borderColor: '#2a2a45' }}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-bold text-white tracking-wide">Aegis <span className="text-purple-400">One</span></span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-2 border-b" style={{ borderColor: '#2a2a45' }}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs" style={{ background: '#252545', color: '#8888aa' }}>
              <SearchIcon className="w-3 h-3" />
              <span>Find a page...</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="mb-1">
              {section.title && !collapsed && (
                <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6b6b8d' }}>
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href === '/cybersecurity' && pathname === '/cybersecurity') ||
                  (item.href === '/cybersecurity/alerts' && pathname === '/cybersecurity/alerts')
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-[7px] mx-1.5 rounded text-[13px] font-medium transition-all"
                    style={{
                      color: isActive ? '#ffffff' : '#9b9bb8',
                      background: isActive ? '#6c5ce7' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = '#252545'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer logo */}
        {!collapsed && (
          <div className="px-3 py-3 border-t flex items-center gap-2" style={{ borderColor: '#2a2a45' }}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-[11px]">
              <div className="text-gray-300 font-medium">Elyaitra</div>
              <div style={{ color: '#6b6b8d' }}>v2.0.4</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-10 border-b flex items-center justify-between px-4 flex-shrink-0" style={{ background: '#fff', borderColor: '#e2e5ea' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1 rounded hover:bg-gray-100">
              <Menu className="w-4 h-4 text-gray-500" />
            </button>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-400">Global</span>
              <span className="text-gray-300">›</span>
              <span className="font-medium text-blue-600">My Accounts</span>
              <span className="text-gray-300">›</span>
              <span className="text-gray-700 font-semibold">SentinelOne</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              <span>Protect Security</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Marketplace</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
              AG
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3a3a5c; border-radius: 4px; }
      `}</style>
    </div>
  )
}
