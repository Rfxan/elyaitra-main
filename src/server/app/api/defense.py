from fastapi import APIRouter
from app.schemas.cybersecurity import DefenseEvolveRequest, DefenseData
from app.services.security_agent import SecurityAgent

router = APIRouter(prefix="/defense", tags=["Cybersecurity"])
agent = SecurityAgent()

@router.post("/evolve", response_model=DefenseData)
async def evolve_defense(req: DefenseEvolveRequest):
    try:
        return agent.evolve_defense(req.recentThreats, req.currentRules)
    except Exception as e:
        return DefenseData(
            newRules=[], 
            deprecatedRules=[], 
            rationale=f"Evolution failed: {str(e)}", 
            patternsSeen=[], 
            error=str(e)
        )
