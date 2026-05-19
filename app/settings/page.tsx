'use client'

import Link from 'next/link'
import { ArrowLeft, Globe, Tag } from 'lucide-react'
import { useState } from 'react'
import RegionManager from '@/features/settings/components/RegionManager'
import CategoryManager from '@/features/settings/components/CategoryManager'
import { cn } from '@/utils'

type Tab = 'regions' | 'categories'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'regions',    label: 'Regions',    icon: <Globe className="h-4 w-4" /> },
  { id: 'categories', label: 'Categories', icon: <Tag  className="h-4 w-4" /> },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('regions')

  return (
    <div className="min-h-screen bg-[#f6f5f3]">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-[#f6f5f3]/95 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/"
              className="flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900">
              <ArrowLeft className="h-4 w-4" />
              Travel Workspace
            </Link>
            <h1 className="text-sm font-semibold text-stone-700">Settings</h1>
            <div className="w-28" /> {/* spacer */}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Settings</h1>
          <p className="mt-2 text-stone-500">Manage the regions and categories used across your workspace.</p>
        </div>

        {/* Desktop: sidebar + content */}
        <div className="flex gap-8">

          {/* Sidebar tabs */}
          <nav className="hidden w-44 flex-shrink-0 sm:block" aria-label="Settings sections">
            <div className="space-y-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                    activeTab === t.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  )}
                  aria-current={activeTab === t.id ? 'page' : undefined}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile: top tabs */}
          <div className="mb-6 flex gap-2 sm:hidden">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition',
                  activeTab === t.id
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                )}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            {activeTab === 'regions'    && <RegionManager />}
            {activeTab === 'categories' && <CategoryManager />}
          </div>
        </div>
      </div>
    </div>
  )
}
