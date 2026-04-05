'use client'

import React, { useState, useEffect } from 'react'
import { Settings, ShieldAlert, Cpu, Filter, Loader2, CheckCircle2 } from 'lucide-react'

export default function MisconfigurationsPage() {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch('/api/system/audit')
        const data = await res.json()
        setAudit(data)
      } catch (e) {
        console.error('Failed to fetch misconfigurations data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAudit()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  const misconfigs = audit?.misconfigurations || []
  const stats = audit?.stats || { totalVulnerabilities: 0, criticalIssues: 0, highIssues: 0, systemHealth: 100 }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">System Misconfigurations</h1>
          </div>
          <p className="text-sm text-gray-500">Live surface monitoring for insecure server and infrastructure settings.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter Resources
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Issues</div>
            <div className="text-2xl font-bold text-gray-900">{misconfigs.length}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Critical/High</div>
            <div className="text-2xl font-bold text-orange-600">{stats.highIssues}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Resolved (Auto)</div>
            <div className="text-2xl font-bold text-emerald-600">0</div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Configuration Finding</th>
                <th className="px-6 py-4">Affected Resource</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {misconfigs.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 font-medium">
                         <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                         <span className="text-sm text-gray-500">System configuration is compliant with security baselines.</span>
                      </div>
                   </td>
                </tr>
              ) : misconfigs.map((m: any) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400">{m.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{m.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">NIST CSF v1.1 PR.AC-3</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{m.resource}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${m.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {m.severity}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Remediate</button>
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
