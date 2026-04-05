'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCw,
  GitBranch,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowNode {
  id: string;
  type: "start" | "process" | "decision" | "end";
  label: string;
  children?: string[];
  position?: { x: number; y: number };
}

const mockFlowchart: FlowNode[] = [
  { id: "1", type: "start", label: "Start Learning", children: ["2"] },
  { id: "2", type: "process", label: "Read Notes", children: ["3"] },
  { id: "3", type: "decision", label: "Understand?", children: ["4", "5"] },
  { id: "4", type: "process", label: "Ask AI Tutor", children: ["3"] },
  { id: "5", type: "process", label: "Practice with Flashcards", children: ["6"] },
  { id: "6", type: "decision", label: "Mastered?", children: ["7", "5"] },
  { id: "7", type: "end", label: "Complete!" },
];

const nodeStyles = {
  start: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  process: "bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(7,186,255,0.2)]",
  decision: "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] rotate-45",
  end: "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]",
};

const nodeShapes = {
  start: "rounded-full",
  process: "rounded-2xl",
  decision: "rounded-xl",
  end: "rounded-full",
};

export default function FlowchartCanvas() {
  const [zoom, setZoom] = useState(100);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleReset = () => setZoom(100);

  const handleExport = () => {
    alert("Flowchart exported as PNG!");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.08] bg-[#12121a]/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <GitBranch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Visual Flowchart</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Generated Map</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-black/40 border-white/10 text-gray-400 font-mono">
            {zoom}%
          </Badge>
          <div className="flex items-center bg-[#12121a] border border-white/[0.08] rounded-xl overflow-hidden">
            <Button variant="ghost" size="icon" className="rounded-none h-10 w-10 hover:bg-white/5 border-r border-white/5" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-none h-10 w-10 hover:bg-white/5" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-white/[0.08] bg-[#12121a] hover:bg-white/5" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="rounded-xl border-white/[0.08] bg-[#12121a] hover:bg-white/5 gap-2 px-4 h-10" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Map
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-12 bg-[radial-gradient(circle_at_center,_rgba(7,186,255,0.03)_0%,_transparent_70%)] relative">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }} />

        <div
          className="min-h-full flex flex-col items-center gap-6 transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Flowchart Nodes */}
          {mockFlowchart.map((node) => (
            <div key={node.id} className="flex flex-col items-center relative">
              {/* Node */}
              <button
                onClick={() => setSelectedNode(node.id)}
                className={cn(
                  "relative flex items-center justify-center border-2 transition-all duration-300 group",
                  nodeShapes[node.type],
                  nodeStyles[node.type],
                  selectedNode === node.id ? "ring-4 ring-primary/20 scale-110" : "hover:scale-105",
                  node.type === "decision" ? "w-32 h-32" : "px-8 py-4 min-w-[180px]"
                )}
              >
                <div
                  className={cn(
                    "text-sm font-bold text-center tracking-tight px-2",
                    node.type === "decision" && "-rotate-45"
                  )}
                >
                  {node.label}
                </div>
                
                {/* Selection Indicator */}
                {selectedNode === node.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" />
                )}
              </button>

              {/* Connector */}
              {node.children && node.children.length > 0 && (
                <div className="flex flex-col items-center mt-6 mb-2">
                  {node.type === "decision" ? (
                    <div className="flex items-center gap-16">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">No</span>
                        <div className="w-0.5 h-8 bg-gradient-to-b from-rose-500/50 to-transparent" />
                        <ArrowDown className="w-5 h-5 text-rose-500/50 -mt-1" />
                      </div>
                      <div className="flex items-center">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mr-2 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Yes</span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                        <ArrowRight className="w-5 h-5 text-emerald-500/50 -ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-12 bg-gradient-to-b from-white/20 to-primary/40" />
                      <ArrowDown className="w-5 h-5 text-primary/50 -mt-1" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 border-t border-white/[0.08] bg-[#12121a]/50">
        <div className="flex items-center justify-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Start / End</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded bg-primary shadow-[0_0_10px_rgba(7,186,255,0.5)]" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Process Node</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded bg-amber-500 rotate-45 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Decision Point</span>
          </div>
        </div>
      </div>
    </div>
  );
}
