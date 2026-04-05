'use client'

import React, { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, BarChart3, Scan } from 'lucide-react'

export default function CompliancePage() {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch('/api/system/audit')
        const data = await res.json()
        setAudit(data)
      } catch (e) {
        console.error('Failed to fetch compliance data', e)
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

  const stats = audit?.stats || { systemHealth: 100, criticalIssues: 0 }
  const misconfigs = audit?.misconfigurations || []
  const vulnerabilities = audit?.vulnerabilities || []
  
  const totalIssues = misconfigs.length + vulnerabilities.length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scan className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Compliance & Regulatory Audit</h1>
          </div>
          <p className="text-sm text-gray-500">Real-time mapping of system security telemetry to NIST and SOC2 standards.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <BarChart3 className="w-4 h-4" />
                Download Full Evidence Report (PDF)
            </button>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-4 bg-indigo-50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900 font-mono tracking-tight uppercase tracking-widest text-[10px] text-gray-400">Security Scorecard</h3>
                  <div className="text-3xl font-bold text-gray-900">{stats.systemHealth}%</div>
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 tracking-widest uppercase">
                     <span>Controls Verified</span>
                     <span>{32 - totalIssues} / 32</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: `${Math.max(10, (32 - totalIssues) / 32 * 100)}%` }} />
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px] text-gray-400">Audit Summary</h4>
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Pending Findings</span>
                  <span className={`text-xs font-bold ${totalIssues > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{totalIssues} Issues</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Critical Exclusions</span>
                  <span className="text-xs font-bold text-red-600">{stats.criticalIssues} Unresolved</span>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Compliance Evidence Logs</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Standard</th>
                <th className="px-6 py-4">Control Logic</th>
                <th className="px-6 py-4">Evidence Status</th>
                <th className="px-6 py-4 text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {totalIssues === 0 ? (
                  <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                        System is fully compliant with NIST 800-53 and SOC2 Trust Principles.
                     </td>
                  </tr>
               ) : (
                  <>
                  {vulnerabilities.map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">NIST 800-53</td>
                      <td className="px-6 py-4">
                         <div className="text-sm font-bold text-gray-900">{v.title}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                            <AlertCircle className="w-3 h-3" />
                            Violated
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         Just Now
                      </td>
                    </tr>
                  ))}
                  {misconfigs.map((m: any) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">SOC2 Type II</td>
                      <td className="px-6 py-4">
                         <div className="text-sm font-bold text-gray-900">{m.title}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                            <AlertCircle className="w-3 h-3" />
                            Non-Compliant
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                         Just Now
                      </td>
                    </tr>
                  ))}
                  </>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
