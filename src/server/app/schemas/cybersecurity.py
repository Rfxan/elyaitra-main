from pydantic import BaseModel
from typing import List, Optional

class Threat(BaseModel):
    id: str
    severity: str # 'critical' | 'high' | 'medium' | 'low'
    type: str
    description: str
    affectedSystem: str
    recommendedAction: str
    timestamp: str

class DetectionResponse(BaseModel):
    threats: List[Threat]
    error: Optional[str] = None

class Investigation(BaseModel):
    summary: str
    rootCause: str
    attackVector: str
    affectedSystems: List[str]
    timeline: List[str]
    confidence: str # 'high' | 'medium' | 'low'

class Thought(BaseModel):
    role: str # 'assistant' | 'tool'
    content: str

class InvestigationResponse(BaseModel):
    investigation: Investigation
    thoughts: List[Thought]
    error: Optional[str] = None

class ResponseAction(BaseModel):
    action: str
    target: str
    status: str # 'pending' | 'executed' | 'failed'
    executedAt: str

class ResponsePlan(BaseModel):
    responsePlan: List[ResponseAction]
    summary: str
    error: Optional[str] = None

class DefenseData(BaseModel):
    newRules: List[str]
    deprecatedRules: List[str]
    rationale: str
    patternsSeen: List[str]
    error: Optional[str] = None

class LogsRequest(BaseModel):
    logs: List[str]

class InvestigationRequest(BaseModel):
    threatId: str
    threatDetails: Threat

class ResponseRequest(BaseModel):
    threatId: str
    severity: str
    investigation: Investigation
    autoApprove: bool = False

class DefenseEvolveRequest(BaseModel):
    recentThreats: List[Threat]
    currentRules: List[str]

class BlockItem(BaseModel):
    id: str
    type: str # 'ip' | 'file' | 'endpoint'
    value: str
    reason: str
    blockedAt: str
    alertId: Optional[str] = None

class BlockRequest(BaseModel):
    type: str
    value: str
    reason: str
    alertId: Optional[str] = None

class UnblockRequest(BaseModel):
    id: str
