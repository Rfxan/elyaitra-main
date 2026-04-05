'use client'

import React from 'react'
import { Search, Zap, Activity, Shield, Info, Filter, Plus, Target } from 'lucide-react'

const ACTIVE_DETECTORS = [
  { id: 'DET-001', name: 'Brute Force Attempt (SSH)', category: 'Auth', status: 'Active', accuracy: '98%' },
  { id: 'DET-002', name: 'SQL Injection Pattern', category: 'Web', status: 'Active', accuracy: '95%' },
  { id: 'DET-003', name: 'Large Outbound Data Transfer', category: 'Exfiltration', status: 'Active', accuracy: '92%' },
  { id: 'DET-004', name: 'New Binary Execution (Unsigned)', category: 'Host', status: 'Monitoring', accuracy: '89%' },
  { id: 'DET-005', name: 'Privileged Account Escalation', category: 'IAM', status: 'Active', accuracy: '97%' },
]

export default function DetectPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Detection Engineering</h1>
          </div>
          <p className="text-sm text-gray-500">Configure and monitor automated threat detection rules for the Elyaitra engine.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <Plus className="w-4 h-4" />
                Add New Rule
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Detection Coverage</div>
               <div className="text-3xl font-bold text-gray-900">MITRE ATT&CK: <span className="text-indigo-600">84%</span></div>
               <div className="mt-2 flex gap-1 h-1.5 w-48 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '84%' }} />
               </div>
            </div>
            <Target className="w-12 h-12 text-indigo-100" />
         </div>
         <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AI Rule Generation</div>
               <div className="text-3xl font-bold text-gray-900">Groq Evolve: <span className="text-emerald-600">ON</span></div>
               <p className="text-[10px] text-emerald-500 mt-2 font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-500" /> Continuous Optimization Active
               </p>
            </div>
            <Shield className="w-12 h-12 text-emerald-100" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Detection Rules ({ACTIVE_DETECTORS.length})</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Detection Engine Rule</th>
                <th className="px-6 py-4">Logic Category</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ACTIVE_DETECTORS.map(det => (
                <tr key={det.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{det.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{det.name}</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5 tracking-tighter">Verified by Elyaitra AI</div>
                  </td>
                  <td className="px-6 py-4 uppercase text-[10px] font-bold text-gray-500">{det.category}</td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-indigo-600">{det.accuracy}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Edit Rule</button>
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
