'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  Download,
  Settings2,
  Monitor,
  Wifi,
  Camera,
  Server,
  Eye,
  X,
  Shield,
  Ban,
  CheckCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react'
import { INVENTORY_ASSETS, INVENTORY_STATS, type InventoryAsset, type DeviceReview, type AssetType } from '@/lib/console-data'

// ---- Donut Chart ----
function DonutChart({ data, total, size = 100 }: { data: { color: string; value: number; label: string }[]; total: number; size?: number }) {
  const r = (size - 12) / 2, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const dash = (d.value / total) * circ, off = -offset; offset += dash
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={10} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={off} transform={`rotate(-90 ${cx} ${cy})`} className="transition-all duration-700" />
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#1a1a2e" fontSize="18" fontWeight="700">{total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#888" fontSize="9">total</text>
    </svg>
  )
}

function StatusDot({ color }: { color: string }) {
  return <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
}

function SeverityBadge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold" style={{ color, background: bg }}><StatusDot color={color} />{text}</span>
}

// ---- Dropdown ----
function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 transition-colors">
        {value || label} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[160px] py-1 max-h-60 overflow-y-auto">
          <button onClick={() => { onChange(''); setOpen(false) }} className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50">All</button>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false) }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 transition-colors ${value === o ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Modal ----
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

// ---- Column Config ----
const ALL_COLUMNS = ['Name', 'Asset Type', 'OS', 'Device Review', 'Agent Support', 'Missing Protection', 'Tags', 'IP Address']

const TABS = ['All assets', 'Endpoint', 'Cloud', 'Identity', 'Network discovery', 'Applications']
const TIME_RANGES = ['Last 1 hour', 'Last 4 hours', 'Last 24 hours', 'Last 7 days', 'Last 30 days']
const DEVICE_REVIEWS: DeviceReview[] = ['Not Reviewed', 'Under Analysis', 'Allowed', 'Not Trusted']
const ASSET_TYPES: AssetType[] = ['Camera', 'Windows workstation', 'Network Device', 'Windows Server']

const drConfig: Record<DeviceReview, { color: string; bg: string }> = {
  'Not Reviewed': { color: '#8b8fa3', bg: '#f0f1f3' },
  'Under Analysis': { color: '#3b82f6', bg: '#eff6ff' },
  'Allowed': { color: '#22c55e', bg: '#f0fdf4' },
  'Not Trusted': { color: '#ef4444', bg: '#fef2f2' },
}

