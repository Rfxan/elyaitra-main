from app.ai_engine.providers.base import LLMProvider

class MockProvider(LLMProvider):
    """Mock LLM provider for demo purposes when no API keys are available."""

    def __init__(self):
        self.model_name = "mock-llm"

    def generate(self, prompt: str) -> str:
        """Return a mock response for demo purposes."""
        if "threat" in prompt.lower() or "attack" in prompt.lower():
            return """Based on the security analysis, I've identified potential threats in the system logs. The investigation reveals:

1. **Suspicious Login Attempts**: Multiple failed authentication attempts from IP 192.168.1.100
2. **Unusual Network Traffic**: High volume of outbound connections to unknown domains
3. **System Anomalies**: Elevated CPU usage and memory consumption

**Recommended Actions:**
- Block IP 192.168.1.100 temporarily
- Review firewall rules for suspicious domains
- Monitor system resources closely

This appears to be a coordinated attack attempt. Further investigation recommended."""
        elif "explain" in prompt.lower() or "chemistry" in prompt.lower():
            return """Let me explain this chemistry concept:

**Electrolysis** is a process that uses electric current to drive a non-spontaneous chemical reaction. Here's how it works:

1. **Electrodes**: Two electrodes (cathode and anode) are placed in an electrolyte solution
2. **Current Flow**: When electricity is applied, ions move toward the electrodes
3. **Reduction/Oxidation**: Reduction occurs at the cathode, oxidation at the anode

**Faraday's First Law**: The mass of substance produced is directly proportional to the quantity of electricity passed through the electrolyte.

This principle is fundamental to many industrial processes like aluminum production and electroplating."""
        else:
            return f"""I understand you're asking about: "{prompt[:50]}..."

This is a demo response from the Elyaitra AI system. The full AI capabilities require API key configuration (Groq, Gemini, or Ollama). 

For a complete evaluation, please configure the LLM_PROVIDER and corresponding API keys in your .env file.

Available providers:
- Groq (recommended for speed)
- Google Gemini (free tier available)
- Ollama (local, requires Ollama installation)

The system architecture includes:
- Real-time threat detection
- Autonomous investigation engine
- Adaptive defense evolution
- Multi-turn AI reasoning"""

    def generate_with_tools(self, prompt: str, tools: list) -> str:
        """Mock tool usage for demo."""
        return self.generate(prompt)

    def embed(self, texts: list) -> list:
        """Return mock embeddings."""
        return [[0.1] * 384 for _ in texts]  # Mock 384-dimensional embeddings