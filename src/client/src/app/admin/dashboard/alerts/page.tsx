'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Search, 
  Ban,
  Loader2,
  Trash2,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

interface BlockedItem {
  id: string
  type: 'ip' | 'file' | 'endpoint'
  value: string
  reason: string
  blockedAt: string
}

export default function AdminAlertsPage() {
  const [blocked, setBlocked] = useState<BlockedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlocked()
  }, [])

  const fetchBlocked = async () => {
    try {
      const res = await fetch('/api/threats/blocked')
      const data = await res.json()
      setBlocked(data || [])
    } catch (err) {
      console.error('Failed to fetch blocked items')
    } finally {
      setLoading(false)
    }
  }

  const unblock = async (id: string) => {
    try {
      const res = await fetch('/api/threats/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setBlocked(prev => prev.filter(b => b.id !== id))
        toast.success('Access Restored', { description: 'The identifier has been removed from the blacklist.' })
      }
    } catch (err) {
      toast.error('Failed to unblock item')
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toaster richColors position="top-right" />
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Security Blacklist</h1>
          </div>
          <p className="text-sm text-gray-500">Persistent mitigation across the Elyaitra infrastructure.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchBlocked} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Blockades ({blocked.length})</div>
          <div className="relative group">
            <input type="text" placeholder="Search blacklist..." className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs text-gray-400 font-medium">Synchronizing with BlockStore...</span>
          </div>
        ) : blocked.length === 0 ? (
          <div className="py-24 text-center">
             <Shield className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-sm text-gray-400">Your infrastructure is currently clear of manual blocks.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {blocked.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${item.type === 'ip' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {item.type === 'ip' ? <Ban className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 font-mono">{item.value}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span className="uppercase font-bold text-[9px] px-1 bg-gray-100 rounded tracking-tighter">{item.type}</span>
                      <span>•</span>
                      <span>{item.reason}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">Blocked At</div>
                    <div className="text-[10px] text-gray-500 font-medium">{item.blockedAt}</div>
                  </div>
                  <button 
                    onClick={() => unblock(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Rescind Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
