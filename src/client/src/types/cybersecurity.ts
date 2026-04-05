export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface Threat {
  id: string
  severity: Severity
  type: string
  description: string
  affectedSystem: string
  recommendedAction: string
  timestamp: string
}

export interface Investigation {
  summary: string
  rootCause: string
  attackVector: string
  affectedSystems: string[]
  timeline: string[]
  confidence: string
}

export interface ResponseAction {
  action: string
  target: string
  status: 'pending' | 'executed' | 'failed'
  executedAt: string
}

export interface DefenseRule {
  id: string
  rule: string
  rationale: string
}

export interface LogEntry {
  timestamp: string
  source: string
  message: string
  level: string
}