const assetIcons: Record<string, React.ReactNode> = {
  'Camera': <Camera className="w-3.5 h-3.5 text-gray-500" />,
  'Windows workstation': <Monitor className="w-3.5 h-3.5 text-blue-500" />,
  'Network Device': <Wifi className="w-3.5 h-3.5 text-green-500" />,
  'Windows Server': <Server className="w-3.5 h-3.5 text-purple-500" />,
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('All assets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)
  const [timeRange, setTimeRange] = useState('Last 4 hours')
  const [deviceReviewFilter, setDeviceReviewFilter] = useState('')
  const [assetTypeFilter, setAssetTypeFilter] = useState('')
  const [agentFilter, setAgentFilter] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(ALL_COLUMNS))
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<InventoryAsset | null>(null)
  const [assets, setAssets] = useState<InventoryAsset[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showNotify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // ---- FETCH LIVE AUDIT DATA ----
  const fetchAudit = useCallback(async () => {
    try {
      const res = await fetch('/api/system/audit')
      const data = await res.json()
      
      // Map audit agents to InventoryAsset format
      const liveAssets: InventoryAsset[] = data.agents.map((a: any) => ({
        id: a.id,
        name: a.name,
        assetType: a.os.includes('Server') ? 'Windows Server' : 'Windows workstation', // Heuristic for UI
        os: a.os,
        deviceReview: a.risk === 'High' ? 'Under Analysis' : 'Allowed',
        agentSupport: 'Supported',
        missingProtection: a.risk === 'High' ? ['EPP'] : [],
        tags: ['Real-time', 'Active'],
        ipAddress: a.ip
      }))
      
      setAssets(liveAssets)
      
      // Construct stats compatible with existing UI
      const liveStats = {
        totalAssets: liveAssets.length,
        agentSupport: {
          supported: { count: liveAssets.length, pct: 100 },
          unknown: { count: 0, pct: 0 },
          unsupported: { count: 0, pct: 0 }
        },
        deviceReview: {
          notReviewed: { count: 0, pct: 0 },
          underAnalysis: { count: data.stats.totalVulnerabilities > 0 ? liveAssets.length : 0, pct: data.stats.totalVulnerabilities > 0 ? 100 : 0 },
          allowed: { count: data.stats.totalVulnerabilities === 0 ? liveAssets.length : 0, pct: data.stats.totalVulnerabilities === 0 ? 100 : 0 },
          notTrusted: { count: 0, pct: 0 }
        },
          osFamily: [
            { name: 'Windows', icon: '🪟', count: liveAssets.filter(a => a.os.includes('Windows')).length },
            { name: 'Linux', icon: '🐧', count: liveAssets.filter(a => a.os.includes('Linux')).length },
            { name: 'Mac', icon: '🍎', count: 0 }
          ],
          health: data.stats.systemHealth / 10 // Map 0-100 to 0-10 for UI
        }
        setStats(liveStats)
      } catch (err) {
        console.error('Failed to fetch audit:', err)
      } finally {
        setLoading(false)
      }
  }, [])

  useEffect(() => {
    fetchAudit()
    const interval = setInterval(fetchAudit, 10000)
    
    const fetchBlocked = async () => {
      try {
        const res = await fetch('/api/threats/blocked')
        const blockedItems = await res.json()
        if (Array.isArray(blockedItems)) {
          const blockedIps = new Set(blockedItems.filter(b => b.type === 'ip').map(b => b.value))
          const blockedNames = new Set(blockedItems.filter(b => b.type === 'endpoint').map(b => b.value))
          
          setAssets(prev => prev.map(a => {
            const isBlocked = blockedIps.has(a.ipAddress || '') || blockedNames.has(a.name)
            return isBlocked ? { ...a, blocked: true, deviceReview: 'Not Trusted' as DeviceReview } : a
          }))
        }
      } catch (err) { /* silent fail */ }
    }
    
    fetchBlocked()
    return () => clearInterval(interval)
  }, [fetchAudit])

  // Tab filtering
  const tabFilter = (a: InventoryAsset) => {
    if (activeTab === 'All assets') return true
    if (activeTab === 'Endpoint') return a.assetType === 'Windows workstation' || a.assetType === 'Windows Server'
    if (activeTab === 'Network discovery') return a.assetType === 'Network Device' || a.assetType === 'Camera'
    return true
  }

  // Full filtering
  const filteredAssets = assets
    .filter(tabFilter)
    .filter(a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(a => !deviceReviewFilter || a.deviceReview === deviceReviewFilter)
    .filter(a => !assetTypeFilter || a.assetType === assetTypeFilter)
    .filter(a => !agentFilter || a.agentSupport === agentFilter)

  // Sorting
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (!sortBy) return 0
    const av = (a as any)[sortBy] ?? ''
    const bv = (b as any)[sortBy] ?? ''
    const cmp = String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const toggleRow = (id: string) => { const n = new Set(selectedRows); n.has(id) ? n.delete(id) : n.add(id); setSelectedRows(n) }
  const toggleAll = () => { selectedRows.size === sortedAssets.length ? setSelectedRows(new Set()) : setSelectedRows(new Set(sortedAssets.map(a => a.id))) }

  // Export CSV
  const exportCSV = () => {
    const headers = ['Name', 'Asset Type', 'OS', 'Device Review', 'Agent Support', 'Missing Protection', 'Tags', 'IP Address']
    const rows = sortedAssets.map(a => [a.name, a.assetType, a.os, a.deviceReview, a.agentSupport, a.missingProtection.join(';'), a.tags.join(';'), a.ipAddress || ''])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'inventory_export.csv'; link.click()
    URL.revokeObjectURL(url)
    showNotify(`Exported ${sortedAssets.length} assets to CSV`)
  }

  // Block asset
  const blockAsset = async (asset: InventoryAsset) => {
    try {
      const res = await fetch('/api/threats/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'endpoint',
          value: asset.name,
          reason: 'Manual block from inventory',
        })
      })
      if (res.ok) {
        setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, blocked: true, deviceReview: 'Not Trusted' as DeviceReview } : a))
        showNotify(`Blocked asset: ${asset.name} (${asset.ipAddress || 'No IP'})`)
      }
    } catch (err) {
      showNotify('Failed to block asset on server', 'error')
    }
    setSelectedAsset(null)
  }

  // Approve asset
  const approveAsset = (asset: InventoryAsset) => {
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, deviceReview: 'Allowed' as DeviceReview } : a))
    showNotify(`Approved asset: ${asset.name}`)
    setSelectedAsset(null)
  }

  // Bulk actions
  const bulkBlock = async () => {
    const selected = assets.filter(a => selectedRows.has(a.id))
    for (const a of selected) {
      await blockAsset(a)
    }
    setSelectedRows(new Set())
  }

  const colKey = (col: string): string => {
    const map: Record<string, string> = { 'Name': 'name', 'Asset Type': 'assetType', 'OS': 'os', 'Device Review': 'deviceReview', 'Agent Support': 'agentSupport', 'IP Address': 'ipAddress' }
    return map[col] || ''
  }

  return (
    <div className="min-h-full" style={{ background: '#f4f5f7' }}>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-right ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {notification.msg}
        </div>
      )}

      {/* Page header */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
          <Dropdown label="Summary dashboard" options={['Overview', 'Security Posture', 'Compliance']} value="" onChange={() => {}} />
        </div>
        <div className="flex items-center gap-0 border-b" style={{ borderColor: '#e2e5ea' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="px-3 py-2 text-xs font-medium transition-colors relative" style={{ color: activeTab === tab ? '#4f46e5' : '#6b7280', borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent' }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 flex items-center gap-3 flex-wrap" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs font-medium text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
          <Filter className="w-3 h-3" />Load filter
        </button>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded border text-xs bg-white border-gray-200">
          <span className="text-gray-500">Asset Name</span><span className="text-gray-400">›</span><span className="text-gray-500">contains</span><span className="text-gray-400">›</span>
          <div className="flex items-center gap-1">
            <Search className="w-3 h-3 text-gray-400" />
            <input type="text" placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-xs bg-transparent outline-none text-gray-700 w-24" />
            {searchQuery && <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-gray-400 hover:text-gray-600" /></button>}
          </div>
        </div>
        <div className="flex-1" />
        <Dropdown label="Time Range" options={TIME_RANGES} value={timeRange} onChange={setTimeRange} />
        <Dropdown label="Asset Type" options={ASSET_TYPES} value={assetTypeFilter} onChange={setAssetTypeFilter} />
        <Dropdown label="Device Review" options={DEVICE_REVIEWS} value={deviceReviewFilter} onChange={setDeviceReviewFilter} />
        <Dropdown label="Agent Support" options={['Supported', 'Unknown', 'Unsupported']} value={agentFilter} onChange={setAgentFilter} />
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-purple-600 hover:bg-purple-50 transition-colors">
          <Eye className="w-3 h-3" />{showFilters ? 'Hide' : 'Show'} stats
        </button>
      </div>

      {/* Stats cards */}
      {showFilters && stats && (
        <div className="px-6 py-4 grid grid-cols-4 gap-4" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-2 font-bold uppercase tracking-tighter">System Health Index</div>
            <div className="flex items-end justify-between">
              <div>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mb-2 uppercase" style={{ background: '#4f46e5' }}>Elyaitra Core</span>
                <div className="text-3xl font-bold text-gray-900 font-mono tracking-tighter">{(stats?.health || 8.4).toFixed(1)}</div>
              </div>
              <div className="flex items-end gap-1"><div className="w-2 h-8 rounded-sm bg-indigo-600" /><div className="w-2 h-5 rounded-sm bg-indigo-300" /><div className="w-2 h-2 rounded-sm bg-indigo-100" /></div>
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-2 font-bold uppercase tracking-tighter">Agent Support</div>
            <div className="space-y-1.5 font-bold tracking-tighter">
              {[{ label: 'Supported', ...stats.agentSupport.supported, color: '#22c55e' }, { label: 'Unknown', ...stats.agentSupport.unknown, color: '#eab308' }, { label: 'Unsupported', ...stats.agentSupport.unsupported, color: '#ef4444' }].map(s => (
                <div key={s.label} className="flex items-center gap-2"><StatusDot color={s.color} /><span className="text-[11px] text-gray-600">{s.label}</span><span className="text-[11px] font-semibold text-gray-900 ml-auto">{s.count.toLocaleString()}</span><span className="text-[10px] text-gray-400">({s.pct}%)</span></div>
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-2 font-bold uppercase tracking-tighter">Device Review</div>
            <div className="flex items-center gap-4">
              <DonutChart size={70} total={stats.totalAssets} data={[
                { value: stats.deviceReview.notReviewed.count, color: '#8b8fa3', label: 'Not Reviewed' },
                { value: stats.deviceReview.underAnalysis.count, color: '#3b82f6', label: 'Under Analysis' },
                { value: stats.deviceReview.allowed.count, color: '#22c55e', label: 'Allowed' },
                { value: stats.deviceReview.notTrusted.count, color: '#ef4444', label: 'Not Trusted' },
              ]} />
              <div className="space-y-1 font-bold tracking-tighter">
                {[{ l: 'Not Reviewed', c: '#8b8fa3', ...stats.deviceReview.notReviewed }, { l: 'Under Analysis', c: '#3b82f6', ...stats.deviceReview.underAnalysis }, { l: 'Allowed', c: '#22c55e', ...stats.deviceReview.allowed }, { l: 'Not Trusted', c: '#ef4444', ...stats.deviceReview.notTrusted }].map(d => (
                  <div key={d.l} className="flex items-center gap-1.5"><StatusDot color={d.c} /><span className="text-[11px] text-gray-600">{d.l}</span><span className="text-[11px] font-semibold ml-1">{d.count.toLocaleString()}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4" style={{ borderColor: '#e2e5ea' }}>
            <div className="text-xs font-medium text-gray-500 mb-2 font-bold uppercase tracking-tighter">OS Family</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-bold tracking-tighter">
              {stats.osFamily.map((os: any) => (<div key={os.name} className="flex items-center gap-1.5"><span className="text-sm">{os.icon}</span><div><div className="text-[10px] text-gray-500 leading-none">{os.name}</div><div className="text-xs font-bold text-gray-900">{os.count.toLocaleString()}</div></div></div>))}
            </div>
          </div>
        </div>
      )}

      {/* Table controls */}
      <div className="px-6 py-2 flex items-center justify-between" style={{ background: '#fff', borderBottom: '1px solid #e2e5ea' }}>
        <div className="flex items-center gap-3">
          {selectedRows.size > 0 && (
            <button onClick={bulkBlock} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
              <Ban className="w-3 h-3" />Block Selected ({selectedRows.size})
            </button>
          )}
          <Dropdown label="Group by: Select" options={['Asset Type', 'OS', 'Device Review', 'Agent Support']} value="" onChange={() => {}} />
          <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter uppercase px-2 py-0.5 bg-gray-100 rounded-full">LIVE</span>
          <span className="text-xs text-gray-500">▼ {sortedAssets.length} Items</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowColumnModal(true)} className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium text-gray-600 bg-white border-gray-200 hover:bg-gray-50 transition-colors">
            <Settings2 className="w-3 h-3" />Columns
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-medium text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
            <Download className="w-3 h-3" />Export
          </button>
        </div>
      </div>

      {/* Column Modal */}
      <Modal open={showColumnModal} onClose={() => setShowColumnModal(false)} title="Configure Columns">
        <div className="space-y-2">
          {ALL_COLUMNS.map(col => (
            <label key={col} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={visibleColumns.has(col)} onChange={() => { const n = new Set(visibleColumns); n.has(col) ? n.delete(col) : n.add(col); setVisibleColumns(n) }} className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600" />
              <span className="text-xs text-gray-700">{col}</span>
            </label>
          ))}
        </div>
      </Modal>

      {/* Asset Detail Panel */}
      <Modal open={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={selectedAsset?.name || ''}>
        {selectedAsset && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Asset Type</div><div className="text-sm text-gray-800">{selectedAsset.assetType}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">OS</div><div className="text-sm text-gray-800">{selectedAsset.os}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">IP Address</div><div className="text-sm font-mono text-gray-800">{selectedAsset.ipAddress || 'N/A'}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Device Review</div><SeverityBadge text={selectedAsset.deviceReview} color={drConfig[selectedAsset.deviceReview].color} bg={drConfig[selectedAsset.deviceReview].bg} /></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Agent Support</div><div className="text-sm text-gray-800">{selectedAsset.agentSupport}</div></div>
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Status</div><div className="text-sm">{selectedAsset.blocked ? <span className="text-red-600 font-semibold">🚫 Blocked</span> : <span className="text-green-600">✓ Active</span>}</div></div>
            </div>
            {selectedAsset.tags.length > 0 && (
              <div><div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Tags</div><div className="flex flex-wrap gap-1">{selectedAsset.tags.map((t,i) => <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">{t}</span>)}</div></div>
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              {!selectedAsset.blocked && (
                <button onClick={() => blockAsset(selectedAsset)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"><Ban className="w-3.5 h-3.5" />Block Asset</button>
              )}
              <button onClick={() => approveAsset(selectedAsset)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"><Shield className="w-3.5 h-3.5" />Approve Asset</button>
              <button onClick={() => { showNotify(`Scan initiated for ${selectedAsset.name}`); setSelectedAsset(null) }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"><FileText className="w-3.5 h-3.5" />Run Scan</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Data table */}
      <div className="px-6" style={{ background: '#fff' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e2e5ea' }}>
                <th className="py-2 px-2 w-8"><input type="checkbox" checked={selectedRows.size === sortedAssets.length && sortedAssets.length > 0} onChange={toggleAll} className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 cursor-pointer" /></th>
                {visibleColumns.has('Name') && <th onClick={() => toggleSort('name')} className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700">Name {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}</th>}
                {visibleColumns.has('Asset Type') && <th onClick={() => toggleSort('assetType')} className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700">Asset Type {sortBy === 'assetType' && (sortDir === 'asc' ? '↑' : '↓')}</th>}
                {visibleColumns.has('OS') && <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">OS</th>}
                {visibleColumns.has('Device Review') && <th onClick={() => toggleSort('deviceReview')} className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700">Device Review {sortBy === 'deviceReview' && (sortDir === 'asc' ? '↑' : '↓')}</th>}
                {visibleColumns.has('Agent Support') && <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Agent Support</th>}
                {visibleColumns.has('Missing Protection') && <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Missing Protection</th>}
                {visibleColumns.has('Tags') && <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tags</th>}
                {visibleColumns.has('IP Address') && <th className="py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">IP Address</th>}
              </tr>
            </thead>
            <tbody>
              {sortedAssets.map(asset => (
                <tr key={asset.id} className={`border-b hover:bg-blue-50/40 transition-colors cursor-pointer ${asset.blocked ? 'bg-red-50/30' : ''}`} style={{ borderColor: '#f0f1f3' }} onClick={() => setSelectedAsset(asset)}>
                  <td className="py-2.5 px-2" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedRows.has(asset.id)} onChange={() => toggleRow(asset.id)} className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 cursor-pointer" /></td>
                  {visibleColumns.has('Name') && <td className="py-2.5 px-2"><div className="flex items-center gap-2">{assetIcons[asset.assetType] || <Monitor className="w-3.5 h-3.5 text-gray-400" />}<span className="text-xs font-medium text-blue-600 hover:underline">{asset.name}</span>{asset.blocked && <Ban className="w-3 h-3 text-red-500" />}</div></td>}
                  {visibleColumns.has('Asset Type') && <td className="py-2.5 px-2 text-xs text-gray-600">{asset.assetType}</td>}
                  {visibleColumns.has('OS') && <td className="py-2.5 px-2 text-xs text-gray-500">{asset.os}</td>}
                  {visibleColumns.has('Device Review') && <td className="py-2.5 px-2"><SeverityBadge text={asset.deviceReview} color={drConfig[asset.deviceReview].color} bg={drConfig[asset.deviceReview].bg} /></td>}
                  {visibleColumns.has('Agent Support') && <td className="py-2.5 px-2 text-xs text-gray-600">{asset.agentSupport === 'Supported' ? <span className="text-green-600">✓ </span> : asset.agentSupport === 'Unsupported' ? <span className="text-red-500">✗ </span> : <span className="text-yellow-500">? </span>}{asset.agentSupport}</td>}
                  {visibleColumns.has('Missing Protection') && <td className="py-2.5 px-2">{asset.missingProtection.length > 0 ? asset.missingProtection.map(p => <span key={p} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mr-1" style={{ background: '#ef4444' }}>{p}</span>) : <span className="text-xs text-gray-400">—</span>}</td>}
                  {visibleColumns.has('Tags') && <td className="py-2.5 px-2">{asset.tags.length > 0 ? asset.tags.map((t,i) => <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 mr-1">{t}</span>) : <span className="text-xs text-gray-400">—</span>}</td>}
                  {visibleColumns.has('IP Address') && <td className="py-2.5 px-2 text-xs font-mono text-gray-500">{asset.ipAddress || '—'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="py-3 flex items-center justify-between text-xs text-gray-500 border-t" style={{ borderColor: '#e2e5ea' }}>
          <span>Showing {sortedAssets.length} of {(stats?.totalAssets || 0).toLocaleString()} items</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Previous</button>
            <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold">1</span>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
