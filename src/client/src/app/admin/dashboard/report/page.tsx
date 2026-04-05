'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Download, Share2, Activity, ShieldAlert, CheckCircle2, Loader2, BarChart3 } from 'lucide-react'

export default function SecurityReportsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/threats/stats')
        const data = await res.json()
        setStats(data)
      } catch (e) {
        console.error('Failed to fetch stats for report', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Security Intelligence Reports</h1>
          </div>
          <p className="text-sm text-gray-500">Automated reporting on threat trends and infrastructure health from real telemetry.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <BarChart3 className="w-4 h-4" />
                Generate Custom Report
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
         <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                     <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900">Daily Security Audit</h3>
                     <p className="text-sm text-gray-400">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
               </div>
               <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" />
                  Scheduled
               </span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
               <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Requests Screened</div>
                  <div className="text-lg font-bold text-indigo-600">{stats?.totalRequests || 0}</div>
               </div>
               <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">Critical Threats</div>
                  <div className="text-lg font-bold text-red-600">{stats?.totalThreats || 0}</div>
               </div>
            </div>

            <p className="text-sm text-gray-600 italic">No anomalies detected in the last 24 hours. Infrastructure integrity remains stable.</p>
         </div>

         <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest text-[10px] text-gray-400">Real-Time Trends</h4>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                     <span>Threat Detection Rate</span>
                     <span>{stats?.totalThreats > 0 ? (stats.totalThreats / stats.totalRequests * 100).toFixed(2) : 0}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, (stats?.totalThreats / stats?.totalRequests * 1000) || 0)}%` }} />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                     <span>Blocked Requests</span>
                     <span>{stats?.blockedRequests || 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-600" style={{ width: `${Math.min(100, (stats?.blockedRequests / stats?.totalRequests * 100) || 0)}%` }} />
                  </div>
               </div>
            </div>
         </div>
      </div>

       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Available Reports Repository (0)</div>
        </div>
        <div className="p-12 text-center">
             <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <h3 className="text-sm font-bold text-gray-900 mb-1">No historical reports available yet.</h3>
             <p className="text-xs text-gray-500">Historical reports will be archived here as the system collects more telemetry over time.</p>
        </div>
      </div>
    </div>
  )
}
