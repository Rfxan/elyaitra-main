import requests
from typing import List, Optional
from app.ai_engine.providers.base import LLMProvider
from app.ai_engine import config

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1
        }
        
        try:
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Groq generation failed: {e}")
            raise e

    def embed(self, text: str) -> List[float]:
        # Groq doesn't provide embeddings yet. 
        # For a full RAG system, we'd fall back to Gemini or Ollama locally.
        # Since Aegis One primarily uses Inference for detection/investigation, 
        # this is acceptable for now.
        raise NotImplementedError("Groq does not support embeddings yet.")
