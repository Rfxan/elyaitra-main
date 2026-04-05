'use client'

import React, { useState, useEffect } from 'react'
import { Bug, AlertCircle, ShieldCheck, Search, Loader2 } from 'lucide-react'

export default function VulnerabilitiesPage() {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch('/api/system/audit')
        const data = await res.json()
        setAudit(data)
      } catch (e) {
        console.error('Failed to fetch vulnerabilities data', e)
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

  const vulnerabilities = audit?.vulnerabilities || []
  const stats = audit?.stats || { totalVulnerabilities: 0, criticalIssues: 0, highIssues: 0, systemHealth: 100 }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bug className="w-5 h-5 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Vulnerability Scanning</h1>
          </div>
          <p className="text-sm text-gray-500">Live detection of known CVEs within the Elyaitra software stack.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <Search className="w-4 h-4" />
            Scan Fleet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total CVEs</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalVulnerabilities}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">{stats.criticalIssues}</div>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">High</div>
          <div className="text-2xl font-bold text-orange-600">{stats.highIssues}</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">System Health</div>
          <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">{stats.systemHealth}% <ShieldCheck className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">CVE Identifier</th>
                <th className="px-6 py-4">Vulnerability Title</th>
                <th className="px-6 py-4">Linked Package</th>
                <th className="px-6 py-4">CVSS Score</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vulnerabilities.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                         <ShieldCheck className="w-6 h-6 text-emerald-500" />
                         <span className="text-sm font-medium text-gray-500">No vulnerabilities detected in latest scan.</span>
                      </div>
                   </td>
                </tr>
              ) : vulnerabilities.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-indigo-600">{v.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{v.title}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">{v.severity} • File Exposure</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{v.pkgs}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div className={`h-full bg-red-500`} style={{ width: `${(v.score || 0) * 10}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{v.score}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Audit</button>
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
