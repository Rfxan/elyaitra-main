'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, Activity, ShieldCheck, Search, Loader2 } from 'lucide-react'

export default function AgentsPage() {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch('/api/system/audit')
        const data = await res.json()
        setAudit(data)
      } catch (e) {
        console.error('Failed to fetch agents data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAudit()
    const interval = setInterval(fetchAudit, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const agents = audit?.agents || []

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Device Agents</h1>
          </div>
          <p className="text-sm text-gray-500">Live monitoring and management of security agents deployed across Elyaitra endpoints.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <Search className="w-4 h-4" />
                Query All Agents
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Online</div>
            <div className="text-2xl font-bold text-emerald-600">{agents.length}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Outdated</div>
            <div className="text-2xl font-bold text-indigo-600">0</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">High Risk</div>
            <div className="text-2xl font-bold text-red-600">0</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Deployed</div>
            <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Device Inventory ({agents.length})</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Agent Identifier</th>
                <th className="px-6 py-4">Linked Device</th>
                <th className="px-6 py-4">OS Environment</th>
                <th className="px-6 py-4">Risk Profile</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No agents detected.</td>
                </tr>
              ) : agents.map((agent: any) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono text-indigo-600 font-bold">{agent.id}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{agent.ip}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-gray-400" />
                        {agent.name}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-600">{agent.os}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full bg-emerald-500`} />
                       <span className="text-xs font-bold text-gray-800 uppercase tracking-tighter">{agent.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Manage Node</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
