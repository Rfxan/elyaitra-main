from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.cybersecurity import (
    LogsRequest, 
    DetectionResponse, 
    InvestigationRequest, 
    InvestigationResponse, 
    ResponseRequest, 
    ResponsePlan,
    BlockRequest,
    BlockItem,
    UnblockRequest
)
from app.services.security_agent import SecurityAgent
from app.security.log_store import GLOBAL_LOG_STORE
from app.security.block_store import GLOBAL_BLOCK_STORE

router = APIRouter(prefix="/threats", tags=["Cybersecurity"])
agent = SecurityAgent()

@router.get("/logs")
async def get_captured_logs():
    return {"logs": GLOBAL_LOG_STORE.get_all()}

@router.get("/blocked", response_model=List[BlockItem])
async def get_blocked_threats():
    return GLOBAL_BLOCK_STORE.get_all()

@router.post("/block", response_model=BlockItem)
async def block_threat(req: BlockRequest):
    return GLOBAL_BLOCK_STORE.block(req.type, req.value, req.reason, req.alertId)

@router.post("/unblock")
async def unblock_threat(req: UnblockRequest):
    success = GLOBAL_BLOCK_STORE.unblock(req.id)
    if not success:
        raise HTTPException(status_code=404, detail="Block item not found")
    return {"success": True}

@router.post("/detect", response_model=DetectionResponse)
async def detect_threats(req: LogsRequest):
    try:
        threats = agent.detect_threats(req.logs)
        return DetectionResponse(threats=threats)
    except Exception as e:
        return DetectionResponse(threats=[], error=str(e))

@router.post("/investigate", response_model=InvestigationResponse)
async def investigate_threat(req: InvestigationRequest):
    try:
        result = agent.investigate_threat(req.threatDetails)
        return InvestigationResponse(**result)
    except Exception as e:
        return InvestigationResponse(
            investigation=None, 
            thoughts=[], 
            error=str(e)
        )

@router.post("/respond", response_model=ResponsePlan)
async def generate_response(req: ResponseRequest):
    try:
        plan = agent.generate_response_plan(req.threatId, req.investigation)
        return ResponsePlan(**plan)
    except Exception as e:
        return ResponsePlan(responsePlan=[], summary="", error=str(e))

@router.post("/stream")
async def stream_analysis(req: LogsRequest):
    # For now, simple mock stream (FastAPI StreamingResponse could be used for real LLM stream)
    # The frontend expects a raw text stream of analyst thoughts.
    from fastapi.responses import StreamingResponse
    import asyncio
    
    async def event_generator():
        messages = [
            "Initializing deep packet inspection...",
            "Scanning for known malicious signatures...",
            "Correlating login failures across distributed nodes...",
            "Anomalous pattern detected: 192.168.4.15 is targeting root credentials.",
            "Heuristic analysis suggests high confidence of brute-force attempt."
        ]
        for msg in messages:
            yield msg + " "
            await asyncio.sleep(0.5)
            
    return StreamingResponse(event_generator(), media_type="text/plain")
