from app.ai_engine.providers.factory import get_embedding_provider

def get_embeddings():
    """
    Centralized embedding provider that delegates work to the 
    configured LLM service (Ollama or Gemini).
    Prevents the backend from hanging due to local ML model loading.
    """
    provider = get_embedding_provider()
    print(f"🧠 Using Service-Based Embeddings via {type(provider).__name__}")
    return provider
