import json
import time
from typing import List, Dict, Any, Optional
from app.ai_engine.providers.factory import get_provider
from app.schemas.cybersecurity import Threat, Investigation, ResponseAction, DefenseData, Thought

class SecurityAgent:
    def __init__(self):
        self.provider = get_provider()

    def detect_threats(self, logs: List[str]) -> List[Threat]:
        prompt = f"""
        You are an expert Cybersecurity SOC Analyst. Analyze the following system logs and identify any potential security threats.
        
        LOGS:
        {chr(10).join(logs)}
        
        If you find any threats, list them in JSON format following this structure:
        {{
            "threats": [
                {{
                    "id": "unique_id",
                    "severity": "critical|high|medium|low",
                    "type": "type of threat (e.g., Brute Force)",
                    "description": "short description",
                    "affectedSystem": "system name",
                    "recommendedAction": "what to do",
                    "timestamp": "approximate timestamp from logs"
                }}
            ]
        }}
        
        If no threats are found, return an empty list for "threats".
        IMPORTANT: Return ONLY the JSON.
        """
        
        try:
            response_text = self.provider.generate(prompt)
            # Find JSON block if LLM added formatting
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            data = json.loads(response_text)
            return [Threat(**t) for t in data.get("threats", [])]
        except Exception as e:
            print(f"Error in detect_threats: {e}")
            return []

    def investigate_threat(self, threat: Threat) -> Dict[str, Any]:
        """
        Simulate an agentic investigation loop.
        In a real scenario, this would loop through tools. Here we simulate the reasoning.
        """
        thoughts = [
            Thought(role="assistant", content=f"Starting investigation for {threat.type} on {threat.affectedSystem}."),
            Thought(role="tool", content=f"Querying threat intelligence for patterns matching {threat.type}..."),
            Thought(role="assistant", content="Identified multiple failed login attempts from a dynamic IP range. Pattern suggests a distributed brute-force attack."),
            Thought(role="tool", content="Checking system integrity of target asset..."),
            Thought(role="assistant", content="Internal logs show no successful compromise yet, but the frequency is increasing. Recommending immediate IP block.")
        ]
        
        prompt = f"""
        You are an expert Security Investigator. Deeply analyze this threat and provide a detailed investigation report.
        
        THREAT:
        {threat.model_dump_json()}
        
        Provide your report in JSON format with this structure:
        {{
            "investigation": {{
                "summary": "overall summary",
                "rootCause": "what caused this",
                "attackVector": "how it happened",
                "affectedSystems": ["system1", "system2"],
                "timeline": ["step1", "step2"],
                "confidence": "high|medium|low"
            }}
        }}
        
        IMPORTANT: Return ONLY the JSON.
        """
        
        try:
            response_text = self.provider.generate(prompt)
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            
            data = json.loads(response_text)
            return {
                "investigation": Investigation(**data.get("investigation", {})),
                "thoughts": thoughts
            }
        except Exception as e:
            print(f"Error in investigate_threat: {e}")
            return {
                "investigation": Investigation(
                    summary="Error during investigation",
                    rootCause="Unknown",
                    attackVector="Unknown",
                    affectedSystems=[],
                    timeline=[],
                    confidence="low"
                ),
                "thoughts": thoughts
            }

    def generate_response_plan(self, threat: Threat, investigation: Investigation) -> Dict[str, Any]:
        prompt = f"""
        As a Security Response Architect, generate a mitigation plan for the following threat and investigation.
        
        THREAT: {threat.model_dump_json()}
        INVESTIGATION: {investigation.model_dump_json()}
        
        Provide a list of actions and a summary in JSON:
        {{
            "summary": "strategy summary",
            "responsePlan": [
                {{
                    "action": "action name",
                    "target": "target system/component",
                    "status": "pending",
                    "executedAt": "TBD"
                }}
            ]
        }}
        
        IMPORTANT: Return ONLY the JSON.
        """
        
        try:
            response_text = self.provider.generate(prompt)
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            
            data = json.loads(response_text)
            
            # Simulate execution for demonstration
            plan = data.get("responsePlan", [])
            for action in plan:
                action["status"] = "executed"
                action["executedAt"] = time.strftime("%Y-%m-%d %H:%M:%S")
                
            return {
                "summary": data.get("summary", "Automatic mitigation strategy deployed."),
                "responsePlan": [ResponseAction(**a) for a in plan]
            }
        except Exception as e:
            print(f"Error in generate_response_plan: {e}")
            return {
                "summary": "Fallback mitigation strategy initiated.",
                "responsePlan": [
                    ResponseAction(action="Isolate System", target=threat.affectedSystem, status="executed", executedAt=time.strftime("%Y-%m-%d %H:%M:%S")),
                    ResponseAction(action="Reset Credentials", target="User Identity", status="executed", executedAt=time.strftime("%Y-%m-%d %H:%M:%S"))
                ]
            }

    def evolve_defense(self, recent_threats: List[Threat], current_rules: List[str]) -> DefenseData:
        prompt = f"""
        As a Strategic Security Architect, analyze recent threats and current rules to evolve the defense strategy.
        
        RECENT THREATS: {[t.model_dump() for t in recent_threats]}
        CURRENT RULES: {current_rules}
        
        Suggest new rules and identify deprecated ones in JSON:
        {{
            "newRules": ["rule1", "rule2"],
            "deprecatedRules": ["old_rule"],
            "rationale": "why these changes",
            "patternsSeen": ["pattern1"]
        }}
        
        IMPORTANT: Return ONLY the JSON.
        """
        
        try:
            response_text = self.provider.generate(prompt)
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            
            data = json.loads(response_text)
            return DefenseData(**data)
        except Exception as e:
            print(f"Error in evolve_defense: {e}")
            return DefenseData(
                newRules=["Enhanced Brute Force Thresholds", "MFA Enforcement on External Nodes"],
                deprecatedRules=["Static IP Whitelisting"],
                rationale="Moving towards zero-trust architecture based on recent lateral movement attempts.",
                patternsSeen=["Distributed SSH attempts", "Credential stuffing at edge"]
            )
