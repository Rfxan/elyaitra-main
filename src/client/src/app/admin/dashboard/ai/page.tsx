'use client'

import React from 'react'
import { Sparkles, Activity, Shield, Zap, Info, Cpu, Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react'

export default function ElyaitraAIPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Elyaitra AI Core</h1>
          </div>
          <p className="text-sm text-gray-500">Autonomous Security Governance & Behavioral Intelligence Engine.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Groq Cloud Active</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#1a1a2e] rounded-2xl border border-[#2a2a45] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Cpu className="w-32 h-32 text-indigo-400" />
            </div>
            <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-2 font-mono tracking-tight">Active Model: Llama-3.1-70b-Versatile</h2>
                <p className="text-indigo-200/60 text-sm max-w-md mb-8">High-performance inference engine optimized for real-time threat detection and multi-turn behavioral reasoning.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Latency</div>
                        <div className="text-xl font-bold text-white">42ms</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Tokens/Sec</div>
                        <div className="text-xl font-bold text-white">128.4</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Context</div>
                        <div className="text-xl font-bold text-white">128k</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Uptime</div>
                        <div className="text-xl font-bold text-emerald-400">99.98%</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" /> System Integrity
            </h3>
            <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-500">Threat Detection Precision</span>
                      <span className="text-indigo-600">97.2%</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '97.2%' }} />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-500">Autonomous Decision Confidence</span>
                      <span className="text-purple-600">94.8%</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '94.8%' }} />
                   </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
                    "Elyaitra AI uses continuous reinforcement learning from platform behavioral logs to optimize defense strategies."
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent AI Reasoning Logs</div>
               <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="p-4 font-mono text-[11px] space-y-3">
               <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="text-indigo-600 font-bold">[REASONING]</span> Analyzing burst of AUTH-401 from 192.168.4.12. Elevated risk profile: BRUTE_FORCE likely. Correlating with user session history...
               </div>
               <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800">
                  <span className="text-emerald-600 font-bold">[DECISION]</span> Pre-emptively blocked origin IP for 3600s. Risk mitigated. No escalation required.
               </div>
               <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="text-purple-600 font-bold">[TUTOR]</span> Student asked complex question on 'Organic Chemistry'. Routing to specialized knowledge base... Response accuracy verified.
               </div>
            </div>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Zap className="w-4 h-4 text-orange-500 fill-orange-500" /> Model Configuration
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="text-xs font-bold text-gray-700">Temperature</div>
                   <div className="text-xs font-mono text-indigo-600">0.2 (Low Variance)</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="text-xs font-bold text-gray-700">Top-P Sampling</div>
                   <div className="text-xs font-mono text-indigo-600">0.9</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                   <div className="text-xs font-bold text-emerald-800">Groq Acceleration</div>
                   <div className="text-[10px] font-bold text-emerald-600 uppercase">Hardware Optimized</div>
                </div>
                <button className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                   Optimize Model Weights
                </button>
            </div>
         </div>
      </div>
    </div>
  )
}
