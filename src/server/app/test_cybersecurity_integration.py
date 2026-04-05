import httpx
import pytest
import time

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_detect_threats():
    async with httpx.AsyncClient() as client:
        # Before we start, let's trigger a request to populate logs
        await client.get(f"{BASE_URL}/health")
        
        # Test logs endpoint
        res = await client.get(f"{BASE_URL}/api/threats/logs")
        assert res.status_code == 200
        logs = res.json().get("logs", [])
        assert len(logs) > 0
        print(f"Captured logs: {logs}")
        
        # Test detect endpoint
        res = await client.post(f"{BASE_URL}/api/threats/detect", json={"logs": logs})
        assert res.status_code == 200
        data = res.json()
        assert "threats" in data
        print(f"Detected threats: {data.get('threats')}")

@pytest.mark.asyncio
async def test_investigate_threat():
    async with httpx.AsyncClient() as client:
        mock_threat = {
            "id": "test-threat-1",
            "severity": "high",
            "type": "Brute Force",
            "description": "Multiple SSH failures",
            "affectedSystem": "AuthServer-01",
            "recommendedAction": "Block IP",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        res = await client.post(f"{BASE_URL}/api/threats/investigate", json={
            "threatId": mock_threat["id"],
            "threatDetails": mock_threat
        })
        assert res.status_code == 200
        data = res.json()
        assert "investigation" in data
        assert "thoughts" in data
        print(f"Investigation: {data.get('investigation')}")

@pytest.mark.asyncio
async def test_evolve_defense():
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{BASE_URL}/api/defense/evolve", json={
            "recentThreats": [],
            "currentRules": ["Rule 1"]
        })
        assert res.status_code == 200
        data = res.json()
        assert "newRules" in data
        assert "deprecatedRules" in data
        print(f"Evolved defense: {data}")

if __name__ == "__main__":
    import asyncio
    import sys
    
    # Simple manual run
    async def run_all():
        try:
            await test_detect_threats()
            await test_investigate_threat()
            await test_evolve_defense()
            print("✅ ALL CYBERSECURITY TESTS PASSED")
        except Exception as e:
            print(f"❌ TEST FAILED: {e}")
            sys.exit(1)
            
    asyncio.run(run_all())
