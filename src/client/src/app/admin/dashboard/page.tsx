'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Activity, 
  Terminal,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Clock,
  ChevronRight,
  Ban,
  Skull,
  Crosshair,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

// --- TYPES ---
interface Threat {
  id: string
  timestamp: string
  severity: string
  type: string
  description: string
  affectedSystem: string
  recommendedAction: string
  sourceIp?: string
  mitigationStatus?: string
  matchedPattern?: string
}

interface Stats {
  totalRequests: number
  totalThreats: number
  blockedRequests: number
  blockedIPs: number
  activeLogs: number
  uptimeSeconds: number
  threatsByCategory: Record<string, number>
  threatsBySeverity: Record<string, number>
  topAttackerIPs: { ip: string; count: number }[]
}

// Stats cards component
const StatCard = ({ title, value, color, icon: Icon }: any) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
    <div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
    <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-50')}`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  </div>
)

export default function ElyaitraSecurityDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  
  // Real-time states
  const [logs, setLogs] = useState<string>('Initializing security engine...')
  const [threats, setThreats] = useState<Threat[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  
  // Investigation state
  const [investigating, setInvestigating] = useState<string | null>(null)
  const [investigationResult, setInvestigationResult] = useState<any | null>(null)
  const [showInvestigateModal, setShowInvestigateModal] = useState(false)

  // Auth protection
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    if (!isAdmin) router.push('/admin/login')
    else setAuthorized(true)
  }, [router])

  // ---- LIVE LOG POLLING (real data) ----
  const fetchLiveLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/threats/logs')
      const data = await res.json()
      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs.join('\n'))
      } else {
        setLogs('Monitoring... No events yet. System logs will appear here as they are collected from auth.log and syslog.')
      }
    } catch (err) {
      console.error('Failed to poll logs:', err)
    }
  }, [])

  // ---- STATS POLLING (real data) ----
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/threats/stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to poll stats:', err)
    }
  }, [])

  useEffect(() => {
    if (!authorized) return
    fetchLiveLogs()
    fetchStats()
    const logInterval = setInterval(fetchLiveLogs, 3000)
    const statInterval = setInterval(fetchStats, 5000)
    return () => { clearInterval(logInterval); clearInterval(statInterval) }
  }, [authorized, fetchLiveLogs, fetchStats])

  // --- THREAT DETECTION ON LIVE LOGS ---
  const [detecting, setDetecting] = useState(false)
  const runDetection = async () => {
    setDetecting(true)
    try {
      const res = await fetch('/api/threats/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logs.split('\n'), useAI: false })
      })
      const data = await res.json()
      if (data.threats && data.threats.length > 0) {
        setThreats(data.threats)
        toast.warning(`${data.threats.length} Threat(s) Identified`, {
          description: 'Real threats detected from system logs and traffic patterns.',
        })
      } else {
        toast.success('No threats detected', {
          description: 'Current logs show no malicious patterns.',
        })
      }
    } catch (err) {
      toast.error('Threat analysis failed')
    } finally { setDetecting(false) }
  }

  // --- INVESTIGATE with AI ---
  const investigateThreat = async (threat: Threat) => {
    setInvestigating(threat.id)
    setShowInvestigateModal(true)
    setInvestigationResult(null)
    
    try {
      const res = await fetch('/api/threats/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatId: threat.id,
          threatDetails: threat,
          additionalContext: 'Performing deep forensic investigation on local system state.'
        })
      })
      const data = await res.json()
      setInvestigationResult(data.investigation)
    } catch (err) {
      toast.error('Investigation failed')
    } finally {
      setInvestigating(null)
    }
  }

  // --- BLOCK an IP ---
  const blockIP = async (ip: string) => {
    try {
      await fetch('/api/threats/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, reason: 'Blocked from dashboard', category: 'manual' })
      })
      toast.success(`Blocked IP: ${ip}`)
      setThreats(prev => prev.map(t =>
        t.sourceIp === ip ? { ...t, mitigationStatus: 'blocked' } : t
      ))
      fetchStats()
    } catch (err) {
      toast.error('Failed to block IP')
    }
  }

  if (!authorized) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>

  const uptime = stats ? `${Math.floor(stats.uptimeSeconds / 60)}m ${stats.uptimeSeconds % 60}s` : '—'

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <Toaster position="top-right" expand={true} richColors />
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Command Center</h1>
          <p className="text-sm text-gray-500">Real-Time Monitoring — auth.log • syslog • HTTP traffic • Pattern Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Engine Live</span>
          </div>
          <div className="text-[10px] font-mono text-gray-400">Uptime: {uptime}</div>
          <button onClick={runDetection} disabled={detecting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            {detecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Analyze Logs
          </button>
        </div>
      </div>

      {/* Stats Grid — Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Threats" value={stats?.totalThreats ?? 0} color="text-red-600" icon={AlertTriangle} />
        <StatCard title="Blocked IPs" value={stats?.blockedIPs ?? 0} color="text-indigo-600" icon={ShieldCheck} />
        <StatCard title="Requests Logged" value={stats?.totalRequests ?? 0} color="text-emerald-600" icon={Activity} />
        <StatCard title="Blocked Requests" value={stats?.blockedRequests ?? 0} color="text-purple-600" icon={Ban} />
      </div>

      {/* Threat category breakdown */}
      {stats?.threatsByCategory && Object.keys(stats.threatsByCategory).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {Object.entries(stats.threatsByCategory).map(([cat, count]) => (
            <div key={cat} className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{cat.replace(/_/g, ' ')}</div>
              <div className="text-lg font-bold text-gray-800">{count}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Logs Panel — REAL */}
        <div className="lg:col-span-1 bg-[#1a1a2e] rounded-2xl border border-[#2a2a45] shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-[#2a2a45] bg-[#1d1d35] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Real System Logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-emerald-400/80 animate-pulse">LIVE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-emerald-300/90 overflow-y-auto custom-scrollbar bg-black/20">
            {logs.split('\n').map((line, i) => (
              <div key={i} className={`mb-1 border-l-2 pl-2 py-0.5 hover:bg-white/5 transition-colors ${
                line.includes('THREAT') || line.includes('BLOCKED') ? 'border-red-500 text-red-400' :
                line.includes('AUTH_FAILURE') || line.includes('Failed') ? 'border-orange-500 text-orange-300' :
                line.includes('IP_BLOCKED') ? 'border-red-600 text-red-400 font-bold' :
                'border-emerald-500/20'
              }`}>
                <span className="text-emerald-500/50 mr-2 select-none">{logs.split('\n').length - i}</span>
                {line}
              </div>
            ))}
            <div className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
          </div>
          <div className="p-3 bg-[#1d1d35] border-t border-[#2a2a45] flex items-center justify-between text-[10px] text-gray-400">
            <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> Polling: 3s — Sources: auth.log, syslog, HTTP</div>
            <div>{stats?.activeLogs ?? 0} events</div>
          </div>
        </div>

        {/* Alerts Table Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top Attackers */}
          {stats?.topAttackerIPs && stats.topAttackerIPs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Skull className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-gray-900">Top Attacking IPs</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.topAttackerIPs.map(({ ip, count }) => (
                  <div key={ip} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                    <span className="text-xs font-mono font-bold text-red-700">{ip}</span>
                    <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-bold">{count} hits</span>
                    <button onClick={() => blockIP(ip)} className="text-[10px] font-bold text-red-600 hover:text-red-800 ml-1">Block</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg"><Shield className="w-5 h-5 text-indigo-600" /></div>
                <h2 className="text-lg font-bold text-gray-900">Detected Threats</h2>
              </div>
              <span className="text-xs text-gray-400">{threats.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Threat</th>
                    <th className="px-6 py-4">Source IP</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {threats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                          <Crosshair className="w-12 h-12 opacity-20" />
                          <p className="text-sm">Click &quot;Analyze Logs&quot; to scan for real threats.</p>
                          <p className="text-xs text-gray-300">The engine is monitoring auth.log, syslog, and web traffic in real-time.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    threats.slice(0, 20).map(t => (
                      <tr key={t.id} className="group hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            t.mitigationStatus === 'blocked' ? 'bg-red-100 text-red-700' :
                            t.mitigationStatus === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {t.mitigationStatus || 'detected'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-800 max-w-xs truncate">{t.description}</div>
                          <div className="text-[10px] text-gray-400">{t.type} — {new Date(t.timestamp).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{t.sourceIp || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            t.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            t.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {t.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => investigateThreat(t)}
                              disabled={investigating === t.id}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded flex items-center text-xs font-bold transition-colors"
                            >
                              {investigating === t.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <ShieldCheck className="w-3 h-3 mr-1" />}
                              Investigate
                            </button>
                            {t.sourceIp && t.mitigationStatus !== 'blocked' && (
                              <button 
                                onClick={() => blockIP(t.sourceIp!)}
                                className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded flex items-center text-xs font-bold transition-colors"
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- INVESTIGATION MODAL --- */}
      {showInvestigateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden shadow-indigo-500/20">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Elyaitra AI Investigation</h2>
              </div>
              <button 
                onClick={() => setShowInvestigateModal(false)} 
                className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto bg-white text-gray-800">
              {!investigationResult ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Shield className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800">Analyzing System Telemetry...</p>
                    <p className="text-sm text-gray-400">Consulting local intelligence engine & security logs</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-indigo-900 font-medium italic">"{investigationResult.summary}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Root Cause</div>
                      <div className="text-sm font-bold text-gray-800">{investigationResult.rootCause}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Attack Vector</div>
                      <div className="text-sm font-bold text-gray-800">{investigationResult.attackVector}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-gray-400">Detailed Timeline</div>
                    <div className="space-y-2">
                      {investigationResult.timeline.map((item: string, i: number) => (
                        <div key={i} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 mr-3 shrink-0"></div>
                          <div className="text-sm text-gray-600">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 text-indigo-600 mr-2" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Confidence: {investigationResult.confidence?.toUpperCase() || 'MEDIUM'}</span>
                    </div>
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${investigationResult.confidence === 'high' ? 'bg-green-500 w-full' : investigationResult.confidence === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowInvestigateModal(false)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg uppercase text-xs tracking-widest"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3a3a5c; border-radius: 4px; }
      `}</style>
    </div>
  )
}
