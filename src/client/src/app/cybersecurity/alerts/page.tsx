'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Settings2,
  Eye,
  X,
  Zap,
  Ban,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Terminal,
  Play,
  XCircle,
  ShieldCheck,
  FileWarning,
} from 'lucide-react'
import { ALERTS, ALERT_STATS, ATTACK_SCENARIOS, type Alert, type AlertSeverity, type MitigationStatus, type BlockedThreat } from '@/lib/console-data'

// ---- Donut Chart ----
function DonutChart({ data, total, size = 90 }: { data: { color: string; value: number; label: string }[]; total: number; size?: number }) {
  const r = (size - 14) / 2, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r
  let off = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => { const dash = (total > 0 ? d.value / total : 0) * circ, o = -off; off += dash; return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={10} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={o} transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-700" /> })}
      <text x={cx} y={cy + 1} textAnchor="middle" fill="#1a1a2e" fontSize="18" fontWeight="700">{total}</text>
    </svg>
  )
}

function PieChart({ data, total, size = 90 }: { data: { color: string; value: number; label: string }[]; total: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = (size - 4) / 2
  let startAngle = -90
  const paths = data.map(d => {
    const angle = (total > 0 ? d.value / total : 0) * 360, endAngle = startAngle + angle, lg = angle > 180 ? 1 : 0
    const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180), y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
    const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180), y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z`
    startAngle = endAngle; return { path, color: d.color }
  })
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{paths.map((p, i) => <path key={i} d={p.path} fill={p.color} />)}</svg>
}

function StatusDot({ color }: { color: string }) { return <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} /> }

function AlertStatusBars({ n, p, r }: { n: number; p: number; r: number }) {
  const max = Math.max(n, p, r, 1)
  return (
    <div className="flex items-end gap-2 h-14">
      <div className="w-5 rounded-t transition-all duration-500" style={{ height: `${(n / max) * 48}px`, background: '#ef4444', minHeight: n > 0 ? 4 : 0 }} />
      <div className="w-5 rounded-t transition-all duration-500" style={{ height: `${(p / max) * 48}px`, background: '#eab308', minHeight: p > 0 ? 4 : 0 }} />
      <div className="w-5 rounded-t transition-all duration-500" style={{ height: `${(r / max) * 48}px`, background: '#22c55e', minHeight: r > 0 ? 4 : 0 }} />
    </div>
  )
}

// ---- Dropdown ----
function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 transition-colors">
        {value || label} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[160px] py-1 max-h-60 overflow-y-auto">
          <button onClick={() => { onChange(''); setOpen(false) }} className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">All</button>
          {options.map(o => (<button key={o} onClick={() => { onChange(o); setOpen(false) }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 ${value === o ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}>{o}</button>))}
        </div>
      )}
    </div>
  )
}

// ---- Modal ----
function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-lg'} w-full max-h-[85vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

const TABS = ['All', 'Endpoint', 'Custom alerts', 'Identity', 'Cloud', 'Partner alerts']
const sevConfig: Record<AlertSeverity, { color: string; bg: string }> = {
  'Critical': { color: '#dc2626', bg: '#fef2f2' },
  'High': { color: '#ea580c', bg: '#fff7ed' },
  'Medium': { color: '#ca8a04', bg: '#fefce8' },
  'Low': { color: '#2563eb', bg: '#eff6ff' },
  'Info': { color: '#6b7280', bg: '#f3f4f6' },
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)
  const [severityFilter, setSeverityFilter] = useState('')
  const [mitigationFilter, setMitigationFilter] = useState('')
  const [timeRange, setTimeRange] = useState('Last 7 days')
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [blockedThreats, setBlockedThreats] = useState<BlockedThreat[]>([])
  const [showBlockedPanel, setShowBlockedPanel] = useState(false)

  // Threat Detection
  const [showDetector, setShowDetector] = useState(false)
  const [logInput, setLogInput] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detectedThreats, setDetectedThreats] = useState<Alert[]>([])
  const [detectionError, setDetectionError] = useState('')
  const [streamText, setStreamText] = useState('')

  // Investigation
  const [investigating, setInvestigating] = useState(false)
  const [investigation, setInvestigation] = useState<{ summary: string; rootCause: string; attackVector: string; affectedSystems: string[]; confidence: string } | null>(null)
  const [showColumnModal, setShowColumnModal] = useState(false)

  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const showNotify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000)
  }, [])

  // Fetch blocked threats on mount
  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const res = await fetch('/api/threats/blocked')
        const data = await res.json()
        if (Array.isArray(data)) setBlockedThreats(data)
      } catch (err) {
        console.error('Failed to fetch blocked threats:', err)
      }
    }
    fetchBlocked()
  }, [])

  // Filtering
  const filteredAlerts = alerts
    .filter(a => !searchQuery || a.alertName.toLowerCase().includes(searchQuery.toLowerCase()) || a.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(a => !severityFilter || a.severity === severityFilter)
    .filter(a => !mitigationFilter || a.mitigationStatus === mitigationFilter)

  const toggleRow = (id: string) => { const n = new Set(selectedRows); n.has(id) ? n.delete(id) : n.add(id); setSelectedRows(n) }
  const toggleAll = () => { selectedRows.size === filteredAlerts.length ? setSelectedRows(new Set()) : setSelectedRows(new Set(filteredAlerts.map(a => a.id))) }

  // Export
  const exportCSV = () => {
    const headers = ['Date/Time', 'Alert Name', 'Severity', 'Mitigation', 'Target Asset', 'File Name', 'Source IP']
    const rows = filteredAlerts.map(a => [a.dateTime, a.alertName, a.severity, a.mitigationStatus, a.targetAsset, a.fileName, a.sourceIp || ''])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'alerts_export.csv'; link.click(); URL.revokeObjectURL(url)
    showNotify(`Exported ${filteredAlerts.length} alerts to CSV`)
  }

  // ---- THREAT DETECTION (calls Ollama via Next.js API) ----
  const runDetection = async () => {
    if (!logInput.trim()) return
    setDetecting(true); setDetectionError(''); setDetectedThreats([]); setStreamText('')
    try {
      // Stream analysis
      const streamPromise = fetch('/api/threats/stream', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logInput.split('\n') })
      }).then(async res => {
        if (!res.body) return
        const reader = res.body.getReader(), decoder = new TextDecoder()
        while (true) { const { done, value } = await reader.read(); if (done) break; setStreamText(prev => prev + decoder.decode(value, { stream: true })) }
      }).catch(() => {})

      // Detection
      const res = await fetch('/api/threats/detect', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: logInput.split('\n') })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      await streamPromise

      const newAlerts: Alert[] = (data.threats || []).map((t: { id: string; severity: string; type: string; description: string; affectedSystem: string; timestamp: string }, i: number) => ({
        id: t.id || `detected-${Date.now()}-${i}`,
        dateTime: new Date().toLocaleString(),
        alertName: `${t.type}: ${t.description}`.slice(0, 60),
        severity: (t.severity.charAt(0).toUpperCase() + t.severity.slice(1)) as AlertSeverity,
        autoInvestigation: 'Investigate' as const,
        mitigationStatus: 'Uninvestigated' as MitigationStatus,
        targetAsset: t.affectedSystem,
        fileName: t.type,
        sourceIp: '',
        details: t.description,
      }))
      setDetectedThreats(newAlerts)
      if (newAlerts.length === 0) setDetectionError('No threats detected in the provided logs.')
    } catch (err: unknown) {
      setDetectionError(err instanceof Error ? err.message : 'Detection failed. Make sure Ollama is running.')
    } finally { setDetecting(false) }
  }

  const addDetectedToAlerts = () => {
    setAlerts(prev => [...detectedThreats, ...prev])
    showNotify(`Added ${detectedThreats.length} threats to alerts`)
    setDetectedThreats([]); setShowDetector(false); setLogInput(''); setStreamText('')
  }

  // ---- BLOCK THREAT ----
  const blockThreat = async (alert: Alert, type: 'ip' | 'file') => {
    const value = type === 'ip' ? (alert.sourceIp || 'Unknown IP') : alert.fileName
    try {
      const res = await fetch('/api/threats/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, reason: alert.alertName, alertId: alert.id })
      })
      const blocked = await res.json()
      setBlockedThreats(prev => [blocked, ...prev])
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, mitigationStatus: 'Mitigated' as MitigationStatus, blocked: true } : a))
      showNotify(`Blocked ${type}: ${value}`)
    } catch (err) {
      showNotify('Failed to block threat on server', 'error')
    }
    setSelectedAlert(null)
  }

  // ---- UNBLOCK THREAT ----
  const unblockThreat = async (blockId: string, value: string) => {
    try {
      const res = await fetch('/api/threats/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blockId })
      })
      if (res.ok) {
        setBlockedThreats(prev => prev.filter(b => b.id !== blockId))
        showNotify(`Unblocked ${value}`)
      }
    } catch (err) {
      showNotify('Failed to unblock threat', 'error')
    }
  }

  // ---- BULK BLOCK ----
  const bulkBlock = async () => {
    const selected = alerts.filter(a => selectedRows.has(a.id))
    for (const a of selected) {
      await blockThreat(a, 'file')
    }
    setSelectedRows(new Set())
  }

  // ---- INVESTIGATE ----
  const investigateAlert = async (alert: Alert) => {
    setInvestigating(true); setInvestigation(null)
    try {
      const res = await fetch('/api/threats/investigate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatId: alert.id, threatDetails: { id: alert.id, severity: alert.severity.toLowerCase(), type: alert.fileName, description: alert.alertName, affectedSystem: alert.targetAsset, recommendedAction: 'Investigate', timestamp: alert.dateTime } })
      })
      const data = await res.json()
      if (data.investigation) setInvestigation(data.investigation)
      else throw new Error('No investigation data returned')
    } catch (err: unknown) {
      setInvestigation({ summary: 'Investigation could not complete. Ensure Ollama is running.', rootCause: err instanceof Error ? err.message : 'Unknown', attackVector: 'N/A', affectedSystems: [alert.targetAsset], confidence: 'low' })
    } finally { setInvestigating(false) }
  }

  const stats = ALERT_STATS

  return (
    <div className="min-h-full" style={{ background: '#f4f5f7' }}>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}{notification.msg}
        </div>
      )}

      {/* Page header */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Alerts</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDetector(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
              <Zap className="w-3.5 h-3.5" />Scan Logs for Threats
            </button>
            <button onClick={() => setShowBlockedPanel(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium text-red-600 bg-red-50 border-red-200 hover:bg-red-100 transition-colors">
              <Ban className="w-3.5 h-3.5" />Blocked ({blockedThreats.length})
            </button>
            <div className="flex items-center gap-0">
              <button className="text-xs px-2.5 py-1.5 rounded-l border font-medium text-blue-600 bg-blue-50 border-blue-200">Policy</button>
              <button className="text-xs px-2.5 py-1.5 border-t border-b font-medium text-gray-500 bg-white border-gray-200 hover:bg-gray-50">Blacklist</button>
              <button className="text-xs px-2.5 py-1.5 rounded-r border font-medium text-gray-500 bg-white border-gray-200 hover:bg-gray-50">Exclusions</button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0 border-b" style={{ borderColor: '#e2e5ea' }}>
          {TABS.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-2 text-xs font-medium transition-colors" style={{ color: activeTab === tab ? '#4f46e5' : '#6b7280', borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent' }}>{tab}</button>))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 flex items-center gap-3 flex-wrap" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium text-blue-600 bg-blue-50 border-blue-200"><Filter className="w-3 h-3" />Load filter</button>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs bg-white border-gray-200">
          <span className="text-gray-500">Alert Name</span><span className="text-gray-400">›</span><span className="text-gray-500">contains</span><span className="text-gray-400">›</span>
          <div className="flex items-center gap-1"><Search className="w-3 h-3 text-gray-400" /><input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-xs bg-transparent outline-none text-gray-700 w-24" />{searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-gray-400" /></button>}</div>
        </div>
        <div className="flex-1" />
        <Dropdown label="Time Range" options={['Last 1 hour', 'Last 7 days', 'Last 30 days', 'Last 90 days']} value={timeRange} onChange={setTimeRange} />
        <Dropdown label="Severity" options={['Critical', 'High', 'Medium', 'Low', 'Info']} value={severityFilter} onChange={setSeverityFilter} />
        <Dropdown label="Mitigation" options={['Mitigated', 'Uninvestigated', 'Benign']} value={mitigationFilter} onChange={setMitigationFilter} />
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-purple-600 hover:bg-purple-50"><Eye className="w-3 h-3" />{showFilters ? 'Hide' : 'Show'} stats</button>
      </div>

      {/* Stats */}
      {showFilters && (
        <div className="px-6 py-4 grid grid-cols-4 gap-4" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-3">Alert Status</div>
            <div className="flex items-end gap-4">
              <AlertStatusBars n={stats.status.new.count} p={stats.status.inProgress.count} r={stats.status.resolved.count} />
              <div className="space-y-1.5 flex-1">
                {[{ l: 'New', c: '#ef4444', ...stats.status.new }, { l: 'In progress', c: '#eab308', ...stats.status.inProgress }, { l: 'Resolved', c: '#22c55e', ...stats.status.resolved }].map(s => (
                  <div key={s.l} className="flex items-center gap-1.5"><StatusDot color={s.c} /><span className="text-[11px] text-gray-600">{s.l}</span><span className="text-[11px] font-semibold text-gray-900 ml-auto">{s.count}</span><span className="text-[10px] text-gray-400">({s.pct}%)</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-3">Alert Severity</div>
            <div className="flex items-center gap-3">
              <DonutChart size={80} total={stats.totalAlerts} data={[
                { value: stats.severity.critical.count, color: '#dc2626', label: 'Critical' },
                { value: stats.severity.high.count, color: '#ea580c', label: 'High' },
                { value: stats.severity.medium.count, color: '#ca8a04', label: 'Medium' },
                { value: stats.severity.low.count, color: '#2563eb', label: 'Low' },
              ]} />
              <div className="space-y-1 flex-1">
                {[{ l: 'Critical', c: '#dc2626', ...stats.severity.critical }, { l: 'High', c: '#ea580c', ...stats.severity.high }, { l: 'Medium', c: '#ca8a04', ...stats.severity.medium }, { l: 'Low', c: '#2563eb', ...stats.severity.low }].map(s => (
                  <div key={s.l} className="flex items-center gap-1.5"><StatusDot color={s.c} /><span className="text-[11px] text-gray-600">{s.l}</span><span className="text-[11px] font-semibold ml-auto">{s.count}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-3">Mitigation Status</div>
            <div className="flex items-center justify-around h-16">
              {[{ l: 'Mitigated', c: '#22c55e', v: stats.mitigation.mitigated }, { l: 'Uninvestigated', c: '#8b8fa3', v: stats.mitigation.uninvestigated }, { l: 'Benign', c: '#a855f7', v: stats.mitigation.benign }].map((d, i) => (
                <React.Fragment key={d.l}>{i > 0 && <div className="w-px h-10 bg-gray-200" />}<div className="text-center"><div className="flex items-center gap-1 justify-center mb-1"><StatusDot color={d.c} /><span className="text-[10px] text-gray-500">{d.l}</span></div><div className="text-2xl font-bold text-gray-900">{d.v}</div></div></React.Fragment>
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-3">Analyst Verdict</div>
            <div className="flex items-center gap-3">
              <PieChart size={70} total={stats.analystVerdict.truePositive.count + stats.analystVerdict.falsePositive.count + stats.analystVerdict.undefined.count} data={[
                { value: stats.analystVerdict.truePositive.count, color: '#dc2626', label: 'TP' },
                { value: stats.analystVerdict.falsePositive.count, color: '#22c55e', label: 'FP' },
                { value: stats.analystVerdict.undefined.count, color: '#3b82f6', label: 'Undef' },
              ]} />
              <div className="space-y-1.5 flex-1">
                {[{ l: 'True positive', c: '#dc2626', v: stats.analystVerdict.truePositive.count }, { l: 'False positive', c: '#22c55e', v: stats.analystVerdict.falsePositive.count }, { l: 'Undefined', c: '#3b82f6', v: stats.analystVerdict.undefined.count }].map(d => (
                  <div key={d.l} className="flex items-center gap-1.5"><StatusDot color={d.c} /><span className="text-[11px] text-gray-600">{d.l}</span><span className="text-[11px] font-semibold ml-auto">{d.v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table controls */}
      <div className="px-6 py-2 flex items-center justify-between" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
        <div className="flex items-center gap-3">
          {selectedRows.size > 0 && (
            <>
              <button onClick={bulkBlock} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"><Ban className="w-3 h-3" />Block Selected ({selectedRows.size})</button>
              <button onClick={() => { setAlerts(prev => prev.map(a => selectedRows.has(a.id) ? { ...a, mitigationStatus: 'Mitigated' as MitigationStatus } : a)); showNotify(`Mitigated ${selectedRows.size} alerts`); setSelectedRows(new Set()) }} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-green-600 bg-green-50 border border-green-200 hover:bg-green-100"><ShieldCheck className="w-3 h-3" />Mark Mitigated</button>
            </>
          )}
          <Dropdown label="Group by File Hash (SHA1)" options={['File Hash (SHA1)', 'Severity', 'Target Asset', 'Alert Name']} value="" onChange={() => {}} />
          <span className="text-xs text-gray-500">▼ {filteredAlerts.length} of {stats.totalAlerts} Items</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowColumnModal(true)} className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50"><Settings2 className="w-3 h-3" />Columns</button>
          <button onClick={exportCSV} className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"><Download className="w-3 h-3" />Export</button>
        </div>
      </div>
      <Modal open={showColumnModal} onClose={() => setShowColumnModal(false)} title="Columns"><p className="text-xs text-gray-500">All columns visible</p></Modal>

      {/* Data table */}
      <div className="px-6" style={{ background: '#fff' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b" style={{ borderColor: '#e2e5ea' }}>
              <th className="py-2 px-2 w-8"><input type="checkbox" checked={selectedRows.size === filteredAlerts.length && filteredAlerts.length > 0} onChange={toggleAll} className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 cursor-pointer" /></th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Date / Time</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Alert Name</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Severity</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Auto-Investigation</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Mitigation</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Target Asset</th>
              <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">File Name</th>
            </tr></thead>
            <tbody>
              {filteredAlerts.map(alert => {
                const sc = sevConfig[alert.severity]
                return (
                  <tr key={alert.id} className={`border-b hover:bg-blue-50/40 transition-colors cursor-pointer ${alert.blocked ? 'bg-red-50/30' : ''}`} style={{ borderColor: '#f0f1f3' }} onClick={() => { setSelectedAlert(alert); setInvestigation(null) }}>
                    <td className="py-2.5 px-2" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedRows.has(alert.id)} onChange={() => toggleRow(alert.id)} className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 cursor-pointer" /></td>
                    <td className="py-2.5 px-2 text-xs text-gray-500 whitespace-nowrap">{alert.dateTime}</td>
                    <td className="py-2.5 px-2"><span className="text-xs font-medium text-blue-600 hover:underline">{alert.alertName}</span>{alert.blocked && <Ban className="w-3 h-3 text-red-500 inline ml-1" />}</td>
                    <td className="py-2.5 px-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold" style={{ color: sc.color, background: sc.bg }}><StatusDot color={sc.color} />{alert.severity}</span></td>
                    <td className="py-2.5 px-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-blue-600 bg-blue-50"><Zap className="w-3 h-3" />{alert.autoInvestigation}</span></td>
                    <td className="py-2.5 px-2"><span className={`text-xs font-medium ${alert.mitigationStatus === 'Mitigated' ? 'text-green-600' : alert.mitigationStatus === 'Uninvestigated' ? 'text-gray-500' : 'text-purple-600'}`}>{alert.mitigationStatus === 'Mitigated' && '✓ '}{alert.mitigationStatus}</span></td>
                    <td className="py-2.5 px-2"><div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center"><span className="text-[7px] text-white font-bold">S1</span></div><span className="text-xs text-gray-700">{alert.targetAsset}</span></div></td>
                    <td className="py-2.5 px-2 text-xs text-gray-600 font-mono">{alert.fileName}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="py-3 flex items-center justify-between text-xs text-gray-500 border-t" style={{ borderColor: '#e2e5ea' }}>
          <span>Showing {filteredAlerts.length} of {stats.totalAlerts} items</span>
          <div className="flex items-center gap-1"><button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Previous</button><span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold">1</span><button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button><button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Next</button></div>
        </div>
      </div>

      {/* ========= ALERT DETAIL MODAL ========= */}
      <Modal open={!!selectedAlert} onClose={() => setSelectedAlert(null)} title={selectedAlert?.alertName || ''} wide>
        {selectedAlert && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Severity</div><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold" style={{ color: sevConfig[selectedAlert.severity].color, background: sevConfig[selectedAlert.severity].bg }}><StatusDot color={sevConfig[selectedAlert.severity].color} />{selectedAlert.severity}</span></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Mitigation</div><div className="text-sm">{selectedAlert.mitigationStatus === 'Mitigated' ? <span className="text-green-600 font-semibold">✓ Mitigated</span> : <span className="text-yellow-600 font-semibold">⚠ {selectedAlert.mitigationStatus}</span>}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Target Asset</div><div className="text-sm text-gray-800">{selectedAlert.targetAsset}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Source IP</div><div className="text-sm font-mono text-gray-800">{selectedAlert.sourceIp || 'N/A'}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">File Name</div><div className="text-sm font-mono text-gray-800">{selectedAlert.fileName}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Date / Time</div><div className="text-sm text-gray-800">{selectedAlert.dateTime}</div></div>
            </div>
            {selectedAlert.details && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Details</div><p className="text-xs text-gray-700 leading-relaxed">{selectedAlert.details}</p></div>
            )}

            {/* Investigation results */}
            {investigation && (
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 space-y-2">
                <div className="text-[10px] text-indigo-600 uppercase font-bold">AI Investigation Results</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-[10px] text-gray-500 font-semibold">Summary</div><p className="text-xs text-gray-700">{investigation.summary}</p></div>
                  <div><div className="text-[10px] text-gray-500 font-semibold">Root Cause</div><p className="text-xs text-gray-700">{investigation.rootCause}</p></div>
                  <div><div className="text-[10px] text-gray-500 font-semibold">Attack Vector</div><p className="text-xs text-gray-700">{investigation.attackVector}</p></div>
                  <div><div className="text-[10px] text-gray-500 font-semibold">Confidence</div><span className={`text-xs font-bold uppercase ${investigation.confidence === 'high' ? 'text-green-600' : investigation.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>{investigation.confidence}</span></div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {selectedAlert.sourceIp && !selectedAlert.blocked && (
                <button onClick={() => blockThreat(selectedAlert, 'ip')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"><Ban className="w-3.5 h-3.5" />Block IP ({selectedAlert.sourceIp})</button>
              )}
              {!selectedAlert.blocked && (
                <button onClick={() => blockThreat(selectedAlert, 'file')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors"><FileWarning className="w-3.5 h-3.5" />Quarantine File</button>
              )}
              <button onClick={() => investigateAlert(selectedAlert)} disabled={investigating} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {investigating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}{investigating ? 'Investigating...' : 'AI Investigate'}
              </button>
              {!selectedAlert.blocked && (
                <button onClick={() => { setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, mitigationStatus: 'Mitigated' as MitigationStatus } : a)); showNotify('Marked as mitigated'); setSelectedAlert(null) }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 transition-colors"><ShieldCheck className="w-3.5 h-3.5" />Mark Mitigated</button>
              )}
              {selectedAlert.blocked && <span className="flex items-center gap-1 text-xs font-semibold text-red-600 px-3 py-2"><Ban className="w-3.5 h-3.5" />Threat Blocked</span>}
            </div>
          </div>
        )}
      </Modal>

      {/* ========= THREAT DETECTION MODAL ========= */}
      <Modal open={showDetector} onClose={() => setShowDetector(false)} title="🔍 AI Threat Scanner — Powered by Ollama" wide>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-gray-700">Paste system logs to analyze:</div>
              <div className="flex gap-1">
                {Object.keys(ATTACK_SCENARIOS).map(name => (
                  <button key={name} onClick={() => setLogInput(ATTACK_SCENARIOS[name])} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">{name}</button>
                ))}
              </div>
            </div>
            <textarea value={logInput} onChange={e => setLogInput(e.target.value)} placeholder="Paste raw system/security logs here..." className="w-full h-32 p-3 rounded-lg border border-gray-200 font-mono text-xs text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400" />
          </div>
          <button onClick={runDetection} disabled={detecting || !logInput.trim()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors w-full justify-center">
            {detecting ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing with AI...</> : <><Play className="w-4 h-4" />Run Threat Detection</>}
          </button>

          {/* Stream output */}
          {streamText && (
            <div className="p-3 bg-gray-900 rounded-lg">
              <div className="flex items-center gap-1.5 mb-2"><Terminal className="w-3 h-3 text-green-400" /><span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live Analysis</span></div>
              <p className="text-xs text-green-300/80 font-mono leading-relaxed">{streamText}{detecting && <span className="inline-block w-1.5 h-3 bg-green-400 ml-0.5 animate-pulse" />}</p>
            </div>
          )}

          {detectionError && <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{detectionError}</div>}

          {/* Detected threats */}
          {detectedThreats.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-800">Detected {detectedThreats.length} threat(s)</div>
                <button onClick={addDetectedToAlerts} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"><CheckCircle className="w-3.5 h-3.5" />Add All to Alerts</button>
              </div>
              {detectedThreats.map(t => (
                <div key={t.id} className="p-3 rounded-lg border border-gray-200 bg-white flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: sevConfig[t.severity].color, background: sevConfig[t.severity].bg }}>{t.severity}</span>
                      <span className="text-xs font-medium text-gray-800">{t.alertName}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">Target: {t.targetAsset}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* ========= BLOCKED THREATS PANEL ========= */}
      <Modal open={showBlockedPanel} onClose={() => setShowBlockedPanel(false)} title="🚫 Blocked Threats" wide>
        {blockedThreats.length === 0 ? (
          <div className="text-center py-8"><Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-500">No threats blocked yet.</p><p className="text-xs text-gray-400 mt-1">Block IPs or quarantine files from the alert detail panel.</p></div>
        ) : (
          <div className="space-y-2">
            {blockedThreats.map(bt => (
              <div key={bt.id} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bt.type === 'ip' ? 'bg-red-100' : bt.type === 'file' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                    {bt.type === 'ip' ? <Ban className="w-4 h-4 text-red-600" /> : bt.type === 'file' ? <FileWarning className="w-4 h-4 text-orange-600" /> : <XCircle className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{bt.value}</div>
                    <div className="text-[10px] text-gray-500">{(bt.type || 'UNKNOWN').toUpperCase()} • {bt.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500">{bt.blockedAt}</div>
                  <button onClick={() => unblockThreat(bt.id, bt.value)} className="text-[10px] text-blue-600 hover:underline mt-0.5">Unblock</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
