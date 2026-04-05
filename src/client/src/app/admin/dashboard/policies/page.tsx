'use client'

import React from 'react'
import { ScrollText, Shield, Zap, Info, Plus, ChevronRight, Lock, CheckCircle2, Activity } from 'lucide-react'

const POLICIES = [
  { id: 'POL-01', name: 'Global Zero Trust Access', target: 'All Users', status: 'Enforced', lastUpdated: '2024-03-15' },
  { id: 'POL-02', name: 'Adaptive Brute Force Protection', target: 'Auth Gateway', status: 'Enforced', lastUpdated: '2024-04-01' },
  { id: 'POL-03', name: 'Sensitive Data Exfiltration Prevention', target: 'Database Clusters', status: 'Monitoring', lastUpdated: '2024-03-20' },
  { id: 'POL-04', name: 'Student AI Interaction Guardrails', target: 'Tutor API', status: 'Enforced', lastUpdated: '2024-04-03' },
  { id: 'POL-05', name: 'Administrator MFA Requirement', target: 'Admin Dashboard', status: 'Enforced', lastUpdated: '2024-01-10' },
]

export default function PoliciesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScrollText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Security Governance Policies</h1>
          </div>
          <p className="text-sm text-gray-500">Define and manage the high-level security rules governing the Elyaitra ecosystem.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <Plus className="w-4 h-4" />
                Draft New Policy
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-4 flex-1">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Policy Enforcement Status</div>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl"><Shield className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900">Infrastructure Integrity</h3>
                     <p className="text-xs text-gray-500 font-medium">92% of policy nodes successfully enforced.</p>
                  </div>
               </div>
               <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
               </div>
            </div>
         </div>
         <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="space-y-4 flex-1">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Policy Evolution</div>
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl"><Zap className="w-6 h-6 text-indigo-600" /></div>
                  <div>
                     <h3 className="text-lg font-bold text-gray-900">AI-Optimized Logic</h3>
                     <p className="text-xs text-gray-500 font-medium">Groq is actively suggesting policy hardening.</p>
                  </div>
               </div>
               <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View 12 Recommendations</button>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Policy Registry ({POLICIES.length})</div>
        </div>
        <div className="divide-y divide-gray-100">
          {POLICIES.map(pol => (
            <div key={pol.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-50 text-gray-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                     <Lock className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-gray-900">{pol.name}</h3>
                     <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5 uppercase font-bold tracking-tighter">
                        <span>{pol.id}</span>
                        <span>•</span>
                        <span className="text-indigo-600">Target: {pol.target}</span>
                        <span>•</span>
                        <span>Updated {pol.lastUpdated}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${pol.status === 'Enforced' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {pol.status === 'Enforced' ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <Activity className="w-3 h-3 inline mr-1" />}
                    {pol.status}
                  </span>
                  <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
