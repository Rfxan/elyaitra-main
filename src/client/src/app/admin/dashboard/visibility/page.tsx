'use client'

import React from 'react'
import { Eye, Activity, Map, ArrowUpRight, ArrowDownRight, Globe, Layers, Server } from 'lucide-react'

export default function EventVisibilityPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Network Event Visibility</h1>
          </div>
          <p className="text-sm text-gray-500">Live telemetry and traffic flow analysis across Elyaitra clusters.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                <Map className="w-4 h-4" />
                Live Topology
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#1a1a2e] rounded-2xl border border-[#2a2a45] h-[400px] relative overflow-hidden shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
            <div className="relative text-center">
                <Globe className="w-24 h-24 text-indigo-400/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-indigo-200/40 uppercase tracking-[0.3em]">Neural Network Map (Live)</p>
                <div className="mt-6 flex gap-4 justify-center">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping delay-75" />
                   <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping delay-150" />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-6">
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Inbound traffic</span>
                   <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">421.8 <span className="text-sm text-gray-400">Mbps</span></div>
                <div className="mt-4 w-full h-8 flex items-end gap-1 px-1">
                   {[40, 70, 45, 90, 65, 30, 85, 55, 75, 45].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-100 hover:bg-emerald-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                   ))}
                </div>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Outbound traffic</span>
                   <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">89.4 <span className="text-sm text-gray-400">Mbps</span></div>
                <div className="mt-4 w-full h-8 flex items-end gap-1 px-1">
                   {[20, 30, 25, 40, 35, 20, 45, 30, 40, 25].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                   ))}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-800">
               <Layers className="w-4 h-4 text-indigo-600" />
               <span className="text-sm font-bold uppercase tracking-widest">Protocols Observed</span>
            </div>
            <div className="space-y-4">
               {['HTTPS', 'SSH', 'MQTT', 'DNS', 'TCP/UDP'].map((p, i) => (
                  <div key={p} className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-600">{p}</span>
                     <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${80 - i*15}%` }} />
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold">{80 - i*15}%</span>
                  </div>
               ))}
            </div>
         </div>
         <div className="p-6 bg-[#12121a] rounded-2xl border border-gray-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-6 text-gray-300">
               <Server className="w-4 h-4 text-emerald-400" />
               <span className="text-sm font-bold uppercase tracking-widest">Live Node Stats</span>
            </div>
            <div className="space-y-3 font-mono text-[11px] text-emerald-300/60 leading-relaxed">
               <p className="border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">NODE-primary-auth-01 : HEALTHY | LATENCY 12ms</p>
               <p className="border-l-2 border-indigo-500 pl-3 py-1 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors">NODE-ai-inference-cluster : SCALING | LOAD 82%</p>
               <p className="border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">NODE-db-replica-east : SYNCING | LAG 400ms</p>
            </div>
         </div>
      </div>
    </div>
  )
}
